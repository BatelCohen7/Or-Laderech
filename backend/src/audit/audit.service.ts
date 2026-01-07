import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export interface AuditLogData {
  actorUserId: string;
  projectId?: string | null;
  actionKey: string;
  targetType: string;
  targetId?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          actorUserId: data.actorUserId,
          projectId: data.projectId,
          actionKey: data.actionKey,
          targetType: data.targetType,
          targetId: data.targetId,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit failures shouldn't break the app
      console.error('Failed to create audit event:', error);
    }
  }
}
