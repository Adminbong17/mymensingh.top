import React, { useState, useEffect, useMemo } from 'react';
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
  Bookmark,
  Save,
  Trash2,
  Droplets,
  GraduationCap,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BusinessDetailModal } from '../components/BusinessDetailModal';
import type { Business } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    user,
    login,
    signUp,
    logout,
    sendPasswordResetOtp,
    resetPasswordWithOtp,
    updateUserProfile
  } = useAuth();

  const { businesses, favorites, toggleFavorite } = useData();

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

  // Logged-in User Dashboard State
  const [userTab, setUserTab] = useState<'profile' | 'favorites' | 'services' | 'security'>('profile');
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.full_name || '');
      try {
        const raw = localStorage.getItem('mymensingh_registered_users_v2');
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
          if (found && found.phone) {
            setProfilePhone(found.phone);
          }
        }
      } catch {}
    }
  }, [user]);

  // OTP Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Real Login
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

  // Real Registration
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
        role: (email.toLowerCase().trim() === 'admin@mymensingh.top' || email.toLowerCase().trim() === 'admin@bongbangla.top') ? 'admin' : 'user',
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
          setOtpCode(res.otp_code);
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
      setErrorMsg('পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithOtp(otpPhone, otpCode, newPassword);
      if (res.success) {
        setSuccessMsg(res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করুন।');
        setTimeout(() => {
          setActiveTab('login');
          setOtpStep('phone');
          setOtpPhone('');
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
          setErrorMsg('');
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(res.error || 'ওটিপি যাচাই ব্যর্থ হয়েছে। সঠিক কোড দিন।');
      }
    } catch {
      setErrorMsg('পাসওয়ার্ড পরিবর্তনের সময় সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    if (updateUserProfile) {
      updateUserProfile({
        full_name: profileName.trim(),
        phone: profilePhone.trim()
      });
    }

    setProfileSuccess('আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  // Filtered favorite businesses
  const favoriteBusinesses = useMemo(() => {
    return businesses.filter(b => favorites.includes(b.id));
  }, [businesses, favorites]);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* =============================================================== */}
        {/* LOGGED-IN FULL USER DASHBOARD */}
        {/* =============================================================== */}
        {user ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* User Header Profile Card */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-black text-2xl shadow-inner backdrop-blur-md">
                    <User className="w-9 h-9 text-emerald-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">
                        {user.full_name || user.email?.split('@')[0]}
                      </h1>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{user.email}</span>
                    </p>
                    {profilePhone && (
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{profilePhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex flex-wrap sm:flex-col gap-2">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>অ্যাডমিন ড্যাশবোর্ড</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Dashboard Tabs Bar */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap gap-1">
              <button
                onClick={() => setUserTab('profile')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'profile'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>প্রোফাইল তথ্য</span>
              </button>

              <button
                onClick={() => setUserTab('favorites')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'favorites'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>পছন্দের তালিকা ({favoriteBusinesses.length})</span>
              </button>

              <button
                onClick={() => setUserTab('services')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'services'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>আমার সেবা ও কার্যক্রম</span>
              </button>

              <button
                onClick={() => setUserTab('security')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'security'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>নিরাপত্তা ও পাসওয়ার্ড</span>
              </button>
            </div>

            {/* =========================================================== */}
            {/* USER TAB 1: EDIT PROFILE */}
            {/* =========================================================== */}
            {userTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">ব্যক্তিগত প্রোফাইল আপডেট</h3>
                  <p className="text-xs text-slate-500">আপনার নাম ও যোগাযোগের তথ্য পরিবর্তন করুন।</p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পুরো নাম</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="আপনার নাম"
                      required
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Read-Only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="017XX-XXXXXX"
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাকাউন্টের ভূমিকা</label>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="uppercase">{user.role}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================================== */}
            {/* USER TAB 2: FAVORITES / BOOKMARKS */}
            {/* =========================================================== */}
            {userTab === 'favorites' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      পছন্দের প্রতিষ্ঠানসমূহ ({favoriteBusinesses.length})
                    </h3>
                    <p className="text-xs text-slate-500">আপনার সেভ করা জরুরি প্রতিষ্ঠান ও দোকানসমূহ।</p>
                  </div>
                  <button
                    onClick={() => navigate('/categories')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>আরও খুঁজুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {favoriteBusinesses.length === 0 ? (
                  <div className="py-12 text-center p-6 border border-dashed border-slate-200 rounded-3xl space-y-2">
                    <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">কোনো পছন্দের প্রতিষ্ঠান সেভ করা নেই।</p>
                    <p className="text-xs text-slate-400">
                      যেকোনো প্রতিষ্ঠানের কার্ডের তারা (★) আইকনে ক্লিক করে সহজেই এখানে সেভ করে রাখতে পারেন।
                    </p>
                    <button
                      onClick={() => navigate('/categories')}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
                    >
                      <span>ডিরেক্টরি ব্রাউজ করুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteBusinesses.map((biz: Business) => (
                      <div
                        key={biz.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div onClick={() => setSelectedBiz(biz)} className="cursor-pointer">
                          <img src={biz.image_url} alt={biz.name} className="w-full aspect-16/10 object-cover" />
                          <div className="p-4 space-y-1.5">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {biz.category}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{biz.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">📍 {biz.location}</p>
                            <p className="text-xs font-bold text-amber-500">★ {biz.rating} ({biz.review_count})</p>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                          {biz.phone && (
                            <a
                              href={`tel:${biz.phone}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                            >
                              <Phone className="w-3 h-3" />
                              <span>কল করুন</span>
                            </a>
                          )}
                          <button
                            onClick={() => toggleFavorite(biz.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="পছন্দের তালিকা থেকে সরান"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================== */}
            {/* USER TAB 3: SERVICES SHORTCUTS */}
            {/* =========================================================== */}
            {userTab === 'services' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">সিটি সার্ভিসেস ও লিস্টিং কার্যক্রম</h3>
                  <p className="text-xs text-slate-500">
                    ময়মনসিংহ সিটির যেকোনো সেবায় সরাসরি যুক্ত হোন বা বিজ্ঞাপন দিন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: List Business */}
                  <div
                    onClick={() => navigate('/list-business')}
                    className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">নতুন ব্যবসা বা দোকান লিস্টিং</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        আপনার প্রতিষ্ঠান ময়মনসিংহ সিটির ডিরেক্টরিতে বিনামূল্যে তালিকাভুক্ত করুন।
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <span>লিস্টিং পেজে যান</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 2: Blood Donor */}
                  <div
                    onClick={() => navigate('/blood-bank')}
                    className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/80 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">রক্তদাতা হিসেবে নিবন্ধন</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        জরুরি প্রয়োজনে ময়মনসিংহের মানুষের জীবন বাঁচাতে রক্তদাতা নেটওয়ার্কে যুক্ত হোন।
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700">
                      <span>ব্লাড ব্যাংকে যান</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 3: To-Let */}
                  <div
                    onClick={() => navigate('/to-let')}
                    className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">বাসা ভাড়া / টু-লেট বিজ্ঞাপন</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        ফ্যামিলি, ব্যাচেলর বা সাবলেট বাসা ভাড়ার বিজ্ঞাপন বিনামূল্যে দিন।
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                      <span>টু-লেট পোর্টালে যান</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 4: Tuition */}
                  <div
                    onClick={() => navigate('/tuition-media')}
                    className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">টিউশন ও শিক্ষক খোঁজা</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        অভিজ্ঞ টিউটর খুঁজুন অথবা শিক্ষক হিসেবে নিজের টিউশন পোস্ট করুন।
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700">
                      <span>টিউশন মিডিয়ায় যান</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* USER TAB 4: SECURITY & PASSWORD */}
            {/* =========================================================== */}
            {userTab === 'security' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">নিরাপত্তা ও পাসওয়ার্ড ব্যবস্থাপনা</h3>
                  <p className="text-xs text-slate-500">আপনার মোবাইল ওটিপি বা অ্যাকাউন্টের মাধ্যমে পাসওয়ার্ড পরিবর্তন করুন।</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 max-w-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>দ্রুত পাসওয়ার্ড রিসেট (OTP Reset)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    পাসওয়ার্ড ভুলে গেলে বা পরিবর্তন করতে চাইলে ওটিপি রিসেট ট্যাব ব্যবহার করুন।
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/auth?tab=forgot');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    পাসওয়ার্ড রিসেট করুন
                  </button>
                </div>
              </div>
            )}

            {/* Business Detail Modal */}
            {selectedBiz && (
              <BusinessDetailModal
                business={selectedBiz}
                onClose={() => setSelectedBiz(null)}
              />
            )}
          </div>
        ) : (
          /* =============================================================== */
          /* GUEST / AUTHENTICATION INTERFACE (Login / Register / Forgot) */
          /* =============================================================== */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Brand Header */}
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
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. LOGIN TAB */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mymensingh.top বা আপনার ইমেইল"
                        required
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="আপনার পাসওয়ার্ড দিন"
                        required
                        className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
                  </button>
                </form>
              )}

              {/* 2. REGISTER TAB */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setAccountType('user')}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        accountType === 'user' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      ব্যক্তিগত একাউন্ট
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('business')}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        accountType === 'business' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      ব্যবসা / সেবা একাউন্ট
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        required
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {accountType === 'business' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ব্যবসা বা প্রতিষ্ঠানের নাম</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="দোকান বা ব্যবসা প্রতিষ্ঠানের নাম"
                          required
                          className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XX-XXXXXX"
                        required
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        required
                        minLength={6}
                        className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
                  </button>
                </form>
              )}

              {/* 3. FORGOT / OTP RESET TAB */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  {otpStep === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value)}
                            placeholder="017XXXXXXXX বা আপনার নম্বর"
                            required
                            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'ওটিপি পাঠানো হচ্ছে...' : '৬-সংখ্যার ওটিপি পাঠান'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {testOtpNotice && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                          <span className="font-bold">আপনার টেস্ট ওটিপি কোড: </span>
                          <span className="font-mono font-black text-sm bg-amber-100 px-2 py-0.5 rounded">{testOtpNotice}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">৬-সংখ্যার ওটিপি কোড</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          required
                          maxLength={6}
                          className="w-full text-center font-mono text-lg font-bold tracking-widest py-2 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                          required
                          minLength={6}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="পুনরায় পাসওয়ার্ড দিন"
                          required
                          className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'পাসওয়ার্ড পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড নিশ্চিত করুন'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
