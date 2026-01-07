import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '../../config/config.service';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class ProjectResolverHelper {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /**
   * Resolve project ID for current user
   * In single project mode, returns the user's project membership
   * In multi-project mode, requires explicit projectId
   */
  async resolveProjectId(
    user: CurrentUserPayload,
    projectId?: string,
  ): Promise<string> {
    if (this.config.singleProjectMode) {
      // Auto-resolve from user's membership
      if (!user.projectMemberships || user.projectMemberships.length === 0) {
        throw new ForbiddenException('User is not a member of any project');
      }

      // In single project mode, user should have exactly one membership
      if (user.projectMemberships.length > 1) {
        // Log warning but use first one
        console.warn(
          `User ${user.userId} has multiple project memberships in single project mode`,
        );
      }

      return user.projectMemberships[0].projectId;
    }

    // Multi-project mode: require explicit projectId
    if (!projectId) {
      throw new ForbiddenException('projectId is required in multi-project mode');
    }

    // Verify user is member of this project
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId: user.userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException(`User is not a member of project ${projectId}`);
    }

    return projectId;
  }

  /**
   * Get user's project (for single project mode)
   */
  async getUserProject(userId: string) {
    const membership = await this.prisma.projectMembership.findFirst({
      where: { userId },
      include: {
        project: true,
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of any project');
    }

    return {
      project: membership.project,
      role: membership.role,
      membership,
    };
  }
}
