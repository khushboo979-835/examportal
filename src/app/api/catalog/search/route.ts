import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import { PDFProduct, ExamNode, Category, Sector, Subject } from '@/models';
import { getHydratedProducts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

function isValidObjectId(val: string): boolean {
  return mongoose.Types.ObjectId.isValid(val) && String(new mongoose.Types.ObjectId(val)) === val;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    await connectToDatabase();

    // Filter Query Params
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
    const yearParam = searchParams.get('year');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    // Pagination & Sorting Params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const sortBy = searchParams.get('sort') || 'popular';

    const matchQuery: Record<string, any> = {
      isPublished: true,
    };

    // 1. Resolve State Filter via ExamNodes
    if (state && state !== 'all') {
      const stateRegex = new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      const matchingExams = await ExamNode.find({ state: stateRegex }).select('_id').lean();
      const examIds = matchingExams.map((e) => e._id);
      if (examIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          availableFilters: {
            mediums: [],
            materialTypes: [],
            examNodes: [],
            subjects: [],
          },
          executionTimeMs: Date.now() - startTime,
        });
      }
      matchQuery.examNodeId = { $in: examIds };
    }

    // 2. Resolve Sector (slug or ObjectId)
    if (sectorParam && sectorParam !== 'all') {
      if (isValidObjectId(sectorParam)) {
        matchQuery.sectorId = new mongoose.Types.ObjectId(sectorParam);
      } else {
        const sectorDoc = await Sector.findOne({ slug: sectorParam }).select('_id').lean();
        if (sectorDoc) {
          matchQuery.sectorId = sectorDoc._id;
        }
      }
    }

    // 3. Resolve Category (slug or ObjectId)
    if (categoryParam && categoryParam !== 'all') {
      if (isValidObjectId(categoryParam)) {
        matchQuery.categoryId = new mongoose.Types.ObjectId(categoryParam);
      } else {
        const catDoc = await Category.findOne({
          $or: [{ slug: categoryParam }, { shortCode: categoryParam.toUpperCase() }],
        }).select('_id').lean();
        if (catDoc) {
          matchQuery.categoryId = catDoc._id;
        }
      }
    }

    // 4. Resolve ExamNode (slug or ObjectId)
    if (examNodeParam && examNodeParam !== 'all') {
      if (isValidObjectId(examNodeParam)) {
        matchQuery.examNodeId = new mongoose.Types.ObjectId(examNodeParam);
      } else {
        const examDoc = await ExamNode.findOne({ slug: examNodeParam }).select('_id').lean();
        if (examDoc) {
          matchQuery.examNodeId = examDoc._id;
        }
      }
    }

    // 5. Resolve Subject (slug or ObjectId)
    if (subjectParam && subjectParam !== 'all') {
      if (isValidObjectId(subjectParam)) {
        matchQuery.subjectId = new mongoose.Types.ObjectId(subjectParam);
      } else {
        const subjDoc = await Subject.findOne({ slug: subjectParam }).select('_id').lean();
        if (subjDoc) {
          matchQuery.subjectId = subjDoc._id;
        } else {
          matchQuery.subject = { $regex: new RegExp(subjectParam, 'i') };
        }
      }
    }

    // 6. Medium Filter
    if (medium && ['HINDI', 'ENGLISH', 'BILINGUAL'].includes(medium)) {
      matchQuery.medium = medium;
    }

    // 7. Material Type Filter
    if (
      materialType &&
      ['NOTES', 'SOLVED_PYQ', 'MOCK_PAPER', 'FORMULA_SHEET', 'SYLLABUS_SUMMARY'].includes(materialType)
    ) {
      matchQuery.materialType = materialType;
    }

    // 8. Access & Free Filter
    if (freeOnly) {
      matchQuery.$or = [{ accessType: 'FREE' }, { price: 0 }];
    } else if (accessType && ['FREE', 'PREMIUM', 'PASS_ONLY'].includes(accessType)) {
      matchQuery.accessType = accessType;
    }

    // 9. Pass Eligibility Filter
    if (passEligible === 'true') {
      matchQuery.isPassEligible = true;
    } else if (passEligible === 'false') {
      matchQuery.isPassEligible = false;
    }

    // 10. Year Filter
    if (yearParam && !isNaN(Number(yearParam))) {
      matchQuery.year = Number(yearParam);
    }

    // 11. Price Range Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      matchQuery.price = {};
      if (minPrice !== undefined) matchQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) matchQuery.price.$lte = maxPrice;
    }

    // 12. Text Search with Regex Fallback
    if (q) {
      const sanitized = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitized, 'i');
      
      const textConditions = [
        { title: { $regex: searchRegex } },
        { searchTags: { $in: [searchRegex] } },
        { subject: { $regex: searchRegex } },
      ];

      if (matchQuery.$or) {
        matchQuery.$and = [{ $or: matchQuery.$or }, { $or: textConditions }];
        delete matchQuery.$or;
      } else {
        matchQuery.$or = textConditions;
      }
    }

    // 13. Dynamic Sort Stage
    let sortStage: Record<string, 1 | -1> = { totalDownloads: -1, _id: -1 };
    switch (sortBy) {
      case 'latest':
        sortStage = { createdAt: -1, _id: -1 };
        break;
      case 'rating':
        sortStage = { avgRating: -1, totalReviews: -1, _id: -1 };
        break;
      case 'price_low':
        sortStage = { price: 1, _id: -1 };
        break;
      case 'price_high':
        sortStage = { price: -1, _id: -1 };
        break;
      case 'popular':
      default:
        sortStage = { totalDownloads: -1, totalSales: -1, _id: -1 };
        break;
    }

    // 14. High-Performance Aggregation with $facet
    const aggregationPipeline: any[] = [
      { $match: matchQuery },
      {
        $facet: {
          data: [
            { $sort: sortStage },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: 'examnodes',
                localField: 'examNodeId',
                foreignField: '_id',
                as: 'examNode',
                pipeline: [{ $project: { name: 1, slug: 1, state: 1, targetYear: 1, iconUrl: 1 } }],
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
                pipeline: [{ $project: { name: 1, slug: 1, shortCode: 1 } }],
              },
            },
            {
              $lookup: {
                from: 'subjects',
                localField: 'subjectId',
                foreignField: '_id',
                as: 'subjectRef',
                pipeline: [{ $project: { name: 1, slug: 1 } }],
              },
            },
            {
              $addFields: {
                examNode: { $arrayElemAt: ['$examNode', 0] },
                category: { $arrayElemAt: ['$category', 0] },
                subjectRef: { $arrayElemAt: ['$subjectRef', 0] },
              },
            },
            {
              $project: {
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
                avgRating: { $ifNull: ['$avgRating', '$rating', 5.0] },
                totalReviews: { $ifNull: ['$totalReviews', '$reviewCount', 0] },
                searchTags: 1,
                isPassEligible: 1,
                totalDownloads: 1,
                totalSales: 1,
                examNode: 1,
                category: 1,
                subjectRef: 1,
                createdAt: 1,
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
          availableMediums: [
            { $group: { _id: '$medium', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          availableMaterialTypes: [
            { $group: { _id: '$materialType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          availableExamNodes: [
            { $group: { _id: '$examNodeId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
            {
              $lookup: {
                from: 'examnodes',
                localField: '_id',
                foreignField: '_id',
                as: 'exam',
                pipeline: [{ $project: { name: 1, slug: 1, state: 1 } }],
              },
            },
            {
              $project: {
                examNodeId: '$_id',
                count: 1,
                name: { $arrayElemAt: ['$exam.name', 0] },
                slug: { $arrayElemAt: ['$exam.slug', 0] },
                state: { $arrayElemAt: ['$exam.state', 0] },
              },
            },
          ],
          availableSubjects: [
            { $match: { subject: { $ne: null } } },
            { $group: { _id: '$subject', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
          ],
        },
      },
    ];

    const [result] = await PDFProduct.aggregate(aggregationPipeline).allowDiskUse(true);

    const total = result.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const availableFilters = {
      mediums: (result.availableMediums || []).map((m: any) => ({
        value: m._id,
        count: m.count,
      })),
      materialTypes: (result.availableMaterialTypes || []).map((m: any) => ({
        value: m._id,
        count: m.count,
      })),
      examNodes: (result.availableExamNodes || []).map((e: any) => ({
        id: e.examNodeId,
        name: e.name || 'Exam',
        slug: e.slug || '',
        state: e.state || 'National/Central',
        count: e.count,
      })),
      subjects: (result.availableSubjects || []).map((s: any) => ({
        name: s._id,
        count: s.count,
      })),
    };

    const normalizedData = (result.data || []).map((p: any) => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        data: normalizedData,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        availableFilters,
        executionTimeMs: Date.now() - startTime,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.warn('Catalog Search DB fallback triggered:', error.message);

    // High-availability fallback using hydrated products
    try {
      const all = getHydratedProducts();
      const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
      const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
      const q = searchParams.get('q')?.toLowerCase().trim() || '';

      let filtered = all;
      if (q) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.subject?.name?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      const availableFilters = {
        mediums: [
          { value: 'HINDI', count: filtered.filter((p) => p.medium === 'HINDI').length },
          { value: 'ENGLISH', count: filtered.filter((p) => p.medium === 'ENGLISH').length },
          { value: 'BILINGUAL', count: filtered.filter((p) => p.medium === 'BILINGUAL').length },
        ].filter((m) => m.count > 0),
        materialTypes: [
          { value: 'NOTES', count: filtered.filter((p) => p.materialType === 'NOTES').length },
          { value: 'SOLVED_PYQ', count: filtered.filter((p) => (p.materialType as string) === 'SOLVED_PYQ' || (p.materialType as string) === 'PYQ').length },
          { value: 'FORMULA_SHEET', count: filtered.filter((p) => p.materialType === 'FORMULA_SHEET').length },
        ].filter((m) => m.count > 0),
        examNodes: [
          { id: 'bpsc', name: 'BPSC 70th CCE', slug: 'bpsc-70th-cce', state: 'Bihar', count: 4 },
          { id: 'bseb', name: 'BSEB Class 12th', slug: 'bseb-class-12-science', state: 'Bihar', count: 3 },
          { id: 'cbse', name: 'CBSE Class 10th', slug: 'cbse-class-10th', state: 'National/Central', count: 2 },
          { id: 'ssc', name: 'SSC CGL 2026', slug: 'ssc-cgl-2026', state: 'National/Central', count: 2 },
        ],
        subjects: [
          { name: 'General Studies', count: 5 },
          { name: 'Physics & Chemistry', count: 3 },
          { name: 'Mathematics', count: 2 },
        ],
      };

      return NextResponse.json(
        {
          success: true,
          data: paginated,
          pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          availableFilters,
          isFallback: true,
          executionTimeMs: Date.now() - startTime,
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to execute catalog faceted search',
          details: error.message,
          executionTimeMs: Date.now() - startTime,
        },
        { status: 500 }
      );
    }
  }
}
