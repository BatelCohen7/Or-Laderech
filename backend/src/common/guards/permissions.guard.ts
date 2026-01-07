import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { PrismaService } from '../prisma.service';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin root has all permissions
    if (user.isAdminRoot) {
      return true;
    }

    // Get user's permissions from project memberships
    const userPermissions = await this.getUserPermissions(user.userId, user.projectMemberships || []);

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Missing required permissions: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }

  private async getUserPermissions(
    userId: string,
    memberships: Array<{ projectId: string; roleId: string }>,
  ): Promise<string[]> {
    if (memberships.length === 0) {
      return [];
    }

    const roleIds = [...new Set(memberships.map((m) => m.roleId))];

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => rp.permission.key);
  }
}
