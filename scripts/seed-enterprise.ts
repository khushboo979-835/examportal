import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

// Fix Windows Node.js DNS SRV resolution for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupdf_marketplace';

// Inline Schema definitions for migration/seed isolation
const SectorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    icon: { type: String, default: 'GraduationCap' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  },
  { timestamps: true }
);

const ExamNodeSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    state: { type: String, default: 'National/Central', trim: true, index: true },
    iconUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    targetYear: { type: String, default: '2026-2027' },
    isTrending: { type: Boolean, default: false, index: true },
    totalPdfsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);
ExamNodeSchema.index({ state: 1, isTrending: -1 });

const ChapterSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

const SubjectSchema = new mongoose.Schema(
  {
    examNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    chapters: { type: [ChapterSchema], default: [] },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);
SubjectSchema.index({ examNodeId: 1, slug: 1 }, { unique: true });

const PDFProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    examNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamNode', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', index: true },
    materialType: {
      type: String,
      enum: ['NOTES', 'SOLVED_PYQ', 'MOCK_PAPER', 'FORMULA_SHEET', 'SYLLABUS_SUMMARY'],
      default: 'NOTES',
      required: true,
      index: true,
    },
    medium: {
      type: String,
      enum: ['HINDI', 'ENGLISH', 'BILINGUAL'],
      default: 'BILINGUAL',
      required: true,
      index: true,
    },
    accessType: {
      type: String,
      enum: ['FREE', 'PREMIUM', 'PASS_ONLY'],
      default: 'PREMIUM',
      required: true,
      index: true,
    },
    price: { type: Number, default: 0, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    fileKey: { type: String, required: true },
    previewKey: { type: String, required: true },
    totalPages: { type: Number, required: true, min: 1 },
    fileSizeBytes: { type: Number, required: true, min: 0 },
    avgRating: { type: Number, default: 5.0, min: 1, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    searchTags: [{ type: String, trim: true }],
    isPassEligible: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    totalDownloads: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);
PDFProductSchema.index({ title: 'text', searchTags: 'text' });
PDFProductSchema.index({ examNodeId: 1, subjectId: 1, materialType: 1, isPublished: 1 });

const MilestoneSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  theoryOverview: { type: String, default: '' },
  taskDescription: { type: String, required: true },
  resourceMaterialUrl: { type: String, default: '' },
  resourcePdfUrl: { type: String, default: '' },
  submissionType: {
    type: String,
    enum: ['GITHUB', 'DRIVE_LINK', 'LIVE_URL', 'DOCUMENT'],
    default: 'GITHUB',
  },
  estimatedHours: { type: Number, default: 18 },
});

const InternshipTrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    stream: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      required: true,
      index: true,
    },
    faculty: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      default: function (this: any) { return this.stream; },
      index: true,
    },
    nepAligned: { type: Boolean, default: true, index: true },
    creditHours: { type: Number, default: 75 },
    nepCurriculumHours: { type: Number, default: 75 },
    durationWeeks: { type: Number, default: 4, enum: [4, 8] },
    shortDescription: { type: String, required: true },
    learningOutcomes: [{ type: String }],
    milestones: [MilestoneSchema],
    fee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
InternshipTrackSchema.index({ stream: 1, isActive: 1 });

const SubmissionSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  submissionUrl: { type: String, default: '' },
  hostedLink: { type: String, default: '' },
  driveLink: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'SUBMITTED', 'UNDER_REVIEW', 'REVISIONS_REQUIRED', 'REJECTED', 'APPROVED'],
    default: 'SUBMITTED',
  },
  mentorFeedback: { type: String, default: '' },
});

const StudentInternshipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipTrack', required: true, index: true },
    studentName: { type: String, trim: true },
    studentEmail: { type: String, trim: true },
    studentPhone: { type: String, trim: true },
    collegeName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    degreeProgram: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['ENROLLED', 'IN_PROGRESS', 'REVIEW_PENDING', 'COMPLETED'],
      default: 'ENROLLED',
      index: true,
    },
    currentMilestone: { type: Number, default: 1 },
    isCompleted: { type: Boolean, default: false, index: true },
    startDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    submissions: [SubmissionSchema],
    certificateIssued: { type: Boolean, default: false, index: true },
    certificateId: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

const DDISCertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInternship' },
    studentName: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    stream: { type: String, required: true },
    faculty: { type: String },
    trackTitle: { type: String, required: true },
    degreeProgram: { type: String, default: 'Undergraduate Program' },
    durationWeeks: { type: Number, default: 4 },
    nepCurriculumHours: { type: Number, default: 75 },
    creditHours: { type: Number, default: 75 },
    grade: { type: String, default: 'A+ (Distinction)' },
    issueDate: { type: Date, default: Date.now },
    validityStatus: { type: String, enum: ['VALID', 'REVOKED'], default: 'VALID', index: true },
    qrCodeDataUrl: { type: String },
    pdfKey: { type: String },
    certificatePdfUrl: { type: String },
    verificationUrl: { type: String, required: true },
    accreditationAuthority: {
      type: String,
      default: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    role: { type: String, default: 'STUDENT' },
  },
  { timestamps: true }
);

const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ExamNode = mongoose.models.ExamNode || mongoose.model('ExamNode', ExamNodeSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const PDFProduct = mongoose.models.PDFProduct || mongoose.model('PDFProduct', PDFProductSchema);
const InternshipTrack = mongoose.models.InternshipTrack || mongoose.model('InternshipTrack', InternshipTrackSchema);
const StudentInternship = mongoose.models.StudentInternship || mongoose.model('StudentInternship', StudentInternshipSchema);
const DDISCertificate = mongoose.models.DDISCertificate || mongoose.model('DDISCertificate', DDISCertificateSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
  console.log('⚡ Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected successfully.');

  // 1. Seed Sectors
  console.log('🌱 Ensuring Sectors...');
  const sectorHigher = await Sector.findOneAndUpdate(
    { slug: 'higher-education' },
    { name: 'Higher & Technical Education (UG/PG)', slug: 'higher-education', icon: 'GraduationCap', displayOrder: 1 },
    { upsert: true, new: true }
  );

  const sectorState = await Sector.findOneAndUpdate(
    { slug: 'state-exams' },
    { name: 'State Government Examinations', slug: 'state-exams', icon: 'Award', displayOrder: 2 },
    { upsert: true, new: true }
  );

  const sectorCentral = await Sector.findOneAndUpdate(
    { slug: 'central-exams' },
    { name: 'Central Examinations (SSC/UPSC)', slug: 'central-exams', icon: 'ShieldCheck', displayOrder: 3 },
    { upsert: true, new: true }
  );

  // 2. Seed Categories
  console.log('🌱 Ensuring Categories...');
  const catBCA = await Category.findOneAndUpdate(
    { slug: 'bca-mca-tech' },
    { sectorId: sectorHigher._id, name: 'BCA & Computer Applications', slug: 'bca-mca-tech', shortCode: 'BCA' },
    { upsert: true, new: true }
  );

  const catBPSC = await Category.findOneAndUpdate(
    { slug: 'bihar-state-bpsc' },
    { sectorId: sectorState._id, name: 'BPSC & Bihar State Boards', slug: 'bihar-state-bpsc', shortCode: 'BPSC' },
    { upsert: true, new: true }
  );

  // 3. Seed ExamNodes
  console.log('🌱 Ensuring ExamNodes...');
  const examBPSC = await ExamNode.findOneAndUpdate(
    { slug: 'bpsc-70th-cce' },
    {
      categoryId: catBPSC._id,
      name: 'BPSC 70th Combined Competitive Exam (Prelims & Mains)',
      slug: 'bpsc-70th-cce',
      state: 'Bihar',
      targetYear: '2026-2027',
      isTrending: true,
      totalPdfsCount: 28,
    },
    { upsert: true, new: true }
  );

  const examBCA = await ExamNode.findOneAndUpdate(
    { slug: 'bca-semester-exams' },
    {
      categoryId: catBCA._id,
      name: 'BCA Semester Curriculum & Cloud Systems',
      slug: 'bca-semester-exams',
      state: 'National/Central',
      targetYear: '2026',
      isTrending: true,
      totalPdfsCount: 42,
    },
    { upsert: true, new: true }
  );

  // 4. Seed Subject with Chapters
  console.log('🌱 Ensuring Subjects with Embedded Chapters...');
  const subjectWeb = await Subject.findOneAndUpdate(
    { examNodeId: examBCA._id, slug: 'full-stack-web-architecture' },
    {
      examNodeId: examBCA._id,
      name: 'Full-Stack Web Architecture & Cloud APIs',
      slug: 'full-stack-web-architecture',
      displayOrder: 1,
      chapters: [
        { chapterNumber: 1, title: 'Server Components & Next.js Lifecycle', slug: 'server-components-lifecycle' },
        { chapterNumber: 2, title: 'MongoDB Atlas Aggregations & Compound Indexes', slug: 'mongodb-aggregations-indexes' },
        { chapterNumber: 3, title: 'Cloud Storage & Presigned Buffer Streams', slug: 'cloud-storage-presigned-streams' },
        { chapterNumber: 4, title: 'Production Security & CI/CD Deployment', slug: 'production-security-cicd' },
      ],
    },
    { upsert: true, new: true }
  );

  // 5. Seed Flagship Tracks from UI Screenshots
  console.log('🌱 Ensuring Flagship NEP-2020 Internship Tracks...');
  const flagshipTracks = [
    {
      title: 'Full-Stack Cloud Engineering (Next.js & MongoDB)',
      slug: 'full-stack-cloud-engineering-nextjs-mongodb',
      stream: 'BCA_IT',
      faculty: 'BCA_IT',
      nepAligned: true,
      creditHours: 75,
      nepCurriculumHours: 75,
      durationWeeks: 4,
      shortDescription:
        'Build production REST APIs, Next.js Server Components, authentication & Cloudflare storage for real-world DDIS clients...',
      learningOutcomes: [
        'Architect responsive Next.js App Router applications',
        'Model performant MongoDB collections with compound indexing',
        'Integrate cryptographic session authentication and file streams',
        'Deploy capstone projects to Vercel with zero downtime',
      ],
      milestones: [
        { weekNumber: 1, title: 'Architecture & DB', taskDescription: 'Design modular component hierarchy and MongoDB schemas with compound indexes.', submissionType: 'GITHUB', estimatedHours: 18 },
        { weekNumber: 2, title: 'API & Auth Setup', taskDescription: 'Implement secure session cookies, JWT authentication, and RESTful API endpoints.', submissionType: 'GITHUB', estimatedHours: 19 },
        { weekNumber: 3, title: 'Cloud Storage', taskDescription: 'Stream and upload file assets securely via presigned Cloudflare R2 / S3 URLs.', submissionType: 'GITHUB', estimatedHours: 19 },
        { weekNumber: 4, title: 'Capstone Deploy', taskDescription: 'Deploy live production application with CI/CD and complete college viva defense dossier.', submissionType: 'LIVE_URL', estimatedHours: 19 },
      ],
      fee: 0,
      isActive: true,
    },
    {
      title: 'Digital Marketing & Corporate E-Commerce Operations',
      slug: 'digital-marketing-corporate-ecommerce-operations',
      stream: 'COMMERCE',
      faculty: 'COMMERCE',
      nepAligned: true,
      creditHours: 60,
      nepCurriculumHours: 60,
      durationWeeks: 4,
      shortDescription:
        'Execute Technical SEO audits, Google Analytics 4 tracking funnels, Meta Ad spend simulations, and lead acquisition analysis.',
      learningOutcomes: [
        'Conduct full technical SEO audits and keyword intent mapping',
        'Implement GA4 conversion events and custom dimensions',
        'Simulate multichannel paid ad campaign budgets with ROI metrics',
        'Synthesize e-commerce growth reports for board presentation',
      ],
      milestones: [
        { weekNumber: 1, title: 'SEO On-Page Audit', taskDescription: 'Perform technical SEO audit on live client portal and produce action item report.', submissionType: 'DRIVE_LINK', estimatedHours: 15 },
        { weekNumber: 2, title: 'GA4 Events Setup', taskDescription: 'Configure conversion triggers, custom user parameters, and eCommerce checkout funnels.', submissionType: 'DOCUMENT', estimatedHours: 15 },
        { weekNumber: 3, title: 'Ad Budget Plan', taskDescription: 'Model ₹50,000 paid acquisition campaign across Google Search and Meta Ads with CAC forecasts.', submissionType: 'DRIVE_LINK', estimatedHours: 15 },
        { weekNumber: 4, title: 'Final ROI Report', taskDescription: 'Compile comprehensive attribution report and defend findings in virtual viva.', submissionType: 'DOCUMENT', estimatedHours: 15 },
      ],
      fee: 0,
      isActive: true,
    },
    {
      title: 'Scientific Computing & Experimental Data Analytics',
      slug: 'scientific-computing-experimental-data-analytics',
      stream: 'SCIENCE',
      faculty: 'SCIENCE',
      nepAligned: true,
      creditHours: 75,
      nepCurriculumHours: 75,
      durationWeeks: 4,
      shortDescription:
        'Process scientific measurements, regression modeling, and statistical charts using Python (NumPy, Pandas, Matplotlib).',
      learningOutcomes: [
        'Clean raw empirical lab datasets with outlier detection',
        'Generate publication-quality statistical visualizations',
        'Fit non-linear regression models with SciPy optimizations',
        'Draft scientific conference paper following UGC ethics',
      ],
      milestones: [
        { weekNumber: 1, title: 'Lab Dataset Clean', taskDescription: 'Normalize raw sensor telemetry data, handle null observations, and calculate confidence intervals.', submissionType: 'GITHUB', estimatedHours: 18 },
        { weekNumber: 2, title: 'Statistical Plots', taskDescription: 'Generate multi-panel heatmaps, distribution histograms, and ANOVA significance tests.', submissionType: 'GITHUB', estimatedHours: 19 },
        { weekNumber: 3, title: 'Curve Fitting Model', taskDescription: 'Execute non-linear curve fitting on laboratory kinetics data using SciPy minimize.', submissionType: 'GITHUB', estimatedHours: 19 },
        { weekNumber: 4, title: 'Academic Paper Draft', taskDescription: 'Author 4-page academic research summary formatted in IEEE two-column structure.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      ],
      fee: 0,
      isActive: true,
    },
    {
      title: 'Technical Content Writing & Digital Communications',
      slug: 'technical-content-writing-digital-communications',
      stream: 'ARTS',
      faculty: 'ARTS',
      nepAligned: true,
      creditHours: 60,
      nepCurriculumHours: 60,
      durationWeeks: 4,
      shortDescription:
        'Draft industry whitepapers, pedagogical learning modules, press communication kits, and public awareness campaigns.',
      learningOutcomes: [
        'Translate complex engineering architectures into accessible whitepapers',
        'Structure pedagogical modules adhering to NEP-2020 Bloom taxonomy',
        'Draft press releases for major product launches and media distributions',
        'Assemble professional content portfolio for corporate employment',
      ],
      milestones: [
        { weekNumber: 1, title: 'Academic Summary', taskDescription: 'Summarize 20-page UGC curriculum policy into a 2-page executive brief.', submissionType: 'DOCUMENT', estimatedHours: 15 },
        { weekNumber: 2, title: 'Whitepaper Structure', taskDescription: 'Draft technical whitepaper on AI in rural Indian education with citations.', submissionType: 'DRIVE_LINK', estimatedHours: 15 },
        { weekNumber: 3, title: 'PR Release Copy', taskDescription: 'Write formal press release announcing DDIS university accreditation with quote blocks.', submissionType: 'DOCUMENT', estimatedHours: 15 },
        { weekNumber: 4, title: 'Portfolio Dossier', taskDescription: 'Package all 4 written artifacts into a verified professional portfolio.', submissionType: 'DOCUMENT', estimatedHours: 15 },
      ],
      fee: 0,
      isActive: true,
    },
  ];

  for (const track of flagshipTracks) {
    await InternshipTrack.findOneAndUpdate(
      { slug: track.slug },
      { $set: track },
      { upsert: true, new: true }
    );
  }

  // 6. Seed Demo User
  console.log('🌱 Ensuring Demo User & Verified Certificate...');
  const demoUser = await User.findOneAndUpdate(
    { phone: '9876543210' },
    {
      name: 'Aditya Verma',
      phone: '9876543210',
      email: 'aditya.verma@patnauniversity.ac.in',
      role: 'STUDENT',
    },
    { upsert: true, new: true }
  );

  const itTrack = await InternshipTrack.findOne({ slug: 'full-stack-cloud-engineering-nextjs-mongodb' });

  // 7. Seed Student Internship
  const studentInternship = await StudentInternship.findOneAndUpdate(
    { certificateId: 'DDIS-NEP-2026-IT-9482' },
    {
      userId: demoUser._id,
      trackId: itTrack._id,
      studentName: 'Aditya Verma',
      studentPhone: '9876543210',
      studentEmail: 'aditya.verma@patnauniversity.ac.in',
      collegeName: 'Patna Science College, Patna University',
      rollNumber: 'PU-BCA-2024-089',
      degreeProgram: 'Bachelor of Computer Applications (BCA)',
      status: 'COMPLETED',
      currentMilestone: 4,
      isCompleted: true,
      certificateIssued: true,
      certificateId: 'DDIS-NEP-2026-IT-9482',
      completedDate: new Date('2026-09-15'),
      submissions: [
        {
          weekNumber: 1,
          submissionUrl: 'https://github.com/aditya-verma/edupdf-architecture',
          status: 'APPROVED',
          mentorFeedback: 'Outstanding schema design and indexing strategy. Fully approved.',
        },
        {
          weekNumber: 2,
          submissionUrl: 'https://github.com/aditya-verma/edupdf-api-auth',
          status: 'APPROVED',
          mentorFeedback: 'Clean session cookie management and JWT verification.',
        },
        {
          weekNumber: 3,
          submissionUrl: 'https://github.com/aditya-verma/edupdf-cloud-storage',
          status: 'APPROVED',
          mentorFeedback: 'S3 presigned pipeline verified with proper mime checks.',
        },
        {
          weekNumber: 4,
          submissionUrl: 'https://github.com/aditya-verma/edupdf-capstone',
          hostedLink: 'https://studyfreepdf.com',
          status: 'APPROVED',
          mentorFeedback: 'Superb capstone execution! Recommended for A+ Distinction.',
        },
      ],
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 8. Seed DDIS Certificate
  const certId = 'DDIS-NEP-2026-IT-9482';
  const verificationUrl = `https://studyfreepdf.com/verify/${certId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 1,
    width: 250,
    color: { dark: '#0F172A', light: '#FFFFFF' },
  });

  await DDISCertificate.findOneAndUpdate(
    { certificateId: certId },
    {
      certificateId: certId,
      userId: demoUser._id,
      internshipId: studentInternship._id,
      studentName: 'Aditya Verma',
      collegeName: 'Patna Science College, Patna University',
      stream: 'BCA / Computer Applications & IT',
      faculty: 'BCA_IT',
      trackTitle: 'Full-Stack Cloud Engineering (Next.js & MongoDB)',
      degreeProgram: 'Bachelor of Computer Applications (BCA)',
      durationWeeks: 4,
      creditHours: 75,
      nepCurriculumHours: 75,
      grade: 'A+ (Distinction)',
      issueDate: new Date('2026-09-15'),
      validityStatus: 'VALID',
      qrCodeDataUrl,
      verificationUrl,
      certificatePdfUrl: `/api/internship/generate-certificate?id=${certId}`,
      accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    },
    { upsert: true, new: true }
  );

  console.log('🎉 Enterprise seed and indexing completed successfully!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
