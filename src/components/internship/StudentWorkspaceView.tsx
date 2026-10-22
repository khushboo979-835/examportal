'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Hash,
  Copy,
  Check,
  Share2,
  Sparkles,
  Globe,
  Github,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Submission {
  weekNumber: number;
  submissionUrl?: string;
  hostedLink?: string;
  driveLink?: string;
  submittedAt?: string;
  status: 'NOT_STARTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISIONS_REQUIRED' | 'REJECTED' | 'APPROVED';
  mentorFeedback?: string;
}

interface Milestone {
  weekNumber: number;
  title: string;
  theoryOverview?: string;
  taskDescription: string;
  resourceMaterialUrl?: string;
  submissionType: string;
  estimatedHours?: number;
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
    faculty?: string;
    durationWeeks: number;
    nepCurriculumHours?: number;
    shortDescription: string;
    milestones: Milestone[];
  };
}

interface StudentWorkspaceViewProps {
  internshipId: string;
}

export default function StudentWorkspaceView({ internshipId }: StudentWorkspaceViewProps) {
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Accordion state: set of expanded week numbers
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({ 1: true });

  // Inputs for submissions (github, hosted, drive)
  const [inputs, setInputs] = useState<{
    [key: number]: {
      submissionUrl: string;
      hostedLink: string;
      driveLink: string;
    };
  }>({});

  const [isSubmittingWeek, setIsSubmittingWeek] = useState<{ [key: number]: boolean }>({});
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<{ [key: number]: string }>({});
  const [isClaimingCert, setIsClaimingCert] = useState(false);
  const [copiedCertId, setCopiedCertId] = useState(false);

  // Trigger celebratory confetti
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/internship/student/${internshipId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load internship record');
        }
        setInternship(data.internship);

        // Pre-fill input states
        const initialInputs: any = {};
        data.internship.submissions?.forEach((s: Submission) => {
          initialInputs[s.weekNumber] = {
            submissionUrl: s.submissionUrl || '',
            hostedLink: s.hostedLink || '',
            driveLink: s.driveLink || '',
          };
        });
        setInputs(initialInputs);

        // If completed or certificate issued, fire confetti once
        if (data.internship.isCompleted || data.internship.certificateIssued) {
          setTimeout(fireConfetti, 500);
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (internshipId) {
      loadData();
    }
  }, [internshipId]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleInputChange = (weekNumber: number, field: string, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [weekNumber]: {
        ...(prev[weekNumber] || { submissionUrl: '', hostedLink: '', driveLink: '' }),
        [field]: val,
      },
    }));
  };

  const handleTaskSubmit = async (weekNumber: number) => {
    const weekInput = inputs[weekNumber] || { submissionUrl: '', hostedLink: '', driveLink: '' };
    const primaryUrl = weekInput.submissionUrl || weekInput.hostedLink || weekInput.driveLink;

    if (!primaryUrl || !primaryUrl.trim()) {
      alert('Please enter at least one valid submission link (GitHub, Live URL, or Drive).');
      return;
    }

    setIsSubmittingWeek((prev) => ({ ...prev, [weekNumber]: true }));
    setSubmissionSuccessMsg((prev) => ({ ...prev, [weekNumber]: '' }));

    try {
      const res = await fetch('/api/internship/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId,
          weekNumber,
          submissionUrl: weekInput.submissionUrl?.trim() || primaryUrl.trim(),
          hostedLink: weekInput.hostedLink?.trim(),
          driveLink: weekInput.driveLink?.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmissionSuccessMsg((prev) => ({
        ...prev,
        [weekNumber]: 'Milestone artifact submitted! Mentor evaluation in progress.',
      }));

      // Update state
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

  const handleClaimCertificate = async () => {
    setIsClaimingCert(true);
    try {
      const res = await fetch('/api/internship/claim-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to claim certificate');
      }

      setInternship((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'COMPLETED',
          certificateIssued: true,
          certificateId: data.certificateId,
        };
      });

      fireConfetti();
    } catch (err: any) {
      alert(err.message || 'Error claiming certificate');
    } finally {
      setIsClaimingCert(false);
    }
  };

  const copyCertId = () => {
    if (!internship?.certificateId) return;
    navigator.clipboard.writeText(internship.certificateId);
    setCopiedCertId(true);
    setTimeout(() => setCopiedCertId(false), 2000);
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
  const submittedCount = internship.submissions?.filter((s) => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW' || s.status === 'APPROVED').length || 0;
  const progressPercent = Math.round((approvedCount / totalWeeks) * 100);
  const isAllApproved = approvedCount >= totalWeeks || internship.status === 'COMPLETED';
  const canClaim = isAllApproved || submittedCount >= totalWeeks;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Header Hero Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                NEP-2020 Mandatory 75-Hour Undergraduate Internship
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                DDIS Accredited
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/internships"
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                All Tracks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {internship.trackId?.title}
          </h1>

          {/* Student Profile Card in Header */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <User className="w-4 h-4 text-[#00A389]" />
              <span>{internship.studentName || 'Student Intern'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{internship.collegeName}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Hash className="w-4 h-4 text-slate-400" />
              <span>{internship.rollNumber} • {internship.degreeProgram}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Workspace Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">
        
        {/* Progress & Status Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Workload Progression (75 Credit Hours)
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {approvedCount} of {totalWeeks} Milestones Approved ({progressPercent}%)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
                internship.certificateIssued || isAllApproved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : submittedCount > approvedCount
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {internship.certificateIssued || isAllApproved
                  ? '✅ ALL TASKS APPROVED'
                  : submittedCount > approvedCount
                  ? '⏳ MENTOR REVIEW PENDING'
                  : '⚡ IN PROGRESS'}
              </span>

              {/* Dynamic Claim Trigger if eligible and not yet issued */}
              {!internship.certificateIssued && canClaim && (
                <button
                  type="button"
                  onClick={handleClaimCertificate}
                  disabled={isClaimingCert}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95 animate-pulse"
                >
                  {isClaimingCert ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Claim Official DDIS Certificate</span>
                </button>
              )}
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-[#00A389] to-[#1A73E8] h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>Week 1: Fundamentals</span>
              <span>Week 2: Engineering</span>
              <span>Week 3: Deep Dive</span>
              <span>Week 4: Capstone Dossier</span>
            </div>
          </div>
        </div>

        {/* 3. Certificate Celebration Banner (When Completed or Claimed) */}
        {(internship.certificateIssued || isAllApproved) && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-emerald-500/30 animate-in fade-in duration-500">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black text-amber-300">
                <Award className="w-4 h-4 text-amber-300" />
                <span>OFFICIAL NEP-2020 ACCREDITED CREDENTIAL ISSUED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Congratulations, {internship.studentName}!
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                You have fulfilled all {totalWeeks} weekly industry milestones under Digital Developer Infinity Solution (DDIS). Your verified NEP-2020 certificate and 2-page college project viva dossier are permanently archived.
              </p>
              
              {internship.certificateId && (
                <div className="pt-1 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                  <div className="text-xs font-mono bg-black/30 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                    <span>ID: <strong className="text-white">{internship.certificateId}</strong></span>
                    <button
                      type="button"
                      onClick={copyCertId}
                      className="text-slate-300 hover:text-white transition-colors"
                      title="Copy Certificate ID"
                    >
                      {copiedCertId ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-200">
                    • 75 Hours UGC/NEP-2020 Credit Aligned
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <a
                href={`/api/internship/generate-certificate?id=${internship.certificateId || 'DDIS-NEP-2026-IT-9482'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[#00A389]" />
                <span>Download 2-Page PDF Dossier</span>
              </a>

              {internship.certificateId && (
                <Link
                  href={`/verify/${internship.certificateId}`}
                  className="w-full px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all text-center"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Public Verification Link</span>
                </Link>
              )}

              <button
                type="button"
                onClick={fireConfetti}
                className="w-full px-4 py-2 rounded-2xl bg-black/20 hover:bg-black/30 text-emerald-200 font-semibold text-[11px] flex items-center justify-center gap-1 border border-white/10 transition-all"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Celebrate Achievement 🎉</span>
              </button>
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
              Submit your GitHub, Live Deployment, or Drive artifact
            </span>
          </div>

          {milestones.map((milestone) => {
            const isExpanded = !!expandedWeeks[milestone.weekNumber];
            const submission = internship.submissions?.find(
              (s) => s.weekNumber === milestone.weekNumber
            );
            const status = submission?.status || 'NOT_STARTED';
            const weekInput = inputs[milestone.weekNumber] || {
              submissionUrl: submission?.submissionUrl || '',
              hostedLink: submission?.hostedLink || '',
              driveLink: submission?.driveLink || '',
            };

            return (
              <div
                key={milestone.weekNumber}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleWeek(milestone.weekNumber)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      status === 'APPROVED'
                        ? 'bg-emerald-100 text-[#00A389]'
                        : status === 'SUBMITTED' || status === 'UNDER_REVIEW'
                        ? 'bg-amber-100 text-amber-700'
                        : status === 'REJECTED' || status === 'REVISIONS_REQUIRED'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      W{milestone.weekNumber}
                    </div>

                    <div>
                      <div className="text-xs font-black text-slate-900 sm:text-sm">
                        Week {milestone.weekNumber}: {milestone.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Deliverable: {milestone.submissionType} • ~{milestone.estimatedHours || 18} Credit Hours
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge */}
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      status === 'APPROVED'
                        ? 'bg-emerald-50 text-[#00A389] border-emerald-200'
                        : status === 'SUBMITTED' || status === 'UNDER_REVIEW'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : status === 'REJECTED' || status === 'REVISIONS_REQUIRED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {status === 'APPROVED'
                        ? 'Approved'
                        : status === 'SUBMITTED' || status === 'UNDER_REVIEW'
                        ? 'Under Review'
                        : status === 'REJECTED' || status === 'REVISIONS_REQUIRED'
                        ? 'Changes Needed'
                        : 'Not Started'}
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
                    
                    {/* Theory Overview (if present) */}
                    {milestone.theoryOverview && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                        <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                          Curriculum Theory Overview
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {milestone.theoryOverview}
                        </p>
                      </div>
                    )}

                    {/* Problem Statement Box */}
                    <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-200/60 space-y-2">
                      <div className="text-[10px] font-extrabold uppercase text-[#00A389] tracking-wider">
                        Assigned Industry Deliverable Specification
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
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
                      <div className={`p-4 rounded-2xl border text-xs ${
                        status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-[#00A389]" />
                          <span>DDIS Mentor Evaluation Note:</span>
                        </div>
                        <p className="leading-relaxed">{submission.mentorFeedback}</p>
                      </div>
                    )}

                    {/* Submission Success Notice */}
                    {submissionSuccessMsg[milestone.weekNumber] && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#00A389] shrink-0" />
                        <span>{submissionSuccessMsg[milestone.weekNumber]}</span>
                      </div>
                    )}

                    {/* Submission Inputs Box */}
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold text-slate-700">
                        Submit Your Project Deliverables
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {/* 1. Primary GitHub URL */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Github className="w-4 h-4" />
                          </div>
                          <input
                            type="url"
                            placeholder="GitHub Repository URL (e.g. https://github.com/username/project)"
                            value={weekInput.submissionUrl || ''}
                            onChange={(e) => handleInputChange(milestone.weekNumber, 'submissionUrl', e.target.value)}
                            disabled={status === 'APPROVED'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                          />
                        </div>

                        {/* 2. Optional Live Deployment URL */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Globe className="w-4 h-4" />
                          </div>
                          <input
                            type="url"
                            placeholder="Live Deployment Link (Optional, e.g. https://my-project.vercel.app)"
                            value={weekInput.hostedLink || ''}
                            onChange={(e) => handleInputChange(milestone.weekNumber, 'hostedLink', e.target.value)}
                            disabled={status === 'APPROVED'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                          />
                        </div>

                        {/* 3. Optional Google Drive / Document Link */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <input
                            type="url"
                            placeholder="Drive / Dossier Document URL (Optional, e.g. https://drive.google.com/...)"
                            value={weekInput.driveLink || ''}
                            onChange={(e) => handleInputChange(milestone.weekNumber, 'driveLink', e.target.value)}
                            disabled={status === 'APPROVED'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                          />
                        </div>
                      </div>

                      {/* Action Button & Status Footnote */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                        {status !== 'APPROVED' ? (
                          <button
                            type="button"
                            onClick={() => handleTaskSubmit(milestone.weekNumber)}
                            disabled={isSubmittingWeek[milestone.weekNumber]}
                            className="px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008f78] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                          >
                            {isSubmittingWeek[milestone.weekNumber] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{status === 'SUBMITTED' || status === 'UNDER_REVIEW' ? 'Re-Submit Updated Deliverable' : 'Submit Milestone Deliverable'}</span>
                          </button>
                        ) : (
                          <div className="text-[11px] text-[#00A389] font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Milestone verified and permanently locked by your DDIS industry mentor.</span>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-400">
                          Evaluated against UGC & NEP-2020 practical rubrics
                        </span>
                      </div>
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
