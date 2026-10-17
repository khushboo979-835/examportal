'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, ShieldCheck, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, totalAmount, totalOriginalAmount, totalSaved } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-200" />
              <h2 className="text-lg font-bold">Your Study Bag ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Your bag is empty</h3>
              <p className="text-sm text-slate-500 mb-6">Explore our curated topper notes and previous year question bundles.</p>
              <Link
                href="/explore"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              >
                Browse Study Materials <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
                {cart.map(({ product }, idx) => {
                  const effectivePrice = product.discountedPrice ?? product.price;
                  const itemKey = (product as any)._id || product.id || product.slug || `cart-item-${idx}`;
                  const productId = product.id || (product as any)._id;
                  return (
                    <div key={itemKey} className="pt-4 first:pt-0 flex gap-4">
                      {/* Product Thumbnail / Icon */}
                      <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 flex flex-col items-center justify-center text-blue-600 shrink-0 p-1">
                        <BookOpen className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-tight text-blue-800">
                          {product.medium === 'HINDI' ? 'हिन्दी' : product.medium}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/p/${product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-slate-900 hover:text-blue-600 line-clamp-2 leading-snug"
                          >
                            {product.title}
                          </Link>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>{product.pageCount} Pages</span>
                          <span>•</span>
                          <span className="font-semibold text-indigo-600">{product.materialType}</span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-extrabold text-sm text-slate-900">{formatINR(effectivePrice)}</span>
                          {product.discountedPrice && (
                            <span className="text-xs text-slate-400 line-through">{formatINR(product.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total & Checkout Section */}
              <div className="p-6 bg-slate-50 border-t border-slate-200/80 space-y-4">
                {totalSaved > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-between border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Total Discount Savings
                    </span>
                    <span>{formatINR(totalSaved)}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatINR(totalOriginalAmount)}</span>
                  </div>
                  {totalSaved > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>- {formatINR(totalSaved)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>To Pay</span>
                    <span className="text-blue-600 text-lg">{formatINR(totalAmount)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-sm"
                >
                  Proceed to 1-Click Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant access in My Notes right after payment</span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
