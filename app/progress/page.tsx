'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Cpu,
  Shield,
  Activity,
  ArrowRight,
  ArrowLeft,
  Layers,
  ChevronRight,
  Plus,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSiteContent } from '@/lib/useContent';
import { ProgressProject, SpecItem, AvionicsItem, ComponentItem, AnalysisItem } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

function ProgressContent() {
  const { content, loading } = useSiteContent();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fallback default project if content hasn't loaded or projects array is empty
  const defaultFallbackProject: ProgressProject = {
    id: 'staraptor-vtol-v1',
    slug: 'vtol-v1',
    name: content?.aircraft?.name || 'STARAPTOR VTOL - V1',
    category: 'FEATURED PROJECT: Active Aerospace Platform',
    competition: 'METU VTOL 2026',
    summary:
      'Flagship hybrid tilt-rotor VTOL aircraft engineered for the 9th METU Competition. Combines fixed-wing aerodynamic cruise speed with vertical hover precision and autonomous maritime delivery.',
    heroImage: content?.aircraft?.heroImage || '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png',
    badges: ['HYBRID VTOL', 'TILT-ROTOR', 'MODEL 1 ACTIVE', 'AUTONOMOUS'],
    statusText: 'Active Prototype & Flight Ready',
    date: '2026-03-01',
    featured: true,
    physicalData: content?.aircraft?.physicalData || [
      { id: 'pd-1', label: 'Wingspan', value: '1.340 m' },
      { id: 'pd-2', label: 'Length', value: '0.99 m' },
      { id: 'pd-3', label: 'Payload Capacity', value: '8 Kg' },
      { id: 'pd-4', label: 'Approximate Weight', value: '2 Kg' },
    ],
    performanceData: content?.aircraft?.performanceData || [
      { id: 'perf-1', label: 'Cruise Speed', value: '60-70 Kmph' },
      { id: 'perf-2', label: 'Endurance', value: '90 min' },
      { id: 'perf-3', label: 'Wing Load', value: '55-75 gm/dm²' },
    ],
    avionics: content?.aircraft?.avionics || [
      { id: 'av-1', title: 'Top Quality Materials', desc: 'Carbon Fiber / GRP Composite Sheet' },
      { id: 'av-2', title: 'Airfoil Type', desc: 'Eppler E205' },
      { id: 'av-3', title: 'Electronics', desc: 'BLDC motors, Pixhawk flight controller, GPS' },
    ],
    components: content?.aircraft?.components || [],
    analyses: content?.aircraft?.analyses || [],
    customSections: [],
  };

  const projects: ProgressProject[] =
    content?.projects && content.projects.length > 0 ? content.projects : [defaultFallbackProject];

  // Sync selected project with URL query param if present
  useEffect(() => {
    const projParam = searchParams.get('project');
    if (projParam) {
      setSelectedProjectId(projParam);
    }
  }, [searchParams]);

  const activeProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId || p.slug === selectedProjectId) || projects[0]
    : null;

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push(`/progress?project=${projectId}`, { scroll: false });
  };

  const handleBackToFleet = () => {
    setSelectedProjectId(null);
    router.push('/progress', { scroll: false });
  };

  return (
    <div className="bg-[#202020] min-h-screen py-12 md:py-20 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Aircraft Fleet & Engineering Progress
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
            <p className="text-sm text-gray-400 font-mono">Loading aircraft fleet...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!activeProject ? (
              /* VIEW 1: PROJECTS SUMMARY BOX (Centered flex wrapping) */
              <motion.div
                key="summary-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {/* Centered flex wrap: 1 in middle, 2 middle, 3 middle, 4 middle, 5 wraps */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id || idx}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, delay: idx * 0.1 }}
                      className="w-full sm:w-[calc(100%-1rem)] md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)] max-w-xl flex"
                    >
                      <div
                        onClick={() => handleSelectProject(project.id)}
                        className="group relative bg-[#242424] hover:bg-[#282828] border border-white/10 hover:border-[#D04741]/60 rounded-3xl p-5 sm:p-7 shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_15px_40px_rgba(208,71,65,0.22)] w-full overflow-hidden"
                      >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D04741]/50 to-transparent group-hover:via-[#EF5F5A] transition-all" />

                        <div>
                          {/* Card Subtitle & Lab Tag */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#EF5F5A] font-bold">
                              {project.category || 'Featured Platform'}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                              {project.competition || 'CUET Aerospace'}
                            </span>
                          </div>

                          {/* Cover Image / 3D Render Preview */}
                          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#181818] border border-white/5 mb-5 group-hover:border-[#D04741]/30 transition-colors">
                            <Image
                              src={project.heroImage || '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png'}
                              alt={project.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Floating Active Status Pill */}
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-medium">
                                {project.statusText || 'Active Prototype'}
                              </span>
                            </div>

                            {/* Floating Arrow Icon Button */}
                            <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/10 group-hover:bg-[#D04741] group-hover:border-[#D04741] flex items-center justify-center text-white transition-all shadow-lg group-hover:scale-110">
                              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-white tracking-tight group-hover:text-[#ff8883] transition-colors mb-2">
                            {project.name}
                          </h2>

                          {/* Summary Paragraph */}
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4">
                            {project.summary}
                          </p>

                          {/* Badges */}
                          {project.badges && project.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {project.badges.map((badge, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300 group-hover:border-[#D04741]/30 transition-colors"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quick Spec Metrics Snapshot & CTA Button */}
                        <div className="pt-4 border-t border-white/10 mt-auto">
                          {project.physicalData && project.physicalData.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-4 bg-black/30 p-2.5 rounded-xl border border-white/5">
                              {project.physicalData.slice(0, 2).map((metric, mIdx) => (
                                <div key={mIdx} className="text-center">
                                  <span className="text-[10px] uppercase font-mono text-gray-400 block">
                                    {metric.label}
                                  </span>
                                  <span className="text-xs font-bold text-white font-mono">
                                    {metric.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs font-bold text-[#EF5F5A] group-hover:text-white transition-colors">
                            <span>Explore Full Specifications & Data</span>
                            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              View Specs <ArrowRight size={13} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* VIEW 2: FULL DETAILED ENGINEERING SPECIFICATIONS PAGE */
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12 mb-16 w-full"
              >
                {/* Back Button Navigation Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <button
                    onClick={handleBackToFleet}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowLeft size={14} className="text-[#EF5F5A]" />
                    <span>← Back to Fleet Overview</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span>Project:</span>
                    <span className="text-white font-bold">{activeProject.name}</span>
                  </div>
                </div>

                {/* Model Card Container */}
                <div className="bg-[#242424] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
                  
                  {/* Aircraft Identity Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold">
                          {activeProject.statusText || 'Active Prototype & Flight Ready'}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold font-montserrat text-white tracking-tight">
                        {activeProject.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
                        {activeProject.summary}
                      </p>
                    </div>

                    {activeProject.badges && activeProject.badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {activeProject.badges.map((badge, bIdx) => (
                          <Badge
                            key={bIdx}
                            variant={bIdx === 0 ? 'default' : 'outline'}
                            className="font-mono text-xs uppercase px-3 py-1"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* High-Resolution Hero Render */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#181818] to-[#121212] border border-white/5 mb-10 shadow-inner group">
                    <Image
                      src={activeProject.heroImage || '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png'}
                      alt={activeProject.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </div>

                  {/* Engineering Specifications Card (with Previous White Bar Header) */}
                  <Card className="bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-0 mb-10">
                    <div className="bg-[#e4e4e4] px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <Activity size={18} className="text-[#202020]" />
                        </div>
                        <h3 className="text-title-box">
                          {activeProject.name} Engineering Specifications
                        </h3>
                      </div>
                    </div>

                    {/* 3-Column Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 p-6 sm:p-8 gap-8">
                      {/* 1. Physical Data */}
                      <div>
                        <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                          <Plane size={16} className="text-[#D04741]" />
                          <span>Physical Data</span>
                        </h4>
                        <ul className="space-y-3.5 font-semibold text-sm font-montserrat">
                          {activeProject.physicalData && activeProject.physicalData.length > 0 ? (
                            activeProject.physicalData.map((item, idx) => (
                              <li key={item.id || idx} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300 font-mono">{item.label}</span>
                                <span className="text-white font-mono font-bold">{item.value}</span>
                              </li>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No physical specs configured.</p>
                          )}
                        </ul>
                      </div>

                      {/* 2. Performance Data */}
                      <div>
                        <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                          <Activity size={16} className="text-[#D04741]" />
                          <span>Performance Data</span>
                        </h4>
                        <ul className="space-y-3.5 font-semibold text-sm font-montserrat">
                          {activeProject.performanceData && activeProject.performanceData.length > 0 ? (
                            activeProject.performanceData.map((item, idx) => (
                              <li key={item.id || idx} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300 font-mono">{item.label}</span>
                                <span className="text-white font-mono font-bold">{item.value}</span>
                              </li>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No performance specs configured.</p>
                          )}
                        </ul>
                      </div>

                      {/* 3. Avionics & Systems */}
                      <div>
                        <h4 className="text-subtitle-box mb-5 border-b border-gray-sub/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                          <Cpu size={16} className="text-[#D04741]" />
                          <span>Avionics & Systems</span>
                        </h4>
                        <div className="space-y-4">
                          {activeProject.avionics && activeProject.avionics.length > 0 ? (
                            activeProject.avionics.map((item, idx) => (
                              <div key={item.id || idx} className="text-xs">
                                <span className="text-[#EF5F5A] font-bold block mb-1">{item.title}</span>
                                <span className="text-gray-300 leading-relaxed block">{item.desc}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No avionics configured.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Component Bill of Materials (BOM) List (with Previous White Bar Header) */}
                  {activeProject.components && activeProject.components.length > 0 && (
                    <Card className="bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-0 mb-10">
                      <div className="bg-[#e4e4e4] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Layers size={18} className="text-[#202020]" />
                          </div>
                          <h3 className="text-title-box">Component Bill of Materials (BOM)</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#333333]">
                          {activeProject.components.length} Selected Parts
                        </span>
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {activeProject.components.map((comp, idx) => (
                            <div
                              key={idx}
                              className="bg-[#141414] p-3.5 rounded-xl border border-white/5 hover:border-white/15 transition-colors"
                            >
                              <span className="text-xs font-bold text-white block mb-1 font-montserrat">
                                {comp.name}
                              </span>
                              <span className="text-[11px] text-gray-400 leading-relaxed block">
                                {comp.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Aerodynamic CFD & Structural Analyses (with Previous White Bar Header) */}
                  {activeProject.analyses && activeProject.analyses.length > 0 && (
                    <Card className="bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-0 mb-10">
                      <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <Activity size={18} className="text-[#202020]" />
                        </div>
                        <h3 className="text-title-box">Aerodynamic & CFD Flight Analyses</h3>
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeProject.analyses.map((analysis, idx) => (
                            <div
                              key={idx}
                              className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5 p-3 group"
                            >
                              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40 mb-3">
                                <Image
                                  src={analysis.src}
                                  alt={analysis.alt || 'Analysis'}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                              <p className="text-xs font-mono text-gray-300 px-1">
                                {analysis.caption}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* DYNAMIC CUSTOM SECTIONS (with Previous White Bar Header) */}
                  {activeProject.customSections && activeProject.customSections.length > 0 && (
                    <div className="space-y-10 mb-10">
                      {activeProject.customSections.map((sec, secIdx) => (
                        <Card key={sec.id || secIdx} className="bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-0">
                          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <Layers size={18} className="text-[#202020]" />
                            </div>
                            <h3 className="text-title-box">{sec.title}</h3>
                          </div>

                          <div className="p-6 sm:p-8">
                            {/* Custom Specs Table */}
                            {sec.type === 'specs' && sec.specs && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {sec.specs.map((sp, spIdx) => (
                                  <div key={sp.id || spIdx} className="bg-[#141414] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-mono">{sp.label}</span>
                                    <span className="text-white font-bold font-mono">{sp.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Custom Component List */}
                            {sec.type === 'components' && sec.components && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {sec.components.map((cp, cpIdx) => (
                                  <div key={cpIdx} className="bg-[#141414] p-3.5 rounded-xl border border-white/5">
                                    <span className="text-white font-bold text-xs block mb-1">{cp.name}</span>
                                    <span className="text-gray-400 text-xs leading-relaxed">{cp.desc}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Custom Text / Overview */}
                            {sec.type === 'text' && sec.content && (
                              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                {sec.content}
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Return Button at Bottom */}
                  <div className="mt-12 pt-6 border-t border-white/10 flex justify-center">
                    <button
                      onClick={handleBackToFleet}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white text-xs font-bold shadow-lg shadow-[#D04741]/20 hover:opacity-95 transition-all"
                    >
                      <ArrowLeft size={16} />
                      <span>← Back to Our Progress Fleet Overview</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#202020] min-h-screen py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-gray-400 font-mono">Loading telemetry...</p>
      </div>
    }>
      <ProgressContent />
    </Suspense>
  );
}
