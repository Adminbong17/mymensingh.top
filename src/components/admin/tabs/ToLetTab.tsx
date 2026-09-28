import React, { useState } from 'react';
import {
  Home,
  Plus,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  Filter,
  RotateCcw,
  Download,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize
} from 'lucide-react';
import type { ToLetListing } from '../../../types';

interface ToLetTabProps {
  toLets: ToLetListing[];
  onAddToLet: () => void;
  onDeleteToLet: (id: string) => void;
  onViewPublicPage: () => void;
}

export const ToLetTab: React.FC<ToLetTabProps> = ({
  toLets,
  onAddToLet,
  onDeleteToLet,
  onViewPublicPage
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'sale' | 'pending' | 'reported'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Sort by Newest');
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);

  const displayListings = toLets.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.area,
    type: item.type || 'Flat',
    beds: item.bedrooms,
    baths: item.bathrooms,
    sqft: '1,100 sqft',
    price: item.rent,
    status: 'Active',
    postedAt: item.available_from || 'আজ',
    timeAgo: 'নতুন',
    image: item.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80'
  }));

  const filteredListings = displayListings.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    const matchType = selectedType === 'All Types' || item.type.toLowerCase() === selectedType.toLowerCase();
    const matchArea = selectedArea === 'All Areas' || item.location.toLowerCase().includes(selectedArea.toLowerCase());
    const matchStatus = selectedStatus === 'All Status' || item.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchTab = activeTab === 'all' || 
      (activeTab === 'rent' ? true : activeTab === 'sale' ? false : item.status.toLowerCase() === activeTab.toLowerCase());
    return matchSearch && matchType && matchArea && matchStatus && matchTab;
  });

  const toggleSelectAll = () => {
    if (selectedListingIds.length === filteredListings.length && filteredListings.length > 0) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(filteredListings.map(l => l.id));
    }
  };

  const toggleSelectListing = (id: string) => {
    if (selectedListingIds.includes(id)) {
      setSelectedListingIds(selectedListingIds.filter(i => i !== id));
    } else {
      setSelectedListingIds([...selectedListingIds, id]);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Flat':
        return 'bg-blue-50 text-blue-600';
      case 'House':
        return 'bg-purple-50 text-purple-600';
      case 'Office':
        return 'bg-amber-50 text-amber-600';
      case 'Shop':
        return 'bg-rose-50 text-rose-600';
      case 'Room':
        return 'bg-emerald-50 text-emerald-600';
      case 'Land':
        return 'bg-indigo-50 text-indigo-600';
      case 'Commercial':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const typesList = ['Flat', 'House', 'Room', 'Shop', 'Office', 'Land', 'Commercial'];
  const colorsList = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-400', 'bg-amber-400', 'bg-indigo-500', 'bg-orange-500'];
  const propertyStats = typesList.map((type, i) => {
    const count = toLets.filter(t => t.type?.toLowerCase().includes(type.toLowerCase())).length;
    return {
      name: type,
      count,
      color: colorsList[i % colorsList.length],
      width: count > 0 ? `${Math.min(100, Math.round((count / (toLets.length || 1)) * 100))}%` : '0%'
    };
  });

  const areasList = ['Sadar', 'Muktagacha', 'Trishal', 'Fulbaria', 'Charpara'];
  const topLocations = areasList.map((area) => {
    const count = toLets.filter(t => t.area?.toLowerCase().includes(area.toLowerCase())).length;
    return {
      name: area,
      count,
      width: count > 0 ? `${Math.min(100, Math.round((count / (toLets.length || 1)) * 100))}%` : '0%'
    };
  });

  const recentEnquiries: {
    name: string;
    avatar: string;
    property: string;
    location: string;
    status: string;
    time: string;
  }[] = [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">To-Let</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                To-Let Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage rental properties, approvals and enquiries.
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
              onClick={onAddToLet}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add To-Let Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Listings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Listings</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{toLets.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সব টু-লেট</div>
          </div>
        </div>

        {/* For Rent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">For Rent</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{toLets.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সক্রিয় বিজ্ঞাপন</div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
              -
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Pending Approval</div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">অপেক্ষমাণ</div>
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
              -
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Enquiries</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{recentEnquiries.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">মোট অনুসন্ধান</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location or keyword..."
            className="w-full text-xs pl-3 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Types</option>
          <option>Flat</option>
          <option>House</option>
          <option>Office</option>
          <option>Shop</option>
          <option>Room</option>
          <option>Land</option>
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Areas</option>
          <option>Sadar</option>
          <option>Muktagacha</option>
          <option>Trishal</option>
          <option>Fulbaria</option>
          <option>Charpara</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
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
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedType('All Types');
            setSelectedArea('All Areas');
            setSelectedStatus('All Status');
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Table & Tabs) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          {/* Status Tabs and Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Listings ({toLets.length})
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'rent'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                For Rent ({toLets.length})
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'sale'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                For Sale (0)
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pending (0)
              </button>
              <button
                onClick={() => setActiveTab('reported')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'reported'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Reported (0)
              </button>
            </div>

            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="pb-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedListingIds.length === filteredListings.length && filteredListings.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Image</th>
                  <th className="pb-3 px-3">Title & Location</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-3">Details</th>
                  <th className="pb-3 px-2">Price</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-3">Posted At</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Home className="w-8 h-8 text-slate-300 stroke-1" />
                        <p className="font-semibold text-slate-600 text-sm">কোনো বাসা ভাড়ার তথ্য নেই</p>
                        <p className="text-xs text-slate-400">নতুন বাসা বা দোকান ভাড়ার বিজ্ঞাপন দিতে উপরের "Add To-Let Listing" বাটনে ক্লিক করুন</p>
                        {onAddToLet && (
                          <button
                            onClick={onAddToLet}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>নতুন বিজ্ঞাপন যোগ করুন</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selectedListingIds.includes(item.id)}
                          onChange={() => toggleSelectListing(item.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-[150px]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        <div className="space-y-0.5">
                          {item.beds && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-3 h-3 text-slate-400" />
                              <span>{item.beds} Beds</span>
                            </div>
                          )}
                          {item.baths && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-3 h-3 text-slate-400" />
                              <span>{item.baths} Baths</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Maximize className="w-2.5 h-2.5" />
                            <span>{item.sqft}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-extrabold text-emerald-700 text-xs whitespace-nowrap">
                          {item.price}
                        </div>
                        <div className="text-[10px] text-slate-400">/month</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600'
                              : item.status === 'Pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        <div>{item.postedAt}</div>
                        <div className="text-[10px] text-slate-400">{item.timeAgo}</div>
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
                            className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteToLet(item.id)}
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
              Showing {filteredListings.length} of {toLets.length} listings
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

        {/* Right Column: Property Type Statistics, Top Locations, Recent Enquiries */}
        <div className="lg:col-span-4 space-y-5">
          {/* Property Type Statistics */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Property Type Statistics</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-2.5">
              {propertyStats.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 w-28">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-slate-600 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-[130px]">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] w-6 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Top Locations</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-2.5">
              {topLocations.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 w-28">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{loc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-[130px]">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: loc.width }} />
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] w-6 text-right">
                    {loc.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Recent Enquiries</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              {recentEnquiries.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <Users className="w-6 h-6 mx-auto mb-1.5 text-slate-300 stroke-1" />
                  <p className="text-xs font-medium text-slate-500">কোনো অনুসন্ধান পাওয়া যায়নি</p>
                </div>
              ) : (
                recentEnquiries.map((enq, i) => (
                  <div key={i} className="flex items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={enq.avatar}
                        alt={enq.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-[11px] truncate">{enq.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {enq.property} • {enq.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          enq.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400">{enq.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
