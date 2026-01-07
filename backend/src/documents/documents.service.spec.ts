import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StorageService as IStorageService } from '../storage/storage.interface';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: PrismaService;
  let storage: IStorageService;
  let audit: AuditService;

  const mockPrismaService = {
    document: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    documentAssignment: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    projectMembership: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    apartmentUser: {
      findMany: jest.fn(),
    },
  };

  const mockStorageService = {
    upload: jest.fn(),
    getUrl: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'StorageService', useValue: mockStorageService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get<PrismaService>(PrismaService);
    storage = module.get<IStorageService>('StorageService');
    audit = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signDocument', () => {
    it('should be idempotent - return existing if already signed', async () => {
      const assignment = {
        id: 'assignment-1',
        residentUserId: 'user-1',
        status: 'SIGNED',
        signedAt: new Date(),
        projectId: 'project-1',
        document: { id: 'doc-1' },
      };

      mockPrismaService.documentAssignment.findUnique.mockResolvedValue(assignment);

      const result = await service.signDocument('assignment-1', 'user-1');

      expect(result.status).toBe('SIGNED');
      expect(result.message).toBe('Document already signed');
      expect(mockPrismaService.documentAssignment.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user tries to sign another user\'s document', async () => {
      const assignment = {
        id: 'assignment-1',
        residentUserId: 'user-1',
        status: 'PENDING',
        projectId: 'project-1',
        document: { id: 'doc-1' },
      };

      mockPrismaService.documentAssignment.findUnique.mockResolvedValue(assignment);

      await expect(service.signDocument('assignment-1', 'user-2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('assignDocument', () => {
    it('should respect max 2 users per apartment', async () => {
      const document = { id: 'doc-1', projectId: 'project-1' };
      const membership = { role: { name: 'committee' } };
      const apartmentUsers = [
        { userId: 'user-1' },
        { userId: 'user-2' },
      ];

      mockPrismaService.document.findFirst.mockResolvedValue(document);
      mockPrismaService.projectMembership.findFirst.mockResolvedValue(membership);
      mockPrismaService.apartmentUser.findMany.mockResolvedValue(apartmentUsers);
      mockPrismaService.documentAssignment.findFirst.mockResolvedValue(null);
      mockPrismaService.documentAssignment.create.mockResolvedValue({ id: 'assignment-1' });

      const result = await service.assignDocument(
        'project-1',
        'doc-1',
        { target: 'apartment', apartmentId: 'apt-1' },
        'actor-1',
      );

      expect(result.assignments.length).toBeLessThanOrEqual(2);
    });
  });
});
