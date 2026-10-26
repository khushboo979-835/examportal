import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  Download, 
  Zap, 
  Award, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  HelpCircle, 
  Lock, 
  ExternalLink 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* 1. Trust Badges Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">100% Verified Notes</h4>
              <p className="text-xs text-slate-400 mt-1">Curated by State Rankers &amp; Top Educators</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">Instant PDF Download</h4>
              <p className="text-xs text-slate-400 mt-1">Full printable PDF with lifetime offline access</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">Anti-Piracy Watermark</h4>
              <p className="text-xs text-slate-400 mt-1">Encrypted personal license on every page</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">DDIS Accredited</h4>
              <p className="text-xs text-slate-400 mt-1">NEP-2020 UGC Compliant Certification</p>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand & Corporate Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="StudyFree PDF Logo"
                className="h-10 sm:h-12 w-auto object-contain rounded-xl"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold">
                  A Unit of Digital Developer Infinity Solution (DDIS)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              StudyFree PDF is Bihar and India&apos;s leading educational PDF notes vault and NEP-2020 accredited virtual internship platform. Providing topper handwritten summaries, 10-year solved PYQs, and college viva dossiers for BPSC, BSEB, CBSE &amp; SSC students.
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Patna Office: Near Zero Mile Metro Station, Patna, Bihar - 800007, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Customer Support: <a href="tel:+917544065425" className="hover:text-white transition-colors">+91 7544065425</a> (10 AM – 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Email: <a href="mailto:studyfreepdf2@gmail.com" className="hover:text-white transition-colors">studyfreepdf2@gmail.com</a></span>
              </div>
            </div>
          </div>

          {/* Quick Exam Categories */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5 text-slate-200">
              Exam Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/exams/bpsc-70th-cce" className="hover:text-white transition-colors">
                  BPSC 70th/71st Bihar Special
                </Link>
              </li>
              <li>
                <Link href="/exams/bseb-class-12-science" className="hover:text-white transition-colors">
                  BSEB 12th Inter (Science/Arts)
                </Link>
              </li>
              <li>
                <Link href="/exams/bseb-class-10th" className="hover:text-white transition-colors">
                  BSEB 10th Matric Model Papers
                </Link>
              </li>
              <li>
                <Link href="/exams/cbse-class-10th" className="hover:text-white transition-colors">
                  CBSE Class 10th &amp; 12th NCERT
                </Link>
              </li>
              <li>
                <Link href="/exams/ssc-cgl-2026" className="hover:text-white transition-colors">
                  SSC CGL &amp; CHSL Math Tricks
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-[#00A389] font-bold hover:underline">
                  View All 5,000+ Notes →
                </Link>
              </li>
            </ul>
          </div>

          {/* NEP-2020 Internships */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5 text-slate-200">
              NEP-2020 Internships
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/internships?stream=BCA_IT" className="hover:text-white transition-colors">
                  Full-Stack Cloud Engineering
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=COMMERCE" className="hover:text-white transition-colors">
                  Digital Marketing &amp; E-Commerce
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=SCIENCE" className="hover:text-white transition-colors">
                  Scientific Data Analytics
                </Link>
              </li>
              <li>
                <Link href="/internships?stream=ARTS" className="hover:text-white transition-colors">
                  Technical Content Writing &amp; PR
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-emerald-400 font-bold hover:underline">
                  Verify DDIS Certificate →
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparent Legal & Policy Links (Must-Have Image 1) */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5 text-slate-200">
              Transparent Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/pricing-policy" className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-amber-300">
                  <span>₹49 &amp; ₹199 Pricing Terms</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service &amp; DRM License
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (Data Security)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us (DDIS Accreditation)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Grievance Officer
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Regulatory Identity & Grievance Redressal Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p>
              <strong className="text-slate-300">Legal Entity:</strong> Digital Developer Infinity Solution (DDIS) | Official Website: <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-[#00A389] hover:underline">digitalinfinityddis.com</a>
            </p>
            <p>
              <strong className="text-slate-300">Grievance Redressal Officer:</strong> Er. Deepak Kumar | Email: <a href="mailto:studyfreepdf2@gmail.com" className="text-slate-400 hover:text-white">studyfreepdf2@gmail.com</a> | Timelines: Response within 24 hrs, resolution within 7 business days.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0">
            <p>© {new Date().getFullYear()} StudyFree PDF • All Rights Reserved.</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Compliant with Information Technology Act, 2000 &amp; UGC NEP-2020 Internship Guidelines</p>
          </div>
        </div>
      </div>

    </footer>
  );
}
