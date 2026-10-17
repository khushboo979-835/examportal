import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Download, Zap, Award, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Trust Badges Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">100% Verified Notes</h4>
              <p className="text-xs text-slate-400 mt-1">Curated by State Rankers & Top Educators</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">Instant PDF Download</h4>
              <p className="text-xs text-slate-400 mt-1">Direct PDF link in library within 2 seconds</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">Anti-Piracy Watermark</h4>
              <p className="text-xs text-slate-400 mt-1">Encrypted personal study watermark</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm">UPI & Cards Supported</h4>
              <p className="text-xs text-slate-400 mt-1">GPay, PhonePe, Paytm & Net Banking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Exam<span className="text-blue-400">Pustak</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India&apos;s fastest growing digital study material vault. Tailored for CBSE, BSEB, BPSC 70th, UPSC CSE, SSC CGL & University students with high-yield revision summaries and solved PYQs.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} ExamPustak.in. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">School Boards</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/explore?board=CBSE&class=Class%2010" className="hover:text-white">CBSE Class 10th Math & Science</Link></li>
              <li><Link href="/explore?board=CBSE&class=Class%2012" className="hover:text-white">CBSE Class 12th Physics & Chem</Link></li>
              <li><Link href="/explore?board=BSEB&class=Class%2012" className="hover:text-white">Bihar Board 12th Inter Science</Link></li>
              <li><Link href="/explore?board=BSEB&medium=HINDI" className="hover:text-white">BSEB Matric Model Papers (Hindi)</Link></li>
              <li><Link href="/explore?board=ICSE" className="hover:text-white">ICSE Class 10 Solved Specimen</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Competitive Exams</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/explore?board=BPSC" className="hover:text-white">BPSC 70th/71st Bihar Special GK</Link></li>
              <li><Link href="/explore?board=UPSC" className="hover:text-white">UPSC CSE Polity & Modern History</Link></li>
              <li><Link href="/explore?board=SSC" className="hover:text-white">SSC CGL 2026 Math Shortcuts</Link></li>
              <li><Link href="/explore?board=RAILWAY" className="hover:text-white">RRB NTPC & Group D Science</Link></li>
              <li><Link href="/explore?type=PYQ" className="hover:text-white">10-Year Solved Papers Vault</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/library" className="hover:text-white">My Notes (Student Library)</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Management Portal</Link></li>
              <li><Link href="/admin/upload" className="hover:text-white">Upload New PDF Materials</Link></li>
              <li><span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded inline-block">24/7 Support: support@exampustak.in</span></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
