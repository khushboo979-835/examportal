'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Download, 
  Library, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Smartphone, 
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockOrders, getHydratedProducts } from '@/lib/mock-db';
import { formatINR, formatBytes } from '@/lib/utils';
import { PDFProduct } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState('+91-9876543210');
  const [userEmail, setUserEmail] = useState('student@exampustak.in');

  const products: PDFProduct[] = getHydratedProducts().slice(0, 2);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const savedPhone = localStorage.getItem('exampustak_user_phone');
    const savedEmail = localStorage.getItem('exampustak_user_email');
    if (savedPhone) setUserPhone(savedPhone);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleDownload = async (product: PDFProduct) => {
    setDownloadingId(product.id);
    try {
      const presignRes = await fetch('/api/storage/presign-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userEmail,
          userPhone,
        }),
      });

      const data = await presignRes.json();
      if (data.success && data.downloadUrl) {
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.setAttribute('download', `${product.slug}-watermarked.pdf`);
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
          Payment Confirmed • Razorpay Verified
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Thank You! Your Study Materials are Ready
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Order ID: <strong className="text-slate-800 font-mono">{orderNumber || 'ORD-2026-X9Y2'}</strong>. 
          Your notes have been securely licensed to <strong>{userPhone}</strong> with dynamic anti-piracy protection.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/library"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <Library className="w-4 h-4" /> Go to My Notes Library
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
          >
            Browse More Study Notes
          </Link>
        </div>
      </div>

      {/* Immediate Download Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          <span>Direct Instant Downloads</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {product.subject?.boardOrExam?.code || 'BOARD'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">{product.medium}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{product.title}</h4>
                <p className="text-xs text-slate-400">{product.pageCount} Pages • {formatBytes(product.fileSize)}</p>
              </div>

              <button
                onClick={() => handleDownload(product)}
                disabled={downloadingId === product.id}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                {downloadingId === product.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Watermarking...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Watermarked PDF
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
