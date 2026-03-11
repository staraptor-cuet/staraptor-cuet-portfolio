'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay },
  }),
};

export default function Home() {
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
            Engineers Bound by Flight
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
                We Are<br/>Staraptor
              </h2>
              <p className="text-white text-xs md:text-base lg:text-[1.1rem] leading-[1.8] mb-8 md:mb-12 max-w-xl text-center md:text-justify">
                Welcome to Team Staraptor CUET, the first VTOL design team from CUET Bangladesh, set to make our mark at the METU VTOL Competition this October. Our team of 20 passionate students—specializing in mechanical, aerospace, and related fields—is dedicated to designing a cutting-edge VTOL UAV. We're combining lightweight materials, advanced aerodynamics, and smart control systems to deliver a drone that excels in stability, efficiency, and mission accuracy. Our vision is to showcase Bangladesh's engineering talent on a global stage, inspiring innovation and collaboration across borders. Join us as we take flight!
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
          <p className="text-white text-lg md:text-xl font-bold tracking-wide italic">To Be Announced</p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-[#232323]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              className="relative aspect-[4/3] w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 group cursor-pointer overflow-hidden rounded-xl"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src="/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"
                alt="Staraptor VTOL Model"
                fill
                className="object-contain drop-shadow-2xl transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(208,71,65,0.6)] group-hover:scale-105"
              />
            </motion.div>
            
            <motion.div
              className="flex flex-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.15}
            >
              <h2 className="text-[2.2rem] md:text-[3rem] font-montserrat font-bold mb-8 md:mb-10 text-center lg:text-right lg:pr-10 text-[#D04741] tracking-wider uppercase">
                STATS
              </h2>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:gap-x-8 mb-10 md:mb-12 max-w-sm sm:max-w-lg mx-auto lg:mx-0 lg:ml-auto lg:pr-10">
                {[
                  { label: 'Crew Size', value: '20', labelFirst: true },
                  { label: 'VTOL Design Team', value: '1st', labelFirst: false },
                  { label: 'Founding', value: '2026', labelFirst: true },
                  { label: 'Target', value: 'July 2026', labelFirst: true },
                ].map(({ label, value, labelFirst }, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i, ease: 'easeOut' }}
                  >
                    {labelFirst && <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">{label}</span>}
                    <span className="text-[#D04741] text-3xl sm:text-4xl md:text-5xl font-heading font-bold whitespace-nowrap">{value}</span>
                    {!labelFirst && <span className="text-xs sm:text-sm font-semibold text-white">{label}</span>}
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/progress"
                  className="bg-gradient-to-b from-[#e35651] to-[#b03934] border border-[#ff6b66]/30 shadow-[0_4px_10px_rgba(208,71,65,0.4)] text-white px-10 md:px-12 py-[10px] rounded-[0.4rem] font-bold text-base md:text-lg transition-all inline-block hover:shadow-[0_6px_15px_rgba(208,71,65,0.6)] hover:scale-105"
                >
                  Our Progress
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
