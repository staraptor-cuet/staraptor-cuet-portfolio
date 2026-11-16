'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteContent } from './types';
import initialContent from '@/data/initial-content.json';
import { getPreviewDraft } from './preview';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(initialContent as unknown as SiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyDraft = useCallback((base: SiteContent): SiteContent => {
    const draft = getPreviewDraft();
    if (!draft) return base;
    return {
      ...base,
      ...draft,
    };
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();
      setContent(applyDraft(data));
    } catch (err: any) {
      console.warn('Falling back to static bundled content:', err);
      setError(err.message);
      setContent(applyDraft(initialContent as unknown as SiteContent));
    } finally {
      setLoading(false);
    }
  }, [applyDraft]);

  useEffect(() => {
    fetchContent();

    // Listen for storage events (e.g. from admin panel in another tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'staraptor_preview_draft') {
        fetchContent();
      }
    };

    // Listen for postMessage events (e.g. from parent window inside preview iframe)
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'STARAPTOR_PREVIEW_UPDATE') {
        if (e.data.draft) {
          setContent((prev) => ({
            ...prev,
            ...e.data.draft,
          }));
        }
      } else if (e.data?.type === 'STARAPTOR_PREVIEW_CLEAR') {
        fetchContent();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
    };
  }, [fetchContent]);

  return { content, loading, error, refresh: fetchContent };
}
