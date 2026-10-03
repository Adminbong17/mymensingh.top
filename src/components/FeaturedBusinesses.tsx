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
    const scrollAmount = Math.max(300, scrollRef.current.clientWidth * 0.75);
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
      const step = 340;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, displayBusinesses]);

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Title and Slider Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified & Top Rated</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] sm:text-xs font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span>স্লাইডার</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-1.5">
              Featured Businesses
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                ময়মনসিংহের সবচেয়ে জনপ্রিয় ও নির্ভরযোগ্য প্রতিষ্ঠানসমূহ
              </p>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>স্লাইড করে দেখুন ⟵ ⟶</span>
              </span>
            </div>
          </div>

          {/* Top Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous businesses"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-slate-700 shadow-md hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg active:scale-95 border border-slate-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next businesses"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-emerald-50 text-emerald-700 shadow-md hover:bg-emerald-600 hover:text-white hover:shadow-lg active:scale-95 border border-emerald-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
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
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-3 px-1 scrollbar-none select-none"
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
                    className="group shrink-0 w-[280px] min-[480px]:w-[310px] sm:w-[350px] md:w-[365px] bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
                          type="button"
                          onClick={(e) => handleFavoriteClick(e, biz.id)}
                          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
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
                        type="button"
                        onClick={(e) => handleCall(e, biz.phone)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call ({biz.phone ? biz.phone.split('-')[0] : 'Contact'})</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDirection(e, biz.latitude, biz.longitude)}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition-all hover:border-slate-300 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
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
        <div className="pt-2 flex flex-col items-center justify-center gap-4">
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
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
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
