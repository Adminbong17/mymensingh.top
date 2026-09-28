import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass,
  User,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogOut,
  Smartphone,
  KeyRound,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, signUp, logout, sendPasswordResetOtp, resetPasswordWithOtp } = useAuth();

  const defaultTab = searchParams.get('tab') === 'register' 
    ? 'register' 
    : (searchParams.get('tab') === 'forgot' ? 'forgot' : 'login');
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);
  const [accountType, setAccountType] = useState<'user' | 'business'>('user');
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Phone OTP Password Reset States
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState('');
  const [countdown, setCountdown] = useState(0);

  // OTP Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Real cPanel Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...');
        setTimeout(() => {
          if (email.toLowerCase().includes('admin')) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 800);
      } else {
        setErrorMsg(res.error || 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। সঠিক তথ্য দিয়ে চেষ্টা করুন।');
      }
    } catch {
      setErrorMsg('লগইন করার সময় একটি সমস্যা হয়েছে। ইন্টারনেট সংযোগ ও সার্ভার পরীক্ষা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Registration (NO Email Confirmation - Instant Access)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      setIsLoading(false);
      return;
    }

    try {
      const res = await signUp(email, password, {
        full_name: fullName,
        phone,
        role: accountType === 'business' ? 'admin' : 'user',
        business_name: businessName,
      });

      if (res.success) {
        setSuccessMsg('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম!');
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setErrorMsg(res.error || 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অন্য ইমেইল বা ফোন নম্বর দিয়ে চেষ্টা করুন।');
      }
    } catch {
      setErrorMsg('অ্যাকাউন্ট তৈরির সময় সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to Phone for Password Reset
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setTestOtpNotice('');
    setIsLoading(true);

    try {
      const res = await sendPasswordResetOtp(otpPhone);
      if (res.success) {
        setOtpStep('verify');
        setSuccessMsg(res.message || 'আপনার মোবাইল নম্বরে ৬ ডিজিটের ওটিপি পাঠানো হয়েছে।');
        if (res.otp_code) {
          setTestOtpNotice(res.otp_code);
          setOtpCode(res.otp_code); // Auto-fill for instant test
        }
        setCountdown(60);
      } else {
        setErrorMsg(res.error || 'ওটিপি পাঠানো সম্ভব হয়নি। সঠিক মোবাইল নম্বর দিন।');
      }
    } catch {
      setErrorMsg('সার্ভারের সাথে যোগাযোগ করা যায়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('দুটো পাসওয়ার্ড মেলেনি। আবার টাইপ করুন।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithOtp(otpPhone, otpCode, newPassword);
      if (res.success) {
        setSuccessMsg('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
        setTimeout(() => {
          setPassword(newPassword);
          setActiveTab('login');
          setOtpStep('phone');
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
          setTestOtpNotice('');
        }, 2000);
      } else {
        setErrorMsg(res.error || 'পাসওয়ার্ড পরিবর্তন করা যায়নি। ওটিপি কোডটি পরীক্ষা করুন।');
      }
    } catch {
      setErrorMsg('সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Mymensingh<span className="text-emerald-400">.top</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            আমার শহর, আমাদের গাইড — রিয়েল অথেনটিকেশন পোর্টাল
          </p>
        </div>

        {/* If user is already logged in */}
        {user ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                স্বাগতম, {user.full_name || user.email}
              </h2>
              <p className="text-xs text-slate-500">
                আপনি বর্তমানে <span className="font-bold text-emerald-700 uppercase">{user.role}</span> হিসেবে লগইন আছেন
              </p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}


            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>এডমিন প্যানেলে যান</span>
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>হোমপেজে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="grid grid-cols-3 border-b border-slate-200 text-xs sm:text-sm font-bold bg-slate-50/70">
              <button
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-3.5 text-center transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'text-emerald-700 bg-white border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                লগইন (Login)
              </button>
              <button
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-3.5 text-center transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'text-emerald-700 bg-white border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                নতুন অ্যাকাউন্ট
              </button>
              <button
                onClick={() => { setActiveTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-3.5 text-center transition-all cursor-pointer ${
                  activeTab === 'forgot'
                    ? 'text-emerald-700 bg-white border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ওটিপি রিসেট
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-5">
              
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইল অ্যাড্রেস *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        পাসওয়ার্ড *
                      </label>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="আপনার পাসওয়ার্ড দিন"
                        className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন (Sign In)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500">
                    অ্যাকাউন্ট নেই?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      এখনই রেজিস্ট্রেশন করুন
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER FORM (Instant Access - No Email Confirmation) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Account type toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      অ্যাকাউন্টের ধরন
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAccountType('user')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          accountType === 'user'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>নাগরিক / ভিজিটর</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('business')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          accountType === 'business'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>ব্যবসায়ী / উদ্যোক্তা</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  {accountType === 'business' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রতিষ্ঠানের নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="আপনার দোকান, হোটেল বা কোম্পানির নাম"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ইমেইল ঠিকানা *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মোবাইল নম্বর (ওটিপির জন্য) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="শক্তিশালী পাসওয়ার্ড দিন"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন (সরাসরি প্রবেশ)'}</span>
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500">
                    ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      লগইন করুন
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PHONE NUMBER OTP PASSWORD RESET */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        মোবাইল ওটিপি দিয়ে পাসওয়ার্ড পরিবর্তন
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        আপনার নিবন্ধিত ফোন নম্বর দিয়ে সরাসরি পাসওয়ার্ড রিসেট করুন
                      </p>
                    </div>
                  </div>

                  {/* Test OTP Notice for immediate developer testing */}
                  {testOtpNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span>পরীক্ষামূলক ওটিপি কোড: <strong className="font-mono text-sm text-amber-700">{testOtpNotice}</strong></span>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded font-bold">টেস্ট মোড</span>
                    </div>
                  )}

                  {otpStep === 'phone' ? (
                    /* Step 1: Enter Phone Number */
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          আপনার মোবাইল নম্বর বা ইমেইল *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value)}
                            placeholder="017XXXXXXXX অথবা ইমেইল"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          অ্যাকাউন্ট খোলার সময় যে নম্বর বা ইমেইল দিয়েছিলেন সেটি লিখুন।
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isLoading ? 'ওটিপি পাঠানো হচ্ছে...' : 'ওটিপি কোড পাঠান (Send OTP)'}</span>
                      </button>

                      <div className="pt-1 text-center text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>লগইন পেজে ফিরে যান</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Step 2: Enter OTP & Set New Password */
                    <form onSubmit={handleResetPassword} className="space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            ৬ ডিজিটের ওটিপি কোড *
                          </label>
                          <button
                            type="button"
                            disabled={countdown > 0 || isLoading}
                            onClick={handleSendOtp}
                            className="text-[11px] text-teal-700 font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{countdown > 0 ? `${countdown}s পর পুনরায় পাঠান` : 'আবার পাঠান'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="যেমন: 489201"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-slate-50 focus:bg-white tracking-widest font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="আপনার নতুন পাসওয়ার্ড দিন"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="আগের পাসওয়ার্ডটি আবার লিখুন"
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isLoading ? 'পাসওয়ার্ড আপডেট হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন (Save New Password)'}</span>
                      </button>

                      <div className="flex justify-between items-center pt-1 text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => setOtpStep('phone')}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>নম্বর পরিবর্তন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="text-teal-700 font-bold hover:underline cursor-pointer"
                        >
                          লগইন পেজে যান
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};
