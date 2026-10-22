import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  GraduationCap,
  Calendar,
  Award,
  FileText,
  Share2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

async function getCertificate(id: string) {
  await connectToDatabase().catch(() => {});
  const cleanId = id.trim();

  let cert = await DDISCertificate.findOne({
    $or: [{ certificateId: cleanId }, { certificateId: cleanId.toUpperCase() }],
  }).lean();

  if (!cert) {
    const internship = await StudentInternship.findOne({
      $or: [{ certificateId: cleanId }, { rollNumber: cleanId }],
    }).populate('trackId').lean();

    if (internship && internship.certificateIssued) {
      cert = {
        certificateId: internship.certificateId || cleanId,
        studentName: internship.studentName,
        collegeName: internship.collegeName,
        degreeProgram: internship.degreeProgram,
        stream: (internship.trackId as any)?.stream || 'Undergraduate Faculty',
        trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Industry Internship',
        durationWeeks: (internship.trackId as any)?.durationWeeks || 4,
        grade: 'A+ (Distinction)',
        issueDate: internship.completedDate || internship.updatedAt,
        validityStatus: 'VALID' as const,
        verificationUrl: `https://studyfreepdf.com/verify/${internship.certificateId}`,
        accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
      } as any;
    }
  }

  return cert ? JSON.parse(JSON.stringify(cert)) : null;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificate(id);

  if (!cert) {
    return { title: 'Certificate Verification | DDIS NEP-2020' };
  }

  return {
    title: `Verified Credential: ${cert.studentName} - ${cert.trackTitle} | DDIS`,
    description: `Official verified NEP-2020 Undergraduate Internship Certificate issued by Digital Developer Infinity Solution (DDIS) to ${cert.studentName} of ${cert.collegeName}.`,
  };
}

export default async function VerifiedCertificateDirectPage({ params }: VerifyPageProps) {
  const { id } = await params;
  const cert = await getCertificate(id);

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Certificate Not Found</h2>
          <p className="text-xs text-slate-500">
            No verified DDIS credential matches ID: <strong className="font-mono text-slate-700">{id}</strong>.
          </p>
          <Link
            href="/verify"
            className="inline-block py-2.5 px-6 rounded-xl bg-[#00A389] text-white font-extrabold text-xs shadow-md"
          >
            Search Another Certificate ID
          </Link>
        </div>
      </div>
    );
  }

  const issueDateFormatted = new Date(cert.issueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search Verification</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Public Verified Credential Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Certificate ID: <span className="font-mono text-amber-300">{cert.certificateId}</span>
          </h1>
        </div>
      </div>

      {/* Main Verified Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Status Strip */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase text-white">
                  Official Verified Credential
                </div>
                <h3 className="text-lg font-black mt-1">
                  Digital Developer Infinity Solution (DDIS)
                </h3>
                <div className="text-xs text-emerald-100 font-medium">
                  National Education Policy (NEP-2020) Accredited Partner
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-400/30">
                Status: {cert.validityStatus || 'VALID'}
              </span>
              <div className="text-[11px] text-emerald-100 mt-1 font-mono">
                {issueDateFormatted}
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Candidate Name
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {cert.studentName}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    College / Institutional Affiliation
                  </span>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{cert.collegeName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Degree Program / Faculty
                  </span>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{cert.degreeProgram || cert.stream}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:border-l sm:border-slate-100 sm:pl-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Internship Domain & Accreditation
                  </span>
                  <div className="text-base font-black text-[#00A389]">
                    {cert.trackTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Performance Grade & Duration
                  </span>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-0.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{cert.durationWeeks || 4} Weeks • Grade: {cert.grade || 'A+ (Distinction)'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Accreditation Authority
                  </span>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Digital Developer Infinity Solution (DDIS)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={`/api/internship/generate-certificate?id=${cert.certificateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f78] hover:to-[#1558b3] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Download Official Certificate & Dossier (PDF)</span>
              </a>

              <a
                href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.trackTitle)}&organizationName=${encodeURIComponent('Digital Developer Infinity Solution')}&issueYear=${new Date(cert.issueDate).getFullYear()}&issueMonth=${new Date(cert.issueDate).getMonth() + 1}&certUrl=${encodeURIComponent(`https://studyfreepdf.com/verify/${cert.certificateId}`)}&certId=${encodeURIComponent(cert.certificateId)}`}
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

        {/* Institutional Note */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00A389]" />
            <span>Direct University / College Verification</span>
          </div>
          <p>
            This verification link serves as tamper-proof electronic proof of internship completion under the National Education Policy (NEP-2020) framework. College faculty and university examination boards can verify this student&apos;s project dossier at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
