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
  Share2, 
  ArrowLeft,
  Award,
  Layers,
  Zap
} from 'lucide-react';
import connectToDatabase from '@/lib/db';
import { PDFProduct } from '@/models';
import { getHydratedProducts } from '@/lib/mock-db';
import { formatINR, formatBytes, calculateDiscount } from '@/lib/utils';
import BuyNowButton from '@/components/product/BuyNowButton';
import ProductCard from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

interface PDPProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  await connectToDatabase().catch(() => {});
  try {
    const product = await PDFProduct.findOne({
      $or: [{ slug }, { _id: slug }],
    }).populate('sectorId categoryId examNodeId').lean();
    if (product) return JSON.parse(JSON.stringify(product));
  } catch {
    // fallback
  }

  const all = getHydratedProducts();
  const matched = all.find((p) => p.slug === slug || p.id === slug) || null;
  return matched ? JSON.parse(JSON.stringify(matched)) : null;
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Study Material Not Found | StudyFree PDF',
    };
  }

  const boardName = product.subject?.boardOrExam?.name || 'Academic Exam';
  const priceText = formatINR(product.discountedPrice ?? product.price);

  return {
    title: `${product.title} | ${product.medium} Medium PDF Notes @ ${priceText}`,
    description: `${product.description} Verified by toppers. Includes ${product.pageCount} pages, table of contents, and solved PYQs.`,
    keywords: [
      product.title,
      product.subject?.name || '',
      product.subject?.boardOrExam?.code || '',
      product.medium,
      ...product.tags,
    ],
    openGraph: {
      title: `${product.title} — StudyFree PDF`,
      description: product.description,
      type: 'article',
      locale: 'en_IN',
    },
  };
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const activePrice = product.discountedPrice ?? product.price;
  const discount = calculateDiscount(product.price, product.discountedPrice);
  const boardCode = product.subject?.boardOrExam?.code || 'BOARD';
  const boardName = product.subject?.boardOrExam?.name || 'Board';
  const subjectName = product.subject?.name || 'Subject';

  // Get related products
  const allProducts = getHydratedProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.subjectId === product.subjectId || p.subject?.boardOrExam?.code === boardCode))
    .slice(0, 3);

  // JSON-LD Structured Schema for Google Programmatic SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: 'https://studyfreepdf.com/images/og-notes-cover.png',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: activePrice,
      availability: 'https://schema.org/InStock',
      url: `https://studyfreepdf.com/p/${product.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-blue-600 shrink-0">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-blue-600 shrink-0">Catalog</Link>
          <span>/</span>
          <Link href={`/explore?board=${boardCode}`} className="hover:text-blue-600 shrink-0">{boardCode}</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{product.title}</span>
        </div>

        {/* Main Grid: Preview & Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Embedded 2-3 Sample Preview Frame */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Embedded Watermarked PDF Previewer Container */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-rose-400" /> 2-3 Sample Pages Preview
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• Watermarked &quot;PREVIEW ONLY&quot;</span>
                </div>
                <span className="text-xs font-bold text-amber-400">Full Copy: {product.pageCount} Pages</span>
              </div>

              {/* Iframe Preview Box */}
              <div className="h-[480px] sm:h-[580px] bg-slate-100 relative">
                <iframe
                  src={`/api/preview/${product.id}#toolbar=0&navpanes=0&scrollbar=1`}
                  title={`${product.title} Sample Preview`}
                  className="w-full h-full border-0 bg-white"
                />

                {/* Floating Preview CTA Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">Ready to unlock all {product.pageCount} pages?</div>
                      <div className="text-[10px] text-slate-400">Personal study watermark with your phone & email included.</div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-amber-400">{formatINR(activePrice)}</span>
                </div>
              </div>

            </div>

            {/* Table of Contents Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Chapter-wise Table of Contents</span>
              </div>

              <div className="space-y-2.5 pt-2">
                {(product.tableOfContents || []).map((chapter: string, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-between"
                  >
                    <span>{chapter}</span>
                    <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      Included
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-Converting Checkout Box & Metadata */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6 sticky top-24">
              
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-blue-600 text-white tracking-wider">
                  {boardCode}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                  {product.medium === 'HINDI' ? 'हिन्दी माध्यम (Hindi)' : product.medium === 'ENGLISH' ? 'English Medium' : 'Bilingual'}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {product.materialType}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>By {product.authorName || 'Top Exam Faculty'}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating} ({product.reviewCount} ratings)</span>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Special Discount Price</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">{formatINR(activePrice)}</span>
                    {product.discountedPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">{formatINR(product.price)}</span>
                    )}
                  </div>
                </div>
                {discount > 0 && (
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-rose-500 text-white shadow-sm animate-pulse">
                    Save {discount}% Today
                  </span>
                )}
              </div>

              {/* 1-Click Buy Now CTA */}
              <div className="space-y-3">
                <BuyNowButton product={product} />

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instant 100% money back if syllabus doesn&apos;t match</span>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium text-slate-400">Total Page Count</span>
                  <span className="font-bold text-slate-900">{product.pageCount} Pages (Printable)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium text-slate-400">File Download Size</span>
                  <span className="font-bold text-slate-900">{formatBytes(product.fileSize)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium text-slate-400">Format & Quality</span>
                  <span className="font-bold text-slate-900">Vector PDF (HD Clarity)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span className="font-medium text-slate-400">Access Validity</span>
                  <span className="font-bold text-emerald-600">Lifetime Access & Free Updates</span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">What&apos;s Included</h4>
                {(product.highlights || []).map((h: string, hIdx: number) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Related Materials Carousel */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">
              More Study Notes For {boardName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
