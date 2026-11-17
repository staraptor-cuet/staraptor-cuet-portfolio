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
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminStorageSetupPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'r2' | 'supabase'>('r2');

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

  const r2EnvTemplate = `# Cloudflare R2 Object Storage Credentials
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=staraptor-media
R2_PUBLIC_URL=https://pub-yourbucketid.r2.dev

# Admin Credentials (optional custom login)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=staraptor2026`;

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
    if (status?.provider === 'r2') return 'Cloudflare R2 Storage Active';
    if (status?.provider === 'supabase') return 'Supabase Cloud Storage Active';
    return 'Local Laptop Storage Mode';
  };

  const getProviderBadge = () => {
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
          Monitor your active storage provider and configure Cloudflare R2 or Supabase for 100% persistent cloud image storage.
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
                  ? `Connected to bucket "${status.bucket}". Uploaded media is hosted globally across edge points with zero egress fees.`
                  : 'Files are saved to your local disk (/public/uploads) for offline work. When deploying to Vercel, connect Cloudflare R2 or Supabase below for persistent cloud hosting.'}
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
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('r2')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'r2'
              ? 'bg-[#F38020] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap size={14} />
          <span>Cloudflare R2 (Recommended • 0$ Egress)</span>
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
          <span>Supabase Storage</span>
        </button>
      </div>

      {/* TAB 1: CLOUDFLARE R2 SETUP GUIDE */}
      {activeTab === 'r2' && (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F38020]/20 text-[#F38020] flex items-center justify-center font-bold">
                R2
              </div>
              <h2 className="text-base font-bold text-white font-montserrat">
                Connect Cloudflare R2 (10GB Free • Zero Egress Fees)
              </h2>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#F38020] hover:underline flex items-center gap-1"
            >
              <span>Open Cloudflare Dashboard</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F38020]/20 text-[#F38020] flex items-center justify-center text-[11px] font-bold">1</span>
              Create an R2 Bucket
            </h3>
            <p className="text-xs text-gray-300 ml-7">
              Go to Cloudflare Dashboard → <strong>R2 Object Storage</strong> → Click <strong>Create bucket</strong> → Name it e.g. <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">staraptor-media</code>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F38020]/20 text-[#F38020] flex items-center justify-center text-[11px] font-bold">2</span>
              Enable Public Access (Or Custom Domain)
            </h3>
            <p className="text-xs text-gray-300 ml-7">
              Inside your bucket, go to <strong>Settings</strong> → Scroll to <strong>Public Access</strong> → Click <strong>Allow Public Access</strong> (this gives you a public URL like <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">https://pub-xxxx.r2.dev</code>), or attach a custom domain like <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">media.yourdomain.com</code>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F38020]/20 text-[#F38020] flex items-center justify-center text-[11px] font-bold">3</span>
              Generate R2 API Token
            </h3>
            <p className="text-xs text-gray-300 ml-7">
              Under <strong>R2 Overview</strong> on the right sidebar, click <strong>Manage R2 API Tokens</strong> → Click <strong>Create API token</strong> → Select <strong>Object Read & Write</strong> permissions → Copy the <strong>Access Key ID</strong> and <strong>Secret Access Key</strong>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-7">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 -ml-7">
                <span className="w-5 h-5 rounded-full bg-[#F38020]/20 text-[#F38020] flex items-center justify-center text-[11px] font-bold">4</span>
                Add Environment Variables to Vercel or .env.local
              </h3>
              <button
                onClick={() => copyToClipboard(r2EnvTemplate, 'r2env')}
                className="text-[11px] text-[#F38020] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedKey === 'r2env' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === 'r2env' ? 'Copied Env Vars!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="ml-7 p-4 bg-[#111] rounded-lg border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto">
              {r2EnvTemplate}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: SUPABASE STORAGE SETUP */}
      {activeTab === 'supabase' && (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Database size={20} className="text-[#3ECF8E]" />
              <h2 className="text-base font-bold text-white font-montserrat">
                How to Connect Supabase Cloud Storage
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
                className="text-[11px] text-[#3ECF8E] hover:underline flex items-center gap-1 font-bold cursor-pointer"
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
              Copy your project URL and service/anon key from <strong>Project Settings → API</strong> into your <code className="text-white bg-black/40 px-1.5 py-0.5 rounded font-mono">.env.local</code> and <strong>Vercel Project Settings → Environment Variables</strong>:
            </p>
            <div className="ml-7 p-4 bg-[#111] rounded-lg border border-white/5 space-y-2 text-xs font-mono">
              <div className="text-gray-400"># Cloud Storage & Database Configuration</div>
              <div className="text-[#3ECF8E]">NEXT_PUBLIC_SUPABASE_URL=<span className="text-gray-400">https://your-project-id.supabase.co</span></div>
              <div className="text-[#3ECF8E]">SUPABASE_SERVICE_ROLE_KEY=<span className="text-gray-400">your-service-role-key-here</span></div>
              <div className="text-[#3ECF8E]">SUPABASE_STORAGE_BUCKET=<span className="text-gray-400">staraptor-uploads</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
