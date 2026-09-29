import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Share2,
  X,
  MessageSquareQuote,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { NewsArticle } from '../types';
import {
  parseArticleSource,
  cleanNewsText,
  normalizePunctuation,
  sortNewsByDate
} from '../lib/newsUtils';

const THEME_IMAGE = '/images/news-placeholder.svg';

export const NewsPage: React.FC = () => {
  const { news } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'All',
    'ময়মনসিংহ',
    'বাংলাদেশ',
    'আন্তর্জাতিক',
    'খেলাধুলা'
  ];

  // Sort all news by recency
  const sortedNews = sortNewsByDate(news);

  const filteredNews = sortedNews.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q) || (item.title_en && item.title_en.toLowerCase().includes(q));
      const matchContent = item.content.toLowerCase().includes(q);
      if (!matchTitle && !matchContent) return false;
    }
    return true;
  });

  const featuredStory = filteredNews.length > 0 ? filteredNews[0] : null;

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* News Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Global, National & Local News</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              দেশ ও বিদেশের সর্বশেষ সংবাদ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ময়মনসিংহ, জাতীয়, আন্তর্জাতিক ও খেলাধুলার গুরুত্বপূর্ণ সকল খবর সবার আগে জানুন।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Story Featured Banner (if exists and on 'All' category) */}
        {featuredStory && selectedCategory === 'All' && !searchKeyword && (
          <div
            onClick={() => setActiveArticle(featuredStory)}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-auto h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900">
              <img
                src={featuredStory.image_url || THEME_IMAGE}
                alt={normalizePunctuation(featuredStory.title)}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('news-placeholder.svg')) {
                    target.onerror = null;
                    target.src = THEME_IMAGE;
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  <span>শীর্ষ সংবাদ (Top Story)</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {featuredStory.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {featuredStory.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredStory.read_time}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {normalizePunctuation(featuredStory.title)}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                  {cleanNewsText(featuredStory.excerpt)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                  সম্পূর্ণ খবরটি পড়ুন <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Categories Pill */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'সকল সংবাদ' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="সংবাদ খুঁজুন..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              সংবাদ তালিকা ({filteredNews.length}টি)
            </h3>
          </div>

          {filteredNews.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">কোনো সংবাদ পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-400 mt-1">অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে দেখুন অথবা নতুন সংবাদ প্রকাশ করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => {
                const cleanItemTitle = normalizePunctuation(item.title);
                const cleanItemExcerpt = cleanNewsText(item.excerpt);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveArticle(item)}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                        <img
                          src={item.image_url || THEME_IMAGE}
                          alt={cleanItemTitle}
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
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.read_time}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {cleanItemTitle}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {cleanItemExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 px-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        বিস্তারিত পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit News CTA */}
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-950">
                আপনার এলাকার কোনো সংবাদ বা তথ্য জানাতে চান?
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                ময়মনসিংহ শহরের যেকোনো জরুরি খবর বা ইভেন্ট আমাদের নিউজরুমে সরাসরি পাঠাতে পারেন।
              </p>
            </div>
          </div>
          <a
            href="mailto:news@mymensingh.top"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            সংবাদ পাঠান (Send News)
          </a>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (() => {
        const { cleanBody, sourceName, sourceUrl } = parseArticleSource(activeArticle.content);
        const modalTitle = normalizePunctuation(activeArticle.title);
        const modalExcerpt = cleanNewsText(activeArticle.excerpt);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="relative aspect-16/9 bg-slate-900 shrink-0">
                <img
                  src={activeArticle.image_url || THEME_IMAGE}
                  alt={modalTitle}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('news-placeholder.svg')) {
                      target.onerror = null;
                      target.src = THEME_IMAGE;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    {activeArticle.category}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeArticle.read_time}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {modalTitle}
                </h2>

                {modalExcerpt && (
                  <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 leading-relaxed">
                    {modalExcerpt}
                  </p>
                )}

                {cleanBody && cleanBody !== modalExcerpt && (
                  <div className="text-sm text-slate-700 leading-relaxed space-y-3 pt-2 whitespace-pre-line">
                    <p>{cleanBody}</p>
                  </div>
                )}

                {/* Styled Source Attribution & Clickable Link Button */}
                {sourceUrl && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-slate-400 block">সংবাদ সূত্র:</span>
                        <span className="text-xs font-bold text-slate-800">
                          {sourceName || 'মূল পোর্টাল'}
                        </span>
                      </div>
                    </div>

                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm hover:shadow transition-all shrink-0"
                    >
                      <span>মূল প্রতিবেদন পড়ুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('খবরের লিংক কপি করা হয়েছে!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>লিংক শেয়ার করুন</span>
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
