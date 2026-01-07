import { IsString, IsEnum, IsOptional } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class UploadDocumentDto {
  @IsString()
  title: string;

  @IsEnum(DocumentType)
  docType: DocumentType;
}
