'use client';

import { motion } from 'framer-motion';
import { NotchedProjectCard } from '@/components/ui/notched-project-card';
import { Badge } from '@/components/ui/badge';

export default function ProgressPage() {
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
        <div className="w-full max-w-2xl mx-auto">
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

        {/* Footer Note */}
        <motion.p
          className="text-gray-400 text-sm sm:text-base mt-20 text-center"
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