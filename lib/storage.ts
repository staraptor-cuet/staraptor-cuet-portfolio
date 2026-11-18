import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudinary Credentials (25 GB Free, No Card Required)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Cloudflare R2 Credentials (10 GB Free, S3 Compatible)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'staraptor-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Supabase Storage Credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'staraptor-uploads';

export interface StorageStatus {
  provider: 'cloudinary' | 'r2' | 'supabase' | 'local';
  isCloudConnected: boolean;
  bucket?: string;
  notes: string;
}

export function isCloudinaryConfigured(): boolean {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
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
  if (isCloudinaryConfigured()) {
    return {
      provider: 'cloudinary',
      isCloudConnected: true,
      bucket: CLOUDINARY_CLOUD_NAME,
      notes: 'Connected to Cloudinary (25 GB Free Cloud Storage & Global CDN)',
    };
  }

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
    notes: 'Local disk storage (/public/uploads). Configure Cloudinary (25 GB free) for persistent cloud deployment on Vercel.',
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
  const baseNameWithoutExt = sanitizedFilename.replace(/\.[^/.]+$/, '');
  const uniqueName = `${Date.now()}-${baseNameWithoutExt}`;

  // 1. Cloudinary Upload (Recommended: 25GB free, auto-WebP conversion, global CDN)
  if (isCloudinaryConfigured()) {
    try {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
      });

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'staraptor',
            public_id: uniqueName,
            resource_type: 'auto',
            format: 'webp',
          },
          (error, res) => {
            if (error) return reject(error);
            resolve(res as any);
          }
        );
        stream.end(buffer);
      });

      return {
        url: result.secure_url,
        provider: 'cloudinary',
      };
    } catch (cErr) {
      console.warn('Falling back from Cloudinary upload attempt:', cErr);
    }
  }

  // 2. Cloudflare R2 Upload
  if (isR2Configured()) {
    try {
      const client = getR2Client();
      const r2Filename = `${Date.now()}-${sanitizedFilename}`;
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: r2Filename,
          Body: buffer,
          ContentType: contentType || 'application/octet-stream',
        })
      );

      const publicBase = R2_PUBLIC_URL
        ? R2_PUBLIC_URL.replace(/\/$/, '')
        : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

      return {
        url: `${publicBase}/${r2Filename}`,
        provider: 'r2',
      };
    } catch (r2Err) {
      console.warn('Falling back from Cloudflare R2 upload attempt:', r2Err);
    }
  }

  // 3. Supabase Storage Upload
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const supabaseFilename = `${Date.now()}-${sanitizedFilename}`;
      
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === SUPABASE_BUCKET);
      if (!bucketExists) {
        await supabase.storage.createBucket(SUPABASE_BUCKET, { public: true });
      }

      const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(supabaseFilename, buffer, {
          contentType: contentType || 'application/octet-stream',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(supabaseFilename);

      return {
        url: publicUrlData.publicUrl,
        provider: 'supabase',
      };
    } catch (err) {
      console.warn('Falling back to local storage after Supabase upload attempt:', err);
    }
  }

  // 4. Local storage fallback (Safe local disk mode with strict path traversal prevention)
  try {
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const safeBase = path.basename(sanitizedFilename);
    const localFilename = `${Date.now()}-${safeBase}`;
    const filePath = path.resolve(uploadDir, localFilename);

    if (!filePath.startsWith(uploadDir)) {
      throw new Error('Path traversal attempt detected');
    }

    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${localFilename}`,
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
