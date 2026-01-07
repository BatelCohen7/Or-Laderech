import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectResolverHelper } from '../common/helpers/project-resolver.helper';
import { DocumentsService } from '../documents/documents.service';
import { VotesService } from '../votes/votes.service';
import { MessagesService } from '../messages/messages.service';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../common/prisma.service';

@ApiTags('Me')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeController {
  constructor(
    private projectResolver: ProjectResolverHelper,
    private documentsService: DocumentsService,
    private votesService: VotesService,
    private messagesService: MessagesService,
    private projectsService: ProjectsService,
    private prisma: PrismaService,
  ) {}

  @Get('project')
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get current user project (single project mode)' })
  async getProject(@CurrentUser() user: any) {
    return this.projectResolver.getUserProject(user.userId);
  }

  @Get('dashboard')
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get dashboard data for current user project' })
  async getDashboard(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);

    // Get overview
    const overview = await this.projectsService.getOverview(
      projectId,
      user.userId,
      user.isAdminRoot || false,
    );

    // Get pending documents (if resident)
    let myDocuments = [];
    if (user.projectMemberships?.[0]?.roleName === 'resident') {
      myDocuments = await this.documentsService.getMyDocuments(projectId, user.userId);
    }

    // Get active votes
    const votes = await this.votesService.findAll(projectId, user.userId);

    // Get recent messages
    const messages = await this.messagesService.findAll(projectId, user.userId);

    // Get apartment (if resident)
    let apartment = null;
    if (user.projectMemberships?.[0]?.roleName === 'resident') {
      const apartmentUser = await this.prisma.apartmentUser.findFirst({
        where: { userId: user.userId },
        include: {
          apartment: true,
        },
      });
      apartment = apartmentUser?.apartment || null;
    }

    return {
      project: overview,
      myDocuments: myDocuments.filter((d) => d.status === 'PENDING'),
      activeVotes: votes.filter((v) => v.status === 'OPEN'),
      recentMessages: messages.slice(0, 5),
      apartment,
    };
  }

  @Get('documents')
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_own')
  @ApiOperation({ summary: 'Get my documents (resident)' })
  async getMyDocuments(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.documentsService.getMyDocuments(projectId, user.userId);
  }

  @Get('votes')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.read')
  @ApiOperation({ summary: 'Get votes in my project' })
  async getVotes(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.votesService.findAll(projectId, user.userId);
  }

  @Get('messages')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'Get messages in my project' })
  async getMessages(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.messagesService.findAll(projectId, user.userId);
  }

  @Get('apartment')
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get my apartment details (resident)' })
  async getMyApartment(@CurrentUser() user: any) {
    const apartmentUser = await this.prisma.apartmentUser.findFirst({
      where: { userId: user.userId },
      include: {
        apartment: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                statusStage: true,
                statusPercent: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!apartmentUser) {
      return null;
    }

    // Get other user in same apartment (if any) - minimal fields for privacy
    const otherUsers = await this.prisma.apartmentUser.findMany({
      where: {
        apartmentId: apartmentUser.apartmentId,
        userId: { not: user.userId },
      },
      select: {
        id: true,
        roleInApartment: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      apartment: apartmentUser.apartment,
      myRole: apartmentUser.roleInApartment,
      otherUsers: otherUsers.map((au) => ({
        id: au.id,
        roleInApartment: au.roleInApartment,
        user: {
          id: au.user.id,
          name: au.user.name,
        },
      })),
    };
  }
}
