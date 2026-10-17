import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import prisma from '@/lib/prisma';
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
      products = await prisma.pDFProduct.findMany({
        where: { id: { in: productIds } },
      });
    } catch {
      products = mockPDFProducts.filter((p) => productIds.includes(p.id));
    }

    if (!products || products.length === 0) {
      products = mockPDFProducts.filter((p) => productIds.includes(p.id));
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
      // Find or create user
      let user = await prisma.user.findFirst({
        where: { email: customerEmail || 'guest@exampustak.in' },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: customerName || 'Exam Aspirant',
            email: customerEmail || `student_${Date.now()}@exampustak.in`,
            phone: customerPhone,
            role: 'USER',
          },
        });
      }

      await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount,
          paymentStatus: 'PENDING',
          gatewayOrderId: razorpayOrder.id,
          customerName: customerName || user.name,
          customerEmail: customerEmail || user.email,
          customerPhone: customerPhone || user.phone,
          orderItems: {
            create: products.map((p) => ({
              pdfProductId: p.id,
              price: p.discountedPrice ?? p.price,
            })),
          },
        },
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
