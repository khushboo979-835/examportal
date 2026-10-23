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
  Phone
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

type FlagshipOffering = 'INTERNSHIPS' | 'NOTES';
type DomainFilter = 'ALL' | 'BCA_IT' | 'COMMERCE' | 'SCIENCE' | 'ARTS';

interface MilestonePreview {
  code: string;
  label: string;
}

interface StreamProgram {
  id: string;
  title: string;
  domain: DomainFilter;
  badgeLabel: string;
  badgeColor: string;
  durationText: string;
  description: string;
  milestones: MilestonePreview[];
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
  {
    id: 'bca-python-ml',
    title: 'Python for AI, Machine Learning & Scikit-Learn',
    domain: 'BCA_IT',
    badgeLabel: 'BCA / IT & Web',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    durationText: '4 Weeks (75 Hrs)',
    description: 'Supervised ML model training, cross-validation, hyperparameter tuning, and FastAPI microservice API deployment.',
    milestones: [
      { code: 'W1', label: 'Feature Engineering' },
      { code: 'W2', label: 'Model Benchmarking' },
      { code: 'W3', label: 'PCA Clustering' },
      { code: 'W4', label: 'FastAPI Microservice' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'python-machine-learning-essentials',
  },
  {
    id: 'com-tally',
    title: 'Corporate Accounting, GST Returns & TallyPrime',
    domain: 'COMMERCE',
    badgeLabel: 'B.Com / Accounting',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    durationText: '4 Weeks (75 Hrs)',
    description: 'Ledger journal entries, GSTR-1 & GSTR-3B monthly filing reconciliations, trial balances, and audit trails.',
    milestones: [
      { code: 'W1', label: 'Ledger Automation' },
      { code: 'W2', label: 'GSTR-1 Reconciliation' },
      { code: 'W3', label: 'ITC Tax Audit' },
      { code: 'W4', label: 'Final Financials' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'corporate-accounting-gst-tally',
  },
];

export default function HomePage() {
  const router = useRouter();

  // Flagship offerings toggle (Image 1)
  const [offering, setOffering] = useState<FlagshipOffering>('INTERNSHIPS');

  // Stream filter for Internships (Image 3)
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('ALL');

  // Exam notes active tab for PDF Marketplace
  const [notesExamTab, setNotesExamTab] = useState<'BIHAR' | 'CENTRAL' | 'SCHOOL' | 'TECH'>('BIHAR');

  // 1-Click Enrollment Modal State
  const [enrollingProgram, setEnrollingProgram] = useState<StreamProgram | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  const allProducts = getHydratedProducts();

  const filteredProducts = allProducts.filter((p) => {
    if (notesExamTab === 'BIHAR') return p.tags.includes('BPSC') || p.tags.includes('BSEB') || p.tags.includes('Bihar Board');
    if (notesExamTab === 'CENTRAL') return p.tags.includes('SSC') || p.tags.includes('UPSC') || p.tags.includes('Polity');
    if (notesExamTab === 'SCHOOL') return p.tags.includes('CBSE') || p.tags.includes('BSEB');
    if (notesExamTab === 'TECH') return p.tags.includes('MCA') || p.tags.includes('DSA');
    return true;
  });

  const filteredPrograms = STREAM_PROGRAMS.filter((p) => {
    if (selectedDomain === 'ALL') return true;
    return p.domain === selectedDomain;
  });

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingProgram) return;

    setIsSubmitting(true);
    setEnrollError('');

    try {
      // Find trackId or pass fallback ID
      const res = await fetch('/api/internship/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: enrollingProgram.id,
          studentName: studentName || 'Student Intern',
          studentPhone: studentPhone || '+91 9876543210',
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

  const scrollToStreams = () => {
    const el = document.getElementById('official-streams');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/internships');
    }
  };

  return (
    <div className="space-y-14 pb-20">
      
      {/* ======================================================== */}
      {/* 1. HERO HUB: FLAGSHIP SWITCHER & DUAL OFFERINGS (IMAGE 1) */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800">
        
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-gradient-to-tr from-blue-100/50 via-emerald-100/30 to-purple-100/40 dark:from-blue-900/10 dark:to-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* A. DUAL FLAGSHIP SWITCHER PILL (IMAGE 1) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs gap-1.5">
            
            {/* Tab 1: NEP-2020 Internships */}
            <button
              type="button"
              onClick={() => setOffering('INTERNSHIPS')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${
                offering === 'INTERNSHIPS'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${offering === 'INTERNSHIPS' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>🎓 NEP-2020 Internships</span>
              <span className="bg-[#00E599]/25 text-[#008F66] dark:text-[#00E599] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#00E599]/30">
                Main Flagship
              </span>
            </button>

            {/* Tab 2: Testbook Notes & PYQs */}
            <button
              type="button"
              onClick={() => setOffering('NOTES')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${
                offering === 'NOTES'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${offering === 'NOTES' ? 'text-[#00A389]' : 'text-slate-400'}`} />
              <span>📑 Testbook Notes &amp; PYQs</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* OFFERING 1: NEP-2020 INTERNSHIPS VIEW (IMAGES 1 & 2) */}
          {/* ======================================================== */}
          {offering === 'INTERNSHIPS' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Compliance Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-800 text-[11px] font-extrabold text-blue-800 dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>UGC &amp; NEP-2020 Guidelines Compliant Experiential Training</span>
                <span className="text-blue-300 dark:text-blue-700">|</span>
                <span>ISO Certified DDIS Credential</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Mandatory College Internships with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A389] via-[#00B4D8] to-[#2563EB]">
                  Government-Recognized
                </span>{' '}
                DDIS Certification
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                Fulfill your 4-week &amp; 8-week (60–75 hours) university credit requirements across{' '}
                <strong className="text-slate-900 dark:text-white font-black">BCA/IT</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-black">Science</strong>,{' '}
                <strong className="text-slate-900 dark:text-white font-black">Commerce</strong>, and{' '}
                <strong className="text-slate-900 dark:text-white font-black">Arts</strong>. Work on live industry case studies, pass 4 milestones, and get auto-generated tamper-proof QR certificates &amp; college viva dossiers.
              </p>

              {/* Action Buttons (Image 2) */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={scrollToStreams}
                  className="px-7 py-3.5 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Explore All Internship Tracks</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <Link
                  href="/verify"
                  className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00A389]" />
                  <span>Verify Existing Certificate</span>
                </Link>
              </div>

              {/* 4 Feature Value Cards (Image 2) */}
              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                
                {/* Card 1 */}
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    60–75 Hours Credit
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Full NEP-2020 UGC workload compliance.
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    Dynamic QR Code
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Tamper-proof verifiable online link.
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    2-Page Viva Dossier
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    College-ready report for HOD signature.
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    DDIS Industry Seal
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Registered software agency credentials.
                  </div>
                </div>

              </div>

              {/* Scroll down indicator */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={scrollToStreams}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Scroll to Streams"
                >
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* OFFERING 2: TESTBOOK NOTES & PYQS MARKETPLACE VIEW */}
          {/* ======================================================== */}
          {offering === 'NOTES' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200/80 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>India&apos;s #1 Dedicated PDF Marketplace for Exam Notes &amp; Solved Papers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Find Your Exam Notes &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A389] via-teal-400 to-indigo-600">
                  Solved Papers
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                Instant digital access to topper handwritten summaries, 10-year solved PYQs, and formula cheat sheets in <strong className="text-amber-600 dark:text-amber-400">Hindi &amp; English Medium</strong>.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-1">
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
                  <SearchBar placeholder="Search 'BPSC 70th Bihar Special', 'BSEB 12th Physics', 'SSC CGL Math'..." />
                </div>
              </div>

              {/* Trending Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-xs font-bold text-slate-400">Trending:</span>
                {[
                  { label: 'BPSC 70th Prelims', slug: 'bpsc-70th-cce' },
                  { label: 'BSEB 12th Science', slug: 'bseb-class-12-science' },
                  { label: 'CBSE 10th Standard', slug: 'cbse-class-10th' },
                  { label: 'SSC CGL Quant Tricks', slug: 'ssc-cgl-2026' },
                  { label: 'UPSC Laxmikanth Mindmaps', slug: 'upsc-cse-prelims-mains' },
                ].map((chip, idx) => (
                  <Link
                    key={idx}
                    href={`/exams/${chip.slug}`}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#00A389] hover:text-white text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/80 dark:border-slate-700"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. OFFICIAL STREAMS: NEP-2020 ACADEMIC TRACKS (IMAGES 3 & 4) */}
      {/* ======================================================== */}
      <section id="official-streams" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-indigo-600 tracking-wider">
            OFFICIAL STREAMS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Select Your University Stream
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            Choose your academic domain and begin 4-week task milestones.
          </p>
        </div>

        {/* Filter Pills (Image 3) */}
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
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Stream Program Cards Grid (Images 3 & 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${prog.badgeColor}`}>
                    {prog.badgeLabel}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {prog.durationText}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {prog.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {prog.description}
                </p>

                {/* 4 Weekly Milestone Tasks Box */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    4 Weekly Milestone Tasks:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {prog.milestones.map((m) => (
                      <div key={m.code} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={3} />
                        <span className="truncate">{m.code}: {m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer: Fee & Start CTA (Image 4) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ENROLLMENT FEE
                  </div>
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {prog.feeLabel}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnrollingProgram(prog)}
                  className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span>Start Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ======================================================== */}
      {/* 3. TESTBOOK PASS PRO VALUE BANNER (IMAGE 5) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2563EB] via-[#4338CA] to-[#1D4ED8] rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          {/* Decorative ambient crown watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white text-9xl">
            👑
          </div>

          {/* Left Text */}
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#F59E0B] text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase shadow-xs">
              <span>👑</span>
              <span>TESTBOOK PDF PASS PRO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
              Unlock 5,000+ Notes, Formula Sheets &amp; Solved Papers
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
              Get unlimited downloads across all School Boards (BSEB, CBSE), BPSC, SSC, and Higher Education for a full year.
            </p>
          </div>

          {/* Right Card inside banner (Image 5) */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex items-center justify-between gap-6 w-full lg:w-auto shrink-0 shadow-lg">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                All-Access Annual Pass
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹199 <span className="text-xs font-normal text-blue-200">/year</span>
              </div>
            </div>

            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Get Pass Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. EXAM CATALOG & NOTES RESOURCE HIERARCHY */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-extrabold text-[#00A389] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4" /> Exam Hierarchy Selector
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Explore By Exam Category</h2>
          </div>

          {/* Testbook Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'BIHAR', label: 'Bihar State Exams' },
              { id: 'CENTRAL', label: 'Central Exams (SSC / UPSC)' },
              { id: 'SCHOOL', label: 'School Boards (10th / 12th)' },
              { id: 'TECH', label: 'Engineering & MCA' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNotesExamTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  notesExamTab === tab.id
                    ? 'bg-[#00A389] text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={(product as any)._id || product.id || product.slug || idx} product={product} />
          ))}
        </div>

      </section>

      {/* ======================================================== */}
      {/* 5. 1-CLICK MODAL: DIRECT INTERNSHIP ENROLLMENT */}
      {/* ======================================================== */}
      {enrollingProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 relative">
            
            <button
              type="button"
              onClick={() => setEnrollingProgram(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200">
                NEP-2020 Subsidized Enrollment
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name (As on College ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khushboo Kumari"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patliputra University"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BCA9021"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Degree &amp; Semester
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA 3rd Year / B.Sc Sem 5"
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
