'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Calendar, Rocket, Sparkles, Plane, Layers, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProgressPage() {
  const { content } = useSiteContent();
  const progressList = content?.progress || [
    {
      id: 'default',
      title: 'Our Progress',
      date: '2026',
      description: 'More coming soon...',
      image: '/images/progress image.jpg',
    },
  ];

  return (
    <div className="bg-background min-h-screen py-16 md:py-24 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Milestones & Initiatives
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Our Progress
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Explore our engineering progress, fabrication roadmap, and flagship aircraft development projects.
          </p>
        </motion.div>

        {/* Projects Section Under Our Progress: VTOL 2026 (Model 1 & 2) and More Soon */}
        <div className="w-full mb-16">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
                ENGINEERING PROJECTS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white">
                Active & Upcoming Fleet
              </h2>
            </div>
            <Badge variant="outline" className="border-white/10 text-gray-400 text-xs font-mono">
              CUET Drone Lab
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* VTOL 2026 Project Card (Model 1 & Model 2) */}
            <Card className="bg-[#1c1c1c] border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#D04741]/50 transition-all group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#D04741]/15 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A]">
                      <Rocket size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#ff7973] transition-colors">
                        METU VTOL 2026
                      </h3>
                      <span className="text-xs text-gray-400">Flagship Competition UAV</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20">
                    Active
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Hybrid tilt-rotor VTOL design combining fixed-wing cruise speed with quadrotor vertical takeoff for simulated offshore maritime delivery.
                </p>

                {/* Sub-models: Model 1 & Model 2 */}
                <div className="space-y-2 mb-6">
                  <Link
                    href="/vtol-2026?model=1#model-1"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#232323] hover:bg-[#282828] border border-white/5 transition-colors group/item"
                  >
                    <div className="flex items-center gap-3">
                      <Plane size={16} className="text-[#EF5F5A]" />
                      <div>
                        <span className="text-xs font-bold text-white block">Model 1 (Staraptor V1)</span>
                        <span className="text-[11px] text-gray-400">Full avionics, 3D model & engineering specs</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-gray-400 group-hover/item:text-white transition-colors" />
                  </Link>

                  <Link
                    href="/vtol-2026?model=2#model-2"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#232323] hover:bg-[#282828] border border-white/5 transition-colors group/item"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={16} className="text-yellow-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">Model 2</span>
                        <span className="text-[11px] text-gray-400">Extended-range heavy-lift platform</span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#D04741]/20 text-[#EF5F5A] font-bold border border-[#D04741]/30">
                      Coming Soon
                    </span>
                  </Link>
                </div>
              </div>

              <Button asChild size="default" className="w-full rounded-xl font-bold">
                <Link href="/vtol-2026" className="gap-2 justify-center">
                  <span>Explore VTOL 2026 Platform</span>
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </Card>

            {/* More Projects Coming Soon Card */}
            <Card className="bg-[#1c1c1c] border-white/10 p-6 rounded-2xl flex flex-col justify-between border-dashed hover:border-white/20 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Future UAV Projects
                      </h3>
                      <span className="text-xs text-gray-400">Research & Swarm Division</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400 font-bold">
                    Planned
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Following the METU 2026 competition, Team Staraptor will expand into autonomous formation swarming, solar-assisted long endurance UAVs, and emergency payload deployment.
                </p>

                <div className="p-4 rounded-xl bg-[#232323]/60 border border-white/5 space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Autonomous Drone Swarm Project</span>
                    <span className="font-mono text-[10px] text-gray-500">Coming Soon</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Coastal Surveillance Glider</span>
                    <span className="font-mono text-[10px] text-gray-500">Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="p-3 text-center rounded-xl bg-white/5 text-xs font-mono text-gray-400 border border-white/5">
                New initiatives will be unveiled in Q3 2026.
              </div>
            </Card>

          </div>
        </div>

        {/* Timeline Log Section */}
        <div className="w-full">
          <div className="mb-6 border-b border-white/10 pb-3">
            <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
              CHRONOLOGICAL LOGS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white">
              Development Milestones & Testing
            </h2>
          </div>

          <div className="space-y-12">
            {progressList.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
              >
                <Card className="bg-[#1f1f1f] border-gray-sub/10 rounded-2xl overflow-hidden shadow-2xl group p-0">
                  {item.image && (
                    <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                        priority={idx === 0}
                        unoptimized={item.image.startsWith('data:') || item.image.startsWith('http')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-80" />
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {item.date && (
                      <Badge variant="glow" className="mb-3 gap-1.5 px-3 py-1 text-xs">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </Badge>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          className="text-white text-base sm:text-lg mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Continuous updates will be published as testing progresses toward METU VTOL 2026.
        </motion.p>
      </div>
    </div>
  );
}