import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let inquiries: any[] = [];
    try {
      await connectToDatabase();
      const query: any = {};
      if (status && status !== 'ALL') {
        query.status = status;
      }
      inquiries = await Inquiry.find(query).sort({ createdAt: -1 }).limit(100).lean();
    } catch (dbErr) {
      console.warn('MongoDB inquiry lookup note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      inquiries: JSON.parse(JSON.stringify(inquiries)),
      count: inquiries.length,
    });
  } catch (error: any) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { inquiryId, status } = body;

    if (!inquiryId || !status) {
      return NextResponse.json({ error: 'Inquiry ID and new status are required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { $set: { status } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      inquiry: updated,
    });
  } catch (error: any) {
    console.error('Update inquiry error:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
