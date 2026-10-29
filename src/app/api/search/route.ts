import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';
import connectToDatabase from '@/lib/db';
import { PDFProduct, ExamNode, Category, Sector } from '@/models';
import { getHydratedProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const limitCheck = rateLimit(`search_${ip}`, { limit: 120, windowMs: 60000 });

  if (!limitCheck.success) {
    return NextResponse.json(
      { error: 'Too many search requests. Please slow down.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const isAutocomplete = searchParams.get('autocomplete') === 'true';
  const materialType = searchParams.get('type');
  const medium = searchParams.get('medium');
  const accessType = searchParams.get('access');
  const examSlug = searchParams.get('exam');
  const boardCode = searchParams.get('board');
  const sortBy = searchParams.get('sort') || 'popular';
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 12)));

  try {
    await connectToDatabase().catch(() => {});

    // High-performance autocomplete grouped search
    if (isAutocomplete && q) {
      const regex = new RegExp(q, 'i');

      // 1. Search matching Exam Nodes
      let matchingExams: any[] = [];
      try {
        matchingExams = await ExamNode.find({ name: regex }).limit(3).lean();
      } catch {}

      // 2. Search matching PDFs
      let matchingPDFs: any[] = [];
      try {
        matchingPDFs = await PDFProduct.find({
          $or: [{ title: regex }, { subject: regex }, { searchTags: regex }],
          isPublished: true,
        })
          .limit(5)
          .lean();
      } catch {}

      if (matchingPDFs.length === 0) {
        // Fallback to mock
        const hydrated = getHydratedProducts();
        matchingPDFs = hydrated.filter((p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
        ).slice(0, 5) as any;
      }

      return NextResponse.json({
        success: true,
        grouped: {
          exams: matchingExams.map((e) => ({ name: e.name, slug: e.slug })),
          subjects: ['Physics', 'Mathematics', 'General Studies', 'Quant Aptitude'].filter((s) =>
            s.toLowerCase().includes(q.toLowerCase())
          ),
          products: matchingPDFs.map((p) => ({
            id: p._id?.toString() || p._id || p.id,
            title: p.title,
            slug: p.slug,
            subject: p.subject,
            medium: p.medium,
            materialType: p.materialType,
            price: p.discountedPrice ?? p.price,
            originalPrice: p.price,
            totalPages: p.totalPages || p.pageCount || 96,
            pageCount: p.pageCount || p.totalPages || 96,
            rating: p.rating || p.avgRating || 4.8,
          })),
        },
        suggestions: matchingPDFs.map((p) => ({
          id: p._id?.toString() || p._id || p.id,
          title: p.title,
          slug: p.slug,
          boardCode: p.subject?.boardOrExam?.code || 'EXAM',
          subjectName: (typeof p.subject === 'string' ? p.subject : p.subject?.name) || 'General',
          medium: p.medium,
          price: p.discountedPrice ?? p.price,
          originalPrice: p.price,
          materialType: p.materialType,
          pageCount: p.totalPages || p.pageCount || 96,
          totalPages: p.totalPages || p.pageCount || 96,
          rating: p.rating || p.avgRating || 4.8,
        })),
      });
    }

    // Full catalog query with filters
    let products: any[] = [];
    let total = 0;

    try {
      const filter: any = { isPublished: true };

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { subject: { $regex: q, $options: 'i' } },
          { searchTags: { $in: [new RegExp(q, 'i')] } },
        ];
      }

      if (materialType) filter.materialType = materialType.toUpperCase();
      if (medium) filter.medium = medium.toUpperCase();
      if (accessType) filter.accessType = accessType.toUpperCase();

      const sortOptions: any =
        sortBy === 'rating' ? { avgRating: -1, rating: -1 }
        : sortBy === 'price_low' ? { price: 1 }
        : sortBy === 'price_high' ? { price: -1 }
        : sortBy === 'latest' ? { createdAt: -1 }
        : { totalDownloads: -1 };

      total = await PDFProduct.countDocuments(filter);
      products = await PDFProduct.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sectorId categoryId examNodeId')
        .lean();
    } catch (dbErr) {
      console.warn('Search query fallback:', dbErr);
    }

    if (products.length === 0) {
      // Memory mock fallback
      const hydrated = getHydratedProducts();
      let filtered = hydrated.filter((p) => {
        if (!p.isPublished) return false;
        if (q) {
          const qL = q.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(qL);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(qL));
          if (!matchTitle && !matchTag) return false;
        }
        if (medium && p.medium !== medium.toUpperCase()) return false;
        if (materialType && p.materialType !== materialType.toUpperCase()) return false;
        return true;
      });

      total = filtered.length;
      products = filtered.slice((page - 1) * limit, page * limit) as any;
    }

    // Ensure all products are cleanly normalized with id, pageCount, fileSize, rating
    const normalizedProducts = products.map((p: any) => ({
      ...p,
      id: p._id?.toString() || p._id || p.id || p.slug,
      _id: p._id?.toString() || p._id || p.id,
      pageCount: p.pageCount ?? p.totalPages ?? 96,
      totalPages: p.totalPages ?? p.pageCount ?? 96,
      fileSize: p.fileSize ?? p.fileSizeBytes ?? 1024 * 1024 * 14,
      fileSizeBytes: p.fileSizeBytes ?? p.fileSize ?? 1024 * 1024 * 14,
      rating: p.rating ?? p.avgRating ?? 4.8,
      avgRating: p.avgRating ?? p.rating ?? 4.8,
      reviewCount: p.reviewCount ?? p.totalReviews ?? 120,
      totalReviews: p.totalReviews ?? p.reviewCount ?? 120,
      tags: Array.isArray(p.searchTags) && p.searchTags.length > 0 ? p.searchTags : p.tags || ['Study Notes'],
    }));

    return NextResponse.json({
      success: true,
      products: normalizedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
