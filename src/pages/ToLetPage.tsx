import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  MapPin,
  Phone,
  Plus,
  Bed,
  Bath,
  Calendar,
  CheckCircle,
  X,
  Sparkles,
  Building,
  Key,
  Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { ToLetListing } from '../types';

export const ToLetPage: React.FC = () => {
  const { toLetListings, addToLet } = useData();

  // Filter states
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeListing, setActiveListing] = useState<ToLetListing | null>(null);

  // Post To-Let Modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Family' as ToLetListing['type'],
    rent: '৳ ১২,০০০ / মাস',
    bedrooms: 2,
    bathrooms: 2,
    area: 'সাঙ্কিাপাড়া, ময়মনসিংহ',
    phone: '',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    available_from: '১ তারিখ থেকে',
  });

  const propertyTypes = [
    { id: 'all', label: 'সকল ক্যাটাগরি (All)' },
    { id: 'Family', label: 'ফ্যামিলি ফ্ল্যাট (Family)' },
    { id: 'Bachelor', label: 'ব্যাচেলর মেস/রুম (Bachelor)' },
    { id: 'Sublet', label: 'সাবলেট (Sublet)' },
    { id: 'Commercial', label: 'কমার্শিয়াল/অফিস (Commercial)' },
  ];

  const popularAreas = [
    'all',
    'সাঙ্কিাপাড়া (Sankipara)',
    'চরপাড়া (Charpara)',
    'টাউন হল (Town Hall)',
    'কাঁচিঝুলি (Kachijhuli)',
    'নতুন বাজার (Notun Bazar)',
    'মাসকান্দা (Maskanda)',
    'গাঙ্গিনার পাড় (Ganginarpar)',
  ];

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return toLetListings.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      if (selectedArea !== 'all') {
        const areaKeyword = selectedArea.split(' ')[0];
        if (!item.area.toLowerCase().includes(areaKeyword.toLowerCase())) {
          return false;
        }
      }

      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchArea = item.area.toLowerCase().includes(q);
        const matchRent = item.rent.toLowerCase().includes(q);
        const matchType = item.type.toLowerCase().includes(q);
        if (!matchTitle && !matchArea && !matchRent && !matchType) return false;
      }

      return true;
    });
  }, [toLetListings, selectedType, selectedArea, searchKeyword]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.phone || !formData.area) {
      alert('অনুগ্রহ করে শিরোনাম, এলাকা এবং ফোন নম্বর প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await addToLet({
        title: formData.title,
        type: formData.type,
        rent: formData.rent,
        bedrooms: Number(formData.bedrooms) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
        area: formData.area,
        phone: formData.phone,
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        available_from: formData.available_from || 'চলতি মাস থেকে',
      });

      if (ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsPostModalOpen(false);
          setFormData({
            title: '',
            type: 'Family',
            rent: '৳ ১২,০০০ / মাস',
            bedrooms: 2,
            bathrooms: 2,
            area: 'সাঙ্কিাপাড়া, ময়মনসিংহ',
            phone: '',
            image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
            available_from: '১ তারিখ থেকে',
          });
        }, 1500);
      } else {
        alert('বিজ্ঞপ্তি সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
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
        <div className="bg-gradient-to-r from-amber-950 via-orange-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-orange-800/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Home className="w-4 h-4 text-orange-300" />
              <span>আবাসন ও মেস • Mymensingh To-Let Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              ময়মনসিংহ <span className="text-amber-400">বাসা ভাড়া ও টু-লেট</span> পোর্টাল
            </h1>

            <p className="text-xs sm:text-base text-amber-100/90 leading-relaxed max-w-2xl">
              ময়মনসিংহ শহরের চরপাড়া, সাঙ্কিাপাড়া, নতুন বাজার এবং কলেজ রোডের মনোরম পরিবেশে ফ্যামিলি বাসা, ব্যাচেলর মেস, সাবলেট কিংবা অফিস স্পেস সরাসরি বাড়িওয়ালার সাথে কথা বলে ভাড়া নিন।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white text-orange-900 font-black text-sm hover:bg-orange-50 shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>বিজ্ঞাপন দিন (Post To-Let Listing)</span>
              </button>

              <div className="px-4 py-3 rounded-2xl bg-orange-600/30 border border-orange-400/30 text-white text-xs font-bold backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>জিরো ব্রোকার ফি • সরাসরি বাড়িওয়ালা ও ভাড়াটিয়া</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-12 -right-12 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2. Quick Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ফ্যামিলি অ্যাপার্টমেন্ট</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">লিফট ও জেনারেটরসহ</h4>
              <p className="text-xs text-slate-400">২ ও ৩ বেডরুমের খোলামেলা ফ্ল্যাট</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ছাত্র ও চাকুরিজীবী মেস</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">ব্যাচেলর সিট ও রুম</h4>
              <p className="text-xs text-slate-400">ওয়াইফাই ও মিল সিস্টেম সুবিধা</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">নিরাপদ এলাকা</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">যাতায়াত সুবিধা</h4>
              <p className="text-xs text-slate-400">হাসপাতাল ও শিক্ষা প্রতিষ্ঠানের কাছে</p>
            </div>
          </div>
        </div>

        {/* 3. Search & Type Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Property Type pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">ভাড়ার ধরন বাছাই করুন:</span>
              <span className="text-xs font-semibold text-slate-500">মোট লিস্টিং: {toLetListings.length}টি</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((pt) => {
                const active = selectedType === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedType(pt.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pt.label}
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
                placeholder="এলাকা (যেমন: সাঙ্কিাপাড়া), বেডরুম বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-5">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-slate-700"
              >
                <option value="all">সকল এলাকা (All Areas)</option>
                {popularAreas.filter(a => a !== 'all').map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. To-Let Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-600" />
              <span>উপলব্ধ বাসা ভাড়ার তালিকা ({filteredListings.length}টি)</span>
            </h2>

            {(selectedType !== 'all' || selectedArea !== 'all' || searchKeyword) && (
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedArea('all');
                  setSearchKeyword('');
                }}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Home className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">কোনো বাসা ভাড়ার তথ্য মেলেনি</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপনার কাঙ্ক্ষিত এলাকায় কোনো বাসা খুঁজে পাননি? আপনি কি বাড়িওয়ালা? এখনই আপনার খালি ফ্ল্যাট বা মেসের বিজ্ঞাপন দিন!
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>বিজ্ঞাপন দিন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with type badge */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                          item.type === 'Family'
                            ? 'bg-amber-600 text-white'
                            : item.type === 'Bachelor'
                            ? 'bg-purple-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>ভাড়া হবে: {item.available_from}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-amber-600">
                          {item.rent}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{item.area}</span>
                      </div>

                      {/* Room specs */}
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-slate-400" />
                          <span>{item.bedrooms} বেড</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-slate-400" />
                          <span>{item.bathrooms} বাথ</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveListing(item)}
                      className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>

                    <a
                      href={`tel:${item.phone}`}
                      className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-md shadow-amber-600/20"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Helpful Guidelines for Tenants */}
        <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 rounded-3xl p-6 sm:p-8 border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>ভাড়াটিয়াদের জন্য করণীয়</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>বাসা চূড়ান্ত করার পূর্বে বিদ্যুৎ, পানি ও গ্যাস সরবরাহের সার্বিক অবস্থা যাচাই করুন।</li>
              <li>ভাড়া চুক্তিপত্র (Tenancy Agreement) লিখিতভাবে তৈরি করে নিন।</li>
              <li>সার্ভিস চার্জ, ময়লা বিল এবং বিদ্যুৎ বিল ভাড়ার অন্তর্ভুক্ত কি না তা পরিষ্কার জেনে নিন।</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>বাড়িওয়ালাদের জন্য পরামর্শ</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed list-disc list-inside">
              <li>নতুন ভাড়াটিয়ার জাতীয় পরিচয়পত্র (NID) এবং পাসপোর্টের কপি সংগ্রহে রাখুন।</li>
              <li>স্থানীয় থানার নির্ধারিত ভাড়াটিয়া তথ্য ফরম (Tenant Info Form) পূরণ করিয়ে জমা দিন।</li>
              <li>অগ্রিম জামানত এবং প্রতি মাসের ভাড়া পরিশোধের সুনির্দিষ্ট তারিখ নির্ধারণ করুন।</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 6. Post To-Let Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 -z-10" onClick={() => setIsPostModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">বাসা ভাড়ার বিজ্ঞাপন দিন</h3>
                  <p className="text-xs text-slate-500">আপনার ফ্ল্যাট বা মেসের তথ্য যুক্ত করুন</p>
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
                <h4 className="text-base font-bold text-slate-900">বিজ্ঞপ্তি প্রকাশিত হয়েছে!</h4>
                <p className="text-xs text-slate-600">ভাড়াটিয়ারা আপনার সাথে সরাসরি যোগাযোগ করবেন।</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ৩ বেডরুমের আলো-বাতাসপূর্ণ ফ্যামিলি ফ্ল্যাট ভাড়া হবে"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভাড়ার ধরন *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ToLetListing['type'] })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Family">Family (ফ্যামিলি)</option>
                      <option value="Bachelor">Bachelor (মেস/সিট)</option>
                      <option value="Sublet">Sublet (সাবলেট)</option>
                      <option value="Commercial">Commercial (অফিস/দোকান)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাসিক ভাড়া *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ৳ ১২,০০০ / মাস"
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বেডরুম সংখ্যা</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বাথরুম সংখ্যা</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা / ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: সাঙ্কিাপাড়া / চরপাড়া"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভাড়া হবে (তারিখ)</label>
                    <input
                      type="text"
                      placeholder="যেমন: ১ নভেম্বর থেকে"
                      value={formData.available_from}
                      onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাড়িওয়ালার মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবির লিঙ্ক (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'বিজ্ঞাপন পোস্ট করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. Listing Detail Modal */}
      {activeListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 -z-10" onClick={() => setActiveListing(null)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="relative aspect-16/10 bg-slate-100">
              <img
                src={activeListing.image_url}
                alt={activeListing.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveListing(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-600 text-white shadow-md">
                  {activeListing.type}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <span className="text-xl font-black text-amber-600 block">{activeListing.rent}</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeListing.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{activeListing.area}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">বেডরুম</span>
                  <span className="text-sm font-black text-slate-800">{activeListing.bedrooms} টি</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">বাথরুম</span>
                  <span className="text-sm font-black text-slate-800">{activeListing.bathrooms} টি</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">ভাড়া হবে</span>
                  <span className="text-xs font-black text-emerald-700">{activeListing.available_from}</span>
                </div>
              </div>

              <a
                href={`tel:${activeListing.phone}`}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30"
              >
                <Phone className="w-4 h-4" />
                <span>বাড়িওয়ালার সাথে সরাসরি কথা বলুন ({activeListing.phone})</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
