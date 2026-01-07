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
import { DocumentsService } from '../documents/documents.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectResolverHelper } from '../common/helpers/project-resolver.helper';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Me - Documents')
@Controller('me/documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeDocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private projectResolver: ProjectResolverHelper,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_own')
  @ApiOperation({ summary: 'Get my assigned documents (single project mode)' })
  async getMyDocuments(@CurrentUser() user: any) {
    const projectId = await this.projectResolver.resolveProjectId(user);
    return this.documentsService.getMyDocuments(projectId, user.userId);
  }

  @Get(':assignmentId/download')
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_own')
  @ApiOperation({ summary: 'Download document (resident)' })
  async downloadDocument(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.downloadDocument(assignmentId, user.userId);
  }

  @Post(':assignmentId/sign')
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.sign_own')
  @UseInterceptors(AuditInterceptor)
  @Audit('documents.signed', 'DocumentAssignment')
  @ApiOperation({ summary: 'Sign document (resident, idempotent)' })
  async signDocument(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: any,
    @Body() signatureMetadata?: any,
  ) {
    return this.documentsService.signDocument(assignmentId, user.userId, signatureMetadata);
  }
}
