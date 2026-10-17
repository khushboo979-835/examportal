import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { ExamNode } from '@/models/ExamNode';
import { Category } from '@/models/Category';
import { Sector } from '@/models/Sector';
import { mockPDFProducts, getHydratedProducts } from '@/lib/mock-db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let products: any[] = [];
    try {
      await connectToDatabase();
      const dbProducts = await PDFProduct.find()
        .populate('examNodeId categoryId sectorId subjectId')
        .sort({ createdAt: -1 })
        .lean();

      if (dbProducts && dbProducts.length > 0) {
        products = JSON.parse(JSON.stringify(dbProducts)).map((p: any) => ({
          ...p,
          id: p._id,
          pageCount: p.totalPages || p.pageCount || 40,
          fileSize: p.fileSizeBytes || p.fileSize || 5000000,
          rating: p.avgRating || p.rating || 4.8,
          reviewCount: p.totalReviews || p.reviewCount || 0,
          tags: p.searchTags || p.tags || [],
        }));
      } else {
        products = getHydratedProducts();
      }
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
    const parsedTags = Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);

    try {
      await connectToDatabase();
      // Ensure we have fallback sector and category if creating new
      let defaultExam = await ExamNode.findOne();
      let defaultCat = await Category.findOne();
      let defaultSector = await Sector.findOne();

      const created = await PDFProduct.create({
        title,
        slug: generatedSlug,
        sectorId: defaultSector?._id || defaultCat?.sectorId,
        categoryId: defaultCat?._id,
        examNodeId: defaultExam?._id,
        subject: title,
        materialType: materialType || 'NOTES',
        medium: medium || 'BILINGUAL',
        accessType: Number(price) === 0 ? 'FREE' : 'PREMIUM',
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
        fileKey,
        previewKey: previewKey || fileKey,
        totalPages: Number(pageCount || 45),
        fileSizeBytes: Number(fileSize || 10485760),
        searchTags: parsedTags,
        isPublished: true,
      });

      return NextResponse.json({ 
        success: true, 
        product: {
          ...created.toObject(),
          id: created._id,
          pageCount: created.totalPages,
          fileSize: created.fileSizeBytes,
        } 
      });
    } catch (dbErr) {
      console.warn('DB creation fallback to memory:', dbErr);
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
        tags: parsedTags,
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
      await connectToDatabase();
      const updateData: any = {};
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (price !== undefined) updateData.price = Number(price);
      if (discountedPrice !== undefined) updateData.discountedPrice = Number(discountedPrice);

      const updated = await PDFProduct.findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }] },
        { $set: updateData },
        { new: true }
      ).lean();

      if (updated) {
        return NextResponse.json({ 
          success: true, 
          product: {
            ...updated,
            id: (updated as any)._id,
          } 
        });
      }
    } catch {}

    const p = mockPDFProducts.find((item) => item.id === id || item.slug === id);
    if (p) {
      if (isPublished !== undefined) p.isPublished = isPublished;
      if (price !== undefined) p.price = Number(price);
      if (discountedPrice !== undefined) p.discountedPrice = Number(discountedPrice);
    }
    return NextResponse.json({ success: true, product: p });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
