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
  ChevronRight
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'BIHAR' | 'CENTRAL' | 'SCHOOL' | 'TECH'>('BIHAR');

  const allProducts = getHydratedProducts();

  const filteredProducts = allProducts.filter((p) => {
    if (activeTab === 'BIHAR') return p.tags.includes('BPSC') || p.tags.includes('BSEB') || p.tags.includes('Bihar Board');
    if (activeTab === 'CENTRAL') return p.tags.includes('SSC') || p.tags.includes('UPSC') || p.tags.includes('Polity');
    if (activeTab === 'SCHOOL') return p.tags.includes('CBSE') || p.tags.includes('BSEB');
    if (activeTab === 'TECH') return p.tags.includes('MCA') || p.tags.includes('DSA');
    return true;
  });

  return (
    <div className="space-y-12 pb-16">
      
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

      {/* 3. State & Board Selector Tabs (Testbook Pattern) */}
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

      {/* 4. Testbook Trust & Dynamic Anti-Piracy Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h4 className="font-bold text-sm text-slate-900">Free 3-Page Sample</h4>
            <p className="text-xs text-slate-500 mt-1">Read preview before purchasing</p>
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
