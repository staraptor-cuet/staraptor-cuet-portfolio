'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import BirdLoader from './BirdLoader';

export default function SiteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initial load on first entering the website
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialVisible, setInitialVisible] = useState(true);

  // Route navigation loading
  const [navLoading, setNavLoading] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const prevPathRef = useRef<string>(pathname);
  const navTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial page entrance loader
  useEffect(() => {
    // Show on first enter for ~1.1s then fade out
    const timer = setTimeout(() => {
      setInitialVisible(false);
      const removeTimer = setTimeout(() => {
        setInitialLoading(false);
      }, 500); // Wait for fade-out transition
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  // 2. Intercept internal link clicks for instant route transition feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');
      const downloadAttr = target.getAttribute('download');

      // Ignore external, new tab, download, mailto, tel, or hash-only links
      if (
        !href ||
        targetAttr === '_blank' ||
        downloadAttr !== null ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return;
      }

      // If linking to the same exact path with hash only, skip
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      // Trigger navigation loader
      setNavLoading(true);
      setNavVisible(true);

      // Safety timeout: auto dismiss if navigation doesn't change path after 2.5s
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        setNavVisible(false);
        setTimeout(() => setNavLoading(false), 400);
      }, 2500);
    };

    // Listen to popstate (back/forward browser buttons)
    const handlePopState = () => {
      setNavLoading(true);
      setNavVisible(true);
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  // 3. When pathname or searchParams change (route load finished)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      // Fade out navigation loader gracefully
      const timer = setTimeout(() => {
        setNavVisible(false);
        const hideTimer = setTimeout(() => {
          setNavLoading(false);
        }, 400);
        return () => clearTimeout(hideTimer);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  const showInitial = initialLoading;
  const showNav = navLoading && !initialLoading;

  if (!showInitial && !showNav) {
    return null;
  }

  const isVisible = showInitial ? initialVisible : navVisible;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 46%, rgba(109, 23, 20, 0.16), transparent 36%), #151313',
      }}
    >
      <BirdLoader />
    </div>
  );
}
