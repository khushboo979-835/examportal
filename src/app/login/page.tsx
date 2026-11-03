'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap,
  Building
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your Student ID (STU-XXXXX), WhatsApp/Phone number or registered Email');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('studyfreepdf_user_name', data.user.name);
        localStorage.setItem('studyfreepdf_user_phone', data.user.phone);
        if (data.user.email) localStorage.setItem('studyfreepdf_user_email', data.user.email);
        if (data.user.studentId) localStorage.setItem('studyfreepdf_user_student_id', data.user.studentId);
        localStorage.setItem('studyfreepdf_token', data.token);
      }

      setSuccessMsg(`Login successful! Welcome back, ${data.user.name}. Redirecting to your dashboard...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Full Name and Phone number are required to create your account');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          college: college.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('studyfreepdf_user_name', data.user.name);
        localStorage.setItem('studyfreepdf_user_phone', data.user.phone);
        if (data.user.email) localStorage.setItem('studyfreepdf_user_email', data.user.email);
        if (data.user.studentId) localStorage.setItem('studyfreepdf_user_student_id', data.user.studentId);
        localStorage.setItem('studyfreepdf_token', data.token);
      }

      setSuccessMsg(`Account created! Your Student ID is ${data.user.studentId || 'generated'}. Redirecting to your dashboard...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header / Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              StudyFree <span className="text-[#00A389]">PDF</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>&quot;Talent Aapka, Rasta Hamara&quot; (टैलेंट आपका, रास्ता हमारा)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {mode === 'LOGIN' ? 'Student Sign In' : 'Create Student Account'}
          </h1>
          <p className="text-xs text-slate-500">
            Access your Student ID, purchased study notes, bookmarks, and DDIS NEP-2020 internship portal.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'LOGIN' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In (ID / Phone)
            </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'REGISTER' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              New Registration
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student ID, Phone Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2026-AB12, +91 7544065425 or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter your generated Student ID, or the phone number/email provided during registration.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Sign In to Student Dashboard</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  College / University Name (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Patna Science College, Magadh University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#00A389] hover:bg-[#008f77] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Generate Student ID &amp; Create Account</span>
              </button>
            </form>
          )}

          {/* Quick Features Highlight */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#00A389]" />
              <span>Offline Watermarked PDFs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>DDIS NEP-2020 Internships</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Tamper-Proof Certificates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Dynamic QR Verification</span>
            </div>
          </div>

        </div>

        {/* Security Disclosures */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>Protected by 256-bit SSL encryption &amp; sliding-window rate limiters.</p>
          <p>Digital Developer Infinity Solution (DDIS) • Patna Zero Mile Metro Station</p>
        </div>

      </div>
    </div>
  );
}
