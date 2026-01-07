import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString, ValidateNested, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VoteAudience } from '@prisma/client';

export class VoteOptionDto {
  @ApiProperty({ description: 'Option label', example: 'Yes' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Sort order', example: 0, required: false })
  @IsOptional()
  sortOrder?: number;
}

export class CreateVoteDto {
  @ApiProperty({ description: 'Vote title', example: 'Approve Phase 1 Construction' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Vote description', example: 'Vote on whether to proceed with Phase 1', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Audience filter',
    enum: VoteAudience,
    example: VoteAudience.ALL_RESIDENTS,
  })
  @IsEnum(VoteAudience)
  audienceFilter: VoteAudience;

  @ApiProperty({ description: 'When vote opens (ISO 8601)', example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  opensAt: string;

  @ApiProperty({ description: 'When vote closes (ISO 8601)', example: '2024-01-31T23:59:59Z' })
  @IsDateString()
  closesAt: string;

  @ApiProperty({ description: 'Vote options', type: [VoteOptionDto], minItems: 2 })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VoteOptionDto)
  @MinLength(2, { message: 'At least 2 options are required' })
  options: VoteOptionDto[];
}
