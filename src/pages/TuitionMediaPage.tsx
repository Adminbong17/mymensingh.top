import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  MapPin,
  Phone,
  Plus,
  BookOpen,
  CheckCircle,
  X,
  Sparkles,
  School,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const TuitionMediaPage: React.FC = () => {
  const { tuitionListings, addTuition } = useData();

  // Filter states
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Post Tuition Modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    class_level: 'HSC 1st/2nd Year',
    subjects: '',
    location: '',
    salary: '৳ ৫,০০০',
    days_per_week: '৪ দিন / সপ্তাহ',
    phone: '',
  });

  const classLevels = [
    'all',
    'Class 1-5 (প্রাথমিক)',
    'Class 6-8 (জেএসসি)',
    'Class 9-10 (এসএসসি)',
    'HSC (এইচএসসি)',
    'Admission (বিশ্ববিদ্যালয় ভর্তি)',
  ];

  const popularAreas = [
    'all',
    'চরপাড়া (Charpara)',
    'সাঙ্কিাপাড়া (Sankipara)',
    'টাউন হল (Town Hall)',
    'বাকৃবি ক্যাম্পাস (BAU Campus)',
    'গাঙ্গিনার পাড় (Ganginarpar)',
    'কাঁচিঝুলি (Kachijhuli)',
    'নতুন বাজার (Notun Bazar)',
  ];

  // Filtered Tuitions
  const filteredTuitions = useMemo(() => {
    return tuitionListings.filter((item) => {
      if (selectedClass !== 'all') {
        const cl = item.class_level.toLowerCase();
        if (selectedClass.includes('1-5') && !cl.includes('1') && !cl.includes('2') && !cl.includes('3') && !cl.includes('4') && !cl.includes('5') && !cl.includes('primary')) return false;
        if (selectedClass.includes('6-8') && !cl.includes('6') && !cl.includes('7') && !cl.includes('8')) return false;
        if (selectedClass.includes('9-10') && !cl.includes('9') && !cl.includes('10') && !cl.includes('ssc')) return false;
        if (selectedClass.includes('HSC') && !cl.includes('hsc') && !cl.includes('11') && !cl.includes('12')) return false;
      }

      if (selectedArea !== 'all') {
        const areaKeyword = selectedArea.split(' ')[0];
        if (!item.location.toLowerCase().includes(areaKeyword.toLowerCase())) {
          return false;
        }
      }

      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSubjects = item.subjects.some((s) => s.toLowerCase().includes(q));
        const matchLocation = item.location.toLowerCase().includes(q);
        const matchClass = item.class_level.toLowerCase().includes(q);
        if (!matchTitle && !matchSubjects && !matchLocation && !matchClass) return false;
      }

      return true;
    });
  }, [tuitionListings, selectedClass, selectedArea, searchKeyword]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.phone || !formData.location) {
      alert('অনুগ্রহ করে শিরোনাম, এলাকা এবং ফোন নম্বর প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const subjectsArray = formData.subjects
        ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean)
        : ['All Subjects'];

      const ok = await addTuition({
        title: formData.title,
        class_level: formData.class_level,
        subjects: subjectsArray,
        location: formData.location,
        salary: formData.salary,
        days_per_week: formData.days_per_week,
        phone: formData.phone,
        posted_date: 'আজ',
      });

      if (ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsPostModalOpen(false);
          setFormData({
            title: '',
            class_level: 'HSC 1st/2nd Year',
            subjects: '',
            location: '',
            salary: '৳ ৫,০০০',
            days_per_week: '৪ দিন / সপ্তাহ',
            phone: '',
          });
        }, 1500);
      } else {
        alert('পোস্ট সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
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
        
        {/* 1. Hero Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-purple-800/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-purple-300" />
              <span>শিক্ষা ও ক্যারিয়ার • Mymensingh Tuition Media</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              ময়মনসিংহ <span className="text-purple-400">টিউশন মিডিয়া</span> ও শিক্ষক সংযোগ
            </h1>

            <p className="text-xs sm:text-base text-purple-100/90 leading-relaxed max-w-2xl">
              বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (বাকৃবি), আনন্দ মোহন কলেজ এবং মেডিকেল কলেজের মেধাবী টিউটরদের সন্ধান নিন। অথবা অভিভাবক হিসেবে আপনার সন্তানের জন্য গৃহশিক্ষকের বিজ্ঞপ্তি পোস্ট করুন।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white text-purple-900 font-black text-sm hover:bg-purple-50 shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>টিউশন বিজ্ঞপ্তি দিন (Post Tuition)</span>
              </button>

              <div className="px-4 py-3 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-white text-xs font-bold backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>১০০% সরাসরি যোগাযোগ • কোনো মধ্যস্বত্বভোগী নেই</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-12 -right-12 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2. Quick Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">অভিজ্ঞ শিক্ষক</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">বাকৃবি ও আনন্দ মোহন</h4>
              <p className="text-xs text-slate-400">মেধাবী বিশ্ববিদ্যালয়ের শিক্ষার্থী</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">সকল ভার্সন</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">বাংলা ও ইংলিশ মিডিয়াম</h4>
              <p className="text-xs text-slate-400">বিজ্ঞান, গণিত ও ইংরেজি স্পেশাল</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">সরাসরি ডিরেক্টরি</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">সরাসরি ফোন ও চুক্তি</h4>
              <p className="text-xs text-slate-400">কোনো হিডেন ফি বা চার্জ নেই</p>
            </div>
          </div>
        </div>

        {/* 3. Search & Class Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Class level pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">শ্রেণি বা লেভেল বাছাই করুন:</span>
              <span className="text-xs font-semibold text-slate-500">মোট টিউশন: {tuitionListings.length}টি</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {classLevels.map((cl) => {
                const active = selectedClass === cl;
                return (
                  <button
                    key={cl}
                    onClick={() => setSelectedClass(cl)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                      active
                        ? 'bg-purple-700 text-white shadow-md shadow-purple-600/30 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cl === 'all' ? 'সকল শ্রেণি (All Classes)' : cl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area & Keyword Search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="বিষয় (যেমন: Physics, Math), এলাকা বা শিরোনাম দিয়ে খুঁজুন..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-5">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-slate-50/50 text-slate-700"
              >
                <option value="all">সকল এলাকা (All Areas)</option>
                {popularAreas.filter(a => a !== 'all').map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Tuition Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-700" />
              <span>উপলব্ধ টিউশন সার্কুলার ({filteredTuitions.length}টি)</span>
            </h2>

            {(selectedClass !== 'all' || selectedArea !== 'all' || searchKeyword) && (
              <button
                onClick={() => {
                  setSelectedClass('all');
                  setSelectedArea('all');
                  setSearchKeyword('');
                }}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {filteredTuitions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">কোনো টিউশন অফার মেলেনি</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনার কাঙ্ক্ষিত বিষয়ের টিউশনটি খুঁজে পাননি? একজন অভিভাবক হিসেবে আপনি নিজেই একটি টিউশন বিজ্ঞপ্তি দিতে পারেন।
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>টিউশন পোস্ট করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTuitions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {item.class_level}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.posted_date}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Subject Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{item.location}</span>
                    </div>

                    {/* Salary & Days */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">সম্মানী / বেতন</span>
                        <span className="text-sm font-black text-emerald-700">{item.salary}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">সপ্তাহে দিন</span>
                        <span className="text-xs font-bold text-slate-800">{item.days_per_week}</span>
                      </div>
                    </div>
                  </div>

                  {/* Call Action */}
                  <a
                    href={`tel:${item.phone}`}
                    className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>অভিভাবক / যোগাযোগ ({item.phone})</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Helpful Tips for Guardians & Tutors */}
        <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-700" />
              <span>অভিভাবকদের জন্য পরামর্শ</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>শিক্ষক চূড়ান্ত করার আগে তার প্রাতিষ্ঠানিক পরিচয়পত্র বা স্টুডেন্ট আইডি যাচাই করুন।</li>
              <li>পড়ার সময়সূচি এবং মাসিক সম্মানী শুরুতেই স্পষ্ট আলোচনা করে নিন।</li>
              <li>সন্তানের নিয়মিত পড়াশোনার অগ্রগতি প্রতি সপ্তাহে শিক্ষকের সাথে কথা বলে জানুন।</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-700" />
              <span>টিউটরদের জন্য পরামর্শ</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>প্রথম দিন ক্লাসে সঠিক সময়ে উপস্থিত থাকুন এবং শিক্ষণ পরিকল্পনা উপস্থাপন করুন।</li>
              <li>শিক্ষার্থীর দুর্বল জায়গাগুলো চিহ্নিত করে যত্নসহকারে বুঝিয়ে পড়ান।</li>
              <li>নিয়মিত উপস্থিতি বজায় রাখুন এবং পেশাদারিত্ব বজায় রাখুন।</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 6. Post Tuition Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 -z-10" onClick={() => setIsPostModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">টিউশন বিজ্ঞপ্তি পোস্ট করুন</h3>
                  <p className="text-xs text-slate-500">আপনার সন্তানের জন্য গৃহশিক্ষক খুঁজুন</p>
                </div>
              </div>

              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে!</h4>
                <p className="text-xs text-slate-600">মেধাবী শিক্ষকগণ আপনার সাথে সরাসরি যোগাযোগ করবেন।</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: HSC Physics ও Math এর জন্য অভিজ্ঞ শিক্ষক চাই"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি / লেভেল *</label>
                    <select
                      value={formData.class_level}
                      onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-white"
                    >
                      <option value="Class 1-5">Class 1-5 (প্রাথমিক)</option>
                      <option value="Class 6-8">Class 6-8 (জেএসসি)</option>
                      <option value="Class 9-10 (SSC)">Class 9-10 (এসএসসি)</option>
                      <option value="HSC 1st/2nd Year">HSC 1st/2nd Year</option>
                      <option value="University Admission">ভর্তি পরীক্ষা (Admission)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সপ্তাহে দিন</label>
                    <input
                      type="text"
                      placeholder="যেমন: ৩ দিন / ৪ দিন"
                      value={formData.days_per_week}
                      onChange={(e) => setFormData({ ...formData, days_per_week: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পড়ানোর বিষয়সমূহ (কমা দিয়ে লিখুন)</label>
                  <input
                    type="text"
                    placeholder="যেমন: Physics, Chemistry, Math"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা / ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: চরপাড়া / সাঙ্কিাপাড়া"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাসিক সম্মানী / বেতন</label>
                    <input
                      type="text"
                      placeholder="যেমন: ৳ ৫,০০০"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors shadow-lg shadow-purple-700/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'বিজ্ঞপ্তি পোস্ট করুন'}
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
