'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, BookOpen, GraduationCap, Code, FileSpreadsheet } from 'lucide-react';

export default function CategoryPills() {
  const pills = [
    {
      title: 'BPSC 70th Bihar Special',
      query: 'board=BPSC',
      icon: '🔥',
      badge: 'Trending',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      title: 'Bihar Board (BSEB) 12th',
      query: 'board=BSEB&class=Class 12',
      icon: '🇮🇳',
      badge: 'Hindi Medium',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      title: 'CBSE Class 10th Math & Sci',
      query: 'board=CBSE&class=Class 10',
      icon: '📐',
      badge: 'NCERT Crux',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      title: 'UPSC Polity Mindmaps',
      query: 'board=UPSC',
      icon: '🏛️',
      badge: 'AIR Topper',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      title: 'SSC CGL Quant Tricks',
      query: 'board=SSC',
      icon: '⚡',
      badge: 'TCS PYQ',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      title: 'MCA / BCA DSA Notes',
      query: 'board=MCA_BCA',
      icon: '💻',
      badge: 'C++ & Java',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      title: '10-Year Solved PYQ Vault',
      query: 'type=PYQ',
      icon: '📚',
      badge: 'Must Have',
      badgeColor: 'bg-slate-800 text-white',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/90">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
            Quick Exam Category Drill-Down
          </span>
        </div>

        {/* Scrollable Pills Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {pills.map((pill, idx) => (
            <Link
              key={idx}
              href={`/explore?${pill.query}`}
              className="group shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all duration-200"
            >
              <span className="text-base">{pill.icon}</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 whitespace-nowrap">
                {pill.title}
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${pill.badgeColor} uppercase tracking-tight`}>
                {pill.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
