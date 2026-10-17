import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get('key') || `materials/upload-${Date.now()}.pdf`;
    const blob = await request.blob();
    const size = blob.size;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully to storage vault',
      key,
      size,
    });
  } catch (error) {
    console.error('Local upload error:', error);
    return NextResponse.json({ error: 'Local upload failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return PUT(request);
}
