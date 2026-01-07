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
import { ProjectLogsService, CreateProjectLogDto } from './project-logs.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProjectMembershipGuard } from '../common/guards/project-membership.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Project Logs')
@Controller('projects/:projectId/logs')
@UseGuards(JwtAuthGuard, ProjectMembershipGuard)
@ApiBearerAuth()
export class ProjectLogsController {
  constructor(private readonly projectLogsService: ProjectLogsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission('files.upload_project') // Using existing permission
  @UseInterceptors(AuditInterceptor)
  @Audit('project_logs.create', 'ProjectLog')
  @ApiOperation({ summary: 'Create project log (committee/admin)' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateProjectLogDto,
  ) {
    return this.projectLogsService.create(projectId, user.userId, dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get all project logs' })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectLogsService.findAll(projectId, user.userId);
  }

  @Get(':logId')
  @UseGuards(PermissionsGuard)
  @RequirePermission('project.read')
  @ApiOperation({ summary: 'Get project log by ID' })
  async findOne(
    @Param('logId') logId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectLogsService.findOne(logId, user.userId);
  }
}
