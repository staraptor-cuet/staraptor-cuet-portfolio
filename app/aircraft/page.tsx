'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function AircraftPage() {
  return (
    <div className="bg-background min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 text-gray-sub">
      <div className="max-w-7xl mx-auto bg-[#252525] rounded-2xl p-4 sm:p-8 md:p-12 shadow-2xl border border-white/5">
        
        {/* Header */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-label mb-2">Classification: Unmanned Aerial Vehicle</p>
          <h1 className="text-title-main">
            STARAPTOR VTOL - <span className="font-light text-gray-400">V1</span>
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
            <Image src="/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png" alt="Staraptor VTOL V1" fill className="object-contain" priority />
          </div>
        </motion.div>

        {/* Engineering Specifications */}
        <motion.div
          className="bg-[#1f1f1f] border border-gray-sub/10 rounded-sm mb-16 shadow-lg overflow-hidden"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} custom={0}
        >
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
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Wingspan</span> <span className="text-primary text-lg">1.340 m</span></li>
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Length</span> <span className="text-primary text-lg">0.99 m</span></li>
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Payload Capacity</span> <span className="text-primary text-lg">8 Kg</span></li>
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Approximate Weight</span> <span className="text-primary text-lg">2 Kg</span></li>
              </ul>
            </div>
            <div className="md:border-l md:border-gray-sub/10 md:pl-8">
              <h3 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">Performance Data</h3>
              <ul className="space-y-4 font-semibold text-sm">
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Cruise Speed</span> <span className="text-primary text-lg">60-70 Kmph</span></li>
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Endurance</span> <span className="text-primary text-lg">90 min</span></li>
                <li className="flex justify-between items-center border-b border-gray-sub/10 pb-2"><span>Wing Load</span> <span className="text-primary text-lg">55-75 gm/dm²</span></li>
              </ul>
            </div>
            <div className="md:border-l md:border-gray-sub/10 md:pl-8">
              <h3 className="text-subtitle-box mb-6 border-b border-gray-sub/20 pb-2 uppercase tracking-wide">Avionics Package</h3>
              <ul className="space-y-6 text-sm">
                {[
                  { title: 'Top Quality Materials', desc: 'Carbon Fiber / GRP Composite Sheet' },
                  { title: 'Airfoil Type', desc: 'Eppler E205' },
                  { title: 'Electronics', desc: 'BLDC motors, Pixhawk flight controller, GPS' },
                ].map((item, i) => (
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
        </motion.div>

        {/* Basic Component List */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm mb-16 shadow-lg overflow-hidden border border-gray-sub/10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
        >
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
                {[
                  { name: "3D Printer", desc: "Used to manufacture custom aircraft parts such as mounts, brackets, and structural components during prototyping and testing." },
                  { name: "LW-PLA Filament", desc: "Lightweight PLA filament used for printing aerodynamic components such as wings and fuselage parts where low weight is critical." },
                  { name: "PETG Filament", desc: "Durable 3D printing material used for parts requiring higher strength and heat resistance." },
                  { name: "Carbon Fiber Rods", desc: "Structural reinforcement elements used inside wings or frames to increase stiffness while keeping weight low." },
                  { name: "Brushless Motor", desc: "Electric motor responsible for generating thrust to propel the aircraft." },
                  { name: "Propellers", desc: "Rotating blades that convert motor torque into thrust to move the aircraft through the air." },
                  { name: "ESC (Electronic Speed Controller)", desc: "Controls the speed and power delivered from the battery to the brushless motor." },
                  { name: "Servo Motor", desc: "Actuator used to control aircraft control surfaces such as ailerons, elevators, and rudders." },
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
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#282828]"}>
                    <td className="px-6 py-3 border-r border-gray-sub/10 font-semibold">{row.name}</td>
                    <td className="px-6 py-3 text-gray-sub">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-6 text-center">
            <p className="text-subtitle-box !normal-case tracking-normal">More Components have been Used</p>
          </div>
        </motion.div>

        {/* Analysis */}
<motion.div
  className="bg-[#1f1f1f] rounded-sm shadow-lg overflow-hidden border border-gray-sub/10 mb-16"
  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
>
  <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img src="/icons/search-eye-line.svg" alt="Analysis" className="w-full h-full object-contain" />
    </div>
    <h3 className="text-title-box">Analysis</h3>
  </div>
  <div className="py-[55px] px-8 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] items-start gap-x-12 gap-y-6 lg:gap-y-12 bg-[#252525]">
    
    <div className="flex flex-col gap-1 lg:gap-2">
      {[
        { src: '/images/analysis-img-2.png', alt: 'CFD Analysis 2' },
        { src: '/images/analysis-img-1.png', alt: 'CFD Analysis 1' },
      ].map((img, i) => (
        <div key={i} className="relative aspect-[16/9] w-full group overflow-hidden cursor-zoom-in rounded-sm">
          <Image src={img.src} alt={img.alt} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#D04741]/80 px-3 py-1.5 rounded">
              View Analysis
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-8 justify-start">
      <p className="text-body">
        VTOL UAV Aerodynamic CFD (Hover Mode Analysis)
      </p>

      <div className="flex flex-col gap-6">
        <p className="text-body">
          This simulation presents the static pressure distribution over a fixed-wing VTOL UAV in hover mode, performed using ANSYS Fluent (CFD). The analysis captures the complex interaction between the fuselage, wing, and multiple rotors operating under vertical lift conditions.
        </p>

        <p className="text-body">
          A 3D computational domain was developed with rotor-induced flow modeled using appropriate rotating frame techniques. The results highlight high-pressure regions near rotor downwash zones and fuselage surfaces, along with low-pressure regions contributing to lift generation and flow recirculation.
        </p>

        <p className="text-body">
          This hover-condition analysis is critical for:
          <strong>
          • Evaluating vertical lift performance <br />
          • Understanding rotor–body aerodynamic interaction <br />
          • Supporting design optimization of VTOL configurations
          </strong>
        </p>

        <p className="text-body">
          <strong> Tools Used:</strong> ANSYS Fluent, ANSYS Workbench <br />
          <strong>Analysis Type:</strong> 3D CFD (Hover Mode) <br />
          <strong>Outputs:</strong> Static Pressure Contours, Flow Field Visualization
        </p>
      </div>
    </div>

  </div>
</motion.div>

        {/* Progress */}
        <motion.div
          className="bg-[#1f1f1f] rounded-sm shadow-lg overflow-hidden border border-gray-sub/10 mb-8"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} custom={0}
        >
          <div className="bg-[#e4e4e4] px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <img src="/icons/donut-chart-fill.svg" alt="Progress" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-title-box">Progress</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-[#252525]">
            <div className="group relative overflow-hidden rounded-sm cursor-pointer">
              <img
                src="/images/progress image.jpg"
                alt="Progress Parts"
                className="w-full h-auto object-contain block transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#D04741]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div><div className="space-y-6 mt-2">
            <p className="text-body">
  The first iteration of the VTOL UAV prototype has been completed, enabling preliminary validation of the design configuration and structural integrity. This phase provided critical insights into assembly constraints, material behavior, and integration of key components.
</p>

<p className="text-body">
  Ongoing work is focused on iterative optimization, including improvements in structural efficiency, weight reduction, and alignment accuracy. These refinements aim to enhance aerodynamic performance and ensure better stability in subsequent prototype versions.
</p>  
            </div>
          </div>

          {/* Integrated Timeline */}
          <div className="px-8 pb-12 pt-4 bg-[#252525] w-full hidden md:block">
            <div className="w-full flex flex-col relative mx-auto">
              <div className="flex justify-between w-full mb-6 relative">
                {[
                  '/icons/checkbox-circle-fill.svg',
                  '/icons/checkbox-circle-fill.svg',
                  '/icons/settings-fill.svg',
                  '/icons/settings-fill.svg',
                ].map((icon, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 rounded-full bg-[#e4e4e4] flex items-center justify-center shrink-0">
                      <img src={icon} alt="Step" className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex h-1.5 mb-6 rounded-full overflow-hidden">
                <div className="w-[38%] h-full bg-[#D04741]"></div>
                <div className="w-[62%] h-full bg-[#474747]"></div>
              </div>
              <div className="flex justify-between w-full">
                {['Conceptual Design', 'Simulation', 'Prototype', 'Successful Launch'].map((label, i) => (
                  <div key={i} className="flex-1 text-center px-4">
                    <span className="text-[15px] font-sans text-white tracking-wide leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="px-8 pb-10 pt-4 bg-[#252525] w-full border-t border-gray-sub/5 md:hidden">
            {[
              { name: 'Conceptual Design', icon: '/icons/checkbox-circle-fill.svg' },
              { name: 'Simulation', icon: '/icons/checkbox-circle-fill.svg' },
              { name: 'Prototype', icon: '/icons/settings-fill.svg' },
              { name: 'Successful Launch', icon: '/icons/settings-fill.svg' }
            ].map((step, i, arr) => (
              <div key={i} className="flex items-start gap-6">
                {/* Icon + vertical line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#e4e4e4] flex items-center justify-center">
                    <img src={step.icon} alt={step.name} className="w-6 h-6 object-contain" />
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 h-10 bg-gray-sub/20 mt-1" />
                  )}
                </div>
                {/* Label */}
                <span className="text-base font-sans text-white pt-3">{step.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
