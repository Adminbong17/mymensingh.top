import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  ChevronRight,
  PlusCircle,
  X,
  ArrowUpDown,
  Heart,
  Layers,
  PhoneCall
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { renderCategoryIcon } from '../lib/categoryIcons';
import { ALL_DIVISION_UPAZILAS } from '../data/initialData';
import type { Business } from '../types';
import { BusinessDetailModal } from '../components/BusinessDetailModal';

export const CategoryDetailPage: React.FC = () => {
  const { categorySlug, subCategorySlug } = useParams<{ categorySlug: string; subCategorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    categories,
    mainCategories,
    getSubcategories,
    businesses,
    isFavorite,
    toggleFavorite
  } = useData();

  // Selected Business for Detail Modal
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Active Category Object (Supports alias slugs)
  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    const cleanSlug = categorySlug.toLowerCase().trim();
    
    // Direct match
    let found = categories.find(c => c.slug === cleanSlug || c.id === cleanSlug);
    if (found) return found;

    // Common alias matching
    if (cleanSlug === 'doctor' || cleanSlug === 'doctors') {
      found = categories.find(c => c.slug === 'doctors' || c.slug === 'doctor');
    } else if (cleanSlug === 'hospital' || cleanSlug === 'hospitals') {
      found = categories.find(c => c.slug === 'hospitals' || c.slug === 'hospital');
    } else if (cleanSlug === 'restaurant' || cleanSlug === 'restaurants') {
      found = categories.find(c => c.slug === 'restaurants' || c.slug === 'restaurant');
    } else if (cleanSlug === 'hotel' || cleanSlug === 'hotels') {
      found = categories.find(c => c.slug === 'hotels' || c.slug === 'hotel');
    }

    return found || null;
  }, [categorySlug, categories]);

  // Subcategories belonging to this category
  const subcategoriesList = useMemo(() => {
    if (!currentCategory) return [];
    return getSubcategories(currentCategory.slug || currentCategory.id);
  }, [currentCategory, getSubcategories]);

  // Active Subcategory State (from route param or URL query param)
  const subFromQuery = searchParams.get('sub') || '';
  const activeSubcategorySlug = subCategorySlug || subFromQuery;

  // Filter States
  const [keyword, setKeyword] = useState<string>(searchParams.get('q') || '');
  const [selectedUpazila, setSelectedUpazila] = useState<string>(searchParams.get('upazila') || '');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews' | 'name' | 'newest'>('featured');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Synchronize URL query params
  const handleSubcategorySelect = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('sub', slug);
    } else {
      nextParams.delete('sub');
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedUpazila('');
    setSortBy('featured');
    setOnlyFeatured(false);
    setMinRating(0);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    activeSubcategorySlug || keyword || selectedUpazila || onlyFeatured || minRating > 0 || sortBy !== 'featured'
  );

  // Filtered Businesses Logic
  const filteredBusinesses = useMemo(() => {
    if (!currentCategory) return [];

    return businesses.filter(biz => {
      // 1. Category Matching
      const matchCat =
        biz.category_slug === currentCategory.slug ||
        biz.category_slug === categorySlug ||
        biz.category?.toLowerCase() === currentCategory.name_en?.toLowerCase() ||
        biz.category_id === currentCategory.id;

      if (!matchCat) return false;

      // 2. Subcategory Filter
      if (activeSubcategorySlug) {
        const matchSub =
          biz.subcategory_slug === activeSubcategorySlug ||
          (biz as any).subcategory?.toLowerCase() === activeSubcategorySlug.toLowerCase();
        if (!matchSub) return false;
      }

      // 3. Keyword Search
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchName = (biz.name && biz.name.toLowerCase().includes(q)) || (biz.name_bn && biz.name_bn.toLowerCase().includes(q));
        const matchLoc = biz.location && biz.location.toLowerCase().includes(q);
        const matchDesc = biz.description && biz.description.toLowerCase().includes(q);
        const matchPhone = biz.phone && biz.phone.includes(q);
        if (!matchName && !matchLoc && !matchDesc && !matchPhone) return false;
      }

      // 4. Upazila Filter
      if (selectedUpazila && biz.upazila !== selectedUpazila) {
        return false;
      }

      // 5. Only Featured Toggle
      if (onlyFeatured && !biz.is_featured) {
        return false;
      }

      // 6. Minimum Rating Filter
      if (minRating > 0 && (biz.rating || 0) < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      if (sortBy === 'name') return (a.name_bn || a.name).localeCompare(b.name_bn || b.name);
      if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '');
      // Default: Featured first, then highest rating
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [businesses, currentCategory, categorySlug, activeSubcategorySlug, keyword, selectedUpazila, onlyFeatured, minRating, sortBy]);

  // Subcategory Item Counts
  const getSubcategoryCount = (subSlug: string) => {
    if (!currentCategory) return 0;
    return businesses.filter(b => 
      (b.category_slug === currentCategory.slug || b.category_slug === categorySlug) &&
      (b.subcategory_slug === subSlug || (b as any).subcategory === subSlug)
    ).length;
  };

  // Other Related Categories
  const otherCategories = useMemo(() => {
    return (mainCategories.length > 0 ? mainCategories : categories)
      .filter(c => c.slug !== currentCategory?.slug)
      .slice(0, 8);
  }, [mainCategories, categories, currentCategory]);

  if (!currentCategory && categories.length > 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">ক্যাটাগরি পাওয়া যায়নি</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            দুঃখিত, আপনি যে ক্যাটাগরিটি খুঁজছেন তা পাওয়া যায়নি অথবা সরিয়ে নেওয়া হয়েছে।
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/categories')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              সকল ক্যাটাগরি ব্রাউজ করুন
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryNameBn = currentCategory?.name_bn || currentCategory?.name_en || 'ক্যাটাগরি';
  const categoryNameEn = currentCategory?.name_en || '';
  const totalCount = filteredBusinesses.length;

  return (
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-1 scrollbar-none">
          <Link to="/" className="hover:text-emerald-700 transition-colors shrink-0">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/categories" className="hover:text-emerald-700 transition-colors shrink-0">ক্যাটাগরি সমূহ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold shrink-0">{categoryNameBn}</span>
          {activeSubcategorySlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-emerald-700 font-bold shrink-0">
                {subcategoriesList.find(s => s.slug === activeSubcategorySlug)?.name_bn || activeSubcategorySlug}
              </span>
            </>
          )}
        </div>

        {/* 2. Hero Banner Specific to this Category */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mymensingh City Directory</span>
              </div>
              
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                  {renderCategoryIcon(currentCategory?.slug || '', "w-7 h-7", false)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <span>{categoryNameBn}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                    {categoryNameEn} • ময়মনসিংহ বিভাগের শীর্ষ সেবা ও তালিকা
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                ময়মনসিংহ শহরের সেরা {categoryNameBn} তালিকা, মোবাইল নম্বর, বিশেষজ্ঞ বিস্তারিত, চেম্বার/ঠিকানা ও রিয়েল রিভিউ এক নজরে খুঁজুন।
              </p>
            </div>

            {/* Quick Action Badges & CTA */}
            <div className="flex flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-left md:text-right">
                <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">মোট তালিকাভুক্ত</div>
                <div className="text-xl sm:text-2xl font-black text-white">{totalCount} টি প্রতিষ্ঠান/সেবা</div>
              </div>

              <button
                onClick={() => navigate(`/list-business?category=${currentCategory?.slug || ''}`)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ নতুন লিস্টিং যুক্ত করুন</span>
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 3. Subcategories Pills Filter Bar */}
        {subcategoriesList.length > 0 && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>উপ-ক্যাটাগরি বা বিশেষত্ব নির্বাচন করুন:</span>
              </div>
              {activeSubcategorySlug && (
                <button
                  onClick={() => handleSubcategorySelect('')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                >
                  সবগুলো দেখান (All)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
              <button
                onClick={() => handleSubcategorySelect('')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  !activeSubcategorySlug
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>সকল উপ-ক্যাটাগরি</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  !activeSubcategorySlug ? 'bg-white/30 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {businesses.filter(b => b.category_slug === currentCategory?.slug).length}
                </span>
              </button>

              {subcategoriesList.map(sub => {
                const isSelected = activeSubcategorySlug === sub.slug;
                const subCount = getSubcategoryCount(sub.slug);

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategorySelect(sub.slug)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                    }`}
                  >
                    <span>{sub.name_bn || sub.name_en}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {subCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Live Search & Multi-Filter Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={`${categoryNameBn} বা এলাকার নাম খুঁজুন...`}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Upazila Filter */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                <option value="">সকল উপজেলা (All Areas)</option>
                {ALL_DIVISION_UPAZILAS.map((upz) => (
                  <option key={upz} value={upz}>{upz}</option>
                ))}
              </select>
            </div>

            {/* 3. Sort Order */}
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                <option value="featured">সেরা ও ফিচার্ড প্রথম</option>
                <option value="rating">সর্বোচ্চ রেটিং (Highest Star)</option>
                <option value="reviews">সর্বাধিক রিভিউ সংখ্যা</option>
                <option value="newest">নতুন সংযোজিত</option>
                <option value="name">নাম অনুসারে (A-Z)</option>
              </select>
            </div>

            {/* 4. Rating Filter */}
            <div className="relative">
              <Star className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                <option value={0}>সকল রেটিং (All Ratings)</option>
                <option value={4.5}>৪.৫+ স্টার রেটিং</option>
                <option value={4.0}>৪.০+ স্টার রেটিং</option>
                <option value={3.5}>৩.৫+ স্টার রেটিং</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Badges & Reset Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  onlyFeatured
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>শুধুমাত্র ফিচার্ড</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                ফলাফল: <strong className="text-slate-900 font-bold">{filteredBusinesses.length}</strong> টি পাওয়া গেছে
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Business Listings Results Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBusinesses.map((biz) => {
              const favorite = isFavorite(biz.id);
              const subcatName = subcategoriesList.find(s => s.slug === biz.subcategory_slug)?.name_bn || biz.subcategory;

              return (
                <div
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={biz.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
                      alt={biz.name_bn || biz.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {renderCategoryIcon(biz.category_slug, "w-3 h-3")}
                        <span>{categoryNameBn}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(biz.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
                          favorite ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title="পছন্দের তালিকায় রাখুন"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      {subcatName ? (
                        <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          {subcatName}
                        </span>
                      ) : <span />}

                      {biz.is_featured && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/95 backdrop-blur-md text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>স্পন্সরড</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {biz.name_bn || biz.name}
                          </h3>
                          {biz.name_en && (
                            <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{biz.name_en}</p>
                          )}
                        </div>

                        {/* Rating Badge */}
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-xl shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black">{biz.rating?.toFixed(1) || '4.8'}</span>
                          <span className="text-[10px] text-slate-400">({biz.review_count || 0})</span>
                        </div>
                      </div>

                      {biz.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {biz.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {/* Location & Upazila */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{biz.location || `${biz.upazila}, ময়মনসিংহ`}</span>
                      </div>

                      {/* Phone & Actions */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {biz.phone ? (
                          <a
                            href={`tel:${biz.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{biz.phone}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">ফোন নম্বর প্রযোজ্য নয়</span>
                        )}

                        <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>বিস্তারিত</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 6. Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                কোনো তথ্য বা প্রতিষ্ঠান পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার দেওয়া ফিল্টার বা কিওয়ার্ড অনুযায়ী এই ক্যাটাগরিতে কোনো এন্ট্রি খুঁজে পাওয়া যায়নি।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  ফিল্টার ক্লিয়ার করুন
                </button>
              )}
              <button
                onClick={() => navigate(`/list-business?category=${currentCategory?.slug || ''}`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                + এই ক্যাটাগরিতে প্রথম তথ্য যুক্ত করুন
              </button>
            </div>
          </div>
        )}

        {/* 7. Explore Other Categories Section */}
        {otherCategories.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>অন্যান্য জনপ্রিয় ক্যাটাগরি ব্রাউজ করুন</span>
              </h3>
              <Link
                to="/categories"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>সবগুলো ({categories.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-center flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors">
                    {renderCategoryIcon(cat.slug, "w-5 h-5")}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-800 truncate max-w-full">
                    {cat.name_bn || cat.name_en}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
};
