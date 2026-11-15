'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteContent } from './types';
import initialContent from '@/data/initial-content.json';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(initialContent as unknown as SiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();
      setContent(data);
    } catch (err: any) {
      console.warn('Falling back to static bundled content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refresh: fetchContent };
}

