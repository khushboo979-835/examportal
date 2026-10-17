import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Flame, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Zap, 
  Download, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import connectToDatabase from '@/lib/db';
import { ExamNode, Category, Sector, PDFProduct } from '@/models';
import { getHydratedProducts } from '@/lib/mock-db';
import ProductCard from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

interface ExamHubProps {
  params: Promise<{ slug: string }>;
}

export default async function ExamHubPage({ params }: ExamHubProps) {
  const { slug } = await params;
  await connectToDatabase().catch(() => {});

  let examData: any = null;
  let products: any[] = [];

  try {
    const rawExam = await ExamNode.findOne({ slug }).populate({
      path: 'categoryId',
      populate: { path: 'sectorId' },
    }).lean();

    if (rawExam) {
      examData = JSON.parse(JSON.stringify(rawExam));
      const rawProducts = await PDFProduct.find({ examNodeId: rawExam._id, isPublished: true }).lean();
      products = JSON.parse(JSON.stringify(rawProducts));
    }
  } catch {}

  // Fallback if not populated from DB
  if (!examData) {
    const all = getHydratedProducts();
    examData = {
      name: slug.toUpperCase().replace(/-/g, ' '),
      slug,
      description: 'Comprehensive chapter notes, 10-year solved previous year questions, and high-yield formula sheets.',
      targetYear: '2026',
      categoryId: {
        name: 'State & Central Boards',
        sectorId: { name: 'Exams Vault' },
      },
    };
    products = JSON.parse(JSON.stringify(all));
  }

  // Filter into Testbook 4 Tabs
  const pyqList = products.filter((p) => p.materialType === 'SOLVED_PYQ' || p.materialType === 'PYQ');
  const notesList = products.filter((p) => p.materialType === 'NOTES');
  const formulaList = products.filter((p) => p.materialType === 'FORMULA_SHEET');
  const mockList = products.filter((p) => p.materialType === 'MOCK_PAPER' || p.materialType === 'MODEL_PAPER');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Structured Breadcrumbs: Home > Sector > Category > Exam */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-[#00A389] shrink-0">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-[#00A389] shrink-0">
            {examData.categoryId?.sectorId?.name || 'Exams'}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{examData.name}</span>
        </div>

        {/* Exam Header Hero Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A389]/20 text-[#00A389] border border-[#00A389]/30 text-[10px] font-black uppercase px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Target {examData.targetYear || '2026'} Blueprint
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {examData.name} — Study Material & Solved Papers Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {examData.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Notes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Anti-Piracy Watermarking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hindi & English Mediums</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Previous Year Solved Papers (PYQs) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">1. Previous Year Solved Papers (PYQs)</h2>
                <p className="text-xs text-slate-500">10-year sorted questions with step-by-step solutions</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#00A389]">{pyqList.length || 2} Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pyqList.length > 0 ? pyqList : products.slice(0, 2)).map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Tab 2: Subject-Wise Revision Notes */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">2. Subject-Wise Handwritten Revision Notes</h2>
                <p className="text-xs text-slate-500">Hand-drawn diagrams, formula derivations, and chapter crux</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(notesList.length > 0 ? notesList : products).map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Tab 3: Formula Sheets & Mind Maps */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">3. Formula Cheat Sheets & Flowcharts</h2>
                <p className="text-xs text-slate-500">Fast 25-minute revision summaries before the exam hall</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(formulaList.length > 0 ? formulaList : products.slice(2, 4)).map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
