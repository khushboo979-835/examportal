import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { createAuthToken } from '@/lib/auth';

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

    await connectToDatabase();

    // Check if phone or email already registered
    const existing = await User.findOne({
      $or: [
        { phone: cleanPhone },
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
      ],
    });

    if (existing) {
      // User already exists, generate token and return login
      const token = createAuthToken(existing);
      const res = NextResponse.json({
        success: true,
        message: 'Account already exists. Logged in successfully!',
        user: {
          id: existing._id,
          name: existing.name,
          phone: existing.phone,
          email: existing.email,
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

    // Create new student
    const newUser = await User.create({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || `student_${Date.now()}@studyfreepdf.com`,
      role: 'STUDENT',
    });

    const token = createAuthToken(newUser);
    const res = NextResponse.json({
      success: true,
      message: 'Student account registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
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
