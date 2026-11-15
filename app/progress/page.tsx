'use client';

import { motion } from 'framer-motion';
import { NotchedProjectCard } from '@/components/ui/notched-project-card';
import { Badge } from '@/components/ui/badge';

export default function ProgressPage() {
  return (
    <div className="bg-[#202020] min-h-screen py-16 md:py-24 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
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
            Follow Team Staraptor CUET&apos;s active aircraft developments, fabrication milestones, and next-generation autonomous flight initiatives.
          </p>
        </motion.div>

        {/* Notched Project Cards Grid */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
                ENGINEERING FLEET
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-white">
                Active & Upcoming Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hidden sm:inline-block">
              CUET Autonomous Aerospace Lab
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Project 1: Model 1 */}
            <NotchedProjectCard
              href="/vtol-2026?model=1#model-1"
              title="METU VTOL 2026 — Model 1"
              description="Flagship hybrid tilt-rotor VTOL drone. Features carbon-composite airframe, Eppler E205 aerodynamic airfoil, and Pixhawk autonomous flight control."
              image="/images/progress image.jpg"
              screen={{
                src: "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png",
                alt: "Staraptor VTOL Model 1",
                className: "drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]",
              }}
              badge="Active Prototype"
              tags={["Hybrid VTOL", "Tilt-Rotor", "METU 2026", "Flight Ready"]}
              surface="#202020"
              accent="#D04741"
              accentForeground="#ffffff"
            />

            {/* Project 2: Model 2 */}
            <NotchedProjectCard
              href="/vtol-2026?model=2#model-2"
              title="Staraptor VTOL — Model 2"
              description="Next-generation heavy-lift VTOL platform engineered for 120+ minute extended maritime endurance and automated target detection algorithms."
              image="/images/homepage bg 1.png"
              badge="Coming Soon"
              tags={["Next-Gen", "Heavy-Lift", "Extended Range", "AI Vision"]}
              surface="#202020"
              accent="#D04741"
              accentForeground="#ffffff"
            />

            {/* Project 3: Autonomous Drone Swarm */}
            <NotchedProjectCard
              href="#future"
              title="Autonomous Drone Swarm"
              description="Cooperative multi-agent formation flight and wireless mesh networking algorithms for rapid search-and-rescue and wide-area coastal surveillance."
              image="https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop"
              badge="Research Phase"
              tags={["Swarm AI", "Mesh Network", "Research Division"]}
              surface="#202020"
              accent="#D04741"
              accentForeground="#ffffff"
            />

          </div>
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