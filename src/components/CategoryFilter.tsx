import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { renderCategoryIcon } from '../lib/categoryIcons';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const { categories } = useData();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {/* All option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>{language === 'bn' ? 'সব দর্শনীয় স্থান' : 'All Places'}</span>
        </button>

        {/* Dynamic Category options */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-white' : ''}>
                {renderCategoryIcon(cat.slug, 'w-4 h-4', !isSelected)}
              </span>
              <span>{language === 'bn' ? cat.name_bn : cat.name_en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
