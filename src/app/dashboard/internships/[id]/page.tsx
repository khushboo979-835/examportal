'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  AlertCircle,
  FileText,
  Download,
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

interface Milestone {
  weekNumber: number;
  title: string;
  taskDescription: string;
  resourceMaterialUrl?: string;
  submissionType: string;
}

interface InternshipData {
  _id: string;
  studentName: string;
  collegeName: string;
  rollNumber: string;
  degreeProgram: string;
  status: string;
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
    shortDescription: string;
    milestones: Milestone[];
  };
}

export default function StudentTaskDashboard() {
  const params = useParams();
  const id = params?.id as string;

  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Accordion state: set of expanded week numbers
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({ 1: true });
  // Inputs for submissions
  const [submissionUrls, setSubmissionUrls] = useState<{ [key: number]: string }>({});
  const [isSubmittingWeek, setIsSubmittingWeek] = useState<{ [key: number]: boolean }>({});
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/internship/student/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load internship record');
        }
        setInternship(data.internship);

        // Pre-fill submission urls if already submitted
        const initialUrls: { [key: number]: string } = {};
        data.internship.submissions?.forEach((s: Submission) => {
          initialUrls[s.weekNumber] = s.submissionUrl;
        });
        setSubmissionUrls(initialUrls);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleTaskSubmit = async (weekNumber: number) => {
    const url = submissionUrls[weekNumber];
    if (!url || !url.trim()) return;

    setIsSubmittingWeek((prev) => ({ ...prev, [weekNumber]: true }));
    setSubmissionSuccessMsg((prev) => ({ ...prev, [weekNumber]: '' }));

    try {
      const res = await fetch('/api/internship/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId: id,
          weekNumber,
          submissionUrl: url.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmissionSuccessMsg((prev) => ({
        ...prev,
        [weekNumber]: 'Task submitted successfully! Mentor evaluation in progress.',
      }));

      // Refresh local internship submissions
      setInternship((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: data.submissions,
          status: data.status,
        };
      });
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setIsSubmittingWeek((prev) => ({ ...prev, [weekNumber]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-[#00A389] animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading your NEP-2020 internship workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Internship Record Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'Could not locate your enrollment details.'}</p>
          <Link
            href="/internships"
            className="inline-block py-2.5 px-6 rounded-xl bg-[#00A389] text-white font-extrabold text-xs shadow-md"
          >
            Browse Available Internships
          </Link>
        </div>
      </div>
    );
  }

  const milestones = internship.trackId?.milestones || [];
  const totalWeeks = internship.trackId?.durationWeeks || 4;
  const approvedCount = internship.submissions?.filter((s) => s.status === 'APPROVED').length || 0;
  const progressPercent = Math.round((approvedCount / totalWeeks) * 100);
  const isAllCompleted = approvedCount >= totalWeeks || internship.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Header Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NEP-2020 Accredited • DDIS Certified
            </span>
            <Link
              href="/internships"
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              Browse Other Tracks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {internship.trackId?.title}
          </h1>

          {/* Student Profile Card in Header */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <User className="w-4 h-4 text-[#00A389]" />
              <span>{internship.studentName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{internship.collegeName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-slate-400" />
              <span>{internship.rollNumber} • {internship.degreeProgram}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">
        
        {/* Progress & Status Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Progress
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                Milestone {approvedCount} of {totalWeeks} Completed
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
                isAllCompleted 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isAllCompleted ? '✅ ALL TASKS APPROVED' : '⚡ IN PROGRESS'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-[#00A389] to-[#1A73E8] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>Week 1</span>
              <span>{progressPercent}% Complete</span>
              <span>Week {totalWeeks}</span>
            </div>
          </div>
        </div>

        {/* 3. Certificate Unlock Banner (When Completed) */}
        {isAllCompleted && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black text-amber-300">
                <Award className="w-4 h-4 text-amber-300" />
                <span>OFFICIAL ACCREDITED CREDENTIAL ISSUED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Congratulations, {internship.studentName}!
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                You have fulfilled all {totalWeeks} weekly industry milestones under Digital Developer Infinity Solution (DDIS). Your verified NEP-2020 certificate and 2-page college project dossier are ready.
              </p>
              {internship.certificateId && (
                <div className="text-xs font-mono bg-black/20 px-3 py-1.5 rounded-lg inline-block border border-white/20">
                  Certificate ID: <strong className="text-white">{internship.certificateId}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
              <a
                href={`/api/internship/generate-certificate?id=${internship.certificateId || 'DDIS-NEP-2026-IT-9482'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[#00A389]" />
                <span>Download DDIS Certificate & Report</span>
              </a>

              {internship.certificateId && (
                <Link
                  href={`/verify/${internship.certificateId}`}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all text-center"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Verify Credential Online</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 4. Week-by-Week Accordion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00A389]" />
              Weekly Milestone Deliverables
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Submit your GitHub / Drive artifact for mentor review
            </span>
          </div>

          {milestones.map((milestone) => {
            const isExpanded = !!expandedWeeks[milestone.weekNumber];
            const submission = internship.submissions?.find(
              (s) => s.weekNumber === milestone.weekNumber
            );
            const status = submission?.status || 'PENDING';

            return (
              <div
                key={milestone.weekNumber}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleWeek(milestone.weekNumber)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      status === 'APPROVED'
                        ? 'bg-emerald-100 text-[#00A389]'
                        : status === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      W{milestone.weekNumber}
                    </div>

                    <div>
                      <div className="text-xs font-black text-slate-900 sm:text-sm">
                        Week {milestone.weekNumber}: {milestone.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Deliverable Type: {milestone.submissionType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge */}
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      status === 'APPROVED'
                        ? 'bg-emerald-50 text-[#00A389] border-emerald-200'
                        : status === 'SUBMITTED'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {status === 'APPROVED' ? 'Approved' : status === 'SUBMITTED' ? 'Under Review' : status === 'REJECTED' ? 'Changes Needed' : 'Pending'}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 space-y-4 border-t border-slate-100">
                    {/* Problem Statement Box */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Assigned Industry Problem Statement
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {milestone.taskDescription}
                      </p>

                      {milestone.resourceMaterialUrl && (
                        <div className="pt-1">
                          <a
                            href={milestone.resourceMaterialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1A73E8] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Reference Specification & Dataset
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Mentor Feedback (if present) */}
                    {submission?.mentorFeedback && (
                      <div className={`p-3.5 rounded-2xl border text-xs ${
                        status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>DDIS Mentor Evaluation Note:</span>
                        </div>
                        <p>{submission.mentorFeedback}</p>
                      </div>
                    )}

                    {/* Submission Success Notice */}
                    {submissionSuccessMsg[milestone.weekNumber] && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
                        {submissionSuccessMsg[milestone.weekNumber]}
                      </div>
                    )}

                    {/* Submission Input Box */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {milestone.submissionType === 'GITHUB' ? 'GitHub Repository URL' : 'Project Artifact URL (Drive / Live Deployment)'}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          placeholder={
                            milestone.submissionType === 'GITHUB'
                              ? 'https://github.com/your-username/project-repo'
                              : 'https://drive.google.com/file/d/...'
                          }
                          value={submissionUrls[milestone.weekNumber] || ''}
                          onChange={(e) =>
                            setSubmissionUrls((prev) => ({
                              ...prev,
                              [milestone.weekNumber]: e.target.value,
                            }))
                          }
                          disabled={status === 'APPROVED'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                        />

                        {status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleTaskSubmit(milestone.weekNumber)}
                            disabled={isSubmittingWeek[milestone.weekNumber] || !submissionUrls[milestone.weekNumber]}
                            className="px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008f78] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
                          >
                            {isSubmittingWeek[milestone.weekNumber] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{status === 'SUBMITTED' ? 'Re-Submit Task' : 'Submit Task'}</span>
                          </button>
                        )}
                      </div>

                      {status === 'APPROVED' && (
                        <div className="text-[11px] text-[#00A389] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>This milestone has been verified and permanently locked by your industry mentor.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
