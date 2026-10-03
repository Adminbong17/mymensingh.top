import React from 'react';
import { ArrowRight } from 'lucide-react';
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
  return (
    <section id="categories" className="pt-4 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 sm:h-9 bg-emerald-600 rounded-full shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Explore Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ময়মনসিংহের সব কিছু, এক জায়গায়
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSeeAll) {
                onSeeAll();
              } else {
                onSelectCategory('all');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors group cursor-pointer shrink-0"
          >
            <span>See All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 20 Categories Grid */}
        <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const displayNameBn = SHORT_BN_NAMES[cat.slug] || cat.name_bn;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`group flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer h-[102px] sm:h-[110px] w-full ${
                  isSelected
                    ? 'bg-emerald-50/60 text-emerald-800 border-emerald-500 ring-2 ring-emerald-400/50 shadow-sm'
                    : 'bg-white hover:bg-slate-50/50 border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Icon */}
                <div className="mb-2 shrink-0 flex items-center justify-center">
                  {renderCategoryIcon(cat.slug, "w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 duration-200")}
                </div>

                {/* English Title */}
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight truncate w-full px-1">
                  {cat.name_en}
                </h3>

                {/* Bengali Subtitle */}
                <p className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-700 transition-colors leading-tight truncate w-full px-1 mt-0.5">
                  {displayNameBn}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
