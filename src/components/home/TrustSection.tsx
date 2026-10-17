import React from 'react';
import { ShieldCheck, Lock, Smartphone, Zap, Star, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  const testimonials = [
    {
      name: 'Rohan Verma',
      exam: 'BPSC 69th Selected (Dy. SP)',
      text: 'The Bihar Special GK & History notes are unmatched in depth. Budget summary and river system maps saved me 40+ hours during revision.',
      rating: 5,
    },
    {
      name: 'Pooja Kumari',
      exam: 'BSEB Class 12th (92.4% Scorer)',
      text: 'Physics handwritten derivations and Hindi medium formula sheets made it super easy to score full marks in numericals.',
      rating: 5,
    },
    {
      name: 'Ankit Mishra',
      exam: 'SSC CGL 2024 (AIR 240)',
      text: 'The Quant shortcut tricks and TCS repeated formulas are direct question solvers. Downloaded directly to my tablet with personal watermark.',
      rating: 5,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Dynamic Watermark Security Explainer */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-16 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Digital Rights & Piracy Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Enterprise-Grade Dynamic PDF Watermarking
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When you download notes on ExamPustak, our backend dynamically stamps your verified registered phone number, email address, and order transaction timestamp onto every page margin.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protects educators&apos; original handwritten copyrights</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Legally licensed single-student study copy (IT Act compliant)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero latency: On-the-fly streaming generation in &lt;1.2 seconds</span>
              </div>
            </div>
          </div>

          {/* Simulated Watermark Visual Preview */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200/40 relative font-sans text-xs">
            <div className="text-[9px] text-slate-400 font-mono border-b border-slate-100 pb-1.5 flex justify-between">
              <span>Licensed to: +91-9876543210 (aarav.bihar@gmail.com)</span>
              <span>ORD-2026-X9Y2</span>
            </div>

            <div className="py-6 text-center relative">
              <div className="text-sm font-bold text-slate-800">Chapter 4: Physical Geography of Bihar</div>
              <p className="text-[11px] text-slate-500 mt-2">
                The Gangetic plain divides Bihar into North and South Bihar. Major tributaries include Gandak, Burhi Gandak, Kosi, and Son river...
              </p>

              {/* Watermark Diagonal Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-25deg]">
                <span className="text-xl sm:text-2xl font-black text-blue-500/20 tracking-widest uppercase">
                  EXAMPUSTAK • +91-9876543210
                </span>
              </div>
            </div>

            <div className="text-[8px] text-slate-400 font-mono border-t border-slate-100 pt-1.5 text-center">
              Page 1 of 148 • Personal Study Copy • Unauthorized distribution prohibited
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-2xl font-black text-slate-900">What Rankers & Students Say</h3>
        <p className="text-xs text-slate-500 mt-1">Trusted by 50,000+ students across Patna, Delhi, Kota, and Prayagraj.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">{t.name}</div>
              <div className="text-[10px] font-semibold text-blue-600">{t.exam}</div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
