import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedDownloadUrl } from '@/lib/storage';
import { rateLimit } from '@/lib/rate-limiter';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { mockPDFProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const limitCheck = rateLimit(`download_pre_${ip}`, { limit: 20, windowMs: 60000 });
    if (!limitCheck.success) {
      return NextResponse.json({ error: 'Download request limit exceeded. Try again in 1 minute.' }, { status: 429 });
    }

    const body = await request.json();
    const { productId, userEmail, userPhone } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // Verify product exists
    let product: any = null;
    try {
      await connectToDatabase();
      product = await PDFProduct.findOne({
        $or: [{ _id: productId }, { slug: productId }],
      }).lean();
    } catch {
      product = mockPDFProducts.find((p) => p.id === productId || p.slug === productId);
    }

    if (!product) {
      product = mockPDFProducts.find((p) => p.id === productId || p.slug === productId);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Dynamic watermarked download endpoint
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const pId = product._id || product.id || productId;
    const downloadUrl = `${appUrl}/api/pdf/download/${pId}?email=${encodeURIComponent(userEmail || '')}&phone=${encodeURIComponent(userPhone || '')}&token=secure_${Date.now()}`;

    // Also generate S3/R2 direct signed URL
    const s3SignedUrl = await generatePresignedDownloadUrl({
      fileKey: product.fileKey,
      fileName: `${product.slug}.pdf`,
      expiresInSeconds: 600, // 10 minutes expiry
    });

    return NextResponse.json({
      success: true,
      downloadUrl, // Watermarked secure streaming endpoint
      directS3SignedUrl: s3SignedUrl,
      expiresIn: 600,
      title: product.title,
      fileName: `${product.slug}.pdf`,
    });
  } catch (error) {
    console.error('Download presign error:', error);
    return NextResponse.json({ error: 'Failed to generate download token' }, { status: 500 });
  }
}
