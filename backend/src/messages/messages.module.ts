import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { JobQueueModule } from '../jobs/job-queue.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [JobQueueModule, AuditModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
