import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Inject } from '@nestjs/common';
import { JobQueueService as IJobQueueService } from '../jobs/job-queue.interface';
import { VoteStatus, VoteAudience } from '@prisma/client';
import { CreateVoteDto } from './dto/create-vote.dto';

export interface VoteResult {
  vote: any;
  options: Array<{
    id: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  totalVotes: number;
  totalEligible: number; // Total eligible voters based on audience filter
  participation: {
    voted: number;
    eligible: number;
    percentage: number;
  };
  participationRate: number; // Participation rate (also available in participation.percentage)
}

export interface ParticipationResult {
  voted: Array<{ userId: string }>;
  notVoted: Array<{ userId: string }>;
  totalEligible: number;
  participationRate: number;
}

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    @Inject('JobQueueService') private jobQueue: IJobQueueService,
  ) {
    // Register job handler for vote reminders
    this.jobQueue.process('vote-reminder', async (job) => {
      await this.sendVoteReminder(job.data.voteId);
    });
  }

  async create(projectId: string, userId: string, dto: CreateVoteDto) {
    // Verify user is committee or admin
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can create votes');
    }

    const opensAt = new Date(dto.opensAt);
    const closesAt = new Date(dto.closesAt);

    if (opensAt >= closesAt) {
      throw new BadRequestException('opensAt must be before closesAt');
    }

    if (dto.options.length < 2) {
      throw new BadRequestException('At least 2 options are required');
    }

    const vote = await this.prisma.vote.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        audienceFilter: dto.audienceFilter,
        opensAt,
        closesAt,
        status: VoteStatus.DRAFT,
        createdByUserId: userId,
        options: {
          create: dto.options.map((opt, index) => ({
            label: opt.label,
            sortOrder: opt.sortOrder ?? index,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    // Schedule reminder job (24h before close) if there's enough time
    // Only schedule if closesAt - now >= 24h, and ensure job is not in the past
    const now = Date.now();
    const timeUntilClose = closesAt.getTime() - now;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeUntilClose >= twentyFourHours) {
      const reminderTime = new Date(closesAt.getTime() - twentyFourHours);
      const delay = Math.max(0, reminderTime.getTime() - now);

      // Only schedule if delay is positive (not in the past)
      if (delay > 0) {
        await this.jobQueue.add(
          'vote-reminder',
          { voteId: vote.id, projectId },
          { delay, attempts: 3 },
        );
      }
    }

    await this.auditService.log({
      actorUserId: userId,
      projectId,
      actionKey: 'votes.created',
      targetType: 'Vote',
      targetId: vote.id,
      metadata: { title: vote.title, closesAt: vote.closesAt },
    });

    return vote;
  }

  async close(voteId: string, userId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: vote.projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can close votes');
    }

    const updated = await this.prisma.vote.update({
      where: { id: voteId },
      data: { status: VoteStatus.CLOSED },
    });

    await this.auditService.log({
      actorUserId: userId,
      projectId: vote.projectId,
      actionKey: 'votes.closed',
      targetType: 'Vote',
      targetId: voteId,
      metadata: { title: vote.title },
    });

    return updated;
  }

  async findAll(projectId: string, userId: string) {
    return this.prisma.vote.findMany({
      where: { projectId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            ballots: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(voteId: string, userId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Check if user has voted
    const userBallot = await this.prisma.voteBallot.findFirst({
      where: {
        voteId,
        voterUserId: userId,
      },
      include: {
        option: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });

    return {
      ...vote,
      userVoted: !!userBallot,
      userVote: userBallot
        ? {
            optionId: userBallot.optionId,
            optionLabel: userBallot.option.label,
            votedAt: userBallot.votedAt,
          }
        : null,
    };
  }

  async vote(voteId: string, optionId: string, userId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: true,
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Check if vote is open
    if (vote.status !== VoteStatus.OPEN) {
      throw new BadRequestException('Vote is not open');
    }

    const now = new Date();

    // Enforce time conditions: now >= opensAt AND now < closesAt (strictly less)
    if (now < vote.opensAt) {
      throw new BadRequestException('Vote has not opened yet');
    }

    if (now >= vote.closesAt) {
      throw new BadRequestException('Vote deadline has passed');
    }

    // Check if option belongs to vote
    const option = vote.options.find((opt) => opt.id === optionId);
    if (!option) {
      throw new BadRequestException('Invalid vote option');
    }

    // Check if user already voted (idempotent: return existing if already voted)
    const existing = await this.prisma.voteBallot.findFirst({
      where: {
        voteId,
        voterUserId: userId,
      },
      include: {
        option: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });

    if (existing) {
      // Idempotent: return existing ballot without emitting duplicate audit event
      return {
        ...existing,
        message: 'You have already voted',
      };
    }

    const ballot = await this.prisma.voteBallot.create({
      data: {
        projectId: vote.projectId,
        voteId,
        voterUserId: userId,
        optionId,
      },
      include: {
        option: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });

    // Only emit audit event for new votes (not idempotent returns)
    await this.auditService.log({
      actorUserId: userId,
      projectId: vote.projectId,
      actionKey: 'votes.voted',
      targetType: 'VoteBallot',
      targetId: ballot.id,
      metadata: { voteId, optionId, optionLabel: option.label },
    });

    return ballot;
  }

  async getResults(voteId: string, userId: string): Promise<VoteResult> {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
        ballots: true,
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Verify access (committee or admin)
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: vote.projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can view results');
    }

    const totalVotes = vote.ballots.length;
    const optionCounts = new Map<string, number>();

    vote.ballots.forEach((ballot) => {
      optionCounts.set(ballot.optionId, (optionCounts.get(ballot.optionId) || 0) + 1);
    });

    const options = vote.options.map((option) => {
      const count = optionCounts.get(option.id) || 0;
      return {
        id: option.id,
        label: option.label,
        count,
        percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100 * 100) / 100 : 0,
      };
    });

    // Calculate participation based on audience filter
    const eligibleCount = await this.getEligibleVoterCount(vote.projectId, vote.audienceFilter);

    // Standardize results payload: include totalEligible + participationRate
    const participationRate = eligibleCount > 0 ? Math.round((totalVotes / eligibleCount) * 100 * 100) / 100 : 0;

    return {
      vote: {
        id: vote.id,
        title: vote.title,
        status: vote.status,
        closesAt: vote.closesAt,
      },
      options,
      totalVotes,
      totalEligible: eligibleCount,
      participation: {
        voted: totalVotes,
        eligible: eligibleCount,
        percentage: participationRate,
      },
      participationRate, // Also include at top level for convenience
    };
  }

  async getParticipation(voteId: string, userId: string): Promise<ParticipationResult> {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Verify access (committee or admin only)
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: vote.projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can view participation details');
    }

    // Get all eligible voters (based on audience filter)
    const eligibleVoters = await this.getEligibleVoters(vote.projectId, vote.audienceFilter);
    const eligibleUserIds = eligibleVoters.map((v) => v.userId);

    // Get all voters who voted
    const ballots = await this.prisma.voteBallot.findMany({
      where: { voteId },
      select: { voterUserId: true },
    });
    const votedUserIds = new Set(ballots.map((b) => b.voterUserId));

    // Split into voted/not voted (return only user IDs per spec)
    const voted = eligibleVoters
      .filter((v) => votedUserIds.has(v.userId))
      .map((v) => ({ userId: v.userId }));
    const notVoted = eligibleVoters
      .filter((v) => !votedUserIds.has(v.userId))
      .map((v) => ({ userId: v.userId }));

    return {
      voted,
      notVoted,
      totalEligible: eligibleUserIds.length,
      participationRate: eligibleUserIds.length > 0 ? Math.round((voted.length / eligibleUserIds.length) * 100 * 100) / 100 : 0,
    };
  }

  async getMyVotes(projectId: string, userId: string) {
    const votes = await this.prisma.vote.findMany({
      where: { projectId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
        ballots: {
          where: { voterUserId: userId },
          select: {
            optionId: true,
            votedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return votes.map((vote) => {
      const now = new Date();
      // Display logic: show as open if status is OPEN and within time window (strictly less for closesAt)
      const isOpen = vote.status === VoteStatus.OPEN && now >= vote.opensAt && now < vote.closesAt;
      const isPast = vote.status === VoteStatus.CLOSED || now >= vote.closesAt;

      return {
        ...vote,
        isOpen,
        isPast,
        userVoted: vote.ballots.length > 0,
        userVote: vote.ballots[0] || null,
      };
    });
  }

  private async getEligibleVoterCount(projectId: string, audienceFilter: VoteAudience): Promise<number> {
    if (audienceFilter === VoteAudience.COMMITTEE_ONLY) {
      return this.prisma.projectMembership.count({
        where: {
          projectId,
          role: {
            name: 'committee',
          },
        },
      });
    }

    if (audienceFilter === VoteAudience.UNSIGNED_RESIDENTS) {
      // TODO: Implement UNSIGNED_RESIDENTS properly based on signed document assignments
      // For now, this filter is disabled and treated as ALL_RESIDENTS
      // Feature flag: UNSIGNED_RESIDENTS_VOTING_ENABLED (not yet implemented)
      // When implemented, should filter residents who haven't signed required documents
      // (e.g., documents with docType = PERSONAL_CONTRACT and status = SIGNED)
      console.warn('UNSIGNED_RESIDENTS filter not yet implemented, treating as ALL_RESIDENTS');
      return this.prisma.projectMembership.count({
        where: {
          projectId,
          role: {
            name: 'resident',
          },
        },
      });
    }

    // ALL_RESIDENTS
    return this.prisma.projectMembership.count({
      where: {
        projectId,
        role: {
          name: 'resident',
        },
      },
    });
  }

  private async getEligibleVoters(projectId: string, audienceFilter: VoteAudience): Promise<Array<{ userId: string }>> {
    if (audienceFilter === VoteAudience.COMMITTEE_ONLY) {
      const memberships = await this.prisma.projectMembership.findMany({
        where: {
          projectId,
          role: {
            name: 'committee',
          },
        },
        select: { userId: true },
      });
      return memberships.map((m) => ({ userId: m.userId }));
    }

    if (audienceFilter === VoteAudience.UNSIGNED_RESIDENTS) {
      // TODO: Implement UNSIGNED_RESIDENTS properly based on signed document assignments
      // For now, this filter is disabled and treated as ALL_RESIDENTS
      // Feature flag: UNSIGNED_RESIDENTS_VOTING_ENABLED (not yet implemented)
      // When implemented, should filter residents who haven't signed required documents
      // (e.g., documents with docType = PERSONAL_CONTRACT and status = SIGNED)
      console.warn('UNSIGNED_RESIDENTS filter not yet implemented, treating as ALL_RESIDENTS');
      const memberships = await this.prisma.projectMembership.findMany({
        where: {
          projectId,
          role: {
            name: 'resident',
          },
        },
        select: { userId: true },
      });
      return memberships.map((m) => ({ userId: m.userId }));
    }

    // ALL_RESIDENTS
    const memberships = await this.prisma.projectMembership.findMany({
      where: {
        projectId,
        role: {
          name: 'resident',
        },
      },
      select: { userId: true },
    });
    return memberships.map((m) => ({ userId: m.userId }));
  }

  private async sendVoteReminder(voteId: string): Promise<void> {
    // TODO: Implement reminder sending (email/push notification)
    // For now, just log
    console.log(`Sending vote reminder for vote ${voteId}`);
    // In production, this would:
    // 1. Get vote details
    // 2. Get eligible voters who haven't voted
    // 3. Send reminder messages via messaging service
  }
}
