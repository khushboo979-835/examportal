import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import { PDFProduct, ExamNode, Category, Sector, Subject } from '@/models';

export const dynamic = 'force-dynamic';

function isValidObjectId(val: string): boolean {
  return mongoose.Types.ObjectId.isValid(val) && String(new mongoose.Types.ObjectId(val)) === val;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    await connectToDatabase();

    const q = searchParams.get('q')?.trim() || '';
    const state = searchParams.get('state')?.trim() || '';
    const sectorParam = searchParams.get('sector')?.trim() || '';
    const categoryParam = searchParams.get('category')?.trim() || '';
    const examNodeParam = searchParams.get('examNode')?.trim() || '';
    const subjectParam = searchParams.get('subject')?.trim() || '';
    const medium = searchParams.get('medium')?.toUpperCase().trim() || '';
    const materialType = searchParams.get('materialType')?.toUpperCase().trim() || '';
    const accessType = searchParams.get('accessType')?.toUpperCase().trim() || '';
    const freeOnly = searchParams.get('freeOnly') === 'true' || searchParams.get('freeOnly') === '1';
    const passEligible = searchParams.get('passEligible');

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const sortBy = searchParams.get('sort') || 'popular';

    const matchQuery: Record<string, any> = {
      isPublished: true,
    };

    // State filter
    if (state && state.toLowerCase() !== 'all') {
      const stateRegex = new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      const matchingExams = await ExamNode.find({ state: stateRegex }).select('_id').lean();
      const examIds = matchingExams.map((e) => e._id);
      if (examIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false },
          executionTimeMs: Date.now() - startTime,
        });
      }
      matchQuery.examNodeId = { $in: examIds };
    }

    // Sector
    if (sectorParam && sectorParam !== 'all') {
      if (isValidObjectId(sectorParam)) {
        matchQuery.sectorId = new mongoose.Types.ObjectId(sectorParam);
      } else {
        const sectorDoc = await Sector.findOne({ slug: sectorParam }).select('_id').lean();
        if (sectorDoc) matchQuery.sectorId = sectorDoc._id;
      }
    }

    // Category
    if (categoryParam && categoryParam !== 'all') {
      if (isValidObjectId(categoryParam)) {
        matchQuery.categoryId = new mongoose.Types.ObjectId(categoryParam);
      } else {
        const catDoc = await Category.findOne({
          $or: [{ slug: categoryParam }, { shortCode: categoryParam.toUpperCase() }],
        }).select('_id').lean();
        if (catDoc) matchQuery.categoryId = catDoc._id;
      }
    }

    // ExamNode
    if (examNodeParam && examNodeParam !== 'all') {
      if (isValidObjectId(examNodeParam)) {
        matchQuery.examNodeId = new mongoose.Types.ObjectId(examNodeParam);
      } else {
        const nodeDoc = await ExamNode.findOne({ slug: examNodeParam }).select('_id').lean();
        if (nodeDoc) matchQuery.examNodeId = nodeDoc._id;
      }
    }

    // Subject
    if (subjectParam && subjectParam !== 'all') {
      if (isValidObjectId(subjectParam)) {
        matchQuery.subjectId = new mongoose.Types.ObjectId(subjectParam);
      } else {
        const subjDoc = await Subject.findOne({ slug: subjectParam }).select('_id').lean();
        if (subjDoc) matchQuery.subjectId = subjDoc._id;
      }
    }

    // Material & Medium filters
    if (materialType && materialType !== 'ALL') {
      matchQuery.materialType = materialType;
    }
    if (medium && medium !== 'ALL') {
      matchQuery.medium = medium;
    }
    if (accessType && accessType !== 'ALL') {
      matchQuery.accessType = accessType;
    }
    if (freeOnly) {
      matchQuery.$or = [{ accessType: 'FREE' }, { price: 0 }];
    }
    if (passEligible === 'true' || passEligible === '1') {
      matchQuery.isPassEligible = true;
    }

    // Selective projection for ultra-fast serialization
    const projection = {
      title: 1,
      slug: 1,
      materialType: 1,
      medium: 1,
      accessType: 1,
      price: 1,
      discountedPrice: 1,
      totalPages: 1,
      fileSizeBytes: 1,
      avgRating: 1,
      totalReviews: 1,
      searchTags: 1,
      isPassEligible: 1,
      totalDownloads: 1,
      examNodeId: 1,
      categoryId: 1,
      sectorId: 1,
      subjectId: 1,
      previewKey: 1,
      createdAt: 1,
    };

    // Sort order
    let sortOptions: Record<string, any> = { totalDownloads: -1, createdAt: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { price: 1 };
    if (sortBy === 'price_desc') sortOptions = { price: -1 };
    if (sortBy === 'rating') sortOptions = { avgRating: -1 };

    let results: any[] = [];
    let total = 0;

    // Full-Text search with graceful regex fallback
    if (q) {
      try {
        const textQuery = { ...matchQuery, $text: { $search: q } };
        const [textResults, textCount] = await Promise.all([
          PDFProduct.find(textQuery, { ...projection, score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
          PDFProduct.countDocuments(textQuery),
        ]);

        if (textCount > 0) {
          results = textResults;
          total = textCount;
        }
      } catch (textErr) {
        // Fall back to indexed search
      }

      if (results.length === 0) {
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        const regexQuery = {
          ...matchQuery,
          $or: [{ title: regex }, { searchTags: regex }],
        };

        const [regResults, regCount] = await Promise.all([
          PDFProduct.find(regexQuery, projection)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
          PDFProduct.countDocuments(regexQuery),
        ]);

        results = regResults;
        total = regCount;
      }
    } else {
      const [regularResults, regCount] = await Promise.all([
        PDFProduct.find(matchQuery, projection)
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        PDFProduct.countDocuments(matchQuery),
      ]);

      results = regularResults;
      total = regCount;
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Catalog search API error:', error);
    return NextResponse.json(
      { error: 'Internal catalog aggregation failure', executionTimeMs: Date.now() - startTime },
      { status: 500 }
    );
  }
}
