import { createHash } from 'node:crypto';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

function cleanupMemoryStore() {
  const now = Date.now();
  memoryStore.forEach((record, key) => {
    if (record.lockedUntil < now && record.attempts === 0) {
      memoryStore.delete(key);
    }
  });
}

// Clean up every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryStore, 10 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntil?: number;
  retryAfterSeconds?: number;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

function getRateLimitKey(prefix: string, ip: string): string {
  const hashedIp = createHash('sha256').update(`${ip}-${process.env.ADMIN_SECRET || 'salt'}`).digest('hex').slice(0, 16);
  return `ratelimit:${prefix}:${hashedIp}`;
}

export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  const key = getRateLimitKey('login', ip);
  const now = Date.now();

  if (hasRedis) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const record: RateLimitRecord = JSON.parse(data.result);
          if (record.lockedUntil > now) {
            const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
            return {
              allowed: false,
              remainingAttempts: 0,
              lockedUntil: record.lockedUntil,
              retryAfterSeconds,
            };
          }
          return {
            allowed: true,
            remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
          };
        }
      }
    } catch {
      // Fall through to in-memory store
    }
  }

  const record = memoryStore.get(key);
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: record.lockedUntil,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
  };
}

export async function recordFailedLogin(ip: string): Promise<RateLimitResult> {
  const key = getRateLimitKey('login', ip);
  const now = Date.now();

  let attempts = 1;
  let lockedUntil = 0;

  const current = await checkLoginRateLimit(ip);
  attempts = MAX_ATTEMPTS - current.remainingAttempts + 1;

  if (attempts >= MAX_ATTEMPTS) {
    lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  const record: RateLimitRecord = { attempts, lockedUntil };
  const ttlSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);

  if (hasRedis) {
    try {
      await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
        cache: 'no-store',
      });
    } catch {
      // Fallback to memory
    }
  }

  memoryStore.set(key, record);

  const retryAfterSeconds = lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : undefined;
  return {
    allowed: attempts < MAX_ATTEMPTS,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - attempts),
    lockedUntil: lockedUntil || undefined,
    retryAfterSeconds,
  };
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const key = getRateLimitKey('login', ip);

  if (hasRedis) {
    try {
      await fetch(`${UPSTASH_URL}/del/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
    } catch {
      // Ignore
    }
  }

  memoryStore.delete(key);
}
