import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { createAuthToken } from '@/lib/auth';
import { sendInquiryEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, college } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanName = name.trim();
    const cleanCollege = college ? college.trim() : '';

    await connectToDatabase();

    // Check if phone or email already registered
    const existing = await User.findOne({
      $or: [
        { phone: cleanPhone },
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
      ],
    });

    if (existing) {
      // Ensure student has a studentId
      if (!existing.studentId) {
        existing.studentId = `STU-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        if (cleanCollege && !existing.collegeName) existing.collegeName = cleanCollege;
        await existing.save();
      }

      const token = createAuthToken(existing);
      const res = NextResponse.json({
        success: true,
        message: 'Account already exists. Logged in successfully!',
        user: {
          id: existing._id,
          studentId: existing.studentId,
          name: existing.name,
          phone: existing.phone,
          email: existing.email,
          college: existing.collegeName,
          role: existing.role,
        },
        token,
      });

      res.cookies.set('studyfreepdf_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      return res;
    }

    // Generate unique official Student ID
    const generatedStudentId = `STU-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create new student
    const newUser = await User.create({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || `student_${Date.now()}@studyfreepdf.com`,
      studentId: generatedStudentId,
      collegeName: cleanCollege,
      role: 'STUDENT',
    });

    // Alert company official mail (studyfreepdf2@gmail.com)
    try {
      await sendInquiryEmail({
        type: 'GENERAL',
        studentName: newUser.name,
        studentPhone: newUser.phone,
        studentEmail: newUser.email,
        subject: `New Student Registration: ${newUser.name} (${generatedStudentId})`,
        message: `A new student has registered on StudyFreePDF.\nStudent ID: ${generatedStudentId}\nName: ${newUser.name}\nPhone: ${newUser.phone}\nEmail: ${newUser.email}\nCollege: ${cleanCollege || 'Not specified'}`,
        ticketId: generatedStudentId,
        metadata: {
          studentId: generatedStudentId,
          collegeName: cleanCollege || 'Not specified',
          registrationDate: new Date().toLocaleDateString('en-IN'),
        },
      });
    } catch (mailErr) {
      console.warn('Registration mail notification notice:', mailErr);
    }

    const token = createAuthToken(newUser);
    const res = NextResponse.json({
      success: true,
      message: 'Student account registered successfully! Your Student ID has been generated.',
      user: {
        id: newUser._id,
        studentId: generatedStudentId,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        college: cleanCollege,
        role: newUser.role,
      },
      token,
    }, { status: 201 });

    res.cookies.set('studyfreepdf_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return res;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
