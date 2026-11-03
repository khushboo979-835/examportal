import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Building, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer & Academic Disclosure | StudyFree PDF & DDIS',
  description: 'Official academic disclaimer, fair use disclosure, non-affiliation notice with government exam boards, and intellectual property terms.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#00A389] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-black uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Academic &amp; Legal Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Official Platform Disclaimer
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: November 2026 • Published by Digital Developer Infinity Solution (DDIS)
          </p>
        </div>

        {/* Card 1: Non-Affiliation Notice */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-[#00A389]" />
            <h2>1. Non-Affiliation with Government &amp; Examination Boards</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            <strong>StudyFree PDF</strong> (accessible via <a href="https://studyfreepdf.com/" className="text-blue-600 underline">studyfreepdf.com</a>) is an independent private EdTech marketplace and academic training wing operated under <strong>Digital Developer Infinity Solution (DDIS)</strong> (<a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">digitalinfinityddis.com</a>).
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Neither StudyFree PDF nor Digital Developer Infinity Solution (DDIS) is affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with the <strong>Bihar Public Service Commission (BPSC)</strong>, <strong>Bihar School Examination Board (BSEB)</strong>, <strong>Central Board of Secondary Education (CBSE)</strong>, <strong>Staff Selection Commission (SSC)</strong>, or any other state or central government testing authority. All examination names, acronyms, and related symbols are registered trademarks of their respective owners. Their use on this website is strictly for descriptive, educational, and referential purposes under the principles of nominative fair use.
          </p>
        </div>

        {/* Card 2: Educational Nature of Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-[#00A389]" />
            <h2>2. Nature &amp; Scope of Educational Materials</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            The study notes, solved previous-year questions (PYQs), formula cheat sheets, and revision mind maps offered on StudyFree PDF are synthesized academic resources curated by independent educators and topper contributors. These materials are intended as supplementary revision aids and do not constitute an official curriculum, question bank leak, or guarantee of examination outcomes.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            While our academic editorial board makes every effort to ensure factual precision and syllabus alignment with current 2026-2027 patterns, candidates are strongly advised to cross-verify official exam notifications, syllabus blueprints, and scoring schemes directly from respective official board portals.
          </p>
        </div>

        {/* Card 3: NEP-2020 Virtual Internship Credits */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-[#00A389]" />
            <h2>3. NEP-2020 Virtual Internship &amp; Certification Credits</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Virtual internships and project milestones hosted on this platform are designed in structural alignment with the <strong>National Education Policy (NEP-2020)</strong> and UGC undergraduate internship guidelines (providing 60 to 75 hours of practical training). Official credentials and 2-page college viva defense dossiers are issued directly under the registered corporate seal of <strong>Digital Developer Infinity Solution (DDIS)</strong>.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Acceptance and conversion of practical training hours into degree semester credits remain subject to the internal academic regulations and Departmental Committee approval of the candidate&apos;s respective college or university. DDIS provides an immutable public QR verification portal (<a href="/verify" className="text-blue-600 underline">studyfreepdf.com/verify</a>) to facilitate effortless institutional verification by College Principals, HoDs, and External Viva Examiners.
          </p>
        </div>

        {/* Card 4: Anti-Piracy & Digital Licensing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-[#00A389]" />
            <h2>4. Anti-Piracy, Watermarking &amp; Single-User License</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            All purchased PDF documents are licensed strictly for personal, non-commercial educational study by the registered purchaser. Each downloaded PDF file is stamped on-the-fly with dynamic, tamper-evident anti-piracy watermarks containing the student&apos;s registered phone number, email address, and order transaction identifier.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Unauthorized uploading to public repositories, re-selling, distribution in Telegram/WhatsApp groups, or scraping of materials constitutes a violation of the Indian Copyright Act, 1957 and Information Technology Act, 2000, and may result in immediate account revocation without refund alongside civil or criminal remedies.
          </p>
        </div>

        {/* Card 5: Statutory Contact & Grievance Desk */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 text-xs text-slate-700">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <Building className="w-4 h-4 text-slate-700" />
            <h2>5. Grievance Redressal &amp; Corporate Entity</h2>
          </div>
          <p>
            For any queries, feedback, or intellectual property notifications regarding platform contents, please reach our designated Grievance Officer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <p><strong>Entity:</strong> Digital Developer Infinity Solution (DDIS)</p>
              <p><strong>Grievance Officer:</strong> Er. Deepak Kumar</p>
              <p><strong>Email:</strong> <a href="mailto:studyfreepdf2@gmail.com" className="text-blue-600 underline">studyfreepdf2@gmail.com</a></p>
              <p><strong>Direct Helpline:</strong> <a href="tel:+917544065425" className="text-blue-600 underline">+91 7544065425</a></p>
            </div>
            <div className="space-y-1">
              <p><strong>Registered Office:</strong> Near Zero Mile Metro Station, Patna, Bihar - 800007</p>
              <p><strong>Corporate Portal:</strong> <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">digitalinfinityddis.com</a></p>
              <p><strong>Support Window:</strong> Monday – Saturday, 10:00 AM to 7:00 PM IST</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
