import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Star,
  Clock
} from 'lucide-react';
import type { Business } from '../../../types';
import { generateBrandBannerSvg } from '../../../lib/brandBannerUtils';

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
  onDeleteBusiness
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Sort by Newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [featuredMap, setFeaturedMap] = useState<Record<string, boolean>>({});

  const displayList = businesses.map((b, idx) => ({
    id: b.id,
    name: b.name_en || b.name,
    phone: b.phone || '',
    category: b.category_slug || 'General',
    categorySlug: b.category_slug || 'general',
    location: b.area || b.location || 'Mymensingh Sadar',
    ownerName: 'Mehedi Hasan',
    ownerPhone: '01712-345678',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    views: `${1200 - idx * 75}`,
    status: 'Active' as const,
    isFeatured: !!b.is_featured,
    joinedDate: '28 Sep 2026',
    joinedAgo: `${idx + 1} hours ago`,
    logo: b.image_url || generateBrandBannerSvg(b.name_bn || b.name, b.name, b.category, b.location, b.phone),
    original: b
  }));

  const toggleFeatured = (id: string) => {
    setFeaturedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === displayList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayList.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pharmacy':
        return 'bg-emerald-50 text-emerald-600';
      case 'perfume':
        return 'bg-rose-50 text-rose-600';
      case 'restaurant':
        return 'bg-amber-50 text-amber-700';
      case 'diagnostic':
        return 'bg-purple-50 text-purple-600';
      case 'tuition':
        return 'bg-blue-50 text-blue-600';
      case 'fitness':
        return 'bg-orange-50 text-orange-600';
      case 'beauty & salon':
      case 'beauty-salon':
        return 'bg-pink-50 text-pink-600';
      case 'electronics':
        return 'bg-teal-50 text-teal-600';
      case 'super shop':
      case 'super-shop':
        return 'bg-sky-50 text-sky-600';
      case 'car service':
      case 'car-service':
        return 'bg-indigo-50 text-indigo-600';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const filtered = displayList.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);

    const matchCategory =
      categoryFilter === 'All Categories' ||
      b.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchArea =
      areaFilter === 'All Areas' ||
      b.location.toLowerCase().includes(areaFilter.toLowerCase());

    const matchStatus =
      statusFilter === 'All Status' ||
      b.status === statusFilter;

    return matchSearch && matchCategory && matchArea && matchStatus;
  });

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
                Manage all businesses, approvals, categories and listings.
              </p>
            </div>
          </div>

          <button
            onClick={onAddBusiness}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Business</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching media_1790620107134.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Businesses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Active directory listings</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Views</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length > 0 ? businesses.length * 125 : 0}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Platform impressions</div>
          </div>
        </div>

        {/* Featured */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Top Picks
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Featured</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.filter(b => b.is_featured).length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Promoted outlets</div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Review
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Pending Approval</div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">All listings up-to-date</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching media_1790620107134.jpg */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business name..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Categories</option>
          <option>Pharmacy</option>
          <option>Restaurant</option>
          <option>Diagnostic</option>
          <option>Tuition</option>
          <option>Fitness</option>
          <option>Beauty & Salon</option>
          <option>Electronics</option>
          <option>Super Shop</option>
          <option>Car Service</option>
        </select>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Areas</option>
          <option>Mymensingh Sadar</option>
          <option>Muktagacha</option>
          <option>Trishal</option>
          <option>Fulbaria</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>Sort by Newest</option>
          <option>Sort by Views</option>
          <option>Sort by Name</option>
        </select>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearch('');
            setCategoryFilter('All Categories');
            setAreaFilter('All Areas');
            setStatusFilter('All Status');
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">All Businesses (328)</h3>

        <div className="overflow-x-auto">
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
                <th className="pb-3 px-3">Business</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Owner</th>
                <th className="pb-3 px-2">Views</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Featured</th>
                <th className="pb-3 px-3">Joined At</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <Store className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">কোনো ব্যবসা বা প্রতিষ্ঠান নেই</p>
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        নতুন কোনো ব্যবসা যুক্ত করতে বোতামে ক্লিক করুন।
                      </p>
                      <button
                        onClick={onAddBusiness}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Business</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((b, i) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(b.id)}
                      onChange={() => toggleSelectOne(b.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-400">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 bg-slate-900 p-0.5"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{b.name}</div>
                        <div className="text-[10px] text-slate-400">{b.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeClass(b.category)}`}>
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{b.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={b.ownerAvatar}
                        alt={b.ownerName}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="text-[11px]">
                        <div className="font-semibold text-slate-800">{b.ownerName}</div>
                        <div className="text-[9px] text-slate-400">{b.ownerPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-700">{b.views}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : b.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => toggleFeatured(b.id)}
                      className="cursor-pointer transition-transform active:scale-125"
                    >
                      {featuredMap[b.id] || b.isFeatured ? (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                    <div className="font-medium text-slate-800">{b.joinedDate}</div>
                    <div className="text-[10px] text-slate-400">{b.joinedAgo}</div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => b.original && onEditBusiness(b.original)}
                        className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteBusiness(b.id, b.name)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {filtered.length} businesses
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
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              33
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
