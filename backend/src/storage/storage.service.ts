import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { StorageService as IStorageService } from './storage.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService implements IStorageService {
  private basePath: string;

  constructor(private config: ConfigService) {
    this.basePath = config.storageLocalPath;
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async upload(file: Buffer, filePath: string, contentType?: string): Promise<string> {
    const fullPath = path.join(this.basePath, filePath);
    const dir = path.dirname(fullPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, file);
    
    return filePath;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // File might not exist
    }
  }

  async getUrl(filePath: string): Promise<string> {
    // This method is deprecated - use getDownloadUrl with token instead
    // Kept for backward compatibility
    if (this.config.storageProvider === 's3') {
      // TODO: Return S3 signed URL when S3 is implemented
      throw new Error('S3 not implemented');
    }
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${this.config.apiPrefix}/storage/${filePath}`;
  }

  async getDownloadUrl(filePath: string, token: string): Promise<string> {
    // For local storage only: return tokenized download URL
    // For S3, use getS3PresignedUrl instead
    if (this.config.storageProvider === 's3') {
      throw new Error('Use getS3PresignedUrl for S3 storage');
    }
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${this.config.apiPrefix}/storage/download?token=${encodeURIComponent(token)}`;
  }

  async getS3PresignedUrl(filePath: string): Promise<string> {
    // For S3: return presigned URL directly (no token validation needed)
    // TODO: Implement S3 presigned URL generation when S3 is implemented
    // Example using AWS SDK:
    // const s3Client = new S3Client({ ... });
    // const command = new GetObjectCommand({ Bucket: this.config.s3Bucket, Key: filePath });
    // return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    throw new Error('S3 presigned URL generation not yet implemented');
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
