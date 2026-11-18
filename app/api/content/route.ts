import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const content = await getSiteContent();

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    };

    if (section && section in content) {
      return NextResponse.json({ [section]: (content as any)[section] }, { headers });
    }

    return NextResponse.json(content, { headers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { section, data } = body;

    let updated;
    if (section && data) {
      updated = await updateSiteContent((current) => ({
        ...current,
        [section]: data,
      }));
    } else {
      updated = await updateSiteContent(body);
    }

    // Trigger Next.js on-demand cache revalidation for all public pages
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/aircraft');
      revalidatePath('/crew');
      revalidatePath('/sponsors');
      revalidatePath('/progress');
      revalidatePath('/achievements');
      revalidatePath('/gallery');
      revalidatePath('/contact');
    } catch {
      // Revalidation non-fatal in development
    }

    return NextResponse.json({ success: true, content: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

