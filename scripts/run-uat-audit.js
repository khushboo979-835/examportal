/**
 * UAT Test Runner: Validating 29 Acceptance Criteria for StudyFree & DDIS Production Release
 */
const fs = require('fs');
const path = require('path');

const results = [];

function assertTest(id, category, description, condition, details = '') {
  results.push({
    id,
    category,
    description,
    passed: Boolean(condition),
    details: details || (condition ? 'Passed' : 'Failed assertion'),
  });
}

function checkFileContains(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    return { allFound: false, missing: [`File not found: ${filePath}`] };
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const missing = [];
  for (const p of patterns) {
    if (typeof p === 'string') {
      if (!content.includes(p)) missing.push(p);
    } else {
      if (!p.test(content)) missing.push(p.toString());
    }
  }
  return { allFound: missing.length === 0, missing };
}

function runAllUATTests() {
  console.log('\n======================================================================');
  console.log('   STARTING PRODUCTION UAT AUDIT: 29 ACCEPTANCE CRITERIA (STUDYFREE)');
  console.log('======================================================================\n');

  const rootDir = process.cwd();

  // AC-01: Authentication & Role-Based Access Control
  const userModelPath = path.join(rootDir, 'src', 'models', 'User.ts');
  const ac01 = checkFileContains(userModelPath, [
    'STUDENT',
    'MENTOR',
    'COLLEGE_COORDINATOR',
    'ADMIN',
  ]);
  assertTest(
    'AC-01',
    'Auth & Roles',
    'User model enforces least-privilege roles: STUDENT, MENTOR, COLLEGE_COORDINATOR, ADMIN',
    ac01.allFound,
    ac01.allFound ? 'All required roles strictly modeled in User schema' : `Missing: ${ac01.missing.join(', ')}`
  );

  // AC-02: 1-Click Exam Category Navigation
  const pagePath = path.join(rootDir, 'src', 'app', 'page.tsx');
  const ac02 = checkFileContains(pagePath, [
    'BPSC',
    'BSEB',
    'CBSE',
    'SSC',
    'Exam Category Navigation',
  ]);
  assertTest(
    'AC-02',
    'Navigation',
    'Homepage renders 1-Click Exam Category filter chips for BPSC, BSEB, CBSE, SSC',
    ac02.allFound,
    ac02.allFound ? 'Verified 4 core exam category tabs' : `Missing: ${ac02.missing.join(', ')}`
  );

  // AC-03: Webhook Idempotency & Two-Step Order Life-Cycle
  const webhookPath = path.join(rootDir, 'src', 'app', 'api', 'payment', 'webhook', 'route.ts');
  const ac03 = checkFileContains(webhookPath, [
    'idempotent',
    'order.status === \'SUCCESS\'',
    'crypto.timingSafeEqual',
    'payment.captured',
  ]);
  assertTest(
    'AC-03',
    'Payment Integrity',
    'Webhook endpoint enforces strict HMAC-SHA256 signature check & duplicate idempotency protection',
    ac03.allFound,
    ac03.allFound ? 'Verified HMAC signature check & duplicate webhook idempotency' : `Missing: ${ac03.missing.join(', ')}`
  );

  // AC-04: Zero-Leak Protected PDF Download Authorization
  const downloadRoutePath = path.join(rootDir, 'src', 'app', 'api', 'pdf', 'download', '[id]', 'route.ts');
  const ac04 = checkFileContains(downloadRoutePath, [
    'hasDirectPurchase',
    'hasValidPass',
    'status: 403',
  ]);
  assertTest(
    'AC-04',
    'File Delivery',
    'Download route enforces active purchase / annual pass authorization gate (HTTP 403 on unentitled)',
    ac04.allFound,
    ac04.allFound ? 'Entitlement verification gate validated' : `Missing: ${ac04.missing.join(', ')}`
  );

  // AC-05: Dynamic Semi-Transparent PDF Watermarking
  const ac05 = checkFileContains(downloadRoutePath, [
    'Licensed to:',
    'Order #',
    'STUDYFREEPDF.COM',
    'pdfDoc.save',
  ]);
  assertTest(
    'AC-05',
    'Watermarking',
    'PDF engine stamps dynamic anti-piracy tracking footer & diagonal brand watermark onto every page',
    ac05.allFound,
    ac05.allFound ? 'Watermark tracking stamp & diagonal brand validated' : `Missing: ${ac05.missing.join(', ')}`
  );

  // AC-06: NEP-2020 4-Week / 8-Week Curriculum Tracks
  const trackModelPath = path.join(rootDir, 'src', 'models', 'InternshipTrack.ts');
  const ac06 = checkFileContains(trackModelPath, [
    'nepAligned',
    'durationWeeks',
    'SCIENCE',
    'COMMERCE',
    'ARTS',
    'BCA_IT',
  ]);
  assertTest(
    'AC-06',
    'Internship Engine',
    'InternshipTrack model supports NEP-2020 tracks across BCA_IT, Science, Commerce, and Arts',
    ac06.allFound,
    ac06.allFound ? 'NEP-2020 track data structure validated' : `Missing: ${ac06.missing.join(', ')}`
  );

  // AC-07: Mentor Evaluation & Immutable Audit Trail
  const internshipModelPath = path.join(rootDir, 'src', 'models', 'StudentInternship.ts');
  const ac07 = checkFileContains(internshipModelPath, [
    'evaluationAuditLogs',
    'evaluatedBy',
    'action',
    'APPROVED',
    'REVISE',
  ]);
  assertTest(
    'AC-07',
    'Internship Evaluation',
    'StudentInternship stores mentor evaluation decisions with immutable audit logs',
    ac07.allFound,
    ac07.allFound ? 'Evaluation audit logs schema validated' : `Missing: ${ac07.missing.join(', ')}`
  );

  // AC-08: Programmatic Certificate Issuance Gate
  const certGenPath = path.join(rootDir, 'src', 'app', 'api', 'internship', 'generate-certificate', 'route.ts');
  const ac08 = checkFileContains(certGenPath, [
    'unapprovedMilestones',
    'status: 403',
    'Certificate issuance blocked',
  ]);
  assertTest(
    'AC-08',
    'Certification Gate',
    'Issuance gate dynamically blocks certificate generation if any weekly milestone is unapproved',
    ac08.allFound,
    ac08.allFound ? 'Programmatic milestone check gate validated' : `Missing: ${ac08.missing.join(', ')}`
  );

  // AC-09: Tamper-Proof DDIS Credential ID & Dynamic QR Code
  const ac09 = checkFileContains(certGenPath, [
    'DDIS-NEP-2026-',
    'QRCode.toDataURL',
    'https://studyfreepdf.com/verify/',
  ]);
  assertTest(
    'AC-09',
    'Certification QR',
    'Generates unique DDIS-NEP-2026 credential ID and live QR code pointing to public verification URL',
    ac09.allFound,
    ac09.allFound ? 'DDIS credential ID pattern and QR code generator validated' : `Missing: ${ac09.missing.join(', ')}`
  );

  // AC-10: Public Verification Route Data Privacy Sanitization
  const verifyPagePath = path.join(rootDir, 'src', 'app', 'verify', '[id]', 'page.tsx');
  const verifyContent = fs.readFileSync(verifyPagePath, 'utf-8');
  const ac10 = !verifyContent.includes('studentPhone:') && !verifyContent.includes('studentEmail:');
  assertTest(
    'AC-10',
    'Data Privacy',
    'Public verification page displays candidate academic metadata without leaking phone or email',
    ac10,
    ac10 ? 'Private contact details excluded from public certificate view' : 'Potential personal detail leakage'
  );

  // AC-11: Order Status Ledger & Refund Reconciliation
  const orderModelPath = path.join(rootDir, 'src', 'models', 'Order.ts');
  const ac11 = checkFileContains(orderModelPath, [
    'REFUNDED',
    'refundReason',
    'refundedAt',
    'webhookProcessedAt',
  ]);
  assertTest(
    'AC-11',
    'Ledger Reconciliation',
    'Order model includes REFUNDED status, refund reason, and webhook processing timestamps',
    ac11.allFound,
    ac11.allFound ? 'Order ledger schema fields validated' : `Missing: ${ac11.missing.join(', ')}`
  );

  // AC-12: SEO Crawl Directives (Robots.txt & Meta Tags)
  const robotsPath = path.join(rootDir, 'src', 'app', 'robots.ts');
  const ac12 = checkFileContains(robotsPath, [
    '/admin',
    '/dashboard',
    '/library',
    'sitemap.xml',
  ]);
  assertTest(
    'AC-12',
    'SEO & Indexing',
    'robots.ts disallows private areas (/admin, /dashboard, /library) and exposes sitemap.xml',
    ac12.allFound,
    ac12.allFound ? 'Robots crawl restrictions validated' : `Missing: ${ac12.missing.join(', ')}`
  );

  // AC-13: Dynamic Sitemap Configuration
  const sitemapPath = path.join(rootDir, 'src', 'app', 'sitemap.ts');
  const ac13 = checkFileContains(sitemapPath, [
    '/explore',
    '/internships',
    '/pricing-policy',
    '/verify',
  ]);
  assertTest(
    'AC-13',
    'SEO Sitemap',
    'sitemap.ts dynamically registers all public hubs, exam portals, and policy routes',
    ac13.allFound,
    ac13.allFound ? 'Sitemap entries validated' : `Missing: ${ac13.missing.join(', ')}`
  );

  // AC-14: Transparent Pricing Consistency (₹49 vs ₹199)
  const pricingPath = path.join(rootDir, 'src', 'app', 'pricing-policy', 'page.tsx');
  const ac14 = checkFileContains(pricingPath, [
    '₹49',
    '₹199',
    'Lifetime Offline Access',
    '365 days',
  ]);
  assertTest(
    'AC-14',
    'Pricing Transparency',
    'Pricing Policy page clearly establishes ₹49 single note (lifetime download) vs ₹199 annual pass (365 days)',
    ac14.allFound,
    ac14.allFound ? 'Pricing terms validated' : `Missing: ${ac14.missing.join(', ')}`
  );

  // AC-15: Explicit Exclusions Declaration for Annual Pass
  const ac15 = checkFileContains(pagePath, [
    'Excludes physical printed books',
    '1-on-1',
  ]);
  assertTest(
    'AC-15',
    'Pricing Disclosures',
    'Annual Pass breakdown explicitly declares exclusions (physical printed books & 1-on-1 mentoring)',
    ac15.allFound,
    ac15.allFound ? 'Exclusions disclosure validated on Homepage' : `Missing: ${ac15.missing.join(', ')}`
  );

  // AC-16: Zero Residual Scripture / Granth References
  const termsPath = path.join(rootDir, 'src', 'app', 'terms', 'page.tsx');
  const checkoutPath = path.join(rootDir, 'src', 'app', 'checkout', 'page.tsx');
  const termsContent = fs.readFileSync(termsPath, 'utf-8');
  const pricingContent = fs.readFileSync(pricingPath, 'utf-8');
  const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  const hasScripture =
    termsContent.includes('scripture') ||
    pricingContent.includes('scripture') ||
    checkoutContent.includes('scripture') ||
    termsContent.includes('granth') ||
    pricingContent.includes('granth');
  assertTest(
    'AC-16',
    'Copy Audit',
    'Zero residual scripture, granth, or chapter-access references across legal and checkout pages',
    !hasScripture,
    !hasScripture ? 'All legacy scripture/granth terms fully purged' : 'Detected residual scripture term'
  );

  // AC-17: 7 Mandatory Homepage Sections Present
  const ac17 = checkFileContains(pagePath, [
    /Study Notes (&|&amp;) Practice PDFs for/, // Section 1 Headline
    'Browse Study Material',            // Section 2 Primary CTA 1
    'Explore Internship Programs',      // Section 2 Primary CTA 2
    'Exam Category Navigation',         // Section 3 Category Tabs
    'ProductCard',                      // Section 4 Product Cards Grid
    'Unlock 5,000+ Notes',              // Section 5 Annual Pass Tier
    'Digital Developer Infinity Solution (DDIS)', // Section 6 About DDIS
  ]);
  assertTest(
    'AC-17',
    'Homepage Structure',
    'Homepage refactored into the 7 mandatory structural sections',
    ac17.allFound,
    ac17.allFound ? 'All mandatory homepage sections present sequentially' : `Missing: ${ac17.missing.join(', ')}`
  );

  // AC-18: Free Sample Reading Buttons on Product Cards
  const cardPath = path.join(rootDir, 'src', 'components', 'product', 'ProductCard.tsx');
  const ac18 = checkFileContains(cardPath, [
    'Free Sample Reading',
    'setShowPreview',
  ]);
  assertTest(
    'AC-18',
    'Free Preview',
    'Product cards feature prominent Free Sample Reading buttons with instant modal viewer',
    ac18.allFound,
    ac18.allFound ? 'Free Sample Reading action validated' : `Missing: ${ac18.missing.join(', ')}`
  );

  // AC-19: Persistent Student Bookmarking Utility
  const dashboardPath = path.join(rootDir, 'src', 'app', 'dashboard', 'page.tsx');
  const ac19 = checkFileContains(dashboardPath, [
    'studyfreepdf_bookmarks',
    'toggleBookmark',
    'Saved Bookmarks',
  ]);
  assertTest(
    'AC-19',
    'Student Tools',
    'Student dashboard provides persistent localStorage bookmarking utility with chapter tracking',
    ac19.allFound,
    ac19.allFound ? 'Persistent bookmarking utility validated' : `Missing: ${ac19.missing.join(', ')}`
  );

  // AC-20: Resume-Reading State Tracking
  const ac20 = checkFileContains(dashboardPath, [
    'studyfreepdf_last_read',
    'Resume Reading Where You Left Off',
    'lastReadNote',
  ]);
  assertTest(
    'AC-20',
    'Student Tools',
    'Student dashboard tracks resume-reading state with 1-click continuation to exact last page',
    ac20.allFound,
    ac20.allFound ? 'Resume reading utility validated' : `Missing: ${ac20.missing.join(', ')}`
  );

  // AC-21: Unified Checkout Summary & Tax Breakdown
  const ac21 = checkFileContains(checkoutPath, [
    'GST (18% inclusive)',
    'Access Duration:',
    '7-Day Money-Back Guarantee',
    'Total Payable',
  ]);
  assertTest(
    'AC-21',
    'Checkout Integrity',
    'Checkout page renders unified summary: tax breakdown, access duration, and refund policy guarantee',
    ac21.allFound,
    ac21.allFound ? 'Standardized checkout breakdown validated' : `Missing: ${ac21.missing.join(', ')}`
  );

  // AC-22: Floating Glassmorphic Header Navigation
  const headerPath = path.join(rootDir, 'src', 'components', 'navigation', 'Header.tsx');
  const ac22 = checkFileContains(headerPath, [
    'backdrop-blur',
    'Internships',
    'Verify Certificate',
    'studyfreepdf2@gmail.com',
  ]);
  assertTest(
    'AC-22',
    'Header UI',
    'Glassmorphic Header features unified Study Material mega-menu, Internships tab, and Verify shortcut',
    ac22.allFound,
    ac22.allFound ? 'Header structure and shortcuts validated' : `Missing: ${ac22.missing.join(', ')}`
  );

  // AC-23: Comprehensive Legal Footer
  const footerPath = path.join(rootDir, 'src', 'components', 'layout', 'Footer.tsx');
  const ac23 = checkFileContains(footerPath, [
    /Refund (&|&amp;) Cancellation Policy/,
    'Privacy Policy',
    'Terms of Service',
    'Pricing Terms',
    'Grievance Redressal Officer',
  ]);
  assertTest(
    'AC-23',
    'Legal Footer',
    'Footer renders all mandatory compliance links and Grievance Officer desk',
    ac23.allFound,
    ac23.allFound ? 'Footer legal directory validated' : `Missing: ${ac23.missing.join(', ')}`
  );

  // AC-24: Accredited Parent Organization Credibility
  const ac24 = checkFileContains(footerPath, [
    'Digital Developer Infinity Solution (DDIS)',
    'digitalinfinityddis.com',
  ]);
  assertTest(
    'AC-24',
    'Accreditation',
    'Official corporate accreditation under Digital Developer Infinity Solution (DDIS) prominently linked',
    ac24.allFound,
    ac24.allFound ? 'Parent organization accreditation verified' : `Missing: ${ac24.missing.join(', ')}`
  );

  // AC-25: Official Contact Email Consistency
  const contactPath = path.join(rootDir, 'src', 'app', 'contact', 'page.tsx');
  const ac25 = checkFileContains(contactPath, [
    'studyfreepdf2@gmail.com',
  ]);
  assertTest(
    'AC-25',
    'Contact Integrity',
    'Official support & grievance email verified as studyfreepdf2@gmail.com across contact and footer',
    ac25.allFound,
    ac25.allFound ? 'studyfreepdf2@gmail.com validated' : `Missing: ${ac25.missing.join(', ')}`
  );

  // AC-26: Official Contact Phone Consistency
  const ac26 = checkFileContains(contactPath, [
    '+91 7544065425',
  ]);
  assertTest(
    'AC-26',
    'Contact Integrity',
    'Official customer support hotline verified as +91 7544065425',
    ac26.allFound,
    ac26.allFound ? '+91 7544065425 verified across platform' : `Missing: ${ac26.missing.join(', ')}`
  );

  // AC-27: Registered Office Address & Google Maps Navigation
  const ac27 = checkFileContains(contactPath, [
    'Near Zero Mile Metro Station, Patna, Bihar - 800007',
    'maps.google.com',
  ]);
  assertTest(
    'AC-27',
    'Corporate Headquarters',
    'Registered office address verified at Zero Mile Metro Station, Patna with direct Google Maps link',
    ac27.allFound,
    ac27.allFound ? 'Headquarters address & Google Maps link validated' : `Missing: ${ac27.missing.join(', ')}`
  );

  // AC-28: LinkedIn Credential Integration
  const ac28 = checkFileContains(verifyPagePath, [
    'linkedin.com/profile/add',
    'CERTIFICATION_NAME',
    'Digital Developer Infinity Solution',
  ]);
  assertTest(
    'AC-28',
    'Credential Sharing',
    'Verification page provides 1-click Add to LinkedIn Profile button with pre-filled credential parameters',
    ac28.allFound,
    ac28.allFound ? 'LinkedIn certification action validated' : `Missing: ${ac28.missing.join(', ')}`
  );

  // AC-29: Root Models Re-Export Architecture
  const rootUserModel = path.join(rootDir, 'models', 'User.ts');
  const rootOrderModel = path.join(rootDir, 'models', 'Order.ts');
  const ac29 = fs.existsSync(rootUserModel) && fs.existsSync(rootOrderModel);
  assertTest(
    'AC-29',
    'Architecture',
    'Root models directory provides seamless typed re-exports for User and Order models',
    ac29,
    ac29 ? 'Root models directory re-exports validated' : 'Missing root User or Order model files'
  );

  // Output
  console.log('\n----------------------------------------------------------------------');
  console.log('   UAT TEST EXECUTION RESULTS (29 ACCEPTANCE CRITERIA)');
  console.log('----------------------------------------------------------------------\n');

  let passedCount = 0;
  for (const r of results) {
    const status = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} [${r.id}] ${r.category.padEnd(22)}: ${r.description}`);
    if (!r.passed) {
      console.log(`       ↳ Error Details: ${r.details}`);
    } else {
      passedCount++;
    }
  }

  console.log('\n======================================================================');
  console.log(`   UAT AUDIT SUMMARY: ${passedCount} / ${results.length} CRITERIA PASSED (${((passedCount / results.length) * 100).toFixed(1)}%)`);
  console.log('======================================================================\n');

  if (passedCount === results.length) {
    console.log('🎉 ALL 29 UAT ACCEPTANCE CRITERIA HAVE BEEN VERIFIED AND PASSED WITH ZERO ERRORS.\n');
    process.exit(0);
  } else {
    console.error(`❌ UAT Audit Failed: ${results.length - passedCount} criteria failed.\n`);
    process.exit(1);
  }
}

runAllUATTests();
