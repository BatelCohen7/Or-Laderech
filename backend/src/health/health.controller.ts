import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '../config/config.service';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  async check() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: this.config.env,
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: this.config.env,
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch (error) {
      return { status: 'not ready', error: error.message };
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check endpoint' })
  live() {
    return { status: 'alive' };
  }
}
