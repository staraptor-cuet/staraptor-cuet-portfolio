'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { NotchedProjectCard } from '@/components/ui/notched-project-card';
import { Badge } from '@/components/ui/badge';
import { useSiteContent } from '@/lib/useContent';

export default function ProgressPage() {
  const { content, loading } = useSiteContent();
  const progressItems = content?.progress || [];

  return (
    <div className="bg-[#202020] min-h-screen py-16 md:py-24 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Aircraft Fleet & Roadmap
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Our Progress
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Follow Team Staraptor CUET&apos;s active aircraft developments, fabrication milestones, and autonomous flight initiatives.
          </p>
        </motion.div>

        {/* Single Featured Project Card */}
        <div className="w-full max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
                FEATURED PROJECT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white">
                Active Aerospace Platform
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hidden sm:inline-block">
              CUET Autonomous Aerospace Lab
            </span>
          </div>

          <NotchedProjectCard
            href="/vtol-2026"
            title="METU VTOL 2026 — Staraptor V1"
            description="Flagship hybrid tilt-rotor VTOL aircraft engineered for the 9th METU Competition. Combines fixed-wing aerodynamic cruise speed with vertical hover precision and autonomous maritime delivery."
            image="/images/progress image.jpg"
            dim={0.35}
            screen={{
              src: "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png",
              alt: "Staraptor VTOL Aircraft",
            }}
            badge="METU 2026 Active Prototype"
            tags={["Hybrid VTOL", "Tilt-Rotor", "Model 1 Active", "Model 2 In Dev", "Autonomous"]}
            surface="#202020"
            accent="#D04741"
            accentForeground="#ffffff"
          />
        </div>

        {/* Dynamic Progress Timeline (from Admin Panel) */}
        {progressItems.length > 0 && (
          <div className="w-full max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                Development Milestones Timeline
              </span>
            </div>

            <div className="space-y-6">
              {progressItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#D04741]/40 transition-all flex flex-col md:flex-row gap-6 items-start"
                >
                  {item.image && (
                    <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden relative shrink-0 bg-black/40 border border-white/10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Calendar size={13} className="text-[#EF5F5A]" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-montserrat">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <motion.p
          className="text-gray-400 text-sm sm:text-base text-center max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Continuous updates will be published as testing progresses toward the METU VTOL 2026 competition.
        </motion.p>
      </div>
    </div>
  );
}
