'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  ArrowRight,
  Calendar,
  Share2,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Bookmark,
  Radio,
  ExternalLink
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

  const handleShare = (post: AchievementPost) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description || post.title,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.href}#${post.id}`);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Top / Most recent post (first item or marked as featured)
  const featuredPost = achievements.find((a) => a.featured) || achievements[0];
  const feedPosts = achievements.filter((a) => a.id !== featuredPost?.id);

  return (
    <div className="bg-[#202020] min-h-screen py-12 md:py-20 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
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
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
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
          /* Empty State as requested: "now make it empty" */
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

            <div className="inline-flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/progress"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                <span>View Aircraft Progress</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/admin/achievements"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D04741]/20 hover:bg-[#D04741]/30 text-[#ff807a] text-xs font-semibold border border-[#D04741]/40 transition-colors"
              >
                <span>Post in Admin Portal</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Social / Facebook Post Style Feed */
          <div className="space-y-10 sm:space-y-12 mb-16">
            
            {/* Top / Most Recent Post: BIGGER HERO CARD */}
            {featuredPost && (
              <motion.article
                id={featuredPost.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="rounded-3xl bg-[#1a1a1a] border border-[#D04741]/40 shadow-2xl shadow-[#D04741]/10 overflow-hidden relative group"
              >
                {/* Top Banner Tag */}
                <div className="bg-gradient-to-r from-[#D04741] to-[#EF5F5A] px-6 py-2 text-white flex items-center justify-between text-xs font-bold tracking-wider uppercase">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Latest Official Dispatch</span>
                  </div>
                  <span className="text-[11px] font-mono lowercase opacity-90">
                    pinned to top
                  </span>
                </div>

                <div className="p-6 sm:p-8 md:p-10 space-y-6">
                  
                  {/* FB-Style Author Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-[#141414] border-2 border-[#D04741] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        <Image
                          src="/images/logo.svg"
                          alt="Staraptor Emblem"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base sm:text-lg font-bold text-white font-montserrat">
                            {featuredPost.author || 'Team Staraptor CUET'}
                          </h3>
                          <CheckCircle2 size={16} className="text-[#EF5F5A] fill-[#EF5F5A]/20" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {featuredPost.date}
                          </span>
                          <span>•</span>
                          <span className="text-[#EF5F5A]">Official Release</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Pill */}
                    <div className="flex items-center gap-2">
                      {featuredPost.badge && (
                        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#D04741]/20 border border-[#D04741]/40 text-[#ff8883]">
                          {featuredPost.badge}
                        </span>
                      )}
                      {featuredPost.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 border border-white/10 text-gray-300">
                          #{featuredPost.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-montserrat text-white tracking-tight leading-snug">
                    {featuredPost.title}
                  </h2>

                  {/* Body Content / Story */}
                  <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                    {featuredPost.description && (
                      <p className="font-medium text-white/90 text-base sm:text-lg">
                        {featuredPost.description}
                      </p>
                    )}
                    {featuredPost.content && (
                      <p className="whitespace-pre-line text-gray-300">
                        {featuredPost.content}
                      </p>
                    )}
                  </div>

                  {/* Large High-Res Image (if available) */}
                  {featuredPost.image && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 relative aspect-[16/9] sm:aspect-[21/9] bg-black/50 shadow-inner group-hover:border-white/20 transition-all">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                        priority
                        sizes="(max-width: 1024px) 100vw, 960px"
                      />
                    </div>
                  )}

                  {/* Social Action Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-gray-400">
                        CUET Autonomous Aerospace Division
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(featuredPost)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        <Share2 size={13} />
                        <span>{copiedId === featuredPost.id ? 'Copied Link!' : 'Share Post'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.article>
            )}

            {/* Other Posts Feed */}
            {feedPosts.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                    Previous Dispatches & Archive
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ({feedPosts.length} posts)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {feedPosts.map((post, idx) => (
                    <motion.article
                      key={post.id}
                      id={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#D04741]/50 shadow-xl overflow-hidden flex flex-col justify-between transition-all group"
                    >
                      <div className="p-6 space-y-4">
                        
                        {/* Post Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#D04741]/60 p-1 flex items-center justify-center shrink-0">
                              <Image
                                src="/images/logo.svg"
                                alt="Staraptor"
                                width={22}
                                height={22}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <h4 className="text-xs font-bold text-white font-montserrat">
                                  {post.author || 'Team Staraptor CUET'}
                                </h4>
                                <CheckCircle2 size={13} className="text-[#EF5F5A]" />
                              </div>
                              <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                                <Calendar size={11} /> {post.date}
                              </span>
                            </div>
                          </div>

                          {post.badge && (
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                              {post.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold font-montserrat text-white group-hover:text-[#ff7872] transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt / Story */}
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {post.description || post.content}
                        </p>

                        {/* Attached Image */}
                        {post.image && (
                          <div className="rounded-xl overflow-hidden border border-white/10 relative aspect-[16/9] bg-black/40 mt-3">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 450px"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Card Footer */}
                      <div className="px-6 py-3.5 bg-black/20 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="text-[#EF5F5A] font-mono">
                          {post.category ? `#${post.category}` : '#StaraptorCUET'}
                        </span>
                        <button
                          onClick={() => handleShare(post)}
                          className="hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Share2 size={12} />
                          <span>{copiedId === post.id ? 'Copied!' : 'Share'}</span>
                        </button>
                      </div>

                    </motion.article>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Call to Action Banner (Fixed & Tightened Padding as shown in screenshot) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-r from-[#2a1d1d] to-[#1c1c1c] border border-[#D04741]/30 px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl"
        >
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-white font-bold text-lg sm:text-xl font-montserrat">
              Join Our Journey to METU VTOL 2026
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Discover the students, faculty, and industry partners pushing Bangladesh&apos;s aerospace frontier.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
            <Button asChild size="sm" className="rounded-xl font-bold px-5 py-2.5 h-auto text-xs whitespace-nowrap shadow-md">
              <Link href="/crew" className="inline-flex items-center gap-1.5">
                <span>Meet the Crew</span>
                <ArrowRight size={14} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl font-bold px-5 py-2.5 h-auto text-xs whitespace-nowrap border-white/20 text-white hover:bg-white/10">
              <Link href="/sponsors">
                Sponsors
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
