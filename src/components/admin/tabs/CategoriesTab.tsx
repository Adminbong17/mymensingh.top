import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Edit2,
  Trash2,
  FolderOpen,
  Network,
  FileText,
  Eye,
  X,
  Check
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import type { Category } from '../../../types';
import { AVAILABLE_CATEGORY_ICONS, renderCategoryIcon } from '../../../lib/categoryIcons';

interface CategoriesTabProps {
  categories?: Category[];
  businessesCount?: number;
}

const COLOR_OPTIONS = [
  { name: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-700' },
  { name: 'blue', bg: 'bg-blue-500', text: 'text-blue-700' },
  { name: 'rose', bg: 'bg-rose-500', text: 'text-rose-700' },
  { name: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-700' },
  { name: 'red', bg: 'bg-red-500', text: 'text-red-700' },
  { name: 'amber', bg: 'bg-amber-500', text: 'text-amber-700' },
  { name: 'purple', bg: 'bg-purple-500', text: 'text-purple-700' },
  { name: 'sky', bg: 'bg-sky-500', text: 'text-sky-700' },
  { name: 'teal', bg: 'bg-teal-500', text: 'text-teal-700' },
  { name: 'orange', bg: 'bg-orange-500', text: 'text-orange-700' },
];

export const CategoriesTab: React.FC<CategoriesTabProps> = () => {
  const {
    categories,
    businesses,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  } = useData();

  // Search, filter and selection
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedTreeCategory, setSelectedTreeCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formNameBn, setFormNameBn] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState('Settings');
  const [formColor, setFormColor] = useState('emerald');
  const [iconSearch, setIconSearch] = useState('');

  const renderIconComponent = (iconName: string, className = "w-4 h-4") => {
    return renderCategoryIcon(iconName, className);
  };

  const filteredAvailableIcons = useMemo(() => {
    if (!iconSearch.trim()) return AVAILABLE_CATEGORY_ICONS;
    const q = iconSearch.toLowerCase().trim();
    return AVAILABLE_CATEGORY_ICONS.filter(
      ic =>
        ic.name.toLowerCase().includes(q) ||
        ic.labelBn.toLowerCase().includes(q) ||
        ic.labelEn.toLowerCase().includes(q) ||
        ic.group.toLowerCase().includes(q)
    );
  }, [iconSearch]);

  // Open modal for Create
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormNameBn('');
    setFormNameEn('');
    setFormSlug('');
    setFormIcon('Settings');
    setFormColor('emerald');
    setIconSearch('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormNameBn(cat.name_bn || '');
    setFormNameEn(cat.name_en || '');
    setFormSlug(cat.slug || '');
    setFormIcon(cat.icon || 'Settings');
    setFormColor(cat.color || 'emerald');
    setIconSearch('');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim() && !formNameBn.trim()) return;

    const slug = (formSlug.trim() || formNameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name_bn: formNameBn.trim(),
        name_en: formNameEn.trim(),
        slug,
        icon: formIcon,
        color: formColor,
      });
    } else {
      await addCategory({
        name_bn: formNameBn.trim() || formNameEn.trim(),
        name_en: formNameEn.trim() || formNameBn.trim(),
        slug,
        icon: formIcon,
        color: formColor,
        order_index: categories.length + 1,
        count: 0
      });
    }

    setIsModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = async (cat: Category) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name_bn || cat.name_en}"?`)) {
      await deleteCategory(cat.id);
      setSelectedIds(prev => prev.filter(id => id !== cat.id));
    }
  };

  // Move Order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await reorderCategories(updated);
  };

  // Filtered categories
  const filtered = useMemo(() => {
    return categories.filter(c => {
      if (selectedTreeCategory && c.slug !== selectedTreeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchBn = c.name_bn && c.name_bn.toLowerCase().includes(q);
        const matchEn = c.name_en && c.name_en.toLowerCase().includes(q);
        const matchSlug = c.slug.toLowerCase().includes(q);
        if (!matchBn && !matchEn && !matchSlug) return false;
      }
      return true;
    });
  }, [categories, selectedTreeCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

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

  // Businesses count per category
  const getBizCount = (catSlug: string) => {
    return businesses.filter(b => b.category_slug === catSlug).length;
  };

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
                Organize, add, edit and reorder all platform categories.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
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
            <div className="text-[11px] text-slate-400 font-medium mt-1">সক্রিয় ক্যাটাগরি</div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Taxonomy
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Main Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">প্রধান বিভাগসমূহ</div>
          </div>
        </div>

        {/* Sub Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Sub
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Sub Categories</div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">উপ-বিভাগ</div>
          </div>
        </div>

        {/* Used in Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Listings
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Used in Businesses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">তালিকাভুক্ত প্রতিষ্ঠান</div>
          </div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Category Tree (30%) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>Category Tree</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">{categories.length} items</span>
          </div>

          <div className="pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full text-xs px-2.5 py-2 pl-8 rounded-lg bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Tree Structure */}
          <div className="space-y-1 text-xs text-slate-700 py-2 overflow-y-auto max-h-[500px]">
            {/* Root: All Categories */}
            <button
              onClick={() => { setSelectedTreeCategory(''); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                !selectedTreeCategory
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50/60 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>All Categories</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                !selectedTreeCategory ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {categories.length}
              </span>
            </button>

            {/* Dynamic Branches */}
            <div className="pl-2 space-y-1 pt-1">
              {categories
                .filter(cat => {
                  const q = treeSearch.toLowerCase();
                  return (
                    !treeSearch ||
                    (cat.name_en && cat.name_en.toLowerCase().includes(q)) ||
                    (cat.name_bn && cat.name_bn.toLowerCase().includes(q)) ||
                    cat.slug.toLowerCase().includes(q)
                  );
                })
                .map(cat => {
                  const isSelected = selectedTreeCategory === cat.slug;
                  const bCount = getBizCount(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedTreeCategory(cat.slug); setCurrentPage(1); }}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-emerald-600 shrink-0">{renderIconComponent(cat.icon, "w-3.5 h-3.5")}</span>
                        <span className="truncate">{cat.name_bn || cat.name_en}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">
                        {bCount}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Table Section (70%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedTreeCategory ? `Filtered: ${selectedTreeCategory}` : 'All Categories'}
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {filtered.length}টি পাওয়া গেছে
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search table..."
                    className="text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <button
                  onClick={() => {
                    setSelectedTreeCategory('');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
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
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </th>
                    <th className="pb-3 px-2">#</th>
                    <th className="pb-3 px-2">Icon</th>
                    <th className="pb-3 px-3">Category Name</th>
                    <th className="pb-3 px-2">Slug</th>
                    <th className="pb-3 px-2">Businesses</th>
                    <th className="pb-3 px-2">Order</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Layers className="w-8 h-8 text-slate-300 stroke-1" />
                          <p className="font-semibold text-slate-600 text-sm">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((cat, idx) => {
                      const absoluteIndex = (currentPage - 1) * itemsPerPage + idx;
                      const bCount = getBizCount(cat.slug);
                      return (
                        <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(cat.id)}
                              onChange={() => toggleSelectOne(cat.id)}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-400">{absoluteIndex + 1}</td>
                          <td className="py-3 px-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                              {renderIconComponent(cat.icon, "w-4 h-4")}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{cat.name_bn || cat.name_en}</div>
                            <div className="text-[10px] text-slate-400">{cat.name_en}</div>
                          </td>
                          <td className="py-3 px-2">
                            <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {cat.slug}
                            </code>
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-700">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black text-[11px]">
                              {bCount}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveOrder(absoluteIndex, 'up')}
                                disabled={absoluteIndex === 0}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveOrder(absoluteIndex, 'down')}
                                disabled={absoluteIndex === categories.length - 1}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditModal(cat)}
                                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {paginatedCategories.length} of {filtered.length} categories (Page {currentPage} of {totalPages})
            </span>
            <div className="flex items-center gap-1 font-semibold">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-emerald-700 text-white'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ADD / EDIT CATEGORY MODAL */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingCategory ? 'Update category information' : 'Create a new business category'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bangla Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNameBn}
                    onChange={(e) => setFormNameBn(e.target.value)}
                    placeholder="যেমন: রেস্টুরেন্ট"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => {
                      setFormNameEn(e.target.value);
                      if (!editingCategory && !formSlug) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="e.g. Restaurants"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug (Unique ID)
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. restaurants"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Icon Selector with Search & Lucide Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Icon ({filteredAvailableIcons.length} found)
                  </label>
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                    title="Open Lucide Icons Directory in new tab"
                  >
                    <span>1,500+ Lucide Icons ↗</span>
                  </a>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="আইকন সার্চ করুন (যেমন: car, doctor, salon, food, bike)..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50">
                  {filteredAvailableIcons.map((ic) => {
                    const isSelected = formIcon.toLowerCase() === ic.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={ic.name}
                        onClick={() => setFormIcon(ic.name)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <div className={isSelected ? 'text-white' : ''}>
                          {renderCategoryIcon(ic.name, "w-4 h-4", !isSelected)}
                        </div>
                        <span className="text-[10px] font-bold truncate w-full">{ic.name}</span>
                        <span className={`text-[8px] truncate w-full ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {ic.labelBn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">কাস্টম আইকন নাম:</span>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="e.g. Flame, Shield, Heart"
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 font-mono flex-1"
                  />
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {renderCategoryIcon(formIcon, "w-4 h-4")}
                  </div>
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      type="button"
                      key={col.name}
                      onClick={() => setFormColor(col.name)}
                      className={`w-7 h-7 rounded-full ${col.bg} flex items-center justify-center transition-transform cursor-pointer ${
                        formColor === col.name ? 'ring-2 ring-offset-2 ring-emerald-600 scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {formColor === col.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
