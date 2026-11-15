'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Sparkles, CheckCircle2, AlertCircle, Cpu, Shield, ArrowUpRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function Vtol2026Page() {
  const searchParams = useSearchParams();
  const { content } = useSiteContent();
  const vtol = content?.vtol2026;
  const aircraft = content?.aircraft;

  const [activeModel, setActiveModel] = useState<'model-1' | 'model-2'>('model-1');

  // Sync with ?model= query param or hash
  useEffect(() => {
    const modelParam = searchParams.get('model');
    if (modelParam === '2') {
      setActiveModel('model-2');
    } else if (modelParam === '1') {
      setActiveModel('model-1');
    } else if (typeof window !== 'undefined' && window.location.hash === '#model-2') {
      setActiveModel('model-2');
    }
  }, [searchParams]);

  // Model 1 data from aircraft content
  const physicalData = aircraft?.physicalData || [
    { label: 'Wingspan', value: '1.340 m' },
    { label: 'Length', value: '0.99 m' },
    { label: 'Payload Capacity', value: '8 Kg' },
    { label: 'Approximate Weight', value: '2 Kg' },
  ];

  const performanceData = aircraft?.performanceData || [
    { label: 'Cruise Speed', value: '60-70 Kmph' },
    { label: 'Endurance', value: '90 min' },
    { label: 'Wing Load', value: '55-75 gm/dm²' },
  ];

  const avionics = aircraft?.avionics || [
    { title: 'Top Quality Materials', desc: 'Carbon Fiber / GRP Composite Sheet' },
    { title: 'Airfoil Type', desc: 'Eppler E205' },
    { title: 'Electronics', desc: 'BLDC motors, Pixhawk flight controller, GPS' },
  ];

  const components = aircraft?.components || [];

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
    <div className="bg-background min-h-screen py-10 md:py-16 text-gray-sub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div className="mb-10" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1">
              Project: {vtol?.subtitle || 'METU VTOL 2026 Objective'}
            </Badge>
            <div className="text-xs text-gray-400 font-mono">
              CUET Autonomous Aerospace Initiative
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-montserrat tracking-tight text-white uppercase">
            {vtol?.title || 'METU VTOL - 2026 Project'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl mt-3 leading-relaxed">
            Official competition campaign for the 9th METU VTOL Aircraft Design Competition. Explore our flagship VTOL aircraft fleet, including Model 1 and the upcoming Model 2 platform.
          </p>
        </motion.div>

        {/* Aircraft Models Section Header & Switcher */}
        <div id="fleet" className="mb-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
                VTOL FLEET PLATFORMS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white">
                Aircraft Specifications & Models
              </h2>
            </div>

            {/* Model Tabs */}
            <div className="flex items-center p-1 bg-[#181818] border border-white/10 rounded-xl">
              <button
                id="model-1"
                onClick={() => setActiveModel('model-1')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeModel === 'model-1'
                    ? 'bg-[#D04741] text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Plane size={15} />
                <span>Model 1</span>
                <span className="text-[10px] uppercase font-mono bg-black/30 px-1.5 py-0.5 rounded">Active</span>
              </button>

              <button
                id="model-2"
                onClick={() => setActiveModel('model-2')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeModel === 'model-2'
                    ? 'bg-[#D04741] text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={15} />
                <span>Model 2</span>
                <span className="text-[10px] uppercase font-mono bg-[#EF5F5A]/20 text-[#ff7973] px-1.5 py-0.5 rounded border border-[#EF5F5A]/30">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Model Content Display */}
        <AnimatePresence mode="wait">
          {activeModel === 'model-1' ? (
            /* MODEL 1 - Full Aircraft Section Content */
            <motion.div
              key="model-1-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-[#242424] rounded-2xl p-4 sm:p-8 md:p-10 shadow-2xl border border-white/5 mb-14"
            >
              {/* Model 1 Badge & Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <Badge variant="glow" className="mb-2 uppercase tracking-wider text-xs">
                    Classification: {aircraft?.classification || 'Hybrid VTOL UAV'}
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-montserrat text-white">
                    {aircraft?.name || 'STARAPTOR VTOL - MODEL 1 (V1)'}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Active Prototype & Flight Ready
                </div>
              </div>

              {/* Hero Render */}
              <div className="relative w-full aspect-video md:aspect-[21/10] mb-10 border-b border-white/10 pb-6 flex items-center justify-center overflow-hidden bg-[#1a1a1a]/60 rounded-xl">
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="absolute w-full h-[1px] border-b border-dashed border-white/40"></div>
                  <div className="absolute h-[110%] w-[1px] border-r border-dashed border-white/40"></div>
                </div>
                
                {/* Aircraft image */}
                <div className="relative w-full h-[85%] z-10 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[#D04741]/20 rounded-full blur-[80px] opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />
                  <Image
                    src={aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"}
                    alt="Staraptor VTOL Model 1"
                    fill
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105"
                    priority
                    unoptimized={aircraft?.heroImage?.startsWith('data:') || aircraft?.heroImage?.startsWith('http')}
                  />
                </div>
              </div>

              {/* Engineering Specifications */}
              <div className="mb-12">
                <Card className="bg-[#1b1b1b] border border-white/5 rounded-xl shadow-lg overflow-hidden p-0">
                  <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <img src="/icons/Stat Icon.svg" alt="Engineering" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-title-box">Model 1 Engineering Specifications</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 p-6 sm:p-8 gap-8">
                    {/* Physical Data */}
                    <div>
                      <h5 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Physical Data
                      </h5>
                      <ul className="space-y-4 font-semibold text-sm font-['Montserrat']">
                        {physicalData.map((item, i) => (
                          <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-300">{item.label}</span>
                            <span className="text-primary text-base font-bold">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Performance Data */}
                    <div className="md:border-l md:border-white/10 md:pl-8">
                      <h5 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Performance Data
                      </h5>
                      <ul className="space-y-4 font-semibold text-sm">
                        {performanceData.map((item, i) => (
                          <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-300">{item.label}</span>
                            <span className="text-primary text-base font-bold">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Avionics Package */}
                    <div className="md:border-l md:border-white/10 md:pl-8">
                      <h5 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Avionics & Systems
                      </h5>
                      <ul className="space-y-5 text-sm">
                        {avionics.map((item, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="text-primary font-bold block mb-1">{item.title}</span>
                              <span className="text-xs text-gray-400">{item.desc}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Component List */}
              {components.length > 0 && (
                <div>
                  <Card className="bg-[#1b1b1b] rounded-xl shadow-lg overflow-hidden border border-white/5 p-0">
                    <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img src="/icons/settings-5-fill.svg" alt="Component List" className="w-full h-full object-contain" />
                      </div>
                      <h4 className="text-title-box">Basic Component List</h4>
                    </div>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-white bg-[#D04741] font-heading font-semibold text-base">
                          <tr>
                            <th className="px-6 py-3 border-r border-white/20 w-1/3">Item</th>
                            <th className="px-6 py-3 text-center">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {components.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-[#181818]" : "bg-[#202020]"}>
                              <td className="px-6 py-3 border-r border-white/5 font-semibold text-white">{row.name}</td>
                              <td className="px-6 py-3 text-gray-300">{row.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          ) : (
            /* MODEL 2 - Coming Soon Card */
            <motion.div
              key="model-2-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-[#242424] rounded-2xl p-6 sm:p-10 md:p-14 shadow-2xl border border-white/5 mb-14 text-center relative overflow-hidden"
            >
              {/* Aerospace background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D04741]/20 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A] mb-6 shadow-[0_0_30px_rgba(208,71,65,0.3)]">
                  <Sparkles size={32} />
                </div>

                <Badge variant="glow" className="mb-4 uppercase tracking-widest text-xs font-mono">
                  Advanced Development Phase
                </Badge>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-montserrat text-white uppercase tracking-tight mb-4">
                  Staraptor VTOL - Model 2
                </h3>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                  Our engineering team is actively developing the second-generation VTOL UAV platform. Engineered for extended maritime endurance, elevated payload capacity, and automated target recognition for Phase 2 of METU 2026.
                </p>

                {/* Anticipated Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 text-left">
                  <Card className="bg-[#1a1a1a]/80 border-white/5 p-4 rounded-xl">
                    <Cpu size={20} className="text-[#EF5F5A] mb-2" />
                    <span className="font-bold text-white text-sm block mb-1">AI Autonomous Flight</span>
                    <span className="text-xs text-gray-400 block">Onboard edge computing with computer-vision precision landing</span>
                  </Card>

                  <Card className="bg-[#1a1a1a]/80 border-white/5 p-4 rounded-xl">
                    <Shield size={20} className="text-[#EF5F5A] mb-2" />
                    <span className="font-bold text-white text-sm block mb-1">Extended Range</span>
                    <span className="text-xs text-gray-400 block">Next-generation lightweight composite structure with 120+ min endurance</span>
                  </Card>

                  <Card className="bg-[#1a1a1a]/80 border-white/5 p-4 rounded-xl">
                    <Plane size={20} className="text-[#EF5F5A] mb-2" />
                    <span className="font-bold text-white text-sm block mb-1">Heavy-Lift VTOL</span>
                    <span className="text-xs text-gray-400 block">Optimized tilt-rotor transition mechanism for high wind stability</span>
                  </Card>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-[#EF5F5A] animate-ping"></span>
                  <span>CAD Modeling & Aerodynamic CFD Testing in Progress</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Competition Overview Section */}
        <motion.div
          className="mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} custom={0}
        >
          <div className="mb-4">
            <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-[#EF5F5A] font-bold block mb-1">
              MISSION BRIEF
            </span>
            <h2 className="text-2xl font-bold font-montserrat text-white">
              Competition Overview & Rules
            </h2>
          </div>

          <Card className="bg-[#1f1f1f] rounded-xl shadow-xl overflow-hidden border border-white/5 p-0">
            <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">O</div>
              <h3 className="text-title-box">METU Competition Specifications</h3>
            </div>
            
            <div className="p-6 sm:p-8">
              <p className="mb-6 text-sm sm:text-base leading-relaxed text-gray-300 whitespace-pre-line">
                {vtol?.overviewText || 'The 9th VTOL Aircraft Design Competition challenges university engineering teams to design, fabricate, and autonomously operate a hybrid VTOL UAV capable of vertical takeoff, high-speed cruise transition, target payload delivery, and precision autonomous landing.'}
              </p>
              
              {vtol?.posterImage && (
                <div className="relative w-full aspect-[21/9] bg-black mb-6 border border-white/10 overflow-hidden rounded-lg">
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
          </Card>
        </motion.div>

        {/* Dynamic Requirements */}
        <div className="space-y-6 mb-12">
          {requirements.map((req, idx) => (
            <motion.div
              key={idx}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1 * idx}
            >
              <Card className="bg-[#1f1f1f] rounded-xl shadow-lg overflow-hidden border border-white/5 p-0">
                <div className="bg-[#e4e4e4] px-6 py-3 flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm text-primary font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <h4 className="text-title-box">{req.title}</h4>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                    {req.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action: Track Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#2a1d1d] to-[#1c1c1c] border border-[#D04741]/30">
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Want to track fabrication and testing?</h4>
            <p className="text-gray-400 text-sm">Follow flight logs, CAD prototypes, and development milestones.</p>
          </div>
          <Button asChild className="rounded-lg font-bold px-6 py-2.5 shrink-0">
            <Link href="/progress" className="gap-2 inline-flex items-center">
              <span>View Progress Timeline</span>
              <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}