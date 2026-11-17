'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// The chat code is downloaded only when a visitor opens (or hovers) the launcher,
// so it adds nothing to the first load of any page.
const loadPanel = () => import('./ChatPanel');
const ChatPanel = dynamic(loadPanel, { ssr: false });

export default function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  if (pathname === '/ask') return null;

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={loadPanel}
          onFocus={loadPanel}
          aria-label="Open Raptor, the Team Staraptor AI assistant"
          aria-haspopup="dialog"
          className="group fixed bottom-5 right-5 z-[80] flex h-14 items-center gap-2 rounded-full border border-[#ff6b66]/40 bg-gradient-to-b from-[#e35651] to-[#b03934] pl-2 pr-4 text-white shadow-[0_6px_24px_rgba(208,71,65,0.45)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <span className="relative block h-10 w-10 overflow-hidden rounded-full bg-[#231f20]">
            <Image src="/images/logo.svg" alt="" fill sizes="40px" className="object-contain p-0.5" />
          </span>
          <span className="font-orbitron text-xs font-bold uppercase tracking-[0.15em]">Ask Raptor</span>
        </button>
      )}
      <AnimatePresence>{open && <ChatPanel onClose={close} />}</AnimatePresence>
    </>
  );
}
