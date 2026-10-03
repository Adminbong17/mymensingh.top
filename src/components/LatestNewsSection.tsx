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
    if (isPaused || displayNews.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = scrollRef.current.clientWidth * 0.8;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, displayNews]);

  return (
    <section id="news" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <Newspaper className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="truncate">সর্বশেষ খবর</span>
              <span className="text-emerald-400">•</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>স্লাইড</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              দেশ ও বিদেশের সর্বশেষ সংবাদ
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
              ময়মনসিংহ বিভাগ ও জাতীয় সাম্প্রতিক খবর ও বুলেটিন
            </p>
          </div>

          {/* Top Right Navigation Arrow Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous news"
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
              aria-label="Next news"
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
              {displayNews.map((item) => {
                const cleanTitle = normalizePunctuation(item.title);
                const cleanExcerpt = cleanNewsText(item.excerpt);
                const timeDisplay = formatNewsTimeDisplay(item.created_at, item.date);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="group shrink-0 w-[78vw] min-[400px]:w-[75vw] sm:w-[330px] md:w-[350px] lg:w-[370px] snap-start bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                            {item.category === 'ময়মনসিংহ' ? 'ময়মনসিংহ বিভাগ' : item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-medium">
                          <span className="flex items-center gap-1">
                            {timeDisplay.isWithin24h ? (
                              <Clock className="w-3 h-3 text-emerald-600 animate-pulse" />
                            ) : (
                              <Calendar className="w-3 h-3 text-emerald-600" />
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

                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {cleanTitle}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {cleanExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
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
        <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:gap-4">
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
              className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-600/25 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
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
