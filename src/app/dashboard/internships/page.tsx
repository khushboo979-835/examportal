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
  PlusCircle,
  Loader2,
  Building,
  Hash
} from 'lucide-react';

export default function MyEnrolledInternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Query internships from admin endpoint or user query
        const res = await fetch('/api/admin/internships');
        const data = await res.json();
        if (data.success && data.internships) {
          setInternships(data.internships);
        }
      } catch (err) {
        console.error('Failed to load user internships:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              My Enrolled Internships
            </h1>
            <p className="text-xs text-slate-300">
              Manage your NEP-2020 weekly milestone submissions and download verified DDIS certificates.
            </p>
          </div>

          <Link
            href="/internships"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] text-white text-xs font-black shadow-md shadow-emerald-500/20 self-start sm:self-auto hover:opacity-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enroll New Track</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#00A389] animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading your enrolled internships...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Enrolled Internships Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Join a 4-week or 8-week accredited internship under Digital Developer Infinity Solution (DDIS) to satisfy your college NEP credits.
            </p>
            <Link
              href="/internships"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00A389] text-white font-extrabold text-xs shadow-md"
            >
              Browse Internship Tracks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((item) => {
              const approvedCount = item.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0;
              const totalWeeks = item.trackId?.durationWeeks || 4;
              const isDone = item.status === 'COMPLETED' || approvedCount >= totalWeeks;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.trackId?.stream || 'IT'}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {isDone ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {item.trackId?.title || 'NEP-2020 Internship Track'}
                    </h3>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.collegeName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.rollNumber} • {item.degreeProgram}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Milestones</span>
                        <span>{approvedCount} / {totalWeeks} Approved</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00A389] h-full rounded-full transition-all"
                          style={{ width: `${Math.round((approvedCount / totalWeeks) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <Link
                      href={`/dashboard/internships/${item._id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {item.certificateId && (
                      <a
                        href={`/api/internship/generate-certificate?id=${item.certificateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-50 text-[#00A389] hover:bg-emerald-100 font-extrabold text-xs flex items-center gap-1 transition-colors border border-emerald-200"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
