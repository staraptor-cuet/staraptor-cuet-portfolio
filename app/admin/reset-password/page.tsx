'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      setError('Supabase is not configured yet. Please check your environment variables.');
      setReady(true);
      return;
    }

    // Check for Supabase auth recovery session
    const checkSession = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        // Listen for PASSWORD_RECOVERY event
        const { data: { subscription } } = client.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (event === 'PASSWORD_RECOVERY' || currentSession) {
              setReady(true);
            }
          }
        );
        // Timeout check: allow user to attempt even if auth listener takes a moment
        setTimeout(() => setReady(true), 1500);
        return () => subscription.unsubscribe();
      }
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      setError('Supabase is not configured.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } = await client.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/admin/login?reset=success');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
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
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/images/logo.svg" alt="Staraptor Logo" fill className="object-contain" priority />
          </div>
          <h1 className="font-bebas text-3xl tracking-widest text-white uppercase mb-1">
            Set New Password
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Staraptor Admin Recovery
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Password Changed Successfully!</h2>
            <p className="text-xs text-gray-400 mb-6">
              Your new password is now active. Redirecting you to the admin login page...
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D04741] text-white text-xs font-bold hover:bg-[#b83c37] transition-all"
            >
              <span>Go to Login</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D04741] transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full bg-gradient-to-r from-[#D04741] to-[#b03934] hover:from-[#e35651] hover:to-[#c43f3a] text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-all shadow-lg shadow-[#D04741]/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/admin/login" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
