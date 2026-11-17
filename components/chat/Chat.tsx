'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Check, Copy, Maximize2, RotateCcw, Square, ThumbsDown, ThumbsUp, Trash2, X } from 'lucide-react';
import type { RaptorData, RaptorMessage, SourceRef } from '@/lib/chat/types';
import { ContactCard, CrewCard, SourceChips, SpecCard, SponsorCard } from './Cards';
import Markdown from './Markdown';

const STORAGE_KEY = 'raptor-chat-v1';
const MAX_INPUT = 500;
const TEAM_EMAIL = 'staraptorcuet@gmail.com';

const STARTERS: Record<string, string[]> = {
  '/aircraft': ['What are the aircraft specifications?', 'What materials is the aircraft made of?', 'What did the CFD analysis show?'],
  '/vtol-2026': ['What are the three METU VTOL missions?', 'What are the aircraft rules at METU VTOL?', 'What is TEKNOFEST?'],
  '/crew': ['Who leads the team?', 'Who is in the software team?', 'How can I join the team?'],
  '/sponsors': ['Who sponsors the team now?', 'How can my company become a sponsor?', 'Where is the sponsorship proposal?'],
  '/contact': ['How can I contact the team?', 'How can I join the team?', 'How can I sponsor the team?'],
  default: ['What is Team Staraptor CUET?', 'Tell me about the Staraptor VTOL V1', 'Which competitions is the team aiming for?', 'How can I sponsor the team?'],
};

const LOADING_LINES = ['Running pre-flight checks…', 'Acquiring telemetry…', 'Transitioning to forward flight…'];

function loadSaved(): RaptorMessage[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as RaptorMessage[]) : [];
    return Array.isArray(parsed) ? parsed.filter((m) => m && Array.isArray(m.parts)) : [];
  } catch {
    return [];
  }
}

function textOf(m: RaptorMessage): string {
  return m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('');
}

function dataOf<K extends keyof RaptorData>(m: RaptorMessage, key: K): RaptorData[K] | undefined {
  const type = `data-${key}`;
  for (const p of m.parts) if (p.type === type) return (p as unknown as { data: RaptorData[K] }).data;
  return undefined;
}

interface FaqEntry {
  q: string;
  a: string;
  url: string;
}

/** Used only when /api/chat cannot be reached: closest entry of the static FAQ file. */
async function offlineFaq(question: string): Promise<FaqEntry | null> {
  try {
    const res = await fetch('/chat-faq.json');
    const { faq } = (await res.json()) as { faq: FaqEntry[] };
    const words = new Set(question.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3));
    let best: FaqEntry | null = null;
    let bestScore = 0;
    for (const f of faq) {
      const score = f.q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => words.has(w)).length;
      if (score > bestScore) {
        best = f;
        bestScore = score;
      }
    }
    return bestScore >= 2 ? best : null;
  } catch {
    return null;
  }
}

function Feedback({ logId }: { logId?: string }) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  if (!logId) return null;
  const send = (v: 'up' | 'down') => {
    if (vote) return;
    setVote(v);
    fetch('/api/chat/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logId, vote: v }) }).catch(() => {});
  };
  const cls = (active: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded transition-colors ${active ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'} disabled:cursor-default`;
  return (
    <>
      <button type="button" aria-label="Helpful answer" aria-pressed={vote === 'up'} disabled={!!vote} onClick={() => send('up')} className={cls(vote === 'up')}>
        <ThumbsUp size={14} />
      </button>
      <button type="button" aria-label="Unhelpful answer" aria-pressed={vote === 'down'} disabled={!!vote} onClick={() => send('down')} className={cls(vote === 'down')}>
        <ThumbsDown size={14} />
      </button>
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy answer"
      onClick={() => {
        navigator.clipboard?.writeText(text.replace(/\[(\d{1,2})\]/g, '')).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white"
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function Avatar({ size = 28 }: { size?: number }) {
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full border border-primary/60 bg-[#231f20]" style={{ width: size, height: size }}>
      <Image src="/images/logo.svg" alt="" fill sizes={`${size}px`} className="object-contain p-0.5" />
    </span>
  );
}

export default function Chat({ variant, onClose }: { variant: 'panel' | 'page'; onClose?: () => void }) {
  const pathname = usePathname() || '/';
  const [initial] = useState<RaptorMessage[]>(loadSaved);
  const [input, setInput] = useState('');
  const [loadingLine, setLoadingLine] = useState(0);
  const [announce, setAnnounce] = useState('');
  const [offline, setOffline] = useState<FaqEntry | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastQuestion = useRef('');

  const transport = useMemo(() => new DefaultChatTransport<RaptorMessage>({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, stop, regenerate, error, clearError, setMessages } = useChat<RaptorMessage>({
    transport,
    messages: initial,
    onError: () => {
      offlineFaq(lastQuestion.current).then(setOffline);
    },
    onFinish: ({ message }) => setAnnounce(textOf(message).replace(/\[(\d{1,2})\]/g, '')),
  });

  const busy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (status !== 'ready') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages, status]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status, error]);

  useEffect(() => {
    if (status !== 'submitted') return;
    const t = setInterval(() => setLoadingLine((n) => (n + 1) % LOADING_LINES.length), 1800);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const ask = useCallback(
    (text: string) => {
      const q = text.replace(/\s+/g, ' ').trim().slice(0, MAX_INPUT);
      if (!q || busy) return;
      lastQuestion.current = q;
      setOffline(null);
      clearError();
      setInput('');
      sendMessage({ text: q }, { body: { page: pathname } });
    },
    [busy, clearError, pathname, sendMessage],
  );

  const clear = () => {
    stop();
    clearError();
    setOffline(null);
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    inputRef.current?.focus();
  };

  const last = messages[messages.length - 1];
  const lastMode = last?.role === 'assistant' ? dataOf(last, 'status')?.mode : undefined;
  const statusText = error ? 'Offline' : lastMode === 'faq' || lastMode === 'busy' ? 'FAQ mode' : busy ? 'Answering' : 'Online';
  const statusDot = error ? 'bg-yellow-500' : lastMode === 'faq' || lastMode === 'busy' ? 'bg-yellow-500' : 'bg-emerald-400';
  const starters = STARTERS[pathname] || STARTERS.default;

  return (
    <div className={`flex h-full flex-col bg-[#231f20] text-gray-100 ${variant === 'page' ? 'rounded-xl border border-white/10' : ''}`}>
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-white/10 bg-[#1b1819] px-4 py-3">
        <Avatar size={36} />
        <div className="min-w-0 flex-1">
          <h2 id="raptor-title" className="!font-orbitron !text-sm !font-bold !normal-case !tracking-[0.15em] !text-white">
            RAPTOR
          </h2>
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} aria-hidden />
            <span>Team Staraptor AI assistant</span>
            <span aria-hidden>·</span>
            <span>{statusText}</span>
          </p>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={clear} aria-label="Clear conversation" className="flex h-9 w-9 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white">
            <Trash2 size={16} />
          </button>
        )}
        {variant === 'panel' && (
          <>
            <Link href="/ask" onClick={onClose} aria-label="Open full page assistant" className="hidden h-9 w-9 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white sm:flex">
              <Maximize2 size={16} />
            </Link>
            <button type="button" onClick={onClose} aria-label="Close assistant" className="flex h-9 w-9 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4" role="log" aria-label="Conversation with Raptor">
        {messages.length === 0 && (
          <div className="flex h-full flex-col justify-center">
            <p className="text-lg font-semibold text-white">Ask me about Staraptor and VTOL.</p>
            <p className="mt-1 text-sm text-gray-300">Team, aircraft, competitions and sponsorship.</p>
            <ul className="mt-4 flex flex-col gap-2">
              {starters.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => ask(s)} className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-left text-sm text-gray-100 transition-colors hover:border-primary hover:bg-primary/10">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="space-y-4">
          {messages.map((m, i) => {
            const text = textOf(m);
            if (m.role === 'user') {
              return (
                <li key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-[15px] text-white">{text}</p>
                </li>
              );
            }
            const sources: SourceRef[] = dataOf(m, 'sources')?.items || [];
            const crew = dataOf(m, 'crew');
            const specs = dataOf(m, 'specs');
            const sponsors = dataOf(m, 'sponsors');
            const contact = dataOf(m, 'contact');
            const follow = dataOf(m, 'followups')?.items || [];
            const st = dataOf(m, 'status');
            const isLast = i === messages.length - 1;
            const complete = !isLast || status === 'ready';
            return (
              <li key={m.id} className="flex gap-2.5">
                <Avatar />
                <div className="min-w-0 flex-1">
                  {text ? <Markdown text={text} sources={sources} /> : null}
                  {crew && <CrewCard data={crew} />}
                  {specs && <SpecCard data={specs} />}
                  {sponsors && <SponsorCard data={sponsors} />}
                  {contact && <ContactCard data={contact} />}
                  {complete && <SourceChips items={sources} />}
                  {complete && text && (
                    <div className="mt-2 flex items-center gap-1">
                      <CopyButton text={text} />
                      <Feedback logId={st?.logId} />
                      {isLast && (
                        <button type="button" aria-label="Regenerate answer" onClick={() => regenerate({ body: { page: pathname } })} className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white">
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  )}
                  {isLast && complete && follow.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {follow.map((f) => (
                        <li key={f}>
                          <button type="button" onClick={() => ask(f)} className="rounded-full border border-primary/50 px-3 py-1.5 text-xs font-medium text-[#ffb3ae] transition-colors hover:bg-primary hover:text-white">
                            {f}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}

          {status === 'submitted' && (
            <li className="flex items-center gap-2.5" aria-hidden>
              <Avatar />
              <span className="font-orbitron text-[11px] uppercase tracking-[0.15em] text-gray-400 motion-safe:animate-pulse">{LOADING_LINES[loadingLine]}</span>
            </li>
          )}
        </ul>

        {error && (
          <div role="alert" className="mt-4 rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-gray-100">
            <p className="font-semibold text-white">The AI assistant can&apos;t be reached right now.</p>
            {offline ? (
              <div className="mt-2">
                <p className="text-xs uppercase tracking-wide text-gray-400">Closest answer from the FAQ</p>
                <p className="mt-1 font-semibold">{offline.q}</p>
                <Markdown text={offline.a} />
              </div>
            ) : (
              <p className="mt-1">
                Please try again, or email{' '}
                <a className="underline" href={`mailto:${TEAM_EMAIL}`}>
                  {TEAM_EMAIL}
                </a>
                .
              </p>
            )}
            <button type="button" onClick={() => { clearError(); setOffline(null); regenerate({ body: { page: pathname } }); }} className="mt-2 rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b03934]">
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Screen readers hear the finished answer once, not every streamed word */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {/* Composer */}
      <form
        className="border-t border-white/10 bg-[#1b1819] px-3 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <div className="flex items-end gap-2 rounded-xl border border-white/15 bg-[#231f20] px-3 py-2 focus-within:border-primary">
          <label htmlFor={`raptor-input-${variant}`} className="sr-only">
            Ask Raptor a question
          </label>
          <textarea
            id={`raptor-input-${variant}`}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                ask(input);
              }
            }}
            rows={1}
            maxLength={MAX_INPUT}
            placeholder="Ask about the team, aircraft, competitions…"
            className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-base text-white placeholder:text-gray-500 focus:outline-none"
          />
          {busy ? (
            <button type="button" onClick={() => stop()} aria-label="Stop answer" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} aria-label="Send question" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-[#b03934] disabled:bg-white/10 disabled:text-gray-500">
              <ArrowUp size={18} />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-center text-[10px] leading-snug text-gray-500">
          AI assistant: answers can be wrong. Chats are stored for 30 days to improve it; please don&apos;t share personal details.
        </p>
      </form>
    </div>
  );
}
