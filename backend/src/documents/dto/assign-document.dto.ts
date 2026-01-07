import { IsString, IsEnum, IsArray, IsUUID, IsOptional, ValidateIf } from 'class-validator';

export class AssignDocumentDto {
  @IsEnum(['apartment', 'users'])
  target: 'apartment' | 'users';

  @ValidateIf((o) => o.target === 'apartment')
  @IsUUID()
  apartmentId?: string;

  @ValidateIf((o) => o.target === 'users')
  @IsArray()
  @IsUUID(undefined, { each: true })
  userIds?: string[];
}
