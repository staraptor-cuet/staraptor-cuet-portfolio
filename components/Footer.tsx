'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { TextHoverEffect, FooterBackgroundGradient } from '@/components/ui/hover-footer';

export default function Footer() {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Progress', href: '/progress' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'VTOL 2026', href: '/vtol-2026' },
    { label: 'Crew', href: '/crew' },
    { label: 'Sponsors', href: '/sponsors' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Admin Portal', href: '/admin' },
  ];

  return (
    <footer className="relative bg-[#141416] text-gray-300 border-t border-white/5 overflow-hidden pt-16 pb-8">
      {/* Dynamic Red Aerospace Background Gradient */}
      <FooterBackgroundGradient />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 shrink-0">
                <Image src="/images/logo.svg" alt="Staraptor Logo" fill className="object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#EF5F5A] block leading-none mb-1">
                  CUET Aerospace Division
                </span>
                <h3 className="text-white font-montserrat font-extrabold text-xl tracking-tight uppercase leading-tight">
                  Team Staraptor
                </h3>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md pt-2">
              Engineering the future of autonomous vertical flight. Team Staraptor is CUET&apos;s pioneering VTOL UAV research team, developing advanced aerial systems for the METU VTOL Competition and pushing the boundaries of aerospace innovation.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-3">Connect With Us</span>
              <div className="flex items-center gap-3.5">
                {[
                  { icon: 'linkedin-box-fill.svg', label: 'LinkedIn', href: 'https://www.linkedin.com/company/staraptor-cuet/' },
                  { icon: 'instagram-fill.svg', label: 'Instagram', href: 'https://www.instagram.com/staraptor_cuet/' },
                  { icon: 'facebook-box-fill.svg', label: 'Facebook', href: 'https://www.facebook.com/StaraptorCUET' },
                ].map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#D04741] hover:bg-[#D04741]/20 hover:scale-105 transition-all"
                  >
                    <img
                      src={`/icons/${icon}`}
                      alt={label}
                      className="w-5 h-5 transition-transform"
                      style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(85%) saturate(1478%) hue-rotate(338deg) brightness(92%) contrast(85%)' }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-montserrat font-bold text-sm tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF5F5A]"></span>
              Navigation
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center text-sm transition-all"
                  >
                    <span className="hover:text-[#EF5F5A] transition-colors">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-montserrat font-bold text-sm tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF5F5A]"></span>
              Headquarters
            </h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#EF5F5A] shrink-0 mt-0.5" />
                <span>Kaptai Highway, Raozan, Pahartoli Road, Chattogram 4349, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="text-[#EF5F5A] shrink-0" />
                <a href="tel:01972723321" className="hover:text-white transition-colors">
                  01972723321
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={17} className="text-[#EF5F5A] shrink-0" />
                <a href="mailto:staraptorcuet@gmail.com" className="hover:text-white transition-colors">
                  staraptorcuet@gmail.com
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-400 font-mono">
                <span className="text-[#EF5F5A] font-bold">METU VTOL 2026:</span> Actively fabricating & testing hybrid tilt-rotor autonomous UAV platforms.
              </div>
            </div>
          </div>

        </div>

        {/* Large Interactive Text Hover Effect "STARAPTOR" */}
        <div className="relative w-full py-4 sm:py-8 flex items-center justify-center my-2 sm:my-4 pointer-events-auto">
          <TextHoverEffect text="STARAPTOR" className="w-full max-w-5xl" />
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-mono border-t border-white/5">
          <p>© {new Date().getFullYear()} Team Staraptor CUET. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>METU VTOL Competition 2026</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#EF5F5A] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
