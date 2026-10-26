'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Star, 
  Users, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Code2, 
  Atom, 
  TrendingUp, 
  Palette, 
  Cpu, 
  Clock, 
  ExternalLink, 
  FileCheck2, 
  Check, 
  Search, 
  FileText, 
  Building, 
  User, 
  Hash, 
  X, 
  Loader2, 
  Phone, 
  Eye, 
  HelpCircle, 
  Lock, 
  ShieldAlert, 
  Download 
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

type ExamCategoryTab = 'BPSC' | 'BSEB' | 'CBSE' | 'SSC';
type DomainFilter = 'ALL' | 'BCA_IT' | 'COMMERCE' | 'SCIENCE' | 'ARTS';

interface StreamProgram {
  id: string;
  title: string;
  domain: DomainFilter;
  badgeLabel: string;
  badgeColor: string;
  durationText: string;
  description: string;
  milestones: { code: string; label: string }[];
  feeLabel: string;
  slug: string;
}

const STREAM_PROGRAMS: StreamProgram[] = [
  {
    id: 'bca-cloud',
    title: 'Full-Stack Cloud Engineering (Next.js & MongoDB)',
    domain: 'BCA_IT',
    badgeLabel: 'BCA / Computer Science',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    durationText: '4 Weeks (75 Hrs)',
    description: 'Build production REST APIs, Next.js Server Components, authentication & Cloudflare storage for real-world DDIS client systems.',
    milestones: [
      { code: 'W1', label: 'Architecture & DB' },
      { code: 'W2', label: 'API & Auth Setup' },
      { code: 'W3', label: 'Cloud Storage' },
      { code: 'W4', label: 'Capstone Deploy' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'full-stack-web-engineering',
  },
  {
    id: 'com-marketing',
    title: 'Digital Marketing & Corporate E-Commerce Operations',
    domain: 'COMMERCE',
    badgeLabel: 'B.Com / Management',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    durationText: '4 Weeks (60 Hrs)',
    description: 'Execute Technical SEO audits, Google Analytics 4 tracking funnels, Meta Ad spend simulations, and lead acquisition analysis.',
    milestones: [
      { code: 'W1', label: 'SEO On-Page Audit' },
      { code: 'W2', label: 'GA4 Events Setup' },
      { code: 'W3', label: 'Ad Budget Plan' },
      { code: 'W4', label: 'Final ROI Report' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'digital-marketing-growth-hacking',
  },
  {
    id: 'sci-computing',
    title: 'Scientific Computing & Experimental Data Analytics',
    domain: 'SCIENCE',
    badgeLabel: 'B.Sc / Science UG',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    durationText: '4 Weeks (75 Hrs)',
    description: 'Process scientific measurements, regression modeling, and statistical charts using Python (NumPy, Pandas, Matplotlib).',
    milestones: [
      { code: 'W1', label: 'Lab Dataset Clean' },
      { code: 'W2', label: 'Statistical Plots' },
      { code: 'W3', label: 'Curve Fitting Model' },
      { code: 'W4', label: 'Academic Paper Draft' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'scientific-data-analysis-python',
  },
  {
    id: 'arts-content',
    title: 'Technical Content Writing & Digital Communications',
    domain: 'ARTS',
    badgeLabel: 'B.A / Arts & Media',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    durationText: '4 Weeks (60 Hrs)',
    description: 'Draft industry whitepapers, pedagogical learning modules, press communication kits, and public awareness campaigns.',
    milestones: [
      { code: 'W1', label: 'Academic Summary' },
      { code: 'W2', label: 'Whitepaper Structure' },
      { code: 'W3', label: 'PR Release Copy' },
      { code: 'W4', label: 'Portfolio Dossier' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'content-writing-pr-journalism',
  },
];

export default function HomePage() {
  const router = useRouter();

  // Category navigation state (Must-Have 3)
  const [selectedExamTab, setSelectedExamTab] = useState<ExamCategoryTab>('BPSC');

  // Stream filter for Internships
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('ALL');

  // Enrollment Modal state
  const [enrollingProgram, setEnrollingProgram] = useState<StreamProgram | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  const allProducts = getHydratedProducts();

  // Filter products strictly based on selected category (Must-Have 4)
  const filteredProducts = allProducts.filter((p) => {
    if (selectedExamTab === 'BPSC') return p.tags.includes('BPSC') || p.tags.includes('Bihar Special');
    if (selectedExamTab === 'BSEB') return p.tags.includes('BSEB') || p.tags.includes('Bihar Board');
    if (selectedExamTab === 'CBSE') return p.tags.includes('CBSE') || p.tags.includes('Class 10th') || p.tags.includes('Class 12th');
    if (selectedExamTab === 'SSC') return p.tags.includes('SSC') || p.tags.includes('UPSC') || p.tags.includes('Quant');
    return true;
  });

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingProgram) return;

    setIsSubmitting(true);
    setEnrollError('');

    try {
      const res = await fetch('/api/internship/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: enrollingProgram.id,
          studentName: studentName || 'Student Intern',
          studentPhone: studentPhone || '+91 7544065425',
          collegeName: collegeName || 'Patliputra University, Patna',
          rollNumber: rollNumber || 'PPU-2026-904',
          degreeProgram: degreeProgram || 'BCA 3rd Year',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Enrollment could not be processed.');
      }

      setEnrollingProgram(null);
      router.push(`/dashboard/internship/${data.internshipId}`);
    } catch (err: any) {
      setEnrollError(err.message || 'Enrollment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToStudyMaterial = () => {
    document.getElementById('study-notes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInternships = () => {
    document.getElementById('internships-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. MUST-HAVE 1 & 2: CLEAR LOCAL HEADLINE & TWO PRIMARY CTAS (IMAGE 1)     */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-gradient-to-tr from-[#00A389]/20 via-[#1A73E8]/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bihar Exam Prep Portal &amp; DDIS Accredited Academic Center</span>
          </div>

          {/* MUST-HAVE 1: Clear Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Study Notes &amp; Practice PDFs for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A389] via-teal-300 to-amber-300">
              Bihar Exams
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Instant digital access to topper handwritten summaries, 10-year solved PYQs, and formula cheat sheets in <strong className="text-amber-300">Hindi &amp; English Medium</strong> for <strong className="text-white">BPSC 70th/71st</strong>, <strong className="text-white">Bihar Board (BSEB 10th &amp; 12th)</strong>, <strong className="text-white">CBSE</strong>, and <strong className="text-white">SSC</strong>.
          </p>

          {/* MUST-HAVE 2: Two Primary CTAs (Separate Journeys, Separate Buttons) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollToStudyMaterial}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00A389] to-[#008f77] hover:from-[#008f77] hover:to-[#007b66] text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Study Material</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToInternships}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs sm:text-sm border border-white/20 backdrop-blur-md shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Explore Internship Programs</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>

          {/* Search Box Trigger */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20 shadow-2xl">
              <SearchBar placeholder="Search 'BPSC 70th Bihar Special', 'BSEB 12th Physics', 'Class 10 Math'..." />
            </div>
          </div>

          {/* Quick Trending Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-400">Popular:</span>
            {[
              { label: 'BPSC 70th Bihar Special GK', tab: 'BPSC' },
              { label: 'BSEB 12th Physics Formula Sheet', tab: 'BSEB' },
              { label: 'CBSE 10th Math Crux', tab: 'CBSE' },
              { label: 'SSC CGL Quant Tricks', tab: 'SSC' },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedExamTab(chip.tab as ExamCategoryTab);
                  scrollToStudyMaterial();
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-[#00A389] text-slate-200 hover:text-white transition-colors border border-white/10"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MUST-HAVE 3 & 4: EXAM CATEGORY NAVIGATION & PRODUCT CARDS (IMAGE 1)    */}
      {/* ========================================================================= */}
      <section id="study-notes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-black uppercase text-[#00A389] tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Exam Category Navigation
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Find Your Subject Notes &amp; Solved Papers
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Every note includes complete PDF download with lifetime offline access &amp; free sample preview.
            </p>
          </div>

          {/* MUST-HAVE 3: One-Click Exam Category Tabs (BPSC, Bihar Board, CBSE, SSC) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'BPSC', label: 'BPSC 70th/71st' },
              { id: 'BSEB', label: 'Bihar Board (BSEB)' },
              { id: 'CBSE', label: 'CBSE & Boards' },
              { id: 'SSC', label: 'SSC & Central' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedExamTab(tab.id as ExamCategoryTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border ${
                  selectedExamTab === tab.id
                    ? 'bg-[#00A389] text-white border-[#00A389] shadow-md shadow-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transparent Pricing Callout Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
              ₹
            </span>
            <span>
              <strong>Clear Pricing Promise:</strong> Single Notes at <strong>₹49</strong> include full high-resolution PDF download + lifetime offline access. Or unlock all 5,000+ notes with the <strong>₹199 Annual Pass</strong>.
            </span>
          </div>
          <Link
            href="/pricing-policy"
            className="text-[#00A389] font-black underline shrink-0 hover:text-emerald-800"
          >
            Read Pricing &amp; License Terms →
          </Link>
        </div>

        {/* MUST-HAVE 4: Actual Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={(product as any)._id || product.id || product.slug || idx} product={product} />
          ))}
        </div>

        {/* Explore Full Catalog Link */}
        <div className="text-center pt-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-extrabold text-xs shadow-xs hover:shadow-md transition-all"
          >
            <span>Browse All 5,000+ Notes, Formula Sheets &amp; Solved PYQs</span>
            <ChevronRight className="w-4 h-4 text-[#00A389]" />
          </Link>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. MUST-HAVE 5: ANNUAL PASS SECTION (NO VAGUE PROMISES) (IMAGE 1 & 5)      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2563EB] via-[#4338CA] to-[#1D4ED8] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Column: Annual Pass Features & Resources */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-[#F59E0B] text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase shadow-xs">
                <span>👑</span>
                <span>STUDYFREE ANNUAL PDF PASS PRO</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                Unlock 5,000+ Notes, Formula Sheets &amp; Solved Papers
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                One annual subscription. Unlimited dynamic watermarked downloads for BPSC, BSEB, CBSE, and SSC for a full year. No vague promises—see the exact breakdown below.
              </p>

              {/* Explicit Inclusion Checklist (Must-Have 5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-blue-100 text-left font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>BPSC 70th &amp; 71st CCE:</strong> Complete Prelims &amp; Mains</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>Bihar Board (BSEB):</strong> 10th Matric &amp; 12th Inter VVI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>CBSE School Boards:</strong> Class 9th–12th NCERT Crux</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>SSC &amp; Central Exams:</strong> CGL/CHSL Quant &amp; GS PYQs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>Formula Handbooks:</strong> Physics, Chemistry &amp; Math</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span><strong>Strictly Zero Auto-Debit:</strong> One-time ₹199 only</span>
                </div>
              </div>

              {/* Explicit Exclusions Declaration */}
              <div className="pt-2 text-[11px] text-blue-200/90 italic flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Notice: Excludes physical printed books &amp; private 1-on-1 personal mentorship.</span>
              </div>
            </div>

            {/* Right Pass Box (Image 5) */}
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6 w-full lg:w-auto shrink-0 shadow-lg text-center sm:text-left">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                  All-Access Annual Pass
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  ₹199 <span className="text-xs font-normal text-blue-200">/ 365 days</span>
                </div>
                <div className="text-[10px] text-emerald-300 font-bold">
                  ✓ Includes all upcoming 2026-2027 updates
                </div>
              </div>

              <Link
                href="/checkout?plan=ANNUAL_PASS"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Get Pass Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Transparent Single PDF (₹49) vs Annual Pass (₹199) Comparison */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-amber-300">Single PDF Access (₹49):</span>
              <p className="text-blue-100">
                Buy individual notes only when needed. Full PDF download included with lifetime offline storage on your device. Free 3-page preview available before purchase.
              </p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-emerald-300">Annual Pass Access (₹199):</span>
              <p className="text-blue-100">
                Best value for students preparing for multiple exams. Download and read all 5,000+ notes, formula sheets, and solved papers across all categories for 365 days.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NEP-2020 VIRTUAL INTERNSHIP & CERTIFICATION WING                       */}
      {/* ========================================================================= */}
      <section id="internships-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-indigo-600 tracking-wider">
            OFFICIAL STREAMS • NEP-2020 ACCREDITED
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            Mandatory College Internships with Government-Recognized DDIS Certification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Fulfill your 4-week &amp; 8-week (60–75 credit hours) college internship requirements across BCA/IT, Science, Commerce, and Arts. Complete 4 weekly milestones, pass mentor evaluation, and receive your QR-verified certificate &amp; viva dossier.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Domains' },
            { id: 'BCA_IT', label: 'BCA / IT & Web' },
            { id: 'COMMERCE', label: 'B.Com / Commerce' },
            { id: 'SCIENCE', label: 'B.Sc / Science' },
            { id: 'ARTS', label: 'B.A / Arts & Media' },
          ].map((pill) => {
            const isSelected = selectedDomain === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedDomain(pill.id as DomainFilter)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Stream Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STREAM_PROGRAMS.filter(p => selectedDomain === 'ALL' || p.domain === selectedDomain).map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${prog.badgeColor}`}>
                    {prog.badgeLabel}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {prog.durationText}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {prog.description}
                </p>

                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    4 Weekly Milestone Tasks:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {prog.milestones.map((m) => (
                      <div key={m.code} className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={3} />
                        <span className="truncate">{m.code}: {m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ENROLLMENT FEE
                  </div>
                  <div className="text-xs font-black text-emerald-600">
                    {prog.feeLabel}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnrollingProgram(prog)}
                  className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Start Free Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Public Certificate Verification Link */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00A389] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Already Completed Your Internship?</div>
              <div className="text-slate-500">Verify your official DDIS credential or download your 2-page college viva dossier.</div>
            </div>
          </div>
          <Link
            href="/verify"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs shrink-0"
          >
            Verify Credential Online →
          </Link>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. MUST-HAVE 6: ABOUT DDIS SECTION (BRIEF, CREDIBLE, HONEST) (IMAGE 1)     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-black uppercase text-[#00A389] tracking-wider">
                About the Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Digital Developer Infinity Solution (DDIS)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Registered IT Organization &amp; EdTech Infrastructure Provider • Website:{' '}
                <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
                  digitalinfinityddis.com
                </a>
              </p>
            </div>

            <Link
              href="/about"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 self-start sm:self-center transition-all shadow-sm shrink-0"
            >
              <span>Read Full Corporate Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed font-normal">
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#00A389]" />
                Who We Are
              </h3>
              <p>
                StudyFree PDF is an ed-tech notes marketplace operated under <strong>Digital Developer Infinity Solution (DDIS)</strong>. Based in Patna, Bihar, we curate verified study materials for BPSC, BSEB, CBSE, and SSC learners.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                NEP-2020 Accreditation
              </h3>
              <p>
                We provide mandatory 60–75 credit hours experiential internship training for college undergraduates in Science, Commerce, Arts, and IT, providing verifiable DDIS credentials and project viva dossiers.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Why Students Trust Us
              </h3>
              <p>
                Every single PDF has a free 3-page preview before paying. Purchased notes carry lifetime offline access, 7-day refund protection, and personalized anti-piracy watermarking.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">50,000+</div>
              <div className="text-[11px] text-slate-500 font-medium">Students Enrolled</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">5,000+</div>
              <div className="text-[11px] text-slate-500 font-medium">Verified PDF Notes</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">100%</div>
              <div className="text-[11px] text-slate-500 font-medium">QR-Verified Dossiers</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">4.9 / 5</div>
              <div className="text-[11px] text-slate-500 font-medium">Average Student Rating</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. 1-CLICK MODAL: DIRECT INTERNSHIP ENROLLMENT                            */}
      {/* ========================================================================= */}
      {enrollingProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              type="button"
              onClick={() => setEnrollingProgram(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200">
                NEP-2020 Subsidized Free Enrollment
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {enrollingProgram.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your college details for your official DDIS Certificate &amp; Viva Dossier.
              </p>
            </div>

            {enrollError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                {enrollError}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name (As on College ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khushboo Kumari"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 7544065425"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patliputra University"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    University Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BCA9021"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Degree &amp; Semester
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA 3rd Year / B.Sc Sem 5"
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>Start Free 4-Week Internship Workspace</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
