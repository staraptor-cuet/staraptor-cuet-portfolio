'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BirdLoader from './BirdLoader';

export default function SiteLoader() {
  const pathname = usePathname();

  // Only show at the starting home page ('/')
  const [loading, setLoading] = useState(pathname === '/');
  const [visible, setVisible] = useState(pathname === '/');

  useEffect(() => {
    // Only run on the starting home page
    if (pathname !== '/') {
      setLoading(false);
      setVisible(false);
      return;
    }

    // Show for ~1.1s on starting home page, then smoothly fade out
    const timer = setTimeout(() => {
      setVisible(false);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-md transition-all duration-500 ease-out ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Subtle radial aerospace glow behind bird loader */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(208, 71, 65, 0.18), transparent 55%)',
        }}
      />
      <BirdLoader />
    </div>
  );
}
