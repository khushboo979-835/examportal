import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mockPDFProducts, getHydratedProducts } from '@/lib/mock-db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let products: any[] = [];
    try {
      products = await prisma.pDFProduct.findMany({
        include: {
          subject: {
            include: {
              boardOrExam: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      products = getHydratedProducts();
    }

    if (!products || products.length === 0) {
      products = getHydratedProducts();
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      discountedPrice,
      fileKey,
      previewKey,
      pageCount,
      fileSize,
      medium,
      materialType,
      tags,
      authorName,
      subjectId,
      highlights,
      tableOfContents,
    } = body;

    if (!title || !price || !fileKey) {
      return NextResponse.json({ error: 'Title, price, and PDF fileKey are required' }, { status: 400 });
    }

    const generatedSlug = `${slugify(title)}-${Date.now().toString(36)}`;

    const newProduct = {
      id: `pdf-custom-${Date.now()}`,
      title,
      slug: generatedSlug,
      description: description || 'Comprehensive exam preparation study material.',
      highlights: highlights || ['Comprehensive chapter notes', 'VVI exam questions solved'],
      tableOfContents: tableOfContents || ['Chapter 1 Overview', 'Chapter 2 Key Concepts'],
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      fileKey,
      previewKey: previewKey || null,
      previewUrl: `/api/preview/${generatedSlug}`,
      pageCount: Number(pageCount || 45),
      fileSize: Number(fileSize || 10485760),
      fileFormat: 'PDF',
      medium: medium || 'BILINGUAL',
      materialType: materialType || 'NOTES',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      authorName: authorName || 'Verified Educator',
      subjectId: subjectId || 'sub-bpsc-bihar',
      isPublished: true,
      isFeatured: false,
      rating: 5.0,
      reviewCount: 0,
      totalDownloads: 0,
      totalSales: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await prisma.pDFProduct.create({
        data: {
          title: newProduct.title,
          slug: newProduct.slug,
          description: newProduct.description,
          highlights: newProduct.highlights,
          tableOfContents: newProduct.tableOfContents,
          price: newProduct.price,
          discountedPrice: newProduct.discountedPrice,
          fileKey: newProduct.fileKey,
          previewKey: newProduct.previewKey,
          previewUrl: newProduct.previewUrl,
          pageCount: newProduct.pageCount,
          fileSize: newProduct.fileSize,
          medium: newProduct.medium as any,
          materialType: newProduct.materialType as any,
          tags: newProduct.tags,
          authorName: newProduct.authorName,
          subjectId: newProduct.subjectId,
          isPublished: true,
        },
      });
      return NextResponse.json({ success: true, product: created });
    } catch {
      // Memory store fallback
      mockPDFProducts.unshift(newProduct as any);
      return NextResponse.json({ success: true, product: newProduct });
    }
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isPublished, price, discountedPrice } = body;

    if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

    try {
      const updated = await prisma.pDFProduct.update({
        where: { id },
        data: {
          ...(isPublished !== undefined ? { isPublished } : {}),
          ...(price !== undefined ? { price: Number(price) } : {}),
          ...(discountedPrice !== undefined ? { discountedPrice: Number(discountedPrice) } : {}),
        },
      });
      return NextResponse.json({ success: true, product: updated });
    } catch {
      const p = mockPDFProducts.find((item) => item.id === id);
      if (p) {
        if (isPublished !== undefined) p.isPublished = isPublished;
        if (price !== undefined) p.price = Number(price);
        if (discountedPrice !== undefined) p.discountedPrice = Number(discountedPrice);
      }
      return NextResponse.json({ success: true, product: p });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
