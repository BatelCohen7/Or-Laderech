import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  phone?: string;
  globalRole?: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isEnabled?: boolean;
}

export interface UpdateRolePermissionsDto {
  roleId: string;
  permissionIds: string[];
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Users Management
  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashed,
        phone: dto.phone,
        globalRole: dto.globalRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        globalRole: true,
        isEnabled: true,
        createdAt: true,
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        globalRole: true,
        isEnabled: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            projectMemberships: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        globalRole: true,
        isEnabled: true,
      },
    });
  }

  // Roles & Permissions
  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateRolePermissions(dto: UpdateRolePermissionsDto) {
    // Delete existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: dto.roleId },
    });

    // Create new permissions
    if (dto.permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({
          roleId: dto.roleId,
          permissionId,
        })),
      });
    }

    return this.prisma.role.findUnique({
      where: { id: dto.roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  // Impersonation
  async startImpersonation(adminUserId: string, targetUserId: string, reason?: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (!targetUser.isEnabled) {
      throw new BadRequestException('Cannot impersonate disabled user');
    }

    const session = await this.prisma.impersonationSession.create({
      data: {
        adminUserId,
        impersonatedUserId: targetUserId,
        reason,
      },
    });

    return session;
  }

  async endImpersonation(sessionId: string) {
    return this.prisma.impersonationSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });
  }

  async getImpersonationSessions(adminUserId?: string) {
    return this.prisma.impersonationSession.findMany({
      where: adminUserId ? { adminUserId } : undefined,
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        impersonatedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    projectId?: string;
    userId?: string;
    actionKey?: string;
    limit?: number;
  }) {
    return this.prisma.auditEvent.findMany({
      where: {
        projectId: filters?.projectId,
        actorUserId: filters?.userId,
        actionKey: filters?.actionKey,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { occurredAt: 'desc' },
      take: filters?.limit || 100,
    });
  }

  // Feature Flags
  async getFeatureFlags() {
    return this.prisma.featureFlag.findMany({
      include: {
        scopes: true,
      },
    });
  }

  async updateFeatureFlag(flagId: string, isEnabledGlobal: boolean) {
    return this.prisma.featureFlag.update({
      where: { id: flagId },
      data: { isEnabledGlobal },
    });
  }
}
