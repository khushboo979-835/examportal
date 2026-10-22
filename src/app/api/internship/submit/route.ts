import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { StudentInternship } from '@/models/StudentInternship';
import { InternshipTrack } from '@/models/InternshipTrack';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { internshipId, weekNumber, submissionUrl, hostedLink, driveLink } = body;

    const primaryUrl = submissionUrl || hostedLink || driveLink;

    if (!internshipId || !weekNumber || !primaryUrl) {
      return NextResponse.json(
        { error: 'Internship ID, week number, and a project artifact URL are required' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(primaryUrl);
    } catch {
      return NextResponse.json(
        { error: 'Please provide a valid web URL (e.g. https://github.com/... or https://drive.google.com/...)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const internship = await StudentInternship.findById(internshipId).populate('trackId');
    if (!internship) {
      return NextResponse.json({ error: 'Internship record not found' }, { status: 404 });
    }

    const weekNum = Number(weekNumber);
    const existingIndex = internship.submissions.findIndex((s) => s.weekNumber === weekNum);

    if (existingIndex >= 0) {
      // Update existing submission
      internship.submissions[existingIndex].submissionUrl = primaryUrl.trim();
      if (hostedLink) internship.submissions[existingIndex].hostedLink = hostedLink.trim();
      if (driveLink) internship.submissions[existingIndex].driveLink = driveLink.trim();
      internship.submissions[existingIndex].submittedAt = new Date();
      internship.submissions[existingIndex].status = 'SUBMITTED';
      internship.submissions[existingIndex].mentorFeedback = 'Submission received. Mentor review in progress.';
    } else {
      // Add new submission
      internship.submissions.push({
        weekNumber: weekNum,
        submissionUrl: primaryUrl.trim(),
        hostedLink: hostedLink ? hostedLink.trim() : undefined,
        driveLink: driveLink ? driveLink.trim() : undefined,
        submittedAt: new Date(),
        status: 'SUBMITTED',
        mentorFeedback: 'Submission received. Mentor review in progress.',
      });
    }

    internship.status = 'REVIEW_PENDING';
    await internship.save();

    return NextResponse.json({
      success: true,
      message: `Week ${weekNum} task submitted successfully for mentor evaluation!`,
      submissions: internship.submissions,
      status: internship.status,
    });
  } catch (error) {
    console.error('Task submission error:', error);
    return NextResponse.json({ error: 'Failed to submit milestone task' }, { status: 500 });
  }
}
