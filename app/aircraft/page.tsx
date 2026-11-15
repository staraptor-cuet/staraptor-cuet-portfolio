'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function AircraftPage() {
  const { content } = useSiteContent();
  const aircraft = content?.aircraft;

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

  return (
    <div className="bg-background min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 text-gray-sub">
      <div className="max-w-7xl mx-auto bg-[#252525] rounded-2xl p-4 sm:p-8 md:p-12 shadow-2xl border border-white/5">
        
        {/* Header */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Badge variant="glow" className="mb-2 uppercase tracking-wider text-xs">
            Classification: {aircraft?.classification || 'Unmanned Aerial Vehicle'}
          </Badge>
          <h1 className="text-title-main">
            {aircraft?.name || 'STARAPTOR VTOL - V1'}
          </h1>
        </motion.div>

        {/* Hero Render */}
        <motion.div
          className="relative w-full aspect-video mb-10 md:mb-16 border-b border-gray-sub/20 pb-6 md:pb-8 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mb-8 opacity-60">
            <div className="absolute w-full h-[1px] border-b border-dashed border-white"></div>
            <div className="absolute h-[110%] w-[1px] border-r border-dashed border-white"></div>
          </div>
          <div className="relative w-full h-[85%] z-10 flex items-center justify-center">
            <Image
              src={aircraft?.heroImage || "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png"}
              alt="Staraptor VTOL V1"
              fill
              className="object-contain"
              priority
              unoptimized={aircraft?.heroImage?.startsWith('data:') || aircraft?.heroImage?.startsWith('http')}
            />
          </div>
        </motion.div>

        {/* Engineering Specifications */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} custom={0}
          className="mb-16"
        >
          <Card className="bg-[#1f1f1f] border-gray-sub/10 rounded-sm shadow-lg overflow-hidden p-0">
            <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <img src="/icons/Stat Icon.svg" alt="Engineering" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-title-box">Engineering Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-8">
              <div>
                <h3 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">Physical Data</h3>
                <ul className="space-y-4 font-semibold text-sm font-['Montserrat']">
                  {physicalData.map((item, i) => (
                    <li key={i} className="flex justify-between items-center border-b border-gray-sub/10 pb-2">
                      <span>{item.label}</span>
                      <span className="text-primary text-lg">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:border-l md:border-gray-sub/10 md:pl-8">
                <h3 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">Performance Data</h3>
                <ul className="space-y-4 font-semibold text-sm">
                  {performanceData.map((item, i) => (
                    <li key={i} className="flex justify-between items-center border-b border-gray-sub/10 pb-2">
                      <span>{item.label}</span>
                      <span className="text-primary text-lg">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:border-l md:border-gray-sub/10 md:pl-8">
                <h3 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">Avionics Package</h3>
                <ul className="space-y-6 text-sm">
                  {avionics.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-white text-xs">✓</span></div>
                      <div>
                        <span className="text-primary font-bold block mb-1">{item.title}</span>
                        <span className="text-xs text-gray-sub/80">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Basic Component List */}
        {components.length > 0 && (
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
            className="mb-16"
          >
            <Card className="bg-[#1f1f1f] rounded-sm shadow-lg overflow-hidden border-gray-sub/10 p-0">
              <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/icons/settings-5-fill.svg" alt="Component List" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-title-box">Basic Component List</h3>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-white bg-[#D04741] font-heading font-semibold text-base">
                    <tr>
                      <th className="px-6 py-3 border-r border-white/20 w-1/3">Item</th>
                      <th className="px-6 py-3 text-center">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#282828] divide-y divide-gray-sub/10">
                    {components.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#282828]"}>
                        <td className="px-6 py-3 border-r border-gray-sub/10 font-semibold">{row.name}</td>
                        <td className="px-6 py-3 text-gray-sub">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
