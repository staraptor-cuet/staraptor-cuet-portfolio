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
    const body = await req.json();
    const { username, email, password, supabaseAccessToken } = body;

    // 1. Direct Supabase session token verification (e.g., after password recovery)
    // Run before rate-limiting so valid password-recovery links always succeed and unlock the user
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

    // 2. Rate limiting & lockout check for password-based attempts
    const rateLimit = await checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account access is temporarily locked. Please try again in ${rateLimit.retryAfterSeconds || 300} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 300),
          },
        }
      );
    }

    const identifier = (email || username || '').trim();
    const pass = (password || '').trim();

    if (!identifier || !pass) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    // 3. Check credentials via timing-safe HMAC auth (configured via env ADMIN_USERNAME & ADMIN_PASSWORD)
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
      // If user typed "admin", map to registered admin email so both "admin" and email work seamlessly
      const emailToTry = identifier.includes('@')
        ? identifier
        : (process.env.ADMIN_EMAIL || 'staraptorcuet@gmail.com');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToTry,
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
        error: 'Wrong password',
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: 'Authentication request failed' }, { status: 500 });
  }
}
