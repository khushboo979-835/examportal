'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Library, 
  Download, 
  Eye, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { PDFProduct, Order } from '@/types';
import { mockOrders, mockPDFProducts, getHydratedProducts } from '@/lib/mock-db';
import { formatBytes } from '@/lib/utils';
import PDFPreviewModal from '@/components/product/PDFPreviewModal';

export default function StudentLibraryPage() {
  const [purchasedProducts, setPurchasedProducts] = useState<PDFProduct[]>([]);
  const [userEmail, setUserEmail] = useState('studyfreepdf2@gmail.com');
  const [userPhone, setUserPhone] = useState('+91 7544065425');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [presignedStatus, setPresignedStatus] = useState<Record<string, { url: string; expiresAt: number }>>({});
  const [selectedPreview, setSelectedPreview] = useState<PDFProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read cached user credentials
    const savedEmail = localStorage.getItem('studyfreepdf_user_email') || localStorage.getItem('exampustak_user_email');
    const savedPhone = localStorage.getItem('studyfreepdf_user_phone') || localStorage.getItem('exampustak_user_phone');
    if (savedEmail) setUserEmail(savedEmail);
    if (savedPhone) setUserPhone(savedPhone);

    // Hydrate purchased library
    const hydrated = getHydratedProducts();
    // Default demo library items + any completed order items
    setPurchasedProducts([
      hydrated[0], // BPSC 70th Bihar Special
      hydrated[1], // BSEB Class 12 Physics
      hydrated[3], // UPSC Polity Mindmaps
    ]);
    setIsLoading(false);
  }, []);

  // Request 10-minute Presigned URL & Dynamic Watermarked PDF Stream
  const handleSecureDownload = async (product: PDFProduct) => {
    setDownloadingId(product.id);
    try {
      // 1. Call presigned URL generator
      const presignRes = await fetch('/api/storage/presign-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userEmail,
          userPhone,
        }),
      });

      const presignData = await presignRes.json();
      if (!presignData.success) {
        throw new Error(presignData.error || 'Failed to generate download token');
      }

      // Record 10-minute expiry
      const expiresAt = Date.now() + 10 * 60 * 1000;
      setPresignedStatus((prev) => ({
        ...prev,
        [product.id]: { url: presignData.downloadUrl, expiresAt },
      }));

      // Trigger instant dynamic watermarked download
      const downloadLink = document.createElement('a');
      downloadLink.href = presignData.downloadUrl;
      downloadLink.setAttribute('download', `${product.slug}-watermarked.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    } catch (err) {
      console.error('Download error:', err);
      alert('Download request could not be completed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Student Knowledge Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            My Study Notes Library ({purchasedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Instant lifetime access to your purchased materials with dynamic anti-piracy licensing.
          </p>
        </div>

        {/* Student Credential Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-1.5 shrink-0">
          <div className="text-slate-300 font-medium">Licensed Student:</div>
          <div className="font-bold text-white flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-300" />
            <span>{userPhone}</span>
          </div>
          <div className="text-slate-300 text-[11px] truncate max-w-[200px]">
            {userEmail}
          </div>
        </div>
      </div>

      {/* Anti-Piracy Notice Pill */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Zero-Leak Security Active:</strong> Download links use 10-minute temporary signed tokens. Each PDF contains your dynamic margin watermark.
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
          Token Expiry: 10 Mins
        </span>
      </div>

      {/* Library Grid */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-semibold text-slate-500">Loading your notes vault...</p>
        </div>
      ) : purchasedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Library className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your Library is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated topper handwritten notes and previous year question banks to start building your collection.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Explore Study Materials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedProducts.map((product) => {
            const isCurrentlyDownloading = downloadingId === product.id;
            const presignInfo = presignedStatus[product.id];
            const isTokenActive = presignInfo && Date.now() < presignInfo.expiresAt;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white tracking-wider">
                      {product.subject?.boardOrExam?.code || 'BOARD'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Licensed Copy
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                    <div>
                      <span className="text-slate-400">Pages:</span> <strong>{product.pageCount} Pgs</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Size:</span> <strong>{formatBytes(product.fileSize)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Medium:</span> <strong>{product.medium}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Format:</span> <strong>Vector PDF</strong>
                    </div>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => handleSecureDownload(product)}
                    disabled={isCurrentlyDownloading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    {isCurrentlyDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Watermarking & Streaming...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download Watermarked PDF
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedPreview(product)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" /> Read Preview
                    </button>
                    <Link
                      href={`/p/${product.slug}`}
                      className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] flex items-center justify-center shrink-0"
                      title="View Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {isTokenActive && (
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Token valid for 10 minutes
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PDF Preview Modal */}
      {selectedPreview && (
        <PDFPreviewModal
          product={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}

    </div>
  );
}
