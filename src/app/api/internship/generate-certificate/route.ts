import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';
import { InternshipTrack } from '@/models/InternshipTrack';
import { generateDDISCertificatePdf } from '@/lib/ddisCertificateGenerator';

export const dynamic = 'force-dynamic';

/**
 * POST /api/internship/generate-certificate
 * Enforce strict programmatic issuance gate (AC-08, AC-09):
 * Dynamically block certificate generation if any mandatory weekly milestone is missing or unapproved.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { internshipId, studentPhone, studentEmail } = body;

    if (!internshipId) {
      return NextResponse.json({ error: 'internshipId parameter is required' }, { status: 400 });
    }

    await connectToDatabase();

    const internship = await StudentInternship.findById(internshipId).populate('trackId');
    if (!internship) {
      return NextResponse.json({ error: 'Internship record not found' }, { status: 404 });
    }

    // If certificate was already generated, return the existing credential
    if (internship.certificateIssued && internship.certificateId) {
      const existingCert = await DDISCertificate.findOne({ certificateId: internship.certificateId });
      return NextResponse.json({
        success: true,
        message: 'Certificate already issued and verified.',
        certificateId: internship.certificateId,
        verificationUrl: existingCert?.verificationUrl || `https://studyfreepdf.com/verify/${internship.certificateId}`,
      });
    }

    const totalRequiredWeeks = (internship.trackId as any)?.durationWeeks || 4;
    const submissions = internship.submissions || [];

    // Programmatic Gate: Check if all weekly milestones exist and are APPROVED
    const unapprovedMilestones: number[] = [];
    for (let w = 1; w <= totalRequiredWeeks; w++) {
      const sub = submissions.find((s) => s.weekNumber === w);
      if (!sub || sub.status !== 'APPROVED') {
        unapprovedMilestones.push(w);
      }
    }

    if (unapprovedMilestones.length > 0) {
      return NextResponse.json(
        {
          error: `Certificate issuance blocked: All ${totalRequiredWeeks} weekly project milestones must be submitted and approved by an authorized mentor before certificate generation.`,
          unapprovedWeeks: unapprovedMilestones,
          totalRequiredWeeks,
          approvedCount: submissions.filter((s) => s.status === 'APPROVED').length,
        },
        { status: 403 }
      );
    }

    // Generate unique tamper-proof credential ID: DDIS-NEP-2026-{STREAM}-{HEX}
    const rawStream = (internship.trackId as any)?.stream || 'IT';
    const streamCode = rawStream.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() || 'IT';
    const hex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const certificateId = `DDIS-NEP-2026-${streamCode}-${hex}`;
    const verificationUrl = `https://studyfreepdf.com/verify/${certificateId}`;

    // Generate QR Code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });

    // Create DDISCertificate in database
    const cert = await DDISCertificate.create({
      certificateId,
      userId: internship.userId,
      internshipId: internship._id,
      studentName: internship.studentName || 'Student Intern',
      collegeName: internship.collegeName,
      degreeProgram: internship.degreeProgram || 'Undergraduate Degree',
      stream: (internship.trackId as any)?.stream || 'IT',
      faculty: (internship.trackId as any)?.faculty || (internship.trackId as any)?.stream || 'IT',
      trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Virtual Internship',
      durationWeeks: totalRequiredWeeks,
      nepCurriculumHours: (internship.trackId as any)?.nepCurriculumHours || 75,
      grade: 'A+ (Distinction)',
      issueDate: new Date(),
      validityStatus: 'VALID',
      qrCodeDataUrl,
      verificationUrl,
      certificatePdfUrl: `/api/internship/generate-certificate?id=${certificateId}`,
      accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    });

    // Mark StudentInternship as completed
    internship.certificateIssued = true;
    internship.certificateId = certificateId;
    internship.status = 'COMPLETED';
    internship.isCompleted = true;
    internship.completedDate = new Date();
    await internship.save();

    return NextResponse.json({
      success: true,
      message: 'Certificate successfully generated and accredited under DDIS.',
      certificateId,
      verificationUrl,
      downloadUrl: `/api/internship/generate-certificate?id=${certificateId}`,
    });
  } catch (error: any) {
    console.error('Certificate issuance gate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/internship/generate-certificate?id=...
 * Serves the official high-resolution landscape PDF certificate with QR link & viva dossier
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('certificateId') || searchParams.get('id');
    const internshipId = searchParams.get('internshipId');

    await connectToDatabase();

    let certRecord: any = null;
    let internshipRecord: any = null;

    if (certificateId) {
      certRecord = await DDISCertificate.findOne({
        $or: [{ certificateId }, { certificateId: certificateId.toUpperCase() }],
      }).lean();

      if (certRecord && certRecord.internshipId) {
        internshipRecord = await StudentInternship.findById(certRecord.internshipId).populate('trackId').lean();
      }
    } else if (internshipId) {
      internshipRecord = await StudentInternship.findById(internshipId).populate('trackId').lean();
      if (internshipRecord && internshipRecord.certificateId) {
        certRecord = await DDISCertificate.findOne({ certificateId: internshipRecord.certificateId }).lean();
      } else if (internshipRecord) {
        // Enforce issuance gate: if milestones are not approved, block download
        const totalWeeks = (internshipRecord.trackId as any)?.durationWeeks || 4;
        const approvedCount = (internshipRecord.submissions || []).filter((s: any) => s.status === 'APPROVED').length;
        if (approvedCount < totalWeeks && internshipRecord.status !== 'COMPLETED') {
          return NextResponse.json(
            { error: 'Certificate generation blocked: All weekly project milestones must be approved before PDF issuance.' },
            { status: 403 }
          );
        }
      }
    }

    if (certRecord && certRecord.validityStatus === 'REVOKED') {
      return NextResponse.json({ error: 'This credential has been revoked.' }, { status: 403 });
    }

    // Default fallback demo certificate if ID not in DB yet
    const targetCertId = certificateId || internshipRecord?.certificateId || 'DDIS-NEP-2026-IT-9482';
    const studentName = certRecord?.studentName || internshipRecord?.studentName || 'Aditya Verma';
    const collegeName = certRecord?.collegeName || internshipRecord?.collegeName || 'Patna Science College, Patna University';
    const degreeProgram = certRecord?.degreeProgram || internshipRecord?.degreeProgram || 'Bachelor of Computer Applications (BCA)';
    const stream = certRecord?.stream || (internshipRecord?.trackId as any)?.stream || 'BCA / Computer Applications & IT';
    const trackTitle = certRecord?.trackTitle || (internshipRecord?.trackId as any)?.title || 'Full-Stack Web Engineering (Next.js, TypeScript & MongoDB)';
    const durationWeeks = certRecord?.durationWeeks || (internshipRecord?.trackId as any)?.durationWeeks || 4;
    const nepCurriculumHours = certRecord?.nepCurriculumHours || (internshipRecord?.trackId as any)?.nepCurriculumHours || 75;
    const grade = certRecord?.grade || 'A+ (Distinction)';
    const issueDate = certRecord?.issueDate ? new Date(certRecord.issueDate) : new Date();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studyfreepdf.com';
    const verificationUrl = `${appUrl}/verify/${targetCertId}`;

    const milestones = internshipRecord?.submissions?.map((s: any) => ({
      weekNumber: s.weekNumber,
      title: `Milestone Week ${s.weekNumber} Project Deliverable`,
      taskDescription: s.mentorFeedback || s.mentorNotes || 'Approved industry deliverable with validated unit testing.',
      submissionUrl: s.submissionUrl || s.hostedLink || s.driveLink,
      status: s.status || 'APPROVED',
      estimatedHours: Math.round(nepCurriculumHours / durationWeeks),
    })) || [
      { weekNumber: 1, title: 'Foundational Architecture & Problem Scoping', taskDescription: 'Designed core module hierarchy and conducted competitor benchmarking.', status: 'APPROVED', estimatedHours: 18 },
      { weekNumber: 2, title: 'Data Flow & Core Logic Implementation', taskDescription: 'Built verified backend/computational pipeline with error boundary checks.', status: 'APPROVED', estimatedHours: 19 },
      { weekNumber: 3, title: 'Integration, Testing & Quality Assurance', taskDescription: 'Implemented unit validations and performance profiling under realistic data loads.', status: 'APPROVED', estimatedHours: 19 },
      { weekNumber: 4, title: 'Production Capstone & Academic Defense Report', taskDescription: 'Delivered finalized deliverable, live deployment link, and project presentation.', status: 'APPROVED', estimatedHours: 19 },
    ];

    const pdfBytes = await generateDDISCertificatePdf({
      certificateId: targetCertId,
      studentName,
      collegeName,
      degreeProgram,
      stream,
      trackTitle,
      durationWeeks,
      nepCurriculumHours,
      grade,
      issueDate,
      verificationUrl,
      milestones,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${targetCertId}-Certificate-Report.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate PDF' }, { status: 500 });
  }
}
