import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  SlidersHorizontal,
  Star,
  Phone,
  Navigation,
  Heart,
  CheckCircle2,
  SearchX,
  X,
  Layers
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  DIVISION_DISTRICTS,
  DISTRICT_UPAZILAS_MAP,
  MYMENSINGH_UNIONS_MAP,
  ALL_DIVISION_UPAZILAS
} from '../data/initialData';
import { renderCategoryIcon } from '../lib/categoryIcons';
import type { Business } from '../types';
import { BusinessDetailModal } from '../components/BusinessDetailModal';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, categories, isFavorite, toggleFavorite } = useData();

  // URL Query Parameters
  const initialQuery = searchParams.get('q') || '';
  const initialDistrict = searchParams.get('district') || '';
  const initialUpazila = searchParams.get('upazila') || '';
  const initialUnion = searchParams.get('union') || '';
  const initialCategory = searchParams.get('category') || '';

  // Local state for search controls
  const [keyword, setKeyword] = useState<string>(initialQuery);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [selectedUpazila, setSelectedUpazila] = useState<string>(initialUpazila);
  const [selectedUnion, setSelectedUnion] = useState<string>(initialUnion);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews' | 'name'>('featured');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Sync state when URL search params change
  useEffect(() => {
    setKeyword(searchParams.get('q') || '');
    setDistrict(searchParams.get('district') || '');
    setSelectedUpazila(searchParams.get('upazila') || '');
    setSelectedUnion(searchParams.get('union') || '');
    setSelectedCategorySlug(searchParams.get('category') || '');
  }, [searchParams]);

  // Derived location dropdown options
  const availableUpazilas = district
    ? (DISTRICT_UPAZILAS_MAP[district] || [])
    : ALL_DIVISION_UPAZILAS;

  const unions = selectedUpazila ? (MYMENSINGH_UNIONS_MAP[selectedUpazila] || []) : [];

  // Update URL params upon filter submission
  const applyFilters = (updates?: Partial<{
    q: string;
    district: string;
    upazila: string;
    union: string;
    category: string;
  }>) => {
    const q = updates?.q !== undefined ? updates.q : keyword;
    const dist = updates?.district !== undefined ? updates.district : district;
    const up = updates?.upazila !== undefined ? updates.upazila : selectedUpazila;
    const un = updates?.union !== undefined ? updates.union : selectedUnion;
    const cat = updates?.category !== undefined ? updates.category : selectedCategorySlug;

    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (dist) params.set('district', dist);
    if (up) params.set('upazila', up);
    if (un) params.set('union', un);
    if (cat) params.set('category', cat);

    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setSelectedUpazila('');
    setSelectedUnion('');
    applyFilters({ district: d, upazila: '', union: '' });
  };

  const handleUpazilaChange = (up: string) => {
    setSelectedUpazila(up);
    setSelectedUnion('');
    applyFilters({ upazila: up, union: '' });
  };

  const handleUnionChange = (un: string) => {
    setSelectedUnion(un);
    applyFilters({ union: un });
  };

  const handleCategorySelect = (slug: string) => {
    const newSlug = selectedCategorySlug === slug ? '' : slug;
    setSelectedCategorySlug(newSlug);
    applyFilters({ category: newSlug });
  };

  const clearAllFilters = () => {
    setKeyword('');
    setDistrict('');
    setSelectedUpazila('');
    setSelectedUnion('');
    setSelectedCategorySlug('');
    setSearchParams({});
  };

  // Matching Categories
  const matchingCategories = useMemo(() => {
    if (!keyword.trim()) return [];
    const q = keyword.toLowerCase().trim();
    return categories.filter(
      (c) =>
        (c.name_bn && c.name_bn.toLowerCase().includes(q)) ||
        (c.name_en && c.name_en.toLowerCase().includes(q)) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [categories, keyword]);

  // Filtered Businesses Logic
  const filteredBusinesses = useMemo(() => {
    const q = keyword.toLowerCase().trim();

    const list = businesses.filter((biz) => {
      // Category filter
      if (selectedCategorySlug && biz.category_slug !== selectedCategorySlug && biz.category !== selectedCategorySlug) {
        return false;
      }

      // District filter
      if (district && biz.district && biz.district !== district && !biz.location.includes(district)) {
        return false;
      }

      // Upazila filter
      if (selectedUpazila && biz.upazila !== selectedUpazila && !biz.location.includes(selectedUpazila)) {
        return false;
      }

      // Union/Ward filter
      if (selectedUnion && biz.union_ward && !biz.union_ward.includes(selectedUnion)) {
        return false;
      }

      // Keyword filter
      if (q) {
        const matchName =
          (biz.name && biz.name.toLowerCase().includes(q)) ||
          (biz.name_bn && biz.name_bn.toLowerCase().includes(q));
        const matchCategory =
          (biz.category && biz.category.toLowerCase().includes(q)) ||
          (biz.subcategory && biz.subcategory.toLowerCase().includes(q));
        const matchLocation = biz.location && biz.location.toLowerCase().includes(q);
        const matchDesc = biz.description && biz.description.toLowerCase().includes(q);
        const matchPhone = biz.phone && biz.phone.includes(q);

        if (!matchName && !matchCategory && !matchLocation && !matchDesc && !matchPhone) {
          return false;
        }
      }

      return true;
    });

    // Sort logic
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.review_count - a.review_count);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [businesses, keyword, district, selectedUpazila, selectedUnion, selectedCategorySlug, sortBy]);

  const hasActiveFilters = Boolean(
    keyword || district || selectedUpazila || selectedUnion || selectedCategorySlug
  );

  const handleCall = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleDirection = (e: React.MouseEvent, lat: number, lng: number) => {
    e.stopPropagation();
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* ========================================================= */}
      {/* 1. TOP HERO / SEARCH FILTER BAR                           */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-8 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6">
          
          {/* Breadcrumb / Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>অনুসন্ধান ইঞ্জিন • Search Results</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {keyword ? `"${keyword}" এর অনুসন্ধান ফলাফল` : 'ময়মনসিংহ বিভাগের অনুসন্ধান ফলাফল'}
              </h1>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>সব ফিল্টার মুছুন (Reset)</span>
              </button>
            )}
          </div>

          {/* Full Search Bar with Location Pickers */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-200 text-slate-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-stretch">
              
              {/* Field 1: Keyword Input */}
              <div className="lg:col-span-4 col-span-1 sm:col-span-2 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  কী খুঁজছেন?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="ব্যবসা, সেবা, ডাক্তার বা হোটেল..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-hidden placeholder:text-slate-400"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword('');
                        applyFilters({ q: '' });
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 2: District */}
              <div className="lg:col-span-2 col-span-1 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/80 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  জেলা
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="">সকল জেলা</option>
                    {DIVISION_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: Upazila */}
              <div className="lg:col-span-2 col-span-1 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/80 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
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

              {/* Field 4: Union */}
              <div className="lg:col-span-2 col-span-1 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/80 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  ইউনিয়ন / এলাকা
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <select
                    value={selectedUnion}
                    onChange={(e) => handleUnionChange(e.target.value)}
                    disabled={!selectedUpazila}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer disabled:text-slate-400 truncate"
                  >
                    <option value="" className="truncate">
                      {selectedUpazila ? 'সকল ইউনিয়ন / ওয়ার্ড' : 'উপজেলা বাছুন'}
                    </option>
                    {unions.map((un) => (
                      <option key={un} value={un} className="truncate">
                        {un}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5: Submit Button */}
              <div className="lg:col-span-2 col-span-1 sm:col-span-2 flex items-stretch">
                <button
                  type="submit"
                  className="w-full h-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>সার্চ করুন</span>
                </button>
              </div>

            </div>
          </form>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              type="button"
              onClick={() => handleCategorySelect('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                !selectedCategorySlug
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
              }`}
            >
              সকল ক্যাটাগরি
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                  }`}
                >
                  <span>{renderCategoryIcon(cat.icon || cat.slug, "w-3.5 h-3.5")}</span>
                  <span>{cat.name_bn || cat.name_en}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RESULTS BODY                                           */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Results Header: Count & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm sm:text-base font-bold text-slate-900">
              মোট <strong>{filteredBusinesses.length}</strong>টি ফলাফল পাওয়া গেছে
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>সাজান:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="featured">ফিচার্ড / জনপ্রিয়</option>
              <option value="rating">সর্বোচ্চ রেটিং (Rating)</option>
              <option value="reviews">সর্বাধিক রিভিউ (Reviews)</option>
              <option value="name">নাম অনুযায়ী (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Matched Categories Notice if searching by keyword */}
        {matchingCategories.length > 0 && !selectedCategorySlug && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-900">
                ক্যাটাগরি ম্যাচ পাওয়া গেছে:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchingCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{renderCategoryIcon(cat.icon || cat.slug, "w-3.5 h-3.5")}</span>
                  <span>{cat.name_bn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-800">
                কোনো ফলাফল পাওয়া যায়নি
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                আপনার অনুসন্ধানের জন্য কোনো প্রতিষ্ঠান বা সেবা তালিকাভুক্ত নেই। অন্য কোনো কি-ওয়ার্ড অথবা অন্য উপজেলা নির্বাচন করে আবার চেষ্টা করুন।
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                সব ফিল্টার রিসেট করুন
              </button>
              <Link
                to="/categories"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                ক্যাটাগরি ডিরেক্টরি দেখুন
              </Link>
            </div>
          </div>
        ) : (
          /* Business Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((biz) => {
              const favorited = isFavorite(biz.id);

              return (
                <div
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Photo */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={biz.image_url}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-xs">
                          {biz.category}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => handleFavoriteClick(e, biz.id)}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                          favorited
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
                        }`}
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                      </button>

                      {/* Rating & Review Count on image */}
                      <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{biz.rating}</span>
                        <span className="text-slate-300 text-[11px] font-normal">
                          ({biz.review_count} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {biz.name}
                        </h3>
                        <span title="Verified Listing">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        </span>
                      </div>

                      {biz.name_bn && (
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {biz.name_bn}
                        </p>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1 font-medium">{biz.location}</span>
                      </div>

                      {biz.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                          {biz.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Buttons: Call & Direction */}
                  <div className="p-4 px-5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => handleCall(e, biz.phone)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer truncate"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Call ({biz.phone ? biz.phone.split('-')[0] : 'Contact'})</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDirection(e, biz.latitude, biz.longitude)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition-all hover:border-slate-300 cursor-pointer shrink-0"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Direction</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
