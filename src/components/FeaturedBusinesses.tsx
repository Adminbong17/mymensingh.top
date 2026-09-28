import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Navigation, Heart, CheckCircle2, Sparkles, Building2, PlusCircle } from 'lucide-react';
import type { Business } from '../types';
import { useData } from '../context/DataContext';

interface FeaturedBusinessesProps {
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({
  businesses,
  onSelectBusiness,
}) => {
  const { toggleFavorite, isFavorite } = useData();

  const handleCall = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleDirection = (e: React.MouseEvent, lat: number, lng: number) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified & Top Rated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Featured Businesses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহের সবচেয়ে জনপ্রিয় ও নির্ভরযোগ্য রেস্তোরাঁ, হোটেল, হাসপাতাল ও শপিং মার্কেট
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {businesses.length > 0 ? `${businesses.length}টি তালিকাভুক্ত প্রতিষ্ঠান` : 'তালিকাভুক্ত ব্যবসা'}
          </span>
        </div>

        {/* Empty state or Grid */}
        {businesses.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                বর্তমানে কোনো ব্যবসা ডাটাবেজে যুক্ত নেই
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                ময়মনসিংহ সিটি গাইডে আপনার প্রতিষ্ঠান যুক্ত করে হাজার হাজার নাগরিকের কাছে সরাসরি পৌঁছে দিন।
              </p>
            </div>
            <Link
              to="/list-business"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ আপনার ব্যবসা যুক্ত করুন (List Business)</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.slice(0, 6).map((biz) => {
              const favorited = isFavorite(biz.id);

              return (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Photo */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={biz.image_url}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-xs">
                          {biz.category}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, biz.id)}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                          favorited
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
                        }`}
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                      </button>

                      {/* Rating & Review Count on image */}
                      <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{biz.rating}</span>
                        <span className="text-slate-300 text-[11px] font-normal">
                          ({biz.review_count} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {biz.name}
                        </h3>
                        <span title="Verified Listing">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        </span>
                      </div>

                      {biz.name_bn && (
                        <p className="text-xs text-slate-500 font-medium">
                          {biz.name_bn}
                        </p>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1 font-medium">{biz.location}</span>
                      </div>

                      {biz.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                          {biz.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Buttons: Call & Direction */}
                  <div className="p-4 px-5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleCall(e, biz.phone)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call ({biz.phone ? biz.phone.split('-')[0] : 'Contact'})</span>
                    </button>

                    <button
                      onClick={(e) => handleDirection(e, biz.latitude, biz.longitude)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition-all hover:border-slate-300"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Direction</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
