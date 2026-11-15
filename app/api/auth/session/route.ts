import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getStorageStatus } from '@/lib/storage';

export async function GET() {
  const authenticated = isAuthenticated();
  const storage = getStorageStatus();

  return NextResponse.json({
    authenticated,
    storage,
    user: authenticated ? (process.env.ADMIN_USERNAME || 'admin') : null,
  });
}
