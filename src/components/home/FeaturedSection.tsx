'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Flame, Award, BookOpen } from 'lucide-react';
import { PDFProduct } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface FeaturedSectionProps {
  products: PDFProduct[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'HINDI' | 'COMPETITIVE' | 'BOARDS'>('ALL');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'HINDI') return p.medium === 'HINDI';
    if (activeTab === 'COMPETITIVE') return p.subject?.boardOrExam?.category?.level === 'COMPETITIVE' || p.tags.includes('BPSC') || p.tags.includes('UPSC') || p.tags.includes('SSC');
    if (activeTab === 'BOARDS') return p.subject?.boardOrExam?.category?.level === 'K12' || p.tags.includes('CBSE') || p.tags.includes('BSEB');
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>High-Converting Topper Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Featured & Best Selling Notes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Handwritten diagrams, concise revisions, and solved exam blueprints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Featured
          </button>
          <button
            onClick={() => setActiveTab('HINDI')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'HINDI'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            हिन्दी माध्यम (Hindi)
          </button>
          <button
            onClick={() => setActiveTab('COMPETITIVE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'COMPETITIVE'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            BPSC / UPSC / SSC
          </button>
          <button
            onClick={() => setActiveTab('BOARDS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'BOARDS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            CBSE & BSEB Boards
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <ProductCard key={(product as any)._id || product.id || product.slug || idx} product={product} />
        ))}
      </div>

      {/* Explore All CTA Banner */}
      <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
            <Award className="w-4 h-4" /> 100% Syllabus Coverage Guaranteed
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Looking for specific semester or state exam notes?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse our complete catalog with faceted filters for subject, board, and medium.
          </p>
        </div>

        <Link
          href="/explore"
          className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105 text-sm"
        >
          Explore All Materials <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}
