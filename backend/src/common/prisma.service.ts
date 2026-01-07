import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper to set session variable for RLS
  async setUserId(userId: string) {
    await this.$executeRawUnsafe(`SET LOCAL app.user_id = '${userId}'`);
  }

  // Helper to clear session variable
  async clearUserId() {
    await this.$executeRawUnsafe(`RESET app.user_id`);
  }
}
