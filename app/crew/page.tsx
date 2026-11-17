'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Member, members as fallbackMembers } from './members';
import { useSiteContent } from '@/lib/useContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, Layers, Cpu, Activity, Compass, Rocket } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

const getBadgeText = (member: Member) => {
  const d = member.designation || '';
  if (d.includes('Chief Advisor')) return 'Chief Advisor';
  if (d.includes('Advisor')) return 'Advisor';
  if (d.includes('Instructor')) return 'Instructor';
  if (d === 'Project Lead') return 'Project Lead';
  if (member.isLead || d.includes('Lead')) return 'Lead';
  return null;
};

const CrewMemberCard = ({ member, index }: { member: Member; index: number }) => {
  const mailHref = member.email
    ? `mailto:${member.email}?subject=Inquiry%20via%20Staraptor%20CUET`
    : `mailto:staraptorcuet@gmail.com?subject=Inquiry%20for%20${encodeURIComponent(member.name)}%20via%20Staraptor%20CUET`;

  const badgeText = getBadgeText(member);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Card className="bg-[#2a2a2a] border-gray-sub/20 rounded-xl p-3 shadow-lg flex flex-col items-center cursor-pointer h-full hover:border-[#D04741]/70 hover:shadow-[0_12px_30px_rgba(208,71,65,0.35)] transition-all">
        <div className="border border-primary rounded-lg overflow-hidden relative aspect-[3/4] w-full mb-4 group/img bg-[#1c1c1c]">
          {member.image ? (
            <Image 
              src={member.image} 
              alt={member.name} 
              fill 
              className="object-cover transition-all duration-500 group-hover/img:scale-110"
              style={{ filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.6)) blur(0.4px)' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={member.image.startsWith('data:') || member.image.startsWith('http')}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#242424] to-[#181818] text-gray-500">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-2 shadow-inner group-hover/img:scale-105 transition-transform">
                <User size={26} className="text-gray-400" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase font-semibold">
                No Photo
              </span>
            </div>
          )}
        </div>

        <h3 className="text-white font-heading font-bold text-sm text-center mb-1 uppercase">{member.name}</h3>
        <p className="text-white text-xs mb-1">{member.batch}</p>
        {badgeText ? (
          <Badge variant="glow" className="mb-3 text-[10px] font-heading uppercase px-2.5 py-0.5 tracking-wider">
            {badgeText}
          </Badge>
        ) : (
          <div className="mb-3" />
        )}

        <div className="flex gap-2 w-full mt-auto">
          <a
            href={member.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 bg-primary hover:bg-[#6A2421] text-white py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors ${!member.linkedin ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => !member.linkedin && e.preventDefault()}
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
            href={mailHref}
            className="flex-1 bg-primary hover:bg-[#6A2421] text-white py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title={`Send email to ${member.name} (${member.email || 'Team Staraptor'})`}
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
      </Card>
    </motion.div>
  );
};

const CrewSection = ({ title, members }: { title: string; members: Member[] }) => {
  // Always sort Leads to the very first position of each sector
  const sortedMembers = [...members].sort((a, b) => {
    const aLead = (a.isLead || a.designation.includes('Lead') || a.designation.includes('Chief')) ? 1 : 0;
    const bLead = (b.isLead || b.designation.includes('Lead') || b.designation.includes('Chief')) ? 1 : 0;
    return bLead - aLead;
  });

  return (
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
        {sortedMembers.map((m, i) => (
          <div
            key={m.name}
            className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[240px]"
          >
            <CrewMemberCard member={m} index={i} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function CrewPage() {
  const { content } = useSiteContent();
  const activeMembers: Member[] = content?.crew?.length ? (content.crew as Member[]) : fallbackMembers;

  // Faculty, Advisors & Instructors
  const advisorsAndInstructors = activeMembers.filter(m => 
    m.designation.includes("Advisor") || 
    m.designation.includes("Instructor")
  );

  const projectLeads = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation === "Project Lead"
  );
  const designCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Design")
  );
  const simulationCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Simulation")
  );
  const brandingCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Branding")
  );
  const researchCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Research")
  );
  const softwareCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Software")
  );
  const documentationCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor") && 
    m.designation.includes("Documentation")
  );
  
  // Any extra members that don't match the specific buckets
  const otherCrew = activeMembers.filter(m => 
    !m.designation.includes("Advisor") &&
    !m.designation.includes("Instructor") &&
    m.designation !== "Project Lead" &&
    !m.designation.includes("Design") &&
    !m.designation.includes("Simulation") &&
    !m.designation.includes("Branding") &&
    !m.designation.includes("Research") &&
    !m.designation.includes("Software") &&
    !m.designation.includes("Documentation")
  );

  return (
    <div className="bg-background min-h-screen pb-20">

      {/* Intro / Vision / Mission */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-sub/10 overflow-hidden">

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D04741]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* MASCOT BACKGROUND */}
        <div className="absolute
          left-[-5%] top-[10%]
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
            className="object-contain object-left opacity-20 mix-blend-screen"
          />
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-10 max-w-6xl mx-auto">

          {/* 1. Header & Lead */}
          <motion.div
            className="text-center mb-14 sm:mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D04741]/15 border border-[#D04741]/30 text-[#EF5F5A] text-[11px] font-mono uppercase tracking-widest mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#EF5F5A] animate-pulse" />
              <span>Team Staraptor CUET • Aerospace Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-orbitron tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f37c76] to-[#D04741] drop-shadow-[0_0_35px_rgba(208,71,65,0.35)]">
              We Are Staraptor
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto font-normal">
              Welcome to Team Staraptor CUET, the first VTOL design team from CUET Bangladesh, set to make our mark at the METU VTOL Competition this October. Our team of {activeMembers.length} passionate students—specializing in mechanical, aerospace, and related fields—is dedicated to designing a cutting-edge VTOL UAV. We&apos;re combining lightweight materials, advanced aerodynamics, and smart control systems to deliver a drone that excels in stability, efficiency, and mission accuracy.
            </p>
          </motion.div>

          {/* 2. Sleek Glassmorphic Stats Grid */}
          <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="text-center mb-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-400 font-bold">
                Team Scale & Organization
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Crew Members', value: `${activeMembers.length}`, icon: Users, desc: 'Engineers & Designers' },
                { label: 'Sub-Teams', value: '6', icon: Layers, desc: 'Specialized Units' },
                { label: 'Technical Roles', value: '8+', icon: Cpu, desc: 'Flight Systems & Aerodynamics' },
                { label: 'Operational Roles', value: '4+', icon: Activity, desc: 'Management & Logistics' },
              ].map(({ label, value, icon: StatIcon, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="group relative bg-[#1c1c1c]/90 hover:bg-[#222222] border border-white/10 hover:border-[#D04741]/50 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D04741]/40 to-transparent group-hover:via-[#EF5F5A] transition-all" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold group-hover:text-gray-300 transition-colors">
                      {label}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#D04741]/10 border border-[#D04741]/20 flex items-center justify-center text-[#EF5F5A] group-hover:scale-110 transition-transform">
                      <StatIcon size={16} />
                    </div>
                  </div>

                  <div>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-[#EF5F5A] block tracking-tight mb-1">
                      {value}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono block">
                      {desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3. Our Vision & Our Mission - Dual Aerospace Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Card 1: Our Vision */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group relative bg-gradient-to-b from-[#1f1a1a] via-[#1a1818] to-[#141414] border border-white/10 hover:border-[#D04741]/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D04741] via-[#EF5F5A] to-transparent" />

              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#D04741]/20 border border-[#D04741]/40 flex items-center justify-center text-[#EF5F5A] shadow-[0_0_20px_rgba(208,71,65,0.3)] shrink-0 group-hover:scale-110 transition-transform">
                    <Compass size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold block mb-0.5">
                      Pioneering Aerospace
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat text-white tracking-tight">
                      Our Vision
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal mb-6">
                  To become a leading UAV team, advancing drone innovation through engineering excellence and global competition. We aim to contribute to Bangladesh&apos;s technological progress by developing high-performance UAV systems and inspiring the next generation of engineers to push the boundaries of what is possible.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  Engineering Excellence
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D04741]/15 border border-[#D04741]/30 text-[#EF5F5A]">
                  Global Competitions
                </span>
              </div>
            </motion.div>

            {/* Card 2: Our Mission */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.1}
              className="group relative bg-gradient-to-b from-[#1f1a1a] via-[#1a1818] to-[#141414] border border-white/10 hover:border-[#D04741]/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#EF5F5A] to-[#D04741]" />

              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#D04741]/20 border border-[#D04741]/40 flex items-center justify-center text-[#EF5F5A] shadow-[0_0_20px_rgba(208,71,65,0.3)] shrink-0 group-hover:scale-110 transition-transform">
                    <Rocket size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF5F5A] font-bold block mb-0.5">
                      International Standard
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat text-white tracking-tight">
                      Our Mission
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal mb-6">
                  Our mission is to design, build, and operate cutting-edge drones that meet international standards, represent CUET on global platforms, and address real-world challenges through practical UAV applications. We are committed to continuous learning, teamwork, and mentorship—creating a sustainable culture of innovation while contributing to national development through meaningful technological solutions.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  Sustainable Innovation
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D04741]/15 border border-[#D04741]/30 text-[#EF5F5A]">
                  National Impact
                </span>
              </div>
            </motion.div>

          </div>

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

        {advisorsAndInstructors.length > 0 && (
          <CrewSection
            title="Advisors & Instructors"
            members={advisorsAndInstructors}
          />
        )}

        {projectLeads.length > 0 && (
          <CrewSection
            title="Project Board"
            members={projectLeads}
          />
        )}

        {designCrew.length > 0 && (
          <CrewSection
            title="Designing Crew"
            members={designCrew}
          />
        )}

        {simulationCrew.length > 0 && (
          <CrewSection
            title="Simulation Crew"
            members={simulationCrew}
          />
        )}

        {brandingCrew.length > 0 && (
          <CrewSection
            title="Branding & Communication Crew"
            members={brandingCrew}
          />
        )}

        {researchCrew.length > 0 && (
          <CrewSection
            title="Research Crew"
            members={researchCrew}
          />
        )}

        {softwareCrew.length > 0 && (
          <CrewSection
            title="Software Crew"
            members={softwareCrew}
          />
        )}

        {documentationCrew.length > 0 && (
          <CrewSection
            title="Documentation Crew"
            members={documentationCrew}
          />
        )}

        {otherCrew.length > 0 && (
          <CrewSection
            title="General Engineering Crew"
            members={otherCrew}
          />
        )}

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
