import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProjectMembershipGuard } from '../common/guards/project-membership.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Votes')
@Controller('projects/:projectId/votes')
@UseGuards(JwtAuthGuard, ProjectMembershipGuard)
@ApiBearerAuth()
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.create')
  @UseInterceptors(AuditInterceptor)
  @Audit('votes.created', 'Vote')
  @ApiOperation({ summary: 'Create a new vote (committee/admin)' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateVoteDto,
  ) {
    return this.votesService.create(projectId, user.userId, dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.read')
  @ApiOperation({ summary: 'Get all votes in project' })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.votesService.findAll(projectId, user.userId);
  }

  @Post(':voteId/close')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('votes.closed', 'Vote')
  @ApiOperation({ summary: 'Close vote (committee/admin)' })
  async close(
    @Param('projectId') projectId: string,
    @Param('voteId') voteId: string,
    @CurrentUser() user: any,
  ) {
    return this.votesService.close(voteId, user.userId);
  }

  @Get(':voteId/results')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.manage')
  @ApiOperation({ summary: 'Get vote results (committee/admin)' })
  async getResults(
    @Param('projectId') projectId: string,
    @Param('voteId') voteId: string,
    @CurrentUser() user: any,
  ) {
    return this.votesService.getResults(voteId, user.userId);
  }

  @Get(':voteId/participation')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.manage')
  @ApiOperation({ summary: 'Get vote participation (voted/not voted list) - committee/admin only' })
  async getParticipation(
    @Param('projectId') projectId: string,
    @Param('voteId') voteId: string,
    @CurrentUser() user: any,
  ) {
    return this.votesService.getParticipation(voteId, user.userId);
  }
}
