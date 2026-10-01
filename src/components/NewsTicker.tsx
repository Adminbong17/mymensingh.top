import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { NewsArticle } from '../types';
import { sortNewsByDate, normalizePunctuation } from '../lib/newsUtils';
import { formatNewsTimeDisplay } from '../lib/newsTime';
import { NewsModal } from './NewsModal';

const CATEGORY_COLORS: Record<string, string> = {
  'ময়মনসিংহ': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'বাংলাদেশ': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'আন্তর্জাতিক': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'খেলাধুলা': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export const NewsTicker: React.FC = () => {
  const navigate = useNavigate();
  const { news } = useData();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Sort articles strictly so newest added news is at the front
  const sorted = sortNewsByDate(news);
  const tickerItems = sorted.slice(0, 20);

  if (tickerItems.length === 0) {
    return null;
  }

  // Duplicate items for continuous seamless loop without jerk
  const marqueeItems = [...tickerItems, ...tickerItems];

  return (
    <>
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto pt-3 px-1">
        <div className="relative flex items-center bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl overflow-hidden py-1.5 sm:py-2 px-2 sm:px-3 text-white transition-colors group">
          
          {/* Left Fixed Badge: ব্রেকিং / তাজা বুলেটিন */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-rose-600/90 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-[11px] sm:text-xs shrink-0 shadow-md border border-rose-400/40 select-none z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="hidden sm:inline">তাজা বুলেটিন</span>
            <span className="sm:hidden">বুলেটিন</span>
          </div>

          {/* Left subtle fade mask */}
          <div className="hidden sm:block absolute left-28 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-900/90 to-transparent pointer-events-none z-10" />

          {/* Scrolling Ticker Track */}
          <div className="flex-1 overflow-hidden mx-2 sm:mx-3 py-0.5">
            <div className="news-marquee-track flex items-center">
              {marqueeItems.map((item, idx) => {
                const title = normalizePunctuation(item.title);
                const timeInfo = formatNewsTimeDisplay(item.created_at, item.date);
                const catStyle = CATEGORY_COLORS[item.category] || 'bg-slate-700/50 text-slate-300 border-slate-600';

                return (
                  <button
                    key={`${item.id}-${idx}`}
                    type="button"
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap group/item focus:outline-hidden"
                  >
                    {/* Category Tag */}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold border ${catStyle}`}>
                      {item.category === 'ময়মনসিংহ' ? 'ময়মনসিংহ বিভাগ' : item.category}
                    </span>

                    {/* Headline */}
                    <span className="font-semibold text-slate-100 group-hover/item:text-emerald-300 transition-colors">
                      {title}
                    </span>

                    {/* Relative Time (e.g. ১০ মিনিট আগে) */}
                    {timeInfo.isWithin24h ? (
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                        {timeInfo.timeAgoText}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        ({item.date})
                      </span>
                    )}

                    {/* Divider Symbol */}
                    <span className="text-white/25 select-none pl-3 font-normal">✦</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right subtle fade mask */}
          <div className="hidden sm:block absolute right-24 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-900/90 to-transparent pointer-events-none z-10" />

          {/* Right Action: সব খবর দেখুন */}
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold text-[11px] sm:text-xs shrink-0 transition-all border border-white/10 cursor-pointer select-none z-10"
            title="সকল সংবাদ দেখুন"
          >
            <Newspaper className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
            <span>সব খবর</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Reader Modal on Click */}
      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
};
