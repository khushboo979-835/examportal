import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';
import { InternshipTrack } from '@/models/InternshipTrack';
import { generateDDISCertificatePdf } from '@/lib/ddisCertificateGenerator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('certificateId') || searchParams.get('id');
    const internshipId = searchParams.get('internshipId');

    await connectToDatabase();

    let certRecord: any = null;
    let internshipRecord: any = null;

    if (certificateId) {
      certRecord = await DDISCertificate.findOne({ certificateId }).lean();
      if (certRecord && certRecord.internshipId) {
        internshipRecord = await StudentInternship.findById(certRecord.internshipId).populate('trackId').lean();
      }
    } else if (internshipId) {
      internshipRecord = await StudentInternship.findById(internshipId).populate('trackId').lean();
      if (internshipRecord && internshipRecord.certificateId) {
        certRecord = await DDISCertificate.findOne({ certificateId: internshipRecord.certificateId }).lean();
      }
    }

    // Default fallback demo certificate if ID not in DB yet
    const targetCertId = certificateId || internshipRecord?.certificateId || 'DDIS-NEP-IT-2026-9482';
    const studentName = certRecord?.studentName || internshipRecord?.studentName || 'Aditya Verma';
    const collegeName = certRecord?.collegeName || internshipRecord?.collegeName || 'Patna Science College, Patna University';
    const degreeProgram = certRecord?.degreeProgram || internshipRecord?.degreeProgram || 'Bachelor of Computer Applications (BCA)';
    const stream = certRecord?.stream || 'BCA / Computer Applications & IT';
    const trackTitle = certRecord?.trackTitle || internshipRecord?.trackId?.title || 'Full-Stack Web Engineering (Next.js, TypeScript & MongoDB)';
    const durationWeeks = certRecord?.durationWeeks || internshipRecord?.trackId?.durationWeeks || 4;
    const nepCurriculumHours = certRecord?.nepCurriculumHours || internshipRecord?.trackId?.nepCurriculumHours || 75;
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
      estimatedHours: 19,
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
