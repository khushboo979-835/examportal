import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { mockPDFProducts, mockOrders } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, customerName, customerEmail, customerPhone } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No items in purchase request' }, { status: 400 });
    }

    // Lookup products
    let products: any[] = [];
    try {
      await connectToDatabase();
      const dbProducts = await PDFProduct.find({
        $or: [{ _id: { $in: productIds } }, { slug: { $in: productIds } }],
      }).lean();

      if (dbProducts && dbProducts.length > 0) {
        products = JSON.parse(JSON.stringify(dbProducts)).map((p: any) => ({
          ...p,
          id: p._id,
        }));
      }
    } catch {
      products = mockPDFProducts.filter((p) => productIds.includes(p.id) || productIds.includes(p.slug));
    }

    if (!products || products.length === 0) {
      products = mockPDFProducts.filter((p) => productIds.includes(p.id) || productIds.includes(p.slug));
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'Requested materials not found' }, { status: 404 });
    }

    // Calculate total price
    const totalAmount = products.reduce((sum, p) => sum + (p.discountedPrice ?? p.price), 0);
    const orderNumber = `ORD-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amountInINR: totalAmount,
      orderNumber,
      notes: {
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        itemCount: String(products.length),
      },
    });

    // Save Order in Database or mock store
    try {
      await connectToDatabase();
      const userPhone = customerPhone || `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`;
      let user = await User.findOne({
        $or: [{ phone: userPhone }, { email: customerEmail || 'guest@exampustak.in' }],
      });

      if (!user) {
        user = await User.create({
          name: customerName || 'Exam Aspirant',
          phone: userPhone,
          email: customerEmail || `student_${Date.now()}@exampustak.in`,
          role: 'STUDENT',
        });
      }

      await Order.create({
        orderNumber,
        userId: user._id,
        orderType: 'SINGLE_PDF',
        pdfProductId: products[0]?.id || products[0]?._id,
        amount: totalAmount,
        status: 'PENDING',
        razorpayOrderId: razorpayOrder.id,
        customerName: customerName || user.name,
        customerEmail: customerEmail || user.email,
        customerPhone: customerPhone || user.phone,
      });
    } catch (dbErr) {
      console.warn('Database order record creation note (memory fallback):', dbErr);
      // In-memory fallback
      mockOrders.unshift({
        id: `ord_${Date.now()}`,
        orderNumber,
        userId: 'user-demo-1',
        totalAmount,
        paymentStatus: 'PENDING',
        gatewayOrderId: razorpayOrder.id,
        customerName: customerName || 'Student',
        customerEmail: customerEmail || 'student@exampustak.in',
        customerPhone: customerPhone || '+91-9876543210',
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: products.map((p) => ({
          id: `item_${Math.random()}`,
          orderId: orderNumber,
          pdfProductId: p.id,
          price: p.discountedPrice ?? p.price,
          createdAt: new Date(),
          pdfProduct: p,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_ExamPustak2026',
      products: products.map((p) => ({ id: p.id, title: p.title, price: p.discountedPrice ?? p.price })),
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
