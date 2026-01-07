import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '../config/config.service';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    projectMemberships: Array<{ projectId: string; roleName: string }>;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        phone: data.phone,
      },
      include: {
        projectMemberships: {
          include: {
            role: true,
          },
        },
      },
    });

    return this.createTokens(user);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        projectMemberships: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isEnabled) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.createTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });

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

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: this.config.jwtExpiresIn },
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        projectMemberships: {
          include: {
            project: true,
            role: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        globalRole: true,
        isEnabled: true,
        createdAt: true,
        projectMemberships: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                statusStage: true,
                statusPercent: true,
              },
            },
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; bio?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  private createTokens(user: any): LoginResponse {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.jwtRefreshSecret,
      expiresIn: this.config.jwtRefreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.globalRole,
        projectMemberships: user.projectMemberships.map((pm: any) => ({
          projectId: pm.projectId,
          roleName: pm.role.name,
        })),
      },
    };
  }
}
