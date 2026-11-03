import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';
import { sendInquiryEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const limitCheck = rateLimit(`contact_${ip}`, { limit: 10, windowMs: 60000 });
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a minute or WhatsApp us directly at +91 7544065425.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, email, subject, message, category = 'GENERAL_QUERY' } = body;

    if (!name || !message || (!phone && !email)) {
      return NextResponse.json(
        { error: 'Name, message, and at least one contact method (phone or email) are required.' },
        { status: 400 }
      );
    }

    const ticketId = `TKT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Dispatch email notification to studyfreepdf2@gmail.com
    await sendInquiryEmail({
      type: 'CONTACT_FORM',
      studentName: name.trim(),
      studentPhone: phone?.trim(),
      studentEmail: email?.trim(),
      subject: subject || `Student Inquiry (${category})`,
      message: message.trim(),
      ticketId,
      metadata: {
        category,
        ipAddress: ip,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      },
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Your inquiry has been submitted successfully! An alert has been forwarded to studyfreepdf2@gmail.com and our student support desk.',
      whatsappDirectUrl: `https://wa.me/917544065425?text=${encodeURIComponent(
        `Hi StudyFreePDF Support team, my ticket is ${ticketId}. I sent an inquiry: ${subject || message.substring(0, 50)}`
      )}`,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
