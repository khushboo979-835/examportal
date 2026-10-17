import { NextRequest, NextResponse } from 'next/server';
import { applyDynamicWatermark, createSamplePreviewPdf } from '@/lib/watermark';
import { fetchFileBuffer } from '@/lib/storage';
import prisma from '@/lib/prisma';
import { mockPDFProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'student@exampustak.in';
  const phone = searchParams.get('phone') || '+91-9876543210';
  const orderNum = searchParams.get('order') || 'ORD-2026-X9Y2';
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    let product: any = null;
    try {
      product = await prisma.pDFProduct.findUnique({
        where: { id: productId },
        include: {
          subject: {
            include: {
              boardOrExam: true,
            },
          },
        },
      });
    } catch {
      product = mockPDFProducts.find((p) => p.id === productId);
    }

    if (!product) {
      product = mockPDFProducts.find((p) => p.id === productId);
    }

    if (!product) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // 1. Try to fetch raw buffer from S3/R2 storage
    let rawPdfBuffer: Uint8Array | null = null;
    if (product.fileKey) {
      const s3Buf = await fetchFileBuffer(product.fileKey);
      if (s3Buf) rawPdfBuffer = new Uint8Array(s3Buf);
    }

    // If storage buffer isn't available (dev/mock), create full structured document dynamically
    if (!rawPdfBuffer) {
      const boardCode = product.subject?.boardOrExam?.code || 'BOARD';
      const subjectName = product.subject?.name || 'Academic Material';
      rawPdfBuffer = await createSamplePreviewPdf(
        product.title,
        boardCode,
        subjectName,
        product.medium
      );
    }

    // 2. Apply on-the-fly Dynamic Anti-Piracy Watermarking with Student Credentials
    const watermarkedPdf = await applyDynamicWatermark(rawPdfBuffer, {
      studentEmail: email,
      studentPhone: phone,
      orderNumber: orderNum,
      watermarkText: `EXAMPUSTAK.IN  •  ${phone}`,
    });

    // 3. Log download in database asynchronously
    try {
      await prisma.downloadLog.create({
        data: {
          userId: 'user-demo-1',
          pdfProductId: product.id,
          ipAddress: ip,
          userAgent: request.headers.get('user-agent'),
          watermarkTag: `${phone} | ${email}`,
        },
      });

      await prisma.pDFProduct.update({
        where: { id: product.id },
        data: { totalDownloads: { increment: 1 } },
      });
    } catch {
      // In-memory or offline fallback
      product.totalDownloads = (product.totalDownloads || 0) + 1;
    }

    // Return the watermarked PDF stream
    return new NextResponse(Buffer.from(watermarkedPdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${product.slug}-watermarked.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Download streaming error:', error);
    return NextResponse.json({ error: 'Failed to stream PDF' }, { status: 500 });
  }
}
