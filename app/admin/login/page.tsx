'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'login' | 'forgot'
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  
  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccessMsg('Your password has been updated successfully! Please sign in with your new password.');
    }
  }, [searchParams]);

  // Handle Login (Supports both Supabase Auth & Local Fallback)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: identifier, 
          email: identifier.includes('@') ? identifier : undefined,
          password 
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Wrong password');
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

  // Handle Forgot Password (Sends email via Supabase Auth)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase Auth is not configured yet. Please add your Supabase URL & Key in .env.local.');
      return;
    }

    setLoading(true);

    try {
      const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectUrl = `${siteOrigin}/admin/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccessMsg(`A password reset link has been sent to ${resetEmail}. Please check your inbox and spam folder.`);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
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
            {mode === 'login' ? 'Club Content Management & Cloud Control' : 'Reset Your Admin Password'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin or your-email@gmail.com"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMsg('');
                    setMode('forgot');
                  }}
                  className="text-xs text-[#EF5F5A] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
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


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D04741] to-[#b03934] hover:from-[#e35651] hover:to-[#c43f3a] text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-all shadow-lg shadow-[#D04741]/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          /* MODE 2: FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Enter your registered admin email address. We will send you a secure link to reset your password.
              </p>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@cuet.ac.bd"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D04741] to-[#b03934] hover:from-[#e35651] hover:to-[#c43f3a] text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-all shadow-lg shadow-[#D04741]/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <KeyRound size={16} />
              <span>{loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccessMsg('');
                setMode('login');
              }}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#111] flex items-center justify-center text-gray-400">Loading...</div>}>
      <AdminLoginContent />
    </React.Suspense>
  );
}
