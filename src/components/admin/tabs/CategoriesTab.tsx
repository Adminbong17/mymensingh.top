import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
  Folder,
  FolderOpen,
  Network,
  FileText,
  Eye
} from 'lucide-react';
import type { Category } from '../../../types';

interface CategoriesTabProps {
  categories: Category[];
  businessesCount: number;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  type: 'Main' | 'Sub';
  businesses: number;
  status: boolean;
  order: number;
  image: string;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  businessesCount
}) => {
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() =>
    categories.map((cat, idx) => ({
      id: cat.id,
      name: cat.name_bn ? `${cat.name_bn} (${cat.name_en})` : cat.name_en,
      slug: cat.slug,
      type: 'Main' as const,
      businesses: cat.count || 0,
      status: true,
      order: cat.order_index || idx + 1,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=80&q=80'
    }))
  );
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleStatus = (id: string) => {
    setCategoriesList(prev =>
      prev.map(c => (c.id === id ? { ...c, status: !c.status } : c))
    );
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;
    const updated = [...categoriesList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCategoriesList(updated);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filtered = categoriesList.filter(c => {
    if (typeFilter === 'Main') return c.type === 'Main';
    if (typeFilter === 'Sub') return c.type === 'Sub';
    return true;
  });

  const subCategoriesCount = 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
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
                Organize all business categories and subcategories.
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">ক্যাটাগরি তালিকা</div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Main Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">প্রধান বিভাগ</div>
          </div>
        </div>

        {/* Sub Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Sub
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Sub Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{subCategoriesCount}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">উপ-বিভাগ</div>
          </div>
        </div>

        {/* Used in Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Used in Businesses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businessesCount}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">ব্যবসা প্রতিষ্ঠান</div>
          </div>
        </div>
      </div>

      {/* 2-Column Section matching media_1790620107253.jpg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Category Tree (30%) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Category Tree</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 outline-hidden"
              />
            </div>
          </div>

          {/* Tree Structure */}
          <div className="space-y-1.5 text-xs text-slate-700 py-2 overflow-y-auto max-h-[520px]">
            {/* Root: All Categories */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 font-bold text-emerald-950">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-600" />
                <span>All Categories</span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {categories.length}
              </span>
            </div>

            {/* Dynamic Branches */}
            <div className="pl-3 space-y-1">
              {categories
                .filter(cat => {
                  const q = treeSearch.toLowerCase();
                  return (
                    !treeSearch ||
                    (cat.name_en && cat.name_en.toLowerCase().includes(q)) ||
                    (cat.name_bn && cat.name_bn.toLowerCase().includes(q))
                  );
                })
                .map(cat => (
                  <div key={cat.id}>
                    <div className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left">
                      <div className="flex items-center gap-2 font-semibold">
                        <Folder className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{cat.name_bn || cat.name_en}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {cat.count || 0}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Table Section (70%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">All Categories ({filtered.length})</h3>

              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-hidden cursor-pointer"
                >
                  <option>All Types</option>
                  <option>Main</option>
                  <option>Sub</option>
                </select>

                <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>

                <button
                  onClick={() => setTypeFilter('All Types')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                    <th className="pb-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="pb-3 px-2">#</th>
                    <th className="pb-3 px-2">Image</th>
                    <th className="pb-3 px-3">Category Name</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Businesses</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Order</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Layers className="w-8 h-8 text-slate-300 stroke-1" />
                          <p className="font-semibold text-slate-600 text-sm">কোনো ক্যাটাগরি নেই</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cat, idx) => (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(cat.id)}
                            onChange={() => toggleSelectOne(cat.id)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-3 px-2 font-medium text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-2">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{cat.name}</div>
                          <div className="text-[10px] text-slate-400">{cat.slug}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cat.type === 'Main'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {cat.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-700">{cat.businesses}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => toggleStatus(cat.id)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                              cat.status ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                cat.status ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveOrder(idx, 'up')}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveOrder(idx, 'down')}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {filtered.length} of {categories.length} categories
            </span>
            <div className="flex items-center gap-1 font-semibold">
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold">
                1
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
