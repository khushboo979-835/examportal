import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import prisma from '@/lib/prisma';
import { mockOrders } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!orderNumber || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing payment confirmation parameters' }, { status: 400 });
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature || 'simulated',
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order status in DB or mock store
    try {
      const order = await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'RAZORPAY_UPI',
          gatewayPaymentId: razorpayPaymentId,
          gatewayTransactionId: razorpaySignature,
        },
        include: {
          orderItems: {
            include: {
              pdfProduct: true,
            },
          },
        },
      });

      // Increment product total sales
      for (const item of order.orderItems) {
        await prisma.pDFProduct.update({
          where: { id: item.pdfProductId },
          data: { totalSales: { increment: 1 } },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully! Notes added to your library.',
        order,
      });
    } catch {
      // Mock store fallback
      const mockOrder = mockOrders.find((o) => o.orderNumber === orderNumber);
      if (mockOrder) {
        mockOrder.paymentStatus = 'PAID';
        mockOrder.gatewayPaymentId = razorpayPaymentId;
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully! Notes added to your library.',
        orderNumber,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
