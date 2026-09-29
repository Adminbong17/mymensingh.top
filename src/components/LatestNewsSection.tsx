import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, ArrowRight, X, ExternalLink } from 'lucide-react';
import type { NewsArticle } from '../types';
import { parseArticleSource, cleanNewsText } from '../lib/newsUtils';

interface LatestNewsSectionProps {
  news: NewsArticle[];
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ news }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <section id="news" className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-1">
              <Newspaper className="w-3.5 h-3.5" />
              <span>City Updates & Headlines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Latest News from Mymensingh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহের উন্নয়ন, শিক্ষা, পর্যটন ও নাগরিক জীবনের সাম্প্রতিক খবর
            </p>
          </div>
        </div>

        {/* News Cards Grid or Empty State */}
        {news.length === 0 ? (
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
            {news.map((item, index) => {
              const isFeaturedNews = index === 0; // First item is highlighted
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className={`group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isFeaturedNews ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div>
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.read_time}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {cleanNewsText(item.excerpt)}
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

        {/* Read Full News Modal */}
        {selectedArticle && (() => {
          const { cleanBody, sourceName, sourceUrl } = parseArticleSource(selectedArticle.content);
          return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="fixed inset-0 -z-10" onClick={() => setSelectedArticle(null)} />
              
              <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8">
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={selectedArticle.image_url}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      {selectedArticle.category}
                    </span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.read_time}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {selectedArticle.title}
                  </h2>

                  {selectedArticle.excerpt && cleanNewsText(selectedArticle.excerpt) && (
                    <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
                      {cleanNewsText(selectedArticle.excerpt)}
                    </p>
                  )}

                  {cleanBody && cleanBody !== selectedArticle.excerpt && (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {cleanBody}
                    </p>
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

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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
    </section>
  );
};
