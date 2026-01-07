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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
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
  @Audit('messages.created', 'Message')
  @ApiOperation({ summary: 'Create message (draft or scheduled) - committee/admin' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(projectId, user.userId, dto);
  }

  @Post(':messageId/send')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.create')
  @UseInterceptors(AuditInterceptor)
  @Audit('messages.sent', 'Message')
  @ApiOperation({ summary: 'Send message immediately - committee/admin' })
  async sendNow(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.sendMessageNow(messageId, user.userId);
  }

  @Post(':messageId/schedule')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.schedule')
  @UseInterceptors(AuditInterceptor)
  @Audit('messages.scheduled', 'Message')
  @ApiOperation({ summary: 'Schedule message for future - committee/admin' })
  async schedule(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.messagesService.scheduleMessage(messageId, new Date(scheduledAt), user.userId);
  }

  @Post(':messageId/cancel')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.schedule')
  @UseInterceptors(AuditInterceptor)
  @Audit('messages.cancelled', 'Message')
  @ApiOperation({ summary: 'Cancel scheduled message - committee/admin' })
  async cancel(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.cancelScheduledMessage(messageId, user.userId);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'List project messages' })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.listProjectMessages(projectId, user.userId);
  }

  @Get(':messageId/deliveries/summary')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'Get delivery summary (read/unread counts) - committee/admin' })
  async getDeliveriesSummary(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.getDeliveriesSummary(messageId, user.userId);
  }
}
