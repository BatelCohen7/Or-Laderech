import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { MessageAudience } from '@prisma/client';
import { Inject } from '@nestjs/common';
import { JobQueueService as IJobQueueService } from '../jobs/job-queue.interface';

export interface CreateMessageDto {
  title: string;
  body: string;
  audienceFilter: MessageAudience;
  scheduledAt?: Date;
}

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    @Inject('JobQueueService') private jobQueue: IJobQueueService,
  ) {
    // Register job handler for scheduled messages
    this.jobQueue.process('send-scheduled-message', async (job) => {
      await this.sendScheduledMessage(job.data.messageId);
    });
  }

  async create(projectId: string, userId: string, dto: CreateMessageDto) {
    // Verify user is committee or admin
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can create messages');
    }

    const message = await this.prisma.message.create({
      data: {
        projectId,
        title: dto.title,
        body: dto.body,
        audienceFilter: dto.audienceFilter,
        scheduledAt: dto.scheduledAt || null,
        createdByUserId: userId,
        sentAt: dto.scheduledAt ? null : new Date(), // Send immediately if not scheduled
      },
    });

    // If scheduled, add to job queue
    if (dto.scheduledAt && dto.scheduledAt > new Date()) {
      const delay = dto.scheduledAt.getTime() - Date.now();
      await this.jobQueue.add('send-scheduled-message', { messageId: message.id }, { delay });
    }

    return message;
  }

  async findAll(projectId: string, userId: string) {
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this project');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        projectId,
        // Filter by audience and sent status
        OR: [
          { sentAt: { not: null } }, // Only show sent messages
          { createdByUserId: userId }, // Creator can see unsent
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by audience for residents
    if (membership.role.name === 'resident') {
      return messages.filter((msg) => {
        if (msg.audienceFilter === 'COMMITTEE_ONLY') return false;
        if (msg.audienceFilter === 'UNSIGNED_RESIDENTS') {
          // Check if user has unsigned documents
          // Simplified - would need to check document_assignments
          return true; // For now, show to all residents
        }
        return true;
      });
    }

    return messages;
  }

  async findOne(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: message.projectId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    return message;
  }

  private async sendScheduledMessage(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.sentAt) {
      return; // Already sent or doesn't exist
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { sentAt: new Date() },
    });
  }
}
