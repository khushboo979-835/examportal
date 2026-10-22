import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { StudentInternship } from '@/models/StudentInternship';
import { DDISCertificate } from '@/models/DDISCertificate';
import { InternshipTrack } from '@/models/InternshipTrack';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    await connectToDatabase();

    const query: any = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const internships = await StudentInternship.find(query)
      .populate('trackId userId')
      .sort({ updatedAt: -1 })
      .lean();

    const totalEnrolled = await StudentInternship.countDocuments();
    const reviewPending = await StudentInternship.countDocuments({ status: 'REVIEW_PENDING' });
    const completed = await StudentInternship.countDocuments({ status: 'COMPLETED' });
    const certificatesIssued = await DDISCertificate.countDocuments({ validityStatus: 'VALID' });

    return NextResponse.json({
      success: true,
      internships: JSON.parse(JSON.stringify(internships)),
      stats: {
        totalEnrolled,
        reviewPending,
        completed,
        certificatesIssued,
      },
    });
  } catch (error) {
    console.error('Admin internships error:', error);
    return NextResponse.json({ error: 'Failed to fetch internship records' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { internshipId, weekNumber, action, feedback } = body;

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const internship = await StudentInternship.findById(internshipId).populate('trackId');
    if (!internship) {
      return NextResponse.json({ error: 'Internship record not found' }, { status: 404 });
    }

    // 1. Action: Review single milestone task
    if (action === 'APPROVE_TASK' || action === 'REJECT_TASK') {
      const weekNum = Number(weekNumber);
      const sub = internship.submissions.find((s) => s.weekNumber === weekNum);
      if (sub) {
        sub.status = action === 'APPROVE_TASK' ? 'APPROVED' : 'REJECTED';
        if (feedback) sub.mentorFeedback = feedback;
      }

      // Check if all weeks are approved
      const totalWeeks = (internship.trackId as any)?.durationWeeks || 4;
      const approvedCount = internship.submissions.filter((s) => s.status === 'APPROVED').length;

      if (approvedCount >= totalWeeks) {
        internship.status = 'COMPLETED';
        internship.completedDate = new Date();

        // Auto issue certificate if not already issued
        if (!internship.certificateIssued) {
          const streamCode = ((internship.trackId as any)?.stream || 'IT').substring(0, 3).toUpperCase();
          const randomHash = Math.floor(1000 + Math.random() * 9000);
          const certId = `DDIS-NEP-2026-${streamCode}-${randomHash}`;

          internship.certificateIssued = true;
          internship.certificateId = certId;

          await DDISCertificate.findOneAndUpdate(
            { certificateId: certId },
            {
              $set: {
                certificateId: certId,
                userId: internship.userId,
                internshipId: internship._id,
                studentName: internship.studentName || 'Student Intern',
                collegeName: internship.collegeName,
                degreeProgram: internship.degreeProgram,
                stream: (internship.trackId as any)?.stream || 'IT',
                trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Internship',
                durationWeeks: totalWeeks,
                grade: 'A+ (Distinction)',
                issueDate: new Date(),
                validityStatus: 'VALID',
                verificationUrl: `https://studyfreepdf.com/verify/${certId}`,
                certificatePdfUrl: `/api/internship/generate-certificate?id=${certId}`,
                accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
              },
            },
            { upsert: true }
          );
        }
      } else {
        internship.status = 'IN_PROGRESS';
      }

      await internship.save();

      return NextResponse.json({
        success: true,
        message: `Week ${weekNum} task marked as ${action === 'APPROVE_TASK' ? 'APPROVED' : 'CHANGES REQUESTED'}.`,
        internship,
      });
    }

    // 2. Action: Force Issue Certificate directly
    if (action === 'ISSUE_CERTIFICATE') {
      const streamCode = ((internship.trackId as any)?.stream || 'IT').substring(0, 3).toUpperCase();
      const randomHash = Math.floor(1000 + Math.random() * 9000);
      const certId = internship.certificateId || `DDIS-NEP-2026-${streamCode}-${randomHash}`;

      internship.certificateIssued = true;
      internship.certificateId = certId;
      internship.status = 'COMPLETED';
      internship.completedDate = new Date();
      await internship.save();

      await DDISCertificate.findOneAndUpdate(
        { certificateId: certId },
        {
          $set: {
            certificateId: certId,
            userId: internship.userId,
            internshipId: internship._id,
            studentName: internship.studentName || 'Student Intern',
            collegeName: internship.collegeName,
            degreeProgram: internship.degreeProgram,
            stream: (internship.trackId as any)?.stream || 'IT',
            trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Internship',
            durationWeeks: (internship.trackId as any)?.durationWeeks || 4,
            grade: 'A+ (Distinction)',
            issueDate: new Date(),
            validityStatus: 'VALID',
            verificationUrl: `https://studyfreepdf.com/verify/${certId}`,
            certificatePdfUrl: `/api/internship/generate-certificate?id=${certId}`,
            accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
          },
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: `Official DDIS Certificate issued successfully! Certificate ID: ${certId}`,
        certificateId: certId,
      });
    }

    return NextResponse.json({ error: 'Unknown action specified' }, { status: 400 });
  } catch (error) {
    console.error('Admin update internship error:', error);
    return NextResponse.json({ error: 'Failed to update internship' }, { status: 500 });
  }
}
