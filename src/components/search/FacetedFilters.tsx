'use client';

import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Medium, MaterialType, CategoryLevel } from '@/types';

interface FacetedFiltersProps {
  level?: string;
  board?: string;
  medium?: string;
  materialType?: string;
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (key: string, value: string | number | undefined) => void;
  onReset: () => void;
}

export default function FacetedFilters({
  level,
  board,
  medium,
  materialType,
  minPrice,
  maxPrice,
  onFilterChange,
  onReset,
}: FacetedFiltersProps) {
  const categories: { label: string; value: CategoryLevel }[] = [
    { label: 'School Boards (K-12)', value: 'K12' },
    { label: 'Competitive Exams', value: 'COMPETITIVE' },
    { label: 'Graduation & Tech', value: 'HIGHER_ED' },
  ];

  const boardsList = [
    { code: 'BPSC', name: 'BPSC (70th CCE)', badge: 'Hot' },
    { code: 'BSEB', name: 'Bihar Board (10th/12th)', badge: 'Hindi' },
    { code: 'CBSE', name: 'CBSE Board (10th/12th)', badge: 'NCERT' },
    { code: 'UPSC', name: 'UPSC CSE (Pre + Mains)', badge: 'GS 1-4' },
    { code: 'SSC', name: 'SSC CGL & CHSL 2026', badge: 'TCS PYQ' },
    { code: 'ICSE', name: 'ICSE / ISC Board', badge: 'Specimen' },
    { code: 'MCA_BCA', name: 'MCA & BCA Semester', badge: 'DSA' },
  ];

  const mediumsList: { label: string; value: Medium; flag: string }[] = [
    { label: 'हिन्दी माध्यम (Hindi)', value: 'HINDI', flag: '🇮🇳' },
    { label: 'English Medium', value: 'ENGLISH', flag: '🇬🇧' },
    { label: 'Bilingual (Hinglish)', value: 'BILINGUAL', flag: '🌐' },
  ];

  const materialTypesList: { label: string; value: MaterialType; icon: string }[] = [
    { label: 'Handwritten Notes', value: 'NOTES', icon: '📝' },
    { label: 'Previous Year Questions (PYQs)', value: 'PYQ', icon: '📚' },
    { label: 'Formula & Mind Map Sheets', value: 'FORMULA_SHEET', icon: '⚡' },
    { label: 'Model Solved Papers', value: 'MODEL_PAPER', icon: '🎯' },
  ];

  const isFiltered = level || board || medium || materialType || minPrice || maxPrice;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Faceted Filters</span>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* 1. Category Tier */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" /> Academic Stream
        </h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange('level', level === cat.value ? undefined : cat.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                level === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              {level === cat.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Board / Exam Selection */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Target Board / Exam
        </h3>
        <div className="space-y-1.5">
          {boardsList.map((b) => (
            <button
              key={b.code}
              onClick={() => onFilterChange('board', board === b.code ? undefined : b.code)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                board === b.code
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="truncate">{b.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  board === b.code ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {b.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Medium (Hindi / English) */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Medium of Study
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {mediumsList.map((m) => (
            <button
              key={m.value}
              onClick={() => onFilterChange('medium', medium === m.value ? undefined : m.value)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                medium === m.value
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{m.flag}</span>
                <span>{m.label}</span>
              </span>
              {medium === m.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Material Type */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Material Format</h3>
        <div className="space-y-1.5">
          {materialTypesList.map((t) => (
            <button
              key={t.value}
              onClick={() => onFilterChange('materialType', materialType === t.value ? undefined : t.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                materialType === t.value
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </span>
              {materialType === t.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Price Range Quick Chips */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Price Filter</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              onFilterChange('minPrice', undefined);
              onFilterChange('maxPrice', 99);
            }}
            className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
              maxPrice === 99
                ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            Under ₹99
          </button>
          <button
            onClick={() => {
              onFilterChange('minPrice', 100);
              onFilterChange('maxPrice', 199);
            }}
            className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
              minPrice === 100 && maxPrice === 199
                ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            ₹100 - ₹199
          </button>
        </div>
      </div>

    </div>
  );
}
