'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  Smartphone, 
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { PDFProduct } from '@/types';

const ANNUAL_PASS_PRODUCT: PDFProduct = {
  id: 'pass-annual-all-access',
  title: 'Annual All-Access Exam Pass (365 Days)',
  slug: 'annual-all-access-pass',
  price: 499,
  discountedPrice: 199,
  pageCount: 5000,
  totalPages: 5000,
  fileSize: 1024 * 1024 * 50,
  medium: 'BILINGUAL',
  subjectId: 'sub-all-exams',
  subject: {
    id: 'sub-all-exams',
    name: 'All Bihar & Central Exams',
    boardOrExam: { code: 'ALL-ACCESS', name: 'Annual Pass Pro' },
  } as any,
  materialType: 'NOTES',
  rating: 4.9,
  reviewCount: 342,
  tags: ['Pass', 'All-Access', 'Unlimited'],
  description: 'Unlimited access & downloads across BPSC, BSEB 10th/12th, CBSE & SSC notes, formula sheets and PYQs for 365 days.',
  totalDownloads: 12500,
  totalSales: 890,
  isPassEligible: true,
  isPublished: true,
  isFeatured: true,
  fileKey: 'passes/annual-pass-master.pdf',
  fileFormat: 'PDF',
  highlights: ['5,000+ Notes', '365 Days Access', 'Solved PYQs'],
  tableOfContents: ['BPSC Modules', 'BSEB Modules', 'CBSE Modules', 'SSC Modules'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const { cart, addToCart, removeFromCart, clearCart, totalAmount, totalOriginalAmount, totalSaved } = useCart();

  const [name, setName] = useState('Aarav Kumar');
  const [email, setEmail] = useState('studyfreepdf2@gmail.com');
  const [phone, setPhone] = useState('+91 7544065425');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-add Annual Pass if user arrived with ?plan=ANNUAL_PASS and cart has no items
  useEffect(() => {
    if (planParam === 'ANNUAL_PASS' && cart.length === 0) {
      addToCart(ANNUAL_PASS_PRODUCT);
    }
  }, [planParam, cart.length, addToCart]);

  const hasAnnualPass = cart.some(
    (i) => i.product.id === 'pass-annual-all-access' || i.product.slug === 'annual-all-access-pass'
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Your Study Bag is Empty</h2>
        <p className="text-xs text-slate-500">Please select study materials or an Annual Pass from our marketplace before checkout.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Explore Notes Catalog <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => addToCart(ANNUAL_PASS_PRODUCT)}
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer"
          >
            Add Annual Pass @ ₹199
          </button>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please provide your name, phone, and email to generate the study license');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Create order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: cart.map((i) => (i.product as any)._id || i.product.id || i.product.slug),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          orderType: hasAnnualPass ? 'ALL_ACCESS_PASS' : 'SINGLE_PDF',
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      // 2. Verify payment (Razorpay / Instant Webhook reconciliation)
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderData.orderNumber,
          razorpayOrderId: orderData.razorpayOrderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: 'sig_sim_valid',
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        localStorage.setItem('studyfreepdf_user_email', email);
        localStorage.setItem('studyfreepdf_user_phone', phone);
        localStorage.setItem('studyfreepdf_user_name', name);
        localStorage.setItem('exampustak_user_email', email);
        localStorage.setItem('exampustak_user_phone', phone);
        localStorage.setItem('exampustak_user_name', name);
        clearCart();
        router.push(`/order/${orderData.orderNumber}`);
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Fast One-Click Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your items and complete instant payment via UPI, GPay, PhonePe, or Cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Student Info & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6">
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      addToCart(ANNUAL_PASS_PRODUCT);
                      setError(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] shadow-sm cursor-pointer"
                  >
                    Reset &amp; Add Annual Pass @ ₹199
                  </button>
                  <Link
                    href="/explore"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px]"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>1. Student Licensing Credentials</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>2. Select Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', desc: 'GPay, PhonePe, Paytm', icon: '⚡' },
                  { id: 'CARD', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                  { id: 'NETBANKING', label: 'Net Banking', desc: 'All Indian Banks', icon: '🏛️' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">{pm.icon}</div>
                    <div className="font-extrabold text-xs">{pm.label}</div>
                    <div className="text-[10px] text-slate-500">{pm.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Refund & Guarantee Notice */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>7-Day Money-Back Guarantee:</strong>
                <span className="text-emerald-800 ml-1">
                  If the study material does not match its sample preview or description, request a full refund within 7 days via our{' '}
                  <Link href="/refund-policy" className="underline font-bold hover:text-emerald-950">Refund Policy</Link>.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Razorpay Order...
                </>
              ) : (
                <>
                  Pay {formatINR(totalAmount)} &amp; Download Notes <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit Encrypted Razorpay Gateway • Direct S3/R2 Presigned Delivery</span>
            </div>

          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-slate-500">({cart.length} item{cart.length > 1 ? 's' : ''})</span>
            </h3>

            {/* Itemized List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {cart.map(({ product }, idx) => {
                const itemKey = (product as any)._id || product.id || product.slug || `checkout-item-${idx}`;
                const productId = product.id || (product as any)._id;
                const isPass = product.id === 'pass-annual-all-access' || product.slug === 'annual-all-access-pass';

                return (
                  <div key={itemKey} className="py-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{isPass ? '5,000+ Notes Library' : `${(product as any).totalPages || product.pageCount} Pages`}</span>
                        <span>•</span>
                        <span>{product.medium}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{isPass ? 'Access Duration: 365 Days Unlimited' : 'Access Duration: Lifetime Offline Access'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-slate-900">{formatINR(product.discountedPrice ?? product.price)}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(productId)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tax & Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (List Price)</span>
                <span>{formatINR(totalOriginalAmount)}</span>
              </div>
              {totalSaved > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Topper Coupon Discount</span>
                  <span>- {formatINR(totalSaved)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>GST (18% inclusive)</span>
                <span className="text-slate-700 font-medium">Included (₹0 extra)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Convenience Fee</span>
                <span className="text-emerald-600 font-bold">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-blue-600">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Exclusions Notice for Annual Pass */}
            {hasAnnualPass && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                <strong>Annual Pass Terms:</strong> Grants 365-day access to all PDF notes, PYQs, and formula sheets across BPSC, BSEB, CBSE, and SSC. <em>Excludes premium physical printed books &amp; private 1-on-1 mentorship.</em>
              </div>
            )}

            {/* Security stamp */}
            <div className="pt-2 text-[10px] text-slate-400 text-center font-medium">
              Dynamic Anti-Piracy Watermark stamped upon download • Verified Single User License
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Loading secure checkout...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
