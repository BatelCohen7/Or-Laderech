import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../config/config.service';
import { PrismaService } from './prisma.service';
import { CurrentUserPayload } from './decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<CurrentUserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        projectMemberships: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isEnabled) {
      throw new UnauthorizedException('User not found or disabled');
    }

    // Check if user is admin_root (has admin_root role in any project or global_role)
    const isAdminRoot =
      user.globalRole === 'admin_root' ||
      user.projectMemberships.some((pm) => pm.role.name === 'admin_root');

    // Build project memberships array
    const projectMemberships = user.projectMemberships.map((pm) => ({
      projectId: pm.projectId,
      roleId: pm.roleId,
      roleName: pm.role.name,
    }));

    return {
      userId: user.id,
      email: user.email,
      role: user.globalRole,
      projectMemberships,
      isAdminRoot,
    };
  }
}
