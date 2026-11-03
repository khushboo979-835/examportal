'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Check,
  Receipt,
  LogOut,
  ShoppingBag,
  ExternalLink,
  User as UserIcon,
  HelpCircle,
  GraduationCap,
  Calendar,
  Send,
  Building,
  Hash,
  AlertCircle
} from 'lucide-react';
import { getHydratedProducts } from '@/lib/mock-db';
import { formatBytes, formatINR } from '@/lib/utils';
import PDFPreviewModal from '@/components/product/PDFPreviewModal';

interface BookmarkItem {
  id: string;
  title: string;
  page: number;
  slug: string;
  savedAt: string;
}

interface OrderItem {
  _id?: string;
  id?: string;
  orderNumber: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  orderType: 'SINGLE_PDF' | 'ALL_ACCESS_PASS';
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt: string | Date;
  pdfProductId?: any;
  razorpayPaymentId?: string;
}

interface EnrolledInternship {
  _id: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  collegeName: string;
  rollNumber: string;
  degreeProgram: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'REVIEW_PENDING' | 'COMPLETED';
  startDate: string;
  completedDate?: string;
  certificateIssued: boolean;
  certificateId?: string;
  submissions: Array<{
    weekNumber: number;
    submissionUrl?: string;
    hostedLink?: string;
    driveLink?: string;
    status: string;
    mentorFeedback?: string;
  }>;
  trackId: {
    _id: string;
    title: string;
    slug?: string;
    stream: string;
    durationWeeks: number;
  };
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string>('');
  const [purchasedList, setPurchasedList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [enrolledInternships, setEnrolledInternships] = useState<EnrolledInternship[]>([]);
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('Student');
  const [hasActivePass, setHasActivePass] = useState<boolean>(false);
  const [passDaysRemaining, setPassDaysRemaining] = useState<number>(0);
  
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'MATERIALS' | 'INTERNSHIPS' | 'ORDERS' | 'BOOKMARKS' | 'DOWNLOADS'>('MATERIALS');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastReadNote, setLastReadNote] = useState<{ title: string; page: number; total: number; slug: string } | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<{ title: string; time: string; size: string; id: string }[]>([]);

  useEffect(() => {
    async function initDashboard() {
      setIsLoadingAuth(true);
      try {
        // 1. Check server-authenticated session first
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data && data.authenticated && data.user) {
          setIsAuthenticated(true);
          if (data.user.name) setUserName(data.user.name);
          if (data.user.phone) setUserPhone(data.user.phone);
          if (data.user.email) setUserEmail(data.user.email);
          if (data.user.studentId) setStudentId(data.user.studentId);

          // Real enrolled internships
          if (Array.isArray(data.internships)) {
            setEnrolledInternships(data.internships);
          }

          // Real purchased PDFs
          if (Array.isArray(data.user.purchasedPDFs) && data.user.purchasedPDFs.length > 0) {
            setPurchasedList(data.user.purchasedPDFs);
          } else {
            setPurchasedList([]);
          }

          // Real orders
          if (Array.isArray(data.orders)) {
            setOrdersList(data.orders);
            const passOrder = data.orders.find(
              (o: any) => o.orderType === 'ALL_ACCESS_PASS' && (o.status === 'SUCCESS' || o.status === 'PAID')
            );
            if (passOrder) {
              setHasActivePass(true);
              setPassDaysRemaining(365);
            }
          }

          // Pass expiration check from user model
          if (data.user.passExpiresAt) {
            const exp = new Date(data.user.passExpiresAt).getTime();
            const now = Date.now();
            if (exp > now) {
              setHasActivePass(true);
              const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
              setPassDaysRemaining(days);
            }
          }
        } else {
          // Fallback to localStorage saved student information
          const savedPhone = localStorage.getItem('studyfreepdf_user_phone') || localStorage.getItem('exampustak_user_phone');
          const savedEmail = localStorage.getItem('studyfreepdf_user_email') || localStorage.getItem('exampustak_user_email');
          const savedName = localStorage.getItem('studyfreepdf_user_name') || localStorage.getItem('exampustak_user_name');
          const savedId = localStorage.getItem('studyfreepdf_user_student_id');

          if (savedPhone || savedEmail) {
            if (savedName) setUserName(savedName);
            if (savedPhone) setUserPhone(savedPhone);
            if (savedEmail) setUserEmail(savedEmail);
            if (savedId) setStudentId(savedId);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
          setPurchasedList([]);
          setOrdersList([]);
        }
      } catch (err) {
        console.warn('Dashboard session initialization note:', err);
        setPurchasedList([]);
      } finally {
        setIsLoadingAuth(false);
      }

      // Load persistent bookmarks from localStorage
      try {
        const savedBms = localStorage.getItem('studyfreepdf_bookmarks');
        if (savedBms) {
          setBookmarks(JSON.parse(savedBms));
        } else {
          setBookmarks([]);
        }

        // Resume reading state
        const savedResume = localStorage.getItem('studyfreepdf_last_read');
        if (savedResume) {
          setLastReadNote(JSON.parse(savedResume));
        }

        // Saved download history
        const savedDownloads = localStorage.getItem('studyfreepdf_download_history');
        if (savedDownloads) {
          setDownloadHistory(JSON.parse(savedDownloads));
        }
      } catch {
        // Fallback
      }
    }

    initDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('studyfreepdf_token');
    localStorage.removeItem('studyfreepdf_user_phone');
    localStorage.removeItem('studyfreepdf_user_email');
    localStorage.removeItem('studyfreepdf_user_name');
    localStorage.removeItem('studyfreepdf_user_student_id');
    setIsAuthenticated(false);
    router.push('/login');
  };

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
      total: product.pageCount || (product as any).totalPages || 100,
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
      const phoneParam = userPhone || '+91 7544065425';
      const emailParam = userEmail || 'student@studyfreepdf.com';
      const downloadUrl = `/api/pdf/download/${encodeURIComponent(targetId)}?phone=${encodeURIComponent(phoneParam)}&email=${encodeURIComponent(emailParam)}`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Server returned an error generating your watermarked PDF');
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
      
      const newEntry = {
        id: `dl-${Date.now()}`,
        title: product.title,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        size: formatBytes(product.fileSize || 5242880),
      };
      const updatedHistory = [newEntry, ...downloadHistory.slice(0, 19)];
      setDownloadHistory(updatedHistory);
      localStorage.setItem('studyfreepdf_download_history', JSON.stringify(updatedHistory));

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
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#00A389] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>My Student Study Room &amp; Digital Vault</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {userName}!
            </h1>
            {studentId && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student ID: {studentId}</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Access your personalized, dynamically watermarked PDF notes, NEP-2020 internship milestones, real invoices, and tamper-proof DDIS certificates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
            {userPhone && (
              <span className="flex items-center gap-1 font-mono text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                {userPhone}
              </span>
            )}
            {userEmail && (
              <span className="font-mono text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                {userEmail}
              </span>
            )}
          </div>
        </div>

        {/* Right Action: Pass Status or Upgrade CTA */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          {hasActivePass ? (
            <div className="bg-gradient-to-r from-[#00A389]/20 to-blue-500/20 rounded-2xl p-4 border border-[#00A389]/30 text-xs space-y-2 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <span className="font-extrabold text-[#00A389] uppercase text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> StudyFree PDF Pass Active
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {passDaysRemaining > 0 ? `${passDaysRemaining} Days Remaining` : 'Active'}
                </span>
              </div>
              <div className="text-slate-300 font-mono text-[11px]">Unlimited Downloads Enabled ✓</div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/30 text-xs space-y-2 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <span className="font-extrabold text-amber-400 uppercase text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Standard Account
                </span>
                <Link
                  href="/checkout?plan=ANNUAL_PASS"
                  className="text-[10px] bg-[#00A389] hover:bg-[#008f77] text-white font-black px-2.5 py-1 rounded-lg shadow-sm transition-all"
                >
                  Get All-Access Pass @ ₹199
                </Link>
              </div>
              <p className="text-slate-400 text-[11px]">Single notes available from ₹49 per subject.</p>
            </div>
          )}

          {/* Sign Out / Switch User Action */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Notice if unauthenticated */}
      {!isLoadingAuth && !isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-900 uppercase tracking-wide">
                You are currently browsing as a guest
              </div>
              <div className="text-xs text-amber-700">
                Sign in with your Student ID, phone or email to sync your purchased PDFs, college internship progress, and verified certificates.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login?redirect=/dashboard"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl border border-amber-300 hover:bg-amber-100/70 text-amber-900 font-bold text-xs transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

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
              const matched = purchasedList.find((p) => p.slug === lastReadNote.slug) || {
                slug: lastReadNote.slug,
                title: lastReadNote.title,
                pageCount: lastReadNote.total,
              };
              setSelectedPreview(matched);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <span>Resume Page {lastReadNote.page}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('MATERIALS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'MATERIALS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Study Materials ({purchasedList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INTERNSHIPS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'INTERNSHIPS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
          <span>My Internships &amp; Milestones ({enrolledInternships.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ORDERS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-amber-500" />
          <span>My Orders &amp; Invoices ({ordersList.length})</span>
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
          <span>Download History ({downloadHistory.length})</span>
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
            Watermarked ✓
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

          {isLoadingAuth ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Loader2 className="w-8 h-8 text-[#00A389] animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">Loading your licensed study vault...</p>
            </div>
          ) : purchasedList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-800">No Study Materials In Your Vault Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You haven&apos;t purchased any individual PDF notes or the Annual Pass yet. Every purchase grants lifetime access with your unique dynamic anti-piracy license.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/explore"
                  className="px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Exam Notes (₹49)</span>
                </Link>
                <Link
                  href="/checkout?plan=ANNUAL_PASS"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Annual Pass @ ₹199</span>
                </Link>
              </div>
            </div>
          ) : (
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
                          {product.subject?.boardOrExam?.code || product.examNodeId?.name || 'BOARD'}
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

                      <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Syllabus: 2026-27 Aligned • Verified by Toppers</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                        <div>
                          <span className="text-slate-400">Pages:</span> <strong>{product.totalPages || product.pageCount || 96} Pgs</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Medium:</span> <strong>{product.medium || 'Hindi & English'}</strong>
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
          )}
        </div>
      )}

      {/* Tab 2: Enrolled Internships & Assignments Workspace */}
      {activeTab === 'INTERNSHIPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>My NEP-2020 Internships &amp; Weekly Assignments ({enrolledInternships.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accredited Virtual College Internships under Digital Developer Infinity Solution (DDIS).
              </p>
            </div>
            <Link
              href="/internships"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Enroll in Another Track <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enrolledInternships.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-800">No Enrolled Internships Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enroll in a 4-week or 8-week virtual internship track across Science, Commerce, Arts, or BCA/IT to fulfill mandatory UGC/NEP-2020 college credits and earn a verified DDIS certificate.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/internships"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Explore All 18 NEP-2020 Tracks</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledInternships.map((internship) => {
                const totalWeeks = internship.trackId?.durationWeeks || 4;
                const approvedCount = internship.submissions?.filter((s) => s.status === 'APPROVED')?.length || 0;
                const isCompleted = internship.status === 'COMPLETED' || approvedCount >= totalWeeks;

                return (
                  <div
                    key={internship._id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 hover:border-blue-500 hover:shadow-xl transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {internship.trackId?.stream || 'NEP-2020'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCompleted ? '✓ Completed' : 'In Progress'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {internship.trackId?.title || 'NEP-2020 Industry Internship'}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>College: <strong>{internship.collegeName}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          <span>Roll / Degree: <strong>{internship.rollNumber} • {internship.degreeProgram}</strong></span>
                        </div>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="space-y-1 pt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Milestone Progress:</span>
                          <span className="text-blue-600">{approvedCount} of {totalWeeks} Weeks Approved</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (approvedCount / totalWeeks) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <Link
                        href={`/dashboard/internship/${internship._id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Open Task Workspace &amp; Submit Assignments</span>
                      </Link>

                      {isCompleted ? (
                        <a
                          href={`/api/internship/generate-certificate?internshipId=${internship._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Download Verified DDIS Certificate &amp; Viva Dossier</span>
                        </a>
                      ) : (
                        <div className="text-[11px] text-center text-slate-400 font-medium">
                          Certificate unlocks upon approval of all {totalWeeks} weekly milestones.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Orders & Invoices */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00A389]" />
                <span>My Purchase Orders &amp; Invoices</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All single note purchases and annual pass subscriptions with cryptographic payment receipts.
              </p>
            </div>
            <Link
              href="/checkout?plan=ANNUAL_PASS"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Purchase Annual Pass (₹199)</span>
            </Link>
          </div>

          {ordersList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-3">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Orders Found</div>
              <p className="max-w-sm mx-auto text-slate-500">
                You haven&apos;t placed any orders yet. When you complete a purchase via UPI or Cards, your official order receipt and download entitlements will appear here.
              </p>
              <Link
                href="/explore"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#00A389] text-white font-bold text-xs"
              >
                Browse Study Notes
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Item / Plan</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Receipt / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ordersList.map((order) => {
                    const isSuccess = order.status === 'SUCCESS';
                    return (
                      <tr key={order._id || order.id || order.orderNumber}>
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 font-medium">
                          {order.orderType === 'ALL_ACCESS_PASS' ? (
                            <span className="text-amber-700 font-bold">Annual All-Access Pass (365 Days)</span>
                          ) : (
                            <span>{order.pdfProductId?.title || 'Single PDF Study Note'}</span>
                          )}
                        </td>
                        <td className="py-3 text-slate-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          {formatINR(order.amount || 49)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isSuccess
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/order/${order.orderNumber}`}
                            className="text-[#00A389] hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <span>View Invoice</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Bookmarks */}
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
                        const matched = purchasedList.find((p) => p.slug === bm.slug) || {
                          slug: bm.slug,
                          title: bm.title,
                          pageCount: 100,
                        };
                        setSelectedPreview(matched);
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

      {/* Tab 5: Downloads History */}
      {activeTab === 'DOWNLOADS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Recent PDF Downloads &amp; Dynamic Watermark Logs ({downloadHistory.length})</span>
          </h2>

          {downloadHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Download className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Download Logs in This Session</div>
              <p className="max-w-sm mx-auto text-slate-500">
                When you download your watermarked PDF study materials, each file will be recorded here with its personal anti-piracy license timestamp.
              </p>
            </div>
          ) : (
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
                  {downloadHistory.map((d, i) => (
                    <tr key={d.id || i}>
                      <td className="py-3 font-semibold">{d.title}</td>
                      <td className="py-3 text-slate-500">{d.time}</td>
                      <td className="py-3 text-slate-500">{d.size}</td>
                      <td className="py-3 text-emerald-700 font-mono text-[10px]">
                        Stamped: {userPhone || studentId || 'Registered User'} ✓
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
