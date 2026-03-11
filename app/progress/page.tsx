'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  return (
    <div className="bg-background min-h-screen py-24 text-gray-sub flex flex-col items-center justify-center -mt-20">
      <div className="text-center w-full max-w-5xl px-4 flex flex-col items-center">
        <motion.h1
          className="text-4xl md:text-6xl font-orbitron font-bold text-[#d84e46] mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Our Progress
        </motion.h1>
        <motion.div
          className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-sub/10 mb-8 group cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <Image
            src="/images/progress image.jpg"
            alt="Staraptor Team Progress"
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#D04741]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
        <motion.p
          className="text-white text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          More coming soon...
        </motion.p>
      </div>
    </div>
  );
}
