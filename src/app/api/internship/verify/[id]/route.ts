import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.trim();

    await connectToDatabase();

    const cert = await DDISCertificate.findOne({
      $or: [{ certificateId: cleanId }, { certificateId: cleanId.toUpperCase() }],
    }).populate('internshipId').lean();

    if (!cert) {
      // Also check StudentInternship directly
      const internship = await StudentInternship.findOne({
        $or: [{ certificateId: cleanId }, { rollNumber: cleanId }, { _id: cleanId.length === 24 ? cleanId : null }],
      }).populate('trackId').lean();

      if (internship && internship.certificateIssued && internship.certificateId) {
        return NextResponse.json({
          success: true,
          certificate: {
            certificateId: internship.certificateId,
            studentName: internship.studentName,
            collegeName: internship.collegeName,
            degreeProgram: internship.degreeProgram,
            stream: (internship.trackId as any)?.stream || 'Undergraduate Faculty',
            trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Industry Internship',
            durationWeeks: (internship.trackId as any)?.durationWeeks || 4,
            grade: 'A+ (Distinction)',
            issueDate: internship.completedDate || internship.updatedAt,
            validityStatus: 'VALID',
            verificationUrl: `https://studyfreepdf.com/verify/${internship.certificateId}`,
            accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
            pdfDownloadUrl: `/api/internship/generate-certificate?id=${internship.certificateId}`,
          },
        });
      }

      return NextResponse.json(
        { error: 'No verified certificate found with this ID. Please re-check the certificate number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        ...cert,
        pdfDownloadUrl: `/api/internship/generate-certificate?id=${cert.certificateId}`,
      },
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 });
  }
}
