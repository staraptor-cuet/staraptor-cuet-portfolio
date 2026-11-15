import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { SiteContent } from './types';
import initialContent from '@/data/initial-content.json';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

// In-memory cache for ultra-fast response and serverless fallback
let memoryContentCache: SiteContent | null = null;

export async function getSiteContent(): Promise<SiteContent> {
  // 1. If Supabase is configured, attempt to load from Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single();

      if (!error && data?.data) {
        memoryContentCache = data.data as SiteContent;
        return memoryContentCache;
      }
    } catch (err) {
      console.warn('Supabase content fetch failed, using local/cache fallback:', err);
    }
  }

  // 2. In-memory cache check
  if (memoryContentCache) {
    return memoryContentCache;
  }

  // 3. Read from data/content.json on disk
  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const raw = fs.readFileSync(CONTENT_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as SiteContent;
      memoryContentCache = parsed;
      return parsed;
    }
  } catch (fsErr) {
    console.warn('Could not read from data/content.json, using initial content:', fsErr);
  }

  // 4. Fallback to bundled initial content
  memoryContentCache = initialContent as unknown as SiteContent;
  return memoryContentCache;
}

export async function updateSiteContent(
  updater: Partial<SiteContent> | ((current: SiteContent) => SiteContent)
): Promise<SiteContent> {
  const current = await getSiteContent();
  let updated: SiteContent;

  if (typeof updater === 'function') {
    updated = updater(current);
  } else {
    updated = {
      ...current,
      ...updater,
    };
  }

  // Update in-memory cache
  memoryContentCache = updated;

  // 1. If Supabase configured, save to Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 'main', data: updated, updated_at: new Date().toISOString() });
      if (error) {
        console.error('Failed to save content to Supabase:', error);
      }
    } catch (sbErr) {
      console.error('Supabase write exception:', sbErr);
    }
  }

  // 2. Write to local file data/content.json
  try {
    const dir = path.dirname(CONTENT_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (fsErr) {
    console.warn('Could not write to local content.json (normal in some serverless envs):', fsErr);
  }

  return updated;
}
