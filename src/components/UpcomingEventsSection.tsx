import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';
import type { EventItem } from '../types';

const DOTS_COUNT = 4;

interface UpcomingEventsSectionProps {
  events: EventItem[];
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events }) => {
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayEvents = events.slice(0, 10); // Show up to 10 in slider

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
  }, [updateScrollState, displayEvents]);

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
    if (isPaused || displayEvents.length <= 1) return;

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
  }, [isPaused, displayEvents]);

  return (
    <section id="events" className="py-10 sm:py-14 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="truncate">আসন্ন ইভেন্ট</span>
              <span className="text-emerald-400">•</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>স্লাইড</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              Upcoming Events
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
              ময়মনসিংহের আসন্ন মেলা, সাংস্কৃতিক উৎসব ও ফুড কার্নিভাল
            </p>
          </div>

          {/* Top Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous events"
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
              aria-label="Next events"
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

        {/* Events Slider */}
        {displayEvents.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              বর্তমানে কোনো আসন্ন ইভেন্ট তালিকাভুক্ত নেই
            </h3>
            <p className="text-xs text-slate-500">
              নতুন মেলা, উৎসব বা আয়োজনের শিডিউল যুক্ত হলে এখানে সরাসরি দেখতে পাবেন।
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
              {displayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="group shrink-0 w-[78vw] min-[400px]:w-[75vw] sm:w-[330px] md:w-[350px] lg:w-[365px] snap-start bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={evt.image_url}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                          {evt.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-extrabold bg-amber-400 text-slate-900 shadow-md">
                          {evt.entry_fee}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-5 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5 truncate">
                          {evt.title_bn}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => navigate('/events')}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>অংশগ্রহণ করুন / Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pagination Dots & View All Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {displayEvents.length > 1 && (
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

          {events.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>সকল {events.length}টি বিশেষ আয়োজন দেখুন</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
