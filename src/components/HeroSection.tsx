import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Building2,
  Star,
  ChevronRight,
  X,
  ArrowRight,
  Layers
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { renderCategoryIcon } from '../lib/categoryIcons';
import type { Business } from '../types';
import {
  DIVISION_DISTRICTS,
  DISTRICT_UPAZILAS_MAP,
  ALL_DIVISION_UPAZILAS,
  MYMENSINGH_UNIONS_MAP
} from '../data/initialData';
import { NewsTicker } from './NewsTicker';

interface HeroSectionProps {
  onSearch: (params: { keyword: string; district: string; upazila: string; unionWard: string }) => void;
  onQuickCategory: (cat: string) => void;
  onSelectBusiness?: (biz: Business) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onQuickCategory,
  onSelectBusiness,
}) => {
  const { businesses, categories } = useData();
  const [keyword, setKeyword] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableUpazilas = district
    ? (DISTRICT_UPAZILAS_MAP[district] || [])
    : ALL_DIVISION_UPAZILAS;

  const unions = selectedUpazila ? (MYMENSINGH_UNIONS_MAP[selectedUpazila] || []) : [];

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setSelectedUpazila('');
    setSelectedUnion('');
  };

  const handleUpazilaChange = (up: string) => {
    setSelectedUpazila(up);
    setSelectedUnion('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onSearch({
      keyword,
      district,
      upazila: selectedUpazila,
      unionWard: selectedUnion,
    });
  };

  // Live Matching Categories (by bangla, english, or slug)
  const matchingCategories = useMemo(() => {
    if (!keyword.trim()) return [];
    const q = keyword.toLowerCase().trim();
    return categories
      .filter((c) =>
        (c.name_bn && c.name_bn.toLowerCase().includes(q)) ||
        (c.name_en && c.name_en.toLowerCase().includes(q)) ||
        c.slug.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [categories, keyword]);

  // Live Matching Businesses
  const matchingBusinesses = useMemo(() => {
    if (!keyword.trim()) return [];
    const q = keyword.toLowerCase().trim();
    return businesses
      .filter((b) => {
        if (district && b.district && b.district !== district && !b.location.includes(district)) return false;
        if (selectedUpazila && b.upazila !== selectedUpazila && !b.location.includes(selectedUpazila)) return false;

        const matchName =
          (b.name && b.name.toLowerCase().includes(q)) ||
          (b.name_bn && b.name_bn.toLowerCase().includes(q));
        const matchCat =
          (b.category && b.category.toLowerCase().includes(q)) ||
          (b.subcategory && b.subcategory.toLowerCase().includes(q));
        const matchLoc = b.location && b.location.toLowerCase().includes(q);
        const matchDesc = b.description && b.description.toLowerCase().includes(q);
        return matchName || matchCat || matchLoc || matchDesc;
      })
      .slice(0, 6);
  }, [businesses, keyword, district, selectedUpazila]);

  const popularSearches = [
    { label: 'হাসপাতাল', query: 'hospitals' },
    { label: 'রেস্টুরেন্ট', query: 'restaurants' },
    { label: 'ফার্মেসি', query: 'pharmacy' },
    { label: 'বাসা ভাড়া', query: 'to-let' },
    { label: 'টিউশন', query: 'tuition-media' },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 sm:pt-20 sm:pb-28 px-3 sm:px-6 lg:px-8 w-full max-w-full">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-4 sm:space-y-8">
        
        {/* Badge: Discover Mymensingh Division */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Discover Mymensingh Division • ৪ জেলা</span>
        </div>

        {/* Main Heading: আমার শহর, আমাদের গাইড */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight break-words px-1">
          আমার শহর,{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            আমাদের গাইড
          </span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
          ময়মনসিংহ বিভাগের (ময়মনসিংহ, জামালপুর, শেরপুর ও নেত্রকোণা) প্রতিটি ব্যবসা, জরুরি সেবা, হাসপাতাল, রেস্টুরেন্ট, বাসা ভাড়া ও তথ্যের সর্ববৃহৎ ডিজিটাল ডিরেক্টরি।
        </p>

        {/* Big Search Box Container */}
        <div className="pt-2 w-full max-w-5xl xl:max-w-6xl mx-auto relative">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-white/98 backdrop-blur-xl rounded-3xl sm:rounded-4xl p-3 sm:p-4 shadow-2xl shadow-emerald-950/40 border-2 border-emerald-500/40 ring-4 ring-emerald-500/15 text-slate-800 transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
              
              {/* Field 1: কী খুঁজছেন (Keyword) with Instant Dropdown */}
              <div
                ref={containerRef}
                className="lg:col-span-4 col-span-1 sm:col-span-2 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex flex-col justify-center relative"
              >
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  কী খুঁজছেন?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="ব্যবসা, সেবা, ডাক্তার বা হোটেল..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-hidden placeholder:text-slate-400"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword('');
                        setIsDropdownOpen(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* ========================================================= */}
                {/* INSTANT LIVE SEARCH DROPDOWN                              */}
                {/* ========================================================= */}
                {isDropdownOpen && keyword.trim().length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full sm:w-[480px] lg:w-[540px] mt-2.5 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3 text-left max-h-[420px] overflow-y-auto"
                  >
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-600">
                        "<strong className="text-emerald-700">{keyword}</strong>" সম্পর্কিত ফলাফল
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Matching Categories */}
                    {matchingCategories.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3 text-emerald-600" />
                          <span>ক্যাটাগরি সমূহ</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchingCategories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                onQuickCategory(cat.slug);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all cursor-pointer"
                            >
                              <span>{renderCategoryIcon(cat.icon || cat.slug, "w-3.5 h-3.5")}</span>
                              <span>{cat.name_bn || cat.name_en}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Businesses */}
                    {matchingBusinesses.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-emerald-600" />
                          <span>প্রতিষ্ঠান ও সেবা ({matchingBusinesses.length}টি)</span>
                        </div>
                        <div className="space-y-1">
                          {matchingBusinesses.map((biz) => (
                            <button
                              key={biz.id}
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                if (onSelectBusiness) {
                                  onSelectBusiness(biz);
                                } else {
                                  onSearch({
                                    keyword: biz.name,
                                    district,
                                    upazila: selectedUpazila,
                                    unionWard: selectedUnion,
                                  });
                                }
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <img
                                  src={biz.image_url}
                                  alt={biz.name}
                                  className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-100"
                                />
                                <div className="truncate text-left">
                                  <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 truncate">
                                    {biz.name_bn || biz.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                                      {biz.category}
                                    </span>
                                    <span className="truncate">{biz.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 pl-2">
                                <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{biz.rating}</span>
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No matches */}
                    {matchingCategories.length === 0 && matchingBusinesses.length === 0 && (
                      <div className="py-4 text-center text-slate-400 text-xs">
                        <p className="font-bold text-slate-600">সরাসরি কোনো ফলাফল পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">নিচের বাটনে ক্লিক করে সম্পূর্ণ ডিরেক্টরিতে খুঁজুন</p>
                      </div>
                    )}

                    {/* Submit All Results Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="submit"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <span>সকল ফলাফল দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: জেলা (District) */}
              <div className="lg:col-span-2 col-span-1 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  জেলা
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="">সকল জেলা</option>
                    {DIVISION_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: উপজেলা (Upazila) */}
              <div className="lg:col-span-3 col-span-1 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  উপজেলা
                </label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <select
                    value={selectedUpazila}
                    onChange={(e) => handleUpazilaChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="">সকল উপজেলা ({availableUpazilas.length}টি)</option>
                    {availableUpazilas.map((up) => (
                      <option key={up} value={up}>
                        {up}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 4: ইউনিয়ন / সিটি (Union/City) */}
              <div className="lg:col-span-3 col-span-1 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  ইউনিয়ন / এলাকা
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <select
                    value={selectedUnion}
                    onChange={(e) => setSelectedUnion(e.target.value)}
                    disabled={!selectedUpazila}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer disabled:text-slate-400 truncate"
                  >
                    <option value="" className="truncate">
                      {selectedUpazila ? 'সকল ইউনিয়ন / ওয়ার্ড' : 'আগে উপজেলা বাছুন'}
                    </option>
                    {unions.map((un) => (
                      <option key={un} value={un} className="truncate">
                        {un}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5: Action Submit Button */}
              <div className="lg:col-span-2 col-span-1 sm:col-span-2 lg:col-auto flex items-stretch">
                <button
                  type="submit"
                  className="w-full h-full min-h-[50px] sm:min-h-[54px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md sm:shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>সন্ধান করুন</span>
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Scrolling News Bulletin Marquee right under the search bar */}
        <NewsTicker />

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">
            জনপ্রিয় অনুসন্ধান:
          </span>
          {popularSearches.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => onQuickCategory(item.query)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-sm transition-all duration-150 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
