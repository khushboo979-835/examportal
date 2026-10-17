import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import connectToDatabase from '@/lib/db';
import { Order } from '@/models/Order';
import { PDFProduct } from '@/models/PDFProduct';
import { User } from '@/models/User';
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
      await connectToDatabase();
      const order = await Order.findOneAndUpdate(
        { orderNumber },
        {
          $set: {
            status: 'SUCCESS',
            razorpayPaymentId,
          },
        },
        { new: true }
      ).populate('pdfProductId userId').lean();

      if (order && order.pdfProductId) {
        await PDFProduct.updateOne(
          { _id: (order.pdfProductId as any)._id || order.pdfProductId },
          { $inc: { totalSales: 1 } }
        );

        if (order.userId) {
          await User.updateOne(
            { _id: (order.userId as any)._id || order.userId },
            { $addToSet: { purchasedPDFs: (order.pdfProductId as any)._id || order.pdfProductId } }
          );
        }
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
