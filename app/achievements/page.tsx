'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  ArrowRight,
  Calendar,
  Share2,
  CheckCircle2,
  Sparkles,
  Radio,
  ExternalLink,
  X,
  Pin,
  Maximize2,
  Eye,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/lib/useContent';
import { AchievementPost } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function AchievementsPage() {
  const { content, loading } = useSiteContent();
  const achievements: AchievementPost[] = content?.achievements || [];

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<AchievementPost | null>(null);

  // Check URL hash for direct links (e.g. #ach-123)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && achievements.length > 0) {
      const targetId = window.location.hash.replace('#', '');
      const matched = achievements.find((a) => a.id === targetId);
      if (matched) setSelectedPost(matched);
    }
  }, [achievements]);

  // Lock body scroll when full post modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  const handleShare = (post: AchievementPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.description || post.title,
          url: `${window.location.origin}/achievements#${post.id}`,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/achievements#${post.id}`);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Determine Featured Post (admin chosen or first item)
  const featuredPost = achievements.find((a) => a.featured) || achievements[0];

  // Rest of posts: sorted so pinned items are first, then recents
  const feedPosts = achievements
    .filter((a) => a.id !== featuredPost?.id)
    .sort((a, b) => {
      // Pinned posts first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then newest date / createdAt first
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="bg-[#202020] min-h-screen py-10 md:py-16 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Official Dispatches & Milestones
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Achievements
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Follow flight test milestones, national firsts, engineering breakthroughs, and competition updates directly from Team Staraptor CUET.
          </p>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-gray-400 font-mono">Connecting to telemetry feed...</p>
          </div>
        ) : achievements.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 p-8 sm:p-14 rounded-3xl bg-[#181818] border border-white/10 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D04741]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EF5F5A] mx-auto mb-5 shadow-inner">
              <Radio size={28} className="animate-pulse" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold block mb-2">
              Transmission Standby
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat mb-3">
              No Achievement Posts Published Yet
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto mb-8">
              Team Staraptor CUET is currently undergoing active airframe fabrication, CFD aerodynamic validation, and autonomous tilt-rotor flight simulations. Live milestones, competition field logs, and honors will appear here.
            </p>

            <div className="flex items-center justify-center">
              <Link
                href="/progress"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                <span>View Aircraft Progress</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12 sm:space-y-16 mb-16">
            
            {/* Top Featured Post: 2-Column Split Hero with Fixed Box & "See more..." */}
            {featuredPost && (
              <motion.article
                id={featuredPost.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="rounded-3xl bg-[#1a1a1a] border border-[#D04741]/40 shadow-2xl shadow-[#D04741]/10 overflow-hidden relative group"
              >
                {/* Top Banner Tag */}
                <div className="bg-gradient-to-r from-[#D04741] to-[#EF5F5A] px-5 sm:px-7 py-2.5 text-white flex items-center justify-between text-xs font-bold tracking-wider uppercase">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Featured Official Dispatch</span>
                  </div>
                  <span className="text-[11px] font-mono lowercase opacity-90 hidden sm:inline">
                    pinned to top
                  </span>
                </div>

                <div className="p-5 sm:p-7 md:p-8">
                  {/* Two-Column Split: Left Side Post Image & Title, Right Side Description & See More */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                    
                    {/* Left Column: Post Image + Title */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                      {/* Image Box */}
                      <div
                        onClick={() => setSelectedPost(featuredPost)}
                        className="relative w-full h-56 sm:h-64 lg:h-72 rounded-2xl overflow-hidden bg-black/60 border border-white/10 group-hover:border-[#D04741]/50 transition-all duration-300 cursor-pointer shadow-inner shrink-0"
                      >
                        {featuredPost.image ? (
                          <Image
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority
                            sizes="(max-width: 1024px) 100vw, 480px"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-[#241a1a] to-[#121212]">
                            <Award size={48} className="text-[#D04741] mb-2 opacity-60" />
                            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Team Staraptor CUET</span>
                          </div>
                        )}

                        {/* Scrims */}
                        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                        {/* Top Badges on Image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                          {featuredPost.category && (
                            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                              #{featuredPost.category}
                            </span>
                          )}
                          {featuredPost.badge && (
                            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#D04741] border border-[#ff6660] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                              {featuredPost.badge}
                            </span>
                          )}
                        </div>

                        {/* Date badge bottom-right */}
                        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                          <Calendar size={11} className="text-[#EF5F5A]" />
                          <span>{featuredPost.date}</span>
                        </div>

                        {/* Hover Quick Zoom */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          <div className="p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/30 text-white shadow-2xl group-hover:scale-110 transition-transform">
                            <Maximize2 size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Post Title Under Image */}
                      <div>
                        <h2
                          onClick={() => setSelectedPost(featuredPost)}
                          className="text-xl sm:text-2xl font-extrabold font-montserrat text-white tracking-tight leading-snug group-hover:text-[#ff7872] transition-colors cursor-pointer"
                        >
                          {featuredPost.title}
                        </h2>
                      </div>
                    </div>

                    {/* Right Column: Author Header, Fixed Description Box with "See more...", and Footer */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4 pt-1 lg:pt-0">
                      
                      {/* Author Header */}
                      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#141414] border-2 border-[#D04741] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                            <Image
                              src="/images/logo.svg"
                              alt="Staraptor Emblem"
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-white font-montserrat">
                                {featuredPost.author || 'Team Staraptor CUET'}
                              </h3>
                              <CheckCircle2 size={15} className="text-[#EF5F5A] fill-[#EF5F5A]/20" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                              <span>Official Dispatch</span>
                              <span>•</span>
                              <span className="text-gray-300">{featuredPost.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Share Button Top */}
                        <button
                          onClick={(e) => handleShare(featuredPost, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-xs shrink-0"
                          title="Share Dispatch"
                        >
                          <Share2 size={13} />
                          <span>{copiedId === featuredPost.id ? 'Copied Link!' : 'Share'}</span>
                        </button>
                      </div>

                      {/* Fixed Description & Content Box with "See more..." */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="relative rounded-2xl bg-[#141414]/70 border border-white/5 p-4 sm:p-5">
                          {/* Text Snippet clamped to avoid card expanding infinitely */}
                          <div className="space-y-3">
                            {featuredPost.description && (
                              <p className="font-semibold text-white/95 text-base leading-relaxed line-clamp-2">
                                {featuredPost.description}
                              </p>
                            )}

                            {/* Full Content Preview clamped to 4 lines */}
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 whitespace-pre-line font-sans">
                              {featuredPost.content || featuredPost.description || 'No detailed dispatches provided.'}
                            </p>
                          </div>

                          {/* "See more..." trigger if content is longer */}
                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedPost(featuredPost)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EF5F5A] hover:text-[#ff7e79] transition-colors group/btn"
                            >
                              <span>See more...</span>
                              <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <span className="text-[11px] font-mono text-gray-500">
                              Click to view full dispatch
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer Actions */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                        <span className="font-mono text-gray-400 text-[11px]">
                          CUET Autonomous Aerospace Division
                        </span>

                        <Button
                          onClick={() => setSelectedPost(featuredPost)}
                          className="bg-gradient-to-r from-[#D04741] to-[#EF5F5A] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#D04741]/20"
                        >
                          <BookOpen size={14} />
                          <span>Open Full Post</span>
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Rest of Posts: Instagram Profile Style (Each row 4 post boxes) */}
            {feedPosts.length > 0 && (
              <div className="space-y-6">
                
                {/* Archive Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF5F5A]" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                      Dispatches Archive
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ({feedPosts.length} posts)
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
                    Pinned first • Chronological order
                  </span>
                </div>

                {/* 4 Posts Per Row Grid (Instagram Profile Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {feedPosts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      id={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      onClick={() => setSelectedPost(post)}
                      className="rounded-2xl bg-[#181818] border border-white/10 hover:border-[#D04741]/60 shadow-lg hover:shadow-2xl hover:shadow-[#D04741]/10 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Square Image Box (1:1 Instagram style) */}
                      <div className="relative aspect-square w-full bg-[#121212] overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-108 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#221818] to-[#121212]">
                            <Award size={36} className="text-[#D04741] opacity-70 mb-2" />
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                              Dispatch
                            </span>
                          </div>
                        )}

                        {/* Dual Scrim Gradients for guaranteed contrast on any image */}
                        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
                          {post.pinned ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] font-mono flex items-center gap-1 shadow-md">
                              <Pin size={10} className="fill-black" />
                              <span>PINNED</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] uppercase font-bold tracking-wider shadow">
                              #{post.category || 'Milestone'}
                            </span>
                          )}

                          {post.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#D04741] text-white font-mono text-[9px] uppercase font-bold tracking-wider shadow truncate max-w-[120px]">
                              {post.badge}
                            </span>
                          )}
                        </div>

                        {/* Date badge on bottom-right of square */}
                        <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[9px] font-mono font-semibold flex items-center gap-1 shadow">
                          <Calendar size={10} className="text-[#EF5F5A]" />
                          <span>{post.date}</span>
                        </div>

                        {/* Instagram-style Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <div className="px-3 py-1.5 rounded-full bg-black/80 border border-white/30 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                            <Eye size={13} />
                            <span>Read Post</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Snippet Under Photo */}
                      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <h3 className="font-montserrat font-bold text-white text-sm line-clamp-2 group-hover:text-[#EF5F5A] transition-colors leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                            {post.description || post.content || 'Click to view full dispatch.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                          <span className="truncate max-w-[140px] font-mono">
                            {post.author || 'Team Staraptor'}
                          </span>
                          <span className="text-[#EF5F5A] font-bold group-hover:underline flex items-center gap-0.5 shrink-0">
                            <span>More</span>
                            <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* Full Page Post Reader Modal (Opens when clicking "See more..." or any card) */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-[#181818] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
            >
              {/* Header Bar */}
              <div className="px-6 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#181818] border-2 border-[#D04741] p-1 flex items-center justify-center shrink-0">
                    <Image
                      src="/images/logo.svg"
                      alt="Staraptor"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white font-montserrat">
                        {selectedPost.author || 'Team Staraptor CUET'}
                      </h4>
                      <CheckCircle2 size={14} className="text-[#EF5F5A] fill-[#EF5F5A]/20" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                      <span>{selectedPost.date}</span>
                      <span>•</span>
                      <span className="text-[#EF5F5A]">Official Release</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShare(selectedPost, e)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Share Link"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedPost.pinned && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-xs font-mono flex items-center gap-1">
                      <Pin size={11} className="fill-black" />
                      <span>PINNED</span>
                    </span>
                  )}
                  {selectedPost.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#D04741]/20 border border-[#D04741]/40 text-[#ff8883]">
                      {selectedPost.badge}
                    </span>
                  )}
                  {selectedPost.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 border border-white/10 text-gray-300">
                      #{selectedPost.category}
                    </span>
                  )}
                </div>

                {/* Full Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat text-white leading-tight">
                  {selectedPost.title}
                </h2>

                {/* Hero Photo (if exists) */}
                {selectedPost.image && (
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-inner">
                    <Image
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  </div>
                )}

                {/* Highlight Description (if available) */}
                {selectedPost.description && (
                  <div className="border-l-3 border-[#D04741] pl-4 py-1">
                    <p className="text-base sm:text-lg font-semibold text-white/95 leading-relaxed">
                      {selectedPost.description}
                    </p>
                  </div>
                )}

                {/* Full Long Content with whitespace preservation */}
                {selectedPost.content && (
                  <div className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                    {selectedPost.content}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs text-gray-400 shrink-0">
                <span className="font-mono text-[11px]">
                  CUET Autonomous Aerospace Division
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShare(selectedPost, e)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    {copiedId === selectedPost.id ? 'Copied Link!' : 'Share Post'}
                  </button>
                  <Button
                    onClick={() => setSelectedPost(null)}
                    className="bg-[#D04741] hover:bg-[#b83c37] text-white text-xs px-4 py-1.5 rounded-lg font-semibold"
                  >
                    Done
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
