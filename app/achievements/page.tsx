'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Award, Target, ShieldCheck, ArrowRight, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function AchievementsPage() {
  const achievements = [
    {
      icon: Flag,
      badge: "National Milestone",
      title: "1st VTOL Drone Design Team in Bangladesh",
      date: "2026",
      organization: "Chittagong University of Engineering & Technology (CUET)",
      description: "Pioneered the country's first dedicated student aerospace engineering team specializing in hybrid Vertical Takeoff & Landing (VTOL) unmanned aerial vehicle design, avionics, and autonomous flight mechanics.",
    },
    {
      icon: Trophy,
      badge: "International Stage",
      title: "METU VTOL 2026 Official Competitor",
      date: "Target: July 2026",
      organization: "Middle East Technical University (METU), Ankara, Turkey",
      description: "Qualified to represent Bangladesh at the prestigious 9th METU VTOL Competition, designing an autonomous hybrid UAV capable of high-speed offshore delivery, crosswind hover stabilization, and precision landing.",
    },
    {
      icon: Award,
      badge: "Aerospace Innovation",
      title: "Indigenous Carbon-Composite Airframe",
      date: "2026",
      organization: "Staraptor Aeronautics Division",
      description: "Successfully engineered and fabricated a custom lightweight carbon-composite airframe utilizing custom Eppler E205 airfoils, achieving superior wing-loading and transition efficiency.",
    },
    {
      icon: ShieldCheck,
      badge: "Industry Backing",
      title: "Corporate Sponsorship & Engineering Partnerships",
      date: "2026",
      organization: "Epic Properties Ltd. & Pusti Group",
      description: "Secured strategic capital backing, advanced composite material resources, and engineering mentorship from leading industrial conglomerates to build Bangladesh's vanguard aerospace platform.",
    },
  ];

  return (
    <div className="bg-[#202020] min-h-screen py-16 md:py-24 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Hall of Milestones
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Achievements
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Honoring the breakthroughs, competitive milestones, and national firsts achieved by Team Staraptor CUET.
          </p>
        </motion.div>

        {/* Highlight Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.15}
        >
          <Card className="bg-[#181818] border border-white/5 border-b-2 border-b-[#D04741] p-5 text-center rounded-xl shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-montserrat block mb-1">
              1st
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              VTOL Team in Bangladesh
            </span>
          </Card>

          <Card className="bg-[#181818] border border-white/5 border-b-2 border-b-[#D04741] p-5 text-center rounded-xl shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-montserrat block mb-1">
              20
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Student Aerospace Engineers
            </span>
          </Card>

          <Card className="bg-[#181818] border border-white/5 border-b-2 border-b-[#D04741] p-5 text-center rounded-xl shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-montserrat block mb-1">
              METU &apos;26
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Global VTOL Competition
            </span>
          </Card>

          <Card className="bg-[#181818] border border-white/5 border-b-2 border-b-[#D04741] p-5 text-center rounded-xl shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-montserrat block mb-1">
              8+ Kg
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Target Payload Capacity
            </span>
          </Card>
        </motion.div>

        {/* Detailed Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {achievements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Card className="bg-[#1b1b1b] border-white/10 p-6 sm:p-8 rounded-2xl h-full flex flex-col justify-between hover:border-[#D04741]/50 transition-all shadow-xl group">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A] group-hover:scale-105 group-hover:bg-[#D04741]/20 transition-all">
                        <Icon size={24} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {item.badge}
                        </span>
                        <span className="text-xs font-mono text-[#EF5F5A] font-bold">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white group-hover:text-[#ff7973] transition-colors mb-2">
                      {item.title}
                    </h2>
                    
                    <span className="text-xs font-semibold text-gray-400 block mb-4">
                      {item.organization}
                    </span>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-gradient-to-r from-[#2a1d1d] to-[#1c1c1c] border border-[#D04741]/30">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">
              Join Our Journey to METU VTOL 2026
            </h3>
            <p className="text-gray-400 text-sm">
              Discover the students, faculty, and industry partners pushing Bangladesh&apos;s aerospace frontier.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild size="default" className="rounded-xl font-bold px-6">
              <Link href="/crew" className="gap-2">
                <span>Meet the Crew</span>
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="rounded-xl font-bold px-6 border-white/20 text-white hover:bg-white/10">
              <Link href="/sponsors">
                Sponsors
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}