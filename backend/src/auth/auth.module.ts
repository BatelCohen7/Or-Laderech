import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
