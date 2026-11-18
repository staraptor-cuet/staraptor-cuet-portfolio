import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, createAdminSession } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  getClientIp,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
} from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate limiting & lockout check
    const rateLimit = await checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account access is temporarily locked. Please try again in ${rateLimit.retryAfterSeconds || 900} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 900),
          },
        }
      );
    }

    const body = await req.json();
    const { username, email, password, supabaseAccessToken } = body;

    // 2. Direct Supabase session token verification (e.g., after password recovery)
    if (supabaseAccessToken && isSupabaseConfigured && supabase) {
      const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseAccessToken);
      if (!userError && user && user.email) {
        const sessionCreated = createAdminSession(user.email);
        if (sessionCreated) {
          await clearLoginAttempts(ip);
          return NextResponse.json({
            success: true,
            message: 'Session verified via Supabase',
            user: { email: user.email },
          });
        }
      }
    }

    const identifier = (email || username || '').trim();
    const pass = (password || '').trim();

    if (!identifier || !pass) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    // 3. Check credentials via timing-safe HMAC auth (configured via env)
    if (checkCredentials(identifier, pass)) {
      const sessionCreated = createAdminSession(identifier);
      if (sessionCreated) {
        await clearLoginAttempts(ip);
        return NextResponse.json({
          success: true,
          message: 'Logged in successfully',
        });
      }
    }

    // 4. Check Supabase Auth credentials if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: pass,
      });

      if (!error && data?.user && data.user.email) {
        const sessionCreated = createAdminSession(data.user.email);
        if (sessionCreated) {
          await clearLoginAttempts(ip);
          return NextResponse.json({
            success: true,
            message: 'Logged in successfully via Supabase',
            user: { email: data.user.email },
          });
        }
      }
    }

    // 5. Failed authentication: increment attempt counter & apply lockout if exceeded
    const failedStatus = await recordFailedLogin(ip);
    if (!failedStatus.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account access is temporarily locked. Please try again in ${failedStatus.retryAfterSeconds || 900} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(failedStatus.retryAfterSeconds || 900),
          },
        }
      );
    }

    return NextResponse.json(
      {
        error: `Invalid email/username or password. ${failedStatus.remainingAttempts} attempt(s) remaining before temporary lockout.`,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: 'Authentication request failed' }, { status: 500 });
  }
}
