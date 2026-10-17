import { NextRequest, NextResponse } from 'next/server';
import { createSamplePreviewPdf } from '@/lib/watermark';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { mockPDFProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  try {
    let product: any = null;
    try {
      await connectToDatabase();
      product = await PDFProduct.findOne({
        $or: [{ _id: productId }, { slug: productId }],
      }).populate('examNodeId categoryId').lean();
    } catch {
      product = mockPDFProducts.find((p) => p.id === productId || p.slug === productId);
    }

    if (!product) {
      product = mockPDFProducts.find((p) => p.id === productId || p.slug === productId);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const boardCode = product.examNodeId?.name || product.subject || 'BOARD';
    const subjectName = product.subject || 'Subject Notes';

    const previewPdfBytes = await createSamplePreviewPdf(
      product.title,
      boardCode,
      subjectName,
      product.medium
    );

    return new NextResponse(Buffer.from(previewPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${product.slug}-preview.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Preview PDF error:', error);
    return NextResponse.json({ error: 'Could not generate preview' }, { status: 500 });
  }
}
