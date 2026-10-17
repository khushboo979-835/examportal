# ExamPass (ExamPortal) — Testbook-Grade EdTech PDF Marketplace

A high-performance, production-ready EdTech Digital PDF, Solved Papers, and Notes Marketplace modeled strictly after **Testbook.com** UI/UX and architectural patterns. Tailored for Indian academic boards (CBSE, BSEB, ICSE), State Govt Exams (BPSC, BSSC, Bihar Police), and Central Govt Exams (SSC CGL, RRB NTPC, UPSC CSE).

---

## 🚀 Key Features

- **Testbook-Grade Mega Navigation**: 4-column mega dropdown with dynamic sector, board, and exam filtering.
- **State-Level Categorization**: Fast state & board filtering with counters and target exam year support.
- **Deep Category Hierarchy**: Target Exam $\rightarrow$ Subjects $\rightarrow$ Chapter Breakdowns.
- **Dynamic In-Browser PDF Reader**: 3-page sample previewer with blur paywall lock on subsequent pages.
- **Dynamic Anti-Piracy Watermarking**: On-the-fly watermark stamping student's registered Phone Number, Email, and Order ID across margins to prevent redistribution.
- **Testbook Pass Ecosystem**: Subscription bundles (`STATE_PASS`, `SCHOOL_BOARD_PASS`, `CENTRAL_EXAM_PASS`, `ULTIMATE_ALL_ACCESS`).
- **High-Throughput Faceted Search**: MongoDB `$facet` aggregation pipeline with response times under 50ms.
- **Payments & Logging**: Razorpay payment integration and real-time MongoDB download logging.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, TypeScript)
- **Styling**: Tailwind CSS, Lucide React, Shadcn/UI
- **Database & ODM**: MongoDB Atlas with Mongoose (connection caching, compound indexes, text indexes)
- **PDF Watermarking Engine**: `pdf-lib`
- **Payments**: Razorpay
- **Storage**: Private Cloudflare R2 / AWS S3 S3-compatible bucket + local driver fallback

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/khushboo979-835/examportal.git
cd examportal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the `.env.example` file to `.env` and fill in your MongoDB Atlas URI:
```bash
cp .env.example .env
```

### 4. Database Migration & Seed
Run the zero-data-loss migration script:
```bash
npm run db:migrate
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
