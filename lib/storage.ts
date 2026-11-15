import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'staraptor-uploads';

export interface StorageStatus {
  provider: 'supabase' | 'local';
  isCloudConnected: boolean;
  bucket?: string;
  notes: string;
}

export function getStorageStatus(): StorageStatus {
  if (SUPABASE_URL && SUPABASE_KEY) {
    return {
      provider: 'supabase',
      isCloudConnected: true,
      bucket: SUPABASE_BUCKET,
      notes: 'Connected to Supabase Cloud Storage'
    };
  }
  return {
    provider: 'local',
    isCloudConnected: false,
    notes: 'Local disk storage (/public/uploads). To enable Cloud Storage for Vercel, add SUPABASE_URL and SUPABASE_ANON_KEY.'
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

  // 1. If Supabase credentials are configured, upload to Supabase Storage
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      // Check if bucket exists, create if missing (when using service role key)
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === SUPABASE_BUCKET);
      if (!bucketExists) {
        await supabase.storage.createBucket(SUPABASE_BUCKET, { public: true });
      }

      const { data, error } = await supabase.storage
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

  // 2. Fallback to local storage (works out-of-the-box on laptop)
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
    // If running on Vercel without Supabase configured and filesystem is read-only,
    // convert small images to base64 Data URL so upload never completely fails
    const base64 = buffer.toString('base64');
    return {
      url: `data:${contentType};base64,${base64}`,
      provider: 'data-url-fallback',
    };
  }
}
