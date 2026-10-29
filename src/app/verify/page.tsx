'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Award,
  ExternalLink,
  Building,
  GraduationCap,
  FileText,
  Calendar,
  AlertCircle,
  Loader2,
  Share2
} from 'lucide-react';

export default function CertificateVerificationPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedCert, setSearchedCert] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToLookup = certInput.trim();
    if (!idToLookup) return;

    setLoading(true);
    setErrorMsg('');
    setSearchedCert(null);

    try {
      const res = await fetch(`/api/internship/verify/${encodeURIComponent(idToLookup)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No verified credential found for this ID.');
      }
      setSearchedCert(data.certificate);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLookup = (sampleId: string) => {
    setCertInput(sampleId);
    setLoading(true);
    setErrorMsg('');
    setSearchedCert(null);

    fetch(`/api/internship/verify/${encodeURIComponent(sampleId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSearchedCert(data.certificate);
        } else {
          setErrorMsg(data.error || 'Credential not found');
        }
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Header Banner: Luminous Dribbble Light Theme */}
      <section className="bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#FFFFFF] text-slate-900 pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 text-center relative overflow-hidden">
        {/* Soft Ambient Mesh Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-r from-emerald-100/50 via-teal-100/40 to-amber-100/50 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-xs font-black text-emerald-800 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00A389]" />
            <span>Official University &amp; Employer Verification Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Verify DDIS Student Certificate
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Verify authenticity of National Education Policy (NEP-2020) undergraduate internship certificates issued by{' '}
            <strong className="text-slate-900 font-bold">Digital Developer Infinity Solution (DDIS)</strong> • <strong className="text-amber-600 font-black">&quot;Talent Aapka, Rasta Hamara&quot;</strong> (टैलेंट आपका, रास्ता हमारा).
          </p>

          {/* Search Box */}
          <form onSubmit={handleVerify} className="max-w-xl mx-auto pt-3 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. DDIS-NEP-2026-IT-9482)"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-semibold border-2 border-slate-200/90 shadow-lg shadow-slate-200/50 placeholder:text-slate-400 focus:outline-none focus:border-[#00A389]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !certInput.trim()}
              className="px-8 py-3.5 rounded-2xl bg-[#00A389] hover:bg-[#008f77] text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify Now</span>
            </button>
          </form>

          {/* Quick Demo Certificate Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span>Try sample IDs:</span>
            <button
              type="button"
              onClick={() => handleQuickLookup('DDIS-NEP-2026-IT-9482')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-mono text-xs border border-slate-200 shadow-xs transition-colors cursor-pointer font-bold"
            >
              DDIS-NEP-2026-IT-9482 (IT)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup('DDIS-NEP-2026-COM-8104')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 font-mono text-xs border border-slate-200 shadow-xs transition-colors cursor-pointer font-bold"
            >
              DDIS-NEP-2026-COM-8104 (Commerce)
            </button>
          </div>
        </div>
      </section>

      {/* 2. Verification Result Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">
        {errorMsg && (
          <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-lg text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Verification Result: Record Not Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{errorMsg}</p>
            <p className="text-[11px] text-slate-400">
              Please double check the certificate code or scan the QR code located at the bottom-left corner of the document.
            </p>
          </div>
        )}

        {searchedCert && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in">
            {/* Top Verified Header Strip */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-white">
                    Official Verified Credential
                  </div>
                  <h3 className="text-lg font-black mt-1">
                    Digital Developer Infinity Solution (DDIS)
                  </h3>
                  <div className="text-xs text-emerald-100 font-medium">
                    National Education Policy (NEP-2020) Accredited
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-400/30">
                  Status: {searchedCert.validityStatus || 'VALID'}
                </span>
                <div className="text-[11px] text-emerald-100 mt-1 font-mono">
                  ID: {searchedCert.certificateId}
                </div>
              </div>
            </div>

            {/* Verification Metadata Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Candidate Name
                    </span>
                    <div className="text-lg font-black text-slate-900">
                      {searchedCert.studentName}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      College / Institution
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{searchedCert.collegeName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Academic Degree / Stream
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{searchedCert.degreeProgram || searchedCert.stream}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:border-l sm:border-slate-100 sm:pl-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Internship Domain / Track
                    </span>
                    <div className="text-base font-black text-[#00A389]">
                      {searchedCert.trackTitle}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Duration & Evaluation Grade
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-0.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{searchedCert.durationWeeks || 4} Weeks • Grade: {searchedCert.grade || 'A+ (Distinction)'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Date of Issue & Accreditation
                    </span>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{new Date(searchedCert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={`/api/internship/generate-certificate?id=${searchedCert.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f78] hover:to-[#1558b3] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Verified Certificate & 2-Page Dossier (PDF)</span>
                </a>

                {/* 1-Click Add to LinkedIn Profile button */}
                <a
                  href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(searchedCert.trackTitle)}&organizationName=${encodeURIComponent('Digital Developer Infinity Solution')}&issueYear=${new Date(searchedCert.issueDate).getFullYear()}&issueMonth=${new Date(searchedCert.issueDate).getMonth() + 1}&certUrl=${encodeURIComponent(`https://studyfreepdf.com/verify/${searchedCert.certificateId}`)}&certId=${encodeURIComponent(searchedCert.certificateId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Add to LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 3. Information Strip for College Faculty */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00A389]" />
            Information for College Principals, HoDs & University Examiners
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Digital Developer Infinity Solution (DDIS) provides NEP-2020 aligned internship certifications with complete digital traceability. Each certificate features an immutable cryptographic ID and dynamic QR code resolving to this public verification portal. The accompanying 2-page project report details weekly problem statements and verified GitHub/Drive deliverables for viva examination.
          </p>
        </div>
      </div>
    </div>
  );
}
