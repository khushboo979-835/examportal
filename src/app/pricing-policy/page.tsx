import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, Zap, Download, Lock, AlertCircle, FileText, Award } from 'lucide-react';

export const metadata = {
  title: 'Transparent Pricing & Access Policy | StudyFree PDF & DDIS',
  description: 'Understand exactly what you get for ₹49 per note vs the ₹199 Annual Pass. Clear rules on PDF downloads, lifetime access, and free sample previews.',
};

export default function PricingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>100% Transparent Fee Structure • No Hidden Charges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pricing, Licensing &amp; Access Policy
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            At StudyFree PDF (accredited under Digital Developer Infinity Solution - DDIS), we believe in absolute transparency. Below is an exact breakdown of what you receive with every plan, what is included in your PDF download, and your rights as a learner.
          </p>
        </div>

        {/* Comparison Grid: ₹49 Single Note vs ₹199 Annual Pass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1: Single PDF Note (₹49) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wide">
                Single Subject Note Access
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">₹49</span>
                  <span className="text-sm text-slate-400 line-through">₹149</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">67% OFF</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">One-time payment for 1 specific study note / solved paper</p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-700 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Full PDF Included:</strong> 100% printable, high-resolution complete PDF booklet (100–180 pages).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lifetime Offline Access:</strong> Download to phone, tablet or laptop forever. Never expires.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Sample Preview:</strong> Read first 3 to 5 pages free before paying any money.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Personal Anti-Piracy Watermark:</strong> Stamped with your licensed phone number for secure ownership.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>No Recurring Billing:</strong> Zero auto-debit. Pay once and own permanently.</span>
                </div>
              </div>
            </div>

            <Link
              href="/explore"
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs text-center shadow-md transition-all block"
            >
              Browse Individual Notes (₹49)
            </Link>
          </div>

          {/* Plan 2: Annual All-Access Pass (₹199) */}
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-blue-600 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F59E0B] text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-2xl">
              BEST VALUE FOR STUDENTS
            </div>

            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-xl bg-white/10 text-amber-300 text-xs font-black uppercase tracking-wide border border-white/10">
                👑 Annual All-Access PDF Pass
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">₹199</span>
                  <span className="text-sm text-blue-300">/ full year (365 days)</span>
                </div>
                <p className="text-xs text-blue-200 mt-1">Unlimited access to the entire 5,000+ PDF notes library</p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-blue-100 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>All 5,000+ Notes Included:</strong> Complete library across BPSC 70th/71st, BSEB 10th &amp; 12th, CBSE 9th-12th &amp; SSC.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited Instant Downloads:</strong> Download any note with personalized digital anti-piracy watermarking.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>10-Year Solved PYQs + Formula Sheets:</strong> Full access to all solved question banks and formula cheat sheets.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Free Future Exam Updates:</strong> All new 2026-2027 model question papers added automatically.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Auto-Renewal:</strong> Strictly non-recurring. Your card or UPI will NEVER be auto-charged.</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout?plan=ANNUAL_PASS"
              className="w-full py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs text-center shadow-lg transition-all block hover:scale-105"
            >
              Get Annual Pass @ ₹199/year
            </Link>
          </div>

        </div>

        {/* Detailed Clarity FAQs (Addressing Exact Feedback) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Frequently Asked Questions on Pricing &amp; Downloads
          </h2>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed divide-y divide-slate-100">
            
            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                1. What exactly do I receive after paying ₹49 for a single note?
              </h3>
              <p>
                When you purchase any single study note for ₹49, you immediately receive the <strong>complete, unabridged high-resolution PDF file</strong> (ranging between 80 to 200 pages depending on the subject). The PDF is instantly viewable in your student library and downloadable to your device for <strong>lifetime offline reading and printing</strong>.
              </p>
            </div>

            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                2. Can I preview the notes for free before paying?
              </h3>
              <p>
                <strong>Yes, absolutely.</strong> Every single study material on StudyFree PDF features a prominent <strong>&quot;Preview Sample (Free Reading)&quot;</strong> button. You can review the Table of Contents, handwriting clarity, diagrams, and sample pages to verify educators&apos; quality before spending a single rupee.
              </p>
            </div>

            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                3. What exams and resources are covered under the ₹199 Annual Pass?
              </h3>
              <p>
                The ₹199 Annual Pass unlocks <strong>all current and upcoming study materials for 365 days</strong> across:
              </p>
              <ul className="list-disc pl-5 pt-1 space-y-1">
                <li><strong>Bihar Public Service Commission (BPSC):</strong> 70th &amp; 71st CCE Prelims GS, Bihar Special GK, Economy Budget, Mains Mindmaps.</li>
                <li><strong>Bihar School Examination Board (BSEB):</strong> Class 10th Matric &amp; Class 12th Inter (Science, Arts, Commerce) Hindi &amp; English medium notes.</li>
                <li><strong>Central Board of Secondary Education (CBSE):</strong> Classes 9th to 12th NCERT Crux &amp; Formula Guides.</li>
                <li><strong>Staff Selection Commission (SSC):</strong> CGL, CHSL, GD Math Tricks, English Vocab &amp; GS TCS PYQs.</li>
                <li><strong>Formula Sheets &amp; 10-Year Solved PYQs:</strong> All formula sheets and model papers across all boards.</li>
              </ul>
            </div>

            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                4. What is the fee for the NEP-2020 Virtual Internships?
              </h3>
              <p>
                All 4-week and 8-week undergraduate internship tracks under <strong>Digital Developer Infinity Solution (DDIS)</strong> are currently <strong>100% FREE (Subsidized)</strong> for enrolled college students of Patliputra University, Bihar University, Patna University, and other UGC-recognized universities. Students complete 4 weekly milestones to receive their accredited DDIS certificate and 2-page college viva report at no cost.
              </p>
            </div>

            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                5. What is the digital anti-piracy watermark?
              </h3>
              <p>
                To protect educators&apos; intellectual property while granting you unrestricted personal study rights, each downloaded PDF file is stamped with a subtle margin watermark displaying: <em>&quot;Licensed to: +91 [Your Phone Number] | Order #[Order ID]&quot;</em>. You are strictly permitted to print and read the material for your personal education. Re-selling or public digital redistribution is prohibited under the Copyright Act, 1957.
              </p>
            </div>

            <div className="pt-3 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                6. What if my payment succeeds but the download does not start?
              </h3>
              <p>
                Our server processes downloads instantly. If a network drop occurs, your purchase is safely linked to your phone number and accessible anytime from <Link href="/library" className="text-blue-600 font-bold hover:underline">My Student Library</Link>. You can also message our 24/7 WhatsApp helpdesk at <a href="tel:+917544065425" className="font-bold underline text-blue-600">+91 7544065425</a> or email <strong>studyfreepdf2@gmail.com</strong> with your payment screenshot for immediate assistance or an instant refund under our <Link href="/refund-policy" className="text-blue-600 font-bold hover:underline">7-Day Refund Policy</Link>.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
