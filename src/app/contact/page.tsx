'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('PDF_DOWNLOAD');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || (!phone.trim() && !email.trim())) {
      setErrorMsg('Please enter your name, contact phone or email, and message.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          category,
          subject: subject.trim() || `Inquiry regarding ${category}`,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmittedTicket(data.ticketId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>24/7 Student Assistance &amp; Grievance Redressal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact &amp; Student Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need help with an exam PDF download, payment receipt, or NEP-2020 virtual college internship verification? Reach our dedicated student support team.
          </p>
        </div>

        {/* 3 Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00A389] flex items-center justify-center mx-auto sm:mx-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">WhatsApp Support</h3>
              <p className="text-xs text-slate-500">Fastest response for download, checkout &amp; syllabus doubts.</p>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/917544065425?text=Hi%20StudyFreePDF%20Support%2C%20I%20need%20assistance%20with%20my%20study%20materials."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Helpline Number</h3>
              <p className="text-xs text-slate-500">Direct student helpline available Monday to Saturday.</p>
            </div>
            <div className="pt-2">
              <a
                href="tel:+917544065425"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call +91 7544065425</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto sm:mx-0">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Email Desk</h3>
              <p className="text-xs text-slate-500">For corporate licensing, invoices, or college viva reports.</p>
            </div>
            <div className="pt-2">
              <a
                href="mailto:studyfreepdf2@gmail.com"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>studyfreepdf2@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Contact & Message Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase text-[#00A389] tracking-wider">
              Send Online Inquiry
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Submit a Student Support Ticket
            </h2>
            <p className="text-xs text-slate-500">
              Fill in your inquiry details below. Our academic and technical desk will reach out within 24 hours.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-950">
                Inquiry Submitted Successfully!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your ticket reference number is <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">{submittedTicket}</strong>. We have logged your request.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/917544065425?text=${encodeURIComponent(`Hi Support, I submitted ticket ${submittedTicket}. Please check.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
                >
                  Follow up on WhatsApp →
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-200"
                >
                  Submit Another Query
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 7544065425"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] bg-white"
                  >
                    <option value="PDF_DOWNLOAD">PDF Download &amp; Offline Access</option>
                    <option value="PAYMENT_ORDER">Payment &amp; Order Issue</option>
                    <option value="ANNUAL_PASS">Annual Pass Subscription</option>
                    <option value="INTERNSHIP_CREDIT">NEP-2020 Internship &amp; Certification</option>
                    <option value="COLLEGE_PARTNERSHIP">College / Institutional Tie-Up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need receipt for BPSC 70th Bihar Special Notes"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Your Query *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe how we can assist you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Support Request</span>
              </button>
            </form>
          )}
        </div>

        {/* Corporate Office & Grievance Redressal Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-indigo-600 tracking-wider">Statutory Details</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Grievance Officer &amp; Registered Business Address
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the designated Grievance Officer are published below:
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-sm">Grievance Redressal Officer</h3>
              <p><strong>Name:</strong> Er. Deepak Kumar</p>
              <p><strong>Designation:</strong> Head of Student Grievance &amp; Academic Integrity</p>
              <p><strong>Email:</strong> <a href="mailto:studyfreepdf2@gmail.com" className="text-blue-600 hover:underline">studyfreepdf2@gmail.com</a></p>
              <p><strong>Direct Helpline:</strong> <a href="tel:+917544065425" className="text-blue-600 hover:underline">+91 7544065425</a></p>
              <p><strong>Response SLA:</strong> Acknowledgment within 24 hours, resolution within 7 working days.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-sm">Registered Corporate Headquarters</h3>
              <p><strong>Entity Name:</strong> Digital Developer Infinity Solution (DDIS)</p>
              <p><strong>Corporate Portal:</strong> <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.digitalinfinityddis.com/</a></p>
              <p><strong>Office Address:</strong> Near Zero Mile Metro Station, Patna, Bihar - 800007, India</p>
              <p className="pt-1">
                <a
                  href="https://maps.google.com/?q=Zero+Mile+Metro+Station+Patna+Bihar+800007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Google Maps</span>
                </a>
              </p>
              <p><strong>Regional Branch:</strong> Sector 62, Noida, Delhi NCR – 201301, India</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
