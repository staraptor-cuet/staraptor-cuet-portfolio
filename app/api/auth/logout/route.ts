import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    clearAdminSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
