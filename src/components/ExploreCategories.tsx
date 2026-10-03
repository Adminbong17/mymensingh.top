import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, ArrowRightLeft } from 'lucide-react';
import type { Category } from '../types';
import { CATEGORY_VISUALS, renderCategoryIcon } from '../lib/categoryIcons';

interface ExploreCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onSeeAll?: () => void;
}

const SHORT_BN_NAMES: Record<string, string> = {
  'restaurants': 'রেস্টুরেন্ট',
  'hotels': 'হোটেল',
  'hospitals': 'হাসপাতাল',
  'pharmacy': 'ফার্মেসি',
  'blood-bank': 'রক্ত ব্যাংক',
  'tuition-media': 'টিউশন মিডিয়া',
  'to-let': 'বাসা ভাড়া',
  'shopping': 'শপিং',
  'cafes': 'ক্যাফে',
  'tourist-places': 'দর্শনীয় স্থান',
  'education': 'শিক্ষা প্রতিষ্ঠান',
  'transport': 'পরিবহন',
  'mosques': 'মসজিদ',
  'events': 'ইভেন্ট',
  'offers': 'অফার',
  'news': 'সংবাদ',
  'real-estate': 'রিয়েল এস্টেট',
  'jobs': 'চাকরি',
  'services': 'সেবা',
  'more': 'আরও',
};

const DOTS_COUNT = 6;

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Update scroll navigation states and active dot indicator
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const ratio = scrollLeft / maxScroll;
      const dotIdx = Math.min(DOTS_COUNT - 1, Math.max(0, Math.round(ratio * (DOTS_COUNT - 1))));
      setActiveDotIndex(dotIdx);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, categories]);

  // Smooth Scroll handler for Left/Right buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = Math.max(260, scrollRef.current.clientWidth * 0.6);
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Scroll to a specific dot position
  const scrollToDot = (dotIndex: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const targetLeft = (dotIndex / (DOTS_COUNT - 1)) * maxScroll;
      scrollRef.current.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll loop effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = 200;

      // If reached the end, smoothly loop back to start
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, categories]);

  return (
    <section
      id="categories"
      className="pt-8 pb-14 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/40 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ========================================================= */}
        {/* HEADER & TOP SLIDER CONTROLS                              */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Title & Subtitle with Animated Indicator */}
          <div className="flex items-center gap-3.5">
            <div className="w-2 h-10 sm:h-12 bg-emerald-600 rounded-full shrink-0 shadow-xs" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Explore Categories
                </h2>
                {/* Visual Slide Indicator Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] sm:text-xs font-bold shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span>স্লাইডার</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  ময়মনসিংহের সব কিছু, এক জায়গায়
                </p>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>স্লাইড করে দেখুন ⟵ ⟶</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Circular Navigation Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous categories"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-slate-700 shadow-md hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg active:scale-95 border border-slate-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next categories"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-emerald-50 text-emerald-700 shadow-md hover:bg-emerald-600 hover:text-white hover:shadow-lg active:scale-95 border border-emerald-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SINGLE-ROW AUTO-SCROLL CATEGORY CAROUSEL                  */}
        {/* ========================================================= */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4.5 overflow-x-auto scroll-smooth py-3 px-1 scrollbar-none select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const visual = CATEGORY_VISUALS[cat.slug] || CATEGORY_VISUALS[cat.icon || ''] || null;
              const displayNameBn = SHORT_BN_NAMES[cat.slug] || cat.name_bn || (visual ? visual.nameBn : '');
              const displayNameEn = cat.name_en || (visual ? visual.nameEn : cat.name_bn);

              // Background tint
              const bgLight = visual?.bgLight || 'bg-emerald-50';

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`group relative shrink-0 w-[138px] min-[420px]:w-[150px] sm:w-[165px] md:w-[178px] h-[155px] sm:h-[168px] rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-500/10 scale-102 -translate-y-1'
                      : 'bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1.5'
                  }`}
                >
                  {/* Pastel Rounded Icon Container */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 mb-3 transition-transform duration-300 group-hover:scale-110 ${bgLight}`}
                  >
                    {renderCategoryIcon(
                      cat.icon || cat.slug,
                      "w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300"
                    )}
                  </div>

                  {/* English Name */}
                  <h3
                    className="text-xs sm:text-[14px] font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight truncate w-full px-1"
                    title={displayNameEn}
                  >
                    {displayNameEn}
                  </h3>

                  {/* Bengali Subtitle */}
                  <p
                    className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-700 font-semibold leading-tight truncate w-full px-1 mt-1"
                    title={displayNameBn}
                  >
                    {displayNameBn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM PAGINATION DOTS & SEE ALL BUTTON                   */}
        {/* ========================================================= */}
        <div className="pt-2 flex flex-col items-center justify-center gap-4">
          
          {/* Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {Array.from({ length: DOTS_COUNT }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToDot(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  activeDotIndex === idx
                    ? 'w-6 h-2 bg-emerald-600 rounded-full shadow-xs'
                    : 'w-2 h-2 bg-slate-200 hover:bg-slate-300 rounded-full'
                }`}
              />
            ))}
          </div>

          {/* "See All Categories" Button at the Bottom */}
          <button
            type="button"
            onClick={() => {
              if (onSeeAll) {
                onSeeAll();
              } else {
                onSelectCategory('all');
              }
            }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>সকল ক্যাটাগরি দেখুন ({categories.length}টি)</span>
          </button>

        </div>

      </div>
    </section>
  );
};
