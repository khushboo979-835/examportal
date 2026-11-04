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
  Building,
  Award,
  Check,
  Search,
  School,
  ExternalLink
} from 'lucide-react';

const BIHAR_UNIVERSITIES = [
  { id: 'PPU', name: 'Patliputra University (PPU), Patna', tag: 'BCA / B.Com / B.Sc / B.A' },
  { id: 'PU', name: 'Patna University (PU), Patna', tag: 'Science & Arts Colleges' },
  { id: 'AKU', name: 'Aryabhatta Knowledge University (AKU), Patna', tag: 'Technical & Engineering' },
  { id: 'BEU', name: 'Bihar Engineering University (BEU), Patna', tag: 'B.Tech / AI & Cloud' },
  { id: 'MU', name: 'Magadh University, Bodh Gaya', tag: 'Undergraduate Programs' },
  { id: 'BRABU', name: 'BR Ambedkar Bihar University, Muzaffarpur', tag: 'Collegiate Courses' },
  { id: 'LNMU', name: 'Lalit Narayan Mithila University, Darbhanga', tag: 'Degree & Honours' },
  { id: 'BSEB', name: 'BSEB Patna (Bihar School Examination Board)', tag: 'Class 10th & 12th Inter' },
  { id: 'CBSE', name: 'CBSE & Central Boards', tag: 'Secondary & Senior Secondary' },
  { id: 'OTHER', name: 'Other Recognized University / College', tag: 'Pan-India UGC Colleges' },
];

const INDUSTRY_TRACKS = [
  { name: 'Full-Stack Cloud Engineering', stream: 'BCA / IT & Web', duration: '4-8 WEEKS' },
  { name: 'Corporate Accounting & GST', stream: 'B.Com / Finance', duration: '4-8 WEEKS' },
  { name: 'Scientific Data Analytics & ML', stream: 'B.Sc / Mathematics', duration: '4-8 WEEKS' },
  { name: 'Technical Content Writing & PR', stream: 'B.A / Mass Comm', duration: '4-8 WEEKS' },
];

export default function LoginPage({ initialMode = 'LOGIN' }: { initialMode?: 'LOGIN' | 'REGISTER' }) {
  const router = useRouter();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('PPU');
  const [college, setCollege] = useState('');
  const [stream, setStream] = useState('BCA_IT');
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

      setSuccessMsg(`Welcome back, ${data.user.name}! Opening your student dashboard...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
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
          college: college.trim() || BIHAR_UNIVERSITIES.find(u => u.id === university)?.name || undefined,
          stream,
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

      setSuccessMsg(`Account created successfully! Your Student ID is ${data.user.studentId || 'generated'}.`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              StudyFree <span className="text-[#00A389]">PDF</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00A389] border border-emerald-200 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>&quot;Talent Aapka, Rasta Hamara&quot; (टैलेंट आपका, रास्ता हमारा)</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-bold">
              Digital Developer Infinity Solution (DDIS)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Unified student access portal for exam study vaults, BPSC/BSEB topper notes, and NEP-2020 accredited virtual internship dashboards.
          </p>
        </div>

        {/* 3-Column Architecture: Left Industry Tracks, Center Auth Portal, Right Universities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Industry Connections & NEP Accreditations (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                  Industry Programs
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  NEP-2020 Internships
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  UGC compliant 4 &amp; 8-week corporate project tracks with viva dossier.
                </p>
              </div>

              <div className="space-y-2.5">
                {INDUSTRY_TRACKS.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-all">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>{t.stream}</span>
                      <span className="text-emerald-700 font-extrabold">{t.duration}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      {t.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DDIS Accredited
                </span>
                <Link href="/internships" className="text-blue-600 font-extrabold hover:underline">
                  View All Tracks →
                </Link>
              </div>
            </div>

            {/* Quick Support Badge */}
            <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                <span>💬 Need Quick Assistance?</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
                Facing login trouble? WhatsApp our Patna helpdesk with your registered phone number.
              </p>
              <a
                href="https://wa.me/917544065425?text=Hi%20StudyFreePDF%2C%20I%20need%20help%20logging%20in%20to%20my%20student%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:underline pt-0.5"
              >
                +91 7544065425 WhatsApp Desk →
              </a>
            </div>
          </div>

          {/* Center Column: Authentication Card (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-extrabold">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-3 rounded-xl transition-all cursor-pointer ${
                  mode === 'LOGIN' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In (Student ID / Phone)
              </button>
              <button
                type="button"
                onClick={() => { setMode('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-3 rounded-xl transition-all cursor-pointer ${
                  mode === 'REGISTER' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account (New Student)
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'LOGIN' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Student ID, Registered Phone, or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. STU-2026-AB12, 7544065425 or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter the unique Student ID or phone number used during enrollment / PDF purchase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f77] hover:to-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Sign In to Student Dashboard</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  New to StudyFree PDF?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('REGISTER'); setErrorMsg(''); }}
                    className="text-[#00A389] font-black hover:underline cursor-pointer"
                  >
                    Register free account now
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Student Full Name (As per College ID) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Khushboo Kumari / Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 7857023438"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* University / Board Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Select University / Board *
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50 cursor-pointer"
                    >
                      {BIHAR_UNIVERSITIES.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    College / Institution Name (e.g. TPS College, AN College)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. TPS College, Patna / Science College"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#00A389] focus:ring-1 focus:ring-[#00A389] bg-slate-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A389] to-[#1A73E8] hover:from-[#008f77] hover:to-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                  <span>Complete Registration &amp; Get Student ID</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('LOGIN'); setErrorMsg(''); }}
                    className="text-[#00A389] font-black hover:underline cursor-pointer"
                  >
                    Sign in to your account
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right Column: Universities & Exam Hubs Coverage (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                  Academic Coverage
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  Partner Universities
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Recognized for credit transfers, syllabus notes &amp; internship viva.
                </p>
              </div>

              <div className="space-y-2">
                {BIHAR_UNIVERSITIES.slice(0, 5).map((u) => (
                  <div key={u.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100/90">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{u.tag}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link href="/verify" className="text-xs font-extrabold text-emerald-700 hover:underline inline-flex items-center gap-1">
                  <span>Verify DDIS Student Certificate →</span>
                </Link>
              </div>
            </div>

            {/* Statutory Security Seal */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white text-xs space-y-2">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                Zero third-party commercial data sharing. Your academic records are encrypted and protected under Indian privacy laws.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
