const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ExamPustak Database with Indian Academic Boards & Competitive Materials...');

  // 1. Categories
  const catK12 = await prisma.category.upsert({
    where: { slug: 'k-12' },
    update: {},
    create: {
      id: 'cat-k12',
      name: 'School Boards (K-12)',
      slug: 'k-12',
      description: 'CBSE, Bihar Board (BSEB), ICSE & State Board Classes 9th to 12th Notes & Sample Papers',
      icon: 'GraduationCap',
      level: 'K12',
    },
  });

  const catComp = await prisma.category.upsert({
    where: { slug: 'competitive-exams' },
    update: {},
    create: {
      id: 'cat-comp',
      name: 'Competitive Exams',
      slug: 'competitive-exams',
      description: 'BPSC, UPSC, SSC CGL, Railways, Banking & State PCS Solved Papers & Toppers Notes',
      icon: 'Flame',
      level: 'COMPETITIVE',
    },
  });

  const catHigher = await prisma.category.upsert({
    where: { slug: 'higher-education' },
    update: {},
    create: {
      id: 'cat-higher',
      name: 'Graduation & Professional',
      slug: 'higher-education',
      description: 'BCA, MCA, B.Tech CSE, B.Com, B.Sc & University Semester Revision Guides',
      icon: 'BookOpen',
      level: 'HIGHER_ED',
    },
  });

  // 2. Boards & Exams
  const boardBPSC = await prisma.boardOrExam.upsert({
    where: { code: 'BPSC' },
    update: {},
    create: {
      id: 'exam-bpsc',
      name: 'Bihar Public Service Commission (BPSC)',
      code: 'BPSC',
      slug: 'bpsc',
      description: 'BPSC 70th & 71st CCE Prelims + Mains comprehensive notes',
      categoryId: catComp.id,
    },
  });

  const boardBSEB = await prisma.boardOrExam.upsert({
    where: { code: 'BSEB' },
    update: {},
    create: {
      id: 'board-bseb',
      name: 'Bihar School Examination Board',
      code: 'BSEB',
      slug: 'bseb',
      description: 'Bihar Board Matric (10th) & Inter (12th) Science, Arts & Commerce notes',
      categoryId: catK12.id,
    },
  });

  const boardCBSE = await prisma.boardOrExam.upsert({
    where: { code: 'CBSE' },
    update: {},
    create: {
      id: 'board-cbse',
      name: 'Central Board of Secondary Education',
      code: 'CBSE',
      slug: 'cbse',
      description: 'NCERT aligned complete chapter notes, mind maps, formula sheets and PYQs',
      categoryId: catK12.id,
    },
  });

  // 3. Subjects
  const subBPSC = await prisma.subject.upsert({
    where: {
      boardOrExamId_name_classLevel: {
        boardOrExamId: boardBPSC.id,
        name: 'Bihar Special GK & History',
        classLevel: 'BPSC Prelims & Mains',
      },
    },
    update: {},
    create: {
      id: 'sub-bpsc-bihar',
      name: 'Bihar Special GK & History',
      slug: 'bihar-special-history',
      classLevel: 'BPSC Prelims & Mains',
      boardOrExamId: boardBPSC.id,
    },
  });

  // 4. Products
  await prisma.pDFProduct.upsert({
    where: { slug: 'bpsc-bihar-special-complete-gk-history-topper-notes-hindi' },
    update: {},
    create: {
      id: 'pdf-bpsc-bihar-spl-2026',
      title: 'BPSC 70th/71st CCE: Bihar Special Complete GK & History Topper Notes (Hindi Medium)',
      slug: 'bpsc-bihar-special-complete-gk-history-topper-notes-hindi',
      description: 'Exhaustive handwritten topper notes covering ancient, medieval, and modern history of Bihar, Freedom movement in Bihar, budget 2025-26, and economic survey.',
      highlights: [
        'Comprehensive coverage of 100% Bihar Special syllabus',
        'Includes Bihar Budget & Economic Survey high-yield data points',
        '500+ Solved Previous Year Questions from 56th-69th BPSC',
      ],
      tableOfContents: [
        '1. Ancient Bihar: Magadh, Maurya, Gupta Empire & Nalanda',
        '2. Medieval Bihar: Sasaram & Sher Shah Suri, Sufi Traditions',
        '3. Modern Bihar: Kunwar Singh 1857, Champaran Satyagraha',
        '4. Physical Geography, Soil & River Systems of Bihar',
      ],
      price: 199,
      discountedPrice: 99,
      fileKey: 'materials/bpsc/bpsc_bihar_special_topper_notes.pdf',
      previewKey: 'previews/bpsc/bpsc_bihar_special_preview.pdf',
      previewUrl: '/api/preview/pdf-bpsc-bihar-spl-2026',
      pageCount: 148,
      fileSize: 18452100,
      medium: 'HINDI',
      materialType: 'NOTES',
      tags: ['BPSC', 'Bihar Special', '70th BPSC', 'Hindi Medium', 'Topper Notes'],
      authorName: 'IAS / BPSC Rank 14 Notes Vault',
      subjectId: subBPSC.id,
      isPublished: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 342,
      totalDownloads: 4820,
      totalSales: 4820,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
