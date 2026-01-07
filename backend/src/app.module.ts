import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { VotesModule } from './votes/votes.module';
import { MessagesModule } from './messages/messages.module';
import { ProjectLogsModule } from './project-logs/project-logs.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { StorageModule } from './storage/storage.module';
import { JobQueueModule } from './jobs/job-queue.module';
import { HealthModule } from './health/health.module';
import { AppModule as AppMeModule } from './app/app.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ttl: config.rateLimitTtl,
        limit: config.rateLimitMax,
      }),
      inject: [ConfigService],
    }),
    AuditModule,
    StorageModule,
    JobQueueModule,
    HealthModule,
    AuthModule,
    AppMeModule,
    ProjectsModule,
    DocumentsModule,
    VotesModule,
    MessagesModule,
    ProjectLogsModule,
    AdminModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
