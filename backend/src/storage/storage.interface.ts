export interface StorageService {
  upload(file: Buffer, path: string, contentType?: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): Promise<string>; // Deprecated - use getDownloadUrl with token or getS3PresignedUrl
  getDownloadUrl(path: string, token: string): Promise<string>; // For local storage with token
  getS3PresignedUrl(path: string): Promise<string>; // For S3: returns presigned URL directly
  exists(path: string): Promise<boolean>;
}
