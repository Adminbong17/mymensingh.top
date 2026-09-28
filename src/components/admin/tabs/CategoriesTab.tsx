import React, { useState } from 'react';
import {
  Layers,
  Search,
  ChevronRight
} from 'lucide-react';
import type { Category } from '../../../types';

interface CategoriesTabProps {
  categories: Category[];
  businessesCount: number;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  businessesCount
}) => {
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name_en.toLowerCase().includes(q) ||
      c.name_bn.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Categories</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Categories Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Organize city spots, services and commercial sectors into clear categories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Categories</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Configured for navigation</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Categorized Places</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{businessesCount}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Indexed across categories</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Color Themed</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{categories.length}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Custom distinct badges</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Display Order</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Optimized</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Indexed by order_index</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category by name or slug..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-3">Order</th>
                <th className="pb-3 px-3">Category Name</th>
                <th className="pb-3 px-3">Bengali Name</th>
                <th className="pb-3 px-3">Slug</th>
                <th className="pb-3 px-3">Theme Color</th>
                <th className="pb-3 px-3">Places Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">{cat.order_index ?? i + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{cat.name_en}</td>
                  <td className="py-3 px-3 font-semibold text-slate-600">{cat.name_bn}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{cat.slug}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-200"
                        style={{ backgroundColor: cat.color || '#10b981' }}
                      />
                      <span className="font-mono text-[10px] text-slate-600">{cat.color || '#10b981'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{cat.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
