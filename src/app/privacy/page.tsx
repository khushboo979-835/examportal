import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Server, 
  FileText, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  Award,
  Globe,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: 'Privacy & Data Protection Policy | StudyFree PDF & DDIS',
  description: 'Official Statutory Privacy Policy of StudyFree PDF operated by Digital Developer Infinity Solution (DDIS). Compliant with the Digital Personal Data Protection Act (DPDP Act, 2023) and Information Technology Act, 2000.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Policy Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP Act (2023) &amp; IT Act (2000) Compliant</span>
            </span>
            <span className="text-slate-400 text-xs">
              • Last Updated: November 2026 • Version 2.4
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Privacy &amp; Student Data Protection Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            <strong>StudyFree PDF</strong>, operated in official partnership with <strong>Digital Developer Infinity Solution (DDIS)</strong> (&quot;Talent Aapka, Rasta Hamara&quot;), is committed to safeguarding student data, personal identity, academic records, and transactional privacy with bank-grade security standards.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL/TLS 1.3
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Zero Data Selling Guarantee
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" /> RBI-Authorized Payment Gateways
            </span>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A389] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Zero Commercial Selling</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your mobile number, email, and academic documents are strictly protected and never sold or shared with third-party advertisers or telemarketers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">RBI Compliant Payments</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All transactions for ₹49 single notes and ₹199 annual passes are processed via Razorpay. We never store credit/debit card numbers or UPI MPINs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Watermarked Anti-Piracy DRM</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized security watermarks with phone number and order ID are stamped on page margins to establish personal student ownership.
            </p>
          </div>
        </div>

        {/* Detailed Legal Sections Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Corporate Identity &amp; Scope of this Policy</span>
            </h2>
            <p>
              This Privacy Policy governs the collection, processing, storage, and rights associated with personal and academic data when utilizing <strong>StudyFree PDF</strong> (accessible via <a href="https://studyfreepdf.com" className="text-blue-600 font-bold hover:underline">studyfreepdf.com</a>), operated by <strong>Digital Developer Infinity Solution (DDIS)</strong> (&quot;DDIS&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;), a registered software engineering and EdTech enterprise with corporate headquarters located near Zero Mile Metro Station, Patna, Bihar - 800007, India.
            </p>
            <p>
              This document complies with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Categories of Student Data We Collect</span>
            </h2>
            <p>We adhere to strict data minimization principles, collecting only essential academic and transactional data:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs uppercase text-[#00A389]">A. Student Identity &amp; Contact</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full student name, primary WhatsApp/mobile phone number, and optional email address provided during account registration, checkout, or support queries.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs uppercase text-blue-600">B. College &amp; Internship Credentials</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  College/University name, university roll number, semester degree program (e.g. BCA, B.Sc, B.Com, B.A), and milestone deliverable URLs (GitHub/Drive links) required for NEP-2020 accreditation.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs uppercase text-amber-600">C. Transactional &amp; Invoicing Metadata</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unique order numbers (e.g., ORD-2026-XXXXX), purchased PDF IDs, annual pass subscriptions, invoice timestamps, and Razorpay gateway payment tokens.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs uppercase text-purple-600">D. Technical &amp; Security Logs</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  IP addresses for rate limiting against automated scrapers, browser user agent, download verification timestamps, and bookmark preferences stored locally on your device.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Purpose of Data Processing</span>
            </h2>
            <p>Your data is processed exclusively for sanctioned educational and fulfillment objectives:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Secure PDF Delivery:</strong> Rendering personalized download streams stamped with anti-piracy license metadata.</li>
              <li><strong>NEP-2020 Accreditation &amp; Evaluation:</strong> Facilitating weekly project evaluation by authorized DDIS mentors and generating tamper-proof 2-page landscape certificates with project dossiers.</li>
              <li><strong>Public Verification:</strong> Powering the public verification registry (<a href="/verify" className="text-blue-600 font-bold hover:underline">/verify</a>) so college evaluators and employers can confirm certificate authenticity via QR code.</li>
              <li><strong>Customer Inquiries &amp; Invoicing:</strong> Generating official GST/tax invoices, automated inquiry tickets (TKT-2026-XXXXX), and dispatching notifications to <a href="mailto:studyfreepdf2@gmail.com" className="text-blue-600">studyfreepdf2@gmail.com</a>.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Dynamic Anti-Piracy Watermarking (Digital Rights Management)</span>
            </h2>
            <p>
              To protect the intellectual property of educators, toppers, and state rankers who compile our study materials, all master PDFs are stored in private Cloudflare R2 / AWS S3 buckets with no public read permissions.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice on Stamped Security Markings</span>
              </div>
              <p className="text-xs leading-relaxed">
                When you initiate a PDF download via <code>/api/pdf/download/[id]</code>, our server dynamically stamps an indelible, semi-transparent watermark onto the header, footer, and diagonal canvas of every page containing: <code>&quot;Licensed to: +91 {`{user.phone}`} | Order #{`{orderNumber}`}&quot;</code>. This is required under intellectual property laws to deter unauthorized file redistributions.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">5</span>
              <span>Payment Security &amp; RBI Compliance</span>
            </h2>
            <p>
              All financial transactions across StudyFree PDF are routed directly through Reserve Bank of India (RBI) licensed payment aggregators (<strong>Razorpay</strong>) supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards (RuPay, Visa, Mastercard), and Net Banking across all scheduled Indian banks.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment card numbers, expiration dates, CVVs, and Net Banking passwords <strong>never enter or touch our servers</strong>.</li>
              <li>Transactions are protected by <strong>256-bit TLS 1.3 encryption</strong> and Level 1 PCI-DSS compliant infrastructure.</li>
              <li>Order fulfillments are strictly validated via cryptographic HMAC-SHA256 server-to-server gateway webhooks.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">6</span>
              <span>Zero Data Selling &amp; Anti-Spam Commitment</span>
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="font-black text-sm flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Our Unconditional Legal Guarantee to Every Aspirant</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-900">
                StudyFree PDF and Digital Developer Infinity Solution (DDIS) have never sold, rented, leased, or monetized student personal data to third-party telemarketers, coaching institutes, loan brokers, or marketing syndicates. We do not participate in cross-site tracking or commercial data brokerage.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">7</span>
              <span>Student Rights Under DPDP Act (2023)</span>
            </h2>
            <p>As a data principal under Indian data protection legislation, you possess explicit legal rights:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Right to Summary Information:</strong> Right to obtain a summary of personal data and processing activities.</li>
              <li><strong>Right to Correction &amp; Updating:</strong> Right to correct inaccurate personal data or update contact credentials.</li>
              <li><strong>Right to Erasure / Account Deletion:</strong> Right to request account deletion and removal of non-mandatory historical logs.</li>
              <li><strong>Right to Grievance Redressal:</strong> Right to prompt resolution of concerns through our designated statutory Grievance Officer.</li>
            </ul>
          </div>

          {/* Section 8: Grievance Redressal Office */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">8</span>
              <span>Statutory Grievance Redressal Officer</span>
            </h2>
            <p>
              In compliance with Rule 5(9) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact credentials of our official Grievance Redressal Officer are provided below:
            </p>

            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#00A389] uppercase tracking-wider">Statutory Grievance Officer</div>
                  <div className="text-base font-black text-white mt-0.5">Er. Deepak Kumar</div>
                  <div className="text-xs text-slate-400">Head of Technology &amp; Student Data Governance</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 self-start sm:self-auto">
                  Response SLA: 24 Hours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Official Support &amp; Grievance Email</div>
                  <a href="mailto:studyfreepdf2@gmail.com" className="text-white hover:text-[#00A389] font-bold text-sm block">
                    studyfreepdf2@gmail.com
                  </a>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Customer Care Helpline</div>
                  <a href="tel:+917544065425" className="text-white hover:text-[#00A389] font-bold text-sm block">
                    +91 7544065425 (10:00 AM – 7:00 PM IST)
                  </a>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-2 border-t border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Registered Entity &amp; Physical Office Address</div>
                  <p className="text-slate-200">
                    Digital Developer Infinity Solution (DDIS), Near Zero Mile Metro Station, Patna, Bihar - 800007, India
                  </p>
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Corporate Web Portal: <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-[#00A389] hover:underline">digitalinfinityddis.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            href="/terms"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <span>View Terms of Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing-policy"
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              ₹49 &amp; ₹199 Pricing Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/refund-policy"
              className="text-xs font-bold text-slate-600 hover:underline"
            >
              Refund Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/contact"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
