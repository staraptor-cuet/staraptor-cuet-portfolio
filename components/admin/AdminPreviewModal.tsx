'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RotateCw,
  X,
  Eye,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoute?: string;
}

const PREVIEW_PAGES = [
  { label: 'Landing Page (Home)', path: '/' },
  { label: 'Our Progress & Specs', path: '/progress' },
  { label: 'Achievements Feed', path: '/achievements' },
  { label: 'Crew & Team', path: '/crew' },
  { label: 'Sponsors & Partners', path: '/sponsors' },
  { label: 'Media Gallery', path: '/gallery' },
  { label: 'Contact Us', path: '/contact' },
];

export default function AdminPreviewModal({
  isOpen,
  onClose,
  initialRoute = '/',
}: AdminPreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentPath, setCurrentPath] = useState(initialRoute);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPip, setIsPip] = useState(false); // Small picture-in-picture floating window
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (initialRoute) {
      setCurrentPath(initialRoute);
    }
  }, [initialRoute]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const openInNewTab = () => {
    const url = `${currentPath}?preview=true`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const deviceWidthClasses = {
    desktop: 'w-full max-w-full',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[390px] max-w-full',
  };

  return (
    <div
      className={`fixed z-[100] transition-all duration-300 ${
        isPip
          ? 'bottom-6 right-6 w-[420px] h-[580px] shadow-2xl rounded-2xl border border-white/20 bg-[#161616] overflow-hidden flex flex-col'
          : 'inset-0 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex flex-col'
      }`}
    >
      {/* Top Header / Control Toolbar */}
      <div className="bg-[#1f1f1f] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 text-white shrink-0 rounded-t-xl select-none">
        
        {/* Left: Indicator + Page Selector */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold font-montserrat hidden sm:inline-block">
            Live Preview
          </span>

          {/* Page Dropdown */}
          <div className="relative">
            <select
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
              className="bg-black/40 border border-white/10 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D04741] cursor-pointer"
            >
              {PREVIEW_PAGES.map((p) => (
                <option key={p.path} value={p.path} className="bg-[#1c1c1c] text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Device Switcher (Desktop / Tablet / Mobile) */}
        {!isPip && (
          <div className="hidden md:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                device === 'desktop'
                  ? 'bg-[#D04741] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                device === 'tablet'
                  ? 'bg-[#D04741] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                device === 'mobile'
                  ? 'bg-[#D04741] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>
        )}

        {/* Right: Actions (Refresh, Open Separate Tab, PiP, Close) */}
        <div className="flex items-center gap-1.5">
          {/* Refresh Frame */}
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Reload preview"
          >
            <RotateCw size={14} />
          </button>

          {/* Open in Separate Tab */}
          <button
            onClick={openInNewTab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D04741]/20 hover:bg-[#D04741]/30 text-[#ff817a] border border-[#D04741]/40 text-xs font-bold transition-all shadow-sm"
            title="Open website in full separate browser tab"
          >
            <span>Open in Tab</span>
            <ExternalLink size={13} />
          </button>

          {/* Toggle Picture-in-Picture / Fullscreen */}
          <button
            onClick={() => setIsPip(!isPip)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title={isPip ? 'Expand preview' : 'Minimize to small window'}
          >
            {isPip ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>

          {/* Close Window */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors ml-1"
            title="Close Preview (Esc)"
          >
            <X size={16} />
          </button>
        </div>

      </div>

      {/* Sub-bar Status message */}
      <div className="bg-[#181818] px-4 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono shrink-0">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles size={12} />
          <span>Real-time Draft Mode: Unsaved modifications reflect live</span>
        </span>
        <span className="hidden sm:inline-block text-gray-500">
          Previewing: {currentPath}
        </span>
      </div>

      {/* Iframe Viewport Container */}
      <div className="flex-1 overflow-hidden bg-[#101010] flex items-center justify-center p-2 sm:p-4">
        <div
          className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-background ${
            isPip ? 'w-full' : deviceWidthClasses[device]
          }`}
        >
          <iframe
            ref={iframeRef}
            src={`${currentPath}?preview=true`}
            title="Staraptor Website Preview"
            className="w-full h-full border-none bg-background"
          />
        </div>
      </div>

    </div>
  );
}

