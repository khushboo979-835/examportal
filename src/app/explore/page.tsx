'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Filter, 
  Search, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { PDFProduct } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import FacetedFilters from '@/components/search/FacetedFilters';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<PDFProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL
  const query = searchParams.get('q') || '';
  const level = searchParams.get('level') || undefined;
  const board = searchParams.get('board') || undefined;
  const classLevel = searchParams.get('class') || undefined;
  const medium = searchParams.get('medium') || undefined;
  const materialType = searchParams.get('type') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = searchParams.get('sort') || 'popular';

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (level) params.set('level', level);
        if (board) params.set('board', board);
        if (classLevel) params.set('class', classLevel);
        if (medium) params.set('medium', medium);
        if (materialType) params.set('type', materialType);
        if (minPrice !== undefined) params.set('minPrice', String(minPrice));
        if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));
        if (sortBy) params.set('sort', sortBy);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
          setTotal(data.pagination?.total || 0);
        }
      } catch (err) {
        console.error('Explore fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [query, level, board, classLevel, medium, materialType, minPrice, maxPrice, sortBy]);

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === '') {
      params.delete(key === 'materialType' ? 'type' : key);
    } else {
      params.set(key === 'materialType' ? 'type' : key, String(value));
    }
    router.push(`/explore?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Faceted Search Engine</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {query ? `Search results for "${query}"` : 'Browse All Exam Materials'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {total} verified topper study guides, formula sheets & solved PYQs
            </p>
          </div>

          {/* Sort Dropdown & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-hidden cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated (5.0★)</option>
                <option value="latest">Newly Added</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FacetedFilters
              level={level}
              board={board}
              medium={medium}
              materialType={materialType}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p className="text-sm font-semibold text-slate-600">Searching through 10,000+ notes vault...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No study materials matched your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try widening your price range, clearing board filters, or searching for broader keywords.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={(product as any)._id || product.id || product.slug || idx} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Filter Study Notes</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FacetedFilters
              level={level}
              board={board}
              medium={medium}
              materialType={materialType}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={(k, v) => {
                handleFilterChange(k, v);
                setMobileFilterOpen(false);
              }}
              onReset={() => {
                handleReset();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading Exam Catalog...</p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
