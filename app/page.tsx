'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';

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
            <Link
              href="/aircraft"
              className="bg-gradient-to-b from-[#e35651] to-[#b03934] border border-[#ff6b66]/30 shadow-[0_0_20px_rgba(208,71,65,0.25)] hover:shadow-[0_0_25px_rgba(208,71,65,0.5)] hover:scale-105 text-white px-8 md:px-10 py-3 md:py-[14px] rounded-[0.4rem] font-bold text-base md:text-[1.1rem] transition-all tracking-wide inline-block"
            >
              Explore Aircraft
            </Link>
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
              <Link
                href="/crew"
                className="bg-gradient-to-b from-[#e35651] to-[#b03934] border border-[#ff6b66]/30 shadow-[0_0_20px_rgba(208,71,65,0.25)] hover:shadow-[0_0_25px_rgba(208,71,65,0.5)] hover:scale-105 text-white px-8 py-[10px] rounded-[0.4rem] font-bold text-[1rem] transition-all tracking-wide inline-block"
              >
                Show Crew
              </Link>
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
                  <div key={sp.id} className="bg-white/10 px-6 py-3 rounded-lg flex items-center gap-3">
                    {sp.logo && (
                      <div className="relative w-8 h-8">
                        <Image src={sp.logo} alt={sp.name} fill className="object-contain" />
                      </div>
                    )}
                    <span className="text-white font-bold text-sm">{sp.name}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-white text-lg md:text-xl font-bold tracking-wide italic">To Be Announced</p>
          )}
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-[#232323] relative overflow-hidden">
        {/* Subtle background ambient warmth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D04741]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Drone with unclipped pure radial glow */}
            <motion.div
              className="relative w-full max-w-md lg:max-w-xl mx-auto flex items-center justify-center group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Pure Soft Radial Red Glow - No Box, No Clipping */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#D04741]/25 rounded-full blur-[70px] pointer-events-none group-hover:bg-[#D04741]/40 group-hover:blur-[85px] transition-all duration-700" />
              
              {/* Floating Aircraft Container */}
              <motion.div
                className="relative aspect-[4/3] w-full cursor-pointer"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.04 }}
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
            
            {/* Right Column: Stats & Progress */}
            <motion.div
              className="flex flex-col items-center lg:items-end text-center lg:text-right"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.15}
            >
              <div className="mb-8 md:mb-10">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#ff7973] font-bold block mb-1">
                  Team Benchmarks
                </span>
                <h2 className="text-[2.2rem] md:text-[3.2rem] font-montserrat font-bold text-[#D04741] tracking-wider uppercase leading-tight">
                  STATS
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10 md:mb-12 w-full max-w-lg">
                {stats.map(({ label, value }, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#1b1b1b]/80 border border-white/5 rounded-xl p-4 sm:p-5 flex flex-col justify-center items-center lg:items-end text-center lg:text-right hover:border-[#D04741]/40 hover:bg-[#202020] transition-all group/stat shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i, ease: 'easeOut' }}
                    whileHover={{ y: -3 }}
                  >
                    <span className="text-[#D04741] text-3xl sm:text-4xl lg:text-5xl font-heading font-bold whitespace-nowrap leading-none mb-1 group-hover/stat:scale-105 transition-transform inline-block">
                      {value}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide uppercase">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <Link
                  href="/progress"
                  className="bg-gradient-to-b from-[#e35651] to-[#b03934] border border-[#ff6b66]/30 shadow-[0_4px_15px_rgba(208,71,65,0.4)] text-white px-10 md:px-12 py-3 rounded-[0.4rem] font-bold text-base md:text-lg transition-all inline-flex items-center gap-2 hover:shadow-[0_6px_25px_rgba(208,71,65,0.6)] hover:scale-105"
                >
                  <span>Our Progress</span>
                  <span className="text-sm font-mono">→</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
