import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { createSamplePreviewPdf } from '@/lib/watermark';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { mockPDFProducts, getHydratedProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get('slug');

  try {
    let product: any = null;
    const cleanId = (productId || '').trim();

    // 1. Database Lookup (with safe ObjectId check)
    if (cleanId && cleanId !== 'undefined' && cleanId !== 'null') {
      try {
        await connectToDatabase();
        const isObjectId = mongoose.Types.ObjectId.isValid(cleanId);
        const orClauses: any[] = [{ slug: cleanId }];
        if (isObjectId) {
          orClauses.push({ _id: cleanId });
        }
        if (slugParam) {
          orClauses.push({ slug: slugParam });
        }

        product = await PDFProduct.findOne({ $or: orClauses })
          .populate('examNodeId categoryId')
          .lean();
      } catch (dbErr) {
        console.warn('DB preview query warning:', dbErr);
      }
    }

    // 2. Slug Param DB Lookup fallback
    if (!product && slugParam) {
      try {
        await connectToDatabase();
        product = await PDFProduct.findOne({ slug: slugParam })
          .populate('examNodeId categoryId')
          .lean();
      } catch {}
    }

    // 3. Fallback to memory catalog
    if (!product) {
      const allCatalog = getHydratedProducts();
      product = allCatalog.find(
        (p) =>
          p.id === cleanId ||
          p.slug === cleanId ||
          (p as any)._id === cleanId ||
          (slugParam && (p.slug === slugParam || p.id === slugParam))
      );
    }

    // 4. Fallback search by substring matching
    if (!product && cleanId && cleanId !== 'undefined') {
      const allCatalog = getHydratedProducts();
      product = allCatalog.find(
        (p) =>
          cleanId.includes(p.slug) ||
          p.slug.includes(cleanId) ||
          p.title.toLowerCase().includes(cleanId.toLowerCase())
      );
    }

    // 5. Ultimate guarantee fallback: default to first catalog note (never break iframe preview)
    if (!product) {
      const allCatalog = getHydratedProducts();
      product = allCatalog[0] || mockPDFProducts[0];
    }

    const boardCode =
      product.examNodeId?.name ||
      product.subject?.boardOrExam?.code ||
      product.subject ||
      'BIHAR EXAM PREP';
    const subjectName =
      (typeof product.subject === 'string' ? product.subject : product.subject?.name) ||
      'Exam Study Notes';

    const previewPdfBytes = await createSamplePreviewPdf(
      product.title,
      boardCode,
      subjectName,
      product.medium || 'BILINGUAL'
    );

    return new NextResponse(Buffer.from(previewPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${product.slug || 'studyfree'}-preview.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Preview PDF generation error:', error);
    // Never show raw JSON in the iframe - always return a valid watermarked sample PDF
    try {
      const fallbackBytes = await createSamplePreviewPdf(
        'StudyFree PDF Sample Preview',
        'VERIFIED PREPARATION',
        'Complete High-Yield Notes',
        'BILINGUAL'
      );
      return new NextResponse(Buffer.from(fallbackBytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="sample-preview.pdf"',
          'Cache-Control': 'no-cache',
        },
      });
    } catch {
      return NextResponse.json({ error: 'Could not generate preview' }, { status: 500 });
    }
  }
}
