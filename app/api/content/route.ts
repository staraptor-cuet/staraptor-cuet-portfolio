import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const content = await getSiteContent();

    if (section && section in content) {
      return NextResponse.json({ [section]: (content as any)[section] });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
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
      revalidatePath('/gallery');
      revalidatePath('/vtol-2026');
      revalidatePath('/contact');
    } catch (e) {
      // Revalidation non-fatal in development
    }

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
  }
}

