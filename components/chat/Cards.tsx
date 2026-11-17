'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, ExternalLink, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import type { RaptorData, SourceRef } from '@/lib/chat/types';
import { toSitePath } from '@/lib/chat/links';

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section aria-label={label} className="relative mt-3 rounded-md border border-white/10 bg-[#1b1819] p-3">
      {/* HUD corner brackets */}
      <span aria-hidden className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-primary" />
      <span aria-hidden className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-primary" />
      <p className="mb-2 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{label}</p>
      {children}
    </section>
  );
}

export function CrewCard({ data }: { data: RaptorData['crew'] }) {
  return (
    <Frame label="Crew">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.members.map((m) => (
          <li key={m.name} className="flex items-center gap-3 rounded bg-white/5 p-2">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-primary/60">
              <Image src={m.image} alt="" fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{m.name}</p>
              <p className="truncate text-xs text-gray-300">{m.designation}</p>
              <p className="text-[11px] text-gray-400">{m.batch}</p>
            </div>
            {m.linkedin && (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`${m.name} on LinkedIn`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-300 hover:bg-primary hover:text-white"
              >
                <Linkedin size={16} />
              </a>
            )}
          </li>
        ))}
      </ul>
      {data.note && <p className="mt-2 text-xs text-gray-400">{data.note}</p>}
      <Link href="/crew" className="mt-2 inline-block text-xs font-semibold text-[#ff8f88] hover:text-white">
        Open the Crew page
      </Link>
    </Frame>
  );
}

export function SpecCard({ data }: { data: RaptorData['specs'] }) {
  return (
    <Frame label={data.aircraft}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">{g.title}</p>
            <dl className="space-y-1">
              {g.items.map((it) => (
                <div key={it.label} className="flex items-baseline justify-between gap-2 border-b border-white/5 pb-1 sm:block">
                  <dt className="text-xs text-gray-300">{it.label}</dt>
                  <dd className="text-sm font-semibold text-white">{it.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {data.status}. As of {data.asOf}.
      </p>
      <Link href="/aircraft" className="mt-1 inline-block text-xs font-semibold text-[#ff8f88] hover:text-white">
        Open the Aircraft page
      </Link>
    </Frame>
  );
}

export function SponsorCard({ data }: { data: RaptorData['sponsors'] }) {
  return (
    <Frame label="Partners">
      <ul className="space-y-1.5">
        {data.tiers.map((t) => (
          <li key={t.tier} className="flex items-center justify-between gap-3 rounded bg-white/5 px-2 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">{t.tier}</span>
            <span className="text-right text-sm text-white">
              {t.sponsors.map((s) => s.name).join(', ')}
              {t.sponsors.length === 0 && <span className="text-gray-400">Open ({t.open_slots})</span>}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={data.proposalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-[#b03934]"
        >
          <Download size={14} /> Sponsorship proposal
        </a>
        <a
          href={`mailto:${data.email}?subject=${encodeURIComponent('Sponsorship enquiry - Team Staraptor CUET')}`}
          className="inline-flex items-center gap-1.5 rounded border border-primary px-3 py-2 text-xs font-bold text-[#ff8f88] hover:bg-primary hover:text-white"
        >
          <Mail size={14} /> Email the team
        </a>
      </div>
      <p className="mt-2 text-xs text-gray-400">As of {data.asOf}.</p>
    </Frame>
  );
}

export function ContactCard({ data }: { data: RaptorData['contact'] }) {
  return (
    <Frame label="Contact">
      <ul className="space-y-1.5 text-sm text-white">
        <li>
          <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 hover:text-[#ff8f88]">
            <Mail size={15} className="text-primary" /> {data.email}
          </a>
        </li>
        <li>
          <a href={`tel:${data.phone}`} className="inline-flex items-center gap-2 hover:text-[#ff8f88]">
            <Phone size={15} className="text-primary" /> {data.phone}
          </a>
        </li>
        <li className="flex items-start gap-2 text-gray-300">
          <MapPin size={15} className="mt-0.5 shrink-0 text-primary" /> {data.address}
        </li>
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        {data.links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:border-primary hover:text-white"
          >
            {l.label} <ExternalLink size={12} />
          </a>
        ))}
      </div>
    </Frame>
  );
}

export function SourceChips({ items }: { items: SourceRef[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <p className="mb-1 font-orbitron text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Sources</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((s) => {
          const path = toSitePath(s.url);
          let host = 'this site';
          try {
            if (!path) host = new URL(s.url).host.replace(/^www\./, '');
          } catch {}
          return (
            <li key={s.n}>
              <a
                href={path || s.url}
                target={path ? undefined : '_blank'}
                rel={path ? undefined : 'noopener noreferrer nofollow'}
                title={`${s.title}: ${s.heading}. Last verified ${s.lastVerified}`}
                className="inline-flex max-w-[240px] items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-gray-200 hover:border-primary hover:text-white"
              >
                <span className="flex h-4 min-w-4 items-center justify-center rounded bg-primary/30 px-1 text-[10px] font-bold text-[#ffb3ae]">{s.n}</span>
                <span className="truncate">{s.heading}</span>
                <span className="shrink-0 text-gray-500">{host}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
