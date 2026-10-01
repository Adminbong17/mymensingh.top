import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Search,
  Phone,
  MapPin,
  Plus,
  Heart,
  ShieldAlert,
  CheckCircle,
  X,
  MessageCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  DIVISION_DISTRICTS,
  DISTRICT_UPAZILAS_MAP,
  ALL_DIVISION_UPAZILAS
} from '../data/initialData';
import type { BloodDonor } from '../types';

export const BloodBankPage: React.FC = () => {
  const { bloodDonors, addBloodDonor } = useData();

  // Filters
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Registration Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    blood_group: BloodDonor['blood_group'];
    upazila: string;
    phone: string;
    availability: 'Available' | 'Unavailable';
    last_donation: string;
  }>({
    name: '',
    blood_group: 'A+',
    upazila: 'ময়মনসিংহ সদর',
    phone: '',
    availability: 'Available',
    last_donation: '১ মাস আগে',
  });

  const bloodGroups = ['all', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

  // Filtered Donors
  const filteredDonors = useMemo(() => {
    return bloodDonors.filter((donor) => {
      if (selectedGroup !== 'all' && donor.blood_group !== selectedGroup) {
        return false;
      }
      if (selectedUpazila !== 'all' && donor.upazila !== selectedUpazila) {
        return false;
      }
      if (onlyAvailable && donor.availability !== 'Available') {
        return false;
      }
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchName = donor.name.toLowerCase().includes(q);
        const matchUpazila = donor.upazila.toLowerCase().includes(q);
        const matchPhone = donor.phone.includes(q);
        if (!matchName && !matchUpazila && !matchPhone) return false;
      }
      return true;
    });
  }, [bloodDonors, selectedGroup, selectedUpazila, onlyAvailable, searchKeyword]);

  // Group counts
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bloodDonors.forEach((d) => {
      counts[d.blood_group] = (counts[d.blood_group] || 0) + 1;
    });
    return counts;
  }, [bloodDonors]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('অনুগ্রহ করে নাম এবং মোবাইল নম্বর সঠিকভাবে পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await addBloodDonor({
        name: formData.name,
        blood_group: formData.blood_group,
        upazila: formData.upazila,
        phone: formData.phone,
        availability: formData.availability,
        last_donation: formData.last_donation || '১ মাস আগে',
      });

      if (ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsRegisterOpen(false);
          setFormData({
            name: '',
            blood_group: 'A+',
            upazila: 'ময়মনসিংহ সদর',
            phone: '',
            availability: 'Available',
            last_donation: '১ মাস আগে',
          });
        }, 1500);
      } else {
        alert('নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।');
      }
    } catch {
      alert('ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Hero Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-red-800/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Droplets className="w-4 h-4 text-red-400 animate-bounce" />
              <span>জরুরি রক্তসেবা পোর্টাল • Mymensingh Blood Bank</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              ময়মনসিংহ বিভাগীয় ব্লাড ব্যাংক ও <span className="text-red-400">রক্তদাতা ডিরেক্টরি</span>
            </h1>

            <p className="text-xs sm:text-base text-red-100/90 leading-relaxed max-w-2xl">
              ময়মনসিংহ বিভাগের ৪ জেলা (ময়মনসিংহ, জামালপুর, শেরপুর ও নেত্রকোণা) এর যেকোনো ব্লাড গ্রুপের রক্তদাতাদের সরাসরি খুঁজুন অথবা নিজে নিবন্ধিত হয়ে জীবন বাঁচান।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white text-red-700 font-black text-sm hover:bg-red-50 shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>রক্তদাতা হিসেবে নিবন্ধন করুন (Join as Donor)</span>
              </button>

              <a
                href="tel:09166063"
                className="px-5 py-3.5 rounded-2xl bg-red-600/40 hover:bg-red-600/60 border border-red-400/30 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>মেডিকেল ব্লাড ব্যাংক: 091-66063</span>
              </a>
            </div>
          </div>

          <div className="absolute -top-12 -right-12 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2. Emergency Blood Hotlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">সরকারি হাসপাতাল</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">MMCH ব্লাড ব্যাংক</h4>
              <p className="text-xs text-slate-500">চরপাড়া, ময়মনসিংহ</p>
            </div>
            <a
              href="tel:09166063"
              className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
              title="Call MMCH"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">স্বেচ্ছাসেবী সংগঠন</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">সন্ধানী (MMCH ইউনিট)</h4>
              <p className="text-xs text-slate-500">মেডিকেল কলেজ চত্বর</p>
            </div>
            <a
              href="tel:01712000000"
              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
              title="Call Sandhani"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">মানবিক সংস্থা</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">রেড ক্রিসেন্ট সোসাইটি</h4>
              <p className="text-xs text-slate-500">ময়মনসিংহ জেলা ইউনিট</p>
            </div>
            <a
              href="tel:01713000000"
              className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
              title="Call Red Crescent"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">জাতীয় জরুরি কল</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">জাতীয় হেল্পলাইন ৯৯৯</h4>
              <p className="text-xs text-slate-500">পুলিশ / অ্যাম্বুলেন্স</p>
            </div>
            <a
              href="tel:999"
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Call 999"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3. Search & Group Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Blood group selector pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">রক্তের গ্রুপ বাছাই করুন:</span>
              <span className="text-xs font-semibold text-slate-500">মোট ডোনার: {bloodDonors.length} জন</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {bloodGroups.map((bg) => {
                const count = bg === 'all' ? bloodDonors.length : (groupCounts[bg] || 0);
                const active = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                      active
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/30 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{bg === 'all' ? 'সব গ্রুপ (All)' : bg}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Keyword Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="রক্তদাতার নাম, এলাকা বা ফোন নম্বর লিখুন..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50/50 text-slate-700"
              >
                <option value="all">সকল উপজেলা ({ALL_DIVISION_UPAZILAS.length}টি - বিভাগ)</option>
                {DIVISION_DISTRICTS.map((dist) => (
                  <optgroup key={dist} label={`${dist} জেলা`}>
                    {(DISTRICT_UPAZILAS_MAP[dist] || []).map((up) => (
                      <option key={up} value={up}>{up}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center justify-end">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2.5 rounded-xl w-full justify-center hover:bg-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>কেবল প্রস্তুত ডোনার (Available)</span>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Donors Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 fill-current" />
              <span>উপলব্ধ রক্তদাতাগণ ({filteredDonors.length} জন)</span>
            </h2>

            {(selectedGroup !== 'all' || selectedUpazila !== 'all' || searchKeyword || onlyAvailable) && (
              <button
                onClick={() => {
                  setSelectedGroup('all');
                  setSelectedUpazila('all');
                  setSearchKeyword('');
                  setOnlyAvailable(false);
                }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {filteredDonors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Droplets className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">কোনো রক্তদাতার তথ্য মেলেনি</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনার নির্বাচিত ব্লাড গ্রুপ বা এলাকায় কোনো ডোনার পাওয়া যায়নি। আপনি কি এই গ্রুপের রক্তদাতা? এখনই নিবন্ধন করুন!
              </p>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>নিবন্ধন করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => {
                const isAvail = donor.availability === 'Available';
                return (
                  <div
                    key={donor.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform shrink-0">
                          {donor.blood_group}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                            {donor.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{donor.upazila}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        isAvail
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isAvail ? '● প্রস্তুত (Available)' : '○ অনুপলব্ধ'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>সর্বশেষ দান: {donor.last_donation || 'অজ্ঞাত'}</span>
                      </span>

                      <span className="font-semibold text-slate-700">{donor.phone}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${donor.phone}`}
                        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল</span>
                      </a>

                      <a
                        href={`https://wa.me/88${donor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Educational / Guidelines Section */}
        <div className="bg-gradient-to-br from-red-50/60 to-rose-50/60 rounded-3xl p-6 sm:p-8 border border-red-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-red-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-red-600" />
              <span>রক্তদানের সাধারণ নিয়ম ও যোগ্যতা</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>বয়স ১৮ থেকে ৬০ বছরের মধ্যে এবং ওজন কমপক্ষে ৪৫ কেজি হতে হবে।</li>
              <li>সর্বশেষ রক্তদানের পর কমপক্ষে ৩ থেকে ৪ মাস অতিবাহিত হতে হবে।</li>
              <li>রক্তচাপ স্বাভাবিক এবং শরীরে কোনো সংক্রামক ব্যাধি থাকা যাবে না।</li>
              <li>রক্তদানের পূর্বে পর্যাপ্ত পানি পান করুন এবং হালকা খাবার গ্রহণ করুন।</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-red-950 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" />
              <span>জরুরি রক্তের প্রয়োজনে করণীয়</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>রোগীর চিকিৎসকের প্রেসক্রিপশন ও ব্লাড ক্রস-ম্যাচিং স্লিপ সাথে রাখুন।</li>
              <li>সংশ্লিষ্ট ব্লাড গ্রুপের একাধিক রক্তদাতার সাথে ফোনে কথা বলে সময় নিশ্চিত করুন।</li>
              <li>রক্তদাতার যাতায়াত ও সার্বিক সহযোগিতায় সম্মানজনক ব্যবহার বজায় রাখুন।</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 6. Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 -z-10" onClick={() => setIsRegisterOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">রক্তদাতা হিসেবে নিবন্ধন</h3>
                  <p className="text-xs text-slate-500">আপনার তথ্য ময়মনসিংহ ব্লাড ব্যাংকে যুক্ত হবে</p>
                </div>
              </div>

              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">অভিনন্দন! নিবন্ধন সফল হয়েছে</h4>
                <p className="text-xs text-slate-600">আপনার রক্তদাতার তথ্য ডেটাবেজে যুক্ত করা হয়েছে।</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                    <select
                      value={formData.blood_group}
                      onChange={(e) => setFormData({ ...formData, blood_group: e.target.value as BloodDonor['blood_group'] })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা *</label>
                    <select
                      value={formData.upazila}
                      onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      {DIVISION_DISTRICTS.map((dist) => (
                        <optgroup key={dist} label={`${dist} জেলা`}>
                          {(DISTRICT_UPAZILAS_MAP[dist] || []).map((up) => (
                            <option key={up} value={up}>{up}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সর্বশেষ রক্তদান</label>
                    <input
                      type="text"
                      placeholder="যেমন: ৩ মাস আগে / নতুন"
                      value={formData.last_donation}
                      onChange={(e) => setFormData({ ...formData, last_donation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান অবস্থা</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'Available' | 'Unavailable' })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      <option value="Available">প্রস্তুত (Available)</option>
                      <option value="Unavailable">অনুপলব্ধ (Unavailable)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'নিবন্ধন নিশ্চিত করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
