'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Code2,
  Atom,
  TrendingUp,
  Palette,
  Cpu,
  FileText,
  Grid,
  Search,
  ExternalLink,
  Download,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Crown
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

type DomainTab = 'ALL' | 'BCA_IT' | 'COMMERCE' | 'SCIENCE' | 'ARTS';

interface TrackMilestone {
  code: string;
  name: string;
}

interface HomepageTrack {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  duration: string;
  domain: DomainTab;
  description: string;
  milestones: TrackMilestone[];
  feeLabel: string;
  slug: string;
}

const HOMEPAGE_TRACKS: HomepageTrack[] = [
  {
    id: 'bca-cloud',
    title: 'Full-Stack Cloud Engineering (Next.js & MongoDB)',
    badge: 'BCA / Computer Science',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    duration: '4 Weeks (75 Hrs)',
    domain: 'BCA_IT',
    description:
      'Build production REST APIs, Next.js Server Components, authentication & Cloudflare storage for real-world DDIS clients...',
    milestones: [
      { code: 'W1', name: 'Architecture & DB' },
      { code: 'W2', name: 'API & Auth Setup' },
      { code: 'W3', name: 'Cloud Storage' },
      { code: 'W4', name: 'Capstone Deploy' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'full-stack-cloud-engineering-nextjs-mongodb',
  },
  {
    id: 'commerce-mkt',
    title: 'Digital Marketing & Corporate E-Commerce Operations',
    badge: 'B.Com / Management',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    duration: '4 Weeks (60 Hrs)',
    domain: 'COMMERCE',
    description:
      'Execute Technical SEO audits, Google Analytics 4 tracking funnels, Meta Ad spend simulations, and lead acquisition analysis.',
    milestones: [
      { code: 'W1', name: 'SEO On-Page Audit' },
      { code: 'W2', name: 'GA4 Events Setup' },
      { code: 'W3', name: 'Ad Budget Plan' },
      { code: 'W4', name: 'Final ROI Report' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'digital-marketing-corporate-ecommerce-operations',
  },
  {
    id: 'sci-computing',
    title: 'Scientific Computing & Experimental Data Analytics',
    badge: 'B.Sc / Science UG',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    duration: '4 Weeks (75 Hrs)',
    domain: 'SCIENCE',
    description:
      'Process scientific measurements, regression modeling, and statistical charts using Python (NumPy, Pandas, Matplotlib).',
    milestones: [
      { code: 'W1', name: 'Lab Dataset Clean' },
      { code: 'W2', name: 'Statistical Plots' },
      { code: 'W3', name: 'Curve Fitting Model' },
      { code: 'W4', name: 'Academic Paper Draft' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'scientific-computing-experimental-data-analytics',
  },
  {
    id: 'arts-writing',
    title: 'Technical Content Writing & Digital Communications',
    badge: 'B.A / Arts & Media',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    duration: '4 Weeks (60 Hrs)',
    domain: 'ARTS',
    description:
      'Draft industry whitepapers, pedagogical learning modules, press communication kits, and public awareness campaigns.',
    milestones: [
      { code: 'W1', name: 'Academic Summary' },
      { code: 'W2', name: 'Whitepaper Structure' },
      { code: 'W3', name: 'PR Release Copy' },
      { code: 'W4', name: 'Portfolio Dossier' },
    ],
    feeLabel: 'FREE (Subsidized)',
    slug: 'technical-content-writing-digital-communications',
  },
];

export default function HomePage() {
  // Flagship Switcher: INTERNSHIP vs MARKETPLACE
  const [flagshipTab, setFlagshipTab] = useState<'INTERNSHIP' | 'MARKETPLACE'>('INTERNSHIP');

  // Domain Filter for Internships
  const [selectedDomain, setSelectedDomain] = useState<DomainTab>('ALL');

  // Exam Marketplace Category Filter
  const [examTab, setExamTab] = useState<'BIHAR' | 'CENTRAL' | 'SCHOOL' | 'TECH'>('BIHAR');

  // In-Page Certificate Verification Tool State
  const [certInput, setCertInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState('');

  const allProducts = getHydratedProducts();

  const filteredProducts = allProducts.filter((p) => {
    if (examTab === 'BIHAR') return p.tags.includes('BPSC') || p.tags.includes('BSEB') || p.tags.includes('Bihar Board');
    if (examTab === 'CENTRAL') return p.tags.includes('SSC') || p.tags.includes('UPSC') || p.tags.includes('Polity');
    if (examTab === 'SCHOOL') return p.tags.includes('CBSE') || p.tags.includes('BSEB');
    if (examTab === 'TECH') return p.tags.includes('MCA') || p.tags.includes('DSA');
    return true;
  });

  const filteredTracks = HOMEPAGE_TRACKS.filter((track) => {
    if (selectedDomain === 'ALL') return true;
    return track.domain === selectedDomain;
  });

  const handleVerifyLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    setVerifying(true);
    setVerifyError('');
    setVerifyResult(null);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(certInput.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'No verified credential found for this ID.');
      }
      setVerifyResult(data.certificate);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed. Please check the Certificate ID.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 text-slate-900 dark:text-slate-100">

      {/* 1. Dual Flagship Switcher Hub (Matching Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <button
              type="button"
              onClick={() => setFlagshipTab('INTERNSHIP')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                flagshipTab === 'INTERNSHIP'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🎓 NEP-2020 Internships</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Main Flagship
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFlagshipTab('MARKETPLACE')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                flagshipTab === 'MARKETPLACE'
                  ? 'bg-white dark:bg-slate-900 text-[#00A389] shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>📚 Testbook Notes &amp; PYQs</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FLAGSHIP 1: NEP-2020 VIRTUAL INTERNSHIPS (Screenshots 1, 2, 3, 4) */}
      {/* ============================================================== */}
      {flagshipTab === 'INTERNSHIP' && (
        <div className="space-y-16 animate-in fade-in duration-300">
          
          {/* A. Hero Section (Screenshot 1 & 2) */}
          <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-4">
            
            {/* Accreditation Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>UGC &amp; NEP-2020 Guidelines Compliant Experiential Training</span>
              <span className="text-slate-400">|</span>
              <span className="font-bold text-slate-900 dark:text-white">ISO Certified DDIS Credential</span>
            </div>

            {/* Giant Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              Mandatory College Internships with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-[#00A389] to-blue-600">
                Government-Recognized
              </span>{' '}
              DDIS Certification
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Fulfill your 4-week &amp; 8-week (60–75 hours) university credit requirements across{' '}
              <strong className="text-slate-900 dark:text-white">BCA/IT, Science, Commerce, and Arts</strong>. Work on live industry case studies, pass 4 milestones, and get auto-generated tamper-proof QR certificates &amp; college viva dossiers.
            </p>

            {/* Action Buttons (Screenshot 2) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#streams-section"
                className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Explore All Internship Tracks</span>
                <ChevronDown className="w-4 h-4" />
              </a>

              <a
                href="#verify-tool"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-xs sm:text-sm border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verify Existing Certificate</span>
              </a>
            </div>

            {/* 4 Feature Cards (Screenshot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-left">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  60–75 Hours Credit
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  Full NEP-2020 UGC workload compliance.
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Dynamic QR Code
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  Tamper-proof verifiable online link.
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  2-Page Viva Dossier
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  College-ready report for HOD signature.
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  DDIS Industry Seal
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  Registered software agency credentials.
                </div>
              </div>

            </div>

          </section>

          {/* B. Stream Selection & Track Bento Grid (Screenshots 3 & 4) */}
          <section id="streams-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  OFFICIAL STREAMS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                  Select Your University Stream
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Choose your academic domain and begin 4-week task milestones.
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
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedDomain(tab.id as DomainTab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedDomain === tab.id
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs font-black'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Track Cards (Screenshots 3 & 4) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3.5">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full border ${track.badgeColor}`}>
                        {track.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{track.duration}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {track.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {track.description}
                    </p>

                    {/* 4 Weekly Milestone Tasks */}
                    <div className="pt-2 space-y-2">
                      <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                        4 Weekly Milestone Tasks:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {track.milestones.map((ms, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{ms.code}: {ms.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer with Fee and Start Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        ENROLLMENT FEE
                      </div>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                        {track.feeLabel}
                      </span>
                    </div>

                    <Link
                      href="/internships"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>Start Program</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/internships"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs hover:bg-slate-50 shadow-2xs"
              >
                <span>Browse All 18 NEP-2020 Curriculums</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </Link>
            </div>

          </section>

        </div>
      )}

      {/* ============================================================== */}
      {/* FLAGSHIP 2: TESTBOOK PDF PASS PRO BANNER (Screenshot 5) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B35AF] via-[#3544C7] to-[#1E268E] text-white p-6 sm:p-10 shadow-xl border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>TESTBOOK PDF PASS PRO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Unlock 5,000+ Notes, Formula Sheets &amp; Solved Papers
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
              Get unlimited downloads across all School Boards (BSEB, CBSE), BPSC, SSC, and Higher Education for a full year.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4 shrink-0 w-full sm:w-auto text-center sm:text-left">
            <div>
              <div className="text-xs text-indigo-200 font-semibold">All-Access Annual Pass</div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹199<span className="text-xs font-medium text-indigo-200">/year</span>
              </div>
            </div>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Get Pass Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* EXAM RESOURCE MARKETPLACE (When toggled or scrolled) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-extrabold text-[#00A389] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4" /> Exam Hierarchy Selector
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Explore By Exam Category
            </h2>
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
                onClick={() => setExamTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  examTab === tab.id
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

      {/* ============================================================== */}
      {/* IN-PAGE CERTIFICATE VERIFICATION TOOL */}
      {/* ============================================================== */}
      <section id="verify-tool" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public DDIS Accreditation Verification Portal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Verify Official Student Credential Online
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Confirm authenticity of 4-Week / 8-Week mandatory college internships certified under Digital Developer Infinity Solution.
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g. DDIS-NEP-2026-IT-9482)"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#00A389] focus:outline-none"
            />
            <button
              type="submit"
              disabled={verifying || !certInput.trim()}
              className="px-6 py-3 rounded-xl bg-[#00A389] hover:bg-[#008f78] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Verify Now</span>
            </button>
          </form>

          {/* Quick Sample IDs */}
          <div className="text-center text-[11px] text-slate-400">
            <span>Try sample verified ID: </span>
            <button
              type="button"
              onClick={() => setCertInput('DDIS-NEP-2026-IT-9482')}
              className="text-[#00A389] font-bold underline hover:text-[#008f78]"
            >
              DDIS-NEP-2026-IT-9482
            </button>
          </div>

          {/* Error Message */}
          {verifyError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2 max-w-xl mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          {/* Verified Result Card */}
          {verifyResult && (
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 max-w-2xl mx-auto space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase">
                      Official DDIS Credential Verified
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                      ID: {verifyResult.certificateId}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900">
                  {verifyResult.grade || 'A+ Distinction'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Student Name:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{verifyResult.studentName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">College / University:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{verifyResult.collegeName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Specialization Track:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">{verifyResult.trackTitle}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Credit Compliance:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white">75 Hours UGC/NEP-2020</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={`/api/internship/generate-certificate?id=${verifyResult.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 2-Page Official PDF</span>
                </a>
                <Link
                  href={`/verify/${verifyResult.certificateId}`}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Permanent Public Link</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Trust & Anti-Piracy Feature Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#00A389] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Verified Notes</h4>
            <p className="text-xs text-slate-500 mt-1">Curated by State Rankers &amp; Top Educators</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dynamic Watermarking</h4>
            <p className="text-xs text-slate-500 mt-1">Stamps your phone number on every margin</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">DDIS Accredited</h4>
            <p className="text-xs text-slate-500 mt-1">QR-verified 2-Page College Viva Dossier</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">50,000+ Enrolled</h4>
            <p className="text-xs text-slate-500 mt-1">Trusted across Patna, Delhi, and Kota</p>
          </div>
        </div>
      </section>

    </div>
  );
}
