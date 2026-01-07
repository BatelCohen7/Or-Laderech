import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { DownloadTokenService } from './download-token.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StorageController],
  providers: [
    DownloadTokenService,
    {
      provide: 'StorageService',
      useFactory: (config: ConfigService) => {
        if (config.storageProvider === 's3') {
          // TODO: Implement S3StorageService when moving to AWS
          throw new Error('S3 storage not yet implemented');
        }
        return new StorageService(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['StorageService', DownloadTokenService],
})
export class StorageModule {}
