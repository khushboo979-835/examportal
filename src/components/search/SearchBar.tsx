'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
  defaultValue?: string;
}

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  boardCode: string;
  subjectName: string;
  medium: string;
  price: number;
  originalPrice: number;
  materialType: string;
}

export default function SearchBar({
  placeholder = 'Search by Exam (BPSC, BSEB, CBSE), Subject or Topics...',
  onSelect,
  className = '',
  defaultValue = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search query fetcher
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&autocomplete=true`);
        const data = await res.json();
        if (data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Autocomplete fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 220); // 220ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSelect) onSelect();
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setIsOpen(false);
    if (onSelect) onSelect();
    router.push(`/p/${slug}`);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-blue-600" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-sm border border-slate-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all shadow-xs"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 animate-spin text-blue-600">
            <Loader2 className="w-4 h-4" />
          </div>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Instant Notes Matching
            </span>
            <span>{suggestions.length} Results</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item.slug)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50/70 flex items-start gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.boardCode}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.medium === 'HINDI' ? 'हिन्दी माध्यम' : item.medium}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {item.materialType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-500">{item.subjectName}</span>
                    <span className="text-xs font-extrabold text-blue-700">
                      {formatINR(item.price)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSearchSubmit}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold text-xs flex items-center justify-center gap-1 border-t border-slate-100 transition-colors"
          >
            View all results for &quot;{query}&quot; <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
