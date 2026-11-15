'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '@/lib/useContent';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
};

export default function ContactPage() {
  const { content } = useSiteContent();
  const contactEmail = content?.general?.contactEmail || 'staraptorcuet@gmail.com';
  const contactPhone = content?.general?.contactPhone || '+880 1972-723321';
  const headquarters = content?.general?.headquarters || 'CUET Autonomous Aerospace Lab';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate swift network dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-[#202020] min-h-screen py-16 md:py-24 text-gray-300 relative overflow-hidden">
      {/* Subtle Aerospace Radial Glow Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(208, 71, 65, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-[#D04741]/10 border border-[#D04741]/30 text-[#EF5F5A] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(208,71,65,0.15)]">
            Contact
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-montserrat text-white tracking-tight mb-4">
            Contact us
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            We are always looking for ways to improve our products and services. Contact us and let us know how we can help you.
          </p>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Get in Touch Channels + Team Logo */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between h-full"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.15}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-white mb-2">
                Get in touch
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Reach out via any channel below. We typically reply within one business day.
              </p>

              {/* Contact Channels */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-[#D04741]/50 hover:bg-[#222222] transition-all group"
                >
                  <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#EF5F5A] group-hover:border-[#EF5F5A]/40 transition-colors shrink-0">
                    <Mail size={19} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase block">Email</span>
                    <span className="text-sm font-semibold text-white group-hover:text-[#EF5F5A] transition-colors">
                      {contactEmail}
                    </span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-[#D04741]/50 hover:bg-[#222222] transition-all group"
                >
                  <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#EF5F5A] group-hover:border-[#EF5F5A]/40 transition-colors shrink-0">
                    <Phone size={19} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase block">Direct Line</span>
                    <span className="text-sm font-semibold text-white group-hover:text-[#EF5F5A] transition-colors">
                      {contactPhone}
                    </span>
                  </div>
                </a>

                {/* Support / Lab */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 group">
                  <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#EF5F5A] transition-colors shrink-0">
                    <Headphones size={19} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase block">Headquarters</span>
                    <span className="text-sm font-semibold text-white">
                      {headquarters}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Logo in place of Earth Wireframe */}
            <div className="relative w-full aspect-[16/10] max-w-sm mx-auto lg:mx-0 mt-10 flex items-center justify-center">
              {/* Subtle aerospace backlight aura */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full blur-[70px] opacity-35"
                style={{
                  background: 'radial-gradient(circle, rgba(208, 71, 65, 0.45) 0%, transparent 65%)',
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
                <Image
                  src="/images/logo.svg"
                  alt="Team Staraptor Mascot Emblem"
                  fill
                  className="object-contain drop-shadow-[0_15px_30px_rgba(208,71,65,0.3)]"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Send a Message Card */}
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.25}
          >
            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Corner aerospace red wash */}
              <div
                className="absolute -top-20 -right-20 w-64 h-64 pointer-events-none rounded-full blur-[80px] opacity-20"
                style={{
                  background: 'radial-gradient(circle, #D04741 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-white mb-1.5">
                  Send a message
                </h3>
                <p className="text-sm text-gray-400 mb-8 border-b border-white/5 pb-4">
                  Fill out the form and we&apos;ll get back to you promptly.
                </p>

                {isSubmitted ? (
                  <motion.div
                    className="p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-center space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white">Message Dispatched</h4>
                    <p className="text-sm text-gray-300 max-w-md mx-auto">
                      Thank you for reaching out to Team Staraptor! Our crew has received your transmission and will respond promptly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', company: '', email: '', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Full Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:border-[#EF5F5A] focus:ring-1 focus:ring-[#EF5F5A] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2 block">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. CUET Aerospace"
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:border-[#EF5F5A] focus:ring-1 focus:ring-[#EF5F5A] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email Address */}
                    <div>
                      <label className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@domain.com"
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:border-[#EF5F5A] focus:ring-1 focus:ring-[#EF5F5A] outline-none transition-all"
                      />
                    </div>

                    {/* Row 3: Message */}
                    <div>
                      <label className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2 block">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your message here..."
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:border-[#EF5F5A] focus:ring-1 focus:ring-[#EF5F5A] outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-bold text-sm tracking-wide hover:bg-[#EF5F5A] hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50 group cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Transmitting...' : 'Submit'}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
