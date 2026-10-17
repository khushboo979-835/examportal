import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import connectToDatabase from '@/lib/db';
import { PDFProduct, User, Order, DownloadLog } from '@/models';
import { fetchFileBuffer } from '@/lib/storage';
import { createMasterProductPdf } from '@/lib/watermark';
import { mockPDFProducts, getHydratedProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userPhone = searchParams.get('phone') || '+91-9876543210';
  const userEmail = searchParams.get('email') || 'student@exampass.in';
  const orderId = searchParams.get('order') || `PASS-${Date.now().toString(36).toUpperCase()}`;

  try {
    await connectToDatabase().catch(() => {});

    let product: any = null;
    try {
      product = await PDFProduct.findOne({
        $or: [{ _id: id }, { slug: id }],
      }).populate('sectorId categoryId examNodeId');
    } catch {
      // Fallback
    }

    if (!product) {
      const allHydrated = getHydratedProducts();
      product = allHydrated.find(
        (p) =>
          p.id === id ||
          p.slug === id ||
          (p as any)._id === id ||
          p.slug.includes(id) ||
          id.includes(p.slug)
      );
    }

    if (!product) {
      return NextResponse.json({ error: 'Requested study material not found' }, { status: 404 });
    }

    // 1. Fetch raw PDF buffer from private storage or generate high-yield master copy
    let rawPdfBuffer: Uint8Array | null = null;
    if (product.fileKey) {
      const s3Buf = await fetchFileBuffer(product.fileKey);
      if (s3Buf) rawPdfBuffer = new Uint8Array(s3Buf);
    }

    if (!rawPdfBuffer) {
      const boardCode = product.categoryId?.shortCode || product.subject?.boardOrExam?.code || 'EXAM-VAULT';
      rawPdfBuffer = await createMasterProductPdf(
        product.title,
        boardCode,
        product.subject || 'Comprehensive Exam Notes',
        product.medium || 'HINDI',
        product.totalPages || 6
      );
    }

    // 2. Apply Dynamic Anti-Piracy Watermarking on every single page
    const pdfDoc = await PDFDocument.load(rawPdfBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const totalPages = pdfDoc.getPageCount();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const watermarkTrackingStamp = `Licensed to: ${userPhone} (${userEmail}) | Order ID: ${orderId} | Timestamp: ${timestamp}`;
    const diagonalCenterStamp = `EXAMPASS.IN  •  ${userPhone}`;

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      // Top Security Tracking Stamp
      page.drawText(watermarkTrackingStamp, {
        x: 20,
        y: height - 16,
        size: 7.5,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.85,
      });

      // Bottom Anti-Piracy Legal Notice
      const legalFooter = `Page ${i + 1} of ${totalPages} • Personal Student License • IT Act 2000 Protected • Redistribution or Resale is strictly punishable`;
      page.drawText(legalFooter, {
        x: 20,
        y: 12,
        size: 7,
        font: helveticaFont,
        color: rgb(0.7, 0.15, 0.15),
        opacity: 0.85,
      });

      // Diagonal Center Semi-Transparent Watermark
      page.drawText(diagonalCenterStamp, {
        x: width / 4.5,
        y: height / 3,
        size: 30,
        font: helveticaBold,
        color: rgb(0.0, 0.64, 0.54), // Testbook teal
        opacity: 0.22,
        rotate: degrees(45),
      });
    }

    const watermarkedPdfBytes = await pdfDoc.save();

    // 3. Store Download Log in MongoDB Database
    try {
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Browser';

      await DownloadLog.create({
        userPhone,
        userEmail,
        pdfProductId: product._id || null,
        pdfTitle: product.title,
        pdfSlug: product.slug,
        orderId,
        ipAddress: clientIp,
        userAgent,
        downloadedAt: new Date(),
      });

      // Increment product total downloads
      if (product._id) {
        await PDFProduct.findByIdAndUpdate(product._id, { $inc: { totalDownloads: 1 } });
      }
    } catch (dbErr) {
      console.warn('Could not record download log to MongoDB:', dbErr);
    }

    // 4. Return Direct Watermarked PDF Attachment Stream
    return new NextResponse(Buffer.from(watermarkedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${product.slug}-licensed.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Secure watermarking streaming error:', error);
    return NextResponse.json({ error: 'Failed to generate watermarked PDF' }, { status: 500 });
  }
}
