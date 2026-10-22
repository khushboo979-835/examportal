'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  AlertCircle,
  Check,
  X,
  FileText,
  Search,
  Loader2,
  Send,
  Building,
  User,
  Hash
} from 'lucide-react';

interface Submission {
  weekNumber: number;
  submissionUrl: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  mentorFeedback?: string;
}

interface StudentInternship {
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
  submissions: Submission[];
  trackId: {
    _id: string;
    title: string;
    stream: string;
    durationWeeks: number;
  };
}

interface Stats {
  totalEnrolled: number;
  reviewPending: number;
  completed: number;
  certificatesIssued: number;
}

export default function AdminInternshipEvaluationPage() {
  const [internships, setInternships] = useState<StudentInternship[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEnrolled: 0,
    reviewPending: 0,
    completed: 0,
    certificatesIssued: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'REVIEW_PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeFeedbackModal, setActiveFeedbackModal] = useState<{
    internshipId: string;
    weekNumber: number;
    action: 'APPROVE_TASK' | 'REJECT_TASK';
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchInternships = async () => {
    try {
      const res = await fetch(`/api/admin/internships?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setInternships(data.internships || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin internship data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInternships();
  }, [statusFilter]);

  const handleTaskAction = async (internshipId: string, weekNumber: number, action: 'APPROVE_TASK' | 'REJECT_TASK', feedback?: string) => {
    setActionLoadingId(`${internshipId}-${weekNumber}`);
    try {
      const res = await fetch('/api/admin/internships', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId,
          weekNumber,
          action,
          feedback: feedback || (action === 'APPROVE_TASK' ? 'Excellent deliverable. Approved by DDIS Mentor.' : 'Changes requested. Please update project.'),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Action failed');
      }

      await fetchInternships();
      setActiveFeedbackModal(null);
      setFeedbackText('');
    } catch (err: any) {
      alert(err.message || 'Error updating task status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleForceIssueCertificate = async (internshipId: string) => {
    if (!confirm('Issue official DDIS Certificate & 2-page project report immediately for this student?')) return;
    setActionLoadingId(`cert-${internshipId}`);
    try {
      const res = await fetch('/api/admin/internships', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId,
          action: 'ISSUE_CERTIFICATE',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to issue certificate');
      }

      alert(`Official Certificate Issued! ID: ${data.certificateId}`);
      await fetchInternships();
    } catch (err: any) {
      alert(err.message || 'Certificate issuance failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredInternships = internships.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(q) ||
      item.collegeName?.toLowerCase().includes(q) ||
      item.rollNumber?.toLowerCase().includes(q) ||
      item.certificateId?.toLowerCase().includes(q) ||
      item.trackId?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Title & Subhead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>NEP-2020 Accreditation Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Undergraduate Internship Evaluation Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review student GitHub/Drive submissions, approve milestone deliveries, and issue verified DDIS certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/verify"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Public Verifier</span>
            </Link>
          </div>
        </div>

        {/* 1. Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="text-xs text-slate-400 font-medium">Total Enrolled</div>
            <div className="text-2xl font-black text-white mt-1">{stats.totalEnrolled}</div>
            <div className="text-[10px] text-slate-400 mt-1">Across all 5 streams</div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="text-xs text-amber-400 font-medium">Review Pending</div>
            <div className="text-2xl font-black text-amber-300 mt-1">{stats.reviewPending}</div>
            <div className="text-[10px] text-slate-400 mt-1">Milestones awaiting review</div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="text-xs text-emerald-400 font-medium">Completed Internships</div>
            <div className="text-2xl font-black text-emerald-300 mt-1">{stats.completed}</div>
            <div className="text-[10px] text-slate-400 mt-1">All 4 weeks verified</div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="text-xs text-blue-400 font-medium">DDIS Certificates Issued</div>
            <div className="text-2xl font-black text-blue-300 mt-1">{stats.certificatesIssued}</div>
            <div className="text-[10px] text-slate-400 mt-1">Live with QR Verification</div>
          </div>
        </div>

        {/* 2. Filters & Search Bar */}
        <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['ALL', 'REVIEW_PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st === 'ALL' ? 'All Internships' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, college, or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3. Submissions Table */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading student internship records...</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No internship records found matching criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/70">
              {filteredInternships.map((internship) => {
                const totalWeeks = internship.trackId?.durationWeeks || 4;
                const approvedCount = internship.submissions?.filter((s) => s.status === 'APPROVED').length || 0;

                return (
                  <div key={internship._id} className="p-5 sm:p-6 space-y-4 hover:bg-slate-800/50 transition-colors">
                    {/* Top Row: Student & Track Info */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-white">
                            {internship.studentName}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {internship.trackId?.stream || 'IT'}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            internship.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : internship.status === 'REVIEW_PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}>
                            {internship.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-bold">
                          {internship.trackId?.title}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            {internship.collegeName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5 text-slate-500" />
                            {internship.rollNumber} • {internship.degreeProgram}
                          </span>
                          {internship.studentPhone && (
                            <span>Ph: {internship.studentPhone}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Certificate Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {internship.certificateId ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={`/api/internship/generate-certificate?id=${internship.certificateId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>View Certificate ({internship.certificateId})</span>
                            </a>
                            <Link
                              href={`/verify/${internship.certificateId}`}
                              target="_blank"
                              className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300"
                              title="Public Verification"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleForceIssueCertificate(internship._id)}
                            disabled={actionLoadingId === `cert-${internship._id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            {actionLoadingId === `cert-${internship._id}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Award className="w-3.5 h-3.5" />
                            )}
                            <span>Issue DDIS Certificate</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Milestones Submissions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-700/60">
                      {Array.from({ length: totalWeeks }).map((_, idx) => {
                        const weekNum = idx + 1;
                        const sub = internship.submissions?.find((s) => s.weekNumber === weekNum);
                        const isApproved = sub?.status === 'APPROVED';
                        const isSubmitted = sub?.status === 'SUBMITTED';
                        const isRejected = sub?.status === 'REJECTED';

                        return (
                          <div
                            key={weekNum}
                            className={`p-3 rounded-2xl border text-xs space-y-2 flex flex-col justify-between ${
                              isApproved
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : isSubmitted
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : isRejected
                                ? 'bg-rose-950/20 border-rose-500/40'
                                : 'bg-slate-900/60 border-slate-700/60'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-white text-[11px]">
                                  Week {weekNum} Deliverable
                                </span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  isApproved
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : isSubmitted
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : isRejected
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {isApproved ? 'Approved' : isSubmitted ? 'Pending Review' : isRejected ? 'Changes' : 'Not Sent'}
                                </span>
                              </div>

                              {sub?.submissionUrl ? (
                                <a
                                  href={sub.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-mono break-all truncate block"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{sub.submissionUrl}</span>
                                </a>
                              ) : (
                                <div className="text-[10px] text-slate-500 italic">No artifact submitted</div>
                              )}
                            </div>

                            {/* Review Actions */}
                            {sub?.submissionUrl && (
                              <div className="pt-2 border-t border-slate-700/50 flex items-center gap-1.5">
                                {!isApproved ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={actionLoadingId === `${internship._id}-${weekNum}`}
                                      onClick={() => handleTaskAction(internship._id, weekNum, 'APPROVE_TASK')}
                                      className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] flex items-center justify-center gap-1 transition-colors"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveFeedbackModal({
                                          internshipId: internship._id,
                                          weekNumber: weekNum,
                                          action: 'REJECT_TASK',
                                        });
                                        setFeedbackText('Please re-check component imports and include unit tests in GitHub README.');
                                      }}
                                      className="py-1 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-rose-300 font-extrabold text-[10px] transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verified by Mentor</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Feedback Modal */}
        {activeFeedbackModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-white">
                Request Changes for Week {activeFeedbackModal.weekNumber}
              </h3>
              <p className="text-xs text-slate-400">
                Provide specific guidance so the student can update their project and resubmit.
              </p>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter feedback for student..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleTaskAction(
                      activeFeedbackModal.internshipId,
                      activeFeedbackModal.weekNumber,
                      activeFeedbackModal.action,
                      feedbackText
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Submit Changes Request
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
