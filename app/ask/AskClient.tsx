'use client';

import dynamic from 'next/dynamic';

// The chat reads saved messages from the browser, so it renders on the client only.
const Chat = dynamic(() => import('@/components/chat/Chat'), {
  ssr: false,
  loading: () => <div className="h-full animate-pulse rounded-xl border border-white/10 bg-[#1b1819]" />,
});

export default function AskClient() {
  return <Chat variant="page" />;
}
