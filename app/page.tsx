'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Eye, ImageIcon } from 'lucide-react';

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
              <Link href="/progress">
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
            
            {/* Left Column: 3D Aeroplane Model + 3 Stats + Meet Crew & Our Progress buttons */}
            <motion.div
              className="lg:col-span-5 flex flex-col items-center justify-center relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Soft Radial Ambient & Hover Glow (No Box Edge) */}
              <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] bg-[#D04741]/25 group-hover:bg-[#D04741]/45 rounded-full blur-[60px] pointer-events-none transition-all duration-500" />
              
              {/* Floating Aircraft Container */}
              <motion.div
                className="relative aspect-[4/3] w-full max-w-sm sm:max-w-md lg:max-w-none cursor-pointer"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/progress" className="block relative w-full h-full">
                  <Image
                    src={content?.aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.webp"}
                    alt="Staraptor VTOL Aircraft"
                    fill
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                    priority
                  />
                </Link>
              </motion.div>

              {/* Stat Cards Below the Plane */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full max-w-md mt-4 mb-6 z-10">
                {(general?.stats && general.stats.length > 0 ? general.stats.slice(0, 3) : [
                  { id: '1', label: 'CREW MEMBERS', value: String(crewCount) },
                  { id: '2', label: 'VTOL TEAM IN BD', value: '1st' },
                  { id: '3', label: 'METU COMPETITION', value: '2026' },
                ]).map((stat) => (
                  <Card
                    key={stat.id}
                    className="bg-[#181818]/90 border border-white/10 border-b-2 border-b-transparent rounded-xl p-3 sm:p-3.5 text-center shadow-md hover:border-b-[#D04741] hover:shadow-[0_8px_24px_rgba(208,71,65,0.45)] hover:-translate-y-1 transition-all duration-300 group/stat cursor-pointer"
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat leading-none block mb-1.5 group-hover/stat:text-[#EF5F5A] transition-colors truncate">
                      {stat.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block line-clamp-1">
                      {stat.label}
                    </span>
                  </Card>
                ))}
              </div>

              {/* Action Buttons: Meet Crew + Our Progress */}
              <div className="flex flex-wrap items-center justify-center gap-4 z-10">
                <Button asChild size="default" className="rounded-lg font-bold px-7 py-2.5 bg-[#D04741] text-white hover:bg-[#b83833] hover:shadow-[0_4px_16px_rgba(208,71,65,0.45)] transition-all">
                  <Link href="/crew">
                    Meet Crew
                  </Link>
                </Button>

                <Button asChild variant="outline" size="default" className="rounded-lg font-bold px-7 py-2.5 border-white/20 text-white hover:bg-[#D04741]/20 hover:border-[#D04741] transition-all">
                  <Link href="/progress" className="gap-2 inline-flex items-center">
                    <span>Our Progress</span>
                    <span className="font-mono">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Heading + Description Paragraph with 3 Specializations Integrated */}
            <motion.div
              className="lg:col-span-7 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.15}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat uppercase tracking-tight text-[#EF5F5A] mb-6 leading-[1.08] whitespace-pre-line">
                {general?.aboutTitle || 'WE ARE\nSTARAPTOR'}
              </h2>
              
              <div className="space-y-4 text-gray-300 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed max-w-2xl text-justify sm:text-left whitespace-pre-line">
                {general?.aboutDescription ? (
                  <p>{general.aboutDescription}</p>
                ) : (
                  <>
                    <p>
                      Team Staraptor CUET is the first <strong className="text-white font-semibold">VTOL drone design team in Bangladesh</strong> from <strong className="text-white font-semibold">Chittagong University of Engineering & Technology (CUET)</strong>. Set to make our mark at the METU VTOL Competition, our team of 20 passionate students—specializing in mechanical, aerospace, and related engineering fields—is dedicated to designing cutting-edge UAV and VTOL aircraft systems.
                    </p>
                    <p>
                      Our engineering focus seamlessly integrates a <strong className="text-white font-bold">Lightweight Airframe</strong>, <strong className="text-white font-bold">Advanced Aerodynamics</strong>, and <strong className="text-white font-bold">Smart Control Systems</strong> to deliver an aircraft that excels in stability, endurance, efficiency, and autonomous mission accuracy. Our vision is to showcase Bangladesh&apos;s engineering talent on the global stage. Join us as we take flight!
                    </p>
                  </>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Gallery Showcase Section */}
      <section className="py-20 md:py-28 bg-[#181818] border-t border-white/5 relative overflow-hidden">
        {/* Aerospace subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D04741]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <div>
              <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#EF5F5A] font-bold block mb-2 flex items-center gap-2">
                <ImageIcon size={14} /> Aerospace Archives
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-montserrat uppercase tracking-tight text-white">
                Visual Media & Field Logs
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mt-3 leading-relaxed">
                Explore our high-fidelity drone renders, workshop fabrications, aerodynamic CFD simulations, and autonomous flight trials.
              </p>
            </div>

            <Button asChild size="default" className="rounded-xl font-bold px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#D04741]/50 transition-all shrink-0">
              <Link href="/gallery" className="inline-flex items-center gap-2">
                <span>Explore Full Gallery</span>
                <ArrowRight size={15} />
              </Link>
            </Button>
          </motion.div>

          {/* Gallery Preview Grid (Centered Flex) */}
          <div className="flex flex-wrap justify-center gap-6">
            {(
              content?.gallery
                ?.filter((item) => item.published !== false && (item.featuredOnHome !== false || item.isCover))
                ?.slice(0, 3) ||
              content?.gallery?.slice(0, 3) ||
              []
            ).map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-full sm:w-[calc(50%-0.8rem)] lg:w-[calc(33.333%-1rem)] max-w-[380px] group relative"
              >
                <Link href="/gallery" className="block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#1f1f1f] border border-white/10 group-hover:border-[#D04741]/60 shadow-xl transition-all duration-300">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Dual Top & Bottom Scrim Gradients for guaranteed contrast on ANY background */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-[1]" />

                    {/* Top Badges (High Contrast Solid Pills) */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {item.category || 'Media'}
                      </span>
                      {item.project && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-[#EF5F5A] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF5F5A]" />
                          <span>{item.project}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Title & Caption */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
                      <h3 className="text-base sm:text-lg font-bold font-montserrat text-white group-hover:text-[#ff7872] transition-colors truncate drop-shadow-md">
                        {item.title}
                      </h3>
                      {item.caption && (
                        <p className="text-xs text-gray-200 line-clamp-1 mt-0.5 font-sans drop-shadow-sm">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
