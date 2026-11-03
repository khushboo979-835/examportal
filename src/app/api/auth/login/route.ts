import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { createAuthToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, name } = body; // identifier can be Student ID, phone or email

    if (!identifier) {
      return NextResponse.json(
        { error: 'Student ID, phone number or email is required to sign in' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanUpper = identifier.trim().toUpperCase();
    await connectToDatabase();

    let user = await User.findOne({
      $or: [
        { studentId: cleanUpper },
        { phone: cleanIdentifier },
        { email: cleanIdentifier },
        { phone: `+91-${cleanIdentifier.replace(/^(\+91|0)/, '')}` },
        { phone: cleanIdentifier.replace(/^(\+91-|\+91|0)/, '') },
      ],
    });

    // Auto-create student account if first time logging in with phone
    if (!user) {
      const isEmail = cleanIdentifier.includes('@');
      const newStudentId = `STU-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      user = await User.create({
        name: name?.trim() || 'Student Aspirant',
        phone: isEmail ? `+91-${Date.now().toString().slice(-10)}` : cleanIdentifier,
        email: isEmail ? cleanIdentifier : `student_${Date.now()}@studyfreepdf.com`,
        studentId: newStudentId,
        role: 'STUDENT',
      });
    } else if (!user.studentId) {
      user.studentId = `STU-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await user.save();
    }

    const token = createAuthToken(user);
    const res = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        college: user.collegeName,
        role: user.role,
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
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
