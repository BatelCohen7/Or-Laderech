import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ProjectStage } from '@prisma/client';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(ProjectStage)
  statusStage?: ProjectStage;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  statusPercent?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
