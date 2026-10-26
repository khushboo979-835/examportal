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

      if (order) {
        if (order.pdfProductId) {
          const pId = (order.pdfProductId as any)._id || order.pdfProductId;
          try {
            await PDFProduct.updateOne(
              { _id: pId },
              { $inc: { totalSales: 1, totalDownloads: 1 } }
            );
          } catch {}

          if (order.userId) {
            const uId = (order.userId as any)._id || order.userId;
            try {
              await User.updateOne(
                { _id: uId },
                { $addToSet: { purchasedPDFs: pId } }
              );
            } catch {}
          }
        }

        // Grant 365-day All-Access Pass
        if (order.orderType === 'ALL_ACCESS_PASS' && order.userId) {
          const uId = (order.userId as any)._id || order.userId;
          const oneYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          try {
            await User.updateOne(
              { _id: uId },
              { $set: { passExpiresAt: oneYear } }
            );
          } catch {}
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
