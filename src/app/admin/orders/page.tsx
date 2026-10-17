'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2,
  Filter
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Order } from '@/types';
import { formatINR } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'FAILED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.paymentStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = (o.customerName || '').toLowerCase().includes(q);
      const matchEmail = (o.customerEmail || '').toLowerCase().includes(q);
      const matchPhone = (o.customerPhone || '').toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    window.location.href = '/api/admin/orders?format=csv';
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header & CSV CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Transactions & Orders Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Audit all student purchases, Razorpay transaction IDs, and export reports.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" /> Export Ledger to CSV
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Student Name, Phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'PAID', 'PENDING', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No orders matched your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/70 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Order ID & Date</th>
                    <th className="p-3.5">Student Credentials</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-blue-400">{o.orderNumber}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{o.customerName || 'Aarav Kumar'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{o.customerPhone || '+91-9876543210'}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{o.customerEmail || 'student@gmail.com'}</div>
                      </td>
                      <td className="p-3.5 font-black text-white text-sm">
                        {formatINR(o.totalAmount)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold text-[10px]">
                          {o.paymentMethod || 'RAZORPAY_UPI'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : o.paymentStatus === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {o.paymentStatus === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                          {o.paymentStatus === 'PENDING' && <Clock className="w-3 h-3" />}
                          {o.paymentStatus === 'FAILED' && <XCircle className="w-3 h-3" />}
                          {o.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
