import React from 'react';
import {
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
  Grid
} from 'lucide-react';
import type { Category } from '../types';

interface ExploreCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
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

  return (
    <section id="categories" className="py-14 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Browse Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহের প্রয়োজনীয় সকল সেবা ও ব্যবসা ২০টি নির্দিষ্ট ক্যাটাগরিতে বিভক্ত
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            বর্তমানে মোট <strong className="text-slate-900">২০টি ক্যাটাগরি</strong> সক্রিয়
          </div>
        </div>

        {/* 20 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-32 hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-300'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-emerald-600 shadow-xs group-hover:bg-emerald-50'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    {cat.count || 20}+
                  </span>
                </div>

                <div>
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}
                  >
                    {cat.name_en}
                  </h3>
                  <p
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {cat.name_bn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
