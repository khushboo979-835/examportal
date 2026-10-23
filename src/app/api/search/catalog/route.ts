import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models/PDFProduct';
import { ExamNode } from '@/models/ExamNode';
import { Category } from '@/models/Category';
import { Sector } from '@/models/Sector';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q')?.trim() || '';
    const sectorId = searchParams.get('sectorId');
    const categoryId = searchParams.get('categoryId');
    const examNodeId = searchParams.get('examNodeId');
    const subjectId = searchParams.get('subjectId');
    const materialType = searchParams.get('materialType');
    const medium = searchParams.get('medium');
    const accessType = searchParams.get('accessType');
    const isPassEligible = searchParams.get('isPassEligible');
    const state = searchParams.get('state');

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const sort = searchParams.get('sort') || 'popular';

    await connectToDatabase();

    // Build filter query
    const filter: Record<string, any> = { isPublished: true };

    // Exam state filter resolution
    if (state && !examNodeId) {
      const stateExamNodes = await ExamNode.find({ state }).select('_id').lean();
      if (stateExamNodes.length > 0) {
        filter.examNodeId = { $in: stateExamNodes.map((n) => n._id) };
      }
    }

    if (sectorId && Types.ObjectId.isValid(sectorId)) filter.sectorId = new Types.ObjectId(sectorId);
    if (categoryId && Types.ObjectId.isValid(categoryId)) filter.categoryId = new Types.ObjectId(categoryId);
    if (examNodeId && Types.ObjectId.isValid(examNodeId)) filter.examNodeId = new Types.ObjectId(examNodeId);
    if (subjectId && Types.ObjectId.isValid(subjectId)) filter.subjectId = new Types.ObjectId(subjectId);

    if (materialType) filter.materialType = materialType.toUpperCase();
    if (medium) filter.medium = medium.toUpperCase();
    if (accessType) filter.accessType = accessType.toUpperCase();
    if (isPassEligible !== null && isPassEligible !== undefined) {
      if (isPassEligible === 'true') filter.isPassEligible = true;
      if (isPassEligible === 'false') filter.isPassEligible = false;
    }

    // Determine Sort options
    let sortOptions: Record<string, any> = { totalDownloads: -1 };
    if (sort === 'trending') sortOptions = { totalDownloads: -1, avgRating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'popular') sortOptions = { totalDownloads: -1 };
    else if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { avgRating: -1, totalReviews: -1 };

    // Projection excludes private fileKey and internal buffers
    const projection = {
      title: 1,
      slug: 1,
      sectorId: 1,
      categoryId: 1,
      examNodeId: 1,
      subjectId: 1,
      subject: 1,
      chapterNumber: 1,
      year: 1,
      materialType: 1,
      medium: 1,
      accessType: 1,
      price: 1,
      discountedPrice: 1,
      previewKey: 1,
      totalPages: 1,
      fileSizeBytes: 1,
      avgRating: 1,
      totalReviews: 1,
      searchTags: 1,
      isPassEligible: 1,
      totalDownloads: 1,
      createdAt: 1,
    };

    let products: any[] = [];
    let totalCount = 0;

    // Fast-path text search with graceful indexed regex fallback
    if (q) {
      try {
        const textFilter = { ...filter, $text: { $search: q } };
        const [textProducts, textCount] = await Promise.all([
          PDFProduct.find(textFilter, { ...projection, score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' }, ...sortOptions })
            .skip(skip)
            .limit(limit)
            .populate('examNodeId', 'name slug state')
            .populate('categoryId', 'name slug shortCode')
            .lean(),
          PDFProduct.countDocuments(textFilter),
        ]);

        if (textCount > 0) {
          products = textProducts;
          totalCount = textCount;
        } else {
          throw new Error('Zero text matches, fallback to regex');
        }
      } catch {
        // Fallback to indexed regex match
        const regex = new RegExp(q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
        const fallbackFilter = {
          ...filter,
          $or: [{ title: regex }, { searchTags: regex }, { subject: regex }],
        };

        const [fallbackProducts, fallbackCount] = await Promise.all([
          PDFProduct.find(fallbackFilter, projection)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('examNodeId', 'name slug state')
            .populate('categoryId', 'name slug shortCode')
            .lean(),
          PDFProduct.countDocuments(fallbackFilter),
        ]);

        products = fallbackProducts;
        totalCount = fallbackCount;
      }
    } else {
      const [regularProducts, regularCount] = await Promise.all([
        PDFProduct.find(filter, projection)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .populate('examNodeId', 'name slug state')
          .populate('categoryId', 'name slug shortCode')
          .lean(),
        PDFProduct.countDocuments(filter),
      ]);

      products = regularProducts;
      totalCount = regularCount;
    }

    // Material type & Medium counts for faceted filtering
    const facets = await PDFProduct.aggregate([
      { $match: { isPublished: true } },
      {
        $facet: {
          materialTypes: [{ $group: { _id: '$materialType', count: { $sum: 1 } } }],
          mediums: [{ $group: { _id: '$medium', count: { $sum: 1 } } }],
          accessTypes: [{ $group: { _id: '$accessType', count: { $sum: 1 } } }],
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
      products,
      facets: facets[0] || {},
    });
  } catch (error: any) {
    console.error('Catalog Search Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to query catalog resources' },
      { status: 500 }
    );
  }
}
