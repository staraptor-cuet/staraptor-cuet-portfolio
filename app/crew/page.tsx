'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

const CrewMemberCard = ({ name, batch, index }: { name: string; batch: string; index: number }) => (
  <motion.div
    className="bg-[#2a2a2a] border border-gray-sub/20 rounded-xl p-3 shadow-lg flex flex-col items-center cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
    whileHover={{
      y: -8,
      scale: 1.03,
      boxShadow: '0 12px 30px rgba(208,71,65,0.35)',
      borderColor: 'rgba(208,71,65,0.7)',
      transition: { duration: 0.2 },
    }}
  >
    <div className="border border-primary rounded-lg overflow-hidden relative aspect-[3/4] w-full mb-4">
      <Image src="/images/kazi miftahul hoque.png" alt={name} fill className="object-cover" />
    </div>

    <h3 className="text-white font-heading font-bold text-sm text-center mb-1">{name}</h3>
    <p className="text-white text-xs mb-4">{batch}</p>

    <div className="flex gap-2 w-full">
      <a
        href="#"
        className="flex-1 bg-primary hover:bg-[#6A2421] text-white py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors"
      >
        <Image
          src="/icons/linkedin-box-fill.svg"
          alt="LinkedIn"
          width={14}
          height={14}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <span className="text-[10px] font-bold">LinkedIn</span>
      </a>

      <a
        href="#"
        className="flex-1 bg-primary hover:bg-[#6A2421] text-white py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors"
      >
        <Image
          src="/icons/mail-fill.svg"
          alt="Email"
          width={14}
          height={14}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <span className="text-[10px] font-bold">Email</span>
      </a>
    </div>
  </motion.div>
);

const CrewSection = ({ title, members }: { title: string; members: any[] }) => (
  <motion.div
    className="mb-16"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={fadeUp}
  >
    <div className="bg-gradient-to-b from-[#D04741] to-[#6A2421] py-4 px-8 text-center rounded-sm mb-8 shadow-md">
      <h2 className="text-title-section !text-xl tracking-wider uppercase">{title}</h2>
    </div>

    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-5xl mx-auto">
      {members.map((m, i) => (
        <div
          key={i}
          className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[240px]"
        >
          <CrewMemberCard name={m.name} batch={m.batch} index={i} />
        </div>
      ))}
    </div>
  </motion.div>
);

export default function CrewPage() {
  return (
    <div className="bg-background min-h-screen pb-20">

      {/* Intro / Vision / Mission */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-sub/10 overflow-hidden">

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

        {/* TEXT CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          <motion.div
            className="mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="text-title-main mb-6 text-gradient-red-v inline-block">
              We Are Staraptor
            </h1>

            <p className="text-sm text-gray-sub leading-relaxed max-w-2xl mx-auto">
              Welcome to Team Staraptor CUET, the first VTOL design team from CUET Bangladesh, set to make our mark at the METU VTOL Competition this October. Our team of 20 passionate students—specializing in mechanical, aerospace, and related fields—is dedicated to designing a cutting-edge VTOL UAV. We're combining lightweight materials, advanced aerodynamics, and smart control systems to deliver a drone that excels in stability, efficiency, and mission accuracy.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-title-section mb-4 text-gradient-red-v inline-block">
              Our Vision
            </h2>

            <p className="text-sm text-gray-sub max-w-4xl mx-auto">
              To become a leading UAV team, advancing drone innovation through engineering excellence and global competition. We aim to contribute to Bangladesh’s technological progress by developing high-performance UAV systems and inspiring the next generation of engineers to push the boundaries of what is possible.
            </p>
          </motion.div>

          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-title-section mb-4 text-gradient-red-v inline-block">
              Our Mission
            </h2>

            <p className="text-sm text-gray-sub max-w-4xl mx-auto">
              Our mission is to design, build, and operate cutting-edge drones that meet international standards, represent CUET on global platforms, and address real-world challenges through practical UAV applications. We are committed to continuous learning, teamwork, and mentorship—creating a sustainable culture of innovation while contributing to national development through meaningful technological solutions.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-title-section mb-10 text-gradient-red-v inline-block">
              Stats
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-y-6 gap-x-12">
              {[
                { label: 'Crew Members', value: '20' },
                { label: 'Sub-Teams', value: '4' },
                { label: 'Technical Roles', value: '6+' },
                { label: 'Operational Roles', value: '4+' },
              ].map(({ label, value }, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <span className="text-white font-semibold uppercase text-xs tracking-wide">
                    {label}
                  </span>

                  <span className="text-primary text-4xl font-heading font-bold">
                    {value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Meet The Crew */}
      <section className="py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <motion.h2
          className="text-title-section text-center mb-16 tracking-wide uppercase"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Meet The Crew
        </motion.h2>

        <CrewSection
          title="Designing Crew"
          members={Array(4).fill({ name: 'Kazi Miftahul Hoque', batch: '2020 Batch' })}
        />

        <CrewSection
          title="Simulation Crew"
          members={Array(4).fill({ name: 'Kazi Miftahul Hoque', batch: '2020 Batch' })}
        />

        <CrewSection
          title="Branding & Communication Crew"
          members={Array(6).fill({ name: 'Kazi Miftahul Hoque', batch: '2020 Batch' })}
        />

        <CrewSection
          title="Research Crew"
          members={Array(3).fill({ name: 'Kazi Miftahul Hoque', batch: '2020 Batch' })}
        />

        <motion.div
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-[#D04741] text-lg font-semibold tracking-wide">
            Further recruitment will be announced soon
          </p>
        </motion.div>

      </section>
    </div>
  );
}