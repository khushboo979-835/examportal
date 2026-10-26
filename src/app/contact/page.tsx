import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ShieldCheck, MessageSquare, Send } from 'lucide-react';

export const metadata = {
  title: 'Contact Us & Grievance Officer | StudyFree PDF & DDIS',
  description: 'Reach our student helpdesk, registered office in Patna, and designated Grievance Redressal Officer for prompt assistance within 24 hours.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>24/7 Student Assistance &amp; Grievance Redressal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact &amp; Student Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need help with a PDF download, order receipt, or NEP-2020 internship certificate verification? We are here to assist you immediately.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Phone &amp; WhatsApp</h3>
            <p className="text-xs text-slate-500">Fastest response for download &amp; payment inquiries.</p>
            <div className="text-xs font-black text-blue-600">
              <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
            <p className="text-xs text-slate-500">For invoice, licensing, or internship queries.</p>
            <div className="text-xs font-black text-emerald-600">
              <a href="mailto:support@studyfreepdf.com" className="hover:underline">support@studyfreepdf.com</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto sm:mx-0">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Support Hours</h3>
            <p className="text-xs text-slate-500">Available Monday to Saturday.</p>
            <div className="text-xs font-black text-purple-600">
              10:00 AM – 7:00 PM IST
            </div>
          </div>
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
              <p><strong>Email:</strong> <a href="mailto:grievance@studyfreepdf.com" className="text-blue-600 hover:underline">grievance@studyfreepdf.com</a></p>
              <p><strong>Direct Helpline:</strong> +91 98765 43210</p>
              <p><strong>Response SLA:</strong> Acknowledgment within 24 hours, resolution within 7 working days.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-sm">Registered Corporate Headquarters</h3>
              <p><strong>Entity Name:</strong> Digital Developer Infinity Solution (DDIS)</p>
              <p><strong>Corporate Portal:</strong> <a href="https://www.digitalinfinityddis.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.digitalinfinityddis.com/</a></p>
              <p><strong>Address:</strong> Bailey Road, Near Patna Junction, Patna, Bihar – 800001, India</p>
              <p><strong>Regional Branch:</strong> Sector 62, Noida, Delhi NCR – 201301, India</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
