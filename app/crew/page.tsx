'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Member, members as fallbackMembers } from './members';
import { useSiteContent } from '@/lib/useContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  User,
  Layers,
  Cpu,
  Activity,
  Compass,
  Rocket,
  GraduationCap,
  Crown,
  Palette,
  Sparkles,
  Search,
  Code2,
  FileText,
  Wrench,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';

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

const CrewMemberCard = ({
  member,
  index,
  onOpenEmail,
}: {
  member: Member;
  index: number;
  onOpenEmail: (member: Member) => void;
}) => {
  const badgeText = getBadgeText(member);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Card className="bg-[#242424] border-white/10 rounded-2xl p-3.5 shadow-lg flex flex-col items-center cursor-pointer h-full hover:border-[#D04741]/70 hover:shadow-[0_12px_30px_rgba(208,71,65,0.35)] transition-all">
        <div className="border border-white/10 rounded-xl overflow-hidden relative aspect-[3/4] w-full mb-4 group/img bg-[#181818]">
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
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#222222] to-[#141414] text-gray-500">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-2 shadow-inner group-hover/img:scale-105 transition-transform">
                <User size={26} className="text-gray-400" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase font-semibold">
                No Photo
              </span>
            </div>
          )}
        </div>

        <h3 className="text-white font-heading font-bold text-sm text-center mb-1 uppercase tracking-tight line-clamp-1">{member.name}</h3>
        <p className="text-gray-400 text-xs mb-1 font-mono">{member.batch}</p>
        {badgeText ? (
          <Badge variant="glow" className="mb-3 text-[10px] font-heading uppercase px-2.5 py-0.5 tracking-wider">
            {badgeText}
          </Badge>
        ) : (
          <div className="mb-3" />
        )}

        <div className="flex gap-2 w-full mt-auto pt-2 border-t border-white/5">
          <a
            href={member.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 bg-gradient-to-r from-[#D04741] to-[#6A2421] hover:brightness-110 text-white py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm ${!member.linkedin ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => !member.linkedin && e.preventDefault()}
          >
            <Image
              src="/icons/linkedin-box-fill.svg"
              alt="LinkedIn"
              width={13}
              height={13}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-[10px] font-bold tracking-wide">LinkedIn</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEmail(member);
            }}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-white/10 shadow-sm cursor-pointer"
            title={`Contact ${member.name}`}
          >
            <Image
              src="/icons/mail-fill.svg"
              alt="Email"
              width={13}
              height={13}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-[10px] font-bold tracking-wide">Email</span>
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

const CrewSection = ({
  title,
  icon: Icon,
  members,
  onOpenEmail,
}: {
  title: string;
  icon?: any;
  members: Member[];
  onOpenEmail: (member: Member) => void;
}) => {
  // Always sort Leads to the very first position of each sector
  const sortedMembers = [...members].sort((a, b) => {
    const aLead = (a.isLead || a.designation.includes('Lead') || a.designation.includes('Chief')) ? 1 : 0;
    const bLead = (b.isLead || b.designation.includes('Lead') || b.designation.includes('Chief')) ? 1 : 0;
    return bLead - aLead;
  });

  return (
    <motion.div
      className="mb-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
    >
      {/* Red Color Section Header Bar */}
      <div className="relative overflow-hidden rounded-xl border border-white/15 bg-gradient-to-r from-[#D04741] via-[#A8322D] to-[#6A2421] px-5 sm:px-6 py-3.5 sm:py-4 mb-7 shadow-[0_8px_25px_rgba(208,71,65,0.35)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-black/20 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Icon size={18} />
            </div>
          )}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold font-orbitron uppercase text-white tracking-wider flex items-center gap-2 drop-shadow-sm">
              {title}
            </h2>
            <span className="text-[11px] font-mono text-white/85">
              {sortedMembers.length} {sortedMembers.length === 1 ? 'Specialist' : 'Specialists'}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-black/25 border border-white/20 text-white font-semibold">
            STARAPTOR • CUET
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-5xl mx-auto">
        {sortedMembers.map((m, i) => (
          <div
            key={m.name}
            className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[240px]"
          >
            <CrewMemberCard member={m} index={i} onOpenEmail={onOpenEmail} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SUB_TEAMS = [
  { id: 'ALL', label: 'All Sub-Teams' },
  { id: 'BOARD', label: 'Project Board' },
  { id: 'DESIGN', label: 'Design' },
  { id: 'SIMULATION', label: 'Simulation' },
  { id: 'BRANDING', label: 'Branding' },
  { id: 'RESEARCH', label: 'Research' },
  { id: 'SOFTWARE', label: 'Software' },
  { id: 'DOCS', label: 'Documentation' },
];

export default function CrewPage() {
  const { content } = useSiteContent();
  const activeMembers: Member[] = content?.crew?.length ? (content.crew as Member[]) : fallbackMembers;

  const [activeCategory, setActiveCategory] = useState<'advisor' | 'instructor' | 'team'>('team');
  const [selectedSubTeam, setSelectedSubTeam] = useState<string>('ALL');

  // Email modal state
  const [emailModalMember, setEmailModalMember] = useState<Member | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (email: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getGmailUrl = (email: string, name: string) => {
    const subject = encodeURIComponent(`Inquiry for ${name} - Team Staraptor CUET`);
    const body = encodeURIComponent(`Hi ${name},\n\nI am contacting you regarding Team Staraptor CUET.\n\nBest regards,`);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
  };

  const getMailtoUrl = (email: string, name: string) => {
    const subject = encodeURIComponent(`Inquiry for ${name} - Team Staraptor CUET`);
    return `mailto:${email}?subject=${subject}`;
  };

  // Filter categories
  const advisors = activeMembers.filter(m => 
    m.designation.includes("Advisor")
  );
  const instructors = activeMembers.filter(m => 
    m.designation.includes("Instructor")
  );
  const teamMembers = activeMembers.filter(m => 
    !m.designation.includes("Advisor") && 
    !m.designation.includes("Instructor")
  );

  const projectLeads = teamMembers.filter(m => m.designation === "Project Lead");
  const designCrew = teamMembers.filter(m => m.designation.includes("Design"));
  const simulationCrew = teamMembers.filter(m => m.designation.includes("Simulation"));
  const brandingCrew = teamMembers.filter(m => m.designation.includes("Branding"));
  const researchCrew = teamMembers.filter(m => m.designation.includes("Research"));
  const softwareCrew = teamMembers.filter(m => m.designation.includes("Software"));
  const documentationCrew = teamMembers.filter(m => m.designation.includes("Documentation"));
  const otherCrew = teamMembers.filter(m => 
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

        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#EF5F5A] font-bold block mb-2">
            The Pioneers of Staraptor
          </span>
          <h2 className="text-title-section tracking-wide uppercase">
            Meet The Crew
          </h2>
        </motion.div>

        {/* TOP 3 CATEGORY SWITCHER: Advisor | Instructor | Team */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-2xl backdrop-blur-md">
            
            {/* 1. Advisor */}
            <button
              onClick={() => setActiveCategory('advisor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === 'advisor'
                  ? 'bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white shadow-[0_0_20px_rgba(208,71,65,0.4)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <GraduationCap size={16} />
              <span>Advisor</span>
              {advisors.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {advisors.length}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-white/10 mx-1" />

            {/* 2. Instructor */}
            <button
              onClick={() => setActiveCategory('instructor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === 'instructor'
                  ? 'bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white shadow-[0_0_20px_rgba(208,71,65,0.4)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={16} />
              <span>Instructor</span>
              {instructors.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                  {instructors.length}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-white/10 mx-1" />

            {/* 3. Team */}
            <button
              onClick={() => setActiveCategory('team')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === 'team'
                  ? 'bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white shadow-[0_0_20px_rgba(208,71,65,0.4)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={16} />
              <span>Team</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                {teamMembers.length}
              </span>
            </button>

          </div>
        </div>

        {/* TAB 1: ADVISOR */}
        {activeCategory === 'advisor' && (
          <div className="animate-in fade-in duration-300">
            {advisors.length > 0 ? (
              <CrewSection
                title="Faculty Advisory Board"
                icon={GraduationCap}
                members={advisors}
                onOpenEmail={setEmailModalMember}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-16 px-6 rounded-3xl bg-[#1a1616] border border-white/10 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#D04741]/15 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A] mx-auto mb-4">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white uppercase mb-2">Faculty Advisory Board</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                  Distinguished CUET faculty advisors and aerospace mentors guiding Staraptor&apos;s research and flight systems.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                  <ShieldCheck size={14} className="text-[#EF5F5A]" />
                  Profiles can be added directly via the Admin Crew panel
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSTRUCTOR */}
        {activeCategory === 'instructor' && (
          <div className="animate-in fade-in duration-300">
            {instructors.length > 0 ? (
              <CrewSection
                title="Flight & Technical Instructors"
                icon={Compass}
                members={instructors}
                onOpenEmail={setEmailModalMember}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-16 px-6 rounded-3xl bg-[#1a1616] border border-white/10 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#D04741]/15 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A] mx-auto mb-4">
                  <Compass size={32} />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white uppercase mb-2">Flight & Technical Instructors</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                  Certified drone pilots, flight instructors, and technical mentors supervising drone flight testing and fabrication.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                  <ShieldCheck size={14} className="text-[#EF5F5A]" />
                  Profiles can be added directly via the Admin Crew panel
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEAM */}
        {activeCategory === 'team' && (
          <div className="animate-in fade-in duration-300">
            {/* Sub-team filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {SUB_TEAMS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedSubTeam(st.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    selectedSubTeam === st.id
                      ? 'bg-[#D04741] text-white border border-[#EF5F5A] font-bold shadow-md'
                      : 'bg-[#181818] text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Sub-teams list */}
            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'BOARD') && projectLeads.length > 0 && (
              <CrewSection
                title="Project Board"
                icon={Crown}
                members={projectLeads}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'DESIGN') && designCrew.length > 0 && (
              <CrewSection
                title="Designing Crew"
                icon={Palette}
                members={designCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'SIMULATION') && simulationCrew.length > 0 && (
              <CrewSection
                title="Simulation Crew"
                icon={Layers}
                members={simulationCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'BRANDING') && brandingCrew.length > 0 && (
              <CrewSection
                title="Branding & Communication Crew"
                icon={Sparkles}
                members={brandingCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'RESEARCH') && researchCrew.length > 0 && (
              <CrewSection
                title="Research Crew"
                icon={Search}
                members={researchCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'SOFTWARE') && softwareCrew.length > 0 && (
              <CrewSection
                title="Software Crew"
                icon={Code2}
                members={softwareCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {(selectedSubTeam === 'ALL' || selectedSubTeam === 'DOCS') && documentationCrew.length > 0 && (
              <CrewSection
                title="Documentation Crew"
                icon={FileText}
                members={documentationCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}

            {selectedSubTeam === 'ALL' && otherCrew.length > 0 && (
              <CrewSection
                title="General Engineering Crew"
                icon={Wrench}
                members={otherCrew}
                onOpenEmail={setEmailModalMember}
              />
            )}
          </div>
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

      {/* INTERACTIVE EMAIL DIALOG */}
      <AnimatePresence>
        {emailModalMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setEmailModalMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[#1f1a1a] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D04741] via-[#EF5F5A] to-[#D04741]" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setEmailModalMember(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Member Overview */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-[#D04741]/40 bg-[#161616] shrink-0 shadow-md">
                  {emailModalMember.image ? (
                    <Image
                      src={emailModalMember.image}
                      alt={emailModalMember.name}
                      fill
                      className="object-cover"
                      unoptimized={emailModalMember.image.startsWith('data:') || emailModalMember.image.startsWith('http')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#252525] text-gray-400">
                      <User size={22} />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#EF5F5A] font-bold block mb-0.5">
                    Send Direct Message
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-orbitron text-white uppercase tracking-tight">
                    {emailModalMember.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {emailModalMember.designation} • {emailModalMember.batch}
                  </p>
                </div>
              </div>

              {/* Email Address Display Box with 1-Click Copy */}
              <div className="mb-6">
                <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5 font-semibold">
                  Official Email Address
                </label>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-2 shadow-inner">
                  <span className="font-mono text-xs sm:text-sm text-gray-200 select-all truncate">
                    {emailModalMember.email || 'staraptorcuet@gmail.com'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(emailModalMember.email || 'staraptorcuet@gmail.com')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={14} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. Open in Gmail (Web) */}
                <a
                  href={getGmailUrl(emailModalMember.email || 'staraptorcuet@gmail.com', emailModalMember.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] hover:brightness-110 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(208,71,65,0.4)] transition-all cursor-pointer"
                >
                  <Mail size={16} />
                  <span>Open in Gmail (Web)</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>

                {/* 2. Open in Default Mail App (Mailto) */}
                <a
                  href={getMailtoUrl(emailModalMember.email || 'staraptorcuet@gmail.com', emailModalMember.name)}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-heading font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Mail size={15} />
                  <span>Open in Mail App (Mailto)</span>
                </a>
              </div>

              {/* Subtext info */}
              <p className="text-[11px] text-gray-500 font-mono text-center mt-4">
                Click &quot;Open in Gmail&quot; to write immediately in your browser.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
