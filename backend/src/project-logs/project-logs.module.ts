import { Module } from '@nestjs/common';
import { ProjectLogsService } from './project-logs.service';
import { ProjectLogsController } from './project-logs.controller';

@Module({
  controllers: [ProjectLogsController],
  providers: [ProjectLogsService],
  exports: [ProjectLogsService],
})
export class ProjectLogsModule {}
