import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { StudentInternship } from '@/models/StudentInternship';
import { InternshipTrack } from '@/models/InternshipTrack';
import { DDISCertificate } from '@/models/DDISCertificate';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const internship = await StudentInternship.findById(id).populate('trackId').lean();
    if (!internship) {
      return NextResponse.json({ error: 'Internship record not found' }, { status: 404 });
    }

    let certificate = null;
    if (internship.certificateId) {
      certificate = await DDISCertificate.findOne({ certificateId: internship.certificateId }).lean();
    }

    return NextResponse.json({
      success: true,
      internship: JSON.parse(JSON.stringify(internship)),
      certificate: certificate ? JSON.parse(JSON.stringify(certificate)) : null,
    });
  } catch (error) {
    console.error('Fetch student internship error:', error);
    return NextResponse.json({ error: 'Failed to fetch internship details' }, { status: 500 });
  }
}
