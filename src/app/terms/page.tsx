import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertTriangle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Licensing | StudyFree PDF & DDIS',
  description: 'Terms and Conditions governing the use of StudyFree PDF notes, downloads, anti-piracy watermarking, and DDIS NEP-2020 internship programs.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black uppercase">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Effective Date: Updated for Academic Year 2026-2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service &amp; End-User License Agreement (EULA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing or downloading study materials or enrolling in virtual internships on StudyFree PDF.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">1. Acceptance of Terms &amp; Business Identity</h2>
            <p>
              By accessing StudyFree PDF (<strong>studyfreepdf.com</strong>), purchasing any digital study note, or enrolling in an internship track, you agree to be bound by these Terms of Service. This platform is wholly owned and operated by <strong>Digital Developer Infinity Solution (DDIS)</strong>, an enterprise software and EdTech organization headquartered in Patna, Bihar, India (Website: <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">digitalinfinityddis.com</a>).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">2. Nature of Digital Study Materials &amp; Personal License</h2>
            <p>
              When you purchase a single study note (typically ₹49) or subscribe to the Annual All-Access Pass (₹199/year), StudyFree PDF grants you a <strong>non-exclusive, non-transferable, single-user license</strong> to download, store, view, and print the PDF for your personal academic study.
            </p>
            <p>
              <strong>Anti-Piracy Watermarking:</strong> Each downloaded document is programmatically watermarked on its margins with your registered phone number and licensed order ID to protect educators&apos; copyrighted summaries. Removing, obscuring, or tampering with this watermark constitutes a violation of these Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">3. Prohibition of Resale &amp; Commercial Redistribution</h2>
            <p>
              You agree not to upload, share, broadcast, sell, rent, lease, or distribute any study notes downloaded from StudyFree PDF to public Telegram channels, WhatsApp groups, commercial coaching portals, or file-sharing websites. Unauthorized commercial exploitation will lead to immediate license termination, permanent account ban, and legal remedies under the <strong>Indian Copyright Act, 1957</strong> and the <strong>Information Technology Act, 2000</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">4. NEP-2020 Virtual Internships &amp; DDIS Accreditation</h2>
            <p>
              The virtual internships offered on this portal comply with the mandatory 4-week and 8-week (60–75 credit hours) requirements of the National Education Policy (NEP-2020) for undergraduate programs in Science, Commerce, Arts, and IT. Certification is awarded upon student completion and mentor approval of all 4 assigned milestone deliverables. Any submission of plagiarized code or fraudulent documents will invalidate certification eligibility.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">5. Limitation of Liability &amp; Academic Disclaimer</h2>
            <p>
              While all notes and question answers are compiled by state rankers and subject educators following the latest Bihar and central exam syllabi, StudyFree PDF and DDIS make no guarantee of specific exam scores or rank cutoffs. Our materials are intended as high-yield revision aids and supplementary self-study resources.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">6. Governing Law &amp; Contact Inquiries</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Patna, Bihar, India</strong>.
            </p>
            <p className="pt-2 text-slate-500">
              For any licensing queries or legal communications, email us at <a href="mailto:studyfreepdf2@gmail.com" className="text-blue-600 hover:underline">studyfreepdf2@gmail.com</a>, call <a href="tel:+917544065425" className="text-blue-600 hover:underline">+91 7544065425</a>, or write to our registered office: Digital Developer Infinity Solution (DDIS), Near Zero Mile Metro Station, Patna, Bihar - 800007, India.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
