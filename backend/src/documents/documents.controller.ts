import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProjectMembershipGuard } from '../common/guards/project-membership.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { AssignDocumentDto } from './dto/assign-document.dto';

@ApiTags('Documents')
@Controller('projects/:projectId/documents')
@UseGuards(JwtAuthGuard, ProjectMembershipGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission('files.upload_project')
  @UseInterceptors(FileInterceptor('file'), AuditInterceptor)
  @Audit('documents.uploaded', 'Document')
  @ApiOperation({ summary: 'Upload project document (committee/admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        docType: { type: 'string', enum: ['PERSONAL_CONTRACT', 'PLANNING', 'GENERAL', 'LEGAL'] },
      },
      required: ['file', 'title', 'docType'],
    },
  })
  async uploadDocument(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.documentsService.uploadDocument(
      projectId,
      user.userId,
      file.buffer,
      file.originalname,
      dto.title,
      dto.docType,
      file.mimetype,
    );
  }

  @Post(':documentId/assign')
  @UseGuards(PermissionsGuard)
  @RequirePermission('files.upload_project') // Committee can assign
  @UseInterceptors(AuditInterceptor)
  @Audit('documents.assigned', 'DocumentAssignment')
  @ApiOperation({ summary: 'Assign document to residents (committee/admin)' })
  async assignDocument(
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: any,
    @Body() dto: AssignDocumentDto,
  ) {
    return this.documentsService.assignDocument(projectId, documentId, dto, user.userId);
  }

  @Get(':documentId/assignments/summary')
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_project')
  @ApiOperation({ summary: 'Get assignment summary (committee/admin)' })
  async getAssignmentsSummary(
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.getAssignmentsSummary(
      projectId,
      documentId,
      user.userId,
      user.isAdminRoot || false,
    );
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_project')
  @ApiOperation({ summary: 'Get all project documents (committee/admin)' })
  async getProjectDocuments(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.getProjectDocuments(projectId, user.userId, user.isAdminRoot || false);
  }

  @Get('my')
  @UseGuards(PermissionsGuard)
  @RequirePermission('documents.read_own')
  @ApiOperation({ summary: 'Get my assigned documents (resident)' })
  async getMyDocuments(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.getMyDocuments(projectId, user.userId);
  }
}
