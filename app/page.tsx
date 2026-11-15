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
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-2 sm:pt-4 md:pt-6 pb-12 md:pb-16">
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
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-7xl mx-auto -mt-10 sm:-mt-14 md:-mt-20 lg:-mt-24 mb-4 w-full">
          <motion.div
            className="relative mb-0 sm:mb-1 w-full max-w-[620px] sm:max-w-[760px] md:max-w-[920px] lg:max-w-[1060px] xl:max-w-[1140px] aspect-[849/530]"
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
            className="text-[1.8rem] sm:text-4xl md:text-5xl lg:text-[4.2rem] font-mechanical font-bold mb-6 md:mb-8 text-[#d84e46] shadow-sm tracking-wide leading-tight -mt-4 sm:-mt-6 md:-mt-8"
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
            <Button asChild size="lg" className="rounded-[0.4rem] tracking-wide font-bold px-8 shadow-[0_4px_20px_rgba(208,71,65,0.4)]">
              <Link href="/aircraft">
                Explore Aircraft
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Combined Section: Aeroplane (Left) + We Are Staraptor & 3 Points (Right) */}
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-background overflow-hidden border-t border-white/5">
        {/* Subtle mascot watermark silhouette */}
        <div className="absolute right-[-6%] top-[50%] -translate-y-[50%] h-[120%] w-[55%] z-0 pointer-events-none opacity-15 mix-blend-screen">
          <Image
            src="/images/we are staraptor bg.png"
            alt="Mascot background"
            fill
            className="object-contain object-right"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: 3D Aeroplane Model + Under it Meet Crew & Our Progress buttons */}
            <motion.div
              className="lg:col-span-5 flex flex-col items-center justify-center relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Soft Radial Ambient & Hover Glow (No Box Edge) */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[80%] bg-[#D04741]/25 group-hover:bg-[#D04741]/45 rounded-full blur-[60px] pointer-events-none transition-all duration-500" />
              
              {/* Floating Aircraft Container */}
              <motion.div
                className="relative aspect-[4/3] w-full max-w-sm sm:max-w-md lg:max-w-none cursor-pointer"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/aircraft" className="block relative w-full h-full">
                  <Image
                    src={content?.aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"}
                    alt="Staraptor VTOL Aircraft"
                    fill
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                    priority
                  />
                </Link>
              </motion.div>

              {/* Buttons under aeroplane: Meet Crew + Our Progress */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 z-10">
                <Button asChild size="default" className="rounded-lg font-bold px-7 py-2.5 shadow-[0_4px_15px_rgba(208,71,65,0.4)]">
                  <Link href="/crew">
                    Meet Crew
                  </Link>
                </Button>

                <Button asChild variant="outline" size="default" className="rounded-lg font-bold px-7 py-2.5 border-[#D04741]/60 text-white hover:bg-[#D04741]/20 hover:border-[#D04741] transition-all">
                  <Link href="/progress" className="gap-2 inline-flex items-center">
                    <span>Our Progress</span>
                    <span className="font-mono">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Heading + Description Paragraph + 3 Points Under It */}
            <motion.div
              className="lg:col-span-7 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.15}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat uppercase tracking-tight text-[#EF5F5A] mb-5 leading-[1.08]">
                WE ARE<br />STARAPTOR
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed mb-8 max-w-2xl text-justify sm:text-left">
                {general?.aboutDescription || (
                  <>
                    Team Staraptor CUET is the first <strong>VTOL drone design team in Bangladesh</strong> from <strong>Chittagong University of Engineering & Technology (CUET)</strong>. Set to make our mark at the METU VTOL Competition, our team of 20 passionate students—specializing in mechanical, aerospace, and related fields—is dedicated to designing cutting-edge <strong>UAV and VTOL aircraft systems</strong>. We're combining lightweight materials, advanced aerodynamics, and smart control systems to deliver a drone that excels in stability, efficiency, and mission accuracy. Our vision is to showcase Bangladesh's engineering talent on a global stage, inspiring innovation and collaboration across borders. Join us as we take flight!
                  </>
                )}
              </p>

              {/* 3 Points Under Paragraph */}
              <div className="space-y-3.5 max-w-xl">
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
