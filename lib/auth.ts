import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'staraptor_admin_session';

function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.trim().length < 16) {
    return null;
  }
  return secret.trim();
}

function getAdminCredentials(): { user: string; pass: string } | null {
  const user = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || user.trim() === '' || pass.trim() === '') {
    return null;
  }
  return { user: user.trim(), pass: pass.trim() };
}

export function signToken(payload: string): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

export function verifyToken(token: string): boolean {
  try {
    const secret = getAdminSecret();
    if (!secret) return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadBase64, signature] = parts;
    const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    const data = JSON.parse(payload);
    if (!data.exp || typeof data.exp !== 'number' || data.exp < Date.now()) return false;
    if (data.role !== 'admin') return false;

    return true;
  } catch {
    return false;
  }
}

export function checkCredentials(user: string, pass: string): boolean {
  const creds = getAdminCredentials();
  if (!creds || !getAdminSecret()) {
    // Fail closed if server credentials are not configured
    return false;
  }

  const userBuffer = Buffer.from(user);
  const adminUserBuffer = Buffer.from(creds.user);
  const passBuffer = Buffer.from(pass);
  const adminPassBuffer = Buffer.from(creds.pass);

  const userMatch =
    userBuffer.length === adminUserBuffer.length &&
    crypto.timingSafeEqual(userBuffer, adminUserBuffer);
  const passMatch =
    passBuffer.length === adminPassBuffer.length &&
    crypto.timingSafeEqual(passBuffer, adminPassBuffer);

  return userMatch && passMatch;
}

export function createAdminSession(user?: string): string | null {
  const creds = getAdminCredentials();
  const username = user || creds?.user;
  if (!username) return null;

  const sessionData = {
    role: 'admin',
    user: username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const token = signToken(JSON.stringify(sessionData));
  if (!token) return null;

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
}

export function clearAdminSession(): void {
  cookies().set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

export function isAuthenticated(): boolean {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return false;
  return verifyToken(sessionToken);
}
