import React from 'react';
import { ShieldCheck, Lock, Eye, Database, Server } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | StudyFree PDF & DDIS',
  description: 'Learn how StudyFree PDF and Digital Developer Infinity Solution (DDIS) safeguard your student data, phone numbers, and payment details.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Bank-Grade 256-Bit SSL Encryption</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy &amp; Data Protection Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            StudyFree PDF, operated by Digital Developer Infinity Solution (DDIS), is committed to safeguarding student data, personal identity, and academic records.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">1. Information We Collect</h2>
            <p>We collect only the minimum required information necessary to provide licensed educational PDFs and verify NEP-2020 internship credentials:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact Details:</strong> Student name, email address, and mobile/WhatsApp phone number.</li>
              <li><strong>Academic Details (For Internships):</strong> College name, university roll number, and degree program (e.g. BCA, B.Sc, B.Com, B.A).</li>
              <li><strong>Transaction Records:</strong> Order IDs, purchased notes, and payment status (we do NOT store credit card numbers, debit card PINs, or UPI MPINs).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To deliver instant high-resolution PDF download links and render your personal student library.</li>
              <li>To programmatically imprint your authorized personal license watermark onto PDF margins for anti-piracy compliance.</li>
              <li>To generate authentic, tamper-proof QR-verified DDIS certificates and college project viva dossiers.</li>
              <li>To send order confirmations and receipt invoices via WhatsApp/Email.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">3. Payment Security &amp; RBI Compliance</h2>
            <p>
              All online payments on StudyFree PDF are routed through Reserve Bank of India (RBI) authorized payment aggregators (Razorpay / Cashfree) supporting UPI (GPay, PhonePe, Paytm, BHIM), Net Banking, and major cards. Your payment card details and credentials never touch our servers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">4. No Data Selling / Sharing Policy</h2>
            <p>
              We maintain a strict zero-tolerance policy against spam and data brokers. Your phone number and email address will <strong>NEVER be sold, rented, or shared with third-party telemarketers</strong> or unauthorized entities.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">5. Grievance Officer &amp; Data Rights</h2>
            <p>
              Under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, you may request access to, correction of, or deletion of your personal account data by writing to:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>Grievance Officer:</strong> Er. Deepak Kumar</p>
              <p><strong>Email:</strong> privacy@studyfreepdf.com</p>
              <p><strong>Address:</strong> Digital Developer Infinity Solution (DDIS), Bailey Road, Patna, Bihar – 800001, India</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
