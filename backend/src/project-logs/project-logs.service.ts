import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProjectLogType } from '@prisma/client';

export interface CreateProjectLogDto {
  logType: ProjectLogType;
  title: string;
  notes?: string;
}

@Injectable()
export class ProjectLogsService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, userId: string, dto: CreateProjectLogDto) {
    // Verify user is committee or admin
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can create project logs');
    }

    return this.prisma.projectLog.create({
      data: {
        projectId,
        logType: dto.logType,
        title: dto.title,
        notes: dto.notes,
        createdByUserId: userId,
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

  async findAll(projectId: string, userId: string) {
    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this project');
    }

    return this.prisma.projectLog.findMany({
      where: { projectId },
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
  }

  async findOne(logId: string, userId: string) {
    const log = await this.prisma.projectLog.findUnique({
      where: { id: logId },
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

    if (!log) {
      throw new NotFoundException('Project log not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: log.projectId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    return log;
  }
}
