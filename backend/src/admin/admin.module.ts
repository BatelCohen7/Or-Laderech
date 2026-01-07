import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ApartmentsService } from './apartments.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [AdminController],
  providers: [AdminService, ApartmentsService],
  exports: [AdminService, ApartmentsService],
})
export class AdminModule {}
