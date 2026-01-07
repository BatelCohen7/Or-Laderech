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
import { MessagesService, CreateMessageDto } from './messages.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProjectMembershipGuard } from '../common/guards/project-membership.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Messages')
@Controller('projects/:projectId/messages')
@UseGuards(JwtAuthGuard, ProjectMembershipGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.create')
  @UseInterceptors(AuditInterceptor)
  @Audit('messages.create', 'Message')
  @ApiOperation({ summary: 'Create a message (committee/admin)' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(projectId, user.userId, dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'Get all messages in project' })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.findAll(projectId, user.userId);
  }

  @Get(':messageId')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'Get message by ID' })
  async findOne(
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.findOne(messageId, user.userId);
  }
}
