import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { StudentInternship } from '@/models/StudentInternship';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(auth.userId)
      .populate('purchasedPDFs')
      .lean();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    const orders = await Order.find({ userId: user._id })
      .populate('pdfProductId')
      .sort({ createdAt: -1 })
      .lean();

    const internships = await StudentInternship.find({ userId: user._id })
      .populate('trackId')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        purchasedPDFs: user.purchasedPDFs || [],
        bookmarks: user.bookmarks || [],
        lastRead: user.lastRead || [],
      },
      orders: JSON.parse(JSON.stringify(orders)),
      internships: JSON.parse(JSON.stringify(internships)),
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}
