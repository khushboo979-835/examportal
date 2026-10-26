import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupdf_marketplace';

// Inline Schema
const MilestoneSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  theoryOverview: { type: String, default: '' },
  taskDescription: { type: String, required: true },
  resourceMaterialUrl: { type: String, default: '' },
  submissionType: {
    type: String,
    enum: ['GITHUB', 'DRIVE_LINK', 'LIVE_URL', 'DOCUMENT'],
    default: 'GITHUB',
  },
  estimatedHours: { type: Number, default: 18 },
});

const InternshipTrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    stream: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      required: true,
    },
    faculty: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      default: function (this: any) { return this.stream; }
    },
    nepAligned: { type: Boolean, default: true },
    nepCurriculumHours: { type: Number, default: 75 },
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
  submissionUrl: { type: String, default: '' },
  hostedLink: { type: String, default: '' },
  driveLink: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'SUBMITTED', 'UNDER_REVIEW', 'REVISIONS_REQUIRED', 'REJECTED', 'APPROVED'],
    default: 'NOT_STARTED',
  },
  mentorFeedback: { type: String, default: '' },
  mentorNotes: { type: String, default: '' },
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
    currentMilestone: { type: Number, default: 1 },
    isCompleted: { type: Boolean, default: false },
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
    faculty: { type: String },
    trackTitle: { type: String, required: true },
    degreeProgram: { type: String, default: 'Undergraduate Program' },
    durationWeeks: { type: Number, default: 4 },
    nepCurriculumHours: { type: Number, default: 75 },
    grade: { type: String, default: 'A+ (Distinction)' },
    issueDate: { type: Date, default: Date.now },
    validityStatus: { type: String, enum: ['VALID', 'REVOKED'], default: 'VALID' },
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

const comprehensiveTracks = [
  // 1. Computer Applications & IT
  {
    title: 'Full-Stack Web Engineering (Next.js, TypeScript & MongoDB)',
    slug: 'full-stack-web-engineering-nextjs-typescript',
    stream: 'IT',
    faculty: 'IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Modern web engineering with Next.js App Router, TypeScript, serverless APIs, Tailwind CSS, and MongoDB Atlas indexing.',
    learningOutcomes: [
      'Architect full-stack applications with React Server Components',
      'Design production-ready MongoDB schemas with compound indexes',
      'Integrate cloud file uploads (S3/R2) and payment gateways (Razorpay)',
      'Deploy resilient serverless web apps with CI/CD on Vercel',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Modern UI Architecture & Component Systems',
        theoryOverview: 'Component-driven design, CSS Grid/Flexbox, accessibility, and client vs server components.',
        taskDescription: 'Create a responsive, accessible dashboard in Next.js using Tailwind CSS and Lucide Icons. Submit GitHub repository.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/ui-guidelines',
        submissionType: 'GITHUB',
        estimatedHours: 18,
      },
      {
        weekNumber: 2,
        title: 'RESTful Serverless APIs & MongoDB Mongoose Schemas',
        theoryOverview: 'Data modeling, schema validation, compound indexes, and aggregation pipelines.',
        taskDescription: 'Implement schema models with validations and dynamic CRUD API routes with error handling. Submit GitHub repository.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/mongoose-patterns',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 3,
        title: 'Authentication, Cryptographic Security & Webhooks',
        theoryOverview: 'JWT tokens, session cookies, rate-limiting, and webhook HMAC signature checks.',
        taskDescription: 'Integrate session authentication, state management, and third-party webhook verification. Submit GitHub repository.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/auth-and-webhooks',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 4,
        title: 'Production Capstone, Performance Auditing & Project Defense',
        theoryOverview: 'Lighthouse optimizations, bundle tracing, database caching, and viva defense presentation.',
        taskDescription: 'Deploy to Vercel with live MongoDB Atlas connection. Achieve Lighthouse score > 90 and submit live URL & project report.',
        resourceMaterialUrl: 'https://www.digitalinfinityddis.com/docs/nep-report-template',
        submissionType: 'LIVE_URL',
        estimatedHours: 19,
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Python & Machine Learning Essentials',
    slug: 'python-machine-learning-essentials',
    stream: 'IT',
    faculty: 'IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Supervised & unsupervised ML pipelines, feature engineering, NumPy, Pandas, Scikit-Learn, and model deployment via FastAPI.',
    learningOutcomes: [
      'Build end-to-end ML training pipelines with cross-validation',
      'Optimize hyperparameters using GridSearchCV and Bayesian optimization',
      'Evaluate classification & regression metrics (AUC-ROC, F1-Score)',
      'Deploy models as microservice endpoints with FastAPI & Docker',
    ],
    milestones: [
      { weekNumber: 1, title: 'Data Cleaning & Exploratory Feature Engineering', theoryOverview: 'Imputation, categorical encoding, feature scaling.', taskDescription: 'Clean raw student exam dataset, engineer 5 new features, and plot correlation heatmaps.', submissionType: 'GITHUB', estimatedHours: 18 },
      { weekNumber: 2, title: 'Supervised Model Benchmarking & Validation', theoryOverview: 'Bias-variance tradeoff, k-fold cross validation.', taskDescription: 'Train Random Forest, XGBoost, and Logistic Regression models. Compare precision/recall curves.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 3, title: 'Unsupervised Clustering & Dimensionality Reduction', theoryOverview: 'K-Means, DBSCAN, PCA component analysis.', taskDescription: 'Perform student learning style clustering and visualize high-dimensional clusters with PCA.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 4, title: 'FastAPI Microservice Deployment & Project Report', theoryOverview: 'REST APIs for inference, Docker containerization.', taskDescription: 'Wrap best model in FastAPI. Deploy to Render/HuggingFace and compile NEP viva report.', submissionType: 'LIVE_URL', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Mobile Application Development (React Native)',
    slug: 'mobile-app-development-react-native',
    stream: 'IT',
    faculty: 'IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Cross-platform iOS and Android mobile app development with React Native, Expo, offline caching, and biometric authentication.',
    learningOutcomes: [
      'Build performant mobile screens with React Native core components',
      'Handle offline persistence with SQLite and Async Storage',
      'Integrate device native APIs (Camera, Biometrics, Push Notifications)',
      'Publish preview builds to Expo Application Services (EAS)',
    ],
    milestones: [
      { weekNumber: 1, title: 'Expo Router Navigation & Screen Layouts', theoryOverview: 'Stack navigation, Tab bars, dynamic headers.', taskDescription: 'Create a 5-screen study app navigation flow with Expo Router and custom bottom tabs.', submissionType: 'GITHUB', estimatedHours: 18 },
      { weekNumber: 2, title: 'Offline-First PDF Reader & Local Storage', theoryOverview: 'File system caching, SQLite database schemas.', taskDescription: 'Implement local bookmarking and offline caching for downloaded study materials.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 3, title: 'Device Sensors, Camera & Push Notifications', theoryOverview: 'Native hardware integration, permissions lifecycle.', taskDescription: 'Add document scanning with device camera and local notification reminders.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 4, title: 'EAS Build, Release Candidate & Viva Presentation', theoryOverview: 'APK packaging, performance profiling, memory leaks.', taskDescription: 'Generate an installable Android APK via Expo EAS and prepare college viva presentation.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Cloud Infrastructure & DevOps Fundamentals',
    slug: 'cloud-infrastructure-devops-fundamentals',
    stream: 'IT',
    faculty: 'IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Linux server administration, Docker containerization, CI/CD automation with GitHub Actions, and AWS/Cloudflare edge networking.',
    learningOutcomes: [
      'Automate testing and deployment with GitHub Actions CI/CD workflows',
      'Containerize full-stack applications with multi-stage Dockerfiles',
      'Configure NGINX reverse proxies, SSL/TLS, and Cloudflare CDN caching',
      'Provision cloud infrastructure with Terraform / AWS S3 & CloudFront',
    ],
    milestones: [
      { weekNumber: 1, title: 'Linux System Administration & NGINX Reverse Proxy', theoryOverview: 'Bash scripting, systemd services, firewall UFW.', taskDescription: 'Set up an Ubuntu server with NGINX reverse proxy, Let\'s Encrypt SSL, and log rotation.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Multi-Stage Docker Packaging & Docker Compose', theoryOverview: 'Layer caching, non-root user security, container networks.', taskDescription: 'Create production Dockerfile for Next.js app and docker-compose.yml for MongoDB + app.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 3, title: 'Automated CI/CD Pipelines with GitHub Actions', theoryOverview: 'GitHub Actions syntax, secrets management, automated tests.', taskDescription: 'Write a pipeline that runs unit tests, builds Docker image, and pushes to Docker Hub.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 4, title: 'Cloud Monitoring, Uptime Auditing & Capstone Defense', theoryOverview: 'Prometheus metrics, Grafana dashboards, health checks.', taskDescription: 'Deploy live stack with automated health check alerts and submit complete NEP report.', submissionType: 'LIVE_URL', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },

  // 2. Science (UG & PG) - 60–75 Hours Framework
  {
    title: 'Computational Data Analysis with Python & Pandas',
    slug: 'computational-data-analysis-python-pandas',
    stream: 'SCIENCE',
    faculty: 'SCIENCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Process large scientific datasets, conduct statistical modeling, compute confidence intervals, and visualize experimental results.',
    learningOutcomes: [
      'Clean, transform, and impute missing scientific data using Pandas',
      'Conduct exploratory data analysis (EDA) with publication-quality charts',
      'Formulate hypotheses and execute ANOVA/t-test significance tests',
      'Assemble reproducible Jupyter Notebooks for college thesis defense',
    ],
    milestones: [
      { weekNumber: 1, title: 'Data Wrangling & Statistical Preprocessing', theoryOverview: 'Missing value imputation, standard scaling, outliers.', taskDescription: 'Import complex CSV/JSON datasets. Standardize features and compute moments with NumPy/Pandas.', submissionType: 'GITHUB', estimatedHours: 18 },
      { weekNumber: 2, title: 'Scientific Data Visualization with Seaborn', theoryOverview: 'Violin plots, correlation matrices, multi-panel grids.', taskDescription: 'Create 8 publication-ready figures representing experimental trends and write observations.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 3, title: 'Hypothesis Testing & Statistical Inference', theoryOverview: 'Null hypothesis, p-values, ANOVA, Mann-Whitney U tests.', taskDescription: 'Formulate 3 scientific research questions, compute p-values, and validate assumptions.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Scientific Project Report & Reproducibility Notebook', theoryOverview: 'Research paper structure, APA formatting, viva defense.', taskDescription: 'Assemble clean Jupyter Notebook with Markdown commentary. Generate formal PDF report.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Scientific Research Methodology & Technical Documentation',
    slug: 'scientific-research-methodology-technical-documentation',
    stream: 'SCIENCE',
    faculty: 'SCIENCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Formulate research problem statements, conduct literature reviews, manage citations (Zotero/Mendeley), and write peer-review grade manuscripts.',
    learningOutcomes: [
      'Conduct systematic literature searches across Google Scholar & PubMed',
      'Format academic manuscripts in LaTeX and Overleaf',
      'Adhere to ethics, zero-plagiarism policies, and peer-review rigor',
      'Defend research findings before an institutional evaluation board',
    ],
    milestones: [
      { weekNumber: 1, title: 'Literature Review & Citation Matrix', theoryOverview: 'Boolean search strings, PRISMA flowcharts, bibliography tools.', taskDescription: 'Create a 20-paper literature review matrix with critical appraisal and citation library.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Experimental Methodology & Protocol Design', theoryOverview: 'Control variables, sample sizing, error budgeting.', taskDescription: 'Draft a complete research methodology section detailing step-by-step laboratory/computational protocols.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'LaTeX Manuscript Authoring in Overleaf', theoryOverview: 'LaTeX syntax, mathematical equations, BibTeX citations.', taskDescription: 'Typeset an 8-page scientific paper in IEEE/Elsevier format on Overleaf with embedded equations.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 4, title: 'Final Defense Presentation & NEP Project Dossier', theoryOverview: 'Viva presentation delivery, handling faculty cross-examination.', taskDescription: 'Prepare a 15-slide PowerPoint viva deck and finalized NEP College Project Dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Environmental Quality Assessment & GIS Data Mapping',
    slug: 'environmental-quality-assessment-gis-mapping',
    stream: 'SCIENCE',
    faculty: 'SCIENCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Satellite imagery analysis, air/water quality index modeling, QGIS spatial mapping, and environmental impact assessment (EIA).',
    learningOutcomes: [
      'Analyze spatial GIS shapefiles and raster datasets using QGIS',
      'Calculate Air Quality Index (AQI) and Water Quality Index (WQI)',
      'Map urban pollution hotspots and land-use land-cover (LULC) changes',
      'Draft Environmental Impact Assessment (EIA) baseline summaries',
    ],
    milestones: [
      { weekNumber: 1, title: 'AQI & WQI Environmental Baseline Modeling', theoryOverview: 'Pollution parameters (PM2.5, PM10, BOD, COD, Heavy metals).', taskDescription: 'Compute 30-day AQI and WQI indices for a metropolitan district using Central Pollution Control Board data.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Spatial Mapping & Layering in QGIS', theoryOverview: 'Coordinate reference systems (CRS), vector polygons, heatmaps.', taskDescription: 'Import district shapefiles into QGIS. Generate an interpolated heatmap of environmental hotspots.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 3, title: 'Satellite LULC Change Detection Analysis', theoryOverview: 'Landsat / Sentinel bands, NDVI calculation.', taskDescription: 'Calculate Normalized Difference Vegetation Index (NDVI) and quantify green cover changes.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'EIA Project Report & College Viva Defense', theoryOverview: 'Statutory environmental regulations, mitigation planning.', taskDescription: 'Draft a 15-page EIA report with high-resolution map figures and submit NEP project dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Statistical Analysis for Biological & Chemical Sciences',
    slug: 'statistical-analysis-biological-chemical-sciences',
    stream: 'SCIENCE',
    faculty: 'SCIENCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Dose-response curve fitting, IC50 estimation, enzyme kinetics modeling, regression analysis, and biological assay verification.',
    learningOutcomes: [
      'Fit Michaelis-Menten kinetics and non-linear regression curves',
      'Calculate IC50 / LD50 values with 95% confidence intervals',
      'Perform multivariate clustering on biological assays',
      'Document analytical chemistry / biology verification reports',
    ],
    milestones: [
      { weekNumber: 1, title: 'Enzyme Kinetics & Non-Linear Regression', theoryOverview: 'Michaelis-Menten kinetics, Lineweaver-Burk transformations.', taskDescription: 'Fit reaction velocity data to non-linear Michaelis-Menten equation and determine Vmax and Km.', submissionType: 'GITHUB', estimatedHours: 18 },
      { weekNumber: 2, title: 'Dose-Response Modeling & IC50 Determination', theoryOverview: 'Sigmoidal 4-parameter logistic (4PL) regression.', taskDescription: 'Calculate IC50 values and standard errors for 3 pharmaceutical compounds using Python.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'Assay Variability & Quality Control Analytics', theoryOverview: 'Z-factor calculation, coefficient of variation (%CV).', taskDescription: 'Compute Z-factor for a 96-well plate screening assay and identify borderline outliers.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Comprehensive Analytical Report & Viva Dossier', theoryOverview: 'Good Laboratory Practice (GLP) documentation.', taskDescription: 'Assemble complete analytical dossier with formatted figures and submit NEP completion report.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },

  // 3. Commerce & Management (UG & PG)
  {
    title: 'Corporate Digital Marketing & Performance Ad Analytics',
    slug: 'corporate-digital-marketing-performance-ad-analytics',
    stream: 'COMMERCE',
    faculty: 'COMMERCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'E-commerce funnel optimization, SEO keyword audits, Google Analytics 4 tracking, and Meta Ad campaigns for DDIS client case studies.',
    learningOutcomes: [
      'Execute technical SEO audits with Schema.org rich snippets',
      'Set up Google Tag Manager events and conversion tracking in GA4',
      'Design high-converting Meta and Google Search Ad campaigns with ROAS models',
      'Formulate retention email marketing flows and customer LTV models',
    ],
    milestones: [
      { weekNumber: 1, title: 'Comprehensive SEO & Competitor Keyword Research', theoryOverview: 'Search intent, keyword difficulty, topic clusters.', taskDescription: 'Perform keyword gap analysis for edtech marketplace. Identify 50 high-intent keywords.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Conversion Rate Optimization (CRO) & Funnel Tear-down', theoryOverview: 'Checkout friction, heatmaps, psychological triggers.', taskDescription: 'Audit checkout funnels, cart abandonment points, and write CRO recommendations.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 3, title: 'Paid Performance Marketing & Budget Allocation', theoryOverview: 'Targeting personas, CAC, ROAS, bidding strategies.', taskDescription: 'Create a simulated ₹50,000 ad campaign budget allocation across Meta and Google Search.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Final Analytics Dashboard & Executive Report', theoryOverview: 'Looker Studio dashboards, executive communication.', taskDescription: 'Build an interactive Looker Studio dashboard consolidating metrics. Submit NEP report.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Financial Modeling & E-Commerce Business Operations',
    slug: 'financial-modeling-ecommerce-operations',
    stream: 'COMMERCE',
    faculty: 'COMMERCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: '3-statement financial modeling in Excel, discounted cash flow (DCF) valuation, unit economics (CAC/LTV), and e-commerce inventory forecasting.',
    learningOutcomes: [
      'Build dynamic 3-statement financial models (P&L, Balance Sheet, Cash Flow)',
      'Perform DCF valuation with WACC and sensitivity tables',
      'Calculate e-commerce contribution margins and inventory turnover ratios',
      'Draft investor-grade financial pitch decks and valuation memos',
    ],
    milestones: [
      { weekNumber: 1, title: '3-Statement Financial Modeling in Excel', theoryOverview: 'Interlinked revenue drivers, working capital schedules.', taskDescription: 'Build an automated 3-statement model forecasting 3-year revenue and operating expenses.', submissionType: 'DRIVE_LINK', estimatedHours: 18 },
      { weekNumber: 2, title: 'DCF Valuation & Sensitivity Analysis', theoryOverview: 'Cost of capital, terminal growth, sensitivity tables.', taskDescription: 'Value an edtech marketplace using DCF methodology. Construct two-way sensitivity matrix.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'E-Commerce Unit Economics & Cohort Retention', theoryOverview: 'Contribution margin, CAC payback period, cohort decay.', taskDescription: 'Calculate gross margins, payback periods, and identify break-even orders for subscription passes.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Executive Valuation Memo & Viva Presentation', theoryOverview: 'Communicating financial insights to corporate stakeholders.', taskDescription: 'Author a 10-page financial report with summary charts and prepare viva presentation.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Brand Reputation Management & Client Acquisition Strategies',
    slug: 'brand-reputation-management-client-acquisition',
    stream: 'COMMERCE',
    faculty: 'COMMERCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Online reputation management (ORM), B2B sales pipelines, cold outreach sequence design, and crisis communication strategies.',
    learningOutcomes: [
      'Design multi-touch B2B outbound email and LinkedIn sequences',
      'Monitor brand sentiment and resolve customer escalations',
      'Build sales qualification frameworks (BANT, MEDDIC)',
      'Calculate sales pipeline velocity and customer acquisition costs',
    ],
    milestones: [
      { weekNumber: 1, title: 'B2B Ideal Customer Profile (ICP) & Lead Scoping', theoryOverview: 'Market sizing, buyer personas, value propositions.', taskDescription: 'Define target persona for institutional college partnerships and build a 50-lead database.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Outbound Cold Email & LinkedIn Pitch Sequences', theoryOverview: 'Subject line optimization, copywriting, follow-up cadence.', taskDescription: 'Draft a 4-step personalized outreach email sequence with objection-handling responses.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'Online Reputation & Crisis Management Playbook', theoryOverview: 'Sentiment analysis, public review management, PR response.', taskDescription: 'Create a brand reputation management standard operating procedure (SOP) for DDIS products.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Pipeline Velocity Dashboard & Project Defense', theoryOverview: 'Sales pipeline metrics, conversion rates, viva defense.', taskDescription: 'Present sales strategy deck and complete NEP-2020 verified internship project report.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Business Accounting & GST Compliance Simulation',
    slug: 'business-accounting-gst-compliance-simulation',
    stream: 'COMMERCE',
    faculty: 'COMMERCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Double-entry bookkeeping, GST return filing workflows (GSTR-1, GSTR-3B), TDS reconciliation, and financial statement closing.',
    learningOutcomes: [
      'Record complex journal vouchers and ledger entries in Tally/Excel',
      'Simulate monthly GSTR-1 and GSTR-3B tax calculations',
      'Reconcile Input Tax Credit (ITC) with GSTR-2B',
      'Prepare trial balances, adjustments, and final accounts',
    ],
    milestones: [
      { weekNumber: 1, title: 'Double-Entry Bookkeeping & General Ledger Closing', theoryOverview: 'Accounting standards, accruals, depreciation schedules.', taskDescription: 'Record 50 business transactions for an edtech company and generate an adjusted trial balance.', submissionType: 'DRIVE_LINK', estimatedHours: 18 },
      { weekNumber: 2, title: 'GST Calculation & GSTR-1/3B Simulation', theoryOverview: 'CGST, SGST, IGST rules, reverse charge mechanism.', taskDescription: 'Calculate monthly output tax liability, eligible ITC, and draft sample GSTR-3B statement.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'TDS Deduction & Bank Reconciliation Statement (BRS)', theoryOverview: 'TDS sections 194C, 194J, timing differences.', taskDescription: 'Prepare Bank Reconciliation Statement and compute TDS liability on professional fees.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Annual Financial Closing & NEP College Report', theoryOverview: 'Balance sheet disclosures, statutory compliance, viva defense.', taskDescription: 'Finalize Balance Sheet & Profit/Loss statement. Submit complete NEP dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },

  // 4. Arts & Humanities (UG & PG)
  {
    title: 'Digital Journalism, Copywriting & Media Communications',
    slug: 'digital-journalism-copywriting-media-communications',
    stream: 'ARTS',
    faculty: 'ARTS',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Digital news reporting, investigative journalism ethics, SEO copywriting, media press releases, and editorial management.',
    learningOutcomes: [
      'Author investigative and explanatory journalism stories',
      'Master SEO copywriting, headline hooks, and readability metrics',
      'Adhere to Press Council of India ethical standards and fact-checking',
      'Design digital publication newsletters and multimedia features',
    ],
    milestones: [
      { weekNumber: 1, title: 'Investigative Feature Story & Fact-Checking', theoryOverview: 'Source verification, inverted pyramid structure, ethics.', taskDescription: 'Author a 1,500-word investigative feature on higher education reform with verified citations.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'SEO Copywriting & Long-Form Editorial Content', theoryOverview: 'Search intent, meta tags, scannability, voice tone.', taskDescription: 'Write a 2,500-word pillar article for competitive exam aspirants with FAQs and schema tags.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 3, title: 'Corporate Press Releases & Crisis Media Statements', theoryOverview: 'PR distribution channels, embargoed releases, media briefs.', taskDescription: 'Draft a formal institutional press release announcing DDIS NEP-2020 student partnerships.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'Comprehensive Editorial Portfolio & Viva Dossier', theoryOverview: 'Curating published clippings, viva presentation.', taskDescription: 'Compile digital portfolio with analytics and submit finalized NEP college report.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Public Relations & Social Media Outreach Management',
    slug: 'public-relations-social-media-outreach-management',
    stream: 'ARTS',
    faculty: 'ARTS',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Social media strategy, corporate storytelling, influencer collaboration frameworks, and brand perception auditing.',
    learningOutcomes: [
      'Create multi-platform content calendars (LinkedIn, X, Instagram)',
      'Manage influencer campaign briefs and contractual deliverables',
      'Measure engagement rates, sentiment scores, and viral coefficients',
      'Produce crisis PR talking points and media monitoring reports',
    ],
    milestones: [
      { weekNumber: 1, title: 'Social Media Audit & Content Calendar Architecture', theoryOverview: 'Platform algorithms, audience demographics, content pillars.', taskDescription: 'Conduct a competitive social media audit and design a 30-day cross-platform content calendar.', submissionType: 'DRIVE_LINK', estimatedHours: 18 },
      { weekNumber: 2, title: 'LinkedIn Thought Leadership & Executive Storytelling', theoryOverview: 'Professional networking, hook writing, engagement pods.', taskDescription: 'Write 8 high-engagement LinkedIn thought-leadership posts for tech/education leaders.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'Influencer & Campus Ambassador Program Design', theoryOverview: 'Micro-influencer ROI, ambassador incentives, deliverables.', taskDescription: 'Design an end-to-end college campus ambassador program guide and agreement template.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 4, title: 'PR Campaign Performance Report & Defense Deck', theoryOverview: 'Metrics reporting, executive summary, viva defense.', taskDescription: 'Consolidate campaign analytics into a formal report and prepare college viva presentation.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Archival Research & Digital Humanities Content Structuring',
    slug: 'archival-research-digital-humanities-content',
    stream: 'ARTS',
    faculty: 'ARTS',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Historical text digitization, digital archive curation, metadata standard categorization (Dublin Core), and cultural asset preservation.',
    learningOutcomes: [
      'Structure primary historical sources with Dublin Core metadata standards',
      'Transcribe, annotate, and contextualize public historical records',
      'Build digital humanities exhibitions using open-source tools (Omeka/StoryMap)',
      'Adhere to copyright, fair use, and cultural heritage ethics',
    ],
    milestones: [
      { weekNumber: 1, title: 'Primary Source Taxonomy & Dublin Core Metadata', theoryOverview: 'Dublin Core 15 elements, controlled vocabularies.', taskDescription: 'Catalog 25 historical educational artifacts with full Dublin Core metadata tagging.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Digital Transcription & Historical Contextualization', theoryOverview: 'Transcription accuracy, critical annotation, footnoting.', taskDescription: 'Transcribe 3 historical educational circulars and write explanatory scholarly notes.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'Interactive Narrative Mapping (StoryMap / Timeline)', theoryOverview: 'Geospatial storytelling, chronological sequencing.', taskDescription: 'Create a spatial timeline mapping the evolution of university education in India.', submissionType: 'LIVE_URL', estimatedHours: 19 },
      { weekNumber: 4, title: 'Digital Humanities Exhibition & Viva Dossier', theoryOverview: 'Exhibition curation, viva defense presentation.', taskDescription: 'Assemble curated digital exhibition with catalog essay and submit NEP completion dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },

  // 5. Polytechnic & Vocational Programs
  {
    title: 'IoT & Embedded Hardware Fundamentals',
    slug: 'iot-embedded-hardware-fundamentals',
    stream: 'VOCATIONAL',
    faculty: 'VOCATIONAL',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Microcontroller programming (ESP32 / Arduino), sensor interfacing (temperature, ultrasonic), MQTT cloud telemetry, and IoT dashboarding.',
    learningOutcomes: [
      'Interface analog/digital sensors with ESP32 and Arduino microcontrollers',
      'Transmit real-time telemetry over Wi-Fi using MQTT protocol',
      'Build responsive IoT monitoring dashboards (ThingSpeak / Adafruit IO)',
      'Design power-efficient embedded firmware with sleep modes',
    ],
    milestones: [
      { weekNumber: 1, title: 'Microcontroller Architecture & GPIO Sensor Interfacing', theoryOverview: 'I2C, SPI, UART protocols, digital/analog GPIOs.', taskDescription: 'Simulate/program ESP32 to read temperature and distance sensors with serial debugging.', submissionType: 'GITHUB', estimatedHours: 18 },
      { weekNumber: 2, title: 'Wi-Fi Networking & MQTT Cloud Data Publishing', theoryOverview: 'MQTT brokers, publish-subscribe model, QoS levels.', taskDescription: 'Publish sensor telemetry to an MQTT broker every 5 seconds with connection retry logic.', submissionType: 'GITHUB', estimatedHours: 19 },
      { weekNumber: 3, title: 'Real-Time IoT Cloud Dashboard & Alert Automation', theoryOverview: 'Cloud dashboards, webhook triggers, threshold alerts.', taskDescription: 'Create a live dashboard graphing real-time metrics with automated threshold email alerts.', submissionType: 'LIVE_URL', estimatedHours: 19 },
      { weekNumber: 4, title: 'IoT Capstone Circuit & College Viva Project Report', theoryOverview: 'Schematic documentation, circuit diagrams, viva defense.', taskDescription: 'Document complete hardware schematic, code repository, and submit NEP internship dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'UI/UX Design Systems & Design Thinking with Figma',
    slug: 'ui-ux-design-systems-design-thinking-figma',
    stream: 'VOCATIONAL',
    faculty: 'VOCATIONAL',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Human-centered design thinking, user journey mapping, design systems with Figma auto-layout, interactive prototyping, and usability testing.',
    learningOutcomes: [
      'Conduct user interviews, empathy mapping, and persona creation',
      'Build scalable Figma design systems (Typography, Colors, Component Variants)',
      'Design high-fidelity interactive prototypes with micro-animations',
      'Conduct unmoderated usability testing and document UX case studies',
    ],
    milestones: [
      { weekNumber: 1, title: 'User Research, Empathy Mapping & Problem Scoping', theoryOverview: 'Qualitative user interviews, journey maps, problem framing.', taskDescription: 'Conduct 3 student user interviews on exam preparation habits and create empathy maps.', submissionType: 'DRIVE_LINK', estimatedHours: 18 },
      { weekNumber: 2, title: 'Design System Architecture & Tokens in Figma', theoryOverview: 'Atomic design, auto-layout, component variants, WCAG color contrast.', taskDescription: 'Build a cohesive Figma design system with buttons, inputs, cards, and dark/light modes.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 3, title: 'High-Fidelity Wireframes & Interactive Prototyping', theoryOverview: 'Micro-interactions, smart animate, mobile constraints.', taskDescription: 'Design an 8-screen high-fidelity interactive mobile prototype with smooth animations.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 4, title: 'Comprehensive UX Case Study & Viva Defense', theoryOverview: 'Behance / Medium portfolio case study formatting.', taskDescription: 'Publish a polished UX case study with design rationale and submit NEP college dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
  {
    title: 'Industrial AutoCAD & Project Workflow Management',
    slug: 'industrial-autocad-project-workflow-management',
    stream: 'VOCATIONAL',
    faculty: 'VOCATIONAL',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: '2D/3D technical drafting, engineering orthographic projections, bill of materials (BOM), and industrial project scheduling (Gantt charts).',
    learningOutcomes: [
      'Create parametric 2D engineering drawings in AutoCAD with proper dimensioning',
      'Generate isometric and orthographic projection views',
      'Compile accurate Bill of Materials (BOM) and cost estimates',
      'Schedule engineering project workflows using critical path method (CPM)',
    ],
    milestones: [
      { weekNumber: 1, title: 'Parametric 2D Drafting & Geometric Dimensioning', theoryOverview: 'Layers, line weights, GD&T standards, title blocks.', taskDescription: 'Draft a multi-part mechanical assembly or floor plan with standardized layer formatting.', submissionType: 'DOCUMENT', estimatedHours: 18 },
      { weekNumber: 2, title: 'Orthographic Projections & Sectional Views', theoryOverview: 'First-angle vs third-angle projection, hatching, tolerances.', taskDescription: 'Create front, top, and sectional views of an industrial component with tolerance specs.', submissionType: 'DOCUMENT', estimatedHours: 19 },
      { weekNumber: 3, title: 'Bill of Materials (BOM) & Quantity Estimation', theoryOverview: 'Material specification, unit rates, cost takeoff.', taskDescription: 'Extract component quantities and build an itemized Bill of Materials with cost estimation.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
      { weekNumber: 4, title: 'Project Schedule (Gantt Chart) & Viva Dossier', theoryOverview: 'Work breakdown structure (WBS), project milestones, viva defense.', taskDescription: 'Create a 12-week project Gantt chart schedule and submit finalized NEP project dossier.', submissionType: 'DRIVE_LINK', estimatedHours: 19 },
    ],
    fee: 0,
    isActive: true,
  },
];

async function seed() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.');

  console.log('🌱 Seeding 18 NEP-2020 Comprehensive Internship Tracks...');
  for (const track of comprehensiveTracks) {
    await InternshipTrack.findOneAndUpdate(
      { slug: track.slug },
      { $set: track },
      { upsert: true, new: true }
    );
    console.log(`   ✓ [${track.stream}] ${track.title}`);
  }

  // Seed Demo User
  let demoUser = await User.findOne({ phone: '+91-7544065425' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aditya Verma',
      phone: '+91-7544065425',
      email: 'studyfreepdf2@gmail.com',
      role: 'STUDENT',
    });
  }

  const itTrack = await InternshipTrack.findOne({ slug: 'full-stack-web-engineering-nextjs-typescript' });
  if (itTrack) {
    const certId = 'DDIS-NEP-IT-2026-9482';
    const internship = await StudentInternship.findOneAndUpdate(
      { userId: demoUser._id, trackId: itTrack._id },
      {
        $set: {
          userId: demoUser._id,
          trackId: itTrack._id,
          studentName: 'Aditya Verma',
          studentEmail: 'studyfreepdf2@gmail.com',
          studentPhone: '+91-7544065425',
          collegeName: 'Patna Science College, Patna University',
          rollNumber: 'PU-BCA-2023-089',
          degreeProgram: 'Bachelor of Computer Applications (BCA) - 3rd Year',
          status: 'COMPLETED',
          currentMilestone: 4,
          isCompleted: true,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          completedDate: new Date(),
          submissions: [
            { weekNumber: 1, submissionUrl: 'https://github.com/aditya-verma/ddis-responsive-dashboard', status: 'APPROVED', mentorFeedback: 'Clean component structure and Tailwind styles. Approved.' },
            { weekNumber: 2, submissionUrl: 'https://github.com/aditya-verma/ddis-mongo-crud-api', status: 'APPROVED', mentorFeedback: 'Validated Mongoose schemas with compound indexes. Approved.' },
            { weekNumber: 3, submissionUrl: 'https://github.com/aditya-verma/ddis-auth-webhooks', status: 'APPROVED', mentorFeedback: 'HMAC signature verification successfully tested. Approved.' },
            { weekNumber: 4, submissionUrl: 'https://edupdf-aditya.vercel.app', status: 'APPROVED', mentorFeedback: '94 Lighthouse score. Verified for DDIS Certification.' },
          ],
          certificateIssued: true,
          certificateId: certId,
        },
      },
      { upsert: true, new: true }
    );

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
          faculty: 'IT',
          trackTitle: 'Full-Stack Web Engineering (Next.js, TypeScript & MongoDB)',
          degreeProgram: 'Bachelor of Computer Applications (BCA) - 3rd Year',
          durationWeeks: 4,
          nepCurriculumHours: 75,
          grade: 'A+ (Distinction)',
          issueDate: new Date(),
          validityStatus: 'VALID',
          verificationUrl: `https://studyfreepdf.com/verify/${certId}`,
          accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
        },
      },
      { upsert: true }
    );
    console.log(`   ✓ Seeded Verified Demo Certificate: ${certId}`);
  }

  // Seed sample science certificate
  const sciCertId = 'DDIS-NEP-SCI-2026-3814';
  await DDISCertificate.findOneAndUpdate(
    { certificateId: sciCertId },
    {
      $set: {
        certificateId: sciCertId,
        userId: demoUser._id,
        studentName: 'Sneha Kumari',
        collegeName: 'Patna Women\'s College, Patna University',
        stream: 'B.Sc / Scientific Computing & Data Analytics',
        faculty: 'SCIENCE',
        trackTitle: 'Computational Data Analysis with Python & Pandas',
        degreeProgram: 'B.Sc (Hons) Chemistry - 3rd Year',
        durationWeeks: 4,
        nepCurriculumHours: 75,
        grade: 'A+ (Distinction)',
        issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        validityStatus: 'VALID',
        verificationUrl: `https://studyfreepdf.com/verify/${sciCertId}`,
        accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
      },
    },
    { upsert: true }
  );
  console.log(`   ✓ Seeded Verified Demo Certificate: ${sciCertId}`);

  console.log('\n🎉 Comprehensive NEP-2020 Seed Completed Successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
