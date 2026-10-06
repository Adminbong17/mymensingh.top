import React from 'react';
import { Heart, Star, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import type { Place } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { generateBrandBannerSvg } from '../lib/brandBannerUtils';

interface PlaceCardProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect }) => {
  const { language, t } = useLanguage();
  const { toggleFavorite, isFavorite } = useData();
  const favorited = isFavorite(place.id);

  const title = language === 'bn' ? place.name_bn || place.name_en : place.name_en;
  const tagline = language === 'bn' ? place.tagline_bn || place.tagline_en : place.tagline_en;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(place.id);
  };

  return (
    <div
      onClick={() => onSelect(place)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Image Cover */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <img
            src={place.image_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = generateBrandBannerSvg(
                place.name_bn || place.name_en || '',
                place.name_en || '',
                place.category,
                place.area,
                place.phone
              );
            }}
          />

          {/* Gradient Overlay for bottom text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Area & Featured Badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {place.area}
            </span>
            {place.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                {language === 'bn' ? 'বিশেষ' : 'Featured'}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              favorited
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>

          {/* Rating tag bottom */}
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{place.rating}</span>
            <span className="text-slate-300 font-normal text-[11px]">({place.review_count})</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {tagline}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {(place.tags || []).slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleDirections}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('get_directions')}</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>{t('view_details')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
