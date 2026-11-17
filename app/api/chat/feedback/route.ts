import { visitorId, writeFeedback } from '@/lib/chat/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  try {
    if (!origin || new URL(origin).host !== req.headers.get('host')) return Response.json({ error: 'forbidden' }, { status: 403 });
  } catch {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }
  let body: { logId?: unknown; vote?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  if (typeof body.logId !== 'string' || !/^[a-f0-9]{24}$/.test(body.logId) || (body.vote !== 'up' && body.vote !== 'down')) {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  await writeFeedback(body.logId, body.vote, visitorId(ip));
  return Response.json({ ok: true });
}
