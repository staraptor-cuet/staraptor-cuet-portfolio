'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plane, Cpu, Shield, Activity, CheckCircle2, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSiteContent } from '@/lib/useContent';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function ProgressPage() {
  const { content, loading } = useSiteContent();
  const aircraft = content?.aircraft;

  // Fallback defaults if not set yet in content
  const physicalData = aircraft?.physicalData || [
    { id: 'pd-1', label: 'Wingspan', value: '1.340 m' },
    { id: 'pd-2', label: 'Length', value: '0.99 m' },
    { id: 'pd-3', label: 'Payload Capacity', value: '8 Kg' },
    { id: 'pd-4', label: 'Approximate Weight', value: '2 Kg' },
  ];

  const performanceData = aircraft?.performanceData || [
    { id: 'perf-1', label: 'Cruise Speed', value: '60-70 Kmph' },
    { id: 'perf-2', label: 'Endurance', value: '90 min' },
    { id: 'perf-3', label: 'Wing Load', value: '55-75 gm/dm²' },
  ];

  const avionics = aircraft?.avionics || [
    { id: 'av-1', title: 'Top Quality Materials', desc: 'Carbon Fiber / GRP Composite Sheet' },
    { id: 'av-2', title: 'Airfoil Type', desc: 'Eppler E205' },
    { id: 'av-3', title: 'Electronics', desc: 'BLDC motors, Pixhawk flight controller, GPS' },
  ];

  const components = aircraft?.components || [];
  const analyses = aircraft?.analyses || [];

  return (
    <div className="bg-[#202020] min-h-screen py-12 md:py-20 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Aircraft Fleet & Specifications
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Our Progress
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Follow Team Staraptor CUET&apos;s active aircraft developments, engineering specifications, and autonomous flight initiatives.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-gray-400 font-mono">Loading aircraft telemetry...</p>
          </div>
        ) : (
          /* Main Aircraft Specifications Box */
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="space-y-12 mb-16"
          >
            {/* Model Card Container */}
            <div className="bg-[#242424] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
              
              {/* Aircraft Identity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                      Active Prototype & Flight Ready
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-montserrat text-white tracking-tight">
                    {aircraft?.name || 'STARAPTOR VTOL - V1'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-black/60 border border-white/20 text-white shadow-md">
                    Hybrid Tilt-Rotor
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-[#D04741] text-white shadow-md">
                    Model 1
                  </span>
                </div>
              </div>

              {/* 3D Aircraft Hero Render */}
              <div className="relative w-full aspect-video md:aspect-[21/10] mb-10 border-b border-white/10 pb-6 flex items-center justify-center overflow-hidden bg-[#1a1a1a]/70 rounded-2xl">
                <div className="relative w-full h-[90%] z-10 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[#D04741]/20 rounded-full blur-[90px] opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />
                  <Image
                    src={aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"}
                    alt={aircraft?.name || 'Staraptor VTOL Aircraft'}
                    fill
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105"
                    priority
                    unoptimized={aircraft?.heroImage?.startsWith('data:') || aircraft?.heroImage?.startsWith('http')}
                  />
                </div>
              </div>

              {/* Engineering Specifications (3 Columns) */}
              <div className="mb-10">
                <Card className="bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-0">
                  <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Activity size={18} className="text-[#202020]" />
                    </div>
                    <h3 className="text-title-box">Model 1 Engineering Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 p-6 sm:p-8 gap-8">
                    {/* Physical Data */}
                    <div>
                      <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Physical Data
                      </h4>
                      <ul className="space-y-3.5 font-semibold text-sm font-['Montserrat']">
                        {physicalData.map((item, i) => (
                          <li key={item.id || i} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-300">{item.label}</span>
                            <span className="text-primary text-base font-bold">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Performance Data */}
                    <div className="md:border-l md:border-white/10 md:pl-8">
                      <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Performance Data
                      </h4>
                      <ul className="space-y-3.5 font-semibold text-sm">
                        {performanceData.map((item, i) => (
                          <li key={item.id || i} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-300">{item.label}</span>
                            <span className="text-primary text-base font-bold">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Avionics Package */}
                    <div className="md:border-l md:border-white/10 md:pl-8">
                      <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">
                        Avionics & Systems
                      </h4>
                      <ul className="space-y-4 text-sm">
                        {avionics.map((item, i) => (
                          <li key={item.id || i} className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="text-primary font-bold block mb-0.5">{item.title}</span>
                              <span className="text-xs text-gray-400">{item.desc}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Component Bill of Materials (Centered flex wrapping rule) */}
              {components.length > 0 && (
                <div className="mb-10">
                  <Card className="bg-[#1b1b1b] rounded-2xl shadow-xl overflow-hidden border border-white/10 p-0">
                    <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Cpu size={18} className="text-[#202020]" />
                      </div>
                      <h3 className="text-title-box">Basic Component List</h3>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {components.map((comp, idx) => (
                          <div
                            key={idx}
                            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#D04741]/40 transition-colors flex flex-col justify-between"
                          >
                            <span className="font-montserrat font-bold text-sm text-white block mb-1">
                              {comp.name}
                            </span>
                            <span className="text-xs text-gray-400 leading-relaxed font-sans">
                              {comp.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Aerodynamic CFD Analyses */}
              {analyses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                      Aerodynamic CFD Simulations & Testing
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {analyses.map((analysis, idx) => (
                      <div
                        key={idx}
                        className="w-full md:w-[calc(50%-0.75rem)] rounded-2xl overflow-hidden bg-black/50 border border-white/10 hover:border-[#D04741]/50 transition-all group"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                          <Image
                            src={analysis.src}
                            alt={analysis.alt}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 bg-[#1a1a1a] border-t border-white/5">
                          <p className="text-xs sm:text-sm font-semibold text-gray-300 font-montserrat">
                            {analysis.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
