'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, FileText, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Analytics Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Upload New Notes (S3/R2)', href: '/admin/upload', icon: UploadCloud },
    { label: 'Orders & CSV Ledger', href: '/admin/orders', icon: FileText },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Admin Operations Vault</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Database: Active (PostgreSQL / Memory Cache)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-3 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
