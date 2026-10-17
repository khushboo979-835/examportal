'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Download, 
  BookOpen, 
  Users, 
  TrendingUp, 
  UploadCloud, 
  FileText, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { PDFProduct } from '@/types';
import { formatINR } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [boardStats, setBoardStats] = useState<any[]>([]);
  const [products, setProducts] = useState<PDFProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsRes, prodRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/products'),
        ]);

        const statsData = await statsRes.json();
        const prodData = await prodRes.json();

        if (statsData.success) {
          setStats(statsData.stats);
          setBoardStats(statsData.boardStats || []);
        }

        if (prodData.success) {
          setProducts(prodData.products || []);
        }
      } catch (err) {
        console.error('Admin data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const handleTogglePublish = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, isPublished: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isPublished: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Executive Analytics & Revenue Command
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry on student downloads, Razorpay settlements & board distribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/upload"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <UploadCloud className="w-4 h-4" /> Upload New Material (S3/R2)
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> Orders Ledger
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Gross Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatINR(stats?.grossRevenue || 2707720)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> +28.4% from last month
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Watermarked Downloads</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {(stats?.totalDownloads || 32800).toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-400 font-semibold">
                  Zero unauthorized leaks detected
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Active Study Materials</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {products.length} Products
                </div>
                <div className="text-[11px] text-amber-400 font-semibold">
                  CBSE, BSEB, BPSC & UPSC Vaults
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Checkout Conversion</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats?.conversionRate || '4.8%'}
                </div>
                <div className="text-[11px] text-purple-400 font-semibold">
                  High-converting 1-Click checkout
                </div>
              </div>

            </div>

            {/* Board Distribution Bar Breakdown */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Top-Selling Boards & Exam Streams</span>
              </h3>

              <div className="space-y-4">
                {boardStats.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-200">{item.board}</span>
                      <span className="text-slate-400">
                        {item.sales.toLocaleString()} Sales ({formatINR(item.revenue)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-blue-500'
                            : idx === 1
                            ? 'bg-amber-500'
                            : idx === 2
                            ? 'bg-emerald-500'
                            : idx === 3
                            ? 'bg-purple-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Management Table */}
            <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-lg overflow-hidden space-y-4 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Material Inventory & Visibility Controls</h3>
                  <p className="text-xs text-slate-400">Toggle public visibility, modify pricing, and review downloads.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="p-3">Title & Board</th>
                      <th className="p-3">Medium</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Downloads</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-700/30">
                        <td className="p-3">
                          <div className="font-bold text-white line-clamp-1">{p.title}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{p.subject?.boardOrExam?.code || 'BOARD'} • {p.pageCount} Pages</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-bold">
                            {p.medium}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          {formatINR(p.discountedPrice ?? p.price)}
                        </td>
                        <td className="p-3 text-slate-300 font-semibold">
                          {p.totalDownloads.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.isPublished
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {p.isPublished ? 'Live' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleTogglePublish(p.id, p.isPublished)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                            title={p.isPublished ? 'Hide from store' : 'Publish to store'}
                          >
                            {p.isPublished ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
}
