'use client';

import Image from 'next/image';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function Vtol2026Page() {
  return (
    <div className="bg-background min-h-screen py-16 text-gray-sub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-label mb-2">Current Objective</p>
          <h1 className="text-title-main">
            METU VTOL<span className="font-light text-gray-400">-2026</span>
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
            <p className="mb-6 text-sm">
              The 9th VTOL Aircraft Design Competition challenges university teams to design, build, and autonomously operate a hybrid VTOL UAV for simulated logistics missions.
            </p>
            <div className="relative w-full aspect-[21/9] bg-black mb-6 border border-gray-sub/20">
              <Image src="/images/metu poster.png" alt="METU VTOL Aircraft Competition 9" fill className="object-cover" priority />
            </div>
            <p className="text-sm">
              The scenario simulates cargo delivery to offshore platforms, requiring aircraft capable of vertical takeoff, efficient fixed-wing flight, and precise autonomous operation.
            </p>
          </div>
        </motion.div>

        {/* Aircraft Requirement */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm mb-8 shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">
              <div className="w-2 h-2 bg-primary"></div>
            </div>
            <h2 className="text-title-box">Aircraft Requirement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-8">
            <div>
              <h3 className="text-primary font-heading font-bold text-lg mb-4">VTOL Hybrid Configuration</h3>
              <p className="text-sm font-semibold mb-2">The aircraft must:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-sub/90">
                <li>Take off and land vertically</li>
                <li>Transition to fixed-wing forward flight</li>
                <li>Generate primary lift from wings</li>
                <li>Use electric propeller propulsion</li>
              </ul>
            </div>
            <div>
              <h3 className="text-primary font-heading font-bold text-lg mb-4">Autonomy</h3>
              <p className="text-sm font-semibold mb-2">All missions must be fully autonomous, including:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-sub/90 mb-2">
                <li>Navigation</li>
                <li>Maneuvering</li>
                <li>Payload operations</li>
                <li>Landing</li>
              </ul>
              <p className="text-sm text-gray-sub/90">Manual control during missions is not permitted.</p>
            </div>
            <div>
              <h3 className="text-primary font-heading font-bold text-lg mb-4">Weight & Safety Constraints</h3>
              <p className="text-sm font-semibold mb-2">Key limits include:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-sub/90 mb-2">
                <li>Maximum aircraft weight 20 kg (including payload)</li>
                <li>Minimum forward flight altitude: 20 m AGL</li>
                <li>Electric propulsion only</li>
                <li>No external launch systems</li>
              </ul>
              <p className="text-sm text-gray-sub/90">Aircraft must operate within a 200 m x 100 m flight zone.</p>
            </div>
          </div>
        </motion.div>

        {/* Mission Objectives */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm mb-8 shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={fadeUp} custom={0}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">
              <div className="w-full h-0.5 bg-primary"></div>
            </div>
            <h2 className="text-[#333] font-heading font-bold text-xl">Mission Objectives</h2>
          </div>
          
          <div className="flex flex-col p-4 sm:p-8 md:px-16 lg:px-24 pb-0">
            <p className="text-sm mb-8">
              The competition includes three autonomous flight missions, each evaluating different aspects of UAV design and performance.
            </p>
            
              {[
              {
                title: 'Mission 1 — Ferry Flight',
                missionNum: 'M1',
                objective: 'Complete the maximum number of laps within 12 minutes without payload.',
                focusLabel: 'Key Focus',
                focus: ['Aerodynamic efficiency', 'Energy management', 'Precision autonomous landing'],
                evalLabel: 'Evaluation',
                eval: ['Number of laps completed', 'Landing accuracy on a 3m x 3m QR code', 'Aircraft operating empty weight'],
                img: '/images/mission 1.png', imgAlt: 'Mission 1 Diagram', imgAspect: 'aspect-video',
              },
              {
                title: 'Mission 2 — Pirouette Maneuver',
                missionNum: 'M2',
                objective: 'Perform a circular VTOL maneuver at a fixed altitude.',
                focusLabel: 'Requirements',
                focus: ['Maintain 20 m altitude', 'Fly a 15 m radius circle', 'Aircraft heading must face the circle center'],
                evalLabel: 'Evaluation',
                eval: ['Radius accuracy', 'Altitude stability', 'Heading alignment', 'Completion time'],
                img: '/images/mission 2.png', imgAlt: 'Mission 2 Diagram', imgAspect: 'aspect-square max-w-sm mx-auto',
              },
              {
                title: 'Mission 3 — Fixed-Wing Loiter & Payload Delivery',
                missionNum: 'M3',
                objective: 'Carry a 0.5 kg payload, complete three figure-8 patterns, and accurately drop the payload on target.',
                focusLabel: 'Requirements',
                focus: ['Payload attached via 1 m cable', 'Autonomous payload release', 'Fixed-wing flight configuration'],
                evalLabel: 'Evaluation',
                eval: ['Turn radius efficiency', 'Flight path accuracy', 'Payload drop precision', 'Wing reconfiguration capability'],
                img: '/images/mission 3.png', imgAlt: 'Mission 3 Diagram', imgAspect: 'aspect-video',
              },
            ].map((mission, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 border-b border-gray-sub/10 pb-12"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div>
                  <h3 className="text-subtitle-box mb-4">{mission.title}</h3>
                  <div className="space-y-4 text-sm text-gray-sub/90">
                    <div>
                      <span className="font-bold text-white block mb-1">Objective:</span>
                      {mission.objective}
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-1">{mission.focusLabel}:</span>
                      <ul className="list-disc pl-5 space-y-0.5">{mission.focus.map((f, j) => <li key={j}>{f}</li>)}</ul>
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-1">{mission.evalLabel}:</span>
                      <ul className="list-disc pl-5 space-y-0.5">{mission.eval.map((e, j) => <li key={j}>{e}</li>)}</ul>
                    </div>
                  </div>
                </div>
                <div className={`relative w-full ${mission.imgAspect} group overflow-hidden rounded-sm cursor-pointer`}>
                  <Image src={mission.img} alt={mission.imgAlt} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#D04741]/0 group-hover:bg-[#D04741]/15 transition-all duration-400 flex items-end justify-end p-3">
                    <span className="text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#D04741] px-2 py-1 rounded">{mission.missionNum}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Engineering Focus Areas */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm mb-8 shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">O</div>
            <h2 className="text-[#333] font-heading font-bold text-xl">Engineering Focus Areas</h2>
          </div>
          <div className="p-8 pb-4">
            <p className="text-sm mb-6">
              The competition includes three autonomous flight missions, each evaluating different aspects of UAV design and performance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                'Efficient hybrid VTOL aerodynamics',
                'Autonomous flight control systems',
                'Precision navigation and targeting',
                'Modular mission configuration',
                'Lightweight structural design'
              ].map((area, i) => (
                <motion.div
                  key={i}
                  className="bg-[#D04741] text-white text-xs font-semibold px-4 py-2 rounded-full shadow flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="w-3 h-3 bg-white/30 rounded-full flex items-center justify-center"><span className="text-[8px]">✓</span></div>
                  {area}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mission Timeline */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center bg-primary rounded-full text-white font-bold text-[10px] shrink-0">V</div>
            <h2 className="text-[#333] font-heading font-bold text-xl">Mission Timeline</h2>
          </div>

          {/* Desktop Timeline */}
          <div className="px-8 pb-12 pt-12 w-full hidden md:block">
            <div className="w-full flex flex-col relative mx-auto">
              
              {/* Icons row */}
              <div className="flex justify-between w-full mb-6 relative">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center flex-1"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#e4e4e4] flex items-center justify-center shrink-0">
                      <Loader className="w-8 h-8 text-[#D04741]" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 mb-6 rounded-full bg-[#474747] relative">
                <div className="w-[0%] h-full bg-[#D04741] rounded-full shadow-[0_0_10px_#D04741] absolute left-0 top-0"></div>
              </div>

              {/* Text row */}
              <div className="flex justify-between w-full">
                {[
                  { date: 'TBA', label: 'Proposal Submission' },
                  { date: 'TBA', label: 'Acceptance' },
                  { date: 'TBA', label: 'Design Report' },
                  { date: 'TBA', label: 'Competition Days' },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 text-center px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <div className="text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-widest">{step.date}</div>
                    <span className="text-[14px] md:text-[15px] font-sans text-white tracking-wide leading-tight">{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile Timeline */}
          <div className="px-8 pb-10 pt-8 w-full md:hidden">
            {[
              { date: 'TBA', label: 'Proposal Submission' },
              { date: 'TBA', label: 'Acceptance' },
              { date: 'TBA', label: 'Design Report' },
              { date: 'TBA', label: 'Competition Days' },
            ].map((step, i, arr) => (
              <motion.div
                key={i}
                className="flex items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Icon + vertical line column */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#e4e4e4] flex items-center justify-center">
                    <Loader className="w-6 h-6 text-[#D04741]" />
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 h-10 bg-gray-sub/20 mt-1" />
                  )}
                </div>
                {/* Text */}
                <div className="flex flex-col pt-2">
                  <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{step.date}</div>
                  <span className="text-base font-sans text-white">{step.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
