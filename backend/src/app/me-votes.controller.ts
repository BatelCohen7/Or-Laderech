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
import { VotesService } from '../votes/votes.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { ProjectResolverHelper } from '../common/helpers/project-resolver.helper';

@ApiTags('Me - Votes')
@Controller('me/votes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeVotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly projectResolver: ProjectResolverHelper,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.read')
  @ApiOperation({ summary: 'Get my votes (open + past) - single project mode' })
  async getMyVotes(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.votesService.getMyVotes(projectId, user.userId);
  }

  @Get(':voteId')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.read')
  @ApiOperation({ summary: 'Get vote details + my ballot' })
  async getVote(
    @Param('voteId') voteId: string,
    @CurrentUser() user: any,
  ) {
    return this.votesService.findOne(voteId, user.userId);
  }

  @Post(':voteId/ballot')
  @UseGuards(PermissionsGuard)
  @RequirePermission('votes.vote')
  @UseInterceptors(AuditInterceptor)
  @Audit('votes.voted', 'VoteBallot')
  @ApiOperation({ summary: 'Cast vote (idempotent)' })
  async vote(
    @Param('voteId') voteId: string,
    @CurrentUser() user: any,
    @Body('optionId') optionId: string,
  ) {
    return this.votesService.vote(voteId, optionId, user.userId);
  }
}
