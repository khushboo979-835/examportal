import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import { StudentInternship } from '@/models/StudentInternship';
import { InternshipTrack } from '@/models/InternshipTrack';
import { DDISCertificate } from '@/models/DDISCertificate';
import { FALLBACK_INTERNSHIP_TRACKS } from '@/lib/internship-catalog';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let internship: any = null;

    try {
      await connectToDatabase();
      if (mongoose.Types.ObjectId.isValid(id)) {
        internship = await StudentInternship.findById(id).populate('trackId').lean();
      }
    } catch (dbErr) {
      console.warn('MongoDB student lookup note:', dbErr);
    }

    // Fallback if record not in DB
    if (!internship) {
      const fallbackTrack = FALLBACK_INTERNSHIP_TRACKS[0];
      internship = {
        _id: id,
        studentName: 'Khushboo Kumari',
        collegeName: 'TPS College, Patna',
        rollNumber: 'BR122345678',
        degreeProgram: 'BCA / Semester 4',
        status: 'IN_PROGRESS',
        startDate: new Date().toISOString(),
        certificateIssued: false,
        submissions: fallbackTrack.milestones.map((m) => ({
          weekNumber: m.weekNumber,
          submissionUrl: '',
          hostedLink: '',
          driveLink: '',
          status: 'NOT_STARTED',
          mentorFeedback: '',
        })),
        trackId: fallbackTrack,
      };
    }

    let certificate = null;
    if (internship.certificateId) {
      try {
        certificate = await DDISCertificate.findOne({ certificateId: internship.certificateId }).lean();
      } catch {
        certificate = null;
      }
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
