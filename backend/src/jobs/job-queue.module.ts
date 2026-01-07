import { Module, Global } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
  providers: [
    {
      provide: 'JobQueueService',
      useFactory: (config: ConfigService) => {
        if (config.jobQueueProvider === 'redis') {
          // TODO: Implement RedisJobQueueService when moving to Redis/Bull
          throw new Error('Redis job queue not yet implemented');
        }
        return new JobQueueService();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['JobQueueService'],
})
export class JobQueueModule {}
