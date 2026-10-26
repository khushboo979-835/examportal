'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  Search,
  Sparkles,
  Flame,
  GraduationCap,
  Award,
  ShieldCheck,
  Menu,
  X,
  User,
  Zap,
  Globe,
  ArrowRight,
  ExternalLink,
  Code2,
  Atom,
  TrendingUp,
  Palette,
  Cpu,
  Layers,
  FileCheck2,
  CheckCircle2,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, setIsOpen } = useCart();

  const [studyMenuOpen, setStudyMenuOpen] = useState(false);
  const [internshipMenuOpen, setInternshipMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'HI' | 'EN'>('EN');

  const studyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const internshipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Announcement Bar (NEP-2020 University Notice) */}
      <div className="bg-[#0B132B] text-white text-[11px] py-1.5 px-4 font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
              NEW NEP-2020 BATCH
            </span>
            <span className="text-slate-200 truncate">
              Patliputra &amp; Bihar University UG Students: Enrol in 4-Week Mandatory Industry Internship
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 shrink-0">
            <Link href="/verify" className="flex items-center gap-1 hover:text-[#00E599] transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E599]" />
              <span>Verify Certificate</span>
            </Link>
            <span className="text-slate-700">|</span>
            <a href="tel:+917544065425" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="text-amber-400">📞</span>
              <span>Support: +91 7544065425</span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="mailto:studyfreepdf2@gmail.com" className="flex items-center gap-1 hover:text-[#00E599] transition-colors">
              <span>studyfreepdf2@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Floating Pill-Shaped Glassmorphic Header */}
      <header className="sticky top-2 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Minimal Modern Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative h-9 sm:h-10 w-auto flex items-center">
              <img
                src="/logo.png"
                alt="StudyFree PDF - Your Gateway to Success"
                className="h-8 sm:h-9 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 tracking-wide">
                Accredited by <strong className="text-[#00A389] font-extrabold">DDIS Solutions</strong>
              </span>
            </div>
          </Link>

          {/* Center: Dribbble-Grade Mega Menus */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            
            {/* 1. Study Material Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (studyTimeoutRef.current) clearTimeout(studyTimeoutRef.current);
                setStudyMenuOpen(true);
              }}
              onMouseLeave={() => {
                studyTimeoutRef.current = setTimeout(() => setStudyMenuOpen(false), 200);
              }}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  studyMenuOpen
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#00A389]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>Study Material</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${studyMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {studyMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-[640px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="grid grid-cols-2 gap-4 pb-3">
                    {/* Column 1 */}
                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        State & School Boards
                      </div>
                      <Link
                        href="/explore?level=K12"
                        onClick={() => setStudyMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                      >
                        <GraduationCap className="w-4 h-4 text-[#00A389] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">CBSE & ICSE Boards</div>
                          <div className="text-[11px] text-slate-400 font-normal">Class 9th–12th NCERT Crux & Exemplar</div>
                        </div>
                      </Link>
                      <Link
                        href="/exams/bseb"
                        onClick={() => setStudyMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                      >
                        <Flame className="w-4 h-4 text-orange-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Bihar Board (BSEB)</div>
                          <div className="text-[11px] text-slate-400 font-normal">10th Matric & 12th Inter VVI Questions</div>
                        </div>
                      </Link>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Govt & Higher Education
                      </div>
                      <Link
                        href="/exams/bpsc"
                        onClick={() => setStudyMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">BPSC 70th & State PCS</div>
                          <div className="text-[11px] text-slate-400 font-normal">Prelims & Mains GS Mind Maps</div>
                        </div>
                      </Link>
                      <Link
                        href="/explore?level=COMPETITIVE"
                        onClick={() => setStudyMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                      >
                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">SSC, UPSC & Railways</div>
                          <div className="text-[11px] text-slate-400 font-normal">10-Year Solved TCS PYQ Papers</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs px-2">
                    <Link
                      href="/explore?type=FORMULA_SHEET"
                      onClick={() => setStudyMenuOpen(false)}
                      className="text-slate-600 hover:text-[#00A389] font-medium flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Formula Sheets & Cheatsheets</span>
                    </Link>
                    <Link
                      href="/explore"
                      onClick={() => setStudyMenuOpen(false)}
                      className="text-[#00A389] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Explore All 5,000+ Notes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. NEP-2020 Internships Clean 2-Column Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (internshipTimeoutRef.current) clearTimeout(internshipTimeoutRef.current);
                setInternshipMenuOpen(true);
              }}
              onMouseLeave={() => {
                internshipTimeoutRef.current = setTimeout(() => setInternshipMenuOpen(false), 200);
              }}
            >
              <Link
                href="/internships"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  internshipMenuOpen
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#00A389]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>NEP-2020 Internships</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200/60">
                  DDIS
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${internshipMenuOpen ? 'rotate-180' : ''}`} />
              </Link>

              {internshipMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-[720px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#00A389]" />
                        <span>NEP-2020 Accredited Virtual College Internships</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Fulfill mandatory 60–75 Hours UGC undergraduate semester credit requirements.
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      Accredited by DDIS
                    </span>
                  </div>

                  {/* 2-Column Categories */}
                  <div className="grid grid-cols-2 gap-3 pb-3">
                    <Link
                      href="/internships?stream=BCA_IT"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Computer Apps & IT
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Full-Stack Web (Next.js), Python ML, React Native & Cloud DevOps.
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=SCIENCE"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Atom className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Science (UG & PG)
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Computational Data Analysis, Research Methodology & GIS Mapping.
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=COMMERCE"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Commerce & Management
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Digital Marketing Ads, Financial Modeling & GST Simulation.
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/internships?stream=VOCATIONAL"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Polytechnic & Vocational
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          IoT Hardware, Figma UI/UX Systems & Industrial AutoCAD.
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Mega Menu Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs px-2">
                    <Link
                      href="/verify"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="text-slate-600 dark:text-slate-300 hover:text-[#00A389] font-medium flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00A389]" />
                      <span>Verify Student Certificate</span>
                    </Link>
                    <Link
                      href="/internships"
                      onClick={() => setInternshipMenuOpen(false)}
                      className="text-[#00A389] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Explore All 18 NEP Tracks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Direct Shortcut: Verify Certificate */}
            <Link
              href="/verify"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                pathname === '/verify'
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#00A389]'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Certificate</span>
            </Link>

          </nav>

          {/* Right: Search, Language Switcher, Cart & User Menu */}
          <div className="flex items-center gap-2">
            
            {/* Minimal Cmd+K Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-400 text-xs hover:text-slate-700 dark:hover:text-white transition-colors"
              title="Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search notes, exams...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Language Minimal Toggle */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'EN' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00A389] text-white text-[9px] font-black flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Account Avatar / Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                setAccountMenuOpen(true);
              }}
              onMouseLeave={() => {
                accountTimeoutRef.current = setTimeout(() => setAccountMenuOpen(false), 200);
              }}
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Student Login</span>
                <span className="sm:hidden">Login</span>
              </Link>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Student Dashboard
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setAccountMenuOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[#00A389]" />
                    <span>My Study Room</span>
                  </Link>
                  <Link
                    href="/dashboard/internships"
                    onClick={() => setAccountMenuOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>My Enrolled Internships</span>
                  </Link>
                  <Link
                    href="/verify"
                    onClick={() => setAccountMenuOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Download DDIS Certificates</span>
                  </Link>
                  <Link
                    href="/verify"
                    onClick={() => setAccountMenuOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verify Credential</span>
                  </Link>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <Link
                      href="/admin/internships"
                      onClick={() => setAccountMenuOpen(false)}
                      className="px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-500 flex items-center gap-2.5 transition-colors"
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
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

        </div>
      </header>

      {/* Modern Search Modal (Cmd+K style) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-start pt-20 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl relative max-w-2xl mx-auto w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <Search className="w-4 h-4 text-[#00A389]" />
                <span>Search Notes, Solved PYQs, & NEP Internships</span>
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SearchBar
              onSelect={() => setSearchModalOpen(false)}
              placeholder="e.g. BPSC 70th Bihar Special, Full-Stack Web Development, BSEB 12th..."
            />

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 pt-2">
              <span className="font-semibold text-slate-500">Popular:</span>
              <Link href="/explore?level=COMPETITIVE" onClick={() => setSearchModalOpen(false)} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-slate-900">BPSC 70th</Link>
              <Link href="/internships?stream=BCA_IT" onClick={() => setSearchModalOpen(false)} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-slate-900">Web Dev Internship</Link>
              <Link href="/explore?type=FORMULA_SHEET" onClick={() => setSearchModalOpen(false)} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-slate-900">Formula Sheets</Link>
              <Link href="/verify" onClick={() => setSearchModalOpen(false)} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-slate-900">Verify Certificate</Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00A389]" />
                    <span className="font-black text-base">StudyFreePDF Menu</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Study Material
                  </div>
                  <Link
                    href="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <BookOpen className="w-4 h-4 text-[#00A389]" />
                    <span>Explore All Notes & PYQs</span>
                  </Link>
                  <Link
                    href="/explore?type=FORMULA_SHEET"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Formula Sheets</span>
                  </Link>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    NEP-2020 Internships
                  </div>
                  <Link
                    href="/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs font-bold text-[#00A389]"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>All 18 Internship Tracks</span>
                  </Link>
                  <Link
                    href="/verify"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Verify DDIS Certificate</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#00A389] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <User className="w-4 h-4" /> Go to My Study Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
