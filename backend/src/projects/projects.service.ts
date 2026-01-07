import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        createdById: userId,
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
    });
  }

  async findAll(userId: string, isAdminRoot: boolean) {
    if (isAdminRoot) {
      return this.prisma.project.findMany({
        include: {
          _count: {
            select: {
              memberships: true,
              apartments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // User sees only projects they're members of
    return this.prisma.project.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            memberships: true,
            apartments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, isAdminRoot: boolean) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            memberships: true,
            apartments: true,
            documents: true,
            votes: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    // Check access
    if (!isAdminRoot) {
      const membership = await this.prisma.projectMembership.findFirst({
        where: {
          projectId: id,
          userId,
        },
      });

      if (!membership) {
        throw new ForbiddenException(`Access denied to project ${id}`);
      }
    }

    return project;
  }

  async update(id: string, userId: string, isAdminRoot: boolean, dto: UpdateProjectDto) {
    // Verify access
    await this.findOne(id, userId, isAdminRoot);

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async getOverview(projectId: string, userId: string, isAdminRoot: boolean) {
    const project = await this.findOne(projectId, userId, isAdminRoot);

    const [documentsCount, signedCount, votesCount, messagesCount] = await Promise.all([
      this.prisma.document.count({ where: { projectId } }),
      this.prisma.documentAssignment.count({
        where: {
          projectId,
          status: 'SIGNED',
        },
      }),
      this.prisma.vote.count({ where: { projectId } }),
      this.prisma.message.count({ where: { projectId } }),
    ]);

    return {
      ...project,
      stats: {
        documentsCount,
        signedCount,
        votesCount,
        messagesCount,
      },
    };
  }

  async createMembership(projectId: string, dto: CreateMembershipDto) {
    // Check if membership already exists
    const existing = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId: dto.userId,
      },
    });

    if (existing) {
      throw new ForbiddenException('User is already a member of this project');
    }

    return this.prisma.projectMembership.create({
      data: {
        projectId,
        userId: dto.userId,
        roleId: dto.roleId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
    });
  }

  async removeMembership(projectId: string, membershipId: string) {
    return this.prisma.projectMembership.delete({
      where: { id: membershipId },
    });
  }

  async getMemberships(projectId: string, userId: string, isAdminRoot: boolean) {
    // Verify access
    await this.findOne(projectId, userId, isAdminRoot);

    return this.prisma.projectMembership.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        role: true,
      },
    });
  }
}
