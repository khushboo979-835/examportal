import React from 'react';
import Link from 'next/link';
import { GraduationCap, Flame, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ExamCategoriesGrid() {
  const categories = [
    {
      title: 'School Boards (K-12)',
      subtitle: 'CBSE, Bihar Board (BSEB), ICSE',
      desc: 'Complete NCERT chapter notes, formulas, high-scoring Hindi medium handwritten notes & 10-year board PYQs.',
      icon: GraduationCap,
      href: '/explore?level=K12',
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      badge: 'Matric & Inter Science/Arts',
      highlights: ['Class 10 Math & Science', 'Class 12 Physics, Chem, Bio', 'BSEB Model Papers in Hindi'],
    },
    {
      title: 'State & Central Govt Exams',
      subtitle: 'BPSC, UPSC, SSC CGL, Railways',
      desc: 'Topper handwritten summaries, Bihar Special GK, Laxmikanth Polity mind maps, and TCS speed math shortcuts.',
      icon: Flame,
      href: '/explore?level=COMPETITIVE',
      color: 'from-orange-600 to-rose-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      badge: 'BPSC 70th & UPSC 2026',
      highlights: ['BPSC Bihar Special GK (Pre + Mains)', 'UPSC GS 1-4 Crux Flowcharts', 'SSC CGL Quant Fast Tricks'],
    },
    {
      title: 'Graduation & Tech Streams',
      subtitle: 'MCA, BCA, B.Tech CSE, B.Com',
      desc: 'University semester exam study guides, DSA handwritten dry runs, DBMS queries, and interview preparation PDFs.',
      icon: BookOpen,
      href: '/explore?level=HIGHER_ED',
      color: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      badge: 'Semester Notes & FAANG DSA',
      highlights: ['Data Structures & Algorithms (C++/Java)', 'Operating Systems & Networks', 'Accounts & Commerce Notes'],
    },
  ];

  return (
    <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            Tailored For Indian Education Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Choose Your Target Examination Tier
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every document is crafted specifically for the corresponding syllabus and latest exam blueprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${cat.bgLight} ${cat.textColor} flex items-center justify-center shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 mt-0.5">{cat.subtitle}</div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {cat.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    href={cat.href}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${cat.color} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group-hover:shadow-lg`}
                  >
                    <span>Browse Category Notes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
