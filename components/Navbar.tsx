"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Rocket, Layers, Clock, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProgressOpen, setMobileProgressOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileProgressOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const isProgressActive = pathname === '/progress' || pathname === '/vtol-2026';

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#202020]/95 backdrop-blur-md border-b border-gray-sub/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative w-12 h-12 md:w-16 md:h-16 -my-2">
                <Image src="/images/logo.svg" alt="Staraptor Logo" fill className="object-contain" />
              </div>
              <span className="text-white font-bebas tracking-[0.05em] text-[1.6rem] md:text-[2rem] pt-1 uppercase">
                Staraptor
              </span>
            </Link>

            {/* Desktop Navigation Links: Home, Our Progress (Dropdown), Crew, Sponsors */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Home */}
              <Link
                href="/"
                className={`text-base font-semibold transition-colors ${
                  pathname === '/' ? 'text-white' : 'text-gray-sub hover:text-white'
                }`}
              >
                Home
              </Link>

              {/* Our Progress with Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`flex items-center gap-1.5 text-base font-semibold transition-colors py-2 focus:outline-none ${
                    isProgressActive ? 'text-white' : 'text-gray-sub hover:text-white'
                  }`}
                >
                  <Link href="/progress" className="hover:text-white" onClick={(e) => e.stopPropagation()}>
                    Our Progress
                  </Link>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#EF5F5A]' : ''}`}
                  />
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute top-full left-0 w-80 pt-2 z-50"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <div className="bg-[#1c1c1c]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3.5 space-y-2">
                        
                        {/* Direct link to Timeline */}
                        <Link
                          href="/progress"
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-md bg-[#D04741]/10 border border-[#D04741]/30 flex items-center justify-center text-[#EF5F5A] shrink-0 mt-0.5 group-hover:bg-[#D04741]/20">
                            <Clock size={16} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white group-hover:text-[#ff7973] transition-colors block">
                              Our Progress & Timeline
                            </span>
                            <span className="text-xs text-gray-400 block">
                              Fabrication stages, test flights & logs
                            </span>
                          </div>
                        </Link>

                        <div className="border-t border-white/5 pt-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-bold px-2.5 mb-1.5 block">
                            Projects
                          </span>

                          {/* VTOL 2026 Project */}
                          <div className="space-y-1">
                            <Link
                              href="/vtol-2026"
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Rocket size={15} className="text-[#EF5F5A]" />
                                <span className="text-sm font-semibold text-white group-hover:text-[#ff7973] transition-colors">
                                  METU VTOL 2026
                                </span>
                              </div>
                              <ArrowRight size={13} className="text-gray-500 group-hover:text-white transition-colors" />
                            </Link>

                            {/* Model 1 & Model 2 Sub-items */}
                            <div className="pl-6 space-y-1 border-l border-white/10 ml-4 py-1">
                              <Link
                                href="/vtol-2026?model=1#model-1"
                                className="flex items-center justify-between py-1.5 px-2 rounded text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <span className="font-medium">Model 1 (Staraptor V1)</span>
                                <span className="text-[10px] font-mono text-[#EF5F5A] font-semibold">Active</span>
                              </Link>

                              <Link
                                href="/vtol-2026?model=2#model-2"
                                className="flex items-center justify-between py-1.5 px-2 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <span className="font-medium">Model 2</span>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#D04741]/20 text-[#EF5F5A] font-bold border border-[#D04741]/30">
                                  Coming Soon
                                </span>
                              </Link>
                            </div>
                          </div>

                          {/* More Projects Soon */}
                          <div className="flex items-center justify-between px-2.5 py-2 mt-1 rounded text-xs text-gray-400 bg-black/30 border border-white/5">
                            <div className="flex items-center gap-2">
                              <Layers size={13} className="text-gray-500" />
                              <span>More Projects</span>
                            </div>
                            <span className="text-[9px] uppercase font-mono text-gray-400 font-semibold italic">
                              Soon...
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Crew */}
              <Link
                href="/crew"
                className={`text-base font-semibold transition-colors ${
                  pathname === '/crew' ? 'text-white' : 'text-gray-sub hover:text-white'
                }`}
              >
                Crew
              </Link>

              {/* Sponsors */}
              <Link
                href="/sponsors"
                className={`text-base font-semibold transition-colors ${
                  pathname === '/sponsors' ? 'text-white' : 'text-gray-sub hover:text-white'
                }`}
              >
                Sponsors
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden sm:inline-flex px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-semibold"
              >
                Contact Us
              </Link>

              {/* Hamburger button (mobile only) */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-[64px] left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-sub/20 md:hidden shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex flex-col py-4 px-4 space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg text-base font-semibold transition-colors ${
                    pathname === '/' ? 'text-white bg-white/8' : 'text-gray-sub hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  Home
                </Link>

                {/* Our Progress Accordion */}
                <div className="rounded-lg bg-white/5 overflow-hidden">
                  <div className="flex items-center justify-between py-3 px-3 text-base font-semibold text-white">
                    <Link href="/progress" className="flex-1">
                      Our Progress
                    </Link>
                    <button
                      onClick={() => setMobileProgressOpen((v) => !v)}
                      className="p-1 text-gray-400 hover:text-white"
                      aria-label="Toggle Progress sub-menu"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${mobileProgressOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {mobileProgressOpen && (
                    <div className="pl-4 pr-3 pb-3 space-y-1.5 border-t border-white/5 pt-2">
                      <Link
                        href="/progress"
                        className="flex items-center gap-2 py-2 px-2 text-sm text-gray-300 hover:text-white"
                      >
                        <Clock size={14} className="text-[#EF5F5A]" />
                        <span>Timeline & Logs</span>
                      </Link>

                      <div className="pt-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block px-2 mb-1">
                          Projects
                        </span>
                        <Link
                          href="/vtol-2026"
                          className="flex items-center justify-between py-2 px-2 text-sm text-gray-300 hover:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <Rocket size={14} className="text-[#EF5F5A]" />
                            <span>VTOL 2026</span>
                          </div>
                        </Link>
                        <div className="pl-6 space-y-1">
                          <Link
                            href="/vtol-2026?model=1#model-1"
                            className="flex items-center justify-between py-1 px-2 text-xs text-gray-300 hover:text-white"
                          >
                            <span>Model 1 (Staraptor V1)</span>
                            <span className="text-[10px] text-[#EF5F5A] font-mono">Active</span>
                          </Link>
                          <Link
                            href="/vtol-2026?model=2#model-2"
                            className="flex items-center justify-between py-1 px-2 text-xs text-gray-400 hover:text-white"
                          >
                            <span>Model 2</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#D04741]/20 text-[#EF5F5A]">
                              Soon
                            </span>
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 px-2 text-xs text-gray-400 italic">
                        <span>More Projects</span>
                        <span className="text-[9px] font-mono">Soon...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Crew */}
                <Link
                  href="/crew"
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg text-base font-semibold transition-colors ${
                    pathname === '/crew' ? 'text-white bg-white/8' : 'text-gray-sub hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pathname === '/crew' && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  Crew
                </Link>

                {/* Sponsors */}
                <Link
                  href="/sponsors"
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg text-base font-semibold transition-colors ${
                    pathname === '/sponsors' ? 'text-white bg-white/8' : 'text-gray-sub hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pathname === '/sponsors' && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  Sponsors
                </Link>

                <div className="mt-3 pt-3 border-t border-gray-sub/10">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-md bg-primary text-white font-bold text-sm tracking-wide"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}