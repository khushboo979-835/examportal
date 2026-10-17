import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/storage';
import { rateLimit } from '@/lib/rate-limiter';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const limitCheck = rateLimit(`upload_pre_${ip}`, { limit: 30, windowMs: 60000 });
    if (!limitCheck.success) {
      return NextResponse.json({ error: 'Too many upload requests' }, { status: 429 });
    }

    const body = await request.json();
    const { fileName, fileType, folder = 'materials' } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing fileName or fileType' },
        { status: 400 }
      );
    }

    if (!fileType.includes('pdf') && !fileType.includes('octet-stream')) {
      return NextResponse.json(
        { error: 'Only PDF documents are permitted' },
        { status: 400 }
      );
    }

    const cleanName = slugify(fileName.replace(/\.[^/.]+$/, ''));
    const uniqueKey = `${folder}/${Date.now()}-${cleanName}.pdf`;

    const { uploadUrl, fileKey } = await generatePresignedUploadUrl({
      fileKey: uniqueKey,
      contentType: fileType || 'application/pdf',
      expiresInSeconds: 600, // 10 minutes
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      fileKey,
      expiresIn: 600,
    });
  } catch (error) {
    console.error('Presigned upload generation error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
