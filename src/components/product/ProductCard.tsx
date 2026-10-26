'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Star, 
  Download, 
  Eye, 
  ShoppingCart, 
  Check, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { PDFProduct } from '@/types';
import { formatINR, formatBytes, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import PDFPreviewModal from './PDFPreviewModal';

interface ProductCardProps {
  product: PDFProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const [showPreview, setShowPreview] = useState(false);
  const isInCart = cart.some((item) => item.product.id === product.id);

  const discount = calculateDiscount(product.price, product.discountedPrice);
  const activePrice = product.discountedPrice ?? product.price;
  const boardCode = product.subject?.boardOrExam?.code || 'ACADEMIC';

  const mediumLabel =
    product.medium === 'HINDI'
      ? 'हिन्दी माध्यम'
      : product.medium === 'ENGLISH'
      ? 'English Medium'
      : 'Bilingual (Hinglish)';

  const mediumColor =
    product.medium === 'HINDI'
      ? 'bg-amber-100 text-amber-900 border-amber-200'
      : product.medium === 'ENGLISH'
      ? 'bg-blue-100 text-blue-900 border-blue-200'
      : 'bg-emerald-100 text-emerald-900 border-emerald-200';

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        
        {/* Top Badges Ribbon */}
        <div className="p-4 pb-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white tracking-wider shadow-xs">
              {boardCode}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${mediumColor}`}>
              {mediumLabel}
            </span>
          </div>

          {discount > 0 && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Card Header & Title */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated for 2026–2027 Syllabus</span>
          </div>

          <Link href={`/p/${product.slug}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>

          {/* Micro Specs Pill */}
          <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 bg-slate-50 rounded-xl my-3 text-[11px] text-slate-600 border border-slate-100">
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium">{product.pageCount} Pgs</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">{formatBytes(product.fileSize)}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Access Guarantee Badge */}
          <div className="py-1 px-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center justify-between border border-emerald-100 mb-2">
            <span>✓ PDF Download Included</span>
            <span>Lifetime Access</span>
          </div>

          {/* Subject & Format */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100">
            <span className="font-medium truncate max-w-[140px]">
              {product.subject?.name || 'General Prep'}
            </span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
              {product.materialType}
            </span>
          </div>
        </div>

        {/* Pricing & CTAs */}
        <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                {formatINR(activePrice)}
              </span>
              {product.discountedPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {product.totalDownloads}+ downloads
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Preview Sample CTA (Free Sample Reading) */}
            <button
              onClick={() => setShowPreview(true)}
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Read free 3-page preview before paying"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" /> Free Sample Reading
            </button>

            {/* Add to Cart / Buy CTA */}
            <button
              onClick={() => addToCart(product)}
              disabled={isInCart}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isInCart
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy ({formatINR(activePrice)})
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Embedded PDF Preview Modal */}
      {showPreview && (
        <PDFPreviewModal
          product={product}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
