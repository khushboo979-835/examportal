require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const SectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: 'GraduationCap' },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortCode: { type: String, required: true },
}, { timestamps: true });

const ExamNodeSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  targetYear: { type: String, default: '2026' },
  isTrending: { type: Boolean, default: false },
}, { timestamps: true });

const PDFProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  examNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode', required: true },
  subject: { type: String, required: true },
  materialType: { type: String, required: true },
  medium: { type: String, required: true },
  accessType: { type: String, default: 'PREMIUM' },
  price: { type: Number, default: 0 },
  discountedPrice: { type: Number },
  fileKey: { type: String, required: true },
  previewKey: { type: String, required: true },
  totalPages: { type: Number, required: true },
  fileSizeBytes: { type: Number, required: true },
  searchTags: [{ type: String }],
  totalDownloads: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 1 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, default: 'STUDENT' },
  passExpiresAt: { type: Date },
  purchasedPDFs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDFProduct' }],
}, { timestamps: true });

const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ExamNode = mongoose.models.ExamNode || mongoose.model('ExamNode', ExamNodeSchema);
const PDFProduct = mongoose.models.PDFProduct || mongoose.model('PDFProduct', PDFProductSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
  console.log('Connecting to MongoDB Atlas Cluster0...');
  await mongoose.connect(MONGODB_URI);
  console.log('Successfully connected to MongoDB Atlas!');

  // Clear existing collections
  await Promise.all([
    Sector.deleteMany({}),
    Category.deleteMany({}),
    ExamNode.deleteMany({}),
    PDFProduct.deleteMany({}),
    User.deleteMany({}),
  ]);

  // 1. Sectors
  const schoolSector = await Sector.create({
    name: 'School Education (1st–12th)',
    slug: 'school-education',
    icon: 'GraduationCap',
    displayOrder: 1,
  });

  const stateSector = await Sector.create({
    name: 'State Govt Exams (BPSC / Police)',
    slug: 'state-govt-exams',
    icon: 'Flame',
    displayOrder: 2,
  });

  const centralSector = await Sector.create({
    name: 'Central Govt Exams (SSC / UPSC / RRB)',
    slug: 'central-govt-exams',
    icon: 'Sparkles',
    displayOrder: 3,
  });

  const gradSector = await Sector.create({
    name: 'Graduation & Tech Streams (BCA / MCA)',
    slug: 'higher-education',
    icon: 'BookOpen',
    displayOrder: 4,
  });

  // 2. Categories
  const bsebCategory = await Category.create({
    sectorId: schoolSector._id,
    name: 'Bihar School Examination Board',
    slug: 'bseb',
    shortCode: 'BSEB',
  });

  const cbseCategory = await Category.create({
    sectorId: schoolSector._id,
    name: 'Central Board of Secondary Education',
    slug: 'cbse',
    shortCode: 'CBSE',
  });

  const bpscCategory = await Category.create({
    sectorId: stateSector._id,
    name: 'Bihar Public Service Commission',
    slug: 'bpsc',
    shortCode: 'BPSC',
  });

  const sscCategory = await Category.create({
    sectorId: centralSector._id,
    name: 'Staff Selection Commission',
    slug: 'ssc',
    shortCode: 'SSC',
  });

  const upscCategory = await Category.create({
    sectorId: centralSector._id,
    name: 'Union Public Service Commission',
    slug: 'upsc',
    shortCode: 'UPSC',
  });

  const mcaCategory = await Category.create({
    sectorId: gradSector._id,
    name: 'MCA & BCA Semester Streams',
    slug: 'mca-bca',
    shortCode: 'MCA_BCA',
  });

  // 3. ExamNodes
  const bpsc70Exam = await ExamNode.create({
    categoryId: bpscCategory._id,
    name: 'BPSC 70th / 71st CCE (Pre + Mains)',
    slug: 'bpsc-70th-cce',
    description: 'Bihar Special GK, History, Polity, Geography, Budget & Previous 10-Year Solved Papers.',
    targetYear: '2026',
    isTrending: true,
  });

  const bseb12ScienceExam = await ExamNode.create({
    categoryId: bsebCategory._id,
    name: 'BSEB Class 12th Inter Science',
    slug: 'bseb-class-12-science',
    description: 'Bihar Board Class 12th Physics, Chemistry & Biology handwritten notes and model papers in Hindi.',
    targetYear: '2026',
    isTrending: true,
  });

  const cbse10Exam = await ExamNode.create({
    categoryId: cbseCategory._id,
    name: 'CBSE Class 10th Board Standard',
    slug: 'cbse-class-10th',
    description: 'NCERT aligned complete chapter notes, mind maps, formula sheets and 10-year PYQs.',
    targetYear: '2026',
    isTrending: true,
  });

  const sscCglExam = await ExamNode.create({
    categoryId: sscCategory._id,
    name: 'SSC CGL & CHSL Tier 1 & 2',
    slug: 'ssc-cgl-2026',
    description: 'Quantitative aptitude shortcuts, TCS 5000+ repeated questions and reasoning flashcards.',
    targetYear: '2026',
    isTrending: true,
  });

  const upscCseExam = await ExamNode.create({
    categoryId: upscCategory._id,
    name: 'UPSC Civil Services Examination (CSE)',
    slug: 'upsc-cse-prelims-mains',
    description: 'GS 1-4 standard book summaries, Laxmikanth Polity crux and modern history timelines.',
    targetYear: '2026',
    isTrending: false,
  });

  const mcaDsaExam = await ExamNode.create({
    categoryId: mcaCategory._id,
    name: 'MCA / BCA Data Structures & Algorithms',
    slug: 'mca-bca-dsa',
    description: 'University semester exam notes and FAANG interview preparation in C++ & Java.',
    targetYear: '2026',
    isTrending: false,
  });

  // 4. PDF Products
  await PDFProduct.create([
    {
      title: 'BPSC 70th/71st CCE: Bihar Special Complete GK & History Topper Notes (Hindi Medium)',
      slug: 'bpsc-bihar-special-complete-gk-history-topper-notes-hindi',
      sectorId: stateSector._id,
      categoryId: bpscCategory._id,
      examNodeId: bpsc70Exam._id,
      subject: 'Bihar Special & History',
      materialType: 'NOTES',
      medium: 'HINDI',
      accessType: 'PREMIUM',
      price: 199,
      discountedPrice: 99,
      fileKey: 'materials/bpsc/bpsc_bihar_special_topper_notes.pdf',
      previewKey: 'previews/bpsc/bpsc_bihar_special_preview.pdf',
      totalPages: 148,
      fileSizeBytes: 18452100,
      searchTags: ['BPSC', 'Bihar Special', '70th BPSC', 'BPSC Prelims', 'Hindi Medium', 'Topper Notes'],
      totalDownloads: 4820,
      totalSales: 4820,
      rating: 4.9,
      reviewCount: 342,
      isPublished: true,
    },
    {
      title: 'BSEB Class 12 Physics (भौतिक विज्ञान) All Chapters Formula Sheet + Solved Numericals',
      slug: 'bseb-class-12-physics-handwritten-formula-sheet-numericals',
      sectorId: schoolSector._id,
      categoryId: bsebCategory._id,
      examNodeId: bseb12ScienceExam._id,
      subject: 'Physics (भौतिक विज्ञान)',
      materialType: 'FORMULA_SHEET',
      medium: 'HINDI',
      accessType: 'PREMIUM',
      price: 149,
      discountedPrice: 79,
      fileKey: 'materials/bseb/bseb_class12_physics_notes.pdf',
      previewKey: 'previews/bseb/bseb_class12_physics_preview.pdf',
      totalPages: 112,
      fileSizeBytes: 14200000,
      searchTags: ['BSEB', 'Bihar Board', 'Class 12th', 'Physics', 'Inter Science', 'Hindi Medium'],
      totalDownloads: 3240,
      totalSales: 3240,
      rating: 4.8,
      reviewCount: 215,
      isPublished: true,
    },
    {
      title: 'CBSE Class 10 Standard Math: 10-Year Chapterwise Solved PYQs + Formula Cheat Sheets',
      slug: 'cbse-class-10-standard-math-10-year-pyq-formula-sheet',
      sectorId: schoolSector._id,
      categoryId: cbseCategory._id,
      examNodeId: cbse10Exam._id,
      subject: 'Mathematics',
      materialType: 'SOLVED_PYQ',
      medium: 'ENGLISH',
      accessType: 'PREMIUM',
      price: 180,
      discountedPrice: 89,
      fileKey: 'materials/cbse/cbse_class10_math_pyq_bundle.pdf',
      previewKey: 'previews/cbse/cbse_class10_math_preview.pdf',
      totalPages: 186,
      fileSizeBytes: 22100000,
      searchTags: ['CBSE', 'Class 10', 'Mathematics', 'Standard Math', 'PYQ', 'Board Exam 2026'],
      totalDownloads: 6150,
      totalSales: 6150,
      rating: 4.9,
      reviewCount: 420,
      isPublished: true,
    },
    {
      title: 'SSC CGL 2026: 1000+ Quantitative Aptitude Speed Calculation Tricks & Formula Compendium',
      slug: 'ssc-cgl-quant-speed-tricks-formula-sheet',
      sectorId: centralSector._id,
      categoryId: sscCategory._id,
      examNodeId: sscCglExam._id,
      subject: 'Quantitative Aptitude',
      materialType: 'FORMULA_SHEET',
      medium: 'BILINGUAL',
      accessType: 'PREMIUM',
      price: 179,
      discountedPrice: 89,
      fileKey: 'materials/ssc/ssc_cgl_quant_tricks.pdf',
      previewKey: 'previews/ssc/ssc_cgl_quant_preview.pdf',
      totalPages: 134,
      fileSizeBytes: 15800000,
      searchTags: ['SSC', 'SSC CGL', 'Quant Tricks', 'Math Shortcuts', 'Bilingual', 'TCS PYQ'],
      totalDownloads: 5210,
      totalSales: 5210,
      rating: 4.8,
      reviewCount: 380,
      isPublished: true,
    },
    {
      title: 'Indian Polity & Constitution Mind Maps (M. Laxmikanth 7th Edition Crud & Flowcharts)',
      slug: 'indian-polity-constitution-mindmaps-laxmikanth-summary',
      sectorId: centralSector._id,
      categoryId: upscCategory._id,
      examNodeId: upscCseExam._id,
      subject: 'Indian Polity',
      materialType: 'SYLLABUS_SUMMARY',
      medium: 'ENGLISH',
      accessType: 'PASS_ONLY',
      price: 249,
      discountedPrice: 129,
      fileKey: 'materials/upsc/upsc_polity_mindmaps_topper.pdf',
      previewKey: 'previews/upsc/upsc_polity_preview.pdf',
      totalPages: 96,
      fileSizeBytes: 16500000,
      searchTags: ['UPSC', 'Polity', 'Laxmikanth', 'Mind Maps', 'CSE Prelims', 'Constitution'],
      totalDownloads: 7420,
      totalSales: 7420,
      rating: 5.0,
      reviewCount: 512,
      isPublished: true,
    },
    {
      title: 'BSEB Class 12 Chemistry (रसायन शास्त्र) 5 Model Question Papers with 100% Solved Solutions',
      slug: 'bseb-class-12-chemistry-model-papers-solved-2026',
      sectorId: schoolSector._id,
      categoryId: bsebCategory._id,
      examNodeId: bseb12ScienceExam._id,
      subject: 'Chemistry (रसायन शास्त्र)',
      materialType: 'MOCK_PAPER',
      medium: 'HINDI',
      accessType: 'FREE',
      price: 0,
      fileKey: 'materials/bseb/bseb_class12_chem_model_papers.pdf',
      previewKey: 'previews/bseb/bseb_class12_chem_preview.pdf',
      totalPages: 88,
      fileSizeBytes: 11800000,
      searchTags: ['BSEB', 'Bihar Board', 'Class 12', 'Chemistry', 'Model Paper', 'Free PDF'],
      totalDownloads: 1980,
      totalSales: 1980,
      rating: 4.7,
      reviewCount: 140,
      isPublished: true,
    },
    {
      title: 'Data Structures & Algorithms Complete Semester + FAANG Interview Notes (C++ & Java)',
      slug: 'mca-bca-dsa-semester-and-interview-notes-cpp-java',
      sectorId: gradSector._id,
      categoryId: mcaCategory._id,
      examNodeId: mcaDsaExam._id,
      subject: 'Data Structures & Algorithms',
      materialType: 'NOTES',
      medium: 'ENGLISH',
      accessType: 'PREMIUM',
      price: 249,
      discountedPrice: 119,
      fileKey: 'materials/mca/dsa_mca_semester_notes.pdf',
      previewKey: 'previews/mca/dsa_mca_preview.pdf',
      totalPages: 220,
      fileSizeBytes: 28400000,
      searchTags: ['MCA', 'BCA', 'B.Tech', 'DSA', 'Data Structures', 'C++', 'Java'],
      totalDownloads: 3950,
      totalSales: 3950,
      rating: 4.9,
      reviewCount: 290,
      isPublished: true,
    },
  ]);

  // 5. User
  await User.create({
    name: 'Aarav Kumar',
    phone: '+91 7544065425',
    email: 'studyfreepdf2@gmail.com',
    role: 'STUDENT',
    passExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  console.log('✅ MongoDB Atlas Seed Completed Successfully!');
}

main()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error('Atlas connection/seed error:', err);
    process.exit(1);
  });
