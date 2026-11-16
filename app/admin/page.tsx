'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Handshake,
  TrendingUp,
  Image as ImageIcon,
  Plane,
  Cloud,
  CheckCircle,
  ExternalLink,
  PlusCircle,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Home,
  Trophy
} from 'lucide-react';
import { SiteContent } from '@/lib/types';

export default function AdminDashboardPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then((res) => res.json()),
      fetch('/api/auth/session').then((res) => res.json()),
    ])
      .then(([contentData, sessionData]) => {
        setContent(contentData);
        setStorageInfo(sessionData.storage);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading Staraptor Control Center...</p>
      </div>
    );
  }

  const crewCount = content?.crew?.length || 0;
  const leadCount = content?.crew?.filter((m) => m.isLead)?.length || 0;
  const sponsorTiers = content?.sponsors?.length || 0;
  const totalSponsors = content?.sponsors?.reduce((acc, t) => acc + (t.sponsors?.length || 0), 0) || 0;
  const progressCount = content?.progress?.length || 0;
  const galleryCount = content?.gallery?.length || 0;
  const achievementsCount = content?.achievements?.length || 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#201515] to-[#1c1c1c] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D04741]/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D04741]/20 border border-[#D04741]/30 text-[#ff7973] text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield size={12} /> Flight Control Operational
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight mb-2">
            Staraptor CUET Portal
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            Welcome to the dynamic management console. Update team members, add sponsors, upload gallery pictures, update drone technical specs, and sync to Cloud Storage.
          </p>
        </div>
      </div>

      {/* Cloud Storage Status Alert */}
      <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#1c1c1c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl ${storageInfo?.isCloudConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Cloud size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Storage Engine: {storageInfo?.isCloudConnected ? 'Supabase Cloud Storage' : 'Local Laptop Storage'}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                storageInfo?.isCloudConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {storageInfo?.isCloudConnected ? 'Cloud Active' : 'Local Dev Mode'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {storageInfo?.notes || 'Images are stored safely and served to your website.'}
            </p>
          </div>
        </div>
        <Link
          href="/admin/storage-setup"
          className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5"
        >
          <span>Configure Cloud</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Achievements</span>
            <Award size={18} className="text-[#EF5F5A]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-montserrat">{achievementsCount}</div>
          <div className="text-xs text-gray-400 mt-1">
            Posts & milestones
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Crew Members</span>
            <Users size={18} className="text-[#D04741]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-montserrat">{crewCount}</div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{leadCount}</span> Leads appointed
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sponsors</span>
            <Handshake size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-montserrat">{totalSponsors}</div>
          <div className="text-xs text-gray-400 mt-1">
            Across {sponsorTiers} partner tiers
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress Updates</span>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-montserrat">{progressCount}</div>
          <div className="text-xs text-gray-400 mt-1">
            Milestones logged
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gallery Media</span>
            <ImageIcon size={18} className="text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-montserrat">{galleryCount}</div>
          <div className="text-xs text-gray-400 mt-1">
            Active photos & renders
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
          Quick Section Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Home / Landing Page',
              desc: 'Edit hero tagline ("Engineers Bound by Flight"), "We Are Staraptor" section, landing stats counters, proposal link, and contacts.',
              href: '/admin/general',
              icon: Home,
              action: 'Edit Landing Page',
            },
            {
              title: 'Our Progress',
              desc: 'Publish design and testing milestones with photos and status reports.',
              href: '/admin/progress',
              icon: TrendingUp,
              action: 'Update Progress',
            },
            {
              title: 'Achievements & Posts',
              desc: 'Publish social-style updates, awards, milestones, and testing announcements with photos.',
              href: '/admin/achievements',
              icon: Award,
              action: 'Manage Posts',
            },
            {
              title: 'Aircraft Specs (VTOL Model 1)',
              desc: 'Configure STARAPTOR VTOL - V1 dimensions, endurance, payload capacity, avionics, and component bill of materials.',
              href: '/admin/aircraft',
              icon: Plane,
              action: 'Edit Model 1 Specs',
            },
            {
              title: 'Crew & Team',
              desc: 'Add new team members, edit designations, upload profile photos, and assign team leads.',
              href: '/admin/crew',
              icon: Users,
              action: 'Manage Crew',
            },
            {
              title: 'Sponsors & Partners',
              desc: 'Update Title, Platinum, and Gold partners. Upload logos and partner links.',
              href: '/admin/sponsors',
              icon: Handshake,
              action: 'Manage Sponsors',
            },
            {
              title: 'Media Gallery',
              desc: 'Upload drone renders, workshop photos, CFD analyses, and event pictures.',
              href: '/admin/gallery',
              icon: ImageIcon,
              action: 'Manage Gallery',
            },
            {
              title: 'VTOL 2026 Project',
              desc: 'Manage METU VTOL 2026 competition overview, mission requirements, and competition poster.',
              href: '/admin/vtol-2026',
              icon: Trophy,
              action: 'Manage VTOL 2026',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className="bg-[#1c1c1c] border border-white/10 hover:border-[#D04741]/50 rounded-xl p-5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#D04741]/10 text-gray-300 group-hover:text-[#D04741] flex items-center justify-center mb-3 transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#ff6b66] group-hover:text-white">
                  <span>{card.action}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

