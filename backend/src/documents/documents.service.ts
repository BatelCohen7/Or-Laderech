import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Inject } from '@nestjs/common';
import { StorageService as IStorageService } from '../storage/storage.interface';
import { AuditService } from '../audit/audit.service';
import { DownloadTokenService } from '../storage/download-token.service';
import { ConfigService } from '../config/config.service';
import { AssignDocumentDto } from './dto/assign-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    @Inject('StorageService') private storage: IStorageService,
    private auditService: AuditService,
    private downloadTokenService: DownloadTokenService,
    private config: ConfigService,
  ) {}

  async uploadDocument(
    projectId: string,
    userId: string,
    file: Buffer,
    filename: string,
    title: string,
    docType: string,
    mimeType?: string,
  ) {
    // Verify access (committee or admin)
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this project');
    }

    if (membership.role.name === 'resident') {
      throw new ForbiddenException('Residents cannot upload documents');
    }

    // Upload file via storage abstraction
    const storageKey = `projects/${projectId}/documents/${Date.now()}-${filename}`;
    await this.storage.upload(file, storageKey, mimeType);

    // Create document record
    const document = await this.prisma.document.create({
      data: {
        projectId,
        title,
        docType: docType as any,
        storageKey,
        storagePath: storageKey, // Legacy support
        mimeType: mimeType || 'application/octet-stream',
        sizeBytes: file.length,
        createdByUserId: userId,
      },
    });

    // Audit event
    await this.auditService.log({
      actorUserId: userId,
      projectId,
      actionKey: 'documents.uploaded',
      targetType: 'Document',
      targetId: document.id,
      metadata: {
        title,
        docType,
        sizeBytes: file.length,
      },
    });

    return document;
  }

  async assignDocument(
    projectId: string,
    documentId: string,
    dto: AssignDocumentDto,
    actorUserId: string,
  ) {
    // Verify document exists
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        projectId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found in this project');
    }

    // Verify access (committee or admin)
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId: actorUserId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can assign documents');
    }

    let userIds: string[] = [];

    if (dto.target === 'apartment') {
      if (!dto.apartmentId) {
        throw new BadRequestException('apartmentId is required when target is apartment');
      }

      // Get users from apartment (max 2)
      const apartmentUsers = await this.prisma.apartmentUser.findMany({
        where: {
          projectId,
          apartmentId: dto.apartmentId,
        },
      });

      if (apartmentUsers.length === 0) {
        throw new NotFoundException('Apartment has no users');
      }

      userIds = apartmentUsers.map((au) => au.userId);
    } else if (dto.target === 'users') {
      if (!dto.userIds || dto.userIds.length === 0) {
        throw new BadRequestException('userIds is required when target is users');
      }

      // Verify all users are residents in this project
      const memberships = await this.prisma.projectMembership.findMany({
        where: {
          projectId,
          userId: { in: dto.userIds },
        },
        include: { role: true },
      });

      const invalidUsers = dto.userIds.filter(
        (uid) => !memberships.find((m) => m.userId === uid && m.role.name === 'resident'),
      );

      if (invalidUsers.length > 0) {
        throw new BadRequestException(`Users ${invalidUsers.join(', ')} are not residents in this project`);
      }

      userIds = dto.userIds;
    }

    // Create assignments (skip if already exists)
    const assignments = [];
    for (const userId of userIds) {
      const existing = await this.prisma.documentAssignment.findFirst({
        where: {
          documentId,
          residentUserId: userId,
        },
      });

      if (!existing) {
        const assignment = await this.prisma.documentAssignment.create({
          data: {
            projectId,
            documentId,
            residentUserId: userId,
            status: 'PENDING',
            assignedAt: new Date(),
          },
        });
        assignments.push(assignment);
      }
    }

    // Audit event
    await this.auditService.log({
      actorUserId,
      projectId,
      actionKey: 'documents.assigned',
      targetType: 'DocumentAssignment',
      targetId: documentId,
      metadata: {
        documentId,
        target: dto.target,
        apartmentId: dto.apartmentId,
        userIds,
        assignmentsCreated: assignments.length,
      },
    });

    return {
      document,
      assignments,
      totalAssigned: assignments.length,
    };
  }

  async getAssignmentsSummary(projectId: string, documentId: string, userId: string, isAdminRoot: boolean) {
    // Verify access
    if (!isAdminRoot) {
      const membership = await this.prisma.projectMembership.findFirst({
        where: {
          projectId,
          userId,
        },
        include: { role: true },
      });

      if (!membership || membership.role.name !== 'committee') {
        throw new ForbiddenException('Only committee can view assignment summaries');
      }
    }

    // Verify document exists
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        projectId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const [pending, signed, total] = await Promise.all([
      this.prisma.documentAssignment.count({
        where: {
          documentId,
          status: 'PENDING',
        },
      }),
      this.prisma.documentAssignment.count({
        where: {
          documentId,
          status: 'SIGNED',
        },
      }),
      this.prisma.documentAssignment.count({
        where: { documentId },
      }),
    ]);

    return {
      documentId,
      total,
      pending,
      signed,
      completionPercent: total > 0 ? Math.round((signed / total) * 100) : 0,
    };
  }

  async getMyDocuments(projectId: string, userId: string) {
    return this.prisma.documentAssignment.findMany({
      where: {
        projectId,
        residentUserId: userId,
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            docType: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectDocuments(projectId: string, userId: string, isAdminRoot: boolean) {
    // Verify access
    if (!isAdminRoot) {
      const membership = await this.prisma.projectMembership.findFirst({
        where: {
          projectId,
          userId,
        },
        include: { role: true },
      });

      if (!membership || membership.role.name !== 'committee') {
        throw new ForbiddenException('Only committee can view project documents');
      }
    }

    return this.prisma.document.findMany({
      where: { projectId },
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
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async downloadDocument(assignmentId: string, userId: string) {
    const assignment = await this.prisma.documentAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        document: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Document assignment not found');
    }

    if (assignment.residentUserId !== userId) {
      throw new ForbiddenException('Cannot access another user\'s document');
    }

    // Get storage key
    const storageKey = assignment.document.storageKey || assignment.document.storagePath;
    if (!storageKey) {
      throw new NotFoundException('Document storage key not found');
    }

    // For S3: return presigned URL directly (no token validation)
    // For local: generate token and return tokenized URL
    let downloadUrl: string;
    let expiresAt: Date;

    if (this.config.storageProvider === 's3') {
      // S3: Get presigned URL directly from storage service
      // Note: S3 presigned URLs have their own expiration (typically 1 hour)
      downloadUrl = await this.storage.getS3PresignedUrl(storageKey);
      expiresAt = new Date(Date.now() + 3600000); // S3 presigned URLs typically expire in 1 hour
    } else {
      // Local: Generate short-lived download token (default 10 minutes)
      const token = this.downloadTokenService.generateToken(userId, assignmentId, storageKey);
      downloadUrl = await this.storage.getDownloadUrl(storageKey, token);
      expiresAt = new Date(Date.now() + this.config.downloadTokenTtl * 1000);
    }

    return {
      assignmentId: assignment.id,
      document: {
        id: assignment.document.id,
        title: assignment.document.title,
      },
      downloadUrl,
      expiresAt,
    };
  }

  async signDocument(assignmentId: string, userId: string, signatureMetadata?: any) {
    const assignment = await this.prisma.documentAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        document: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Document assignment not found');
    }

    if (assignment.residentUserId !== userId) {
      throw new ForbiddenException('Cannot sign another user\'s document');
    }

    // Idempotent: if already signed, return existing
    if (assignment.status === 'SIGNED') {
      return {
        ...assignment,
        message: 'Document already signed',
      };
    }

    // Update to signed
    const updated = await this.prisma.documentAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        signatureProvider: signatureMetadata?.provider || 'manual',
        signatureMetadata: signatureMetadata || {},
        signaturePayload: signatureMetadata || {}, // Backward compatibility
      },
    });

    // Audit event
    await this.auditService.log({
      actorUserId: userId,
      projectId: assignment.projectId,
      actionKey: 'documents.signed',
      targetType: 'DocumentAssignment',
      targetId: assignmentId,
      metadata: {
        documentId: assignment.documentId,
        signedAt: updated.signedAt,
      },
    });

    return updated;
  }
}
