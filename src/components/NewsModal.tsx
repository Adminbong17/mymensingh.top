import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, X, ExternalLink, Sparkles, BookOpen, Share2, Check, Tv } from 'lucide-react';
import type { NewsArticle } from '../types';
import { parseArticleSource, cleanNewsText, normalizePunctuation } from '../lib/newsUtils';
import { formatNewsTimeDisplay } from '../lib/newsTime';

const THEME_IMAGE = '/images/news-placeholder.svg';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

// Regex to detect schedule/fixture lines:
// e.g. "বাংলাদেশ-শ্রীলঙ্কা সকাল ৬টা, সনি স্পোর্টস ১" or "ক্রোয়েশিয়া-ইংল্যান্ড রাত ১০টা, সনি স্পোর্টস ২"
const SCHEDULE_REGEX = /^([^\n]+?)\s+((?:সকাল|দুপুর|বেলা|বিকাল|সন্ধ্যা|রাত)\s*[০-৯0-9]+(?:[-–:][০-৯0-9]+)?\s*(?:মি\.)?\s*,?\s*.*)$/;

function splitCombinedFixtures(str: string): string[] {
  return str
    .replace(/(ইউটিউব\/[^\s]+|সনি\s*স্পোর্টস\s*[০-৯0-9\sও]+|টি\s*স্পোর্টস|স্টার\s*স্পোর্টস\s*[০-৯0-9]+)\s+([^\n0-9,.:;?!–—\-]+[–—\-][^\n0-9,.:;?!]+)/gi, '$1\n$2')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const { cleanBody, sourceName, sourceUrl } = parseArticleSource(article.content);
  const modalTitle = normalizePunctuation(article.title);
  const modalExcerpt = cleanNewsText(article.excerpt);
  const modalTime = formatNewsTimeDisplay(article.created_at, article.date);

  // If cleanBody is long and distinct from excerpt, show excerpt as summary box
  const hasDistinctBody = Boolean(
    cleanBody &&
    modalExcerpt &&
    cleanBody.length > modalExcerpt.length + 50 &&
    !cleanBody.startsWith(modalExcerpt.slice(0, 50))
  );

  // Effective text to show under full report
  const reportText = hasDistinctBody ? cleanBody : (cleanBody || modalExcerpt || '');
  
  // Split into major chunks (by double newline)
  const chunks = reportText
    .split(/\n\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const handleCopyLink = () => {
    const url = sourceUrl || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Clickable backdrop overlay */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Card: Unified scroll container so scrolling works everywhere */}
      <div className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-auto z-10 max-h-[92vh] overflow-y-auto overscroll-contain flex flex-col scroll-smooth focus:outline-hidden">
        
        {/* Floating Sticky Close Button: Always visible even when user scrolls down */}
        <div className="sticky top-0 z-30 flex justify-end p-3 pointer-events-none -mb-14">
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto border border-white/20"
            aria-label="Close"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Hero Image Banner */}
        <div className="relative aspect-16/9 sm:aspect-21/9 lg:aspect-16/8 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={article.image_url || THEME_IMAGE}
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3.5 left-4 sm:left-6">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600/90 text-white shadow-md backdrop-blur-sm border border-emerald-400/30">
              {article.category === 'ময়মনসিংহ' ? 'ময়মনসিংহ বিভাগ' : article.category}
            </span>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              {modalTime.isWithin24h ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <strong className="text-emerald-700 font-bold">{modalTime.timeAgoText}</strong>
                  <span className="text-slate-400">({article.date})</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{article.date}</span>
                </>
              )}
            </span>
            <span className="text-slate-300">•</span>
            <span>{article.read_time}</span>
          </div>

          {/* Headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
            {modalTitle}
          </h2>

          {/* Summary Excerpt (shown only if distinct teaser from main body) */}
          {hasDistinctBody && (
            <div className="bg-emerald-50/90 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 space-y-1.5 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>সংক্ষিপ্ত সারসংক্ষেপ</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-emerald-950 leading-relaxed">
                {modalExcerpt}
              </p>
            </div>
          )}

          {/* মূল প্রতিবেদন (Full Article Body) */}
          <div className="space-y-4 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>মূল প্রতিবেদন</span>
            </div>

            <div className="space-y-3.5">
              {chunks.map((chunk, idx) => {
                // 1. Is it a Section Heading (e.g. ### এশিয়ান গেমস: ক্রিকেট)?
                if (chunk.startsWith('###') || chunk.startsWith('##')) {
                  const headingText = chunk.replace(/^###?\s*/, '').trim();
                  return (
                    <div key={idx} className="pt-3 pb-1">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-extrabold shadow-sm">
                        <Tv className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{headingText}</span>
                      </div>
                    </div>
                  );
                }

                // 2. Split chunk into sublines and check for TV schedule / fixture items
                const lines = splitCombinedFixtures(chunk);
                const hasScheduleItems = lines.some(l => SCHEDULE_REGEX.test(l));

                if (hasScheduleItems) {
                  return (
                    <div key={idx} className="space-y-2">
                      {lines.map((line, lIdx) => {
                        const schedMatch = line.match(SCHEDULE_REGEX);
                        if (schedMatch) {
                          const matchTitle = schedMatch[1].replace(/\*\*/g, '').trim();
                          const timing = schedMatch[2].trim();
                          return (
                            <div
                              key={lIdx}
                              className="bg-slate-50/90 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all shadow-xs group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                                  {matchTitle}
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-bold self-start sm:self-auto shrink-0 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{timing}</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <p key={lIdx} className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  );
                }

                // 3. Regular news article paragraph
                return (
                  <p key={idx} className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose font-normal">
                    {chunk}
                  </p>
                );
              })}
            </div>

            {/* Note if the article body is short bulletin */}
            {reportText.length < 150 && sourceUrl && (
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <span className="text-base leading-none">ℹ️</span>
                <span>এটি একটি সংক্ষেপিত তাজা সংবাদ বুলেটিন। সম্পূর্ণ বিস্তারিত ও প্রাসঙ্গিক তথ্য জানতে নিচে <strong>‘মূল প্রতিবেদন পড়ুন’</strong> বাটনে ক্লিক করে মূল সংবাদ পোর্টালে ভিজিট করুন।</span>
              </div>
            )}
          </div>

          {/* Source Attribution & Direct External Read Link */}
          {sourceUrl && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">সংবাদ সূত্র:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {sourceName || 'মূল পোর্টাল'}
                  </span>
                </div>
              </div>

              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0 cursor-pointer"
              >
                <span>মূল প্রতিবেদন পড়ুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Footer Actions: Share link & Close Button with generous spacing */}
          <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">লিংক কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>লিংক শেয়ার করুন</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
