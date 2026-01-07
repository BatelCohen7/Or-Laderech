import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from '../messages/messages.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { ProjectResolverHelper } from '../common/helpers/project-resolver.helper';

@ApiTags('Me - Messages')
@Controller('me/messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeMessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly projectResolver: ProjectResolverHelper,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @ApiOperation({ summary: 'Get my messages - single project mode' })
  async getMyMessages(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.messagesService.getMyMessages(projectId, user.userId);
  }

  @Post(':deliveryId/read')
  @UseGuards(PermissionsGuard)
  @RequirePermission('messages.read')
  @UseInterceptors(AuditInterceptor)
  @Audit('messages.read', 'MessageDelivery')
  @ApiOperation({ summary: 'Mark message as read - idempotent' })
  async markAsRead(
    @Param('deliveryId') deliveryId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.markAsRead(deliveryId, user.userId);
  }
}
