import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Lock, 
  ArrowLeft,
  Award,
  Zap,
  Check
} from 'lucide-react';
import connectToDatabase from '@/lib/db';
import { PDFProduct, ExamNode } from '@/models';
import { getHydratedProducts } from '@/lib/mock-db';
import { formatINR, formatBytes, calculateDiscount } from '@/lib/utils';
import SampleViewer from '@/components/viewer/SampleViewer';
import BuyNowButton from '@/components/product/BuyNowButton';
import ProductCard from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

interface PDPProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  await connectToDatabase().catch(() => {});
  try {
    const product = await PDFProduct.findOne({
      $or: [{ slug }, { _id: slug }],
    }).populate('sectorId categoryId examNodeId').lean();
    if (product) return JSON.parse(JSON.stringify(product));
  } catch {}

  const all = getHydratedProducts();
  const matched = all.find((p) => p.slug === slug || p.id === slug) || null;
  return matched ? JSON.parse(JSON.stringify(matched)) : null;
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: 'Study Material Not Found' };

  return {
    title: `${product.title} | ${product.medium} Medium PDF Notes @ ${formatINR(product.discountedPrice ?? product.price)}`,
    description: `Read free 3-page sample preview. Verified by state rankers with complete chapter summaries and solved PYQs.`,
  };
}

export default async function PDFDetailPage({ params }: PDPProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const activePrice = product.discountedPrice ?? product.price;
  const discount = calculateDiscount(product.price, product.discountedPrice);
  const totalPages = (product as any).totalPages || (product as any).pageCount || 120;
  const remainingPages = Math.max(1, totalPages - 3);

  const related = getHydratedProducts().slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-[#00A389] shrink-0">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-[#00A389] shrink-0">Exams</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{product.title}</span>
        </div>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Testbook-Grade In-Browser Sample Reader with 3-Page Blur Lock */}
          <div className="lg:col-span-7 space-y-6">
            <SampleViewer product={product} />

            {/* Syllabus Coverage Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-[#00A389]" />
                <span>100% Exam Syllabus Coverage Matrix</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Strictly aligned with latest 2026 blueprint',
                  'Last 10 Years repeated questions solved',
                  'Step-by-step numerical derivations',
                  'High-resolution visual maps & diagrams',
                  'Printable vector PDF format',
                  'Dynamic anti-piracy personal watermark',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-[#00A389] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Card, Specs & Reviews */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
              
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-[#00A389] text-white">
                  {product.medium || 'HINDI'} MEDIUM
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {product.materialType || 'NOTES'}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-rose-500 text-white">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Title & Ratings */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span>•</span>
                  <span>{(product.totalDownloads || 3420).toLocaleString()} Aspirants Enrolled</span>
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#00A389] tracking-wider">
                    Full Document Access
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">{formatINR(activePrice)}</span>
                    {product.discountedPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">{formatINR(product.price)}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00A389] bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                  Instant Download
                </span>
              </div>

              {/* 1-Click Buy Now Button */}
              <div className="space-y-3">
                <BuyNowButton product={product} />

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#00A389]" />
                  <span>Licensed to your phone with dynamic margin watermark</span>
                </div>
              </div>

              {/* Document Dimensions */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="text-slate-400">Total Pages</span>
                  <span className="font-bold text-slate-900">{totalPages} Pages (Full Master Copy)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="text-slate-400">File Size</span>
                  <span className="font-bold text-slate-900">{formatBytes((product as any).fileSizeBytes || (product as any).fileSize || 18452100)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="text-slate-400">Validity</span>
                  <span className="font-bold text-[#00A389]">Lifetime Access & Free Updates</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
