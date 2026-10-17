'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Check, 
  ShoppingCart,
  Maximize2,
  FileText
} from 'lucide-react';
import { IPDFProduct } from '@/models/PDFProduct';
import { formatINR } from '@/lib/utils';
import BuyNowButton from '@/components/product/BuyNowButton';

interface SampleViewerProps {
  product: any;
  onUnlock?: () => void;
}

export default function SampleViewer({ product, onUnlock }: SampleViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const totalPreviewPages = 3;
  const remainingPages = Math.max(1, (product.totalPages || 50) - totalPreviewPages);
  const activePrice = product.discountedPrice ?? product.price ?? 49;

  const isLocked = currentPage > totalPreviewPages;

  const handleNextPage = () => {
    if (currentPage < totalPreviewPages + 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[620px]'
      }`}
    >
      {/* Top Toolbar */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-white flex items-center justify-between flex-wrap gap-2 text-xs">
        
        {/* Left: Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono font-bold px-2 py-1 rounded bg-slate-800/80">
            Page {Math.min(currentPage, totalPreviewPages)} of {totalPreviewPages}
            <span className="text-slate-400 font-normal ml-1">({product.totalPages || 120} in Full PDF)</span>
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Free Sample Notice Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />
          <span>Free 3-Page Sample Mode</span>
        </div>

        {/* Right: Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(75, z - 15))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-10 text-center">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(150, z + 15))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 ml-1"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Document Rendering Canvas */}
      <div className="flex-1 bg-slate-950 relative overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start">
        
        {currentPage <= totalPreviewPages ? (
          /* Render Active Sample Page */
          <div
            className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 transition-transform duration-200 max-w-2xl w-full relative"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* Watermark Diagonal Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-30deg] opacity-15 select-none">
              <span className="text-3xl sm:text-4xl font-black text-[#00A389] tracking-widest uppercase">
                EXAMPASS.IN • SAMPLE PREVIEW ONLY
              </span>
            </div>

            {/* Page Header Strip */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#00A389] text-white">
                  {product.medium || 'HINDI'} MEDIUM
                </span>
                <span className="text-xs font-extrabold text-slate-700 truncate max-w-[280px]">
                  {product.title}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Sample Page {currentPage}
              </span>
            </div>

            {/* Sample Content Body based on current page */}
            {currentPage === 1 ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                  <h3 className="text-sm font-black text-[#00A389] uppercase tracking-wide">
                    Comprehensive Chapter Blueprint & Syllabus Crux
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Compiled directly from standard state & NCERT textbooks. Includes all derivation steps and previous 10-year question frequency trends.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Core Formulas & Theorems (Sample Extract)
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono border border-slate-100 text-slate-800 space-y-1">
                    <div>1. Gauss&apos;s Law: ∮ E · dA = Q_enclosed / ε₀</div>
                    <div>2. Electric Potential: V = (1 / 4πε₀) · (q / r)</div>
                    <div>3. Capacitance with Dielectric: C = K · ε₀A / d</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Key Examination Takeaway: Electrostatics carries a 14% question weightage in recent board & prelim examinations. Mastering the derivation of electric field along the axial and equatorial lines ensures maximum scoring.
                </p>
              </div>
            ) : currentPage === 2 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900">
                  Section 2: High-Yield Previous Year Questions (With Step-By-Step Marking Scheme)
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="font-bold text-slate-900 mb-1">
                      [VVI Q1] State and prove Ampere&apos;s Circuital Law. Apply it to find the magnetic field at the center of a long straight solenoid.
                    </div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      <strong>Solution Step 1:</strong> The line integral of magnetic induction B around any closed loop is equal to μ₀ times the total current enclosed by the loop...
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900">
                  Section 3: Rapid Revision Mind Maps & Shortcut Calculation Formulas
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  You have reached the end of the free 3-page sample preview. Turn to next page to unlock the complete {product.totalPages || 120}-page document.
                </div>
              </div>
            )}

            {/* Page Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>ExamPass.in Authorized Sample Copy</span>
              <span>Page {currentPage} of {product.totalPages || 120}</span>
            </div>

          </div>
        ) : (
          /* Paywall Lock on Page 4 */
          <div className="w-full max-w-xl my-auto bg-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700/80 text-white text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Paywall Protected Content
              </span>
              <h3 className="text-2xl font-black text-white">
                Unlock Full {product.totalPages || 120}-Page Study Material
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                You have previewed the first 3 sample pages. Access all remaining {remainingPages} pages, solved questions & formulas.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-semibold">One-Time Instant Purchase</div>
                <div className="text-2xl font-black text-white">{formatINR(activePrice)}</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                Lifetime PDF Access
              </span>
            </div>

            <div className="space-y-2">
              <BuyNowButton product={product} />

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A389]" />
                <span>Anti-piracy dynamic watermark with your registered phone number included</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-white">
            {formatINR(activePrice)}
          </span>
          {product.discountedPrice && (
            <span className="text-xs text-slate-500 line-through">
              {formatINR(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(4)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A389] to-emerald-600 hover:from-[#008f77] hover:to-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Lock className="w-3.5 h-3.5" /> Unlock Remaining {remainingPages} Pages
          </button>
        </div>
      </div>

    </div>
  );
}
