import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Environment
  get env(): string {
    return process.env.NODE_ENV || 'development';
  }

  get isDevelopment(): boolean {
    return this.env === 'development';
  }

  get isProduction(): boolean {
    return this.env === 'production';
  }

  get isStaging(): boolean {
    return this.env === 'staging';
  }

  // Database
  get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  // JWT
  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'change-me-in-production';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '24h';
  }

  get jwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'change-me-in-production-refresh';
  }

  get jwtRefreshExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Download Token
  get downloadJwtSecret(): string {
    return process.env.DOWNLOAD_JWT_SECRET || this.jwtSecret; // Fallback to JWT_SECRET
  }

  get downloadTokenTtl(): number {
    // Parse TTL string (e.g., "10m", "600s", "1h") or default to 10 minutes
    const ttlStr = process.env.DOWNLOAD_TOKEN_TTL || '10m';
    return this.parseTtl(ttlStr);
  }

  private parseTtl(ttl: string): number {
    // Parse formats: "10m", "600s", "1h", "600" (seconds)
    const match = ttl.match(/^(\d+)([smh]?)$/);
    if (!match) {
      return 600; // Default 10 minutes
    }
    const value = parseInt(match[1], 10);
    const unit = match[2] || 's';
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      default:
        return 600; // Default 10 minutes
    }
  }

  // Server
  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  get apiPrefix(): string {
    return process.env.API_PREFIX || 'api/v1';
  }

  get apiVersion(): string {
    return 'v1';
  }

  // Storage (Cloud-ready)
  get storageProvider(): 'local' | 's3' {
    return (process.env.STORAGE_PROVIDER as 'local' | 's3') || 'local';
  }

  get storageLocalPath(): string {
    return process.env.STORAGE_LOCAL_PATH || './storage';
  }

  // AWS S3 (for production)
  get s3Region(): string {
    return process.env.AWS_S3_REGION || '';
  }

  get s3Bucket(): string {
    return process.env.AWS_S3_BUCKET || '';
  }

  get s3AccessKeyId(): string {
    return process.env.AWS_ACCESS_KEY_ID || '';
  }

  get s3SecretAccessKey(): string {
    return process.env.AWS_SECRET_ACCESS_KEY || '';
  }

  // Job Queue (Cloud-ready)
  get jobQueueProvider(): 'in-memory' | 'redis' {
    return (process.env.JOB_QUEUE_PROVIDER as 'in-memory' | 'redis') || 'in-memory';
  }

  get redisUrl(): string {
    return process.env.REDIS_URL || '';
  }

  // Rate Limiting
  get rateLimitTtl(): number {
    return parseInt(process.env.RATE_LIMIT_TTL || '60', 10);
  }

  get rateLimitMax(): number {
    return parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
  }

  // CORS
  get corsOrigin(): string {
    return process.env.CORS_ORIGIN || '*';
  }

  // Logging
  get logLevel(): string {
    return process.env.LOG_LEVEL || this.isProduction ? 'info' : 'debug';
  }

  // Single Project Mode
  get singleProjectMode(): boolean {
    return process.env.SINGLE_PROJECT_MODE !== 'false'; // Default true
  }
}
