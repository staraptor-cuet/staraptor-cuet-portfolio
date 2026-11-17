'use client';

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Copy,
  ExternalLink,
  Upload,
  Database,
  Check,
  Zap,
  Sparkles,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminStorageSetupPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'cloudinary' | 'r2' | 'supabase'>('cloudinary');

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

  const cloudinaryEnvTemplate = `# Cloudinary Credentials (25 GB Free • No Credit Card Required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (optional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=staraptor2026`;

  const r2EnvTemplate = `# Cloudflare R2 Object Storage Credentials
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=staraptor-media
R2_PUBLIC_URL=https://pub-yourbucketid.r2.dev`;

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

  const getProviderTitle = () => {
    if (status?.provider === 'cloudinary') return 'Cloudinary Storage Active (25 GB Free)';
    if (status?.provider === 'r2') return 'Cloudflare R2 Storage Active';
    if (status?.provider === 'supabase') return 'Supabase Cloud Storage Active';
    return 'Local Laptop Storage Mode';
  };

  const getProviderBadge = () => {
    if (status?.provider === 'cloudinary') return 'Cloudinary Active (25 GB Free • Global CDN)';
    if (status?.provider === 'r2') return 'Cloudflare R2 (Zero Egress Fees)';
    if (status?.provider === 'supabase') return 'Supabase Cloud Storage';
    return 'Local Development (/public/uploads)';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-montserrat">Cloud Storage & Media Sync</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor your active storage provider and configure Cloudinary (25 GB Free with No Card) or Cloudflare R2 for persistent cloud image hosting.
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
                  {getProviderTitle()}
                </h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  status?.isCloudConnected
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {getProviderBadge()}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {status?.isCloudConnected
                  ? `Connected to "${status.bucket || 'cloud'}". Uploaded media is stored in the cloud and served through high-speed CDN.`
                  : 'Files are saved to your local disk (/public/uploads) for offline work. Connect Cloudinary below for 25 GB of free persistent cloud hosting with zero credit card.'}
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

      {/* Cloud Provider Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('cloudinary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cloudinary'
              ? 'bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles size={14} />
          <span>Cloudinary (Recommended • 25 GB Free • No Card)</span>
        </button>

        <button
          onClick={() => setActiveTab('r2')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'r2'
              ? 'bg-[#F38020] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap size={14} />
          <span>Cloudflare R2 (10 GB)</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-[#3ECF8E] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database size={14} />
          <span>Supabase (1 GB)</span>
        </button>
      </div>

      {/* TAB 1: CLOUDINARY (RECOMMENDED - 25GB FREE) */}
      {activeTab === 'cloudinary' && (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D04741]/20 text-[#EF5F5A] flex items-center justify-center font-bold">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-montserrat">
                  Connect Cloudinary (25 GB Free • No Card Required)
                </h2>
                <p className="text-xs text-gray-400">
                  Specialized image cloud with automatic WebP conversion and high-speed global CDN.
                </p>
              </div>
            </div>
            <a
              href="https://cloudinary.com/users/register_free"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#EF5F5A] hover:underline flex items-center gap-1"
            >
              <span>Sign Up Free</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D04741]/20 text-[#EF5F5A] flex items-center justify-center text-[11px] font-bold">1</span>
              Create Free Account (30 Seconds)
            </h3>
            <p className="text-xs text-gray-300 ml-7">
              Go to <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noreferrer" className="text-[#EF5F5A] underline">cloudinary.com</a> $\rightarrow$ Click <strong>Sign up with Google or GitHub</strong>. Zero credit card or billing details required.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D04741]/20 text-[#EF5F5A] flex items-center justify-center text-[11px] font-bold">2</span>
              Copy Your 3 API Keys
            </h3>
            <p className="text-xs text-gray-300 ml-7">
              On your Cloudinary Dashboard home screen, you will see your <strong>Product Environment Credentials</strong> box with:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-300 ml-9 space-y-1">
              <li><strong>Cloud Name</strong></li>
              <li><strong>API Key</strong></li>
              <li><strong>API Secret</strong> (click copy or view)</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-7">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 -ml-7">
                <span className="w-5 h-5 rounded-full bg-[#D04741]/20 text-[#EF5F5A] flex items-center justify-center text-[11px] font-bold">3</span>
                Paste Into .env.local and Vercel Environment Variables
              </h3>
              <button
                onClick={() => copyToClipboard(cloudinaryEnvTemplate, 'cldenv')}
                className="text-[11px] text-[#EF5F5A] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedKey === 'cldenv' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === 'cldenv' ? 'Copied Template!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="ml-7 p-4 bg-[#111] rounded-lg border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto">
              {cloudinaryEnvTemplate}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUDFLARE R2 */}
      {activeTab === 'r2' && (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F38020]/20 text-[#F38020] flex items-center justify-center font-bold">
                R2
              </div>
              <h2 className="text-base font-bold text-white font-montserrat">
                Connect Cloudflare R2 (10 GB Free • Zero Egress Fees)
              </h2>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#F38020] hover:underline flex items-center gap-1"
            >
              <span>Open Cloudflare</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F38020]/20 text-[#F38020] flex items-center justify-center text-[11px] font-bold">1</span>
              Environment Variables for R2
            </h3>
            <pre className="ml-7 p-4 bg-[#111] rounded-lg border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto">
              {r2EnvTemplate}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: SUPABASE */}
      {activeTab === 'supabase' && (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Database size={20} className="text-[#3ECF8E]" />
              <h2 className="text-base font-bold text-white font-montserrat">
                Supabase Storage (1 GB)
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

          <pre className="p-4 bg-[#111] rounded-lg border border-white/5 text-[11px] font-mono text-gray-300 overflow-x-auto">
            {sqlSnippet}
          </pre>
        </div>
      )}
    </div>
  );
}
