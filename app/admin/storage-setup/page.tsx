'use client';

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Upload,
  Database,
  ShieldCheck,
  Check,
  Server
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminStorageSetupPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.storage) setStatus(data.storage);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sqlSnippet = `-- 1. Create table for persisting dynamic content in Supabase
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Allow public read access (for website visitors)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Service Role Full Access"
  ON site_content FOR ALL
  USING (true);
`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-montserrat">Cloud Storage & Vercel Sync</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor your active storage provider and configure Supabase for 100% persistent cloud storage when hosted on Vercel.
        </p>
      </div>

      {/* Current Active Engine Status */}
      <div className={`p-6 rounded-2xl border ${
        status?.isCloudConnected
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : 'bg-[#1c1c1c] border-white/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl ${
              status?.isCloudConnected
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              <Cloud size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {status?.isCloudConnected
                    ? 'Supabase Cloud Storage Active'
                    : 'Local Laptop Storage Mode'}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  status?.isCloudConnected
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {status?.isCloudConnected ? 'Cloud Production Ready' : 'Local Development'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {status?.isCloudConnected
                  ? `Connected to bucket "${status.bucket || 'staraptor-uploads'}". Uploaded images are hosted globally on Supabase CDN.`
                  : 'Files are saved to your local disk (/public/uploads) so you can test all features offline. When deploying to Vercel, connect free Supabase credentials below for persistent cloud hosting.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Live Upload */}
      <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} className="text-[#D04741]" />
          Test File Upload
        </h2>
        <p className="text-xs text-gray-400">
          Upload any test image to verify that your active storage provider is functioning correctly:
        </p>
        <ImageUploader
          label="Test Image"
          value={testImageUrl}
          onChange={(url) => setTestImageUrl(url)}
        />
        {testImageUrl && (
          <div className="p-3 bg-white/5 rounded-lg text-xs font-mono text-emerald-400 break-all">
            Uploaded URL: {testImageUrl}
          </div>
        )}
      </div>

      {/* Supabase Free Setup Guide */}
      <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Database size={20} className="text-[#3ECF8E]" />
            <h2 className="text-base font-bold text-white font-montserrat">
              How to Connect Free Supabase Cloud Storage (3 Minutes)
            </h2>
          </div>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#3ECF8E] hover:underline flex items-center gap-1"
          >
            <span>Open Supabase</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Step 1 */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[11px] font-bold">1</span>
            Create a Free Project
          </h3>
          <p className="text-xs text-gray-300 ml-7">
            Log in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#ff7973] underline">supabase.com</a> and click <strong>New project</strong> (name it e.g. <code>staraptor-club</code>).
          </p>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[11px] font-bold">2</span>
            Create Cloud Storage Bucket
          </h3>
          <p className="text-xs text-gray-300 ml-7">
            Go to <strong>Storage</strong> in the left sidebar → Click <strong>New Bucket</strong> → Name it <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">staraptor-uploads</code> → Toggle <strong>Public bucket: ON</strong>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-7">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 -ml-7">
              <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[11px] font-bold">3</span>
              Run Database SQL Setup
            </h3>
            <button
              onClick={() => copyToClipboard(sqlSnippet, 'sql')}
              className="text-[11px] text-[#3ECF8E] hover:underline flex items-center gap-1 font-bold"
            >
              {copiedKey === 'sql' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedKey === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-300 ml-7">
            Go to <strong>SQL Editor</strong> in Supabase, paste this query and click <strong>Run</strong>:
          </p>
          <pre className="ml-7 p-3 bg-[#111] rounded-lg border border-white/5 text-[11px] font-mono text-gray-300 overflow-x-auto">
            {sqlSnippet}
          </pre>
        </div>

        {/* Step 4 */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[11px] font-bold">4</span>
            Add Environment Variables
          </h3>
          <p className="text-xs text-gray-300 ml-7">
            Copy your project URL and service/anon key from <strong>Project Settings → API</strong> into your <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">.env.local</code> (for your laptop) and into <strong>Vercel Project Settings → Environment Variables</strong>:
          </p>
          <div className="ml-7 p-4 bg-[#111] rounded-lg border border-white/5 space-y-2 text-xs font-mono">
            <div className="text-gray-400"># Cloud Storage & Database Configuration</div>
            <div className="text-[#3ECF8E]">NEXT_PUBLIC_SUPABASE_URL=<span className="text-gray-400">https://your-project-id.supabase.co</span></div>
            <div className="text-[#3ECF8E]">SUPABASE_SERVICE_ROLE_KEY=<span className="text-gray-400">your-service-role-key-here</span></div>
            <div className="text-[#3ECF8E]">SUPABASE_STORAGE_BUCKET=<span className="text-gray-400">staraptor-uploads</span></div>
            <div className="text-gray-400 mt-2"># Admin Credentials (Optional customize)</div>
            <div className="text-[#ff7973]">ADMIN_USERNAME=<span className="text-gray-400">admin</span></div>
            <div className="text-[#ff7973]">ADMIN_PASSWORD=<span className="text-gray-400">staraptor2026</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

