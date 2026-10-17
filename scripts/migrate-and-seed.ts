import 'dotenv/config';
import mongoose, { Types } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not defined!');
  process.exit(1);
}

// Inline / Shared Schemas for Standalone Execution
const SectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: 'GraduationCap' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true },
  },
  { timestamps: true }
);

const ExamNodeSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    state: { type: String, default: 'National/Central', index: true },
    iconUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    targetYear: { type: String, default: '2026-2027' },
    isTrending: { type: Boolean, default: false },
    totalPdfsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { _id: false }
);

const SubjectSchema = new mongoose.Schema(
  {
    examNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    chapters: { type: [ChapterSchema], default: [] },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);
SubjectSchema.index({ examNodeId: 1, slug: 1 }, { unique: true });

const BundleOrPassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    passType: {
      type: String,
      enum: ['STATE_PASS', 'CENTRAL_EXAM_PASS', 'SCHOOL_BOARD_PASS', 'ULTIMATE_ALL_ACCESS'],
      required: true,
    },
    validityDays: { type: Number, default: 365 },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    includedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode' }],
    featuresList: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PDFProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    examNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subject: { type: String, default: 'General' },
    chapterNumber: { type: Number },
    year: { type: Number, default: 2026 },
    materialType: { type: String, required: true },
    medium: { type: String, required: true },
    accessType: { type: String, default: 'PREMIUM' },
    price: { type: Number, default: 0 },
    discountedPrice: { type: Number },
    fileKey: { type: String, required: true },
    previewKey: { type: String, required: true },
    totalPages: { type: Number, required: true },
    fileSizeBytes: { type: Number, required: true },
    avgRating: { type: Number, default: 5.0 },
    rating: { type: Number, default: 4.9 },
    totalReviews: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 1 },
    searchTags: [{ type: String }],
    isPassEligible: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    totalDownloads: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ExamNode = mongoose.models.ExamNode || mongoose.model('ExamNode', ExamNodeSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const BundleOrPass = mongoose.models.BundleOrPass || mongoose.model('BundleOrPass', BundleOrPassSchema);
const PDFProduct = mongoose.models.PDFProduct || mongoose.model('PDFProduct', PDFProductSchema);

async function migrateAndSeed() {
  console.log('=====================================================');
  console.log('🚀 TESTBOOK-GRADE MIGRATION & DEEP SEEDING ENGINE');
  console.log('=====================================================');
  console.log('Connecting to MongoDB Atlas Cluster0...');

  await mongoose.connect(MONGODB_URI as string);
  console.log('✅ Connected to MongoDB Atlas successfully!\n');

  // STEP 1: SAFETY AUDIT — Verify Users & Orders are Intact (ZERO DATA LOSS)
  console.log('--- [Step 1: Safety Audit (Zero Data Loss)] ---');
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection failed');

  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  console.log(`Discovered ${collectionNames.length} existing collections: [${collectionNames.join(', ')}]`);

  if (collectionNames.includes('users')) {
    const userCount = await db.collection('users').countDocuments();
    console.log(`🔒 Users collection confirmed SAFE: ${userCount} existing student/admin record(s) will NEVER be dropped.`);
  }
  if (collectionNames.includes('orders')) {
    const orderCount = await db.collection('orders').countDocuments();
    console.log(`🔒 Orders collection confirmed SAFE: ${orderCount} existing order record(s) preserved.`);
  }
  if (collectionNames.includes('downloadlogs')) {
    const logCount = await db.collection('downloadlogs').countDocuments();
    console.log(`🔒 DownloadLogs collection confirmed SAFE: ${logCount} log record(s) preserved.`);
  }

  // STEP 2: UPSERT ROOT SECTORS
  console.log('\n--- [Step 2: Sync Root Sectors] ---');
  const sectorDefinitions = [
    { name: 'State Govt Exams (Bihar / UP / MP)', slug: 'state-govt-exams', icon: 'Flame', displayOrder: 1 },
    { name: 'School Education (9th–12th Boards)', slug: 'school-education', icon: 'GraduationCap', displayOrder: 2 },
    { name: 'Central Govt Exams (SSC / UPSC / RRB)', slug: 'central-govt-exams', icon: 'Sparkles', displayOrder: 3 },
    { name: 'Graduation & Professional Streams', slug: 'graduation-tech', icon: 'BookOpen', displayOrder: 4 },
  ];

  const sectorMap = new Map<string, any>();
  for (const s of sectorDefinitions) {
    const doc = await Sector.findOneAndUpdate(
      { slug: s.slug },
      { $set: s },
      { upsert: true, new: true }
    );
    sectorMap.set(s.slug, doc);
    console.log(`  ✓ Sector synced: "${doc.name}" [ID: ${doc._id}]`);
  }

  // STEP 3: UPSERT BOARD/AUTHORITY CATEGORIES
  console.log('\n--- [Step 3: Sync Categories & Exam Authorities] ---');
  const categoryDefinitions = [
    // State Exams
    { sectorSlug: 'state-govt-exams', name: 'Bihar State Public Service Commission', slug: 'bpsc-exams', shortCode: 'BPSC' },
    { sectorSlug: 'state-govt-exams', name: 'Bihar Staff Selection Commission', slug: 'bssc-exams', shortCode: 'BSSC' },
    { sectorSlug: 'state-govt-exams', name: 'Bihar Police & Defense Examinations', slug: 'bihar-police', shortCode: 'CSBC' },
    { sectorSlug: 'state-govt-exams', name: 'Uttar Pradesh State Exams', slug: 'up-state-exams', shortCode: 'UPPSC' },
    // School Boards
    { sectorSlug: 'school-education', name: 'Bihar School Examination Board', slug: 'bseb-board', shortCode: 'BSEB' },
    { sectorSlug: 'school-education', name: 'Central Board of Secondary Education', slug: 'cbse-board', shortCode: 'CBSE' },
    { sectorSlug: 'school-education', name: 'Council for the Indian School Certificate', slug: 'icse-board', shortCode: 'ICSE' },
    // Central Govt
    { sectorSlug: 'central-govt-exams', name: 'Staff Selection Commission', slug: 'ssc-exams', shortCode: 'SSC' },
    { sectorSlug: 'central-govt-exams', name: 'Railway Recruitment Board', slug: 'rrb-railways', shortCode: 'RRB' },
    { sectorSlug: 'central-govt-exams', name: 'Union Public Service Commission', slug: 'upsc-civil-services', shortCode: 'UPSC' },
  ];

  const categoryMap = new Map<string, any>();
  for (const c of categoryDefinitions) {
    const parentSector = sectorMap.get(c.sectorSlug);
    if (!parentSector) continue;

    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      {
        $set: {
          sectorId: parentSector._id,
          name: c.name,
          slug: c.slug,
          shortCode: c.shortCode,
        },
      },
      { upsert: true, new: true }
    );
    categoryMap.set(c.slug, doc);
    console.log(`  ✓ Category synced: "${doc.name}" (${doc.shortCode})`);
  }

  // STEP 4: UPSERT TARGET EXAM NODES WITH STATE & ICON
  console.log('\n--- [Step 4: Sync & Enhance ExamNodes (State Categorization)] ---');
  const examDefinitions = [
    // Bihar State
    {
      categorySlug: 'bpsc-exams',
      name: 'BPSC 70th / 71st Combined Competitive Exam',
      slug: 'bpsc-70th-cce',
      state: 'Bihar',
      iconUrl: '/icons/exams/bpsc.png',
      description: 'Comprehensive Prelims + Mains study material: Bihar Special GK, History, Polity & Current Affairs.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'bssc-exams',
      name: 'BSSC 2nd Inter Level Combined Exam',
      slug: 'bssc-inter-level',
      state: 'Bihar',
      iconUrl: '/icons/exams/bssc.png',
      description: 'General Studies, General Science, Math & Mental Ability 10-year solved questions.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'bihar-police',
      name: 'Bihar Police Constable & Sub-Inspector (Daroga)',
      slug: 'bihar-police-si-constable',
      state: 'Bihar',
      iconUrl: '/icons/exams/bihar-police.png',
      description: 'Physical & written exam complete notes, Hindi grammar & GS test sets.',
      targetYear: '2026-2027',
      isTrending: false,
    },
    {
      categorySlug: 'bseb-board',
      name: 'BSEB Class 12th Inter (Science / Arts / Commerce)',
      slug: 'bseb-class-12-science',
      state: 'Bihar',
      iconUrl: '/icons/exams/bseb.png',
      description: 'Physics, Chemistry, Math & Biology formula sheets, derivations & model question banks in Hindi Medium.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'bseb-board',
      name: 'BSEB Class 10th Matriculation Board',
      slug: 'bseb-class-10th-matric',
      state: 'Bihar',
      iconUrl: '/icons/exams/bseb.png',
      description: 'Class 10th Math, Sanskrit, Science & Social Science topper revision notes.',
      targetYear: '2026-2027',
      isTrending: false,
    },
    // CBSE & ICSE Boards
    {
      categorySlug: 'cbse-board',
      name: 'CBSE Class 10th Board Standard',
      slug: 'cbse-class-10th',
      state: 'National/Central',
      iconUrl: '/icons/exams/cbse.png',
      description: 'Mathematics, Science, English & Social Science 100% syllabus coverage with 10-year board PYQs.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'cbse-board',
      name: 'CBSE Class 12th Board Science Stream',
      slug: 'cbse-class-12th-science',
      state: 'National/Central',
      iconUrl: '/icons/exams/cbse.png',
      description: 'CBSE Class 12 Physics, Chemistry, Math & Biology NCERT line-by-line notes & exemplar solutions.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'icse-board',
      name: 'ICSE Class 10th Board Examinations',
      slug: 'icse-class-10th',
      state: 'National/Central',
      iconUrl: '/icons/exams/icse.png',
      description: 'ICSE Class 10 Physics numericals, Chemistry reaction charts & Biology labeled diagrams.',
      targetYear: '2026-2027',
      isTrending: false,
    },
    // Central Govt Exams
    {
      categorySlug: 'ssc-exams',
      name: 'SSC CGL 2026-2027 (Tier 1 & Tier 2)',
      slug: 'ssc-cgl-2026',
      state: 'National/Central',
      iconUrl: '/icons/exams/ssc.png',
      description: 'Quantitative Aptitude 1000+ shortcuts, English vocab roots, Reasoning & GS 5000+ TCS PYQs.',
      targetYear: '2026-2027',
      isTrending: true,
    },
    {
      categorySlug: 'rrb-railways',
      name: 'RRB NTPC & Group D Recruitment Exam',
      slug: 'rrb-ntpc-2026',
      state: 'National/Central',
      iconUrl: '/icons/exams/railway.png',
      description: 'Railway General Science, Reasoning tricks, and Static GK topic-wise capsules.',
      targetYear: '2026-2027',
      isTrending: false,
    },
    {
      categorySlug: 'upsc-civil-services',
      name: 'UPSC CSE Civil Services (IAS / IPS)',
      slug: 'upsc-cse-prelims-mains',
      state: 'National/Central',
      iconUrl: '/icons/exams/upsc.png',
      description: 'GS Paper 1-4 standard book summaries, Laxmikanth Polity mind maps, and Modern History timelines.',
      targetYear: '2026-2027',
      isTrending: true,
    },
  ];

  const examMap = new Map<string, any>();
  for (const e of examDefinitions) {
    const parentCat = categoryMap.get(e.categorySlug);
    if (!parentCat) continue;

    const doc = await ExamNode.findOneAndUpdate(
      { slug: e.slug },
      {
        $set: {
          categoryId: parentCat._id,
          name: e.name,
          slug: e.slug,
          state: e.state,
          iconUrl: e.iconUrl,
          description: e.description,
          targetYear: e.targetYear,
          isTrending: e.isTrending,
        },
      },
      { upsert: true, new: true }
    );
    examMap.set(e.slug, doc);
    console.log(`  ✓ ExamNode synced: "${doc.name}" | State: [${doc.state}]`);
  }

  // STEP 5: DEEP CATEGORY HIERARCHY — SEED SUBJECTS & CHAPTER BREAKDOWNS
  console.log('\n--- [Step 5: Seed Deep Subject & Chapter Hierarchy] ---');
  const subjectDefinitions = [
    // BPSC 70th Subjects
    {
      examSlug: 'bpsc-70th-cce',
      name: 'Bihar Special General Knowledge & History',
      slug: 'bihar-special-gk',
      displayOrder: 1,
      chapters: [
        { chapterNumber: 1, title: 'Ancient Bihar: Magadha, Maurya & Nalanda University', slug: 'ancient-bihar' },
        { chapterNumber: 2, title: 'Medieval Bihar: Sher Shah Suri, Sufism & Battle of Buxar', slug: 'medieval-bihar' },
        { chapterNumber: 3, title: 'Modern Bihar: 1857 Revolt, Champaran Satyagraha & Kisan Sabha', slug: 'modern-bihar' },
        { chapterNumber: 4, title: 'Physical Geography, Soils, Rivers & Irrigation Systems of Bihar', slug: 'geography-rivers-bihar' },
        { chapterNumber: 5, title: 'Bihar Budget 2025-26 & Economic Survey Highlights', slug: 'bihar-budget-economy' },
      ],
    },
    {
      examSlug: 'bpsc-70th-cce',
      name: 'Indian Polity & Constitution (M. Laxmikanth Crux)',
      slug: 'indian-polity-bpsc',
      displayOrder: 2,
      chapters: [
        { chapterNumber: 1, title: 'Preamble, Salient Features & Constitutional Framework', slug: 'preamble-framework' },
        { chapterNumber: 2, title: 'Fundamental Rights (Articles 12-35) & Writs Jurisdiction', slug: 'fundamental-rights' },
        { chapterNumber: 3, title: 'Directive Principles (DPSP) & Fundamental Duties', slug: 'dpsp-duties' },
        { chapterNumber: 4, title: 'President, Governor, Prime Minister & Council of Ministers', slug: 'executive-union-state' },
        { chapterNumber: 5, title: 'Parliament, State Legislature & Budgetary Procedures', slug: 'parliament-legislature' },
      ],
    },
    // BSEB 12th Science Subjects
    {
      examSlug: 'bseb-class-12-science',
      name: 'Physics (भौतिक विज्ञान - 12th)',
      slug: 'physics-12th-bseb',
      displayOrder: 1,
      chapters: [
        { chapterNumber: 1, title: 'वैद्युत आवेश तथा क्षेत्र (Electrostatics)', slug: 'electrostatics' },
        { chapterNumber: 2, title: 'धारा विद्युत एवं किरचॉफ के नियम (Current Electricity)', slug: 'current-electricity' },
        { chapterNumber: 3, title: 'विद्युत धारा के चुंबकीय प्रभाव (Magnetism)', slug: 'magnetic-effects' },
        { chapterNumber: 4, title: 'किरण प्रकाशिकी एवं प्रकाशिक यंत्र (Ray Optics)', slug: 'ray-optics' },
        { chapterNumber: 5, title: 'अर्धचालक इलेक्ट्रॉनिकी (Semiconductors)', slug: 'semiconductor-electronics' },
      ],
    },
    {
      examSlug: 'bseb-class-12-science',
      name: 'Chemistry (रसायन शास्त्र - 12th)',
      slug: 'chemistry-12th-bseb',
      displayOrder: 2,
      chapters: [
        { chapterNumber: 1, title: 'विलयन एवं अणुसंख्य गुणधर्म (Solutions)', slug: 'solutions' },
        { chapterNumber: 2, title: 'वैद्युतरसायन (Electrochemistry)', slug: 'electrochemistry' },
        { chapterNumber: 3, title: 'रासायनिक बलगतिकी (Chemical Kinetics)', slug: 'chemical-kinetics' },
        { chapterNumber: 4, title: 'd एवं f-ब्लॉक के तत्व (d & f Block Elements)', slug: 'd-and-f-block' },
        { chapterNumber: 5, title: 'हैलोएल्केन तथा हैलोएरीन (Haloalkanes & Haloarenes)', slug: 'haloalkanes' },
      ],
    },
    // CBSE Class 10 Subjects
    {
      examSlug: 'cbse-class-10th',
      name: 'Mathematics Standard & Basic',
      slug: 'maths-class-10-cbse',
      displayOrder: 1,
      chapters: [
        { chapterNumber: 1, title: 'Real Numbers & Fundamental Theorem of Arithmetic', slug: 'real-numbers' },
        { chapterNumber: 2, title: 'Polynomials & Zeros Relationship', slug: 'polynomials' },
        { chapterNumber: 3, title: 'Pair of Linear Equations in Two Variables', slug: 'linear-equations' },
        { chapterNumber: 4, title: 'Quadratic Equations & Discriminant Methods', slug: 'quadratic-equations' },
        { chapterNumber: 5, title: 'Introduction to Trigonometry & Trigonometric Identities', slug: 'trigonometry-identities' },
        { chapterNumber: 6, title: 'Circles & Tangents Properties', slug: 'circles-geometry' },
      ],
    },
    // SSC CGL Subjects
    {
      examSlug: 'ssc-cgl-2026',
      name: 'Quantitative Aptitude & Speed Tricks',
      slug: 'ssc-cgl-quant',
      displayOrder: 1,
      chapters: [
        { chapterNumber: 1, title: 'Number Systems, Unit Digit & Divisibility Rules', slug: 'number-systems' },
        { chapterNumber: 2, title: 'Percentages, Profit & Loss, True Discount Hacks', slug: 'percentage-profit-loss' },
        { chapterNumber: 3, title: 'Time & Work, Pipes & Cisterns Efficiency Techniques', slug: 'time-and-work' },
        { chapterNumber: 4, title: 'Algebraic Identities & Value Putting Shortcuts', slug: 'algebra-value-putting' },
        { chapterNumber: 5, title: 'Trigonometry Maxima-Minima & Heights & Distances', slug: 'trigonometry-shortcuts' },
      ],
    },
    {
      examSlug: 'ssc-cgl-2026',
      name: 'General Awareness & 5000+ TCS PYQs',
      slug: 'ssc-cgl-general-awareness',
      displayOrder: 2,
      chapters: [
        { chapterNumber: 1, title: 'Ancient, Medieval & Modern Indian History Chronology', slug: 'indian-history-timeline' },
        { chapterNumber: 2, title: 'Physical & Indian Geography (Rivers, Passes, National Parks)', slug: 'indian-geography' },
        { chapterNumber: 3, title: 'General Science Physics, Chemistry & Biology Capsules', slug: 'general-science-capsule' },
        { chapterNumber: 4, title: 'Indian Economy, Five Year Plans & Census 2011 Data', slug: 'economy-census' },
      ],
    },
  ];

  const subjectMap = new Map<string, any>();
  for (const s of subjectDefinitions) {
    const parentExam = examMap.get(s.examSlug);
    if (!parentExam) continue;

    const doc = await Subject.findOneAndUpdate(
      { examNodeId: parentExam._id, slug: s.slug },
      {
        $set: {
          examNodeId: parentExam._id,
          name: s.name,
          slug: s.slug,
          chapters: s.chapters,
          displayOrder: s.displayOrder,
        },
      },
      { upsert: true, new: true }
    );
    subjectMap.set(`${s.examSlug}__${s.slug}`, doc);
    console.log(`  ✓ Subject synced: "${doc.name}" with ${doc.chapters.length} structured chapters.`);
  }

  // STEP 6: SEED PRODUCTION-TESTED PDF PRODUCTS
  console.log('\n--- [Step 6: Sync & Link PDF Products with Subjects] ---');
  const bpscExam = examMap.get('bpsc-70th-cce');
  const bseb12Exam = examMap.get('bseb-class-12-science');
  const cbse10Exam = examMap.get('cbse-class-10th');
  const sscExam = examMap.get('ssc-cgl-2026');
  const upscExam = examMap.get('upsc-cse-prelims-mains');

  const bpscSpecialSub = subjectMap.get('bpsc-70th-cce__bihar-special-gk');
  const bpscPolitySub = subjectMap.get('bpsc-70th-cce__indian-polity-bpsc');
  const bsebPhySub = subjectMap.get('bseb-class-12-science__physics-12th-bseb');
  const cbseMathSub = subjectMap.get('cbse-class-10th__maths-class-10-cbse');
  const sscQuantSub = subjectMap.get('ssc-cgl-2026__ssc-cgl-quant');

  const productDefinitions = [
    {
      title: 'BPSC 70th/71st CCE: Bihar Special Complete GK & History Topper Notes (Hindi Medium)',
      slug: 'bpsc-bihar-special-complete-gk-history-topper-notes-hindi',
      sectorId: sectorMap.get('state-govt-exams')._id,
      categoryId: categoryMap.get('bpsc-exams')._id,
      examNodeId: bpscExam._id,
      subjectId: bpscSpecialSub?._id,
      subject: 'Bihar Special GK & History',
      chapterNumber: 1,
      year: 2026,
      materialType: 'NOTES',
      medium: 'HINDI',
      accessType: 'PREMIUM',
      price: 199,
      discountedPrice: 99,
      fileKey: 'materials/bpsc/bpsc_bihar_special_topper_notes.pdf',
      previewKey: 'previews/bpsc/bpsc_bihar_special_preview.pdf',
      totalPages: 148,
      fileSizeBytes: 18452100,
      avgRating: 4.9,
      totalReviews: 342,
      searchTags: ['BPSC', 'Bihar Special', '70th BPSC', 'BPSC Prelims', 'Hindi Medium', 'Topper Notes', 'BPSC Mains'],
      isPassEligible: true,
      isPublished: true,
      totalDownloads: 4820,
      totalSales: 4820,
    },
    {
      title: 'BSEB Class 12 Physics (भौतिक विज्ञान) All Chapters Formula Sheet + Solved Numericals',
      slug: 'bseb-class-12-physics-handwritten-formula-sheet-numericals',
      sectorId: sectorMap.get('school-education')._id,
      categoryId: categoryMap.get('bseb-board')._id,
      examNodeId: bseb12Exam._id,
      subjectId: bsebPhySub?._id,
      subject: 'Physics (भौतिक विज्ञान - 12th)',
      chapterNumber: 2,
      year: 2026,
      materialType: 'NOTES',
      medium: 'HINDI',
      accessType: 'PREMIUM',
      price: 149,
      discountedPrice: 79,
      fileKey: 'materials/bseb/bseb_class12_physics_notes.pdf',
      previewKey: 'previews/bseb/bseb_class12_physics_preview.pdf',
      totalPages: 112,
      fileSizeBytes: 14200000,
      avgRating: 4.8,
      totalReviews: 215,
      searchTags: ['BSEB', 'Bihar Board', 'Class 12th', 'Physics', 'Inter Science', 'Hindi Medium', 'VVI Questions'],
      isPassEligible: true,
      isPublished: true,
      totalDownloads: 3240,
      totalSales: 3240,
    },
    {
      title: 'CBSE Class 10 Standard Math: 10-Year Chapterwise Solved PYQs + Formula Cheat Sheets',
      slug: 'cbse-class-10-standard-math-10-year-pyq-formula-sheet',
      sectorId: sectorMap.get('school-education')._id,
      categoryId: categoryMap.get('cbse-board')._id,
      examNodeId: cbse10Exam._id,
      subjectId: cbseMathSub?._id,
      subject: 'Mathematics Standard & Basic',
      chapterNumber: 5,
      year: 2026,
      materialType: 'SOLVED_PYQ',
      medium: 'ENGLISH',
      accessType: 'PREMIUM',
      price: 180,
      discountedPrice: 89,
      fileKey: 'materials/cbse/cbse_class10_math_pyq_bundle.pdf',
      previewKey: 'previews/cbse/cbse_class10_math_preview.pdf',
      totalPages: 186,
      fileSizeBytes: 22100000,
      avgRating: 4.9,
      totalReviews: 420,
      searchTags: ['CBSE', 'Class 10', 'Mathematics', 'Standard Math', 'PYQ', 'Board Exam 2026', 'Formula Sheet'],
      isPassEligible: true,
      isPublished: true,
      totalDownloads: 6150,
      totalSales: 6150,
    },
    {
      title: 'Indian Polity & Constitution Mind Maps (M. Laxmikanth 7th Edition Crud & Flowcharts)',
      slug: 'indian-polity-constitution-mindmaps-laxmikanth-summary',
      sectorId: sectorMap.get('central-govt-exams')._id,
      categoryId: categoryMap.get('upsc-civil-services')._id,
      examNodeId: upscExam._id,
      subjectId: bpscPolitySub?._id,
      subject: 'Indian Polity & Constitution',
      chapterNumber: 2,
      year: 2026,
      materialType: 'FORMULA_SHEET',
      medium: 'ENGLISH',
      accessType: 'PASS_ONLY',
      price: 249,
      discountedPrice: 129,
      fileKey: 'materials/upsc/upsc_polity_mindmaps_topper.pdf',
      previewKey: 'previews/upsc/upsc_polity_preview.pdf',
      totalPages: 96,
      fileSizeBytes: 16500000,
      avgRating: 5.0,
      totalReviews: 512,
      searchTags: ['UPSC', 'Polity', 'Laxmikanth', 'Mind Maps', 'CSE Prelims', 'State PCS', 'Constitution'],
      isPassEligible: true,
      isPublished: true,
      totalDownloads: 7420,
      totalSales: 7420,
    },
    {
      title: 'SSC CGL 2026: 1000+ Quantitative Aptitude Speed Calculation Tricks & Formula Compendium',
      slug: 'ssc-cgl-quant-speed-tricks-formula-sheet',
      sectorId: sectorMap.get('central-govt-exams')._id,
      categoryId: categoryMap.get('ssc-exams')._id,
      examNodeId: sscExam._id,
      subjectId: sscQuantSub?._id,
      subject: 'Quantitative Aptitude & Speed Tricks',
      chapterNumber: 4,
      year: 2026,
      materialType: 'FORMULA_SHEET',
      medium: 'BILINGUAL',
      accessType: 'FREE',
      price: 0,
      discountedPrice: 0,
      fileKey: 'materials/ssc/ssc_cgl_quant_tricks.pdf',
      previewKey: 'previews/ssc/ssc_cgl_quant_preview.pdf',
      totalPages: 134,
      fileSizeBytes: 15800000,
      avgRating: 4.8,
      totalReviews: 380,
      searchTags: ['SSC', 'SSC CGL', 'Quant Tricks', 'Math Shortcuts', 'Bilingual', 'CHSL', 'TCS PYQ', 'Free'],
      isPassEligible: true,
      isPublished: true,
      totalDownloads: 5210,
      totalSales: 5210,
    },
  ];

  for (const p of productDefinitions) {
    const doc = await PDFProduct.findOneAndUpdate(
      { slug: p.slug },
      { $set: p },
      { upsert: true, new: true }
    );
    console.log(`  ✓ PDF Product linked: "${doc.title}" [Subject: ${doc.subject}]`);
  }

  // STEP 7: AUTO-GENERATE TESTBOOK PASS BUNDLES
  console.log('\n--- [Step 7: Seed Testbook Pass Ecosystem (BundleOrPass)] ---');
  const passDefinitions = [
    {
      title: 'Bihar State Exams All-Access PDF Pass (2026-2027)',
      slug: 'bihar-state-exams-all-access-pass',
      passType: 'STATE_PASS',
      validityDays: 365,
      price: 199,
      discountedPrice: 99,
      includedExams: [bpscExam._id, examMap.get('bssc-inter-level')._id, examMap.get('bihar-police-si-constable')._id, bseb12Exam._id],
      featuresList: [
        'Unlimited access to all BPSC 70th/71st Notes & Solved Papers',
        'BSSC Inter Level & Daroga Special Subject Notes',
        'Instant dynamic watermarking with your phone number on every page',
        '365 Days validity with all future 2026 additions included',
      ],
      isActive: true,
    },
    {
      title: 'CBSE & ICSE Board Exam 10th/12th Topper Pass',
      slug: 'cbse-icse-board-topper-pass',
      passType: 'SCHOOL_BOARD_PASS',
      validityDays: 365,
      price: 149,
      discountedPrice: 79,
      includedExams: [cbse10Exam._id, examMap.get('cbse-class-12th-science')._id, examMap.get('icse-class-10th')._id],
      featuresList: [
        'Chapter-wise 10-Year Solved Board PYQs with Marking Scheme',
        'Formula Handbooks for Class 10 & 12 Science & Math',
        'High-Yield NCERT Exemplar & Mind Maps',
        'Unlimited PDF Downloads on phone and tablet',
      ],
      isActive: true,
    },
    {
      title: 'Central Govt Exams Mega Pass (SSC, RRB NTPC & UPSC)',
      slug: 'central-govt-exams-mega-pass',
      passType: 'CENTRAL_EXAM_PASS',
      validityDays: 365,
      price: 249,
      discountedPrice: 129,
      includedExams: [sscExam._id, examMap.get('rrb-ntpc-2026')._id, upscExam._id],
      featuresList: [
        'SSC CGL Tier 1 & 2 Math Speed Shortcuts & Vocab Flashcards',
        'RRB NTPC & ALP Complete General Science & Static GK Bank',
        'UPSC CSE Standard Book Summaries & Laxmikanth Mind Maps',
        'Lifetime access to purchased offline PDF notes',
      ],
      isActive: true,
    },
    {
      title: 'Testbook Ultimate All-Access VIP PDF Pass 2026',
      slug: 'testbook-ultimate-all-access-pass',
      passType: 'ULTIMATE_ALL_ACCESS',
      validityDays: 730,
      price: 399,
      discountedPrice: 199,
      includedExams: Array.from(examMap.values()).map((e) => e._id),
      featuresList: [
        'All 10,000+ Notes, Formula Sheets & Solved Papers Unlocked',
        'Covers Bihar State, Central Govt & School Boards simultaneously',
        '2 Years (730 Days) Extended Pass Validity',
        'Zero watermark download delays & priority customer support',
      ],
      isActive: true,
    },
  ];

  for (const pass of passDefinitions) {
    const doc = await BundleOrPass.findOneAndUpdate(
      { slug: pass.slug },
      { $set: pass },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Pass synced: "${doc.title}" [${doc.passType} | ₹${doc.discountedPrice || doc.price}]`);
  }

  // STEP 8: RECOMPUTE COUNTER CACHES FOR EXAMNODES
  console.log('\n--- [Step 8: Recompute Counter Caches (totalPdfsCount)] ---');
  const allExams = await ExamNode.find({});
  for (const exam of allExams) {
    const count = await PDFProduct.countDocuments({ examNodeId: exam._id, isPublished: true });
    await ExamNode.findByIdAndUpdate(exam._id, { $set: { totalPdfsCount: count } });
    console.log(`  ✓ ${exam.name}: ${count} PDF(s) cataloged.`);
  }

  console.log('\n=====================================================');
  console.log('🎉 MIGRATION & DEEP SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=====================================================');
  console.log(`• Total Sectors:      ${await Sector.countDocuments()}`);
  console.log(`• Total Categories:   ${await Category.countDocuments()}`);
  console.log(`• Total ExamNodes:    ${await ExamNode.countDocuments()}`);
  console.log(`• Total Subjects:     ${await Subject.countDocuments()}`);
  console.log(`• Total Passes:       ${await BundleOrPass.countDocuments()}`);
  console.log(`• Total Products:     ${await PDFProduct.countDocuments()}`);
  console.log('• User & Order collections were untouched and 100% preserved.');
  console.log('=====================================================\n');

  await mongoose.disconnect();
}

migrateAndSeed().catch(async (err) => {
  console.error('\n❌ Migration failed with error:');
  if (err.name === 'MongooseServerSelectionError' || err.message?.includes('whitelisted') || err.message?.includes('alert internal error')) {
    console.error('--------------------------------------------------------------------------');
    console.error('🔒 MONGODB ATLAS IP ACCESS RESTRICTION DETECTED');
    console.error('Your current public IP address needs to be whitelisted in MongoDB Atlas.');
    try {
      const res = await fetch('https://api.ipify.org');
      const ip = await res.text();
      console.error(`👉 Your current machine public IP: ${ip}`);
    } catch {}
    console.error('--------------------------------------------------------------------------');
    console.error('How to resolve in 30 seconds:');
    console.error('1. Open your MongoDB Atlas Dashboard (cloud.mongodb.com)');
    console.error('2. On the left sidebar under "SECURITY", click "Network Access"');
    console.error('3. Click the "+ ADD IP ADDRESS" button');
    console.error('4. Click "ADD CURRENT IP ADDRESS" (or enter 0.0.0.0/0 to allow from anywhere)');
    console.error('5. Click "Confirm" and wait 10 seconds for it to become Active.');
    console.error('6. Re-run: npm run db:migrate');
    console.error('--------------------------------------------------------------------------\n');
  } else {
    console.error(err);
  }
  process.exit(1);
});

