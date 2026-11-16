'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, ExternalLink, Trash2, ArrowLeft } from 'lucide-react';
import { clearPreviewDraft } from '@/lib/preview';

export default function PreviewBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const isParam = searchParams.get('preview') === 'true';
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;
    setIsPreview(isParam || isIframe);
  }, [searchParams]);

  if (!isPreview) return null;

  const handleClear = () => {
    clearPreviewDraft();
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-[9999] bg-gradient-to-r from-[#2a1313] via-[#1a1a1a] to-[#2a1313] border-b border-[#D04741]/50 px-4 py-2 flex items-center justify-between text-xs text-white shadow-xl">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-[#ff8079] font-mono tracking-wider uppercase text-[11px]">
          Live Preview Mode
        </span>
        <span className="text-gray-400 hidden sm:inline-block">
          — Showing unsaved modifications before confirmation.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/admin"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Admin Portal</span>
        </a>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 text-[11px] transition-colors"
          title="Reset to saved state"
        >
          <Trash2 size={12} />
          <span className="hidden sm:inline">Reset Draft</span>
        </button>
      </div>
    </div>
  );
}
