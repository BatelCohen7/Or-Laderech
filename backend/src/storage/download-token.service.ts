import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

export interface DownloadTokenPayload {
  userId: string;
  assignmentId: string;
  storageKey: string;
  exp: number;
}

@Injectable()
export class DownloadTokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Generate a short-lived download token
   * Token TTL is configurable via DOWNLOAD_TOKEN_TTL (default: 10 minutes)
   */
  generateToken(userId: string, assignmentId: string, storageKey: string): string {
    const expiresIn = this.config.downloadTokenTtl; // Configurable TTL (default 10m)
    const payload: DownloadTokenPayload = {
      userId,
      assignmentId,
      storageKey,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    return this.jwtService.sign(payload, {
      secret: this.config.downloadJwtSecret, // Separate secret for download tokens
      expiresIn: `${expiresIn}s`,
    });
  }

  /**
   * Validate and decode download token
   * Returns payload if valid, throws if invalid/expired
   * Note: This endpoint does NOT require JWT auth - relies on token validation only
   */
  async validateToken(token: string): Promise<DownloadTokenPayload> {
    try {
      const payload = this.jwtService.verify<DownloadTokenPayload>(token, {
        secret: this.config.downloadJwtSecret, // Use separate secret
      });

      // Additional validation: check expiry
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired download token');
    }
  }
}
