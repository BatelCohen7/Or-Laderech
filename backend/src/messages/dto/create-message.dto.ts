import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageAudience } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message title', example: 'Important Announcement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message body', example: 'This is an important announcement for all residents.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Audience filter',
    enum: MessageAudience,
    example: MessageAudience.ALL_RESIDENTS,
  })
  @IsEnum(MessageAudience)
  audienceFilter: MessageAudience;

  @ApiProperty({
    description: 'Schedule message for future (ISO 8601). If not provided, message is sent immediately.',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
