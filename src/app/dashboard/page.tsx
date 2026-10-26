'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Download, 
  Eye, 
  ShieldCheck, 
  Award, 
  Smartphone, 
  Sparkles, 
  Loader2, 
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { getHydratedProducts } from '@/lib/mock-db';
import { formatBytes } from '@/lib/utils';
import PDFPreviewModal from '@/components/product/PDFPreviewModal';

export default function StudentDashboardPage() {
  const [purchasedList, setPurchasedList] = useState<any[]>([]);
  const [userPhone, setUserPhone] = useState('+91 7544065425');
  const [userEmail, setUserEmail] = useState('studyfreepdf2@gmail.com');
  const [userName, setUserName] = useState('Aarav Kumar');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<any | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem('studyfreepdf_user_phone') || localStorage.getItem('exampustak_user_phone');
    const savedEmail = localStorage.getItem('studyfreepdf_user_email') || localStorage.getItem('exampustak_user_email');
    const savedName = localStorage.getItem('studyfreepdf_user_name') || localStorage.getItem('exampustak_user_name');
    if (savedPhone) setUserPhone(savedPhone);
    if (savedEmail) setUserEmail(savedEmail);
    if (savedName) setUserName(savedName);

    // Populate purchased notes
    const hydrated = getHydratedProducts();
    setPurchasedList([hydrated[0], hydrated[1], hydrated[3]]);
  }, []);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = async (product: any) => {
    const targetId = product.slug || product._id || product.id;
    setDownloadingId(targetId);
    setDownloadSuccess(null);
    try {
      const downloadUrl = `/api/pdf/download/${encodeURIComponent(targetId)}?phone=${encodeURIComponent(userPhone)}&email=${encodeURIComponent(userEmail)}`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Server returned an error generating your PDF');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${product.slug || 'study-notes'}-licensed.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(`Downloaded "${product.title}" • Dynamic Watermark Applied & Logged in DB.`);
      setTimeout(() => setDownloadSuccess(null), 6000);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Could not download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Testbook My Study Room Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A389] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>My Study Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your personalized, dynamically watermarked PDF notes & solved paper vaults.
          </p>
        </div>

        {/* Pass Status Card */}
        <div className="bg-gradient-to-r from-[#00A389]/20 to-blue-500/20 rounded-2xl p-4 border border-[#00A389]/30 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <span className="font-extrabold text-[#00A389] uppercase text-[10px] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Testbook PDF Pass Active
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              365 Days Remaining
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">{userPhone}</div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {downloadSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-800">PDF Download Complete</div>
              <div className="text-[11px] text-emerald-700 font-medium">{downloadSuccess}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200">
            Stored in DB ✓
          </span>
        </div>
      )}

      {/* Materials List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            My Enrolled Study Materials ({purchasedList.length})
          </h2>
          <Link
            href="/explore"
            className="text-xs font-bold text-[#00A389] hover:underline flex items-center gap-1"
          >
            Browse More Exams <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedList.map((product, idx) => {
            const isDownloading = downloadingId === (product.id || (product as any)._id);
            return (
              <div
                key={(product as any)._id || product.id || product.slug || idx}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#00A389] hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#00A389] text-white tracking-wider">
                      {product.subject?.boardOrExam?.code || 'BOARD'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      ✓ Licensed Copy
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                    <div>
                      <span className="text-slate-400">Pages:</span> <strong>{product.totalPages || product.pageCount} Pgs</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Medium:</span> <strong>{product.medium}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => handleDownload(product)}
                    disabled={isDownloading}
                    className="w-full py-3 px-4 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Watermarking PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download Watermarked PDF
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPreview(product)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00A389]" /> Read in Clean Viewer
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {selectedPreview && (
        <PDFPreviewModal
          product={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}

    </div>
  );
}
