import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, ArrowRightLeft } from 'lucide-react';
import type { NewsArticle } from '../types';
import {
  cleanNewsText,
  normalizePunctuation,
  sortNewsByDate
} from '../lib/newsUtils';
import { formatNewsTimeDisplay } from '../lib/newsTime';
import { NewsModal } from './NewsModal';

const THEME_IMAGE = '/images/news-placeholder.svg';
const DOTS_COUNT = 5;

interface LatestNewsSectionProps {
  news: NewsArticle[];
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ news }) => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Sort news strictly by recency/time from source
  const sortedNews = sortNewsByDate(news);
  const displayNews = sortedNews.slice(0, 12); // Show up to 12 in slider

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
  }, [updateScrollState, displayNews]);

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
    if (isPaused || displayNews.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = 340;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, displayNews]);

  return (
    <section id="news" className="py-14 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Title and Slider Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                <Newspaper className="w-3.5 h-3.5" />
                <span>National, Global & Local News</span>
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
              দেশ ও বিদেশের সর্বশেষ সংবাদ
            </h2>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                ময়মনসিংহ বিভাগ, বাংলাদেশ, আন্তর্জাতিক ও খেলাধুলার সাম্প্রতিক খবর
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
              aria-label="Previous news"
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
              aria-label="Next news"
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

        {/* News Cards Slider */}
        {displayNews.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Newspaper className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              বর্তমানে কোনো সংবাদ বুলেটিন প্রকাশিত নেই
            </h3>
            <p className="text-xs text-slate-500">
              নতুন সংবাদ ও আপডেট যুক্ত হলে এখানে সরাসরি প্রকাশিত হবে।
            </p>
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
              {displayNews.map((item) => {
                const cleanTitle = normalizePunctuation(item.title);
                const cleanExcerpt = cleanNewsText(item.excerpt);
                const timeDisplay = formatNewsTimeDisplay(item.created_at, item.date);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="group shrink-0 w-[290px] min-[480px]:w-[320px] sm:w-[360px] md:w-[380px] bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                        <img
                          src={item.image_url || THEME_IMAGE}
                          alt={cleanTitle}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('news-placeholder.svg')) {
                              target.onerror = null;
                              target.src = THEME_IMAGE;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                            {item.category === 'ময়মনসিংহ' ? 'ময়মনসিংহ বিভাগ' : item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[11px] font-medium">
                          <span className="flex items-center gap-1">
                            {timeDisplay.isWithin24h ? (
                              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className={timeDisplay.isWithin24h ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                              {timeDisplay.displayDate}
                            </span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.read_time}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {cleanTitle}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {cleanExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>বিস্তারিত পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Pagination Dots & View All Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-4">
          {displayNews.length > 1 && (
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

          {news.length > 0 && (
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Newspaper className="w-4 h-4" />
              <span>সকল {news.length}টি খবর ও বুলেটিন দেখুন</span>
            </button>
          )}
        </div>

        {/* Read Full News Modal */}
        {selectedArticle && (
          <NewsModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}

      </div>
    </section>
  );
};
