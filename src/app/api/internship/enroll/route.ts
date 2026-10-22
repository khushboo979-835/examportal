import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { InternshipTrack } from '@/models/InternshipTrack';
import { StudentInternship } from '@/models/StudentInternship';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trackId,
      studentName,
      studentPhone,
      studentEmail,
      collegeName,
      rollNumber,
      degreeProgram,
    } = body;

    if (!trackId || !studentName || !studentPhone || !collegeName || !rollNumber || !degreeProgram) {
      return NextResponse.json(
        { error: 'All fields including College Name, Roll Number and Degree are required for NEP-2020 Accreditation.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const track = await InternshipTrack.findById(trackId);
    if (!track) {
      return NextResponse.json({ error: 'Selected internship track was not found' }, { status: 404 });
    }

    // Find or create User
    const normalizedPhone = studentPhone.trim().startsWith('+') ? studentPhone.trim() : `+91-${studentPhone.trim().replace(/^0+/, '')}`;
    let user = await User.findOne({
      $or: [{ phone: normalizedPhone }, { email: studentEmail?.trim()?.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        name: studentName.trim(),
        phone: normalizedPhone,
        email: studentEmail?.trim()?.toLowerCase() || `student_${Date.now()}@edupdf.in`,
        role: 'STUDENT',
      });
    }

    // Check if already enrolled in this track
    let existingInternship = await StudentInternship.findOne({
      userId: user._id,
      trackId: track._id,
    });

    if (existingInternship) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled! Redirecting to your task workspace.',
        internshipId: existingInternship._id,
        trackSlug: track.slug,
      });
    }

    // Create new enrollment
    const newInternship = await StudentInternship.create({
      userId: user._id,
      trackId: track._id,
      studentName: studentName.trim(),
      studentEmail: studentEmail?.trim()?.toLowerCase(),
      studentPhone: normalizedPhone,
      collegeName: collegeName.trim(),
      rollNumber: rollNumber.trim(),
      degreeProgram: degreeProgram.trim(),
      status: 'IN_PROGRESS',
      startDate: new Date(),
      submissions: [],
      certificateIssued: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Enrollment successful! Welcome to DDIS NEP-2020 Industry Internship.',
      internshipId: newInternship._id,
      trackSlug: track.slug,
    });
  } catch (error) {
    console.error('Internship enrollment error:', error);
    return NextResponse.json({ error: 'Failed to process enrollment request' }, { status: 500 });
  }
}
