import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
  CheckCircle,
  Share2
} from 'lucide-react';
import type { Business } from '../types';
import { useData } from '../context/DataContext';
import { generateBrandBannerSvg } from '../lib/brandBannerUtils';
import { generateDoctorBannerSvg } from '../lib/doctorBannerUtils';

interface BusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
}) => {
  const { isFavorite, toggleFavorite, reviews, submitReview } = useData();

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!business) return null;

  const favorited = isFavorite(business.id);
  const businessReviews = reviews.filter((r) => r.place_id === business.id && r.status === 'approved');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    await submitReview({
      place_id: business.id,
      user_name: reviewName.trim() || 'সম্মানিত গ্রাহক',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setReviewComment('');
    setReviewName('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header bar */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {business.category} • {business.upazila}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {copiedLink && (
              <span className="text-xs text-emerald-600 font-semibold absolute top-14 right-16 bg-white px-2 py-1 rounded-md shadow-md border">
                Copied!
              </span>
            )}

            <button
              onClick={() => toggleFavorite(business.id)}
              className={`p-2 rounded-full transition-colors ${
                favorited ? 'text-rose-500 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Favorite"
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Photo */}
          {(() => {
            const isDoctor = 
              business.category_slug === 'doctor' || 
              business.category_slug === 'doctors' || 
              business.category?.toLowerCase() === 'doctor' || 
              business.category?.toLowerCase() === 'doctors';

            const defaultBanner = isDoctor
              ? generateDoctorBannerSvg(business.name_bn || business.name, business.name_en || business.name, business.subcategory || business.category, business.location)
              : generateBrandBannerSvg(business.name_bn || business.name, business.name_en || business.name, business.category, business.location, business.phone);

            return (
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={business.image_url || defaultBanner}
                  alt={business.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultBanner;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-sm font-bold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{business.rating}</span>
                  <span className="text-slate-300 text-xs font-normal">
                    ({business.review_count} reviews)
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Title & Location */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {business.name}
              </h2>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
            {business.name_bn && (
              <p className="text-sm font-semibold text-emerald-700">
                {business.name_bn}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{business.location}</span>
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  সময়সূচি / Opening Hours
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {business.opening_hours || '10:00 AM - 10:00 PM'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Phone className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  যোগাযোগ ফোন নম্বর
                </span>
                <a
                  href={`tel:${business.phone}`}
                  className="text-xs sm:text-sm font-bold text-rose-600 hover:underline"
                >
                  {business.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${business.phone}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call ({business.phone})</span>
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Direction on Map</span>
            </a>
          </div>

          {/* Description */}
          {business.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                ব্যবসা ও সেবার বিবরণ
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {business.description}
              </p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>গ্রাহক মতামত ও রিভিউ ({businessReviews.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {businessReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a review */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                আপনার রিভিউ দিন
              </h4>

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ধন্যবাদ! আপনার রিভিউটি গ্রহণ করা হয়েছে।</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                />

                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-4 h-4 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">{reviewRating} / 5</span>
                </div>
              </div>

              <textarea
                required
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>রিভিউ জমা দিন</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
