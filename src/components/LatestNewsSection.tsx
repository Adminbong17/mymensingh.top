import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '../types';
import {
  cleanNewsText,
  normalizePunctuation,
  sortNewsByDate
} from '../lib/newsUtils';
import { formatNewsTimeDisplay } from '../lib/newsTime';
import { NewsModal } from './NewsModal';

const THEME_IMAGE = '/images/news-placeholder.svg';

interface LatestNewsSectionProps {
  news: NewsArticle[];
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ news }) => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // 1. Sort news strictly by recency/time from source
  const sortedNews = sortNewsByDate(news);

  // 2. Limit display to maximum 6 articles on Homepage
  const displayNews = sortedNews.slice(0, 6);

  return (
    <section id="news" className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Title and View All Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-1">
              <Newspaper className="w-3.5 h-3.5" />
              <span>National, Global & Local News</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              দেশ ও বিদেশের সর্বশেষ সংবাদ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহ, বাংলাদেশ, আন্তর্জাতিক ঘটনাবলি ও খেলাধুলার সাম্প্রতিক খবর ও আপডেট
            </p>
          </div>

          {news.length > 0 && (
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>সব খবর দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* News Cards Grid or Empty State */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNews.map((item, index) => {
              const isFeaturedNews = index === 0; // First item is highlighted
              const cleanTitle = normalizePunctuation(item.title);
              const cleanExcerpt = cleanNewsText(item.excerpt);
              const timeDisplay = formatNewsTimeDisplay(item.created_at, item.date);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className={`group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isFeaturedNews ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
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
                          {item.category}
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
        )}

        {/* View All Redirection CTA Button at bottom */}
        {news.length > 6 && (
          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-600/30 hover:border-emerald-600 font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <span>সকল {news.length}টি খবর ও বুলেটিন দেখুন</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

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
