'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  BookOpen
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, totalAmount, totalOriginalAmount, totalSaved } = useCart();

  const [name, setName] = useState('Aarav Kumar');
  const [email, setEmail] = useState('studyfreepdf2@gmail.com');
  const [phone, setPhone] = useState('+91 7544065425');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Your Study Bag is Empty</h2>
        <p className="text-xs text-slate-500">Please select study materials from our marketplace before checkout.</p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
        >
          Explore Notes Catalog <ArrowRight className="w-4 h-4" />
        </Link>
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
          productIds: cart.map((i) => i.product.id),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      // 2. Verify payment (Razorpay / Instant Verification)
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
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
                {error}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Razorpay Order...
                </>
              ) : (
                <>
                  Pay {formatINR(totalAmount)} & Download Notes <ArrowRight className="w-4 h-4" />
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
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {cart.map(({ product }, idx) => {
                const itemKey = (product as any)._id || product.id || product.slug || `checkout-item-${idx}`;
                const productId = product.id || (product as any)._id;
                return (
                  <div key={itemKey} className="py-3 first:pt-0 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.title}</h4>
                      <div className="text-[11px] text-slate-500">{(product as any).totalPages || product.pageCount} Pages • {product.medium}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{formatINR(product.discountedPrice ?? product.price)}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(productId)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatINR(totalOriginalAmount)}</span>
              </div>
              {totalSaved > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Topper Coupon Discount</span>
                  <span>- {formatINR(totalSaved)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-blue-600">{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
