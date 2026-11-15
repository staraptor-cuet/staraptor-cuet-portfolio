'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Sparkles, Cpu, Shield } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

function Vtol2026Content() {
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

  const defaultComponents = [
    { name: "LiPo Battery", desc: "Primary onboard power source that supplies electrical energy to motors and electronics." },
    { name: "LiPo Charger", desc: "Specialized charger designed to safely charge lithium polymer batteries." },
    { name: "Flight Controller", desc: "The central autopilot system that stabilizes the aircraft and manages navigation, sensors, and control algorithms." },
    { name: "Companion Computer", desc: "Auxiliary onboard computer used for advanced processing such as computer vision, AI tasks, or mission logic." },
    { name: "GPS Module", desc: "Provides global positioning data for navigation, waypoint following, and autonomous flight operations." },
    { name: "Airspeed Sensor", desc: "Measures the aircraft's airspeed to support accurate flight control and efficiency optimization." },
    { name: "Camera", desc: "Captures visual data for monitoring, surveillance, or computer vision tasks." },
    { name: "Wide Angle Lens", desc: "Expands the camera's field of view to capture a broader visual area during flight." },
    { name: "Telemetry Radio", desc: "Enables wireless data communication between the aircraft and the ground control station." },
    { name: "RC Transmitter", desc: "Handheld remote controller used by the pilot to send control commands to the aircraft." },
    { name: "RC Receiver", desc: "Onboard device that receives signals from the RC transmitter and passes them to the flight controller." }
  ];

  const components = (aircraft?.components && aircraft.components.length > 0) ? aircraft.components : defaultComponents;

  return (
    <div className="bg-background min-h-screen py-10 md:py-16 text-gray-sub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div className="mb-10" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="mb-2">
            <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">
              CUET Autonomous Aerospace Initiative
            </span>
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
              {/* Model 1 Header */}
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-montserrat text-white">
                  {aircraft?.name || 'STARAPTOR VTOL - MODEL 1 (V1)'}
                </h3>
              </div>

              {/* Hero Render (clean without crosshair bars) */}
              <div className="relative w-full aspect-video md:aspect-[21/10] mb-10 border-b border-white/10 pb-6 flex items-center justify-center overflow-hidden bg-[#1a1a1a]/60 rounded-xl">
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
                <div className="mb-12">
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
                    <div className="py-4 text-center border-t border-white/5">
                      <p className="text-xs uppercase tracking-wider text-gray-400">Additional subsystems & telemetry modules utilized during bench testing</p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Analysis */}
              <div className="mb-12">
                <Card className="bg-[#1b1b1b] rounded-xl shadow-lg overflow-hidden border border-white/5 p-0">
                  <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <img src="/icons/search-eye-line.svg" alt="Analysis" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-title-box">Analysis</h4>
                  </div>
                  <div className="py-8 sm:py-12 px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-start gap-8 lg:gap-12 bg-[#202020]">
                    <div className="flex flex-col gap-4">
                      {[
                        { src: '/images/analysis-img-2.png', alt: 'CFD Analysis - Top View' },
                        { src: '/images/analysis-img-1.png', alt: 'CFD Analysis - Side View' },
                      ].map((img, i) => (
                        <div key={i} className="relative aspect-[16/9] w-full group overflow-hidden rounded-lg bg-black/40 border border-white/5">
                          <Image src={img.src} alt={img.alt} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#D04741]/90 px-3 py-1.5 rounded">
                              View Analysis
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-6 justify-start text-gray-300 text-sm leading-relaxed">
                      <h5 className="text-lg font-bold font-montserrat text-white">
                        VTOL UAV Aerodynamic CFD (Hover Mode Analysis)
                      </h5>

                      <p>
                        This simulation presents the static pressure distribution over a fixed-wing VTOL UAV in hover mode, performed using ANSYS Fluent (CFD). The analysis captures the complex interaction between the fuselage, wing, and multiple rotors operating under vertical lift conditions.
                      </p>

                      <p>
                        A 3D computational domain was developed with rotor-induced flow modeled using appropriate rotating frame techniques. The results highlight high-pressure regions near rotor downwash zones and fuselage surfaces, along with low-pressure regions contributing to lift generation and flow recirculation.
                      </p>

                      <div className="space-y-2">
                        <p className="font-semibold text-white">
                          This hover-condition analysis is critical for:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-300 pl-1 font-semibold">
                          <li><span className="text-white">Evaluating vertical lift performance</span></li>
                          <li><span className="text-white">Understanding rotor–body aerodynamic interaction</span></li>
                          <li><span className="text-white">Supporting design optimization of VTOL configurations</span></li>
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-gray-400 font-mono">
                        <p><span className="text-white font-bold font-sans text-sm">Tools Used:</span> ANSYS Fluent, ANSYS Workbench</p>
                        <p><span className="text-white font-bold font-sans text-sm">Analysis Type:</span> 3D CFD (Hover Mode)</p>
                        <p><span className="text-white font-bold font-sans text-sm">Outputs:</span> Static Pressure Contours, Flow Field Visualization</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Progress */}
              <div>
                <Card className="bg-[#1b1b1b] rounded-xl shadow-lg overflow-hidden border border-white/5 p-0">
                  <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <img src="/icons/donut-chart-fill.svg" alt="Progress" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-title-box">Progress</h4>
                  </div>
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-[#202020]">
                    <div className="group relative overflow-hidden rounded-lg border border-white/5 cursor-pointer">
                      <img
                        src="/images/progress image.jpg"
                        alt="Progress Parts"
                        className="w-full h-auto object-contain block transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D04741]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                      <p>
                        The first iteration of the VTOL UAV prototype has been completed, enabling preliminary validation of the design configuration and structural integrity. This phase provided critical insights into assembly constraints, material behavior, and integration of key components.
                      </p>
                      <p>
                        Ongoing work is focused on iterative optimization, including improvements in structural efficiency, weight reduction, and alignment accuracy. These refinements aim to enhance aerodynamic performance and ensure better stability in subsequent prototype versions.
                      </p>
                    </div>
                  </div>

                  {/* Integrated Timeline */}
                  <div className="px-6 sm:px-8 pb-10 pt-4 bg-[#202020] w-full hidden md:block border-t border-white/5">
                    <div className="w-full flex flex-col relative mx-auto max-w-4xl pt-4">
                      <div className="flex justify-between w-full mb-6 relative">
                        {[
                          '/icons/checkbox-circle-fill.svg',
                          '/icons/checkbox-circle-fill.svg',
                          '/icons/settings-fill.svg',
                          '/icons/settings-fill.svg',
                        ].map((icon, i) => (
                          <div key={i} className="flex flex-col items-center flex-1">
                            <div className="w-14 h-14 rounded-full bg-[#e4e4e4] flex items-center justify-center shrink-0 shadow-md">
                              <img src={icon} alt="Step" className="w-8 h-8 object-contain" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="w-full flex h-2 mb-6 rounded-full overflow-hidden bg-[#474747]">
                        <div className="w-[38%] h-full bg-[#D04741]"></div>
                      </div>
                      <div className="flex justify-between w-full">
                        {['Conceptual Design', 'Simulation', 'Prototype', 'Successful Launch'].map((label, i) => (
                          <div key={i} className="flex-1 text-center px-2">
                            <span className="text-sm font-semibold font-montserrat text-white tracking-wide">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Timeline */}
                  <div className="px-6 pb-8 pt-4 bg-[#202020] w-full border-t border-white/5 md:hidden space-y-4">
                    {[
                      { name: 'Conceptual Design', icon: '/icons/checkbox-circle-fill.svg' },
                      { name: 'Simulation', icon: '/icons/checkbox-circle-fill.svg' },
                      { name: 'Prototype', icon: '/icons/settings-fill.svg' },
                      { name: 'Successful Launch', icon: '/icons/settings-fill.svg' }
                    ].map((step, i, arr) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-11 h-11 rounded-full bg-[#e4e4e4] flex items-center justify-center shadow">
                            <img src={step.icon} alt={step.name} className="w-6 h-6 object-contain" />
                          </div>
                          {i < arr.length - 1 && (
                            <div className="w-0.5 h-8 bg-white/20 mt-1" />
                          )}
                        </div>
                        <span className="text-sm font-semibold font-montserrat text-white pt-2.5">{step.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
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

      </div>
    </div>
  );
}

export default function Vtol2026Page() {
  return (
    <Suspense fallback={
      <div className="bg-[#202020] min-h-screen py-24 flex items-center justify-center text-gray-400 font-mono text-sm">
        <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <Vtol2026Content />
    </Suspense>
  );
}
