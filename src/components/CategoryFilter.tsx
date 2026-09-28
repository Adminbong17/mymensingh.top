import React from 'react';
import {
  Sparkles,
  Landmark,
  Trees,
  UtensilsCrossed,
  Hotel,
  HeartPulse,
  Train,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

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

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'heritage':
        return <Landmark className="w-4 h-4" />;
      case 'nature':
        return <Trees className="w-4 h-4" />;
      case 'food':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'hotels':
        return <Hotel className="w-4 h-4" />;
      case 'emergency':
        return <HeartPulse className="w-4 h-4" />;
      case 'transport':
        return <Train className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {/* All option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs ${
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-emerald-600'}>
                {getCategoryIcon(cat.slug)}
              </span>
              <span>{language === 'bn' ? cat.name_bn : cat.name_en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
