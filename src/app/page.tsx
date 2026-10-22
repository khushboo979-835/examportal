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
  Star,
  Users,
  Layers,
  ChevronRight,
  Code2,
  Atom,
  TrendingUp,
  Palette,
  Cpu,
  Clock,
  ExternalLink,
  FileCheck2,
  Check
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

type FacultyTab = 'ALL' | 'IT' | 'SCIENCE' | 'COMMERCE' | 'ARTS' | 'VOCATIONAL';

interface FeaturedTrack {
  id: string;
  title: string;
  faculty: 'IT' | 'SCIENCE' | 'COMMERCE' | 'ARTS' | 'VOCATIONAL';
  facultyLabel: string;
  durationWeeks: number;
  nepCurriculumHours: number;
  description: string;
  skills: string[];
  deliverablesCount: number;
  slug: string;
}

const FEATURED_TRACKS: FeaturedTrack[] = [
  {
    id: 'it-web',
    title: 'Full-Stack Web Application Engineering',
    faculty: 'IT',
    facultyLabel: 'Computer Apps & IT',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'Build production-ready Next.js & REST APIs with role-based auth, PostgreSQL/MongoDB, and Vercel cloud deployment.',
    skills: ['Next.js 15', 'TypeScript', 'MongoDB', 'REST APIs', 'Vercel'],
    deliverablesCount: 4,
    slug: 'fullstack-web-engineering',
  },
  {
    id: 'it-python',
    title: 'Python for Data Analytics & Visualization',
    faculty: 'IT',
    facultyLabel: 'Computer Apps & IT',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'Transform raw datasets into actionable insights using Pandas, NumPy, Seaborn dashboards, and statistical tests.',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
    deliverablesCount: 4,
    slug: 'python-data-analytics',
  },
  {
    id: 'sci-chem',
    title: 'Computational Chemistry & Molecular Informatics',
    faculty: 'SCIENCE',
    facultyLabel: 'Science (UG & PG)',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'SMILES molecular parsing, PyMOL 3D ligand docking, and simulated spectroscopic property predictions.',
    skills: ['RDKit', 'PyMOL', 'Molecular Docking', 'Spectroscopy'],
    deliverablesCount: 4,
    slug: 'computational-chemistry-informatics',
  },
  {
    id: 'sci-bio',
    title: 'Bio-Informatics & Genomics Data Analysis',
    faculty: 'SCIENCE',
    facultyLabel: 'Science (UG & PG)',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'NCBI BLAST automation, FASTA sequence alignments, phylogenetic tree generation, and gene mutation mapping.',
    skills: ['BioPython', 'NCBI BLAST', 'FASTA', 'Phylogenetics'],
    deliverablesCount: 4,
    slug: 'bioinformatics-genomics-analysis',
  },
  {
    id: 'com-tally',
    title: 'Corporate Accounting, GST & TallyPrime',
    faculty: 'COMMERCE',
    facultyLabel: 'Commerce & Management',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'End-to-end ledger accounting, GSTR-1 & GSTR-3B return filings, input tax credit reconciliation, and balance sheets.',
    skills: ['TallyPrime', 'GST Portal', 'GSTR-3B', 'Balance Sheets'],
    deliverablesCount: 4,
    slug: 'corporate-accounting-gst-tally',
  },
  {
    id: 'com-fintech',
    title: 'Financial Analysis, Equity Research & Fintech',
    faculty: 'COMMERCE',
    facultyLabel: 'Commerce & Management',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'Three-statement financial modeling, DCF equity valuations, ratio analysis, and portfolio beta metrics.',
    skills: ['Financial Modeling', 'DCF Valuation', 'Equity Research', 'Excel'],
    deliverablesCount: 4,
    slug: 'financial-analysis-equity-fintech',
  },
  {
    id: 'arts-pr',
    title: 'Content Architecture, Digital Journalism & PR',
    faculty: 'ARTS',
    facultyLabel: 'Arts & Humanities',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'Data-driven journalistic storytelling, SEO content strategy, press releases, and editorial copy for national media.',
    skills: ['SEO Strategy', 'Press Release', 'Copywriting', 'Fact Checking'],
    deliverablesCount: 4,
    slug: 'content-architecture-journalism-pr',
  },
  {
    id: 'arts-policy',
    title: 'Public Policy, Governance & Social Research',
    faculty: 'ARTS',
    facultyLabel: 'Arts & Humanities',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'Qualitative field survey synthesis, policy brief drafts for government welfare schemes, and stakeholder impact reports.',
    skills: ['Policy Briefs', 'Survey Design', 'Qualitative Analysis', 'UGC Ethics'],
    deliverablesCount: 4,
    slug: 'public-policy-social-research',
  },
  {
    id: 'voc-iot',
    title: 'Embedded Systems & IoT Prototyping',
    faculty: 'VOCATIONAL',
    facultyLabel: 'Polytechnic & Vocational',
    durationWeeks: 4,
    nepCurriculumHours: 75,
    description: 'ESP32 / Arduino sensor integration, MQTT telemetry broker pipelines, and live cloud IoT dashboard visualization.',
    skills: ['ESP32', 'Arduino', 'MQTT', 'Cloud IoT Dashboards'],
    deliverablesCount: 4,
    slug: 'embedded-systems-iot-prototyping',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'BIHAR' | 'CENTRAL' | 'SCHOOL' | 'TECH'>('BIHAR');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyTab>('ALL');

  const allProducts = getHydratedProducts();

  const filteredProducts = allProducts.filter((p) => {
    if (activeTab === 'BIHAR') return p.tags.includes('BPSC') || p.tags.includes('BSEB') || p.tags.includes('Bihar Board');
    if (activeTab === 'CENTRAL') return p.tags.includes('SSC') || p.tags.includes('UPSC') || p.tags.includes('Polity');
    if (activeTab === 'SCHOOL') return p.tags.includes('CBSE') || p.tags.includes('BSEB');
    if (activeTab === 'TECH') return p.tags.includes('MCA') || p.tags.includes('DSA');
    return true;
  });

  const filteredTracks = FEATURED_TRACKS.filter((track) => {
    if (selectedFaculty === 'ALL') return true;
    return track.faculty === selectedFaculty;
  });

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00A389]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>India&apos;s #1 Dedicated PDF Marketplace for Exam Notes & Solved Papers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Find Your Exam Notes & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A389] via-teal-300 to-amber-300">Solved Papers</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant digital access to topper handwritten summaries, 10-year solved PYQs, and formula cheat sheets in <strong className="text-amber-300">Hindi & English Medium</strong>.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20 shadow-2xl">
              <SearchBar placeholder="Search 'BPSC 70th Bihar Special', 'BSEB 12th Physics', 'SSC CGL Math'..." />
            </div>
          </div>

          {/* Quick Trending Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-[#00A389] text-slate-200 hover:text-white transition-colors border border-white/10"
              >
                {chip.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 2. All-Access PDF Pass Value Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-gradient-to-r from-[#00A389] via-[#008f77] to-[#1A73E8] text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase">
              <Award className="w-4 h-4" /> Testbook PDF Pass
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Unlock 5,000+ Notes, Formula Sheets & Solved Papers for ₹199/year
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100">
              One annual subscription. Unlimited dynamic watermarked downloads for CBSE, BSEB, BPSC & SSC.
            </p>
          </div>

          <Link
            href="/explore"
            className="shrink-0 px-8 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Get PDF Pass Now</span>
            <ArrowRight className="w-4 h-4 text-[#00A389]" />
          </Link>
        </div>
      </section>

      {/* 3. State & Board Selector Tabs (PDF Marketplace) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-extrabold text-[#00A389] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4" /> Exam Hierarchy Selector
            </div>
            <h2 className="text-2xl font-black text-slate-900">Explore By Exam Category</h2>
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#00A389] text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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

      {/* 4. Dribbble-Grade NEP-2020 Virtual Internship Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00A389]/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black text-emerald-300">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Accredited Under Digital Developer Infinity Solution (DDIS)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Bridge Academics with Industry Experience
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Fulfill Mandatory 60–75 Hours UGC/NEP-2020 Undergraduate Internship Credits with DDIS Accredited Practical Training across Science, Commerce, Arts, IT, and Vocational Streams.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/internships"
                className="px-6 py-3 rounded-2xl bg-[#00A389] hover:bg-[#008f78] text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Browse All 18 NEP Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/verify"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Verify DDIS Credential</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dribbble-Style Stream Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Faculties', icon: Sparkles },
            { id: 'IT', label: 'Computer Apps & IT', icon: Code2 },
            { id: 'SCIENCE', label: 'Science (UG & PG)', icon: Atom },
            { id: 'COMMERCE', label: 'Commerce & Management', icon: TrendingUp },
            { id: 'ARTS', label: 'Arts & Humanities', icon: Palette },
            { id: 'VOCATIONAL', label: 'Polytechnic & Vocational', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedFaculty === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFaculty(tab.id as FacultyTab)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00A389]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modern Bento-Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => {
            const isIT = track.faculty === 'IT';
            const isScience = track.faculty === 'SCIENCE';
            const isCommerce = track.faculty === 'COMMERCE';
            const isArts = track.faculty === 'ARTS';
            const isVocational = track.faculty === 'VOCATIONAL';

            const accentColor = isIT
              ? 'from-blue-500/10 to-indigo-500/5 border-blue-200/70 hover:border-blue-400'
              : isScience
              ? 'from-emerald-500/10 to-teal-500/5 border-emerald-200/70 hover:border-emerald-400'
              : isCommerce
              ? 'from-amber-500/10 to-orange-500/5 border-amber-200/70 hover:border-amber-400'
              : isArts
              ? 'from-purple-500/10 to-pink-500/5 border-purple-200/70 hover:border-purple-400'
              : 'from-cyan-500/10 to-blue-500/5 border-cyan-200/70 hover:border-cyan-400';

            const badgeBg = isIT
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : isScience
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isCommerce
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : isArts
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-cyan-50 text-cyan-700 border-cyan-200';

            return (
              <div
                key={track.id}
                className={`group bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${accentColor}`}
              >
                <div className="space-y-3.5">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${badgeBg}`}>
                      {track.facultyLabel}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400" />
                      4 Weeks • 75 Hrs
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#00A389] transition-colors leading-snug">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                    {track.description}
                  </p>

                  {/* Key Industry Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {track.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Footer Strip */}
                <div className="pt-5 mt-5 border-t border-slate-100/90 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      NEP-2020 Aligned
                    </span>
                    <span>4 Milestones Deliverables</span>
                  </div>

                  <Link
                    href="/internships"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#00A389] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 group-hover:shadow-md"
                  >
                    <span>Start Internship</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA Footer */}
        <div className="text-center pt-2">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-extrabold text-xs shadow-xs hover:shadow-md transition-all"
          >
            <span>Explore All 18 NEP-2020 Accredited Tracks</span>
            <ChevronRight className="w-4 h-4 text-[#00A389]" />
          </Link>
        </div>

      </section>

      {/* 5. Testbook Trust & Dynamic Anti-Piracy Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00A389] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">100% Verified Notes</h4>
            <p className="text-xs text-slate-500 mt-1">Curated by State Rankers & Top Educators</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Dynamic Watermarking</h4>
            <p className="text-xs text-slate-500 mt-1">Stamps your phone number on every margin</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">DDIS Accredited</h4>
            <p className="text-xs text-slate-500 mt-1">QR-verified 2-Page College Viva Dossier</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">50,000+ Enrolled</h4>
            <p className="text-xs text-slate-500 mt-1">Trusted across Patna, Delhi, and Kota</p>
          </div>
        </div>
      </section>

    </div>
  );
}
