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

const INITIAL_CATEGORIES_LIST: CategoryItem[] = [
  {
    id: 'c1',
    name: 'Pharmacy',
    slug: 'pharmacy',
    type: 'Main',
    businesses: 38,
    status: true,
    order: 1,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c2',
    name: 'Restaurant',
    slug: 'restaurant',
    type: 'Main',
    businesses: 52,
    status: true,
    order: 2,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c3',
    name: 'Beauty & Salon',
    slug: 'beauty-salon',
    type: 'Main',
    businesses: 28,
    status: true,
    order: 3,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c4',
    name: 'Education',
    slug: 'education',
    type: 'Main',
    businesses: 34,
    status: true,
    order: 4,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c5',
    name: 'Electronics',
    slug: 'electronics',
    type: 'Main',
    businesses: 26,
    status: true,
    order: 5,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c6',
    name: 'Car Service',
    slug: 'car-service',
    type: 'Sub',
    businesses: 12,
    status: true,
    order: 6,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c7',
    name: 'Gym & Fitness',
    slug: 'gym-fitness',
    type: 'Sub',
    businesses: 10,
    status: true,
    order: 7,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c8',
    name: 'Travel & Tourism',
    slug: 'travel-tourism',
    type: 'Sub',
    businesses: 14,
    status: true,
    order: 8,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c9',
    name: 'To-Let',
    slug: 'to-let',
    type: 'Main',
    businesses: 18,
    status: true,
    order: 9,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'c10',
    name: 'Super Shop',
    slug: 'super-shop',
    type: 'Sub',
    businesses: 8,
    status: false,
    order: 10,
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=80&q=80'
  }
];

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories: _categories,
  businessesCount: _businessesCount
}) => {
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(INITIAL_CATEGORIES_LIST);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    pharmacy: true,
    restaurant: true,
    beauty: true,
    education: true,
    electronics: true,
    others: true
  });

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

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
    if (selectedIds.length === filtered.length) {
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

      {/* 4 Metric KPI Cards matching media_1790620107253.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">42</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+4 this month</div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              ↑ 0%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Main Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">12</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">unchanged</div>
          </div>
        </div>

        {/* Sub Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 20%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Sub Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">30</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+5 this month</div>
          </div>
        </div>

        {/* Used in Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Used in Businesses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">286</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+43 this month</div>
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
                42
              </span>
            </div>

            {/* Branch: Pharmacy */}
            <div className="pl-3 space-y-1">
              <button
                onClick={() => toggleNode('pharmacy')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pharmacy</span>
                </div>
                <span className="text-[10px] text-slate-400">5</span>
              </button>
              {expandedNodes.pharmacy && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>Allopathic Medicine</span>
                    <span className="text-slate-400">3</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Herbal Medicine</span>
                    <span className="text-slate-400">1</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Health Care</span>
                    <span className="text-slate-400">1</span>
                  </div>
                </div>
              )}

              {/* Branch: Restaurant */}
              <button
                onClick={() => toggleNode('restaurant')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-rose-500" />
                  <span>Restaurant</span>
                </div>
                <span className="text-[10px] text-slate-400">6</span>
              </button>
              {expandedNodes.restaurant && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>Fast Food</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Traditional Food</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Café & Bakery</span>
                    <span className="text-slate-400">2</span>
                  </div>
                </div>
              )}

              {/* Branch: Beauty & Salon */}
              <button
                onClick={() => toggleNode('beauty')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-pink-500" />
                  <span>Beauty & Salon</span>
                </div>
                <span className="text-[10px] text-slate-400">4</span>
              </button>
              {expandedNodes.beauty && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>Salon</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Beauty Products</span>
                    <span className="text-slate-400">1</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Parlour</span>
                    <span className="text-slate-400">1</span>
                  </div>
                </div>
              )}

              {/* Branch: Education */}
              <button
                onClick={() => toggleNode('education')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-blue-500" />
                  <span>Education</span>
                </div>
                <span className="text-[10px] text-slate-400">5</span>
              </button>
              {expandedNodes.education && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>School</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Coaching</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Skills Development</span>
                    <span className="text-slate-400">1</span>
                  </div>
                </div>
              )}

              {/* Branch: Electronics */}
              <button
                onClick={() => toggleNode('electronics')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-teal-500" />
                  <span>Electronics</span>
                </div>
                <span className="text-[10px] text-slate-400">4</span>
              </button>
              {expandedNodes.electronics && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>Mobile & Accessories</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Computer & IT</span>
                    <span className="text-slate-400">2</span>
                  </div>
                </div>
              )}

              {/* Branch: Others */}
              <button
                onClick={() => toggleNode('others')}
                className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-orange-500" />
                  <span>Others</span>
                </div>
                <span className="text-[10px] text-slate-400">18</span>
              </button>
              {expandedNodes.others && (
                <div className="pl-6 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-0.5">
                    <span>Car Service</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Gym & Fitness</span>
                    <span className="text-slate-400">2</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span>Travel & Tourism</span>
                    <span className="text-slate-400">2</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Table Section (70%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">All Categories (42)</h3>

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
                  {filtered.map((cat, idx) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
            <span className="text-slate-500 font-medium">
              Showing 1 to 10 of 42 categories
            </span>
            <div className="flex items-center gap-1 font-semibold">
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold">
                1
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
                2
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
                3
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
                4
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
                5
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
