'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  Flame,
  GraduationCap,
  Award,
  Download,
  FileText,
  ShieldCheck,
  Menu,
  X,
  User,
  Zap,
  CheckCircle2,
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SectorItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  categories: {
    id: string;
    name: string;
    shortCode: string;
    slug: string;
    exams: {
      name: string;
      slug: string;
      badge?: string;
    }[];
  }[];
}

const mockNavHierarchy: SectorItem[] = [
  {
    id: 'school',
    name: 'School (1st–12th)',
    slug: 'school-education',
    icon: 'GraduationCap',
    categories: [
      {
        id: 'bseb',
        name: 'Bihar Board (BSEB)',
        shortCode: 'BSEB',
        slug: 'bseb',
        exams: [
          { name: 'Class 10th Matric Board', slug: 'bseb-class-10th', badge: 'VVI Questions' },
          { name: 'Class 12th Inter Science', slug: 'bseb-class-12-science', badge: 'Formula Sheet' },
          { name: 'Class 12th Inter Arts', slug: 'bseb-class-12-arts' },
          { name: 'Class 12th Inter Commerce', slug: 'bseb-class-12-commerce' },
        ],
      },
      {
        id: 'cbse',
        name: 'CBSE Board',
        shortCode: 'CBSE',
        slug: 'cbse',
        exams: [
          { name: 'Class 10th Standard Math & Sci', slug: 'cbse-class-10th', badge: '10-Yr PYQs' },
          { name: 'Class 12th Physics & Chemistry', slug: 'cbse-class-12-pcm', badge: 'NCERT Crux' },
          { name: 'Class 12th Biology & English', slug: 'cbse-class-12-pcb' },
          { name: 'Class 9th & 11th Revision Notes', slug: 'cbse-class-9-11' },
        ],
      },
      {
        id: 'icse',
        name: 'ICSE / ISC Board',
        shortCode: 'ICSE',
        slug: 'icse',
        exams: [
          { name: 'ICSE Class 10 Specimen Papers', slug: 'icse-class-10' },
          { name: 'ISC Class 12 Solved Numericals', slug: 'isc-class-12' },
        ],
      },
    ],
  },
  {
    id: 'state',
    name: 'State Govt Exams',
    slug: 'state-govt-exams',
    icon: 'Flame',
    categories: [
      {
        id: 'bpsc',
        name: 'Bihar BPSC & BSSC',
        shortCode: 'BPSC',
        slug: 'bpsc',
        exams: [
          { name: 'BPSC 70th/71st CCE (Pre + Mains)', slug: 'bpsc-70th-cce', badge: 'Bihar Special' },
          { name: 'BPSC Teacher Recruitment (TRE 4.0)', slug: 'bpsc-tre', badge: 'GS Crux' },
          { name: 'Bihar Police SI / Daroga Exam', slug: 'bihar-police-si' },
          { name: 'BSSC Inter Level Solved Sets', slug: 'bssc-inter-level' },
        ],
      },
      {
        id: 'uppsc',
        name: 'UPPSC & UP Police',
        shortCode: 'UPPSC',
        slug: 'uppsc',
        exams: [
          { name: 'UPPSC PCS Prelims GS 1-2', slug: 'uppsc-prelims' },
          { name: 'UP Police Constable & SI Notes', slug: 'up-police' },
        ],
      },
      {
        id: 'mppsc',
        name: 'MPPSC & MP Exams',
        shortCode: 'MPPSC',
        slug: 'mppsc',
        exams: [
          { name: 'MPPSC State Services Prelims', slug: 'mppsc-prelims' },
          { name: 'MP Patwari & Police SI', slug: 'mp-patwari' },
        ],
      },
    ],
  },
  {
    id: 'central',
    name: 'Central Govt Exams',
    slug: 'central-govt-exams',
    icon: 'Sparkles',
    categories: [
      {
        id: 'ssc',
        name: 'SSC (CGL, CHSL, GD)',
        shortCode: 'SSC',
        slug: 'ssc',
        exams: [
          { name: 'SSC CGL 2026 Tier 1 & 2', slug: 'ssc-cgl-2026', badge: 'Quant Tricks' },
          { name: 'SSC CHSL 10+2 Solved PYQs', slug: 'ssc-chsl' },
          { name: 'SSC GD Constable Hindi/English', slug: 'ssc-gd' },
          { name: 'SSC CPO Sub-Inspector Notes', slug: 'ssc-cpo' },
        ],
      },
      {
        id: 'upsc',
        name: 'UPSC Civil Services',
        shortCode: 'UPSC',
        slug: 'upsc',
        exams: [
          { name: 'UPSC CSE Prelims GS 1 Mind Maps', slug: 'upsc-cse-prelims-mains', badge: 'Topper Notes' },
          { name: 'Indian Polity Laxmikanth Crux', slug: 'upsc-polity' },
          { name: 'Modern History & Art Culture', slug: 'upsc-history' },
          { name: 'UPSC NDA & CDS Solved Papers', slug: 'upsc-nda' },
        ],
      },
      {
        id: 'rrb',
        name: 'Railway (RRB NTPC / Group D)',
        shortCode: 'RRB',
        slug: 'railways',
        exams: [
          { name: 'RRB NTPC CBT 1 & 2 General Science', slug: 'rrb-ntpc' },
          { name: 'RRB ALP & Technician Technical Notes', slug: 'rrb-alp' },
          { name: 'RRB Group D 5000+ TCS PYQs', slug: 'rrb-group-d' },
        ],
      },
    ],
  },
  {
    id: 'tech',
    name: 'Graduation & Tech',
    slug: 'higher-education',
    icon: 'BookOpen',
    categories: [
      {
        id: 'mca_bca',
        name: 'MCA & BCA Semester',
        shortCode: 'MCA_BCA',
        slug: 'mca-bca',
        exams: [
          { name: 'Data Structures & Algorithms (C++/Java)', slug: 'mca-bca-dsa', badge: 'FAANG Dry-Runs' },
          { name: 'DBMS, SQL & Normalization Handouts', slug: 'mca-dbms' },
          { name: 'Operating Systems & Networks', slug: 'mca-os-cn' },
        ],
      },
      {
        id: 'btech',
        name: 'B.Tech CSE / IT',
        shortCode: 'BTECH',
        slug: 'btech-cse',
        exams: [
          { name: 'Compiler Design & Theory of Computation', slug: 'btech-toc' },
          { name: 'Computer Architecture & Microprocessor', slug: 'btech-coa' },
        ],
      },
    ],
  },
];

export default function MegaMenu() {
  const router = useRouter();
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isInternshipOpen, setIsInternshipOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileExpandedSector, setMobileExpandedSector] = useState<string | null>('school');
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>('bseb');
  const [language, setLanguage] = useState<'HI' | 'EN'>('HI');
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const internshipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeSector = mockNavHierarchy[activeSectorIndex] || mockNavHierarchy[0];
  const activeCategory = activeSector.categories[activeCategoryIndex] || activeSector.categories[0];

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setIsMegaOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 200);
  };

  return (
    <>
      {/* Sticky Main Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Brand Logo & Testbook MegaMenu Trigger */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A389] to-[#1A73E8] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tight text-slate-900 flex items-center">
                    Exam<span className="text-[#00A389]">Pass</span>
                    <span className="text-[10px] bg-emerald-100 text-[#00A389] font-extrabold px-1.5 py-0.5 rounded ml-1">
                      PDF
                    </span>
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 tracking-wider -mt-1 uppercase">
                    Testbook-Grade Notes
                  </span>
                </div>
              </Link>

              {/* Desktop Exams Mega-Dropdown Button */}
              <div
                className="hidden lg:block relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isMegaOpen
                      ? 'bg-slate-100 text-[#00A389]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#00A389]" />
                  <span>Exams & Boards</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Testbook 4-Column Mega Menu Panel */}
                {isMegaOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-[920px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in duration-150 flex divide-x divide-slate-100">
                    
                    {/* Column 1: Sectors (Root Level) */}
                    <div className="w-56 bg-slate-50/80 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Target Sector
                      </div>
                      {mockNavHierarchy.map((sector, sIdx) => (
                        <button
                          key={sector.id}
                          onMouseEnter={() => {
                            setActiveSectorIndex(sIdx);
                            setActiveCategoryIndex(0);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                            activeSectorIndex === sIdx
                              ? 'bg-white text-[#00A389] shadow-sm border border-slate-200/60'
                              : 'text-slate-600 hover:bg-slate-100/80'
                          }`}
                        >
                          <span className="truncate">{sector.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>

                    {/* Column 2: Categories (Boards / Authorities) */}
                    <div className="w-60 bg-white p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Boards & Authorities
                      </div>
                      {activeSector.categories.map((cat, cIdx) => (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveCategoryIndex(cIdx)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            activeCategoryIndex === cIdx
                              ? 'bg-emerald-50 text-[#00A389] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="truncate">
                            <span>{cat.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 ml-1.5">({cat.shortCode})</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>

                    {/* Column 3: Target Exams & Classes */}
                    <div className="w-72 bg-white p-4 space-y-2 flex-1">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-extrabold text-slate-900">
                          {activeCategory.name} Materials
                        </span>
                        <Link
                          href={`/exams/${activeCategory.slug}`}
                          onClick={() => setIsMegaOpen(false)}
                          className="text-[10px] font-bold text-[#00A389] hover:underline flex items-center gap-0.5"
                        >
                          View Hub <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="space-y-1 pt-1 max-h-[300px] overflow-y-auto">
                        {activeCategory.exams.map((exam, eIdx) => (
                          <Link
                            key={eIdx}
                            href={`/exams/${exam.slug}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors block"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-[#00A389] transition-colors">
                                {exam.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                PYQs, Revision Notes & Formula Sheets
                              </div>
                            </div>
                            {exam.badge && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#00A389] shrink-0">
                                {exam.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Curated Quick-Access Banner */}
                    <div className="w-56 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-white flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="inline-block bg-[#00A389] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                          Testbook Pro Pass
                        </span>
                        <h4 className="text-xs font-extrabold leading-snug">
                          All-Access 5,000+ Notes & PYQ Library
                        </h4>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          Get unlimited access to CBSE, BSEB, BPSC & SSC handbooks for ₹199/yr.
                        </p>
                      </div>

                      <Link
                        href="/explore"
                        onClick={() => setIsMegaOpen(false)}
                        className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/15 transition-colors"
                      >
                        Explore PDF Pass
                      </Link>
                    </div>

                  </div>
                )}
              </div>

              {/* 🎓 High-Priority Tab: Internships (NEP-2020) */}
              <div
                className="hidden lg:block relative"
                onMouseEnter={() => {
                  if (internshipTimeoutRef.current) clearTimeout(internshipTimeoutRef.current);
                  setIsInternshipOpen(true);
                }}
                onMouseLeave={() => {
                  internshipTimeoutRef.current = setTimeout(() => setIsInternshipOpen(false), 200);
                }}
              >
                <Link
                  href="/internships"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 text-slate-800 border border-emerald-200/80 shadow-xs group"
                >
                  <GraduationCap className="w-4 h-4 text-[#00A389] group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-slate-900">Internships</span>
                  <span className="text-[10px] text-slate-500 font-semibold">(NEP-2020)</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#00A389] to-[#1A73E8] text-white shadow-xs">
                    DDIS Certified
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isInternshipOpen ? 'rotate-180' : ''}`} />
                </Link>

                {/* Dropdown Menu for NEP-2020 Internships */}
                {isInternshipOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                      <span>NEP-2020 Accredited Tracks</span>
                      <span className="text-[9px] text-[#00A389] font-black uppercase">DDIS Approved</span>
                    </div>

                    <Link
                      href="/internships?stream=BCA_IT"
                      onClick={() => setIsInternshipOpen(false)}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-[#00A389] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">IT</span>
                      <div>
                        <div>BCA / IT & Web Dev</div>
                        <div className="text-[10px] text-slate-400 font-normal">Next.js & MongoDB Full-Stack (4-8 Wks)</div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=COMMERCE"
                      onClick={() => setIsInternshipOpen(false)}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-[#00A389] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black shrink-0">COM</span>
                      <div>
                        <div>Commerce & E-Commerce</div>
                        <div className="text-[10px] text-slate-400 font-normal">Digital Marketing & Analytics</div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=SCIENCE"
                      onClick={() => setIsInternshipOpen(false)}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-[#00A389] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">SCI</span>
                      <div>
                        <div>Science & Data Analytics</div>
                        <div className="text-[10px] text-slate-400 font-normal">Python for Scientific Computing</div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=ARTS"
                      onClick={() => setIsInternshipOpen(false)}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-[#00A389] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black shrink-0">ART</span>
                      <div>
                        <div>Arts & Digital PR</div>
                        <div className="text-[10px] text-slate-400 font-normal">Technical Content & Brand Comm</div>
                      </div>
                    </Link>

                    <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-xs px-1">
                      <Link
                        href="/verify"
                        onClick={() => setIsInternshipOpen(false)}
                        className="text-[11px] font-bold text-[#00A389] hover:text-emerald-700 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Verify Certificate
                      </Link>
                      <Link
                        href="/internships"
                        onClick={() => setIsInternshipOpen(false)}
                        className="text-[11px] font-extrabold text-[#1A73E8] hover:underline flex items-center gap-0.5"
                      >
                        View All Tracks <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Search & Quick Links */}
            <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
              <Link href="/explore" className="hover:text-[#00A389] transition-colors flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Solved PYQs</span>
              </Link>
              <Link href="/explore?type=FORMULA_SHEET" className="hover:text-[#00A389] transition-colors flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Formula Sheets</span>
              </Link>
              <Link href="/dashboard" className="hover:text-[#00A389] transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>My Study Room</span>
              </Link>
            </div>

            {/* Right: Language Switcher, PDF Pass Pill & User Auth */}
            <div className="flex items-center gap-2.5">
              
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'HI' ? 'EN' : 'HI')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#00A389]" />
                <span>{language === 'HI' ? 'हिन्दी' : 'English'}</span>
              </button>

              {/* PDF Pass Hero CTA Pill */}
              <Link
                href="/explore"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md shadow-orange-500/20 hover:scale-105 transition-all animate-pulse"
              >
                <Award className="w-3.5 h-3.5" />
                <span>PDF Pass @ ₹199</span>
              </Link>

              {/* User Dashboard / Account Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                  setIsAccountMenuOpen(true);
                }}
                onMouseLeave={() => {
                  accountTimeoutRef.current = setTimeout(() => setIsAccountMenuOpen(false), 200);
                }}
              >
                <Link
                  href="/dashboard"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="My Account"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline">Account</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </Link>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Student Account
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2.5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#00A389]" />
                      <span>My Study Room</span>
                    </Link>

                    <Link
                      href="/dashboard/internships"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="px-3 py-2 rounded-xl hover:bg-blue-50 text-xs font-bold text-blue-700 flex items-center gap-2.5 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>My Enrolled Internships</span>
                    </Link>

                    <Link
                      href="/verify"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-bold text-amber-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Download DDIS Certificates</span>
                    </Link>

                    <Link
                      href="/verify"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-xs font-bold text-emerald-800 flex items-center gap-2.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verify Credential</span>
                    </Link>

                    <div className="pt-1.5 border-t border-slate-100 mt-1">
                      <Link
                        href="/admin/internships"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-[11px] font-medium text-slate-500 flex items-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Admin Evaluation Panel</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Nested Accordion Slide-Over Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-4 bg-gradient-to-r from-[#00A389] to-[#1A73E8] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="font-black text-base">Exam Hierarchy</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nested Accordion Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mockNavHierarchy.map((sector) => {
                  const isSectorExpanded = mobileExpandedSector === sector.id;
                  return (
                    <div key={sector.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSector(isSectorExpanded ? null : sector.id)
                        }
                        className="w-full px-4 py-3 bg-slate-50 text-left font-black text-xs text-slate-800 flex items-center justify-between"
                      >
                        <span>{sector.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSectorExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isSectorExpanded && (
                        <div className="p-2 space-y-2 bg-white">
                          {sector.categories.map((cat) => {
                            const isCatExpanded = mobileExpandedCategory === cat.id;
                            return (
                              <div key={cat.id} className="border border-slate-100 rounded-xl overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMobileExpandedCategory(isCatExpanded ? null : cat.id)
                                  }
                                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 flex items-center justify-between bg-slate-50/50"
                                >
                                  <span>{cat.name} ({cat.shortCode})</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {isCatExpanded && (
                                  <div className="p-2 space-y-1 bg-white">
                                    {cat.exams.map((exam, eIdx) => (
                                      <Link
                                        key={eIdx}
                                        href={`/exams/${exam.slug}`}
                                        onClick={() => setIsMobileDrawerOpen(false)}
                                        className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-[#00A389] transition-colors"
                                      >
                                        {exam.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drawer Bottom CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                <Link
                  href="/internships"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <GraduationCap className="w-4 h-4" /> 🎓 NEP-2020 Internships (DDIS)
                </Link>
                <Link
                  href="/verify"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verify DDIS Certificate
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#00A389]" /> My Study Room
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
