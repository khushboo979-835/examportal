'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  Download, 
  Zap, 
  Award, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  HelpCircle, 
  Lock, 
  ExternalLink,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden font-sans">
      
      {/* Sleek Gradient Accent Line on Top */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />

      {/* 1. Value Proposition & Trust Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Trust Card 1 */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm tracking-tight">100% Verified Notes</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Curated by BPSC/UPSC state rankers and senior subject educators.
                </p>
              </div>
            </div>

            {/* Trust Card 2 */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm tracking-tight">Instant PDF Download</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Full high-yield PDF delivered instantly with lifetime offline access.
                </p>
              </div>
            </div>

            {/* Trust Card 3 */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm tracking-tight">Anti-Piracy DRM</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  On-the-fly encrypted license watermarks stamped on every page.
                </p>
              </div>
            </div>

            {/* Trust Card 4 */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm tracking-tight">DDIS NEP-2020</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  UGC-compliant semester credit virtual internships &amp; QR credentials.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Identity & Accreditation (Wide: 4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-3">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <img
                  src="/logo.png"
                  alt="StudyFree PDF Logo"
                  className="h-11 sm:h-12 w-auto object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                    StudyFree <span className="text-[#00A389]">PDF</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    An EdTech Unit of DDIS
                  </span>
                </div>
              </Link>

              {/* Slogan Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 text-[11px] font-extrabold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>&quot;Talent Aapka, Rasta Hamara&quot; (टैलेंट आपका, रास्ता हमारा)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              StudyFree PDF operates in official partnership with <strong>Digital Developer Infinity Solution (DDIS)</strong> as Bihar and India&apos;s dual-engine EdTech ecosystem: delivering topper exam notes @ ₹49 and NEP-2020 accredited virtual college internships with tamper-proof certification.
            </p>

            {/* Accreditation & Quality Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A389]" /> UGC Aligned
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> 256-Bit SSL
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> DDIS Certified
              </span>
            </div>
          </div>

          {/* Column 2: Exam Notes Vault (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#00A389]" />
              <span>Exam Study Vaults</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/explore?level=COMPETITIVE" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  BPSC 70th/71st Bihar Special
                </Link>
              </li>
              <li>
                <Link href="/explore?level=K12&board=BSEB" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  BSEB 12th Inter (Science/Arts)
                </Link>
              </li>
              <li>
                <Link href="/explore?level=K12&board=BSEB" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  BSEB 10th Matric Model Papers
                </Link>
              </li>
              <li>
                <Link href="/explore?level=K12&board=CBSE" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  CBSE Class 10th &amp; 12th NCERT
                </Link>
              </li>
              <li>
                <Link href="/explore?level=COMPETITIVE" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  SSC CGL &amp; CHSL Solved PYQs
                </Link>
              </li>
              <li>
                <Link href="/explore?type=FORMULA_SHEET" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Formula Cheat Sheets &amp; Maps
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-[#00A389] font-bold hover:underline flex items-center gap-1 pt-1">
                  <span>Browse All 5,000+ Notes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: NEP-2020 Internships (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>NEP-2020 Internships</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/internships?stream=BCA_IT" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  BCA / IT: Full-Stack Cloud Development
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=COMMERCE" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Commerce: Digital Marketing &amp; FinTech
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=SCIENCE" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Science: Python Data Analytics &amp; AI
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=ARTS" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Arts: Technical Content Writing &amp; PR
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Student Assignment Submission Workspace
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-blue-400 font-bold hover:underline flex items-center gap-1 pt-1">
                  <span>Verify DDIS Student Certificate</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Transparent Policies & Admin Desk (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Trust &amp; Governance</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/pricing-policy" className="hover:text-white transition-colors flex items-center justify-between text-amber-300 font-bold">
                  <span>₹49 &amp; ₹199 Pricing Terms</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Fixed</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  100% Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors font-bold text-slate-200 flex items-center gap-1">
                  <span>Privacy Policy (DPDP Act 2023)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service &amp; DRM License
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer &amp; Non-Affiliation Notice
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us (DDIS Corporate Profile)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Grievance Redressal Desk
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800/60">
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Operations Portal</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">Command</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Contact & Support Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 rounded-2xl p-6 border border-slate-800/60">
          
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Registered Office (Patna HQ)</div>
              <p className="text-xs text-white font-medium mt-0.5 leading-snug">
                Near Zero Mile Metro Station, Patna, Bihar - 800007, India
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Customer Helpline &amp; WhatsApp</div>
              <div className="text-xs text-white font-bold mt-0.5 flex flex-wrap items-center gap-2">
                <a href="tel:+917544065425" className="hover:text-[#00A389] transition-colors">
                  +91 7544065425
                </a>
                <a
                  href="https://wa.me/917544065425"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold hover:bg-emerald-500/30 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Official Inquiries &amp; Grievance</div>
              <p className="text-xs text-white font-medium mt-0.5">
                <a href="mailto:studyfreepdf2@gmail.com" className="hover:text-amber-400 transition-colors font-bold">
                  studyfreepdf2@gmail.com
                </a>
                <span className="text-slate-400 text-[10px] block">Turnaround: 24 Hours Response SLA</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Regulatory Identity & Grievance Redressal Strip */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p>
              <strong className="text-slate-300">Corporate Entity:</strong> Digital Developer Infinity Solution (DDIS) | <strong className="text-emerald-400">&quot;Talent Aapka, Rasta Hamara&quot;</strong> | Official Portal: <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-[#00A389] hover:underline">digitalinfinityddis.com</a>
            </p>
            <p>
              <strong className="text-slate-300">Grievance Redressal Officer:</strong> Er. Deepak Kumar | Email: <a href="mailto:studyfreepdf2@gmail.com" className="text-slate-400 hover:text-white">studyfreepdf2@gmail.com</a> | Statutory Resolution Period: Maximum 7 business days under IT Rules, 2021.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0 space-y-0.5">
            <p>© {new Date().getFullYear()} StudyFree PDF • A Division of Digital Developer Infinity Solution (DDIS). All Rights Reserved.</p>
            <p className="text-[10px] text-slate-600">
              Compliant with Information Technology Act, 2000, DPDP Act 2023, &amp; UGC NEP-2020 Internship Guidelines.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
