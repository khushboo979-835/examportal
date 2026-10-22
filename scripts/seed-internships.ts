import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupdf_marketplace';

// Models
const MilestoneSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  taskDescription: { type: String, required: true },
  resourceMaterialUrl: { type: String, default: '' },
  submissionType: {
    type: String,
    enum: ['GITHUB', 'DRIVE_LINK', 'LIVE_URL', 'DOCUMENT'],
    default: 'GITHUB',
  },
});

const InternshipTrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    stream: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'MANAGEMENT'],
      required: true,
    },
    nepAligned: { type: Boolean, default: true },
    durationWeeks: { type: Number, default: 4 },
    shortDescription: { type: String, required: true },
    learningOutcomes: [{ type: String }],
    milestones: [MilestoneSchema],
    fee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubmissionSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  submissionUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['SUBMITTED', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED',
  },
  mentorFeedback: { type: String, default: '' },
});

const StudentInternshipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipTrack', required: true },
    studentName: { type: String },
    studentEmail: { type: String },
    studentPhone: { type: String },
    collegeName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    degreeProgram: { type: String, required: true },
    status: {
      type: String,
      enum: ['ENROLLED', 'IN_PROGRESS', 'REVIEW_PENDING', 'COMPLETED'],
      default: 'ENROLLED',
    },
    startDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    submissions: [SubmissionSchema],
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const DDISCertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInternship' },
    studentName: { type: String, required: true },
    collegeName: { type: String, required: true },
    stream: { type: String, required: true },
    trackTitle: { type: String, required: true },
    degreeProgram: { type: String, default: 'Undergraduate Program' },
    durationWeeks: { type: Number, default: 4 },
    grade: { type: String, default: 'A+' },
    issueDate: { type: Date, default: Date.now },
    validityStatus: { type: String, enum: ['VALID', 'REVOKED'], default: 'VALID' },
    certificatePdfUrl: { type: String },
    verificationUrl: { type: String, required: true },
    accreditationAuthority: {
      type: String,
      default: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, default: 'STUDENT' },
}, { timestamps: true });

const InternshipTrack = mongoose.models.InternshipTrack || mongoose.model('InternshipTrack', InternshipTrackSchema);
const StudentInternship = mongoose.models.StudentInternship || mongoose.model('StudentInternship', StudentInternshipSchema);
const DDISCertificate = mongoose.models.DDISCertificate || mongoose.model('DDISCertificate', DDISCertificateSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const seedTracks = [
  {
    title: 'Full-Stack Web Development (Next.js & MongoDB)',
    slug: 'full-stack-web-development-nextjs',
    stream: 'BCA_IT',
    nepAligned: true,
    durationWeeks: 4,
    shortDescription: 'Build production-ready full-stack cloud applications with Next.js App Router, Tailwind CSS, and MongoDB Atlas. NEP-2020 aligned hands-on industry internship.',
    learningOutcomes: [
      'Master Next.js App Router, React Server Components, and Server Actions',
      'Design production-ready MongoDB schemas with Mongoose and compound indexes',
      'Integrate cloud file storage (S3/R2) and payment gateways (Razorpay)',
      'Deploy resilient serverless web apps to Vercel with zero-downtime CI/CD',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Modern UI Engineering & Responsive Component Architecture',
        taskDescription: 'Create a responsive, accessible dashboard UI in Next.js using Tailwind CSS, Lucide Icons, and client/server component segregation. Host on GitHub.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/ui-guidelines',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 2,
        title: 'RESTful API & MongoDB Schema Design with Mongoose',
        taskDescription: 'Implement schema models with validations, unique constraints, and dynamic CRUD API routes with error handling and rate-limiting.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/mongoose-patterns',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 3,
        title: 'Authentication, State Management & Third-Party APIs',
        taskDescription: 'Integrate session authentication, stateful cart/library actions, and third-party webhook listeners with cryptographic signature checks.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/auth-and-webhooks',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 4,
        title: 'Capstone Deployment, Performance Auditing & Project Defense',
        taskDescription: 'Deploy the complete application to Vercel. Connect live MongoDB Atlas cluster, audit Lighthouse score > 90, and submit live URL and project report.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/nep-report-template',
        submissionType: 'LIVE_URL',
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Digital Marketing & E-Commerce Operations',
    slug: 'digital-marketing-ecommerce-operations',
    stream: 'COMMERCE',
    nepAligned: true,
    durationWeeks: 4,
    shortDescription: 'End-to-end e-commerce funnel optimization, SEO keyword audits, Google Analytics 4 tracking, and Meta Ad campaigns for DDIS client case studies.',
    learningOutcomes: [
      'Execute on-page & technical SEO audits with Schema.org rich snippets',
      'Set up Google Tag Manager and conversion tracking in GA4',
      'Design high-converting Meta and Google Search Ad campaigns with ROAS analysis',
      'Create data-driven e-commerce retention strategies and email workflows',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Comprehensive SEO & Competitor Keyword Research',
        taskDescription: 'Perform an in-depth keyword gap analysis for an educational marketplace. Identify 50 high-intent low-competition long-tail keywords.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/seo-audit-sheet',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 2,
        title: 'Conversion Rate Optimization (CRO) & Funnel Tear-down',
        taskDescription: 'Audit checkout funnels, bounce rates, and cart abandonments. Propose wireframes and copy changes that enhance trust and urgency.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/cro-framework',
        submissionType: 'DRIVE_LINK',
      },
      {
        weekNumber: 3,
        title: 'Paid Performance Marketing & Budget Allocation Strategy',
        taskDescription: 'Create a simulated ₹50,000 ad campaign budget allocation across Meta Ads and Google Search with targeting personas and expected CAC/LTV.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/paid-campaign-model',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 4,
        title: 'Final Analytics Dashboard & Executive Presentation Report',
        taskDescription: 'Build an interactive Looker Studio or Google Sheet dashboard consolidating metrics. Submit complete 15-page NEP internship report.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/looker-template',
        submissionType: 'DRIVE_LINK',
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Python for Scientific Computing & Data Analytics',
    slug: 'python-scientific-computing-data-analytics',
    stream: 'SCIENCE',
    nepAligned: true,
    durationWeeks: 4,
    shortDescription: 'Harness NumPy, Pandas, Matplotlib, and Scikit-Learn to process large scientific datasets, conduct statistical modeling, and generate research reports.',
    learningOutcomes: [
      'Clean, transform, and impute missing scientific data using Pandas',
      'Perform exploratory data analysis (EDA) with publication-quality visualizations',
      'Formulate statistical hypotheses and conduct ANOVA/Chi-square tests',
      'Train supervised predictive models with validation metrics (RMSE, F1-Score)',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Data Wrangling & Statistical Preprocessing',
        taskDescription: 'Import complex CSV/JSON datasets. Handle outliers, standardize features, and compute statistical moments using NumPy and Pandas.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/science-data-pack',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 2,
        title: 'Scientific Data Visualization & Exploratory Analysis',
        taskDescription: 'Create heatmaps, violin plots, and multi-variable distribution graphs using Seaborn and Matplotlib. Document observational inferences.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/viz-best-practices',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 3,
        title: 'Hypothesis Testing & Predictive Machine Learning Modeling',
        taskDescription: 'Train regression and classification models with Scikit-Learn. Evaluate cross-validation scores and plot confusion matrices.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/ml-evaluation-guide',
        submissionType: 'GITHUB',
      },
      {
        weekNumber: 4,
        title: 'Formal Scientific Project Report & Reproducibility Notebook',
        taskDescription: 'Assemble clean Jupyter Notebook with Markdown commentary. Generate formal PDF report ready for college university defense.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/scientific-format',
        submissionType: 'DRIVE_LINK',
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Technical Content Writing & Digital Brand Communications',
    slug: 'technical-content-writing-brand-communications',
    stream: 'ARTS',
    nepAligned: true,
    durationWeeks: 4,
    shortDescription: 'Author high-impact academic guides, whitepapers, press releases, and pedagogical summaries compliant with UGC and NEP-2020 frameworks.',
    learningOutcomes: [
      'Write structured technical documentation, API guides, and academic tutorials',
      'Master SEO copywriting, readability optimization (Flesch-Kincaid > 70), and tone control',
      'Draft institutional press releases and crisis communication statements',
      'Conduct rigorous research with proper APA/IEEE reference citations',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Academic & Technical Editorial Standards',
        taskDescription: 'Draft a 1,500-word comprehensive exam revision guide on an assigned subject topic with clear subheadings, key takeaways, and diagrams.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/style-guide',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 2,
        title: 'SEO Long-Form Articles & Schema-Ready Content',
        taskDescription: 'Write a 2,500-word pillar article targeting competitive exam aspirants. Include FAQs, meta descriptions, and internal linking structure.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/editorial-calendar',
        submissionType: 'DRIVE_LINK',
      },
      {
        weekNumber: 3,
        title: 'Corporate PR, Case Studies & Media Statements',
        taskDescription: 'Draft a formal case study highlighting student success with DDIS software solutions, plus an official press release announcement.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/pr-format',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 4,
        title: 'Comprehensive Portfolio & NEP Internship Dossier',
        taskDescription: 'Compile all 4 published pieces into a digital portfolio with performance analytics and submit the NEP College Internship Report.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/portfolio-template',
        submissionType: 'DRIVE_LINK',
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Product Operations & Business Analytics',
    slug: 'product-operations-business-analytics',
    stream: 'MANAGEMENT',
    nepAligned: true,
    durationWeeks: 4,
    shortDescription: 'Product roadmapping, user cohort analysis, churn prediction, and agile sprint coordination using modern edtech product telemetry.',
    learningOutcomes: [
      'Design product requirement documents (PRD) with user journey maps',
      'Analyze student engagement telemetry and feature adoption rates',
      'Conduct A/B test experiments and calculate statistical significance',
      'Lead agile sprint planning and product release retrospectives',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'User Problem Definition & PRD Documentation',
        taskDescription: 'Author a comprehensive Product Requirement Document (PRD) for a new study room feature, detailing user stories and acceptance criteria.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/prd-sample',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 2,
        title: 'Cohort Analysis & Retention Funnel Telemetry',
        taskDescription: 'Analyze weekly student cohort activity data. Calculate D1, D7, and D30 retention rates and identify friction points in the onboarding funnel.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/retention-sheet',
        submissionType: 'DRIVE_LINK',
      },
      {
        weekNumber: 3,
        title: 'A/B Testing Hypothesis & Experiment Design',
        taskDescription: 'Design an A/B test for pricing page variations. Calculate minimum sample size, define primary KPI, and document expected business impact.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/ab-test-framework',
        submissionType: 'DOCUMENT',
      },
      {
        weekNumber: 4,
        title: 'Executive Capstone Report & Professor Defense Presentation',
        taskDescription: 'Deliver a 15-slide executive presentation and complete NEP-2020 verified internship project report.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/presentation-template',
        submissionType: 'DRIVE_LINK',
      },
    ],
    fee: 0,
    isActive: true,
  },
];

async function seed() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.');

  // 1. Seed or Upsert Tracks
  console.log('🌱 Seeding NEP-2020 Internship Tracks...');
  for (const track of seedTracks) {
    await InternshipTrack.findOneAndUpdate(
      { slug: track.slug },
      { $set: track },
      { upsert: true, new: true }
    );
    console.log(`   ✓ Track: ${track.title} (${track.stream})`);
  }

  // 2. Seed Demo User
  let demoUser = await User.findOne({ phone: '+91-9876543210' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aditya Verma',
      phone: '+91-9876543210',
      email: 'aditya.verma@college.edu.in',
      role: 'STUDENT',
    });
    console.log('   ✓ Created Demo Student User: Aditya Verma');
  }

  const itTrack = await InternshipTrack.findOne({ slug: 'full-stack-web-development-nextjs' });
  if (itTrack) {
    // 3. Seed Demo Completed Student Internship
    const existingInternship = await StudentInternship.findOne({
      userId: demoUser._id,
      trackId: itTrack._id,
    });

    const certId = 'DDIS-NEP-2026-IT-9482';

    if (!existingInternship) {
      const internship = await StudentInternship.create({
        userId: demoUser._id,
        trackId: itTrack._id,
        studentName: 'Aditya Verma',
        studentEmail: 'aditya.verma@college.edu.in',
        studentPhone: '+91-9876543210',
        collegeName: 'Patna Science College, Patna University',
        rollNumber: 'PU-BCA-2023-089',
        degreeProgram: 'Bachelor of Computer Applications (BCA) - 3rd Year',
        status: 'COMPLETED',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedDate: new Date(),
        submissions: [
          {
            weekNumber: 1,
            submissionUrl: 'https://github.com/aditya-verma/ddis-responsive-dashboard',
            submittedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            status: 'APPROVED',
            mentorFeedback: 'Excellent semantic structure and Tailwind CSS design. Approved.',
          },
          {
            weekNumber: 2,
            submissionUrl: 'https://github.com/aditya-verma/ddis-mongo-crud-api',
            submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
            status: 'APPROVED',
            mentorFeedback: 'Clean Mongoose schema validations with compound indexes. Approved.',
          },
          {
            weekNumber: 3,
            submissionUrl: 'https://github.com/aditya-verma/ddis-auth-webhooks',
            submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: 'APPROVED',
            mentorFeedback: 'Proper HMAC SHA256 signature verification implemented. Approved.',
          },
          {
            weekNumber: 4,
            submissionUrl: 'https://edupdf-aditya.vercel.app',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'APPROVED',
            mentorFeedback: 'Outstanding capstone delivery! 94 Lighthouse score. Verified for DDIS Certification.',
          },
        ],
        certificateIssued: true,
        certificateId: certId,
      });

      console.log('   ✓ Created Demo Completed Internship for Aditya Verma');

      // 4. Seed Verified DDIS Certificate
      await DDISCertificate.findOneAndUpdate(
        { certificateId: certId },
        {
          $set: {
            certificateId: certId,
            userId: demoUser._id,
            internshipId: internship._id,
            studentName: 'Aditya Verma',
            collegeName: 'Patna Science College, Patna University',
            stream: 'BCA / Computer Applications & IT',
            trackTitle: 'Full-Stack Web Development (Next.js & MongoDB)',
            degreeProgram: 'Bachelor of Computer Applications (BCA) - 3rd Year',
            durationWeeks: 4,
            grade: 'A+ (Distinction)',
            issueDate: new Date(),
            validityStatus: 'VALID',
            verificationUrl: `https://studyfreepdf.com/verify/${certId}`,
            accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
          },
        },
        { upsert: true }
      );
      console.log(`   ✓ Seeded Verified DDIS Certificate: ${certId}`);
    }
  }

  // Also seed a second demo certificate for Commerce
  const commTrack = await InternshipTrack.findOne({ slug: 'digital-marketing-ecommerce-operations' });
  const commCertId = 'DDIS-NEP-2026-COM-8104';
  await DDISCertificate.findOneAndUpdate(
    { certificateId: commCertId },
    {
      $set: {
        certificateId: commCertId,
        userId: demoUser._id,
        studentName: 'Priya Sharma',
        collegeName: 'Vanijya Mahavidyalaya, Patna University',
        stream: 'B.Com / Commerce & Financial Operations',
        trackTitle: 'Digital Marketing & E-Commerce Operations',
        degreeProgram: 'Bachelor of Commerce (B.Com Hons) - Semester 5',
        durationWeeks: 4,
        grade: 'A+ (Distinction)',
        issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        validityStatus: 'VALID',
        verificationUrl: `https://studyfreepdf.com/verify/${commCertId}`,
        accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
      },
    },
    { upsert: true }
  );
  console.log(`   ✓ Seeded Verified DDIS Certificate: ${commCertId}`);

  console.log('\n🎉 NEP-2020 DDIS Internship Seed Complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
