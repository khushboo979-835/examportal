'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Lock, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  ShoppingCart, 
  Check, 
  Maximize2 
} from 'lucide-react';
import { PDFProduct } from '@/types';
import { formatINR, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface PDFPreviewModalProps {
  product: PDFProduct;
  onClose: () => void;
}

export default function PDFPreviewModal({ product, onClose }: PDFPreviewModalProps) {
  const { addToCart, cart } = useCart();
  const [fullscreen, setFullscreen] = useState(false);
  const isInCart = cart.some((item) => item.product.id === product.id);

  const previewSrc = `/api/preview/${product.id}#toolbar=0&navpanes=0&scrollbar=1`;
  const activePrice = product.discountedPrice ?? product.price;
  const discount = calculateDiscount(product.price, product.discountedPrice);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 transition-all duration-300 ${
          fullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-4xl h-[90vh]'
        }`}
      >
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Sample Preview Only
            </span>
            <h3 className="text-sm font-bold text-slate-100 truncate">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Banner Notice */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Viewing first 3 sample pages watermarked. Full document contains <strong>{product.pageCount} pages</strong>.</span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
            100% Verified Quality
          </span>
        </div>

        {/* Embedded PDF Viewer Frame */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center">
          <iframe
            src={previewSrc}
            title={`${product.title} - Sample Preview`}
            className="w-full h-full border-0 bg-white"
          />

          {/* Floating Watermark Banner on Bottom of Canvas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white text-xs px-4 py-1.5 rounded-full shadow-lg border border-slate-700/80 flex items-center gap-2 pointer-events-none opacity-90">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>STUDYFREEPDF.COM PREVIEW • UNAUTHORIZED SHARING PROHIBITED</span>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">Instant Complete Access</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{formatINR(activePrice)}</span>
                {product.discountedPrice && (
                  <span className="text-sm text-slate-400 line-through">{formatINR(product.price)}</span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Continue Browsing
            </button>
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              disabled={isInCart}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-102"
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" /> Item in Bag
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Unlock Full {product.pageCount} Pages Now
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
