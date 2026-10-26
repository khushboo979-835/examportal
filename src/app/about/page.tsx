import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, GraduationCap, Building, Users, BookOpen, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Digital Developer Infinity Solution (DDIS) & StudyFree PDF',
  description: 'Learn about DDIS, our mission to bridge academics with practical industry training, NEP-2020 virtual college internships, and Bihar exam study resources.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Official Corporate Identity &amp; Educational Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About Digital Developer Infinity Solution (DDIS)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bridging theoretical college academics with real-world industry practice and high-yield competitive exam preparation across Bihar and India.
          </p>
        </div>

        {/* Corporate Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider">Parent Organization</span>
              <h2 className="text-2xl font-black text-slate-900">Digital Developer Infinity Solution (DDIS)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Corporate Website: <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-[#00A389] font-bold hover:underline">digitalinfinityddis.com</a></p>
            </div>
            <a
              href="https://www.digitalinfinityddis.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 self-start sm:self-center transition-all shadow-sm"
            >
              <span>Visit Corporate Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            <p>
              Founded with the vision to democratize access to high-quality education and practical technical mentorship, <strong>Digital Developer Infinity Solution (DDIS)</strong> operates as a registered software engineering, enterprise IT, and EdTech organization based in Patna, Bihar, with branch representations in Delhi NCR.
            </p>
            <p>
              We power two flagship initiatives:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>1. StudyFree PDF Notes Vault</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A high-speed, anti-piracy secured marketplace delivering topper handwritten summaries, 10-year solved PYQs, and formula cheat sheets for BPSC 70th, BSEB 10th &amp; 12th, CBSE, and SSC exams at an accessible ₹49 per note or ₹199 all-access pass.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/90 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>2. NEP-2020 Virtual Internship Wing</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An accredited experiential training program fulfilling mandatory 4-week and 8-week (60–75 credit hours) college internship credits across BCA/IT, Science, Commerce, and Arts with QR-verified DDIS certificates and college viva dossiers.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">50,000+</div>
              <div className="text-[11px] text-slate-500 font-medium">Students Enrolled</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">18+</div>
              <div className="text-[11px] text-slate-500 font-medium">NEP-2020 Tracks</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">100%</div>
              <div className="text-[11px] text-slate-500 font-medium">QR-Verified Dossiers</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-900">4.9 / 5</div>
              <div className="text-[11px] text-slate-500 font-medium">Average Student Rating</div>
            </div>
          </div>
        </div>

        {/* Why Trust DDIS & StudyFree PDF */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Why Students &amp; Colleges Trust Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Curated by State Rankers:</strong> Not generic web scrapes. Hand-compiled revision summaries from state PCS rankers and subject educators.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tamper-Proof Online Verification:</strong> Every DDIS certificate is verifiable via live QR link on our public portal (<Link href="/verify" className="text-blue-600 hover:underline">studyfreepdf.com/verify</Link>).
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Full Offline PDF Ownership:</strong> When you purchase for ₹49, you own the complete PDF forever. No locked apps or expiry countdowns.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Dedicated Human Support:</strong> Immediate WhatsApp and phone assistance based out of Patna for any student inquiries.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
