import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Search,
  MapPin,
  Star,
  Phone,
  Navigation,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  Hotel,
  Hospital,
  Pill,
  Droplets,
  GraduationCap,
  Home,
  ShoppingBag,
  Coffee,
  Landmark,
  BookOpen,
  Train,
  Moon,
  Calendar,
  Tag,
  Newspaper,
  Building2,
  Briefcase,
  Wrench,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MYMENSINGH_UPAZILAS } from '../data/initialData';
import type { Business } from '../types';
import { BusinessDetailModal } from '../components/BusinessDetailModal';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    businesses,
    bloodDonors,
    tuitionListings,
    toLetListings,
    news,
    events,
    offers,
    isFavorite,
    toggleFavorite
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews' | 'name'>('featured');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Special Category Sub-filters
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('');
  const [toLetTypeFilter, setToLetTypeFilter] = useState<string>('');

  // Keep state in sync with URL query param
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setSelectedCategory(cat);
  }, [searchParams]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Hotel': return <Hotel className="w-5 h-5" />;
      case 'Hospital': return <Hospital className="w-5 h-5" />;
      case 'Pill': return <Pill className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Landmark': return <Landmark className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Train': return <Train className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      case 'Tag': return <Tag className="w-5 h-5" />;
      case 'Newspaper': return <Newspaper className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  const handleCategoryClick = (slug: string) => {
    const newSlug = selectedCategory === slug ? '' : slug;
    setSelectedCategory(newSlug);
    if (newSlug) {
      setSearchParams({ category: newSlug });
    } else {
      setSearchParams({});
    }
  };

  // Live item count for each category
  const getCategoryCount = (slug: string) => {
    if (slug === 'blood-bank') return bloodDonors.length;
    if (slug === 'tuition-media') return tuitionListings.length;
    if (slug === 'to-let') return toLetListings.length;
    if (slug === 'news') return news.length;
    if (slug === 'events') return events.length;
    if (slug === 'offers') return offers.length;
    return businesses.filter(b => b.category_slug === slug).length;
  };

  // Filtered Businesses Logic
  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter((biz) => {
      if (selectedCategory && biz.category_slug !== selectedCategory) {
        return false;
      }
      if (selectedUpazila && biz.upazila !== selectedUpazila && !biz.location.includes(selectedUpazila)) {
        return false;
      }
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchName = biz.name.toLowerCase().includes(q) || (biz.name_bn && biz.name_bn.toLowerCase().includes(q));
        const matchCat = biz.category.toLowerCase().includes(q);
        const matchLoc = biz.location.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchLoc) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [businesses, selectedCategory, selectedUpazila, keyword, sortBy]);

  // Filtered Blood Donors
  const filteredDonors = useMemo(() => {
    return bloodDonors.filter(d => {
      if (bloodGroupFilter && d.blood_group !== bloodGroupFilter) return false;
      if (selectedUpazila && d.upazila !== selectedUpazila) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        return d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.upazila.toLowerCase().includes(q);
      }
      return true;
    });
  }, [bloodDonors, bloodGroupFilter, selectedUpazila, keyword]);

  // Filtered Tuition Listings
  const filteredTuitions = useMemo(() => {
    return tuitionListings.filter(t => {
      if (selectedUpazila && !t.location.includes(selectedUpazila)) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        return (
          t.title.toLowerCase().includes(q) ||
          t.class_level.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.subjects && t.subjects.some(s => s.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [tuitionListings, selectedUpazila, keyword]);

  // Filtered To-Let Listings
  const filteredToLets = useMemo(() => {
    return toLetListings.filter(tl => {
      if (toLetTypeFilter && tl.type !== toLetTypeFilter) return false;
      if (selectedUpazila && !tl.area.includes(selectedUpazila)) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        return tl.title.toLowerCase().includes(q) || tl.area.toLowerCase().includes(q);
      }
      return true;
    });
  }, [toLetListings, toLetTypeFilter, selectedUpazila, keyword]);

  const currentCategoryObj = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore All Categories</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {currentCategoryObj ? (currentCategoryObj.name_bn || currentCategoryObj.name_en) : 'সকল ক্যাটাগরি ও সেবা ডিরেক্টরি'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ময়মনসিংহ শহরের ক্যাটাগরিভিত্তিক হাসপাতাল, রেস্টুরেন্ট, ডাক্তার, ব্লাড ব্যাংক, বাসা ভাড়া, টিউশন, কেনাকাটা ও প্রয়োজনীয় সকল তথ্য এক নজরে খুঁজুন।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 20 Categories Badges Grid */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-600" />
              <span>ক্যাটাগরি নির্বাচন করুন ({categories.length}টি)</span>
            </h2>
            {selectedCategory && (
              <button
                onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                ফিল্টার রিসেট (All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = getCategoryCount(cat.slug);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 hover:bg-white text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-emerald-600 shadow-2xs'}`}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold truncate">{cat.name_bn}</p>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                        {count}
                      </span>
                    </div>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {cat.name_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="নাম, ফোন নম্বর বা সেবা দিয়ে খুঁজুন..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Upazila Filter */}
            <div className="relative w-full sm:w-52">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-6 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
              >
                <option value="">সকল উপজেলা</option>
                {MYMENSINGH_UPAZILAS.map((up) => (
                  <option key={up} value={up}>{up}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            {selectedCategory !== 'blood-bank' && selectedCategory !== 'tuition-media' && selectedCategory !== 'to-let' && (
              <div className="relative w-full sm:w-44">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
                >
                  <option value="featured">ফিচার্ড প্রথম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                  <option value="reviews">সর্বাধিক রিভিউ</option>
                  <option value="name">নাম (A-Z)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: BLOOD BANK CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'blood-bank' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  Emergency Blood Network
                </span>
                <h3 className="text-xl font-black mt-1">ময়মনসিংহ ব্লাড ব্যাংক ও জরুরি রক্তদাতা</h3>
                <p className="text-xs text-red-100 mt-1">জরুরি প্রয়োজনে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন।</p>
              </div>
              <button
                onClick={() => navigate('/blood-bank')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>সম্পূর্ণ ব্লাড ব্যাংক পোর্টাল</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blood Group Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-600 mr-2">গ্রুপ ফিল্টার:</span>
              {['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                <button
                  key={grp || 'all'}
                  onClick={() => setBloodGroupFilter(grp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    bloodGroupFilter === grp
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'
                  }`}
                >
                  {grp || 'সকল গ্রুপ'}
                </button>
              ))}
            </div>

            {filteredDonors.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <Droplets className="w-12 h-12 text-red-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো রক্তদাতা পাওয়া যায়নি।</p>
                <button
                  onClick={() => navigate('/blood-bank')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>রক্তদাতা হিসেবে যুক্ত হোন</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDonors.map((donor) => (
                  <div key={donor.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 font-black text-base flex items-center justify-center border border-red-100 shrink-0">
                        {donor.blood_group}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{donor.name}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{donor.upazila}</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {donor.availability || 'Available'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`tel:${donor.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল দিন</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: TUITION MEDIA CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'tuition-media' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  Verified Tutor Portal
                </span>
                <h3 className="text-xl font-black mt-1">ময়মনসিংহ টিউটর ও টিউশন মিডিয়া</h3>
                <p className="text-xs text-purple-100 mt-1">অভিজ্ঞ শিক্ষক এবং হোম টিউশন খুঁজে নিন সহজেই।</p>
              </div>
              <button
                onClick={() => navigate('/tuition-media')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-purple-800 font-bold text-xs hover:bg-purple-50 transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>সম্পূর্ণ টিউশন পোর্টাল</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {filteredTuitions.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <GraduationCap className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো টিউশন লিস্টিং পাওয়া যায়নি।</p>
                <button
                  onClick={() => navigate('/tuition-media')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>টিউশন পোস্ট করুন</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTuitions.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          {t.class_level}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">{t.salary}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{t.title}</h4>
                      {t.subjects && t.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {t.subjects.map((sub, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t.location}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{t.days_per_week}</span>
                      <a
                        href={`tel:${t.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold shadow-xs hover:bg-purple-800 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>যোগাযোগ</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: TO-LET CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'to-let' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  Rental & Property Hub
                </span>
                <h3 className="text-xl font-black mt-1">ময়মনসিংহ বাসা ও ফ্ল্যাট ভাড়া (To-Let)</h3>
                <p className="text-xs text-amber-100 mt-1">ফ্যামিলি, ব্যাচেলর কিংবা সাবলেট বাসা ভাড়ার সঠিক তথ্য।</p>
              </div>
              <button
                onClick={() => navigate('/to-let')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-amber-800 font-bold text-xs hover:bg-amber-50 transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>সম্পূর্ণ টু-লেট পোর্টাল</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Property Type Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-600 mr-2">ধরন:</span>
              {['', 'Family', 'Bachelor', 'Sublet', 'Commercial'].map((tp) => (
                <button
                  key={tp || 'all'}
                  onClick={() => setToLetTypeFilter(tp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    toLetTypeFilter === tp
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {tp || 'সকল বাসা'}
                </button>
              ))}
            </div>

            {filteredToLets.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <Home className="w-12 h-12 text-amber-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো বাসা ভাড়ার বিজ্ঞাপন পাওয়া যায়নি।</p>
                <button
                  onClick={() => navigate('/to-let')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>টু-লেট বিজ্ঞাপন দিন</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredToLets.map((tl) => (
                  <div key={tl.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                        <img src={tl.image_url} alt={tl.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-white/95 font-bold text-[10px] px-2.5 py-1 rounded-full text-amber-800 shadow-xs">
                          {tl.type}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                          {tl.rent}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{tl.title}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{tl.area}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                          <span>🛏️ {tl.bedrooms} বেড</span>
                          <span>🚿 {tl.bathrooms} বাথ</span>
                          {tl.available_from && <span className="text-[11px] text-slate-400">({tl.available_from})</span>}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`tel:${tl.phone}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>মালিকের সাথে যোগাযোগ</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: NEWS CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">ময়মনসিংহ সংবাদ ও বুলেটিন ({news.length}টি)</h3>
              <button
                onClick={() => navigate('/news')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>নিউজ পেজে যান</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {news.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো সংবাদ পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {news.map((item) => (
                  <div key={item.id} onClick={() => navigate('/news')} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer p-4 space-y-3">
                    <img src={item.image_url} alt={item.title} className="w-full aspect-16/10 object-cover rounded-2xl" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: EVENTS CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">আসন্ন ইভেন্ট ও উৎসব ({events.length}টি)</h3>
              <button
                onClick={() => navigate('/events')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>সকল ইভেন্ট দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {events.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো ইভেন্ট পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {events.map((ev) => (
                  <div key={ev.id} onClick={() => navigate('/events')} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer p-4 space-y-3">
                    <img src={ev.image_url} alt={ev.title} className="w-full aspect-16/10 object-cover rounded-2xl" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">📍 {ev.venue}</p>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">📅 {ev.date} - ⏰ {ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* CONDITIONAL CONTENT: OFFERS CATEGORY */}
        {/* =============================================================== */}
        {selectedCategory === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">অফার ও ডিসকাউন্ট ({offers.length}টি)</h3>
              <button
                onClick={() => navigate('/offers')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>সকল অফার দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {offers.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <Tag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো অফার পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {offers.map((off) => (
                  <div key={off.id} onClick={() => navigate('/offers')} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer p-4 space-y-3">
                    <img src={off.image_url} alt={off.title} className="w-full aspect-16/10 object-cover rounded-2xl" />
                    <div>
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {off.discount}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{off.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{off.business_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* STANDARD BUSINESS DIRECTORY LISTINGS (Restaurants, Hospitals, etc.) */}
        {/* =============================================================== */}
        {selectedCategory !== 'blood-bank' && selectedCategory !== 'tuition-media' && selectedCategory !== 'to-let' && selectedCategory !== 'news' && selectedCategory !== 'events' && selectedCategory !== 'offers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>
                  {currentCategoryObj
                    ? `${currentCategoryObj.name_bn || currentCategoryObj.name_en}-এর ফলাফল`
                    : 'সকল তালিকাভুক্ত প্রতিষ্ঠান'
                  }
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {filteredBusinesses.length}টি পাওয়া গেছে
                </span>
              </h3>

              <button
                onClick={() => navigate('/list-business')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>নতুন প্রতিষ্ঠান যুক্ত করুন</span>
              </button>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 space-y-3">
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">কোনো লিস্টিং পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  এই ক্যাটাগরিতে এখনও কোনো ব্যবসা বা প্রতিষ্ঠান যুক্ত করা হয়নি। আপনি চাইলে আপনার প্রতিষ্ঠানটি প্রথম হিসেবে এখানে যুক্ত করতে পারেন!
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedUpazila(''); setKeyword(''); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    সকল ক্যাটাগরি দেখুন
                  </button>
                  <button
                    onClick={() => navigate('/list-business')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    প্রতিষ্ঠান যুক্ত করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBusinesses.map((biz) => {
                  const favorited = isFavorite(biz.id);
                  return (
                    <div
                      key={biz.id}
                      onClick={() => setSelectedBusiness(biz)}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                          <img
                            src={biz.image_url}
                            alt={biz.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-emerald-800 shadow-xs">
                              {biz.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(biz.id);
                              }}
                              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                                favorited ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                              }`}
                              title={favorited ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যুক্ত করুন'}
                            >
                              ★
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{biz.rating}</span>
                            <span className="text-slate-400 font-normal">({biz.review_count} রিভিউ)</span>
                          </div>

                          <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {biz.name}
                          </h4>
                          {biz.name_bn && (
                            <p className="text-xs text-slate-500 font-medium -mt-1">{biz.name_bn}</p>
                          )}

                          <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{biz.location}</span>
                          </div>

                          {biz.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                              {biz.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                        {biz.phone && (
                          <a
                            href={`tel:${biz.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল করুন</span>
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude},${biz.longitude}`, '_blank');
                          }}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>ম্যাপ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Business Details Modal */}
      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
};
