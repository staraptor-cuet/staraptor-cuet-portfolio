import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'staraptor_admin_session';
const SECRET_KEY = process.env.ADMIN_SECRET || 'staraptor-aerospace-cuet-2026-secret-key-signature';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'staraptor2026';

function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

function verifyToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadBase64, signature] = parts;
    const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) return false;
    
    const data = JSON.parse(payload);
    if (!data.exp || data.exp < Date.now()) return false;
    if (data.role !== 'admin') return false;
    
    return true;
  } catch {
    return false;
  }
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function createAdminSession(): string {
  const sessionData = {
    role: 'admin',
    user: ADMIN_USER,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const token = signToken(JSON.stringify(sessionData));
  
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  
  return token;
}

export function clearAdminSession(): void {
  cookies().set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function isAuthenticated(): boolean {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return false;
  return verifyToken(sessionToken);
}
