import React from 'react';
import { Newspaper, Calendar, Clock, X, ExternalLink } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8">
        <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
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
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
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

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {modalTitle}
          </h2>

          {modalExcerpt && (
            <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 leading-relaxed">
              {modalExcerpt}
            </p>
          )}

          {cleanBody && cleanBody !== modalExcerpt && (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {cleanBody}
            </p>
          )}

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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
              >
                <span>মূল প্রতিবেদন পড়ুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
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
