import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, hexSignature] = parts;

    // Decode base64url payload
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    if (!payload.exp || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return false;
    }
    if (payload.role !== 'admin') {
      return false;
    }

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(jsonStr));
    const expectedSig = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedSig === hexSignature;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and /admin/reset-password
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/reset-password')
  ) {
    const sessionCookie = request.cookies.get('staraptor_admin_session');
    const secret =
      process.env.ADMIN_SECRET ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.CLOUDINARY_API_SECRET ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let isValid = false;
    if (sessionCookie?.value && secret) {
      isValid = await verifySessionToken(sessionCookie.value, secret);
    }

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
