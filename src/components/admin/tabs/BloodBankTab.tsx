import React, { useState } from 'react';
import {
  Droplet,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Filter,
  RotateCcw,
  Download,
  Eye,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import type { BloodDonor } from '../../../types';

interface BloodBankTabProps {
  donors: BloodDonor[];
  onAddDonor: () => void;
  onDeleteDonor: (id: string) => void;
  onViewPublicPage: () => void;
}

interface MockDonor {
  id: string;
  name: string;
  avatar: string;
  bloodGroup: string;
  phone: string;
  location: string;
  lastDonate: string;
  status: 'Available' | 'Not Available';
}

const INITIAL_DONORS: MockDonor[] = [
  {
    id: 'd1',
    name: 'Rakibul Hasan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'A+',
    phone: '01712-345678',
    location: 'Mymensingh Sadar',
    lastDonate: '12 Aug 2026',
    status: 'Available'
  },
  {
    id: 'd2',
    name: 'Tanjiha Afrin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'O+',
    phone: '01823-456789',
    location: 'Muktagacha',
    lastDonate: '5 Jul 2026',
    status: 'Available'
  },
  {
    id: 'd3',
    name: 'Sabbir Ahmed',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'B+',
    phone: '01911-223344',
    location: 'Trishal',
    lastDonate: '20 Jun 2026',
    status: 'Available'
  },
  {
    id: 'd4',
    name: 'Nusrat Jahan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'AB+',
    phone: '01678-556677',
    location: 'Mymensingh Sadar',
    lastDonate: '15 Sep 2026',
    status: 'Available'
  },
  {
    id: 'd5',
    name: 'Arif Hossain',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'O-',
    phone: '01890-112233',
    location: 'Muktagacha',
    lastDonate: '28 Jul 2026',
    status: 'Not Available'
  },
  {
    id: 'd6',
    name: 'Mim Akter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'A-',
    phone: '01745-667788',
    location: 'Fulbaria',
    lastDonate: '1 Sep 2026',
    status: 'Available'
  },
  {
    id: 'd7',
    name: 'Hasan Mahmud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'B-',
    phone: '01312-998877',
    location: 'Mymensingh Sadar',
    lastDonate: '30 Aug 2026',
    status: 'Available'
  },
  {
    id: 'd8',
    name: 'Faria Islam',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'O+',
    phone: '01999-334455',
    location: 'Trishal',
    lastDonate: '18 Jul 2026',
    status: 'Not Available'
  },
  {
    id: 'd9',
    name: 'Imran Hossain',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'A+',
    phone: '01521-778899',
    location: 'Fulbaria',
    lastDonate: '10 Sep 2026',
    status: 'Available'
  },
  {
    id: 'd10',
    name: 'Samiha Rahman',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
    bloodGroup: 'AB-',
    phone: '01811-223366',
    location: 'Muktagacha',
    lastDonate: '25 Jun 2026',
    status: 'Available'
  }
];

export const BloodBankTab: React.FC<BloodBankTabProps> = ({
  donors,
  onAddDonor,
  onDeleteDonor,
  onViewPublicPage
}) => {
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All Blood Groups');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [availabilityFilter, setAvailabilityFilter] = useState('Availability Status');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const displayDonors = donors.length > 0 ? donors.map((d, idx) => ({
    id: d.id,
    name: d.name,
    avatar: INITIAL_DONORS[idx % INITIAL_DONORS.length]?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    bloodGroup: d.blood_group,
    phone: d.phone,
    location: d.upazila || 'Mymensingh Sadar',
    lastDonate: d.last_donation || '12 Aug 2026',
    status: d.availability === 'Available' ? ('Available' as const) : ('Not Available' as const)
  })) : INITIAL_DONORS;

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(d => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getBloodGroupBadge = (bg: string) => {
    switch (bg) {
      case 'A+':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'O+':
        return 'bg-pink-50 text-pink-600 border border-pink-200';
      case 'B+':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'AB+':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'A-':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'O-':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'B-':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
      case 'AB-':
        return 'bg-violet-50 text-violet-700 border border-violet-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const filtered = displayDonors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.bloodGroup.toLowerCase().includes(q);

    const matchGroup =
      bloodGroupFilter === 'All Blood Groups' ||
      d.bloodGroup === bloodGroupFilter;

    const matchDistrict =
      districtFilter === 'All Districts' ||
      d.location.toLowerCase().includes(districtFilter.toLowerCase());

    const matchAvail =
      availabilityFilter === 'Availability Status' ||
      (availabilityFilter === 'Available' ? d.status === 'Available' : d.status === 'Not Available');

    return matchSearch && matchGroup && matchDistrict && matchAvail;
  });

  const bloodGroupStats = [
    { group: 'A+', count: 142, pct: '25%', color: 'bg-red-500', width: '70%' },
    { group: 'O+', count: 128, pct: '23%', color: 'bg-pink-400', width: '64%' },
    { group: 'B+', count: 96, pct: '17%', color: 'bg-blue-500', width: '48%' },
    { group: 'AB+', count: 64, pct: '11%', color: 'bg-purple-500', width: '32%' },
    { group: 'A-', count: 48, pct: '9%', color: 'bg-purple-700', width: '24%' },
    { group: 'O-', count: 42, pct: '7%', color: 'bg-purple-800', width: '21%' },
    { group: 'B-', count: 32, pct: '6%', color: 'bg-indigo-600', width: '16%' },
    { group: 'AB-', count: 30, pct: '5%', color: 'bg-violet-600', width: '15%' }
  ];

  const recentRequests = [
    {
      blood: 'O+',
      title: 'O+ blood needed',
      hospital: 'Mymensingh Medical College Hospital',
      time: '2 hours ago',
      badge: 'Urgent',
      badgeColor: 'bg-red-50 text-red-600 border border-red-200'
    },
    {
      blood: 'A-',
      title: 'A- blood needed',
      hospital: 'Muktagacha Upazila Health Complex',
      time: '5 hours ago',
      badge: 'Pending',
      badgeColor: 'bg-amber-50 text-amber-600 border border-amber-200'
    },
    {
      blood: 'B+',
      title: 'B+ blood needed',
      hospital: 'Trishal UHC',
      time: '1 day ago',
      badge: 'Fulfilled',
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    },
    {
      blood: 'AB+',
      title: 'AB+ blood needed',
      hospital: 'Mymensingh Sadar Hospital',
      time: '2 days ago',
      badge: 'Fulfilled',
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Blood Bank</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
              <Droplet className="w-6 h-6 fill-rose-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Blood Bank Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage blood donors, requests and save lives.
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
              onClick={onAddDonor}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Donor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching media_1790620107486.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-6 h-6">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              </div>
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 15%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Donors</div>
            <div className="text-2xl font-black text-slate-900 mt-1">564</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+73 this month</div>
          </div>
        </div>

        {/* Available Donors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplet className="w-6 h-6 fill-emerald-600" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Available Donors</div>
            <div className="text-2xl font-black text-slate-900 mt-1">482</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">ready to donate</div>
          </div>
        </div>

        {/* Request This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 28%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Request This Month</div>
            <div className="text-2xl font-black text-slate-900 mt-1">36</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+8 from last month</div>
          </div>
        </div>

        {/* Fulfilled Requests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Fulfilled Requests</div>
            <div className="text-2xl font-black text-slate-900 mt-1">29</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">81% success rate</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching media_1790620107486.jpg */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or location..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Blood Groups</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Districts</option>
          <option>Mymensingh Sadar</option>
          <option>Muktagacha</option>
          <option>Trishal</option>
          <option>Fulbaria</option>
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>Availability Status</option>
          <option>Available</option>
          <option>Not Available</option>
        </select>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearch('');
            setBloodGroupFilter('All Blood Groups');
            setDistrictFilter('All Districts');
            setAvailabilityFilter('Availability Status');
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Table: 70%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Donors List (564)</h3>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
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
                    <th className="pb-3 px-3">Name</th>
                    <th className="pb-3 px-2">Blood Group</th>
                    <th className="pb-3 px-3">Phone</th>
                    <th className="pb-3 px-3">Location</th>
                    <th className="pb-3 px-3">Last Donate</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((d, idx) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(d.id)}
                          onChange={() => toggleSelectOne(d.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <span className="font-bold text-slate-900 line-clamp-1">{d.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getBloodGroupBadge(d.bloodGroup)}`}>
                          {d.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                        {d.phone}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">{d.location}</td>
                      <td className="py-3 px-3 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        {d.lastDonate}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            d.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {d.status}
                        </span>
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
                            onClick={() => onDeleteDonor(d.id)}
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
              Showing 1 to 10 of 564 donors
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
                57
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Blood Group Statistics & Recent Blood Requests (30%) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Blood Group Statistics */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm pb-3">Blood Group Statistics</h3>

            <div className="space-y-2.5">
              {bloodGroupStats.map((item) => (
                <div key={item.group} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 w-12 font-bold text-slate-800">
                    <Droplet className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{item.group}</span>
                  </div>

                  <span className="font-bold text-slate-700 w-10 text-right">{item.count}</span>

                  <div className="flex-1 mx-3 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold w-8 text-right">
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Blood Requests */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent Blood Requests</h3>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              {recentRequests.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Droplet className="w-4 h-4 fill-rose-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">{req.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full shrink-0 ${req.badgeColor}`}>
                        {req.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{req.hospital}</div>
                    <div className="text-[9px] text-slate-400">{req.time}</div>
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
