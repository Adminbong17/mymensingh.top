import React, { useState } from 'react';
import { Tag, Copy, Check, Clock, Building2 } from 'lucide-react';
import type { OfferItem } from '../types';

interface LatestOffersSectionProps {
  offers: OfferItem[];
}

export const LatestOffersSection: React.FC<LatestOffersSectionProps> = ({ offers }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-14 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-3 py-1 rounded-full mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Hot Deals & Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Latest Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              স্থানীয় রেস্তোরাঁ, ফার্মেসি ও হোটেলের এক্সক্লুসিভ ডিসকাউন্ট ও কুপন কোড
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {offers.length > 0 ? `${offers.length}টি সীমিত সময়ের অফার` : 'সেরা অফার'}
          </span>
        </div>

        {/* Offers Grid or Empty State */}
        {offers.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              বর্তমানে কোনো সক্রিয় অফার বা ছাড় নেই
            </h3>
            <p className="text-xs text-slate-500">
              স্থানীয় রেস্তোরাঁ ও শপগুলোর নতুন অফার ও ভাউচার এখানে দেখতে পাবেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((off) => (
              <div
                key={off.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={off.image_url}
                      alt={off.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-lg shadow-rose-600/30 uppercase tracking-wider">
                        {off.discount}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{off.business_name}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {off.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {off.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>মেয়াদ: {off.expiry_date} পর্যন্ত</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code & Claim Button */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100/80 px-3 py-2 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
                      {off.promo_code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(off.promo_code)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      title="Copy Promo Code"
                    >
                      {copiedCode === off.promo_code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-[11px]">{copiedCode === off.promo_code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
