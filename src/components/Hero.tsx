import React from 'react';
import { Search, MapPin, Sparkles, X, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedArea,
  onSelectArea,
  onExploreClick,
}) => {
  const { language, t } = useLanguage();
  const { places, emergencyContacts, trainSchedules } = useData();

  const areas = [
    { id: 'all', en: 'All Areas', bn: 'সকল এলাকা' },
    { id: 'Town Hall', en: 'Town Hall', bn: 'টাউন হল' },
    { id: 'BAU Campus', en: 'BAU Campus', bn: 'বাকৃবি ক্যাম্পাস' },
    { id: 'Muktagacha', en: 'Muktagacha', bn: 'মুক্তাগাছা' },
    { id: 'Riverbank', en: 'Riverbank', bn: 'ব্রহ্মপুত্র তীর' },
    { id: 'Charpara', en: 'Charpara', bn: 'চরপাড়া' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 shadow-inner">
      {/* Decorative ambient river gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        
        {/* Top welcome pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>
            {language === 'bn' ? 'স্বাগতম শিল্প ও ঐতিহ্যের পুণ্যভূমি ময়মনসিংহে' : 'Welcome to the Cultural Capital of Bengal'}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
          {language === 'bn' ? (
            <>
              ঐতিহ্য ও প্রকৃতির শহর <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                ময়মনসিংহ অন্বেষণ করুন
              </span>
            </>
          ) : (
            <>
              Discover the Wonders of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Historic Mymensingh
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
          {t('app_subtitle')}
        </p>

        {/* Search Bar Container */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white focus-within:text-slate-900 rounded-2xl border border-white/20 focus-within:border-emerald-500 transition-all p-2 shadow-2xl backdrop-blur-md">
            <div className="pl-3 pr-2 text-slate-400 focus-within:text-emerald-600">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base text-inherit placeholder-slate-400 focus:placeholder-slate-400 py-2"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 mr-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onExploreClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'bn' ? 'খুঁজুন' : 'Explore'}</span>
            </button>
          </div>
        </div>

        {/* Area quick pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'bn' ? 'জনপ্রিয় এলাকা:' : 'Popular Areas:'}
          </span>
          {areas.map((a) => {
            const isActive = (selectedArea === '' && a.id === 'all') || selectedArea === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onSelectArea(a.id === 'all' ? '' : a.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-xs font-semibold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {language === 'bn' ? a.bn : a.en}
              </button>
            );
          })}
        </div>

        {/* Quick city statistics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto pt-4 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-amber-400">{places.length}+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {language === 'bn' ? 'প্রধান দর্শনীয় স্থান' : 'Curated Places'}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-rose-400">{emergencyContacts.length}+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {language === 'bn' ? 'জরুরি সেবা নম্বর' : 'Emergency Helplines'}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-teal-400">{trainSchedules.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {language === 'bn' ? 'আন্তঃনগর এক্সপ্রেস ট্রেন' : 'Intercity Trains'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
