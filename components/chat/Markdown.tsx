'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { SourceRef } from '@/lib/chat/types';
import { isAllowedLink, toSitePath } from '@/lib/chat/links';

// Model output is untrusted. react-markdown never renders raw HTML; on top of that:
// images are dropped, and links outside the allow-list are shown as plain text.

function withCitations(text: string, sources: SourceRef[]): string {
  const known = new Set(sources.map((s) => s.n));
  return text.replace(/\[(\d{1,2})(?:†[^\]]*)?\](?!\()/g, (m, d) => (known.has(Number(d)) ? `[${d}](cite:${d})` : ''));
}

export default function Markdown({ text, sources = [] }: { text: string; sources?: SourceRef[] }) {
  return (
    <div className="raptor-md text-[15px] leading-relaxed text-gray-100 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => (url.startsWith('cite:') || /^(https?:|mailto:|tel:|\/)/.test(url) ? url : '')}
        components={{
          img: () => null,
          a: ({ href = '', children }) => {
            if (href.startsWith('cite:')) {
              const s = sources.find((x) => x.n === Number(href.slice(5)));
              if (!s) return null;
              const path = toSitePath(s.url);
              return (
                <a
                  href={path || s.url}
                  target={path ? undefined : '_blank'}
                  rel={path ? undefined : 'noopener noreferrer nofollow'}
                  title={`${s.title}: ${s.heading}`}
                  aria-label={`Source ${s.n}: ${s.title}, ${s.heading}`}
                  className="mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded bg-primary/25 px-1 align-text-top text-[10px] font-bold text-[#ffb3ae] no-underline hover:bg-primary hover:text-white"
                >
                  {s.n}
                </a>
              );
            }
            if (!isAllowedLink(href)) return <span>{children}</span>;
            const path = toSitePath(href);
            return (
              <a
                href={path || href}
                target={path ? undefined : '_blank'}
                rel={path ? undefined : 'noopener noreferrer nofollow'}
                className="text-[#ff8f88] underline underline-offset-2 hover:text-white"
              >
                {children}
              </a>
            );
          },
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          h1: ({ children }) => <p className="mb-1 font-semibold text-white">{children}</p>,
          h2: ({ children }) => <p className="mb-1 font-semibold text-white">{children}</p>,
          h3: ({ children }) => <p className="mb-1 font-semibold text-white">{children}</p>,
          code: ({ children }) => <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[13px]">{children}</code>,
          pre: ({ children }) => <pre className="mb-2 overflow-x-auto rounded bg-black/40 p-3 text-[13px]">{children}</pre>,
          table: ({ children }) => (
            <div className="mb-2 overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b border-primary/50 px-2 py-1 font-semibold text-white">{children}</th>,
          td: ({ children }) => <td className="border-b border-white/10 px-2 py-1 align-top">{children}</td>,
        }}
      >
        {withCitations(text, sources)}
      </ReactMarkdown>
    </div>
  );
}
