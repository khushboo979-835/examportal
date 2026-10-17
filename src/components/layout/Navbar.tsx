'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShoppingCart, 
  Search, 
  Library, 
  ShieldCheck, 
  Menu, 
  X, 
  Flame, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/search/SearchBar';

export default function Navbar() {
  const { cart, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const cartItemCount = cart.length;

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
          Limited Offer
        </span>
        <span>Bihar Special BPSC 70th & BSEB 12th Notes @ Flat 50% OFF! Use Code: <strong>TOPPER50</strong></span>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  Exam<span className="text-blue-600">Pustak</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1 py-0.5 rounded">.IN</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 -mt-1 tracking-wide">
                  CBSE • BSEB • BPSC • UPSC Notes
                </span>
              </div>
            </Link>

            {/* Desktop Smart Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <SearchBar placeholder="Search by Exam (BPSC, BSEB, CBSE), Subject, or Hindi Notes..." />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <Link 
                href="/explore" 
                className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                Explore Notes
              </Link>
              <Link 
                href="/explore?level=COMPETITIVE" 
                className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                BPSC & Govt Exams
              </Link>
              <Link 
                href="/library" 
                className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Library className="w-4 h-4 text-emerald-600" />
                My Notes
              </Link>
              <Link 
                href="/admin" 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                Admin Portal
              </Link>
            </div>

            {/* Right CTAs: Cart & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setShowSearchModal(true)} 
                className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center gap-2 font-semibold text-sm"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              Explore All Study Material
            </Link>
            <Link
              href="/explore?level=K12"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
            >
              <GraduationCap className="w-5 h-5 text-blue-600" />
              CBSE & Bihar Board 10th / 12th
            </Link>
            <Link
              href="/explore?level=COMPETITIVE"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              BPSC, UPSC & SSC Prep
            </Link>
            <Link
              href="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
            >
              <Library className="w-5 h-5 text-emerald-600" />
              My Purchased Notes
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-slate-800 border-t border-slate-100 pt-3"
            >
              <ShieldCheck className="w-5 h-5 text-slate-500" />
              Admin Portal
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-start pt-16">
          <div className="bg-white rounded-2xl p-4 shadow-2xl relative">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Search Notes, PYQs & Boards</h3>
            <SearchBar onSelect={() => setShowSearchModal(false)} placeholder="e.g. BPSC Bihar Special, BSEB 12th Physics..." />
          </div>
        </div>
      )}
    </>
  );
}
