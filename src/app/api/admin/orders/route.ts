import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';
import { mockOrders } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  try {
    let orders: any[] = [];
    try {
      await connectToDatabase();
      const dbOrders = await Order.find()
        .populate('pdfProductId')
        .populate('userId')
        .sort({ createdAt: -1 })
        .lean();
      if (dbOrders && dbOrders.length > 0) {
        orders = JSON.parse(JSON.stringify(dbOrders)).map((o: any) => ({
          ...o,
          id: o._id,
          totalAmount: o.amount ?? o.totalAmount ?? 0,
          paymentStatus: o.status === 'SUCCESS' ? 'PAID' : o.status ?? 'PENDING',
          gatewayOrderId: o.razorpayOrderId ?? o.gatewayOrderId ?? 'N/A',
        }));
      }
    } catch {
      orders = mockOrders;
    }

    if (!orders || orders.length === 0) {
      orders = mockOrders;
    }

    // Export to CSV if requested
    if (format === 'csv') {
      const header = 'Order Number,Customer Name,Customer Email,Customer Phone,Amount (INR),Payment Status,Gateway Order ID,Date\n';
      const rows = orders.map((o) => {
        const name = `"${(o.customerName || 'Student').replace(/"/g, '""')}"`;
        const email = `"${(o.customerEmail || '').replace(/"/g, '""')}"`;
        const phone = `"${(o.customerPhone || '').replace(/"/g, '""')}"`;
        const date = new Date(o.createdAt).toISOString();
        return `${o.orderNumber},${name},${email},${phone},${o.totalAmount},${o.paymentStatus},${o.gatewayOrderId || 'N/A'},${date}`;
      }).join('\n');

      return new NextResponse(header + rows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="exampustak_orders_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
