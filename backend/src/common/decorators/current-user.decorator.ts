import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  userId: string;
  email: string;
  role?: string;
  projectMemberships?: Array<{ projectId: string; roleId: string; roleName: string }>;
  isAdminRoot?: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
