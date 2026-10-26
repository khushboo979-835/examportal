'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Search,
  FileText,
  Users,
  Building,
  Check,
  Loader2,
  X
} from 'lucide-react';

interface Milestone {
  weekNumber: number;
  title: string;
  taskDescription: string;
  submissionType: string;
}

interface InternshipTrack {
  _id: string;
  title: string;
  slug: string;
  stream: string;
  nepAligned: boolean;
  durationWeeks: number;
  shortDescription: string;
  learningOutcomes: string[];
  milestones: Milestone[];
  fee: number;
}

const STREAM_PILLS = [
  { id: 'ALL', label: 'All Streams' },
  { id: 'BCA_IT', label: 'BCA / IT & Web' },
  { id: 'COMMERCE', label: 'B.Com / Commerce' },
  { id: 'SCIENCE', label: 'B.Sc / Science' },
  { id: 'ARTS', label: 'B.A / Arts & PR' },
  { id: 'MANAGEMENT', label: 'Management / Ops' },
];

export default function InternshipHubPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<InternshipTrack[]>([]);
  const [selectedStream, setSelectedStream] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Enrollment Modal state
  const [enrollingTrack, setEnrollingTrack] = useState<InternshipTrack | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState('');

  useEffect(() => {
    async function fetchTracks() {
      setLoading(true);
      try {
        const url = selectedStream === 'ALL' 
          ? '/api/internship/tracks' 
          : `/api/internship/tracks?stream=${selectedStream}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.tracks) {
          setTracks(data.tracks);
        }
      } catch (err) {
        console.error('Failed to load tracks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, [selectedStream]);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingTrack) return;
    setIsSubmitting(true);
    setEnrollmentError('');

    try {
      const res = await fetch('/api/internship/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: enrollingTrack._id,
          studentName,
          studentPhone,
          studentEmail,
          collegeName,
          rollNumber,
          degreeProgram,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Enrollment failed');
      }

      // Save user info in localStorage for seamless autofill
      if (typeof window !== 'undefined') {
        localStorage.setItem('ddis_student_name', studentName);
        localStorage.setItem('ddis_student_phone', studentPhone);
        localStorage.setItem('ddis_student_college', collegeName);
      }

      // Redirect directly to the student dashboard for this internship
      router.push(`/dashboard/internships/${data.internshipId}`);
    } catch (err: any) {
      setEnrollmentError(err.message || 'Something went wrong during enrollment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#00A389]/20 to-[#1A73E8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>NEP-2020 Aligned Mandatory Undergraduate College Internships</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Undergraduate Industry Internship & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A389] via-teal-300 to-indigo-400">
              Government Accredited DDIS Certification
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Accredited under{' '}
            <a
              href="https://www.digitalinfinityddis.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-300 hover:underline inline-flex items-center gap-1"
            >
              Digital Developer Infinity Solution (DDIS) <ExternalLink className="w-3.5 h-3.5" />
            </a>
            . Fulfills 4-Week & 8-Week UGC/NEP college credit requirements across Science, Commerce, Arts, and BCA/IT with verified QR credentials.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-emerald-400 font-extrabold text-xl">NEP-2020</div>
              <div className="text-[11px] text-slate-400 font-medium">UGC Guidelines Compliant</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-amber-400 font-extrabold text-xl">4 & 8 Weeks</div>
              <div className="text-[11px] text-slate-400 font-medium">Flexible Project Milestones</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-blue-400 font-extrabold text-xl">QR Verified</div>
              <div className="text-[11px] text-slate-400 font-medium">Instant Online Credential</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-teal-400 font-extrabold text-xl">Viva Ready</div>
              <div className="text-[11px] text-slate-400 font-medium">Includes 2-Page Project Dossier</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stream Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2.5 shadow-lg border border-slate-200/90 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {STREAM_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedStream(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStream === pill.id
                  ? 'bg-gradient-to-r from-[#00A389] to-[#1A73E8] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Tracks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#00A389]" />
              Available NEP-2020 Internship Tracks
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your university stream, complete 4 real-world industry tasks, and receive accredited DDIS credentials.
            </p>
          </div>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-[#00A389] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-[#00A389]" />
            Verify DDIS Student Certificate
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#00A389] animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading industry tracks from MongoDB...</p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No tracks found for this stream</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try selecting &apos;All Streams&apos; to view all available NEP tracks.</p>
            <button
              onClick={() => setSelectedStream('ALL')}
              className="px-4 py-2 rounded-xl bg-[#00A389] text-white text-xs font-bold"
            >
              Show All Tracks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Track Card Header */}
                <div className="p-6 pb-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {track.stream.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {track.durationWeeks} Weeks Duration
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#00A389] transition-colors leading-snug">
                    {track.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {track.shortDescription}
                  </p>

                  {/* Milestones count & NEP badge */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {track.milestones?.length || 4} Practical Milestones
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      NEP-2020 Aligned
                    </span>
                  </div>

                  {/* Learning Outcomes Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Core Competencies
                    </div>
                    {track.learningOutcomes?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#00A389] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Track Card Footer */}
                <div className="p-6 pt-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Enrollment Fee</div>
                    <div className="text-sm font-black text-slate-900">
                      {track.fee === 0 ? (
                        <span className="text-[#00A389]">FREE (Subsidized)</span>
                      ) : (
                        `₹${track.fee}`
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEnrollingTrack(track);
                      setEnrollmentError('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f78] hover:to-[#1558b3] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Apply / Enroll</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Institutional Authority & Accreditation Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-amber-300">
                <Building className="w-3.5 h-3.5" />
                <span>Accredited Corporate Partner</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                Digital Developer Infinity Solution (DDIS)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                DDIS is an accredited Indian IT & software consultancy organization (CIN / MSME registered, ISO 9001:2015). Under National Education Policy 2020 guidelines, DDIS issues industry training certificates and university evaluation dossiers directly acceptable by colleges, faculties, and autonomous universities across India.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00A389]" /> ISO 9001:2015 Quality Verified
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00A389]" /> QR-Scannable Live Verification
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#00A389]" /> Mandatory Semester Credit Compliant
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center space-y-4">
              <Award className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-white">Already Have a Certificate?</h4>
              <p className="text-[11px] text-slate-300">
                Verify any issued DDIS credential instantly using the candidate ID or QR scan.
              </p>
              <Link
                href="/verify"
                className="w-full inline-block py-2.5 px-4 rounded-xl bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 transition-colors shadow-md"
              >
                Verify Certificate ID
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enrollment Modal */}
      {enrollingTrack && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 my-8">
            <button
              onClick={() => setEnrollingTrack(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {enrollingTrack.stream.replace('_', ' ')}
              </span>
              <h3 className="text-xl font-black text-slate-900 leading-snug">
                Apply for {enrollingTrack.title}
              </h3>
              <p className="text-xs text-slate-500">
                Please enter your academic credentials accurately. These details will be printed on your official NEP-2020 DDIS Certificate.
              </p>
            </div>

            {enrollmentError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {enrollmentError}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Verma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 7544065425"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    placeholder="studyfreepdf2@gmail.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patna Science College, Patna University"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Roll / Registration No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PU-BCA-2023-089"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Degree & Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA 3rd Year / Sem 5"
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00A389] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f78] hover:to-[#1558b3] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering with DDIS...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Free Enrollment & Open Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero fee for eligible students • Instant task workspace activation</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
