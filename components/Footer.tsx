'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { TextHoverEffect, FooterBackgroundGradient } from '@/components/ui/hover-footer';
import { useSiteContent } from '@/lib/useContent';

export default function Footer() {
  const { content } = useSiteContent();
  const contactEmail = content?.general?.contactEmail || 'staraptorcuet@gmail.com';
  const contactPhone = content?.general?.contactPhone || '01972723321';
  const headquarters = content?.general?.headquarters || 'Kaptai Highway, Raozan, Pahartoli Road, Chattogram 4349, Bangladesh';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Progress', href: '/progress' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Crew', href: '/crew' },
    { label: 'Sponsors', href: '/sponsors' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="relative bg-[#141416] text-gray-300 border-t border-white/5 overflow-hidden pt-12 pb-4">
      {/* Dynamic Red Aerospace Background Gradient */}
      <FooterBackgroundGradient />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-white/10">
          
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
              Engineering the future of autonomous vertical flight. Team Staraptor is CUET&apos;s pioneering VTOL UAV research team, developing advanced aerial systems and pushing the boundaries of aerospace innovation.
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
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center text-sm transition-all group"
                  >
                    <span className="group-hover:text-[#EF5F5A] transition-colors">{link.label}</span>
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
                <span>{headquarters}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="text-[#EF5F5A] shrink-0" />
                <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={17} className="text-[#EF5F5A] shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Large Interactive Text Hover Effect "STARAPTOR" */}
        <div className="relative w-full py-0 sm:py-1 flex items-center justify-center my-0 pointer-events-auto">
          <TextHoverEffect text="STARAPTOR" className="w-full max-w-7xl" />
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-2 pb-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500/70 font-mono border-t border-white/5">
          <p>© {new Date().getFullYear()} Team Staraptor CUET. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-[10px] text-gray-500/40 hover:text-[#EF5F5A] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
