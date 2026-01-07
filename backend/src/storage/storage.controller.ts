import { Controller, Get, Query, Res, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '../config/config.service';
import { DownloadTokenService } from './download-token.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller('storage')
export class StorageController {
  constructor(
    private config: ConfigService,
    private downloadTokenService: DownloadTokenService,
  ) {}

  /**
   * Download file endpoint (public - no JWT auth required)
   * Relies on short-lived token validation only
   * For S3 storage, this endpoint is not used - presigned URLs are returned directly
   */
  @Get('download')
  async downloadFile(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    // Only serve files in local storage mode
    if (this.config.storageProvider !== 'local') {
      throw new NotFoundException('File serving not available in this storage mode');
    }

    try {
      // Validate token
      const payload = await this.downloadTokenService.validateToken(token);

      // Prevent path traversal - ensure storageKey doesn't contain ../
      const storageKey = payload.storageKey;
      if (storageKey.includes('..') || path.isAbsolute(storageKey)) {
        throw new ForbiddenException('Invalid storage path');
      }

      // Resolve file path (storageKey is already relative to storage base)
      const fullPath = path.join(this.config.storageLocalPath, storageKey);
      
      // Additional security: ensure resolved path is within storage directory
      const resolvedPath = path.resolve(fullPath);
      const storageBase = path.resolve(this.config.storageLocalPath);
      if (!resolvedPath.startsWith(storageBase)) {
        throw new ForbiddenException('Path traversal detected');
      }

      const file = await fs.readFile(resolvedPath);
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(storageKey)}"`);
      
      return res.send(file);
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('File not found or token invalid');
    }
  }
}
