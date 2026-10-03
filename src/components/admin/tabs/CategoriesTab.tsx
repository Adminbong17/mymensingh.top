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
  Eye,
  X,
  CornerDownRight,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import type { Category } from '../../../types';
import { renderCategoryIcon } from '../../../lib/categoryIcons';
import { IconPicker } from '../../common/IconPicker';

interface CategoriesTabProps {
  categories?: Category[];
  businessesCount?: number;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = () => {
  const {
    categories,
    mainCategories,
    subcategories,
    getSubcategories,
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
  const [typeFilter, setTypeFilter] = useState<'all' | 'main' | 'sub'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [formParentId, setFormParentId] = useState('');
  const [formNameBn, setFormNameBn] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState('Settings');
  const [formColor, setFormColor] = useState('emerald');

  const renderIconComponent = (iconName: string, className = "w-4 h-4") => {
    return renderCategoryIcon(iconName, className);
  };

  // Helper to get parent category
  const getParentCategory = (parentId?: string | null) => {
    if (!parentId) return null;
    return categories.find(c => c.id === parentId || c.slug === parentId);
  };

  // Helper to count businesses
  const getBizCount = (catSlug: string) => {
    return businesses.filter(b => b.category_slug === catSlug || b.subcategory_slug === catSlug).length;
  };

  // Helper to count subcategories for a main category
  const getSubCount = (parent: Category) => {
    return subcategories.filter(s => s.parent_id === parent.id || s.parent_id === parent.slug).length;
  };

  // Open modal for Create Main Category
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsSubcategory(false);
    setFormParentId(mainCategories[0]?.id || mainCategories[0]?.slug || '');
    setFormNameBn('');
    setFormNameEn('');
    setFormSlug('');
    setFormIcon('Store');
    setFormColor('emerald');
    setIsModalOpen(true);
  };

  // Open modal for Quick Create Subcategory under a specific parent
  const handleOpenAddSubModal = (parentCat?: Category) => {
    setEditingCategory(null);
    setIsSubcategory(true);
    const chosenParent = parentCat || mainCategories[0];
    setFormParentId(chosenParent?.id || chosenParent?.slug || '');
    setFormNameBn('');
    setFormNameEn('');
    setFormSlug('');
    setFormIcon(chosenParent?.icon || 'Tag');
    setFormColor(chosenParent?.color || 'blue');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    const hasParent = Boolean(cat.parent_id);
    setIsSubcategory(hasParent);
    setFormParentId(cat.parent_id || mainCategories[0]?.id || mainCategories[0]?.slug || '');
    setFormNameBn(cat.name_bn || '');
    setFormNameEn(cat.name_en || '');
    setFormSlug(cat.slug || '');
    setFormIcon(cat.icon || 'Settings');
    setFormColor(cat.color || 'emerald');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim() && !formNameBn.trim()) return;

    const slug = (formSlug.trim() || formNameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;
    const parent_id = isSubcategory ? formParentId : null;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name_bn: formNameBn.trim(),
        name_en: formNameEn.trim(),
        slug,
        icon: formIcon,
        color: formColor,
        parent_id,
      });
    } else {
      await addCategory({
        name_bn: formNameBn.trim() || formNameEn.trim(),
        name_en: formNameEn.trim() || formNameBn.trim(),
        slug,
        icon: formIcon,
        color: formColor,
        order_index: categories.length + 1,
        count: 0,
        parent_id,
      });
    }

    setIsModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = async (cat: Category) => {
    const isMain = !cat.parent_id;
    const childSubs = isMain ? subcategories.filter(s => s.parent_id === cat.id || s.parent_id === cat.slug) : [];
    
    let confirmMsg = `আপনি কি "${cat.name_bn || cat.name_en}" ক্যাটাগরি ডিলিট করতে চান?`;
    if (childSubs.length > 0) {
      confirmMsg += `\nসতর্কতা: এই ক্যাটাগরির অধীনে ${childSubs.length}টি সাব-ক্যাটাগরি রয়েছে!`;
    }

    if (window.confirm(confirmMsg)) {
      await deleteCategory(cat.id);
      setSelectedIds(prev => prev.filter(id => id !== cat.id));
    }
  };

  // Move Order
  const handleMoveOrder = async (cat: Category, direction: 'up' | 'down') => {
    const isMain = !cat.parent_id;
    // Sibling categories in current sorted order
    const siblings = categories
      .filter(c => isMain ? !c.parent_id : (c.parent_id === cat.parent_id))
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));

    const currentIndex = siblings.findIndex(c => c.id === cat.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    // Swap positions in siblings list
    const updatedSiblings = [...siblings];
    const temp = updatedSiblings[currentIndex];
    updatedSiblings[currentIndex] = updatedSiblings[targetIndex];
    updatedSiblings[targetIndex] = temp;

    // Assign new sequential order_index to siblings
    const reorderedList = updatedSiblings.map((item, idx) => ({
      ...item,
      order_index: idx + 1
    }));

    await reorderCategories(reorderedList);
  };

  // Filtered categories
  const filtered = useMemo(() => {
    return categories.filter(c => {
      // Type filter (All, Main, Sub)
      if (typeFilter === 'main' && c.parent_id) return false;
      if (typeFilter === 'sub' && !c.parent_id) return false;

      // Tree Category Selection
      if (selectedTreeCategory) {
        const isParentSelected = c.slug === selectedTreeCategory || c.id === selectedTreeCategory;
        const isChildOfSelected = c.parent_id === selectedTreeCategory || 
          categories.some(parent => (parent.slug === selectedTreeCategory || parent.id === selectedTreeCategory) && (c.parent_id === parent.id || c.parent_id === parent.slug));
        if (!isParentSelected && !isChildOfSelected) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchBn = c.name_bn && c.name_bn.toLowerCase().includes(q);
        const matchEn = c.name_en && c.name_en.toLowerCase().includes(q);
        const matchSlug = c.slug.toLowerCase().includes(q);
        const parent = getParentCategory(c.parent_id);
        const matchParent = parent && ((parent.name_bn && parent.name_bn.toLowerCase().includes(q)) || (parent.name_en && parent.name_en.toLowerCase().includes(q)));
        if (!matchBn && !matchEn && !matchSlug && !matchParent) return false;
      }

      return true;
    });
  }, [categories, typeFilter, selectedTreeCategory, searchQuery]);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">ক্যাটাগরি ও সাব-ক্যাটাগরি ব্যবস্থাপনা</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Categories & Subcategories
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                মূল বিভাগ, উপ-বিভাগ এবং আইকন লাইব্রেরি থেকে সুন্দর আইকন নির্বাচন ও পরিচালনা করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAddSubModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-purple-600" />
              <span>+ সাব-ক্যাটাগরি</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ মূল ক্যাটাগরি</span>
            </button>
          </div>
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
            <div className="text-xs font-semibold text-slate-500">মোট ক্যাটাগরি (Total)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সর্বমোট নিবন্ধিত বিভাগ</div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Main
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">মূল ক্যাটাগরি (Main)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{mainCategories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">হোম ও নেভিগেশন বিভাগ</div>
          </div>
        </div>

        {/* Sub Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GitBranch className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Sub
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">সাব-ক্যাটাগরি (Subcategories)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{subcategories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">আওতাধীন উপ-বিভাগসমূহ</div>
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
            <div className="text-xs font-semibold text-slate-500">তালিকাভুক্ত প্রতিষ্ঠান</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">যুক্ত ব্যবসায়িক লিস্টিং</div>
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
              <span>ক্যাটাগরি ট্রি (Hierarchy)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">{categories.length} items</span>
          </div>

          <div className="pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="বিভাগ খুঁজুন..."
                className="w-full text-xs px-2.5 py-2 pl-8 rounded-lg bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Tree Structure */}
          <div className="space-y-1 text-xs text-slate-700 py-2 overflow-y-auto max-h-[540px] pr-1">
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
                <span>সকল ক্যাটাগরি ও সাব-ক্যাটাগরি</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                !selectedTreeCategory ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {categories.length}
              </span>
            </button>

            {/* Main Categories with nested Subcategories */}
            <div className="space-y-1 pt-1.5">
              {mainCategories
                .filter(mainCat => {
                  const q = treeSearch.toLowerCase();
                  if (!treeSearch) return true;
                  const matchMain = (mainCat.name_en && mainCat.name_en.toLowerCase().includes(q)) ||
                                    (mainCat.name_bn && mainCat.name_bn.toLowerCase().includes(q)) ||
                                    mainCat.slug.toLowerCase().includes(q);
                  const childSubs = getSubcategories(mainCat.slug);
                  const matchSubs = childSubs.some(s => (s.name_en && s.name_en.toLowerCase().includes(q)) || (s.name_bn && s.name_bn.toLowerCase().includes(q)));
                  return matchMain || matchSubs;
                })
                .map(mainCat => {
                  const isMainSelected = selectedTreeCategory === mainCat.slug;
                  const childSubs = getSubcategories(mainCat.slug);
                  const bCount = getBizCount(mainCat.slug);

                  return (
                    <div key={mainCat.id} className="space-y-0.5">
                      {/* Main Category Row */}
                      <div className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors group ${
                        isMainSelected
                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                          : 'hover:bg-slate-50 text-slate-800 font-semibold'
                      }`}>
                        <button
                          onClick={() => { setSelectedTreeCategory(mainCat.slug); setCurrentPage(1); }}
                          className="flex items-center gap-2 truncate flex-1 text-left cursor-pointer"
                        >
                          <span className="text-emerald-600 shrink-0">{renderIconComponent(mainCat.icon, "w-4 h-4")}</span>
                          <span className="truncate">{mainCat.name_bn || mainCat.name_en}</span>
                          {childSubs.length > 0 && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">
                              {childSubs.length} সাব
                            </span>
                          )}
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenAddSubModal(mainCat)}
                            title="এই ক্যাটাগরিতে সাব-ক্যাটাগরি যোগ করুন"
                            className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-1.5 py-0.5 rounded transition-all cursor-pointer"
                          >
                            + সাব
                          </button>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                            {bCount}
                          </span>
                        </div>
                      </div>

                      {/* Nested Subcategories */}
                      {childSubs.length > 0 && (
                        <div className="pl-4 border-l-2 border-slate-100 ml-3.5 space-y-0.5">
                          {childSubs.map(subCat => {
                            const isSubSelected = selectedTreeCategory === subCat.slug;
                            const subBizCount = getBizCount(subCat.slug);
                            return (
                              <button
                                key={subCat.id}
                                onClick={() => { setSelectedTreeCategory(subCat.slug); setCurrentPage(1); }}
                                className={`w-full flex items-center justify-between py-1 px-2 rounded-md text-left transition-colors cursor-pointer text-[11px] ${
                                  isSubSelected
                                    ? 'bg-purple-100 text-purple-900 font-bold border border-purple-200'
                                    : 'hover:bg-slate-50 text-slate-600 font-medium'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <CornerDownRight className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="text-purple-600 shrink-0">{renderIconComponent(subCat.icon, "w-3 h-3")}</span>
                                  <span className="truncate">{subCat.name_bn || subCat.name_en}</span>
                                </div>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded-full shrink-0">
                                  {subBizCount}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Table Section (70%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedTreeCategory ? `ফিল্টারকৃত: ${selectedTreeCategory}` : 'সকল ক্যাটাগরি তালিকা'}
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {filtered.length}টি পাওয়া গেছে
                </span>

                {/* Type Filter Pills */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl ml-2">
                  <button
                    onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    সব ({categories.length})
                  </button>
                  <button
                    onClick={() => { setTypeFilter('main'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'main'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    মূল ({mainCategories.length})
                  </button>
                  <button
                    onClick={() => { setTypeFilter('sub'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'sub'
                        ? 'bg-white text-purple-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    সাব ({subcategories.length})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="টেবিলে খুঁজুন..."
                    className="text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <button
                  onClick={() => {
                    setSelectedTreeCategory('');
                    setSearchQuery('');
                    setTypeFilter('all');
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
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
                    <th className="pb-3 px-3">নাম (Name)</th>
                    <th className="pb-3 px-2">ধরণ ও অভিভাবক</th>
                    <th className="pb-3 px-2">Slug</th>
                    <th className="pb-3 px-2">প্রতিষ্ঠান</th>
                    <th className="pb-3 px-2">অর্ডার</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
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
                      const isSub = Boolean(cat.parent_id);
                      const parent = getParentCategory(cat.parent_id);
                      const childCount = isSub ? 0 : getSubCount(cat);

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
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                              isSub 
                                ? 'bg-purple-50 text-purple-600 border-purple-100' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {renderIconComponent(cat.icon, "w-4 h-4")}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{cat.name_bn || cat.name_en}</div>
                            <div className="text-[10px] text-slate-400">{cat.name_en}</div>
                          </td>
                          <td className="py-3 px-2">
                            {isSub ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
                                  <GitBranch className="w-2.5 h-2.5" /> সাব-ক্যাটাগরি
                                </span>
                                {parent && (
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    প্যারেন্ট: <strong className="text-slate-700">{parent.name_bn || parent.name_en}</strong>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  মূল ক্যাটাগরি
                                </span>
                                {childCount > 0 && (
                                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                                    {childCount}টি সাব
                                  </span>
                                )}
                                <button
                                  onClick={() => handleOpenAddSubModal(cat)}
                                  title="এই মূল ক্যাটাগরিতে সাব-ক্যাটাগরি যোগ করুন"
                                  className="text-[9px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  + সাব
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                              {cat.slug}
                            </code>
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-700">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black text-[11px]">
                              {bCount}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {(() => {
                              const isMain = !cat.parent_id;
                              const siblings = categories
                                .filter(c => isMain ? !c.parent_id : (c.parent_id === cat.parent_id))
                                .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
                              const siblingIndex = siblings.findIndex(c => c.id === cat.id);
                              const canMoveUp = siblingIndex > 0;
                              const canMoveDown = siblingIndex !== -1 && siblingIndex < siblings.length - 1;

                              return (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleMoveOrder(cat, 'up')}
                                    disabled={!canMoveUp}
                                    className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveOrder(cat, 'down')}
                                    disabled={!canMoveDown}
                                    className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })()}
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
      {/* ADD / EDIT CATEGORY & SUBCATEGORY MODAL */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSubcategory ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {isSubcategory ? <GitBranch className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingCategory
                      ? (isSubcategory ? 'সাব-ক্যাটাগরি সম্পাদনা করুন' : 'মূল ক্যাটাগরি সম্পাদনা করুন')
                      : (isSubcategory ? 'নতুন সাব-ক্যাটাগরি তৈরি করুন' : 'নতুন মূল ক্যাটাগরি তৈরি করুন')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    আইকন লাইব্রেরি থেকে সুন্দর আইকন এবং রঙ পছন্দ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Category Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ক্যাটাগরির ধরণ (Category Type)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubcategory(false)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      !isSubcategory
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs mb-0.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>মূল ক্যাটাগরি (Main)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      হোম পেজ ও মূল গ্রিডে দেখা যাবে (যেমন: রেস্তোরাঁ, হাসপাতাল)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubcategory(true)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSubcategory
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs mb-0.5">
                      <GitBranch className="w-4 h-4 text-purple-600" />
                      <span>সাব-ক্যাটাগরি (Sub)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      একটি মূল ক্যাটাগরির আওতায় থাকবে (যেমন: ফাস্টফুড, ডেন্টাল ক্লিনিক)
                    </p>
                  </button>
                </div>
              </div>

              {/* If Subcategory: Select Parent Category */}
              {isSubcategory && (
                <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-1.5">
                  <label className="block text-xs font-bold text-purple-950">
                    অভিভাবক ক্যাটাগরি নির্বাচন করুন (Parent Category) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formParentId}
                    onChange={(e) => setFormParentId(e.target.value)}
                    required
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-purple-200 outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="" disabled>-- মূল ক্যাটাগরি নির্বাচন করুন --</option>
                    {mainCategories.map((mCat) => (
                      <option key={mCat.id} value={mCat.id}>
                        {mCat.name_bn || mCat.name_en} ({mCat.name_en})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাংলা নাম (Bangla Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNameBn}
                    onChange={(e) => setFormNameBn(e.target.value)}
                    placeholder="যেমন: ফাস্ট ফুড & ক্যাফে"
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইংরেজি নাম (English Name) <span className="text-rose-500">*</span>
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
                    placeholder="e.g. Fast Food & Cafe"
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
                  placeholder="e.g. fast-food-cafe"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Reusable Icon Library Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>আইকন লাইব্রেরি ও কালার পিকার (Icon Library & Theme)</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    ১৫০০+ আইকন সাপোর্ট
                  </span>
                </label>
                <IconPicker
                  selectedIcon={formIcon}
                  onSelectIcon={setFormIcon}
                  selectedColor={formColor}
                  onSelectColor={setFormColor}
                  showColorPicker={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-black transition-all shadow-sm cursor-pointer ${
                    isSubcategory
                      ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-700/20'
                      : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                  }`}
                >
                  {editingCategory
                    ? (isSubcategory ? 'সাব-ক্যাটাগরি আপডেট করুন' : 'মূল ক্যাটাগরি আপডেট করুন')
                    : (isSubcategory ? 'সাব-ক্যাটাগরি সংরক্ষণ করুন' : 'মূল ক্যাটাগরি তৈরি করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
