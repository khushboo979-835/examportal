export interface MilestoneItem {
  weekNumber: number;
  title: string;
  theoryOverview?: string;
  taskDescription: string;
  resourceMaterialUrl?: string;
  submissionType: 'GITHUB' | 'DRIVE_LINK' | 'LIVE_URL' | 'DOCUMENT';
  estimatedHours: number;
}

export interface CatalogInternshipTrack {
  _id: string;
  title: string;
  slug: string;
  stream: string;
  faculty: string;
  nepAligned: boolean;
  nepCurriculumHours: number;
  durationWeeks: number;
  shortDescription: string;
  learningOutcomes: string[];
  milestones: MilestoneItem[];
  fee: number;
  isActive: boolean;
}

export const FALLBACK_INTERNSHIP_TRACKS: CatalogInternshipTrack[] = [
  // 1. IT & Computer Applications
  {
    _id: 'track-it-fullstack',
    title: 'Full-Stack Web Engineering (Next.js, TypeScript & MongoDB)',
    slug: 'full-stack-web-engineering-nextjs-typescript',
    stream: 'BCA_IT',
    faculty: 'BCA_IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Modern web engineering with Next.js App Router, TypeScript, serverless APIs, Tailwind CSS, and MongoDB Atlas indexing.',
    learningOutcomes: [
      'Architect full-stack applications with React Server Components',
      'Implement secure RESTful APIs with rate limiting & JWT verification',
      'Optimize database queries and compound indexing in MongoDB Atlas',
      'Deploy production-ready apps to Vercel and Cloudflare',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Project Architecture & Schema Modeling',
        taskDescription: 'Initialize Next.js project with TypeScript, configure Tailwind CSS, model Mongoose schemas with compound indexes, and create seed scripts.',
        submissionType: 'GITHUB',
        estimatedHours: 18,
      },
      {
        weekNumber: 2,
        title: 'Serverless API Development & Authentication',
        taskDescription: 'Build authenticated App Router API routes, integrate HMAC signature verification, implement rate limiting, and setup CORS headers.',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 3,
        title: 'Frontend Responsive UI & State Hydration',
        taskDescription: 'Develop responsive mobile-first UI with search filtering, client-side debouncing, modal previews, and glassmorphic navigation.',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 4,
        title: 'Production Build, CI/CD & Deployment',
        taskDescription: 'Execute end-to-end integration tests, optimize static generation, configure custom domains, and deploy to production cloud.',
        submissionType: 'LIVE_URL',
        estimatedHours: 19,
      },
    ],
    fee: 0,
    isActive: true,
  },
  {
    _id: 'track-it-python-ml',
    title: 'Python for Machine Learning & Practical Data Science',
    slug: 'python-machine-learning-essentials',
    stream: 'BCA_IT',
    faculty: 'BCA_IT',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Hands-on Python programming for data wrangling, NumPy/Pandas analysis, exploratory visualization, and supervised scikit-learn models.',
    learningOutcomes: [
      'Master data cleaning and manipulation with Pandas and NumPy',
      'Perform exploratory data analysis with Matplotlib and Seaborn',
      'Train, evaluate, and tune supervised ML regression and classification models',
      'Deploy machine learning models via FastAPI REST endpoints',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Data Wrangling & Statistical Preprocessing',
        taskDescription: 'Ingest raw government exam datasets, handle missing values, normalize numerical distributions, and compute summary metrics.',
        submissionType: 'GITHUB',
        estimatedHours: 18,
      },
      {
        weekNumber: 2,
        title: 'Exploratory Data Analysis & Visualizations',
        taskDescription: 'Construct correlation heatmaps, box plots, and multi-variable scatter charts to uncover data insights.',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 3,
        title: 'Supervised ML Modeling & Validation',
        taskDescription: 'Train Random Forest and Logistic Regression classifiers with k-fold cross-validation and hyperparameter grid search.',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 4,
        title: 'API Serving & Model Deployment',
        taskDescription: 'Package model pipeline with joblib and serve predictions through a lightweight containerized FastAPI microservice.',
        submissionType: 'LIVE_URL',
        estimatedHours: 19,
      },
    ],
    fee: 0,
    isActive: true,
  },

  // 2. Science (UG & PG)
  {
    _id: 'track-sci-computing',
    title: 'Computational Data Analysis & Research Methodology',
    slug: 'computational-data-analysis-research-methodology',
    stream: 'SCIENCE',
    faculty: 'SCIENCE',
    nepAligned: true,
    nepCurriculumHours: 75,
    durationWeeks: 4,
    shortDescription: 'Statistical computing, experimental error analysis, curve fitting, and academic viva dossier preparation compliant with UGC NEP credit criteria.',
    learningOutcomes: [
      'Conduct rigorous statistical hypothesis testing (t-test, ANOVA, chi-square)',
      'Analyze experimental datasets with non-linear curve fitting',
      'Format academic research findings following IEEE/UGC publication standards',
      'Compile defensible viva dossier with complete audit trail',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Experimental Data Collection & Variance Analysis',
        taskDescription: 'Structure experimental laboratory observations, calculate standard deviations and systematic measurement uncertainties.',
        submissionType: 'DOCUMENT',
        estimatedHours: 18,
      },
      {
        weekNumber: 2,
        title: 'Statistical Hypothesis Testing',
        taskDescription: 'Perform parametric and non-parametric hypothesis tests on bi-variate datasets with p-value determination.',
        submissionType: 'DOCUMENT',
        estimatedHours: 19,
      },
      {
        weekNumber: 3,
        title: 'Mathematical Modeling & Curve Fitting',
        taskDescription: 'Formulate non-linear regression curves and compute R-squared goodness-of-fit metrics.',
        submissionType: 'GITHUB',
        estimatedHours: 19,
      },
      {
        weekNumber: 4,
        title: 'UGC Research Viva Dossier Compilation',
        taskDescription: 'Assemble 2-page academic project defense report with bibliography and experimental conclusions.',
        submissionType: 'DOCUMENT',
        estimatedHours: 19,
      },
    ],
    fee: 0,
    isActive: true,
  },

  // 3. Commerce & Management
  {
    _id: 'track-com-marketing',
    title: 'Digital Marketing & Corporate E-Commerce Operations',
    slug: 'digital-marketing-growth-hacking',
    stream: 'COMMERCE',
    faculty: 'COMMERCE',
    nepAligned: true,
    nepCurriculumHours: 60,
    durationWeeks: 4,
    shortDescription: 'Comprehensive training in Technical SEO audits, Google Analytics 4 funnels, Meta Ad budgeting, and e-commerce conversion optimization.',
    learningOutcomes: [
      'Perform enterprise Technical SEO audits and Core Web Vitals diagnostics',
      'Configure event tracking and conversion funnels in Google Analytics 4',
      'Simulate ad campaign bidding strategies with ROAS calculation',
      'Formulate retention marketing workflows for online stores',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Technical SEO Audit & Keyword Architecture',
        taskDescription: 'Perform full technical crawl of an educational web portal, audit title tags, meta descriptions, and robots directives.',
        submissionType: 'DOCUMENT',
        estimatedHours: 15,
      },
      {
        weekNumber: 2,
        title: 'GA4 Event Tracking & Funnel Setup',
        taskDescription: 'Configure custom event parameters for product views, cart additions, and checkout steps in GA4.',
        submissionType: 'DOCUMENT',
        estimatedHours: 15,
      },
      {
        weekNumber: 3,
        title: 'Paid Media Budgeting & Ad Simulation',
        taskDescription: 'Design ad copy, audience demographics, and negative keyword lists for a high-converting ₹50,000 monthly ad spend plan.',
        submissionType: 'DOCUMENT',
        estimatedHours: 15,
      },
      {
        weekNumber: 4,
        title: 'E-Commerce Growth Strategy Report',
        taskDescription: 'Synthesize audit metrics into an executive PowerPoint & PDF presentation with projected conversion rate uplift.',
        submissionType: 'DRIVE_LINK',
        estimatedHours: 15,
      },
    ],
    fee: 0,
    isActive: true,
  },

  // 4. Arts & Humanities
  {
    _id: 'track-arts-content',
    title: 'Technical Content Writing & Digital Communications',
    slug: 'content-writing-pr-journalism',
    stream: 'ARTS',
    faculty: 'ARTS',
    nepAligned: true,
    nepCurriculumHours: 60,
    durationWeeks: 4,
    shortDescription: 'Editorial writing, educational course summaries, press communication releases, and student engagement campaigns.',
    learningOutcomes: [
      'Write structured educational study guides and exam cheat sheets',
      'Compose corporate press releases adhering to PR style guides',
      'Optimize online copy for search ranking and reading retention',
      'Assemble professional portfolio dossier for graduation credits',
    ],
    milestones: [
      {
        weekNumber: 1,
        title: 'Educational Summary Formulation',
        taskDescription: 'Draft a 10-page high-yield chapter crux with mnemonic formulas and bulleted exam takeaways.',
        submissionType: 'DOCUMENT',
        estimatedHours: 15,
      },
      {
        weekNumber: 2,
        title: 'Corporate Press Release & PR Kit',
        taskDescription: 'Write an official corporate press release announcing university accreditation under DDIS.',
        submissionType: 'DOCUMENT',
        estimatedHours: 15,
      },
      {
        weekNumber: 3,
        title: 'Digital Social Media Campaign Strategy',
        taskDescription: 'Create a 14-day student outreach content calendar with infographics and community engagement prompts.',
        submissionType: 'DRIVE_LINK',
        estimatedHours: 15,
      },
      {
        weekNumber: 4,
        title: 'Capstone Writing Portfolio & Viva Dossier',
        taskDescription: 'Publish online writing portfolio and compile official internship completion dossier.',
        submissionType: 'LIVE_URL',
        estimatedHours: 15,
      },
    ],
    fee: 0,
    isActive: true,
  },
];
