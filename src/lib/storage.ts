import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Enterprise Multi-Cloud Storage Client (AWS S3 & Cloudflare R2 Compatible)
 * Implements presigned URLs, zero-leak private bucket security, and dev fallback.
 */

const DRIVER = process.env.STORAGE_DRIVER || 'local';
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'edupdf-materials';

const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET = process.env.AWS_S3_BUCKET || 'edupdf-production-vault';

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (s3ClientInstance) return s3ClientInstance;

  if (DRIVER === 'r2' && R2_ACCOUNT_ID && R2_ACCESS_KEY && R2_SECRET_KEY) {
    // Cloudflare R2 Endpoint: https://<accountid>.r2.cloudflarestorage.com
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
      },
    });
  } else {
    // AWS S3 or Default S3-compatible provider
    s3ClientInstance = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY || 'mock-key',
        secretAccessKey: AWS_SECRET_KEY || 'mock-secret',
      },
    });
  }

  return s3ClientInstance;
}

export function getBucketName(): string {
  return DRIVER === 'r2' ? R2_BUCKET : AWS_BUCKET;
}

/**
 * Generate a secure Presigned PUT URL for direct client-to-bucket upload.
 * Avoids passing heavy PDF payloads through the Next.js server.
 */
export async function generatePresignedUploadUrl(params: {
  fileKey: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<{ uploadUrl: string; fileKey: string }> {
  const { fileKey, contentType, expiresInSeconds = 300 } = params;

  if (DRIVER === 'local' || (!R2_ACCESS_KEY && !AWS_ACCESS_KEY)) {
    // In local development or demo mode, point to local handler
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
      uploadUrl: `${appUrl}/api/storage/local-upload?key=${encodeURIComponent(fileKey)}`,
      fileKey,
    };
  }

  const s3 = getS3Client();
  const bucket = getBucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  return { uploadUrl, fileKey };
}

/**
 * Generate a secure Presigned GET URL with strict 10-minute expiry.
 * Used for zero-leak secure authorized downloads.
 */
export async function generatePresignedDownloadUrl(params: {
  fileKey: string;
  fileName?: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const { fileKey, fileName, expiresInSeconds = 600 } = params;

  if (DRIVER === 'local' || (!R2_ACCESS_KEY && !AWS_ACCESS_KEY)) {
    // Dev fallback with token
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${appUrl}/api/download/${encodeURIComponent(fileKey)}?token=exp_${Date.now() + expiresInSeconds * 1000}`;
  }

  const s3 = getS3Client();
  const bucket = getBucketName();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    ResponseContentDisposition: fileName
      ? `attachment; filename="${encodeURIComponent(fileName)}"`
      : 'attachment',
  });

  return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

/**
 * Fetch raw PDF bytes from S3/R2 or local cache to apply server-side watermarking.
 */
export async function fetchFileBuffer(fileKey: string): Promise<Buffer | null> {
  try {
    if (DRIVER === 'local' || (!R2_ACCESS_KEY && !AWS_ACCESS_KEY)) {
      return null; // Will trigger on-the-fly sample/real generator
    }

    const s3 = getS3Client();
    const bucket = getBucketName();

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      })
    );

    if (response.Body) {
      const byteArray = await response.Body.transformToByteArray();
      return Buffer.from(byteArray);
    }
    return null;
  } catch (error) {
    console.error('Error fetching file buffer from object storage:', error);
    return null;
  }
}
