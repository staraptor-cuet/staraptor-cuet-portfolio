import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFile(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
