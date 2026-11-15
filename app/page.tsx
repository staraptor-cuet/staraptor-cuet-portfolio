'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Feather, Wind, Sliders } from 'lucide-react';
import { useSiteContent } from '@/lib/useContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  }),
};

export default function Home() {
  const { content } = useSiteContent();
  const general = content?.general;
  const crewCount = content?.crew?.length || 20;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/homepage bg 1.png"
            alt="Aircraft background"
            fill
            className="object-cover opacity-60 mix-blend-lighten"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto mt-8 mb-10 w-full">
          <motion.div
            className="relative mb-0 lg:mb-2 w-full max-w-[560px] md:max-w-[720px] lg:max-w-[849px] aspect-[849/530]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <Image
              src="/images/logo.svg"
              alt="Staraptor Logo Graphic"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          <motion.h1
            className="text-[1.8rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] font-mechanical font-bold mb-8 md:mb-10 text-[#d84e46] shadow-sm tracking-wide leading-tight"
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
          >
            {general?.tagline || 'Engineers Bound by Flight'}
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.55}
            variants={fadeUp}
          >
            <Button asChild size="lg" className="rounded-[0.4rem] tracking-wide font-bold">
              <Link href="/aircraft">
                Explore Aircraft
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Combined Section: We Are Staraptor + Stats + Specializations (Matches Mockup) */}
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-background overflow-hidden border-t border-white/5">
        {/* Subtle mascot watermark silhouette */}
        <div className="absolute left-[-6%] top-[50%] -translate-y-[50%] h-[120%] w-[55%] z-0 pointer-events-none opacity-20 mix-blend-screen">
          <Image
            src="/images/we are staraptor bg.png"
            alt="Mascot background"
            fill
            className="object-contain object-left"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Heading + Description + 3 Stats */}
            <motion.div
              className="lg:col-span-7 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat uppercase tracking-tight text-[#EF5F5A] mb-5 leading-[1.08]">
                WE ARE<br />STARAPTOR
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed mb-8 max-w-xl">
                {general?.aboutDescription || "Chittagong University of Engineering & Technology's pioneering VTOL drone design team, driving Bangladesh's aerospace innovation on the global stage."}
              </p>

              {/* 3 Stats in a Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                <Card className="bg-[#181818]/90 border border-white/5 border-b-2 border-b-[#D04741] rounded-xl p-3 sm:p-4 text-center shadow-[0_4px_16px_rgba(208,71,65,0.22)] hover:shadow-[0_8px_24px_rgba(208,71,65,0.38)] hover:-translate-y-1 transition-all group/stat">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-montserrat leading-none block mb-1.5 group-hover/stat:text-[#ff7973] transition-colors">
                    {crewCount}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    CREW MEMBERS
                  </span>
                </Card>

                <Card className="bg-[#181818]/90 border border-white/5 border-b-2 border-b-[#D04741] rounded-xl p-3 sm:p-4 text-center shadow-[0_4px_16px_rgba(208,71,65,0.22)] hover:shadow-[0_8px_24px_rgba(208,71,65,0.38)] hover:-translate-y-1 transition-all group/stat">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-montserrat leading-none block mb-1.5 group-hover/stat:text-[#ff7973] transition-colors">
                    1st
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    VTOL TEAM IN BD
                  </span>
                </Card>

                <Card className="bg-[#181818]/90 border border-white/5 border-b-2 border-b-[#D04741] rounded-xl p-3 sm:p-4 text-center shadow-[0_4px_16px_rgba(208,71,65,0.22)] hover:shadow-[0_8px_24px_rgba(208,71,65,0.38)] hover:-translate-y-1 transition-all group/stat">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-montserrat leading-none block mb-1.5 group-hover/stat:text-[#ff7973] transition-colors">
                    2026
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    METU COMPETITION
                  </span>
                </Card>
              </div>
            </motion.div>

            {/* Right Column: Specializations + Show Crew Button */}
            <motion.div
              className="lg:col-span-5 flex flex-col justify-center space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.2}
            >
              <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#EF5F5A] block">
                OUR SPECIALIZATIONS
              </span>

              {/* 3 Horizontal Specialization Cards */}
              <div className="space-y-3.5">
                <Card className="bg-[#181818]/90 border border-white/10 rounded-xl p-3.5 sm:p-4 flex items-center gap-4 hover:border-[#D04741]/50 hover:bg-[#202020] transition-all group shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#D04741] group-hover:scale-105 group-hover:bg-[#D04741]/20 transition-all shrink-0">
                    <Feather size={20} />
                  </div>
                  <span className="font-bold text-white text-base sm:text-lg group-hover:text-[#ff7973] transition-colors">
                    Lightweight Airframe
                  </span>
                </Card>

                <Card className="bg-[#181818]/90 border border-white/10 rounded-xl p-3.5 sm:p-4 flex items-center gap-4 hover:border-[#D04741]/50 hover:bg-[#202020] transition-all group shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#D04741] group-hover:scale-105 group-hover:bg-[#D04741]/20 transition-all shrink-0">
                    <Wind size={20} />
                  </div>
                  <span className="font-bold text-white text-base sm:text-lg group-hover:text-[#ff7973] transition-colors">
                    Advanced Aerodynamics
                  </span>
                </Card>

                <Card className="bg-[#181818]/90 border border-white/10 rounded-xl p-3.5 sm:p-4 flex items-center gap-4 hover:border-[#D04741]/50 hover:bg-[#202020] transition-all group shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#D04741] group-hover:scale-105 group-hover:bg-[#D04741]/20 transition-all shrink-0">
                    <Sliders size={20} />
                  </div>
                  <span className="font-bold text-white text-base sm:text-lg group-hover:text-[#ff7973] transition-colors">
                    Smart Control Systems
                  </span>
                </Card>
              </div>

              {/* Show Crew Button */}
              <div className="pt-2 flex justify-center sm:justify-start">
                <Button asChild size="default" className="rounded-lg font-bold px-8 py-2.5 shadow-[0_4px_15px_rgba(208,71,65,0.4)]">
                  <Link href="/crew">
                    Show Crew
                  </Link>
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Sponsors Preview */}
      <motion.section
        className="bg-[#4d2422] py-16 md:py-20 text-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-title-section mb-8 uppercase tracking-wider">Sponsors</h2>
          {content?.sponsors?.some((t) => t.sponsors?.length > 0) ? (
            <div className="flex flex-wrap items-center justify-center gap-6 px-4">
              {content.sponsors
                .flatMap((t) => t.sponsors)
                .slice(0, 4)
                .map((sp) => (
                  <Card key={sp.id} className="bg-white/10 border-white/10 px-6 py-3 flex flex-row items-center gap-3 rounded-lg shadow-sm">
                    {sp.logo && (
                      <div className="relative w-8 h-8">
                        <Image src={sp.logo} alt={sp.name} fill className="object-contain" />
                      </div>
                    )}
                    <span className="text-white font-bold text-sm">{sp.name}</span>
                  </Card>
                ))}
            </div>
          ) : (
            <p className="text-white text-lg md:text-xl font-bold tracking-wide italic">To Be Announced</p>
          )}
        </div>
      </motion.section>
    </div>
  );
}
