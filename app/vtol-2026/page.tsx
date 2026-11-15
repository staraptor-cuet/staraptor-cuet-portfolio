'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function Vtol2026Page() {
  const { content } = useSiteContent();
  const vtol = content?.vtol2026;

  const requirements = vtol?.requirements || [
    {
      title: "Aircraft Requirement",
      description: "Hybrid VTOL configuration with vertical takeoff and landing capability, transition mechanism, autonomous hover stabilization, and minimum 5kg payload bay."
    },
    {
      title: "Mission Logistics",
      description: "Simulated multi-point offshore maritime delivery including waypoint navigation, crosswind tolerance, and autonomous return-to-base failsafe protocols."
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 text-gray-sub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-label mb-2">{vtol?.subtitle || 'Current Objective'}</p>
          <h1 className="text-title-main">
            {vtol?.title || 'METU VTOL-2026'}
          </h1>
        </motion.div>

        {/* Competition Overview */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm mb-8 shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">O</div>
            <h2 className="text-title-box">Competition Overview</h2>
          </div>
          <div className="p-8">
            <p className="mb-6 text-sm leading-relaxed whitespace-pre-line">
              {vtol?.overviewText || 'The 9th VTOL Aircraft Design Competition challenges university teams to design, build, and autonomously operate a hybrid VTOL UAV for simulated logistics missions.'}
            </p>
            {vtol?.posterImage && (
              <div className="relative w-full aspect-[21/9] bg-black mb-6 border border-gray-sub/20 overflow-hidden rounded-sm">
                <Image
                  src={vtol.posterImage}
                  alt="METU VTOL Aircraft Competition Poster"
                  fill
                  className="object-cover"
                  priority
                  unoptimized={vtol.posterImage.startsWith('data:') || vtol.posterImage.startsWith('http')}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Requirements */}
        {requirements.map((req, idx) => (
          <motion.div
            key={idx}
            className="bg-[#1f1f1f] rounded-sm mb-8 shadow-lg overflow-hidden border border-gray-sub/10"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
          >
            <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">
                <div className="w-2 h-2 bg-primary"></div>
              </div>
              <h2 className="text-title-box">{req.title}</h2>
            </div>
            <div className="p-8">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {req.description}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
