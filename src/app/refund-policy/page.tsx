import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, Clock, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | StudyFree PDF & DDIS',
  description: '7-Day Student Protection Guarantee. Read our clear, honest refund terms, processing timeline (3-5 days), and customer grievance redressal process.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>7-Day Student Protection Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Operated by <strong>Digital Developer Infinity Solution (DDIS)</strong>. We stand behind the educational authenticity and technical quality of all digital notes, PYQs, and certifications provided on StudyFree PDF.
          </p>
        </div>

        {/* 3 Step Refund Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">7-Day Eligibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your request within 7 calendar days of purchase if any technical defect or file corruption prevents study.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fast 24-Hr Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our support team verifies your order number and transaction ID within 24 hours without prolonged delays.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3–5 Days Reversal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved refunds are credited directly back to your original source account (UPI, GPay, PhonePe, Debit/Credit Card).
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">1. Digital Study Materials (Single Notes &amp; PYQs @ ₹49)</h2>
            <p>
              Due to the digital nature of instant PDF downloads, purchases are generally finalized once downloaded. However, an immediate 100% full refund is guaranteed under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Technical File Corruptions:</strong> The downloaded PDF is blank, unreadable, or cannot be opened on standard PDF viewers.</li>
              <li><strong>Duplicate Transaction:</strong> You were charged more than once for the same study note due to a payment gateway timeout.</li>
              <li><strong>Major Syllabus Discrepancy:</strong> The material does not match the published title, table of contents, or subject curriculum.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">2. Annual All-Access Pass (₹199 / Year)</h2>
            <p>
              If you purchase the ₹199 Annual Pass and find that you cannot access the covered material or wish to cancel before downloading more than 3 documents, you may request a cancellation within <strong>7 days of purchase</strong> for a full refund. Once more than 3 full document downloads have occurred, access is considered consumed for that period.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">3. Non-Refundable Scenarios</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Change of mind after fully downloading the complete unwatermarked/watermarked digital document.</li>
              <li>Failure to read the free sample preview before purchasing where the preview accurately reflected the content.</li>
              <li>Violation of copyright policies or unauthorized attempts to resell or redistribute the material.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">4. How to Request a Refund</h2>
            <p>
              Send an email to <strong>studyfreepdf2@gmail.com</strong> or WhatsApp our dedicated support hotline at <a href="tel:+917544065425" className="font-bold underline text-blue-600">+91 7544065425</a> with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your Registered Phone Number / Email Address</li>
              <li>Order Number (e.g. <code>ORD-2026-XXXX</code>)</li>
              <li>A brief description or screenshot of the technical error encountered</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900">5. Escalation to Grievance Officer</h2>
            <p>
              If your request is not resolved within 48 hours, you can directly escalate to our designated Grievance Officer:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div><strong>Name:</strong> Er. Deepak Kumar (Grievance Officer)</div>
              <div><strong>Email:</strong> <a href="mailto:studyfreepdf2@gmail.com" className="text-blue-600 hover:underline">studyfreepdf2@gmail.com</a></div>
              <div><strong>Entity:</strong> Digital Developer Infinity Solution (DDIS)</div>
              <div><strong>Registered Office:</strong> Near Zero Mile Metro Station, Patna, Bihar - 800007, India</div>
              <div><strong>Direct Helpline:</strong> <a href="tel:+917544065425" className="text-blue-600 hover:underline">+91 7544065425</a></div>
              <div><strong>Response SLA:</strong> Acknowledgment within 24 hours, resolution within 7 business days.</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
