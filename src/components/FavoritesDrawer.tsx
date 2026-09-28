import React from 'react';
import { X, Heart, MapPin, Trash2, ArrowRight } from 'lucide-react';
import type { Place } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
}) => {
  const { language, t } = useLanguage();
  const { places, favorites, toggleFavorite } = useData();

  if (!isOpen) return null;

  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {t('favorites')}
              </h3>
              <p className="text-xs text-slate-500">
                {favoritePlaces.length} {language === 'bn' ? 'টি সংরক্ষিত স্থান' : 'Saved places'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoritePlaces.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {t('no_favorites_yet')}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {language === 'bn'
                  ? 'যেকোনো স্থানের কার্ডে থাকা হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় সংরক্ষণ করুন।'
                  : 'Tap the heart icon on any place card to save it here for quick access.'}
              </p>
            </div>
          ) : (
            favoritePlaces.map((place) => {
              const title = language === 'bn' ? place.name_bn || place.name_en : place.name_en;

              return (
                <div
                  key={place.id}
                  className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-sm transition-all"
                >
                  <img
                    src={place.image_url}
                    alt={title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectPlace(place);
                      onClose();
                    }}
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => {
                          onSelectPlace(place);
                          onClose();
                        }}
                        className="text-xs sm:text-sm font-bold text-slate-900 truncate cursor-pointer hover:text-emerald-700"
                      >
                        {title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{place.area}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          onSelectPlace(place);
                          onClose();
                        }}
                        className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline"
                      >
                        <span>{t('view_details')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => toggleFavorite(place.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
