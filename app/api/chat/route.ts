import { createUIMessageStreamResponse } from 'ai';
import { LIMITS, SITE_URL } from '@/lib/chat/config';
import { runChat } from '@/lib/chat/pipeline';
import type { Turn } from '@/lib/chat/pipeline';
import { visitorId } from '@/lib/chat/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false; // browsers always send Origin on a cross-site or same-site POST from fetch
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  if (host === req.headers.get('host')) return true; // same deployment (production, preview, localhost)
  if (host === new URL(SITE_URL).host) return true;
  if (host === 'staraptor-website.vercel.app' || host === 'staraptorcuet.vercel.app') return true;
  const extra = (process.env.CHAT_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

interface IncomingPart {
  type?: unknown;
  text?: unknown;
}
interface IncomingMessage {
  role?: unknown;
  parts?: unknown;
}

/** The client sends UI messages; the server keeps only plain user/assistant text and rebuilds everything else. */
function toTurns(messages: unknown): Turn[] {
  if (!Array.isArray(messages)) return [];
  const turns: Turn[] = [];
  for (const m of messages as IncomingMessage[]) {
    if (m?.role !== 'user' && m?.role !== 'assistant') continue;
    if (!Array.isArray(m.parts)) continue;
    const text = (m.parts as IncomingPart[])
      .filter((p) => p?.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text as string)
      .join('\n')
      .trim();
    if (text) turns.push({ role: m.role, text });
  }
  return turns;
}

function bad(status: number, error: string): Response {
  return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request): Promise<Response> {
  if (!originAllowed(req)) return bad(403, 'Requests are only accepted from the Team Staraptor CUET website.');
  if (!(req.headers.get('content-type') || '').includes('application/json')) return bad(415, 'Send JSON.');
  if (Number(req.headers.get('content-length') || 0) > 60_000) return bad(413, 'Request too large.');

  let body: { messages?: unknown; page?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad(400, 'Invalid JSON.');
  }

  const turns = toTurns(body.messages);
  const last = turns[turns.length - 1];
  if (!last || last.role !== 'user') return bad(400, 'No question found.');

  const question = last.text.replace(/\s+/g, ' ').trim();
  if (question.length > LIMITS.maxInputChars) {
    return bad(400, `Please keep questions under ${LIMITS.maxInputChars} characters.`);
  }

  const history = turns
    .slice(0, -1)
    .slice(-LIMITS.maxHistoryTurns)
    .map((t) => ({ role: t.role, text: t.text.slice(0, LIMITS.maxHistoryCharsPerMessage) }));

  const page = typeof body.page === 'string' && /^\/[a-z0-9\-/]{0,40}$/i.test(body.page) ? body.page : undefined;

  const stream = runChat({ question, history, page, visitor: visitorId(clientIp(req)), signal: req.signal });
  return createUIMessageStreamResponse({ stream, headers: { 'Cache-Control': 'no-store' } });
}
