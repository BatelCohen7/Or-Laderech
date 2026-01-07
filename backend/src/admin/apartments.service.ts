import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface AssignUserToApartmentDto {
  userId: string;
  roleInApartment?: string;
}

@Injectable()
export class ApartmentsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async assignUserToApartment(
    projectId: string,
    apartmentId: string,
    dto: AssignUserToApartmentDto,
    actorUserId: string,
  ) {
    // Verify apartment exists and belongs to project (enforces composite FK consistency)
    const apartment = await this.prisma.apartment.findFirst({
      where: {
        id: apartmentId,
        projectId: projectId,
      },
    });

    if (!apartment) {
      throw new NotFoundException('Apartment not found in this project');
    }

    // Check current user count (service layer enforcement)
    const currentCount = await this.prisma.apartmentUser.count({
      where: { apartmentId },
    });

    if (currentCount >= 2) {
      throw new ConflictException('Apartment already has 2 users');
    }

    // Check if user is already assigned
    const existing = await this.prisma.apartmentUser.findFirst({
      where: {
        apartmentId,
        userId: dto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('User is already assigned to this apartment');
    }

    // Verify user is a member of the project
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId: dto.userId,
      },
      include: { role: true },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this project');
    }

    // Only residents can be assigned to apartments
    if (membership.role.name !== 'resident') {
      throw new ConflictException('Only residents can be assigned to apartments');
    }

    const apartmentUser = await this.prisma.apartmentUser.create({
      data: {
        projectId,
        apartmentId,
        userId: dto.userId,
        roleInApartment: dto.roleInApartment || (currentCount === 0 ? 'primary' : 'secondary'),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        apartment: true,
      },
    });

    // Audit event
    await this.auditService.log({
      actorUserId,
      projectId,
      actionKey: 'apartments.user_assigned',
      targetType: 'ApartmentUser',
      targetId: apartmentUser.id,
      metadata: {
        apartmentId,
        userId: dto.userId,
        roleInApartment: apartmentUser.roleInApartment,
      },
    });

    return apartmentUser;
  }

  async removeUserFromApartment(projectId: string, apartmentId: string, apartmentUserId: string) {
    const apartmentUser = await this.prisma.apartmentUser.findUnique({
      where: { id: apartmentUserId },
    });

    if (!apartmentUser || apartmentUser.projectId !== projectId || apartmentUser.apartmentId !== apartmentId) {
      throw new NotFoundException('Apartment user assignment not found');
    }

    return this.prisma.apartmentUser.delete({
      where: { id: apartmentUserId },
    });
  }

  async getApartmentUsers(projectId: string, apartmentId: string) {
    // Verify apartment belongs to project (enforces composite FK consistency)
    const apartment = await this.prisma.apartment.findFirst({
      where: {
        id: apartmentId,
        projectId: projectId,
      },
    });

    if (!apartment) {
      throw new NotFoundException('Apartment not found in this project');
    }

    return this.prisma.apartmentUser.findMany({
      where: { apartmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
