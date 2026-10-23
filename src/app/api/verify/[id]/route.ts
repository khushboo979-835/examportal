import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const { id } = await params;
    const cleanId = (id || '').trim();

    if (!cleanId) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Single indexed lookup with lean projection to prevent payload bloating
    const projection = {
      certificateId: 1,
      studentName: 1,
      collegeName: 1,
      degreeProgram: 1,
      stream: 1,
      faculty: 1,
      trackTitle: 1,
      durationWeeks: 1,
      creditHours: 1,
      nepCurriculumHours: 1,
      grade: 1,
      issueDate: 1,
      validityStatus: 1,
      verificationUrl: 1,
      accreditationAuthority: 1,
      certificatePdfUrl: 1,
      qrCodeDataUrl: 1,
    };

    let cert = await DDISCertificate.findOne(
      {
        $or: [{ certificateId: cleanId }, { certificateId: cleanId.toUpperCase() }],
      },
      projection
    ).lean();

    // Fallback lookup in StudentInternship if certificate record pending sync
    if (!cert) {
      const internship = await StudentInternship.findOne(
        {
          $or: [{ certificateId: cleanId }, { rollNumber: cleanId }],
          certificateIssued: true,
        },
        {
          certificateId: 1,
          studentName: 1,
          collegeName: 1,
          degreeProgram: 1,
          trackId: 1,
          completedDate: 1,
          updatedAt: 1,
        }
      )
        .populate('trackId', 'title stream faculty durationWeeks creditHours nepCurriculumHours')
        .lean();

      if (internship && internship.certificateId) {
        const track = internship.trackId as any;
        cert = {
          certificateId: internship.certificateId,
          studentName: internship.studentName || 'Student Intern',
          collegeName: internship.collegeName,
          degreeProgram: internship.degreeProgram,
          stream: track?.stream || 'Undergraduate Faculty',
          faculty: track?.faculty || track?.stream || 'IT',
          trackTitle: track?.title || 'NEP-2020 Industry Internship',
          durationWeeks: track?.durationWeeks || 4,
          creditHours: track?.creditHours || 75,
          nepCurriculumHours: track?.nepCurriculumHours || 75,
          grade: 'A+ (Distinction)',
          issueDate: internship.completedDate || internship.updatedAt,
          validityStatus: 'VALID',
          verificationUrl: `https://studyfreepdf.com/verify/${internship.certificateId}`,
          accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
          certificatePdfUrl: `/api/internship/generate-certificate?id=${internship.certificateId}`,
        } as any;
      }
    }

    if (!cert) {
      return NextResponse.json(
        {
          valid: false,
          error: `No accredited credential found for ID "${cleanId}". Please verify the certificate number.`,
          executionTimeMs: Date.now() - startTime,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: cert.validityStatus === 'VALID',
      certificate: {
        ...cert,
        pdfDownloadUrl: `/api/internship/generate-certificate?id=${cert.certificateId}`,
        watermarkedDownloadUrl: `/api/internship/download/${cert.certificateId}`,
      },
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Accredited verification API error:', error);
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 });
  }
}
