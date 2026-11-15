'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('staraptor2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login request failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D04741] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#b03934] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1c1c1c] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src="/images/logo.svg" alt="Staraptor Logo" fill className="object-contain" priority />
          </div>
          <h1 className="font-bebas text-3xl tracking-widest text-white uppercase mb-1">
            Staraptor Admin
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Club Content Management & Cloud Control
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Quick preset badge for local testing */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Default Local Dev Access:
            </span>
            <span className="font-mono text-gray-300">admin / staraptor2026</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D04741] to-[#b03934] hover:from-[#e35651] hover:to-[#c43f3a] text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-all shadow-lg shadow-[#D04741]/25 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
