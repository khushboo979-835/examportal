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
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  FileCheck2,
  Library,
  Flame,
  Check
} from 'lucide-react';
import { getHydratedProducts } from '@/lib/mock-db';
import { formatBytes } from '@/lib/utils';
import PDFPreviewModal from '@/components/product/PDFPreviewModal';

interface BookmarkItem {
  id: string;
  title: string;
  page: number;
  slug: string;
  savedAt: string;
}

export default function StudentDashboardPage() {
  const [purchasedList, setPurchasedList] = useState<any[]>([]);
  const [userPhone, setUserPhone] = useState('+91 7544065425');
  const [userEmail, setUserEmail] = useState('studyfreepdf2@gmail.com');
  const [userName, setUserName] = useState('Aarav Kumar');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'BOOKMARKS' | 'DOWNLOADS'>('MATERIALS');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastReadNote, setLastReadNote] = useState<{ title: string; page: number; total: number; slug: string } | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<{ title: string; time: string; size: string }[]>([]);

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

    // Load persistent bookmarks from localStorage
    try {
      const savedBms = localStorage.getItem('studyfreepdf_bookmarks');
      if (savedBms) {
        setBookmarks(JSON.parse(savedBms));
      } else {
        const initialBms = [
          { id: 'bm-1', title: 'Bihar River Drainage & Son Valley System', page: 24, slug: hydrated[0].slug, savedAt: 'Yesterday' },
          { id: 'bm-2', title: 'Electromagnetic Waves & Ray Optics Formulae', page: 12, slug: hydrated[1].slug, savedAt: '3 days ago' },
        ];
        setBookmarks(initialBms);
        localStorage.setItem('studyfreepdf_bookmarks', JSON.stringify(initialBms));
      }

      // Resume reading state
      const savedResume = localStorage.getItem('studyfreepdf_last_read');
      if (savedResume) {
        setLastReadNote(JSON.parse(savedResume));
      } else {
        setLastReadNote({
          title: hydrated[0].title,
          page: 18,
          total: hydrated[0].pageCount || 148,
          slug: hydrated[0].slug,
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleBookmark = (product: any, page: number = 1) => {
    const id = product.slug || product.id;
    const existing = bookmarks.find((b) => b.slug === id);
    let updated: BookmarkItem[];
    if (existing) {
      updated = bookmarks.filter((b) => b.slug !== id);
    } else {
      updated = [
        ...bookmarks,
        {
          id: `bm-${Date.now()}`,
          title: product.title,
          page,
          slug: id,
          savedAt: 'Just now',
        },
      ];
    }
    setBookmarks(updated);
    localStorage.setItem('studyfreepdf_bookmarks', JSON.stringify(updated));
  };

  const handleOpenPreview = (product: any) => {
    setSelectedPreview(product);
    const resume = {
      title: product.title,
      page: 1,
      total: product.pageCount || 100,
      slug: product.slug,
    };
    setLastReadNote(resume);
    localStorage.setItem('studyfreepdf_last_read', JSON.stringify(resume));
  };

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

      setDownloadSuccess(`Downloaded "${product.title}" • Dynamic Watermark Stamped & Stored.`);
      setDownloadHistory((prev) => [
        { title: product.title, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), size: formatBytes(product.fileSize || 5242880) },
        ...prev,
      ]);
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
      
      {/* Student Study Room Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A389] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>My Study Room &amp; Digital Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your personalized, dynamically watermarked PDF notes, bookmarks, and solved paper vaults.
          </p>
        </div>

        {/* Pass Status Card */}
        <div className="bg-gradient-to-r from-[#00A389]/20 to-blue-500/20 rounded-2xl p-4 border border-[#00A389]/30 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <span className="font-extrabold text-[#00A389] uppercase text-[10px] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> StudyFree PDF Pass Active
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              365 Days Remaining
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">{userPhone}</div>
        </div>
      </div>

      {/* Resume Reading Utility Banner */}
      {lastReadNote && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                Resume Reading Where You Left Off
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5 line-clamp-1">
                {lastReadNote.title}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Page {lastReadNote.page} of {lastReadNote.total} • Verified Topper Revision Notes
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const matched = purchasedList.find((p) => p.slug === lastReadNote.slug) || purchasedList[0];
              if (matched) setSelectedPreview(matched);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <span>Resume Page {lastReadNote.page}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('MATERIALS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'MATERIALS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Study Materials ({purchasedList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('BOOKMARKS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'BOOKMARKS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Bookmarks ({bookmarks.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('DOWNLOADS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'DOWNLOADS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download History</span>
        </button>
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

      {/* Tab 1: Materials List */}
      {activeTab === 'MATERIALS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
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
              const isBookmarked = bookmarks.some((b) => b.slug === (product.slug || product.id));

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
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(product)}
                          className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this note'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          ✓ Licensed Copy
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Editorial & Syllabus Citation */}
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Syllabus: 2026-27 Aligned • Verified by Toppers</span>
                    </div>

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
                      className="w-full py-3 px-4 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] cursor-pointer"
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
                      onClick={() => handleOpenPreview(product)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00A389]" /> Read in Clean Viewer
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {activeTab === 'BOOKMARKS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Bookmarks &amp; Critical Revision Points ({bookmarks.length})</span>
          </h2>

          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No bookmarks saved yet. Click the bookmark icon on any note to save your revision point.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookmarks.map((bm) => (
                <div key={bm.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">{bm.title}</h4>
                    <div className="text-[11px] text-slate-500">
                      Saved Page {bm.page} • Added {bm.savedAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const matched = purchasedList.find((p) => p.slug === bm.slug) || purchasedList[0];
                        if (matched) setSelectedPreview(matched);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                    >
                      Jump to Page
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = bookmarks.filter((b) => b.id !== bm.id);
                        setBookmarks(updated);
                        localStorage.setItem('studyfreepdf_bookmarks', JSON.stringify(updated));
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Downloads History */}
      {activeTab === 'DOWNLOADS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Recent PDF Downloads &amp; Dynamic Watermark Logs</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Document Title</th>
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">File Size</th>
                  <th className="py-2.5">Security License</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {downloadHistory.length > 0 ? (
                  downloadHistory.map((d, i) => (
                    <tr key={i}>
                      <td className="py-3 font-semibold">{d.title}</td>
                      <td className="py-3 text-slate-500">{d.time}</td>
                      <td className="py-3 text-slate-500">{d.size}</td>
                      <td className="py-3 text-emerald-700 font-mono text-[10px]">Stamped: {userPhone} ✓</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 font-semibold">BPSC 70th Prelims: Bihar Special GK</td>
                    <td className="py-3 text-slate-500">10:45 AM</td>
                    <td className="py-3 text-slate-500">18.4 MB</td>
                    <td className="py-3 text-emerald-700 font-mono text-[10px]">Stamped: {userPhone} ✓</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPreview && (
        <PDFPreviewModal
          product={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}

    </div>
  );
}
