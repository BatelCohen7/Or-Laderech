import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class ProjectMembershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin root bypasses project membership check
    if (user.isAdminRoot) {
      return true;
    }

    // Get project_id from params, body, or query
    const projectId = request.params.projectId || request.body.projectId || request.query.projectId;

    if (!projectId) {
      // If no project_id in request, allow (might be system-level endpoint)
      return true;
    }

    // Check if user is member of this project
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        userId: user.userId,
        projectId: projectId,
      },
    });

    if (!membership) {
      throw new ForbiddenException(`User is not a member of project ${projectId}`);
    }

    // Attach membership info to request for use in controllers
    request.projectMembership = membership;

    return true;
  }
}
