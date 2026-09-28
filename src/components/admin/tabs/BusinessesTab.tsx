import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import type { Business } from '../../../types';

interface BusinessesTabProps {
  businesses: Business[];
  onAddBusiness: () => void;
  onEditBusiness: (business: Business) => void;
  onDeleteBusiness: (id: string, name: string) => void;
  onViewPublicPage: () => void;
}

export const BusinessesTab: React.FC<BusinessesTabProps> = ({
  businesses,
  onAddBusiness,
  onEditBusiness,
  onDeleteBusiness,
  onViewPublicPage
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');

  const filtered = businesses.filter((b) => {
    const q = search.toLowerCase();
    const name = b.name || b.name_en || '';
    const nameBn = b.name_bn || '';
    const area = b.area || b.location || '';
    const matchSearch =
      name.toLowerCase().includes(q) ||
      nameBn.toLowerCase().includes(q) ||
      area.toLowerCase().includes(q);

    const matchCategory = categoryFilter === 'All' || b.category_slug === categoryFilter;
    const matchFeatured =
      featuredFilter === 'All' ||
      (featuredFilter === 'Featured' ? b.is_featured : !b.is_featured);

    return matchSearch && matchCategory && matchFeatured;
  });

  const categoriesList = Array.from(new Set(businesses.map((b) => b.category_slug))).filter(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Businesses</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Businesses Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage city landmarks, shops, restaurants and service providers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onViewPublicPage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View City Guide</span>
            </button>

            <button
              onClick={onAddBusiness}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Business</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 8% (+24 this month)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Featured Landmarks</div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {businesses.filter((b) => b.is_featured).length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Highlighted on homepage</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Active Categories</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{categoriesList.length}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Spans city sectors</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Average Rating</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">★ 4.7</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Based on visitor reviews</div>
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
              placeholder="Search business by name or area..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Featured">Featured Only</option>
            <option value="Standard">Standard Only</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setFeaturedFilter('All');
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-3">Business</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Area</th>
                <th className="pb-3 px-3">Rating</th>
                <th className="pb-3 px-3">Featured</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.image_url}
                        alt={b.name_en || b.name}
                        className="w-11 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {b.name_en || b.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{b.name_bn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {b.category_slug}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{b.area || b.location}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    ★ {b.rating} ({b.review_count})
                  </td>
                  <td className="py-3 px-3">
                    {b.is_featured ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditBusiness(b)}
                        className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteBusiness(b.id, b.name_en || b.name)}
                        className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
