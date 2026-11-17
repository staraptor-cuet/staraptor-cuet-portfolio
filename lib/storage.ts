import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 Credentials
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'staraptor-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev or https://media.staraptor.com

// Supabase Storage Credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'staraptor-uploads';

export interface StorageStatus {
  provider: 'r2' | 'supabase' | 'local';
  isCloudConnected: boolean;
  bucket?: string;
  notes: string;
}

export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

export function getR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function getStorageStatus(): StorageStatus {
  if (isR2Configured()) {
    return {
      provider: 'r2',
      isCloudConnected: true,
      bucket: R2_BUCKET_NAME,
      notes: 'Connected to Cloudflare R2 Object Storage (Zero Egress Fees)',
    };
  }

  if (SUPABASE_URL && SUPABASE_KEY) {
    return {
      provider: 'supabase',
      isCloudConnected: true,
      bucket: SUPABASE_BUCKET,
      notes: 'Connected to Supabase Cloud Storage',
    };
  }

  return {
    provider: 'local',
    isCloudConnected: false,
    notes: 'Local disk storage (/public/uploads). Configure Cloudflare R2 or Supabase for persistent cloud deployment on Vercel.',
  };
}

export async function uploadFile(
  buffer: Buffer,
  originalFilename: string,
  contentType: string
): Promise<{ url: string; provider: string }> {
  const sanitizedFilename = originalFilename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  const uniqueName = `${Date.now()}-${sanitizedFilename}`;

  // 1. If Cloudflare R2 is configured, upload to Cloudflare R2 (Recommended for zero egress fees)
  if (isR2Configured()) {
    try {
      const client = getR2Client();
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: uniqueName,
          Body: buffer,
          ContentType: contentType || 'application/octet-stream',
        })
      );

      // Public URL prefix
      const publicBase = R2_PUBLIC_URL
        ? R2_PUBLIC_URL.replace(/\/$/, '')
        : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

      return {
        url: `${publicBase}/${uniqueName}`,
        provider: 'r2',
      };
    } catch (r2Err) {
      console.warn('Falling back from Cloudflare R2 upload attempt:', r2Err);
    }
  }

  // 2. If Supabase credentials are configured, upload to Supabase Storage
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === SUPABASE_BUCKET);
      if (!bucketExists) {
        await supabase.storage.createBucket(SUPABASE_BUCKET, { public: true });
      }

      const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(uniqueName, buffer, {
          contentType: contentType || 'application/octet-stream',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(uniqueName);

      return {
        url: publicUrlData.publicUrl,
        provider: 'supabase',
      };
    } catch (err) {
      console.warn('Falling back to local storage after Supabase upload attempt:', err);
    }
  }

  // 3. Fallback to local storage (works out-of-the-box locally)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${uniqueName}`,
      provider: 'local',
    };
  } catch (fsErr) {
    console.error('Local filesystem upload error:', fsErr);
    const base64 = buffer.toString('base64');
    return {
      url: `data:${contentType};base64,${base64}`,
      provider: 'data-url-fallback',
    };
  }
}
