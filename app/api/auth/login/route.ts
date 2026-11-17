import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, createAdminSession } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, supabaseAccessToken } = body;

    // 1. Direct Supabase session token verification (e.g., after password recovery or browser OAuth)
    if (supabaseAccessToken && isSupabaseConfigured && supabase) {
      const { data: { user }, error: userError } = await supabase.auth.getUser(supabaseAccessToken);
      if (!userError && user) {
        createAdminSession(user.email || 'admin');
        return NextResponse.json({
          success: true,
          message: 'Session verified via Supabase',
          user: { email: user.email },
        });
      }
    }

    const identifier = email || username;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    // 2. Check local fallback credentials (from .env ADMIN_USERNAME / ADMIN_PASSWORD)
    if (checkCredentials(identifier, password)) {
      createAdminSession(identifier);
      return NextResponse.json({
        success: true,
        message: 'Logged in successfully (local credentials)',
      });
    }

    // 3. Check Supabase Auth credentials if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (!error && data?.user) {
        createAdminSession(data.user.email || identifier);
        return NextResponse.json({
          success: true,
          message: 'Logged in successfully via Supabase',
          user: { email: data.user.email },
          session: data.session,
        });
      }

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
