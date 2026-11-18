import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadFile } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'pdf']);

function validateMagicBytes(buffer: Buffer, mime: string, ext: string): boolean {
  if (buffer.length < 12) return false;

  // Immediate rejection of SVG, HTML, or script content
  const headerSample = buffer.subarray(0, 1024).toString('utf-8').toLowerCase();
  if (
    headerSample.includes('<svg') ||
    headerSample.includes('<html') ||
    headerSample.includes('<?xml') ||
    headerSample.includes('<script') ||
    headerSample.includes('<!doctype')
  ) {
    return false;
  }

  // JPEG: FF D8 FF
  if (ext === 'jpg' || ext === 'jpeg' || mime === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (ext === 'png' || mime === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WebP: RIFF .... WEBP
  if (ext === 'webp' || mime === 'image/webp') {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }

  // AVIF: ....ftyp (bytes 4..7)
  if (ext === 'avif' || mime === 'image/avif') {
    return (
      buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70
    );
  }

  // PDF: %PDF- (25 50 44 46 2D)
  if (ext === 'pdf' || mime === 'application/pdf') {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    );
  }

  return false;
}

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

    // 1. Max file size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (10MB)' },
        { status: 400 }
      );
    }

    // 2. File extension check
    const rawExt = path.extname(file.name).toLowerCase().replace('.', '');
    if (!rawExt || !ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: `File type .${rawExt || 'unknown'} is not allowed. Allowed types: jpg, png, webp, avif, pdf.` },
        { status: 400 }
      );
    }

    // 3. MIME type check
    const mime = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return NextResponse.json(
        { error: `MIME type ${mime || 'unknown'} is not allowed.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Magic-byte verification (Strict check against spoofed extensions)
    const isMagicValid = validateMagicBytes(buffer, mime, rawExt);
    if (!isMagicValid) {
      return NextResponse.json(
        { error: 'File content does not match its declared type or contains prohibited markup.' },
        { status: 400 }
      );
    }

    // 5. Sanitize filename
    const safeBaseName = path
      .basename(file.name, `.${rawExt}`)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);

    const safeFilename = `${safeBaseName || 'upload'}.${rawExt}`;

    const result = await uploadFile(buffer, safeFilename, mime);

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: safeFilename,
      size: file.size,
    });
  } catch {
    return NextResponse.json(
      { error: 'File upload processing failed' },
      { status: 500 }
    );
  }
}
