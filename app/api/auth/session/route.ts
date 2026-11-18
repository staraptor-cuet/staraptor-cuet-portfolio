import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getStorageStatus } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = isAuthenticated();
    const storage = authenticated ? getStorageStatus() : null;

    return NextResponse.json({
      authenticated,
      storage,
      user: authenticated ? (process.env.ADMIN_USERNAME || 'administrator') : null,
    });
  } catch {
    return NextResponse.json({ authenticated: false, storage: null, user: null }, { status: 500 });
  }
}
