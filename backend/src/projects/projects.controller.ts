import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProjectMembershipGuard } from '../common/guards/project-membership.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.manage')
  @Audit('project.create', 'Project')
  @ApiOperation({ summary: 'Create a new project (admin only)' })
  async create(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.userId, dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get all projects (user sees only their projects)' })
  async findAll(@CurrentUser() user: any) {
    return this.projectsService.findAll(user.userId, user.isAdminRoot || false);
  }

  @Get('my')
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get current user projects' })
  async getMyProjects(@CurrentUser() user: any) {
    return this.projectsService.findAll(user.userId, false);
  }

  @Get(':projectId')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async findOne(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.findOne(projectId, user.userId, user.isAdminRoot || false);
  }

  @Get(':projectId/overview')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get project overview with stats' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async getOverview(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.getOverview(projectId, user.userId, user.isAdminRoot || false);
  }

  @Put(':projectId')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('project.manage')
  @Audit('project.update', 'Project')
  @ApiOperation({ summary: 'Update project (admin only)' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async update(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, user.userId, user.isAdminRoot || false, dto);
  }

  @Get(':projectId/memberships')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get project memberships' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async getMemberships(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.getMemberships(projectId, user.userId, user.isAdminRoot || false);
  }

  @Post(':projectId/memberships')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('users.manage')
  @Audit('project.membership.create', 'ProjectMembership')
  @ApiOperation({ summary: 'Add user to project (admin only)' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async createMembership(
    @Param('projectId') projectId: string,
    @Body() dto: CreateMembershipDto,
  ) {
    return this.projectsService.createMembership(projectId, dto);
  }

  @Delete(':projectId/memberships/:membershipId')
  @UseGuards(ProjectMembershipGuard, PermissionsGuard)
  @RequirePermission('users.manage')
  @Audit('project.membership.delete', 'ProjectMembership')
  @ApiOperation({ summary: 'Remove user from project (admin only)' })
  @ApiParam({ name: 'projectId', type: 'string' })
  @ApiParam({ name: 'membershipId', type: 'string' })
  async removeMembership(
    @Param('projectId') projectId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.projectsService.removeMembership(projectId, membershipId);
  }
}
