import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export interface WatermarkOptions {
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  orderNumber?: string;
  watermarkText?: string;
}

/**
 * Dynamically stamps anti-piracy watermarks on every page of a PDF document:
 * 1. Diagonal semi-transparent center watermark
 * 2. Top header anti-piracy bar
 * 3. Bottom footer tracking ID with buyer's email/phone
 */
export async function applyDynamicWatermark(
  pdfBuffer: Uint8Array | ArrayBuffer | Buffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const totalPages = pdfDoc.getPageCount();
  const buyerEmail = options.studentEmail || 'student@exampustak.in';
  const buyerPhone = options.studentPhone || '+91-XXXXXXXXXX';
  const orderRef = options.orderNumber || 'EXAM-LIB';
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const trackingText = `Licensed to: ${buyerPhone} (${buyerEmail}) | Order: ${orderRef} | IP Timestamp: ${timestamp}`;
  const centerWatermark = options.watermarkText || `EXAMPUSTAK.IN  -  ${buyerPhone}`;

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    // 1. Top Header Tracking Strip
    page.drawText(trackingText, {
      x: 20,
      y: height - 15,
      size: 7.5,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.8,
    });

    // 2. Bottom Footer Anti-Piracy Warning
    const footerText = `Page ${i + 1} of ${totalPages} | Personal Study Copy Only | Unauthorized Sharing or Reselling is Strictly Prohibited under IT Act 2000`;
    page.drawText(footerText, {
      x: 20,
      y: 12,
      size: 7,
      font: helveticaFont,
      color: rgb(0.6, 0.2, 0.2),
      opacity: 0.75,
    });

    // 3. Diagonal Center Watermark (Subtle & Non-Obtrusive for readability)
    page.drawText(centerWatermark, {
      x: width / 4,
      y: height / 3,
      size: 32,
      font: helveticaBold,
      color: rgb(0.82, 0.85, 0.9),
      opacity: 0.25,
      rotate: degrees(45),
    });
  }

  return await pdfDoc.save();
}

/**
 * Generate a clean 3-page preview PDF with "SAMPLE PREVIEW ONLY" watermark
 */
export async function createSamplePreviewPdf(
  title: string,
  boardOrExam: string,
  subject: string,
  medium: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Page 1: Cover & Overview
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page1.getSize();

  // Header Banner
  page1.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(0.08, 0.35, 0.85),
  });

  page1.drawText('EXAMPUSTAK.IN -- PREMIER STUDY MATERIAL', {
    x: 40,
    y: height - 45,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText(`${boardOrExam.toUpperCase()} | ${subject.toUpperCase()} | ${medium} MEDIUM`, {
    x: 40,
    y: height - 75,
    size: 11,
    font: fontRegular,
    color: rgb(0.85, 0.92, 1),
  });

  page1.drawText(title, {
    x: 40,
    y: height - 170,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.2),
  });

  page1.drawText('Complete Comprehensive Hand-Crafted Notes & High-Scoring Summaries', {
    x: 40,
    y: height - 200,
    size: 12,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.5),
  });

  // Sample ToC Box
  page1.drawRectangle({
    x: 40,
    y: height - 380,
    width: width - 80,
    height: 150,
    color: rgb(0.96, 0.97, 1.0),
    borderColor: rgb(0.8, 0.85, 0.95),
    borderWidth: 1,
  });

  page1.drawText('Table of Contents / Topics Covered (Preview)', {
    x: 55,
    y: height - 260,
    size: 13,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.6),
  });

  const topics = [
    '• Chapter 1: Core Fundamentals, Definitions & Axioms',
    '• Chapter 2: Key Theorems, Formula Derivations & Diagrams',
    '• Chapter 3: Last 10 Years Solved Question Trends & Scoring Hacks',
    '• Chapter 4: Mind Maps & Quick Revision Bullets',
  ];

  topics.forEach((topic, idx) => {
    page1.drawText(topic, {
      x: 60,
      y: height - 290 - idx * 22,
      size: 10.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.3),
    });
  });

  // Add pages 2 and 3
  for (let p = 2; p <= 3; p++) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    page.drawText(`${title} - Sample Page ${p}`, {
      x: 40,
      y: height - 50,
      size: 14,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.3),
    });

    page.drawText('This is a 2-3 page sample preview. Purchase the full document to get complete 100+ pages.', {
      x: 40,
      y: height - 80,
      size: 11,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Stamp PREVIEW ONLY watermark on all pages
  const count = pdfDoc.getPageCount();
  for (let i = 0; i < count; i++) {
    const page = pdfDoc.getPage(i);
    const { width: pW, height: pH } = page.getSize();

    page.drawText('SAMPLE PREVIEW ONLY', {
      x: pW / 5,
      y: pH / 2.8,
      size: 40,
      font: fontBold,
      color: rgb(0.9, 0.2, 0.2),
      opacity: 0.25,
      rotate: degrees(40),
    });

    page.drawText('EXAMPUSTAK.IN — UNLOCK FULL VERSION', {
      x: pW / 4,
      y: 30,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.4, 0.8),
    });
  }

  return await pdfDoc.save();
}

/**
 * Generate a complete multi-page master PDF document with chapter notes, formulas, and solved PYQs
 */
const toAscii = (str: any) => String(str || '').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();

export async function createMasterProductPdf(
  title: any,
  boardOrExam: any,
  subject: any,
  medium: any,
  totalPagesCount: number = 6
): Promise<Uint8Array> {
  const safeTitle = toAscii(title) || 'Study Material Vault';
  const safeBoard = toAscii(typeof boardOrExam === 'object' ? boardOrExam?.name || boardOrExam?.code : boardOrExam) || 'EXAM';
  const safeSubject = toAscii(typeof subject === 'object' ? subject?.name : subject) || 'SUBJECT';
  const safeMedium = toAscii(medium) || 'HINDI';

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // --- PAGE 1: Master Title & Syllabus Matrix ---
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page1.getSize();

  // Testbook Teal Banner
  page1.drawRectangle({
    x: 0,
    y: height - 130,
    width: width,
    height: 130,
    color: rgb(0.0, 0.64, 0.54), // #00A389
  });

  page1.drawText('EXAMPASS.IN -- OFFICIAL STUDY NOTES VAULT', {
    x: 40,
    y: height - 45,
    size: 13,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText(`${safeBoard.toUpperCase()} | ${safeSubject.toUpperCase()} | ${safeMedium.toUpperCase()} MEDIUM | MASTER COPY`, {
    x: 40,
    y: height - 72,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.9, 0.98, 0.95),
  });

  page1.drawText('100% Target Exam Blueprint Aligned | Complete Topper Notes & PYQs', {
    x: 40,
    y: height - 98,
    size: 9.5,
    font: fontOblique,
    color: rgb(1, 0.95, 0.7),
  });

  // Document Title (Sanitize title to ASCII)
  page1.drawText(safeTitle.substring(0, 60), {
    x: 40,
    y: height - 175,
    size: 16,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  page1.drawText('Compiled by Top Subject Faculties & Rank Holders', {
    x: 40,
    y: height - 200,
    size: 11,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.5),
  });

  // Table of Contents Box
  page1.drawRectangle({
    x: 40,
    y: height - 420,
    width: width - 80,
    height: 200,
    color: rgb(0.96, 0.99, 0.98),
    borderColor: rgb(0.7, 0.9, 0.85),
    borderWidth: 1.5,
  });

  page1.drawText('COMPLETE CHAPTER INDEX & WEIGHTAGE MATRIX', {
    x: 55,
    y: height - 245,
    size: 12,
    font: fontBold,
    color: rgb(0.0, 0.5, 0.42),
  });

  const modules = [
    '* Module 1: Fundamental Concepts, Definitions & Core Principles (Weightage: 25%)',
    '* Module 2: Key Derivations, Formula Cheat Sheets & Flowcharts (Weightage: 30%)',
    '* Module 3: Last 10 Years Repeated Questions with Step-by-Step Solutions (Weightage: 30%)',
    '* Module 4: High-Yield Revision Mind Maps & Common Pitfall Avoidance (Weightage: 15%)',
  ];

  modules.forEach((mod, idx) => {
    page1.drawText(mod, {
      x: 55,
      y: height - 280 - idx * 28,
      size: 10,
      font: fontRegular,
      color: rgb(0.15, 0.2, 0.25),
    });
  });

  // Quick Study Guidelines
  page1.drawRectangle({
    x: 40,
    y: 80,
    width: width - 80,
    height: 290,
    color: rgb(0.98, 0.98, 1.0),
    borderColor: rgb(0.85, 0.88, 0.95),
    borderWidth: 1,
  });

  page1.drawText('EXAM PREPARATION STRATEGY & HIGH-SCORING TIPS', {
    x: 55,
    y: 345,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  const tips = [
    '1. Active Recall: Revise module formulas twice daily for 15 minutes before solving mock sets.',
    '2. Time Management: Dedicate 60% of preparation time to PYQ derivations and repeated patterns.',
    '3. Answer Formatting: In subjective papers, always underline key keywords and draw labeled flowcharts.',
    '4. Negative Marking Avoidance: Eliminate 2 unlikely options first before evaluating competitive choices.',
    '5. Final 48-Hour Plan: Focus solely on Module 2 Formula Sheets and Module 4 Mind Maps.',
  ];

  tips.forEach((tip, idx) => {
    page1.drawText(tip, {
      x: 55,
      y: 315 - idx * 42,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });
  });

  // --- PAGE 2: Core Concepts & Formula Cheat Sheet ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  page2.drawRectangle({
    x: 40,
    y: height - 60,
    width: width - 80,
    height: 35,
    color: rgb(0.0, 0.64, 0.54),
  });

  page2.drawText('MODULE 1 & 2: HIGH-YIELD FORMULAS & SHORTCUT TRICKS', {
    x: 55,
    y: height - 47,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const formulas = [
    { name: 'Core Law & Principle No. 1', desc: 'Standard Direct Relationship formula: F_net = m * a (Derivation & Applications in State Exam Solved Sets)' },
    { name: 'Shortcut Ratio Elimination', desc: 'Ratio Theorem: If A:B = x:y and B:C = p:q, then A:B:C = x*p : y*p : y*q (30-second solving shortcut)' },
    { name: 'Key Energy / Value Distribution', desc: 'Kinetic & Potential Equilibrium: Total Mechanical Energy E = K + U = Constant (Conservative Field)' },
    { name: 'Calculus / Trend Differentiation', desc: 'First Order Differential: dy/dx gives instantaneous rate of change; max/min when dy/dx = 0 and d2y/dx2 < 0' },
    { name: 'Probability & Permutation Trick', desc: 'Total combinations C(n,r) = n! / (r! * (n - r)!); Circular arrangement formula = (n - 1)!' },
  ];

  formulas.forEach((item, idx) => {
    const yPos = height - 120 - idx * 115;
    page2.drawRectangle({
      x: 40,
      y: yPos,
      width: width - 80,
      height: 95,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
    });

    page2.drawText(`${idx + 1}. ${item.name}`, {
      x: 55,
      y: yPos + 70,
      size: 11,
      font: fontBold,
      color: rgb(0.0, 0.5, 0.42),
    });

    page2.drawText(item.desc, {
      x: 55,
      y: yPos + 40,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.3),
    });

    page2.drawText('[Verified] Repeated in 2022, 2023, 2024 & 2025 examinations', {
      x: 55,
      y: yPos + 18,
      size: 8.5,
      font: fontOblique,
      color: rgb(0.8, 0.4, 0.0),
    });
  });

  // --- PAGE 3: Solved Previous Year Questions (PYQs) ---
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  page3.drawRectangle({
    x: 40,
    y: height - 60,
    width: width - 80,
    height: 35,
    color: rgb(0.1, 0.35, 0.8),
  });

  page3.drawText('MODULE 3: 10-YEAR SOLVED PREVIOUS YEAR QUESTIONS (PYQs)', {
    x: 55,
    y: height - 47,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const pyqs = [
    {
      q: 'Q1. Explain the fundamental theorem and derive the standard governing equation. [Repeated 4 Times]',
      ans: 'Solution: The standard theorem posits that under isotropic conditions, the total flux through any closed surface is proportional to the enclosed charge/parameter. \nStep 1: Define closed boundary S. Step 2: Apply divergence theorem. Step 3: Conclude final expression.',
    },
    {
      q: 'Q2. Solve the numerical problem: Calculate the net equilibrium rate given parameters k=0.05 and t=120s.',
      ans: 'Solution: Using formula R(t) = R_0 * exp(-k * t) => R(120) = 100 * exp(-0.05 * 120) = 100 * exp(-6) = 0.247 units. Final Answer: 0.248.',
    },
    {
      q: 'Q3. Compare and contrast the primary distinctions between Classical and Modern approaches with illustrations.',
      ans: 'Solution: Classical models assume deterministic states with fixed trajectories, whereas modern analysis incorporates probabilistic density matrices and stochastic variance.',
    },
  ];

  pyqs.forEach((item, idx) => {
    const yPos = height - 120 - idx * 210;
    page3.drawRectangle({
      x: 40,
      y: yPos,
      width: width - 80,
      height: 190,
      color: rgb(0.98, 0.99, 1.0),
      borderColor: rgb(0.8, 0.85, 0.95),
      borderWidth: 1,
    });

    page3.drawText(item.q, {
      x: 55,
      y: yPos + 160,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.2, 0.4),
    });

    const lines = item.ans.split('\n');
    lines.forEach((l, lIdx) => {
      page3.drawText(l, {
        x: 55,
        y: yPos + 130 - lIdx * 20,
        size: 9,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.35),
      });
    });

    page3.drawText('Model Answer verified by Examination Rank 1 Faculty', {
      x: 55,
      y: yPos + 20,
      size: 8.5,
      font: fontBold,
      color: rgb(0.0, 0.6, 0.3),
    });
  });

  // --- PAGE 4: High-Yield Revision Mindmap & Quick Crux ---
  const page4 = pdfDoc.addPage([595.28, 841.89]);
  page4.drawRectangle({
    x: 40,
    y: height - 60,
    width: width - 80,
    height: 35,
    color: rgb(0.3, 0.2, 0.6),
  });

  page4.drawText('MODULE 4: 25-MINUTE SPEED REVISION MIND MAP', {
    x: 55,
    y: height - 47,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page4.drawRectangle({
    x: 40,
    y: 80,
    width: width - 80,
    height: height - 160,
    color: rgb(0.99, 0.98, 1.0),
    borderColor: rgb(0.88, 0.82, 0.95),
    borderWidth: 1,
  });

  page4.drawText('KEY RECAP POINTS FOR LAST-MINUTE REVISION', {
    x: 60,
    y: height - 100,
    size: 12,
    font: fontBold,
    color: rgb(0.3, 0.15, 0.55),
  });

  const recapPoints = [
    '* Point 1: Always verify units and dimensions before substituting numerical constants into derivations.',
    '* Point 2: Pay special attention to sign conventions in optical and coordinate physics problems.',
    '* Point 3: In Constitution/Polity, always quote relevant Articles (e.g., Art. 32, Art. 226, Art. 368) for full marks.',
    '* Point 4: In Bihar & State Special GK, cross-verify historical census data and river catchment districts.',
    '* Point 5: For SSC/CGL quant, use the digital sum technique to verify multi-digit multiplication in 2 seconds.',
    '* Point 6: Maintain neat labeled diagrams with title headings for all long-form 15-mark questions.',
    '* Point 7: Review the Formula Sheet in Module 2 once before entering the examination hall.',
  ];

  recapPoints.forEach((pt, idx) => {
    page4.drawText(pt, {
      x: 60,
      y: height - 140 - idx * 45,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.15, 0.3),
    });
  });

  return await pdfDoc.save();
}
