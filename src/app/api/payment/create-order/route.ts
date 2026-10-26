import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { createRazorpayOrder } from '@/lib/razorpay';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { mockPDFProducts, mockOrders, getHydratedProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, customerName, customerEmail, customerPhone, orderType } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No items in purchase request' }, { status: 400 });
    }

    const isPass =
      orderType === 'ALL_ACCESS_PASS' ||
      productIds.some((id: string) => typeof id === 'string' && (id.includes('pass') || id.includes('annual')));

    // Lookup products safely without casting errors
    let products: any[] = [];
    try {
      await connectToDatabase();
      const validObjectIds = productIds.filter((id: string) => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id));
      const orClauses: any[] = [{ slug: { $in: productIds } }];
      if (validObjectIds.length > 0) {
        orClauses.push({ _id: { $in: validObjectIds } });
      }

      const dbProducts = await PDFProduct.find({ $or: orClauses }).lean();

      if (dbProducts && dbProducts.length > 0) {
        products = JSON.parse(JSON.stringify(dbProducts)).map((p: any) => ({
          ...p,
          id: p._id?.toString() || p._id,
        }));
      }
    } catch (dbLookupErr) {
      console.warn('Database product query fallback:', dbLookupErr);
    }

    // Fallback to hydrated memory catalog
    if (!products || products.length === 0) {
      const allCatalog = getHydratedProducts();
      products = allCatalog.filter((p) =>
        productIds.some((id: string) => p.id === id || p.slug === id || (p as any)._id === id)
      );
    }

    // If Annual Pass is in cart
    if (isPass && (!products || products.length === 0)) {
      products = [
        {
          id: 'pass-annual-all-access',
          title: 'Annual All-Access Exam Pass (365 Days)',
          slug: 'annual-all-access-pass',
          price: 499,
          discountedPrice: 199,
          pageCount: 5000,
          medium: 'BILINGUAL',
        },
      ];
    }

    // Safety fallback: ensure at least one note from catalog is returned if not matched
    if (!products || products.length === 0) {
      const allCatalog = getHydratedProducts();
      if (allCatalog.length > 0) {
        products = [allCatalog[0]];
      }
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'Requested materials not found' }, { status: 404 });
    }

    // Calculate total price
    const totalAmount = products.reduce((sum, p) => sum + (p.discountedPrice ?? p.price ?? 49), 0);
    const orderNumber = `ORD-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const resolvedOrderType = isPass ? 'ALL_ACCESS_PASS' : 'SINGLE_PDF';

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amountInINR: totalAmount,
      orderNumber,
      notes: {
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        itemCount: String(products.length),
        orderType: resolvedOrderType,
      },
    });

    // Save Order in Database or mock store
    try {
      await connectToDatabase();
      const userPhone = customerPhone || `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`;
      let user = await User.findOne({
        $or: [{ phone: userPhone }, { email: customerEmail || 'guest@studyfreepdf.com' }],
      });

      if (!user) {
        user = await User.create({
          name: customerName || 'Exam Aspirant',
          phone: userPhone,
          email: customerEmail || `student_${Date.now()}@studyfreepdf.com`,
          role: 'STUDENT',
        });
      }

      await Order.create({
        orderNumber,
        userId: user._id,
        orderType: resolvedOrderType,
        pdfProductId: mongoose.Types.ObjectId.isValid(products[0]?.id)
          ? products[0]?.id
          : mongoose.Types.ObjectId.isValid(products[0]?._id)
          ? products[0]?._id
          : undefined,
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
        customerEmail: customerEmail || 'studyfreepdf2@gmail.com',
        customerPhone: customerPhone || '+91 7544065425',
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
