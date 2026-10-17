'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Flame, 
  Users, 
  ArrowRight,
  Zap,
  Award
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>India&apos;s #1 Dedicated PDF Marketplace for Exam Topper Notes</span>
          <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
            2026 Updated
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
          Score 95%+ in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">CBSE, BSEB, BPSC & UPSC</span> with Verified Topper Notes
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Handcrafted chapter-wise summaries, 10-year solved PYQs, and high-yield formula sheets in <strong className="text-amber-300 font-semibold">Hindi & English Medium</strong>. Download instantly with encrypted personal study watermarking.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20 shadow-2xl">
            <SearchBar placeholder="Search 'BPSC 70th Bihar Special', 'BSEB 12th Physics', 'CBSE 10th Math'..." />
          </div>
        </div>

        {/* Key Conversion Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span>Instant PDF Download</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Anti-Piracy Watermark</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span>50,000+ Happy Aspirants</span>
          </div>
        </div>

      </div>
    </section>
  );
}
