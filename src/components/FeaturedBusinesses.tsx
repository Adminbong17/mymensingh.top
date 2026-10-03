import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Phone,
  Navigation,
  Heart,
  CheckCircle2,
  Sparkles,
  Building2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  LayoutGrid
} from 'lucide-react';
import type { Business } from '../types';
import { useData } from '../context/DataContext';

const DOTS_COUNT = 5;

interface FeaturedBusinessesProps {
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({
  businesses,
  onSelectBusiness,
}) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useData();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayBusinesses = businesses.slice(0, 12); // Show top 12 in slider

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
  }, [updateScrollState, displayBusinesses]);

  // Smooth Scroll handler for Left/Right buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = Math.max(260, scrollRef.current.clientWidth * 0.8);
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
    if (isPaused || displayBusinesses.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = scrollRef.current.clientWidth * 0.8;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, displayBusinesses]);

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="truncate">টপ রেটেড প্রতিষ্ঠান</span>
              <span className="text-emerald-400">•</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>স্লাইড</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              Featured Businesses
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
              ময়মনসিংহের সবচেয়ে জনপ্রিয় ও নির্ভরযোগ্য প্রতিষ্ঠানসমূহ
            </p>
          </div>

          {/* Top Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous businesses"
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-slate-700 shadow-md hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg active:scale-95 border border-slate-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next businesses"
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-emerald-50 text-emerald-700 shadow-md hover:bg-emerald-600 hover:text-white hover:shadow-lg active:scale-95 border border-emerald-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Empty state or Slider */}
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
          <div
            className="relative -mx-3 px-3 sm:mx-0 sm:px-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-5 overflow-x-auto scroll-smooth py-2 px-1 scrollbar-none select-none snap-x snap-mandatory"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {displayBusinesses.map((biz) => {
                const favorited = isFavorite(biz.id);

                return (
                  <div
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="group shrink-0 w-[78vw] min-[400px]:w-[75vw] sm:w-[330px] md:w-[350px] lg:w-[365px] snap-start bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-xs">
                            {biz.category}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => handleFavoriteClick(e, biz.id)}
                          className={`absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                            favorited
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
                          }`}
                          aria-label="Save to favorites"
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorited ? 'fill-white' : ''}`} />
                        </button>

                        {/* Rating & Review Count on image */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                          <span>{biz.rating}</span>
                          <span className="text-slate-300 text-[10px] sm:text-[11px] font-normal">
                            ({biz.review_count} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-3.5 sm:p-5 space-y-1.5 sm:space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {biz.name}
                          </h3>
                          <span title="Verified Listing">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 mt-0.5" />
                          </span>
                        </div>

                        {biz.name_bn && (
                          <p className="text-xs text-slate-500 font-medium truncate">
                            {biz.name_bn}
                          </p>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1 font-medium">{biz.location}</span>
                        </div>

                        {biz.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
                            {biz.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Buttons: Call & Direction */}
                    <div className="p-3 sm:p-4 px-3.5 sm:px-5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCall(e, biz.phone)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer truncate"
                      >
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="truncate">Call ({biz.phone ? biz.phone.split('-')[0] : 'Contact'})</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDirection(e, biz.latitude, biz.longitude)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-[11px] sm:text-xs font-bold transition-all hover:border-slate-300 cursor-pointer shrink-0"
                      >
                        <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                        <span>Direction</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Pagination Dots & View All Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {displayBusinesses.length > 1 && (
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
          )}

          {businesses.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>সকল {businesses.length}টি প্রতিষ্ঠান ও ডিরেক্টরি দেখুন</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
