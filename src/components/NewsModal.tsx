import React from 'react';
import { Newspaper, Calendar, Clock, X, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import type { NewsArticle } from '../types';
import { parseArticleSource, cleanNewsText, normalizePunctuation } from '../lib/newsUtils';
import { formatNewsTimeDisplay } from '../lib/newsTime';

const THEME_IMAGE = '/images/news-placeholder.svg';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  const { cleanBody, sourceName, sourceUrl } = parseArticleSource(article.content);
  const modalTitle = normalizePunctuation(article.title);
  const modalExcerpt = cleanNewsText(article.excerpt);
  const modalTime = formatNewsTimeDisplay(article.created_at, article.date);

  // Extract body paragraphs
  const rawBody = cleanBody || modalExcerpt || '';
  const paragraphs = rawBody
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Determine if excerpt is a distinct short teaser compared to the body
  const showExcerptBox = Boolean(
    modalExcerpt &&
    cleanBody &&
    cleanBody.length > modalExcerpt.length + 30
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-6 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Top Hero Image Banner */}
        <div className="relative aspect-16/9 overflow-hidden bg-slate-900 shrink-0">
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
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer shadow-md z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium pb-1 border-b border-slate-100">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
              {article.category}
            </span>
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {modalTitle}
          </h2>

          {/* Summary Excerpt (if distinct from main body) */}
          {showExcerptBox && (
            <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>সংক্ষিপ্ত সারসংক্ষেপ</span>
              </div>
              <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                {modalExcerpt}
              </p>
            </div>
          )}

          {/* মূল প্রতিবেদন (Full Article Body) */}
          <div className="space-y-3.5 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>মূল প্রতিবেদন</span>
            </div>

            <div className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose space-y-3.5 whitespace-pre-line font-normal">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="leading-relaxed sm:leading-loose">
                  {para}
                </p>
              ))}
            </div>

            {/* Note if the article body is short */}
            {paragraphs.length <= 1 && sourceUrl && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <span>ℹ️ সম্পূর্ণ ছবি ও প্রাসঙ্গিক বিস্তার দেখতে নিচের ‘মূল প্রতিবেদন পড়ুন’ বাটনে ক্লিক করুন।</span>
              </div>
            )}
          </div>

          {/* Source Attribution & Direct External Read Link */}
          {sourceUrl && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Newspaper className="w-4 h-4" />
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

          {/* Close Action */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
