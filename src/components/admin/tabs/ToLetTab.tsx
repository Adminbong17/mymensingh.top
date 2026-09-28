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

  const initialListings = [
    {
      id: 'tl1',
      title: '3 Bedroom Apartment',
      location: 'Maskanda, Mymensingh',
      type: 'Flat',
      beds: 3,
      baths: 2,
      sqft: '1,200 sqft',
      price: '৳ 18,000',
      status: 'Active',
      postedAt: '26 Sep 2026',
      timeAgo: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl2',
      title: 'Duplex House for Rent',
      location: 'Trishal, Mymensingh',
      type: 'House',
      beds: 4,
      baths: 3,
      sqft: '2,200 sqft',
      price: '৳ 25,000',
      status: 'Active',
      postedAt: '25 Sep 2026',
      timeAgo: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl3',
      title: 'Office Space',
      location: 'Muktagacha, Mymensingh',
      type: 'Office',
      beds: null,
      baths: null,
      sqft: '800 sqft',
      price: '৳ 30,000',
      status: 'Pending',
      postedAt: '24 Sep 2026',
      timeAgo: '1 day ago',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl4',
      title: 'Shop for Rent',
      location: 'Sadar, Mymensingh',
      type: 'Shop',
      beds: null,
      baths: null,
      sqft: '500 sqft',
      price: '৳ 35,000',
      status: 'Active',
      postedAt: '24 Sep 2026',
      timeAgo: '1 day ago',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl5',
      title: 'Single Room (Bachelor)',
      location: 'Fulbaria, Mymensingh',
      type: 'Room',
      beds: 1,
      baths: 1,
      sqft: '250 sqft',
      price: '৳ 4,500',
      status: 'Active',
      postedAt: '23 Sep 2026',
      timeAgo: '2 days ago',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl6',
      title: 'Land for Rent',
      location: 'Muktagacha, Mymensingh',
      type: 'Land',
      beds: null,
      baths: null,
      sqft: '10 Katha',
      price: '৳ 12,000',
      status: 'Inactive',
      postedAt: '22 Sep 2026',
      timeAgo: '3 days ago',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl7',
      title: '2 Bedroom Apartment',
      location: 'Charpara, Mymensingh',
      type: 'Flat',
      beds: 2,
      baths: 2,
      sqft: '950 sqft',
      price: '৳ 14,000',
      status: 'Active',
      postedAt: '21 Sep 2026',
      timeAgo: '3 days ago',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'tl8',
      title: 'Commercial Space',
      location: 'Sadar, Mymensingh',
      type: 'Commercial',
      beds: null,
      baths: null,
      sqft: '1,500 sqft',
      price: '৳ 50,000',
      status: 'Active',
      postedAt: '20 Sep 2026',
      timeAgo: '4 days ago',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const displayListings = toLets.length > 0 ? toLets.map((item, idx) => ({
    id: item.id,
    title: item.title,
    location: item.area,
    type: item.type || 'Flat',
    beds: item.bedrooms,
    baths: item.bathrooms,
    sqft: '1,100 sqft',
    price: item.rent,
    status: idx === 2 ? 'Pending' : idx === 5 ? 'Inactive' : 'Active',
    postedAt: item.available_from || '26 Sep 2026',
    timeAgo: '1 day ago',
    image: item.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80'
  })) : initialListings;

  const toggleSelectAll = () => {
    if (selectedListingIds.length === displayListings.length) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(displayListings.map(l => l.id));
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

  const propertyStats = [
    { name: 'Flat', count: 72, color: 'bg-emerald-500', width: '85%' },
    { name: 'House', count: 38, color: 'bg-blue-500', width: '55%' },
    { name: 'Room', count: 26, color: 'bg-purple-500', width: '40%' },
    { name: 'Shop', count: 18, color: 'bg-rose-400', width: '30%' },
    { name: 'Office', count: 12, color: 'bg-amber-400', width: '20%' },
    { name: 'Land', count: 10, color: 'bg-indigo-500', width: '18%' },
    { name: 'Commercial', count: 10, color: 'bg-orange-500', width: '18%' }
  ];

  const topLocations = [
    { name: 'Sadar', count: 48, width: '80%' },
    { name: 'Muktagacha', count: 32, width: '60%' },
    { name: 'Trishal', count: 28, width: '50%' },
    { name: 'Fulbaria', count: 24, width: '40%' },
    { name: 'Charpara', count: 18, width: '30%' }
  ];

  const recentEnquiries = [
    {
      name: 'Tanvir Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      property: '3 Bedroom Apartment',
      location: 'Maskanda',
      status: 'active',
      time: '5 minutes ago'
    },
    {
      name: 'Faria Islam',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      property: 'Shop for Rent',
      location: 'Sadar',
      status: 'active',
      time: '12 minutes ago'
    },
    {
      name: 'Imran Hossain',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      property: 'Office Space',
      location: 'Muktagacha',
      status: 'pending',
      time: '28 minutes ago'
    },
    {
      name: 'Samiha Rahman',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      property: 'Single Room',
      location: 'Fulbaria',
      status: 'active',
      time: '1 hour ago'
    }
  ];

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
              ↑ 24%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Listings</div>
            <div className="text-2xl font-black text-slate-900 mt-1">186</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+36 this month</div>
          </div>
        </div>

        {/* For Rent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">For Rent</div>
            <div className="text-2xl font-black text-slate-900 mt-1">162</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Active listings</div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              ↓ 22%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Pending Approval</div>
            <div className="text-2xl font-black text-slate-900 mt-1">14</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">-4 from last month</div>
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 36%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Enquiries</div>
            <div className="text-2xl font-black text-slate-900 mt-1">528</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+138 this month</div>
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
                All Listings (186)
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'rent'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                For Rent (162)
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'sale'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                For Sale (18)
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pending (14)
              </button>
              <button
                onClick={() => setActiveTab('reported')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'reported'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Reported (3)
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
                      checked={selectedListingIds.length === displayListings.length}
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
                {displayListings.map((item, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
            <span className="text-slate-500 font-medium">
              Showing 1 to 8 of 186 listings
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
                24
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
              {recentEnquiries.map((enq, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
