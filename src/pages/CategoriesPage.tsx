import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Wrench
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MYMENSINGH_UPAZILAS } from '../data/initialData';
import type { Business } from '../types';
import { BusinessDetailModal } from '../components/BusinessDetailModal';

export const CategoriesPage: React.FC = () => {
  const { categories, businesses, isFavorite, toggleFavorite } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

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

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
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
  }, [businesses, selectedCategory, selectedUpazila, keyword]);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore All Categories</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              সকল ক্যাটাগরি ও ব্যবসা ডিরেক্টরি
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ময়মনসিংহ শহরের ২০টি প্রধান ক্যাটাগরির অধীনে হাসপাতাল, রেস্টুরেন্ট, কেনাকাটা, শিক্ষা প্রতিষ্ঠান ও প্রয়োজনীয় সকল সেবা এক ক্লিকেই খুঁজুন।
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
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                ফিল্টার রিসেট
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 hover:bg-white text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-emerald-600 shadow-2xs'}`}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{cat.name_bn}</p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {cat.name_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ব্যবসা বা সেবার নাম দিয়ে খুঁজুন..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 font-medium"
              >
                <option value="">সকল উপজেলা</option>
                {MYMENSINGH_UPAZILAS.map((up) => (
                  <option key={up} value={up}>{up}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              {selectedCategory 
                ? `${categories.find(c => c.slug === selectedCategory)?.name_bn || selectedCategory}-এর ফলাফল`
                : 'সকল তালিকাভুক্ত প্রতিষ্ঠান'
              }
              <span className="ml-2 text-xs font-bold text-slate-500">
                ({filteredBusinesses.length}টি পাওয়া গেছে)
              </span>
            </h3>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">কোনো লিস্টিং পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-400 mt-1">অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে দেখুন।</p>
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
                            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                              favorited ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                            }`}
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
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition-all"
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
