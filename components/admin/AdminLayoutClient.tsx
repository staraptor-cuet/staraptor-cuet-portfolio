'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Handshake,
  TrendingUp,
  Image as ImageIcon,
  Plane,
  Trophy,
  Award,
  Sliders,
  Cloud,
  LogOut,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storageStatus, setStorageStatus] = useState<{ isCloudConnected: boolean; provider: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    
    // Check session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace('/admin/login');
        } else if (data.storage) {
          setStorageStatus(data.storage);
        }
      })
      .catch(() => {
        router.replace('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Achievements', href: '/admin/achievements', icon: Award },
    { name: 'Crew Members', href: '/admin/crew', icon: Users },
    { name: 'Sponsors', href: '/admin/sponsors', icon: Handshake },
    { name: 'Progress', href: '/admin/progress', icon: TrendingUp },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Aircraft Specs', href: '/admin/aircraft', icon: Plane },
    { name: 'VTOL 2026', href: '/admin/vtol-2026', icon: Trophy },
    { name: 'General & Stats', href: '/admin/general', icon: Sliders },
    { name: 'Cloud Storage', href: '/admin/storage-setup', icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#1c1c1c] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="Staraptor" width={32} height={32} className="object-contain" />
          <span className="font-bebas text-xl text-white tracking-wider">Staraptor Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white p-2 rounded-lg bg-white/5"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#181818] border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <Image src="/images/logo.svg" alt="Staraptor" fill className="object-contain" />
            </div>
            <div>
              <div className="font-bebas text-2xl text-white tracking-wider leading-none">Staraptor</div>
              <div className="text-[10px] uppercase font-bold text-[#D04741] tracking-widest">Admin Control</div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#D04741] text-white shadow-lg shadow-[#D04741]/20 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#141414]">
          {/* Storage Status Pill */}
          <Link
            href="/admin/storage-setup"
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <Cloud size={14} className={storageStatus?.isCloudConnected ? 'text-emerald-400' : 'text-amber-400'} />
              <span className="font-medium">
                {storageStatus?.isCloudConnected ? 'Supabase Cloud' : 'Local Storage'}
              </span>
            </div>
            {storageStatus?.isCloudConnected ? (
              <CheckCircle2 size={12} className="text-emerald-400" />
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">dev</span>
            )}
          </Link>

          {/* Public Site Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              View Public Website
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
          >
            <LogOut size={14} />
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

