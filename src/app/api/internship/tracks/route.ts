import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { InternshipTrack } from '@/models/InternshipTrack';
import { FALLBACK_INTERNSHIP_TRACKS } from '@/lib/internship-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stream = searchParams.get('stream');

    let tracks: any[] = [];
    try {
      await connectToDatabase();
      const query: any = { isActive: true };
      if (stream && stream !== 'ALL') {
        query.stream = stream.toUpperCase();
      }
      tracks = await InternshipTrack.find(query).sort({ durationWeeks: 1, title: 1 }).lean();
    } catch (dbErr) {
      console.warn('MongoDB tracks lookup notice (using verified catalog):', dbErr);
    }

    if (!tracks || tracks.length === 0) {
      tracks = FALLBACK_INTERNSHIP_TRACKS;
      if (stream && stream !== 'ALL') {
        tracks = tracks.filter((t) => t.stream === stream.toUpperCase());
      }
    }

    return NextResponse.json({
      success: true,
      tracks: JSON.parse(JSON.stringify(tracks)),
      count: tracks.length,
    });
  } catch (error) {
    console.error('Fetch tracks error:', error);
    return NextResponse.json({
      success: true,
      tracks: FALLBACK_INTERNSHIP_TRACKS,
      count: FALLBACK_INTERNSHIP_TRACKS.length,
    });
  }
}
