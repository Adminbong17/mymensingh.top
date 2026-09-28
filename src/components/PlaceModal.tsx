import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Star,
  Clock,
  Ticket,
  Phone,
  Globe,
  Heart,
  Navigation,
  MessageSquare,
  Send,
  CheckCircle,
  Share2
} from 'lucide-react';
import type { Place } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface PlaceModalProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({ place, onClose }) => {
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite, reviews, submitReview } = useData();

  const [activeImage, setActiveImage] = useState<string>('');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (place) {
      setActiveImage(place.image_url);
      setReviewSuccess(false);
      setCopiedLink(false);
    }
  }, [place]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!place) return null;

  const favorited = isFavorite(place.id);
  const title = language === 'bn' ? place.name_bn || place.name_en : place.name_en;
  const secondaryTitle = language === 'bn' ? place.name_en : place.name_bn;
  const tagline = language === 'bn' ? place.tagline_bn || place.tagline_en : place.tagline_en;
  const description = language === 'bn' ? place.description_bn || place.description_en : place.description_en;
  const address = language === 'bn' ? place.address_bn || place.address_en : place.address_en;
  const openingHours = language === 'bn' ? place.opening_hours_bn || place.opening_hours_en : place.opening_hours_en;
  const entryFee = language === 'bn' ? place.entry_fee_bn || place.entry_fee_en : place.entry_fee_en;

  const placeReviews = reviews.filter((r) => r.place_id === place.id && r.status === 'approved');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: tagline,
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
      place_id: place.id,
      user_name: reviewName.trim() || (language === 'bn' ? 'সম্মানিত অতিথি' : 'Guest Visitor'),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setReviewComment('');
    setReviewName('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header with Actions */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {place.area}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share button */}
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

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`p-2 rounded-full transition-colors ${
                favorited ? 'text-rose-500 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Favorite"
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Main Visuals & Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={activeImage || place.image_url}
                alt={title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-sm font-bold">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{place.rating}</span>
                <span className="text-slate-300 text-xs font-normal">({place.review_count} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Thumbnail Gallery if multiple */}
            {place.gallery_images && place.gallery_images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {place.gallery_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Titles & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {title}
            </h2>
            {secondaryTitle && (
              <p className="text-sm font-medium text-slate-400 mt-0.5">
                {secondaryTitle}
              </p>
            )}
            <p className="text-base text-emerald-800 font-medium mt-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
              {tagline}
            </p>
          </div>

          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            {/* Address */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {t('location')}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {address}
                </span>
              </div>
            </div>

            {/* Opening Hours */}
            {openingHours && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {t('opening_hours')}
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {openingHours}
                  </span>
                </div>
              </div>
            )}

            {/* Entry Fee */}
            {entryFee && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Ticket className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {t('entry_fee')}
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {entryFee}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Phone */}
            {place.phone && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {language === 'bn' ? 'যোগাযোগ' : 'Contact Phone'}
                  </span>
                  <a
                    href={`tel:${place.phone}`}
                    className="text-sm font-bold text-rose-600 hover:underline"
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('get_directions')}</span>
            </a>

            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{t('call_now')}</span>
              </a>
            )}

            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Description */}
          <div className="pt-2">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {language === 'bn' ? 'বিস্তারিত বর্ণনা ও ইতিহাস' : 'About this Place & History'}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(place.tags || []).map((t: string, idx: number) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Reviews & Feedback Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>{t('reviews')}</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {placeReviews.length}
                </span>
              </h3>
            </div>

            {/* List Reviews */}
            <div className="space-y-3 mb-6">
              {placeReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  {language === 'bn'
                    ? 'এখনও কোনো রিভিউ যুক্ত হয়নি। আপনার অভিজ্ঞতা শেয়ার করুন!'
                    : 'No reviews yet. Be the first to share your experience!'}
                </p>
              ) : (
                placeReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {t('write_a_review')}
              </h4>

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('review_submitted_notice')}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {t('your_name')}
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g., Tanvir Ahmed'}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {t('rating')} (1 - 5)
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 rounded-md hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {reviewRating} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  {t('comment')}
                </label>
                <textarea
                  required
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'এই স্থানটি সম্পর্কে আপনার অভিজ্ঞতা জানান...'
                      : 'Share your visit experience...'
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('submit_review')}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
