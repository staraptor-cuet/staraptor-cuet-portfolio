'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const SponsorTier = ({ title, count }: { title: string, count: number }) => (
  <motion.div
    className="mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.65, ease: 'easeOut' }}
  >
    {/* Tier title — matches crew section banner style */}
    <div className="bg-gradient-to-b from-[#D04741] to-[#6A2421] py-4 px-8 text-center rounded-sm mb-8 shadow-md">
      <h2 className="text-title-section !text-xl tracking-widest uppercase">{title}</h2>
    </div>

    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] bg-[#1f1f1f] border border-gray-sub/10 rounded-lg aspect-video flex items-center justify-center p-4 sm:p-6 group hover:border-primary/50 hover:bg-[#252525] hover:shadow-[0_0_20px_rgba(208,71,65,0.15)] transition-all cursor-pointer"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ scale: 1.03 }}
        >
          <p className="text-gray-sub/50 font-bold tracking-widest uppercase text-xs sm:text-sm group-hover:text-primary transition-colors">TBA</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default function SponsorsPage() {
  return (
    <div className="bg-background min-h-screen py-16 md:py-24 text-gray-sub relative overflow-hidden">
      {/* MASCOT */}
      <div className="absolute
      left-[-3%] top-[15%]
      w-[55vw] max-w-[800px]
      h-auto aspect-[1/1]

      max-md:left-1/2
      max-md:top-[38%]
      max-md:-translate-x-1/2
      max-md:-translate-y-1/2
      max-md:w-[100vw]

      pointer-events-none z-0">
        <Image
          src="/images/we are staraptor bg.png"
          alt="Mascot background"
          fill
          className="object-contain object-left opacity-25 mix-blend-screen"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-title-main mb-6">Our Sponsors</h1>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-sub">
            The development of our cutting-edge VTOL UAV would not be possible without the generous support of our partners. We are actively seeking visionary organizations to join our mission to the METU VTOL Competition 2026.
          </p>
        </motion.div>

        <SponsorTier title="Title Partners" count={1} />
        <SponsorTier title="Platinum Partners" count={2} />
        <SponsorTier title="Gold Partners" count={4} />
        <SponsorTier title="Media Partners" count={3} />

        {/* CTA Section */}
        <motion.div
          className="mt-20 md:mt-32 text-center border-t border-gray-sub/10 pt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            To become one of our sponsors, please contact us via email at:{' '}
            <a href="mailto:staraptorcuet@gmail.com" className="underline hover:text-primary transition-colors">
              staraptorcuet@gmail.com
            </a>
          </p>
          <a
            href="https://drive.google.com/drive/folders/1VGXoYQska6DDrVHstDyD-W608TmDV1BK?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D04741] to-[#6A2421] text-white px-8 py-3.5 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Download Proposal
            <Download size={20} />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
