import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  Trash2,
  Clock,
  RotateCcw
} from 'lucide-react';
import type { OfferItem } from '../../../types';

interface OffersTabProps {
  offers: OfferItem[];
  onAddOffer: () => void;
  onDeleteOffer: (id: string) => void;
  onViewPublicPage: () => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({
  offers,
  onAddOffer,
  onDeleteOffer,
  onViewPublicPage
}) => {
  const [search, setSearch] = useState('');

  const filtered = offers.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.business_name.toLowerCase().includes(q) ||
      o.promo_code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Offers</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Offers & Discounts Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Publish exclusive discounts, coupons and promotional offers for city shops.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onViewPublicPage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Page</span>
            </button>

            <button
              onClick={onAddOffer}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Deals</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{offers.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">সব ডিসকাউন্ট অফার</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Partner Shops</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {new Set(offers.map(o => o.business_name).filter(Boolean)).size}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">যুক্ত থাকা দোকান</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Max Discount</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {offers.length > 0 ? offers[0].discount : '-'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">সর্বোচ্চ ছাড়</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Coupon Claims</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">0</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">কুপন রিডিম</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offer by title, business or promo code..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={() => setSearch('')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          title="Reset Search"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-3">Offer Title</th>
                <th className="pb-3 px-3">Discount</th>
                <th className="pb-3 px-3">Business</th>
                <th className="pb-3 px-3">Promo Code</th>
                <th className="pb-3 px-3">Expiry</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Percent className="w-8 h-8 text-slate-300 stroke-1" />
                      <p className="font-semibold text-slate-600 text-sm">কোনো অফার বা ডিসকাউন্ট নেই</p>
                      <p className="text-xs text-slate-400">নতুন অফার যোগ করতে উপরের "Add Offer" বাটনে ক্লিক করুন</p>
                      {onAddOffer && (
                        <button
                          onClick={onAddOffer}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নতুন অফার যোগ করুন</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{o.title}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        {o.discount}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{o.business_name}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {o.promo_code}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{o.expiry_date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteOffer(o.id)}
                        className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
