import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { InternshipTrack } from '@/models/InternshipTrack';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stream = searchParams.get('stream');

    await connectToDatabase().catch(() => {});

    const query: any = { isActive: true };
    if (stream && stream !== 'ALL') {
      query.stream = stream.toUpperCase();
    }

    let tracks = await InternshipTrack.find(query).sort({ durationWeeks: 1, title: 1 }).lean();

    return NextResponse.json({
      success: true,
      tracks: JSON.parse(JSON.stringify(tracks)),
      count: tracks.length,
    });
  } catch (error) {
    console.error('Fetch tracks error:', error);
    return NextResponse.json({ error: 'Failed to fetch internship tracks' }, { status: 500 });
  }
}
