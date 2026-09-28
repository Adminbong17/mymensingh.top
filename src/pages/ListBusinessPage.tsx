import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MYMENSINGH_UPAZILAS, MYMENSINGH_UNIONS_MAP } from '../data/initialData';

export const ListBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addBusiness } = useData();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    category_slug: 'restaurants',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: '',
    location: '',
    phone: '',
    website: '',
    description: '',
    opening_hours: '10:00 AM - 10:00 PM',
    price_range: '৳৳ - Moderate',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    facilities: ['WiFi', 'Parking', 'AC']
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const unions = formData.upazila ? (MYMENSINGH_UNIONS_MAP[formData.upazila] || []) : [];

  const handleFacilityToggle = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === formData.category_slug);

    addBusiness({
      name: formData.name,
      name_bn: formData.name_bn,
      category: cat ? cat.name_en : 'Services',
      category_slug: formData.category_slug,
      rating: 5.0,
      review_count: 1,
      location: `${formData.location}, ${formData.union_ward ? formData.union_ward + ', ' : ''}${formData.upazila}, ময়মনসিংহ`,
      district: 'ময়মনসিংহ',
      upazila: formData.upazila,
      union_ward: formData.union_ward,
      phone: formData.phone,
      website: formData.website,
      image_url: formData.image_url,
      description: formData.description,
      opening_hours: formData.opening_hours,
      price_range: formData.price_range,
      latitude: 24.7570,
      longitude: 90.4040,
      is_featured: false
    });

    setIsSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Business Registration</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              আপনার ব্যবসা যুক্ত করুন Mymensingh.top-এ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ময়মনসিংহ শহরের হাজার হাজার গ্রাহকের কাছে আপনার রেস্তোরাঁ, দোকান, ক্লিনিক, হোটেল কিংবা সেবার তথ্য সম্পূর্ণ বিনামূল্যে পৌঁছে দিন।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">১০০% ফ্রি লিস্টিং</h4>
              <p className="text-[11px] text-slate-500">কোনো লুকানো চার্জ বা ফি নেই</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">সরাসরি গ্রাহক কল</h4>
              <p className="text-[11px] text-slate-500">কাস্টমার সরাসরি আপনাকে ফোন করবে</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">গুগল ম্যাপে সন্ধান</h4>
              <p className="text-[11px] text-slate-500">সহজে লোকেশন ও ডিরেকশন সুবিধা</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
              currentStep === 1
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <span>১. মৌলিক তথ্য</span>
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
              currentStep === 2
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <span>২. অবস্থান ও যোগাযোগ</span>
          </button>
          <span className="text-slate-300">→</span>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
              currentStep === 3
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <span>৩. সুবিধা ও ছবি</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                অভিনন্দন! আপনার ব্যবসা সফলভাবে জমা হয়েছে।
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                আপনার প্রতিষ্ঠানের তথ্য ডিরেক্টরিতে যুক্ত করা হয়েছে। পর্যালোচনার পর এটি সক্রিয়ভাবে প্রদর্শিত হবে।
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => navigate('/categories')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md"
                >
                  ক্যাটাগরি পেজে দেখুন
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  আরেকটি যোগ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    ধাপ ১: প্রতিষ্ঠানের মৌলিক তথ্য
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ব্যবসা/প্রতিষ্ঠানের নাম (ইংরেজি) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="যেমন: The River View Restaurant"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রতিষ্ঠানের নাম (বাংলায়)
                      </label>
                      <input
                        type="text"
                        value={formData.name_bn}
                        onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                        placeholder="যেমন: দ্য রিভার ভিউ রেস্টুরেন্ট"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ক্যাটাগরি নির্বাচন করুন *
                      </label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name_bn} ({c.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        প্রাইস রেঞ্জ / বাজেট
                      </label>
                      <select
                        value={formData.price_range}
                        onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium"
                      >
                        <option value="৳ - বাজেট ফ্রেন্ডলি">৳ - বাজেট ফ্রেন্ডলি (Affordable)</option>
                        <option value="৳৳ - মাঝারি (Moderate)">৳৳ - মাঝারি (Moderate)</option>
                        <option value="৳৳৳ - প্রিমিয়াম (Premium)">৳৳৳ - প্রিমিয়াম (Premium)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      সংক্ষিপ্ত বিবরণী
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="আপনার প্রতিষ্ঠান ও সেবার প্রধান আকর্ষণসমূহ সম্পর্কে লিখুন..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>পরবর্তী ধাপ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Contact */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    ধাপ ২: অবস্থান ও যোগাযোগের বিবরণ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        উপজেলা *
                      </label>
                      <select
                        value={formData.upazila}
                        onChange={(e) => setFormData({ ...formData, upazila: e.target.value, union_ward: '' })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium"
                      >
                        {MYMENSINGH_UPAZILAS.map((up) => (
                          <option key={up} value={up}>{up}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ইউনিয়ন / ওয়ার্ড
                      </label>
                      <select
                        value={formData.union_ward}
                        onChange={(e) => setFormData({ ...formData, union_ward: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium"
                      >
                        <option value="">নির্বাচন করুন</option>
                        {unions.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বিস্তারিত ঠিকানা / রোড / ল্যান্ডমার্ক *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="যেমন: পার্ক রোড, পুরাতন ব্রহ্মপুত্র রিভারফ্রন্ট"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মোবাইল বা ফোন নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1711-XXXXXX"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ওয়েবসাইট বা ফেসবুক পেজ লিংক
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                    >
                      পূর্ববর্তী
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>পরবর্তী ধাপ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Amenities & Photos */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    ধাপ ৩: সুযোগ-সুবিধা ও ছবি
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      বিদ্যমান সুবিধাসমূহ টিক দিন:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {['WiFi', 'Parking', 'AC', 'Home Delivery', 'Card Payment', 'Wheelchair Access'].map((f) => {
                        const checked = formData.facilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => handleFacilityToggle(f)}
                            className={`p-2.5 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                              checked
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span>{f}</span>
                            {checked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      খোলার সময়সূচি
                    </label>
                    <input
                      type="text"
                      value={formData.opening_hours}
                      onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                      placeholder="যেমন: সকাল ১০:০০ - রাত ১০:০০"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      প্রতিষ্ঠানের ছবির লিঙ্ক (Image URL)
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                    {formData.image_url && (
                      <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                    >
                      পূর্ববর্তী
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ব্যবসা প্রকাশ করুন (Publish Business)</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
