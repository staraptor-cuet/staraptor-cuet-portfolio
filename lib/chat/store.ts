// Rate limits, answer cache, logs and feedback on Upstash Redis (REST API, free tier).
// Without UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN everything falls back to process memory,
// which is enough for local development but resets on every cold start in production.
import { createHash } from 'node:crypto';
import { LIMITS } from './config';

type Cmd = (string | number)[];

const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
export const hasRedis = Boolean(URL_ && TOKEN);

const mem = new Map<string, { v: string | number | string[]; exp: number }>();

function memGet(key: string) {
  const e = mem.get(key);
  if (!e) return undefined;
  if (e.exp && e.exp < Date.now()) {
    mem.delete(key);
    return undefined;
  }
  return e;
}

function memRun(cmd: Cmd): unknown {
  const [op, key, ...rest] = cmd as [string, string, ...(string | number)[]];
  switch (op) {
    case 'INCR': {
      const e = memGet(key);
      const v = (typeof e?.v === 'number' ? e.v : 0) + 1;
      mem.set(key, { v, exp: e?.exp || 0 });
      return v;
    }
    case 'EXPIRE': {
      const e = memGet(key);
      if (e && !(rest[1] === 'NX' && e.exp)) e.exp = Date.now() + Number(rest[0]) * 1000;
      return 1;
    }
    case 'GET':
      return memGet(key)?.v ?? null;
    case 'SET': {
      const exIdx = rest.indexOf('EX');
      mem.set(key, { v: String(rest[0]), exp: exIdx >= 0 ? Date.now() + Number(rest[exIdx + 1]) * 1000 : 0 });
      return 'OK';
    }
    case 'LPUSH': {
      const e = memGet(key);
      const list = Array.isArray(e?.v) ? (e!.v as string[]) : [];
      list.unshift(String(rest[0]));
      mem.set(key, { v: list.slice(0, 500), exp: e?.exp || 0 });
      return list.length;
    }
    default:
      return null;
  }
}

/** Runs commands in one round trip. Never throws: storage problems must not break the chat. */
export async function redis(cmds: Cmd[]): Promise<unknown[]> {
  if (!hasRedis) return cmds.map(memRun);
  try {
    const res = await fetch(`${URL_}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds),
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`redis ${res.status}`);
    const json = (await res.json()) as { result?: unknown; error?: string }[];
    return json.map((r) => r.result ?? null);
  } catch (err) {
    console.error('[chat] redis unavailable, using memory fallback:', (err as Error).message);
    return cmds.map(memRun);
  }
}

export function utcDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Visitors are identified only by a salted hash that changes every day; raw IPs are never stored. */
export function visitorId(ip: string): string {
  const salt = process.env.LOG_SALT || 'dev-salt';
  return createHash('sha256').update(`${ip}|${salt}|${utcDay()}`).digest('hex').slice(0, 16);
}

export function sha(s: string): string {
  return createHash('sha256').update(s).digest('hex').slice(0, 24);
}

export interface LimitResult {
  ok: boolean;
  reason?: 'minute' | 'day' | 'global';
}

/** Per-visitor minute and day windows. */
export async function checkVisitorLimit(visitor: string): Promise<LimitResult> {
  const minute = Math.floor(Date.now() / 60000);
  const day = utcDay();
  const km = `rl:m:${visitor}:${minute}`;
  const kd = `rl:d:${visitor}:${day}`;
  const [m, , d] = (await redis([
    ['INCR', km],
    ['EXPIRE', km, 90, 'NX'],
    ['INCR', kd],
    ['EXPIRE', kd, 90000, 'NX'],
  ])) as number[];
  if (Number(m) > LIMITS.perMinute) return { ok: false, reason: 'minute' };
  if (Number(d) > LIMITS.perDay) return { ok: false, reason: 'day' };
  return { ok: true };
}

/** Site-wide ceiling of LLM answers per UTC day, so one busy day cannot exhaust the provider quota. */
export async function takeGlobalBudget(): Promise<boolean> {
  const k = `rl:g:${utcDay()}`;
  const [n] = (await redis([
    ['INCR', k],
    ['EXPIRE', k, 90000, 'NX'],
  ])) as number[];
  return Number(n) <= LIMITS.globalPerDay;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const [v] = await redis([['GET', `cache:${key}`]]);
  if (typeof v !== 'string') return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown): Promise<void> {
  await redis([['SET', `cache:${key}`, JSON.stringify(value), 'EX', LIMITS.cacheTtlSeconds]]);
}

/** A model/key pair rests after a 429 until its retry-after time has passed. */
export async function isCooling(id: string): Promise<boolean> {
  const [v] = await redis([['GET', `cool:${id}`]]);
  return v !== null && v !== undefined;
}

export async function setCooling(id: string, seconds: number): Promise<void> {
  const s = Math.min(Math.max(Math.ceil(seconds) || 30, 5), 3600);
  await redis([['SET', `cool:${id}`, '1', 'EX', s]]);
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?\d[\s-]?){9,14}\d/g;

/** Emails and phone numbers typed by visitors are removed before anything is stored. */
export function redact(s: string): string {
  return s.replace(EMAIL_RE, '[email]').replace(PHONE_RE, '[phone]');
}

export interface LogEntry {
  id: string;
  t: string;
  visitor: string;
  q: string;
  a: string;
  mode: string;
  model?: string;
  sources?: string[];
  ms?: number;
  flag?: string;
}

export async function writeLog(entry: LogEntry): Promise<void> {
  const k = `log:${utcDay()}`;
  await redis([
    ['LPUSH', k, JSON.stringify({ ...entry, q: redact(entry.q), a: entry.a.slice(0, 1500) })],
    ['EXPIRE', k, LIMITS.logTtlSeconds, 'NX'],
  ]);
}

export async function writeFeedback(logId: string, vote: 'up' | 'down', visitor: string): Promise<void> {
  const k = `fb:${utcDay()}`;
  await redis([
    ['LPUSH', k, JSON.stringify({ logId, vote, visitor, t: new Date().toISOString() })],
    ['EXPIRE', k, LIMITS.logTtlSeconds, 'NX'],
  ]);
}
