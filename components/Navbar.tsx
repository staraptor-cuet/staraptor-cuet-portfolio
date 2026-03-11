"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Aircraft', path: '/aircraft' },
    { name: 'Our Progress', path: '/progress' },
    { name: 'VTOL 2026', path: '/vtol-2026' },
    { name: 'Crew', path: '/crew' },
    { name: 'Sponsors', path: '/sponsors' },
  ];

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

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-base font-semibold transition-colors ${
                    pathname === link.path ? 'text-white' : 'text-gray-sub hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
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
              className="fixed top-[64px] left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-sub/20 md:hidden shadow-2xl"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex flex-col py-4 px-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={link.path}
                      className={`flex items-center gap-3 py-3.5 px-3 rounded-lg text-base font-semibold transition-colors ${
                        pathname === link.path
                          ? 'text-white bg-white/8'
                          : 'text-gray-sub hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {pathname === link.path && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
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
