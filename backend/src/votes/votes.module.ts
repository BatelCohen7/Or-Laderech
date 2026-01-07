import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { AuditModule } from '../audit/audit.module';
import { JobQueueModule } from '../jobs/job-queue.module';

@Module({
  imports: [AuditModule, JobQueueModule],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
