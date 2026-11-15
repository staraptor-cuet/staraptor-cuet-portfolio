'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  }),
};

export default function Home() {
  const { content } = useSiteContent();
  const general = content?.general;
  const stats = general?.stats || [
    { label: 'Crew Size', value: '20', labelFirst: true },
    { label: 'VTOL Design Team', value: '1st', labelFirst: false },
    { label: 'Founding', value: '2026', labelFirst: true },
    { label: 'Target', value: 'July 2026', labelFirst: true },
  ];

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

      {/* We Are Staraptor */}
      <section className="relative pt-16 md:pt-24 pb-12 bg-background overflow-hidden border-t border-gray-sub/5">
        <div className="absolute left-[-5%] top-[50%] -translate-y-[50%] h-[130%] w-[65%] z-0 pointer-events-none">
          <Image
            src="/images/we are staraptor bg.png"
            alt="Mascot background"
            fill
            className="object-contain object-left opacity-25 mix-blend-screen"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="hidden lg:block relative h-[500px]"></div>
            
            <motion.div
              className="flex flex-col items-center text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-title-section uppercase tracking-wider !text-[#d84e46] mb-6 md:mb-8 leading-[1.1]">
                {general?.aboutTitle || 'We Are Staraptor'}
              </h2>
              <p className="text-white text-xs md:text-base lg:text-[1.1rem] leading-[1.8] mb-8 md:mb-12 max-w-xl text-center md:text-justify whitespace-pre-line">
                {general?.aboutDescription || (
                  <>
                    Team Staraptor CUET is the first <strong>VTOL drone design team in Bangladesh</strong> from <strong>Chittagong University of Engineering & Technology (CUET)</strong>. Set to make our mark at the METU VTOL Competition, our team of 20 passionate students—specializing in mechanical, aerospace, and related fields—is dedicated to designing cutting-edge <strong>UAV and VTOL aircraft systems</strong>. We're combining lightweight materials, advanced aerodynamics, and smart control systems to deliver a drone that excels in stability, efficiency, and mission accuracy. Our vision is to showcase Bangladesh's engineering talent on a global stage, inspiring innovation and collaboration across borders. Join us as we take flight!
                  </>
                )}
              </p>
              <Button asChild size="default" className="rounded-[0.4rem] tracking-wide font-bold">
                <Link href="/crew">
                  Show Crew
                </Link>
              </Button>
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

      {/* Stats Section - Compact Width, Hover-Only Glow, Shadcn Cards */}
      <section className="py-16 md:py-20 bg-[#232323] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            
            {/* Left Column: Drone - ONLY GLOWS ON HOVER, NO BOX SHAPE */}
            <motion.div
              className="relative w-full max-w-sm sm:max-w-md mx-auto flex items-center justify-center group cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Soft Radial Glow - ONLY APPEARS ON HOVER */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#D04741]/35 rounded-full blur-[65px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating Aircraft Container */}
              <motion.div
                className="relative aspect-[4/3] w-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={content?.aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"}
                  alt="Staraptor VTOL Model"
                  fill
                  className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                  priority
                />
              </motion.div>
            </motion.div>
            
            {/* Right Column: Stats using Shadcn Cards & Button */}
            <motion.div
              className="flex flex-col items-center md:items-end text-center md:text-right"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.15}
            >
              <div className="mb-6">
                <Badge variant="glow" className="mb-2 uppercase tracking-widest text-[10px] font-mono">
                  Team Benchmarks
                </Badge>
                <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] font-montserrat font-bold text-[#D04741] tracking-wider uppercase leading-none">
                  STATS
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 w-full max-w-md">
                {stats.map(({ label, value }, i) => (
                  <Card
                    key={i}
                    className="p-3.5 sm:p-4 bg-[#1b1b1b]/90 border-white/5 hover:border-[#D04741]/40 hover:bg-[#202020] transition-all flex flex-col items-center md:items-end text-center md:text-right group/stat"
                  >
                    <span className="text-[#D04741] text-2xl sm:text-3xl lg:text-4xl font-heading font-bold whitespace-nowrap leading-none mb-1 group-hover/stat:scale-105 transition-transform">
                      {value}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-300 uppercase tracking-wide">
                      {label}
                    </span>
                  </Card>
                ))}
              </div>
              
              <div>
                <Button asChild size="default" className="rounded-[0.4rem] font-bold">
                  <Link href="/progress" className="gap-2">
                    <span>Our Progress</span>
                    <span className="text-sm font-mono">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
