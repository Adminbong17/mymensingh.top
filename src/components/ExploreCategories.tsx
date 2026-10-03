import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Category } from '../types';
import { renderCategoryIcon } from '../lib/categoryIcons';

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
  'tourist-places': 'পর্যটন স্থান',
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

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Group categories into 2-row columns (paired items)
  const columns = useMemo(() => {
    const cols: Category[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
      cols.push(categories.slice(i, i + 2));
    }
    return cols;
  }, [categories]);

  // Update scroll navigation buttons state
  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="categories" className="pt-6 pb-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header & Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 sm:h-9 bg-emerald-600 rounded-full shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Explore Categories
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{categories.length}টি ক্যাটাগরি</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ময়মনসিংহের সব কিছু, এক জায়গায় (স্লাইড করে দেখুন)
              </p>
            </div>
          </div>

          {/* Right Actions: Slider Arrows + See All Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Left/Right Slider Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white text-slate-800 shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 active:scale-95'
                    : 'text-slate-300 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-white text-slate-800 shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 active:scale-95'
                    : 'text-slate-300 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* See All Categories Link */}
            <button
              type="button"
              onClick={() => {
                if (onSeeAll) {
                  onSeeAll();
                } else {
                  onSelectCategory('all');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl transition-all group cursor-pointer"
            >
              <span>সকল ক্যাটাগরি</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-emerald-600" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN-WISE CATEGORY SLIDER (2-Row Column Pairs)           */}
        {/* ========================================================= */}
        <div className="relative group/slider">
          <div
            ref={scrollRef}
            className="flex gap-2.5 sm:gap-3.5 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 scrollbar-none select-none -mx-2 px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {columns.map((columnGroup, colIdx) => (
              <div
                key={colIdx}
                className="flex flex-col gap-2.5 sm:gap-3 shrink-0 w-[130px] min-[480px]:w-[145px] sm:w-[160px] md:w-[170px]"
              >
                {columnGroup.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const displayNameBn = SHORT_BN_NAMES[cat.slug] || cat.name_bn;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.slug)}
                      className={`group/card flex flex-col items-center justify-center text-center p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer h-[96px] sm:h-[104px] w-full ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-400/50 shadow-md scale-101'
                          : 'bg-white hover:bg-slate-50/70 border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Icon */}
                      <div className="mb-1.5 shrink-0 flex items-center justify-center text-emerald-700">
                        {renderCategoryIcon(
                          cat.icon || cat.slug,
                          "w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform group-hover/card:scale-110 duration-200"
                        )}
                      </div>

                      {/* English Title */}
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover/card:text-emerald-700 transition-colors leading-tight truncate w-full px-1">
                        {cat.name_en}
                      </h3>

                      {/* Bengali Subtitle */}
                      <p className="text-[10.5px] sm:text-xs text-slate-500 group-hover/card:text-slate-700 transition-colors leading-tight truncate w-full px-1 mt-0.5 font-medium">
                        {displayNameBn}
                      </p>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Optional Subtle Horizontal Scroll Progress Bar */}
          <div className="w-full max-w-xs mx-auto h-1 bg-slate-100 rounded-full overflow-hidden mt-1 sm:mt-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
