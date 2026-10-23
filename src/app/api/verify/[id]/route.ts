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
    const cleanId = id?.trim();

    if (!cleanId) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Selective projection: only client-safe presentation fields
    const projection = {
      certificateId: 1,
      studentName: 1,
      collegeName: 1,
      stream: 1,
      faculty: 1,
      trackTitle: 1,
      degreeProgram: 1,
      durationWeeks: 1,
      nepCurriculumHours: 1,
      grade: 1,
      issueDate: 1,
      validityStatus: 1,
      verificationUrl: 1,
      accreditationAuthority: 1,
      certificatePdfUrl: 1,
      qrCodeDataUrl: 1,
    };

    // 1. Single direct lookup against DDISCertificate collection
    const cert = await DDISCertificate.findOne(
      {
        $or: [
          { certificateId: cleanId },
          { certificateId: cleanId.toUpperCase() },
        ],
      },
      projection
    ).lean();

    if (cert) {
      return NextResponse.json({
        success: true,
        verified: (cert as any).validityStatus === 'VALID',
        certificate: {
          ...cert,
          pdfDownloadUrl: `/api/internship/generate-certificate?id=${(cert as any).certificateId}`,
          verificationTimestamp: new Date().toISOString(),
        },
      });
    }

    // 2. Secondary fallback against StudentInternship by certificateId or rollNumber
    const internship = await StudentInternship.findOne(
      {
        $or: [
          { certificateId: cleanId },
          { certificateId: cleanId.toUpperCase() },
          { rollNumber: cleanId },
        ],
        certificateIssued: true,
      },
      {
        certificateId: 1,
        studentName: 1,
        collegeName: 1,
        degreeProgram: 1,
        trackId: 1,
        completedDate: 1,
        status: 1,
      }
    )
      .populate('trackId', 'title stream faculty durationWeeks nepCurriculumHours')
      .lean();

    if (internship && (internship as any).certificateId) {
      const track = (internship as any).trackId || {};
      const fallbackCert = {
        certificateId: (internship as any).certificateId,
        studentName: (internship as any).studentName || 'Student Intern',
        collegeName: (internship as any).collegeName,
        degreeProgram: (internship as any).degreeProgram,
        stream: track.stream || 'IT',
        faculty: track.faculty || track.stream || 'Computer Apps & IT',
        trackTitle: track.title || 'NEP-2020 Virtual Industry Internship',
        durationWeeks: track.durationWeeks || 4,
        nepCurriculumHours: track.nepCurriculumHours || 75,
        grade: 'A+ (Distinction)',
        issueDate: (internship as any).completedDate || new Date(),
        validityStatus: 'VALID',
        verificationUrl: `https://studyfreepdf.com/verify/${(internship as any).certificateId}`,
        accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
        pdfDownloadUrl: `/api/internship/generate-certificate?id=${(internship as any).certificateId}`,
      };

      return NextResponse.json({
        success: true,
        verified: true,
        certificate: {
          ...fallbackCert,
          verificationTimestamp: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: 'No authentic DDIS credential found matching this ID. Ensure the certificate code is accurate.',
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification server error occurred' },
      { status: 500 }
    );
  }
}
