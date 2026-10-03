import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Copy,
  Check,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';
import type { OfferItem } from '../types';

const DOTS_COUNT = 4;

interface LatestOffersSectionProps {
  offers: OfferItem[];
}

export const LatestOffersSection: React.FC<LatestOffersSectionProps> = ({ offers }) => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayOffers = offers.slice(0, 10); // Show up to 10 in slider

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
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
  }, [updateScrollState, displayOffers]);

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
    if (isPaused || displayOffers.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = scrollRef.current.clientWidth * 0.8;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, displayOffers]);

  return (
    <section id="offers" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <Tag className="w-3 h-3 text-rose-700 shrink-0" />
              <span className="truncate">হট ডিসকাউন্ট</span>
              <span className="text-rose-400">•</span>
              <span className="inline-flex items-center gap-0.5 text-rose-700">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>স্লাইড</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              Latest Offers
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
              রেস্তোরাঁ, ফার্মেসি ও শপিংয়ের এক্সক্লুসিভ ডিসকাউন্ট ও কুপন কোড
            </p>
          </div>

          {/* Top Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous offers"
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-slate-700 shadow-md hover:bg-rose-50 hover:text-rose-700 hover:shadow-lg active:scale-95 border border-slate-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next offers"
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-rose-50 text-rose-700 shadow-md hover:bg-rose-600 hover:text-white hover:shadow-lg active:scale-95 border border-rose-200'
                  : 'bg-slate-100/80 text-slate-300 border border-slate-200/60 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Offers Slider */}
        {displayOffers.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              বর্তমানে কোনো সক্রিয় অফার বা ছাড় নেই
            </h3>
            <p className="text-xs text-slate-500">
              স্থানীয় রেস্তোরাঁ ও শপগুলোর নতুন অফার ও ভাউচার এখানে দেখতে পাবেন।
            </p>
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
              {displayOffers.map((off) => (
                <div
                  key={off.id}
                  className="group shrink-0 w-[78vw] min-[400px]:w-[75vw] sm:w-[330px] md:w-[350px] lg:w-[365px] snap-start bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={off.image_url}
                        alt={off.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-rose-600 text-white shadow-lg shadow-rose-600/30 uppercase tracking-wider">
                          {off.discount}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{off.business_name}</span>
                      </div>

                      <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {off.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {off.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>মেয়াদ: {off.expiry_date} পর্যন্ত</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code & Claim Button */}
                  <div className="p-3.5 sm:p-5 pt-2 sm:pt-3 border-t border-slate-100 flex items-center gap-2">
                    <div className="flex-1 bg-slate-100/80 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-800 uppercase truncate">
                        {off.promo_code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(off.promo_code)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                        title="Copy Promo Code"
                      >
                        {copiedCode === off.promo_code ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                        <span className="text-[11px]">{copiedCode === off.promo_code ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pagination Dots & View All Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {displayOffers.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-1">
              {Array.from({ length: DOTS_COUNT }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToDot(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeDotIndex === idx
                      ? 'w-6 h-2 bg-rose-600 rounded-full shadow-xs'
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300 rounded-full'
                  }`}
                />
              ))}
            </div>
          )}

          {offers.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/offers')}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-rose-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Tag className="w-4 h-4" />
              <span>সকল {offers.length}টি অফার ও ভাউচার দেখুন</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
