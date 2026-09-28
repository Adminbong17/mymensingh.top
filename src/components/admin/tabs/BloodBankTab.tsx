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

  const displayDonors = donors.map((d) => ({
    id: d.id,
    name: d.name,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    bloodGroup: d.blood_group,
    phone: d.phone,
    location: d.upazila || 'Mymensingh Sadar',
    lastDonate: d.last_donation || '12 Aug 2026',
    status: d.availability === 'Available' ? ('Available' as const) : ('Not Available' as const)
  }));

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

  const bloodGroupsList = [
    { group: 'A+', color: 'bg-red-500' },
    { group: 'O+', color: 'bg-pink-400' },
    { group: 'B+', color: 'bg-blue-500' },
    { group: 'AB+', color: 'bg-purple-500' },
    { group: 'A-', color: 'bg-purple-700' },
    { group: 'O-', color: 'bg-purple-800' },
    { group: 'B-', color: 'bg-indigo-600' },
    { group: 'AB-', color: 'bg-violet-600' }
  ];

  const bloodGroupStats = bloodGroupsList.map(bg => {
    const count = donors.filter(d => d.blood_group === bg.group).length;
    const total = donors.length || 1;
    const pctVal = donors.length > 0 ? Math.round((count / total) * 100) : 0;
    return {
      group: bg.group,
      count,
      pct: `${pctVal}%`,
      color: bg.color,
      width: `${count > 0 ? pctVal : 0}%`
    };
  });

  const recentRequests: {
    blood: string;
    title: string;
    hospital: string;
    time: string;
    badge: string;
    badgeColor: string;
  }[] = [];

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
              <Droplet className="w-6 h-6 fill-rose-600" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Registered
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Donors</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{donors.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Verified volunteer donors</div>
          </div>
        </div>

        {/* Available Donors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplet className="w-6 h-6 fill-emerald-600" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Available Donors</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{donors.filter(d => d.availability === 'Available').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Ready to donate immediately</div>
          </div>
        </div>

        {/* Request This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Requests
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Request This Month</div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Emergency requests</div>
          </div>
        </div>

        {/* Fulfilled Requests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Fulfilled
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Fulfilled Requests</div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Completed donations</div>
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Droplet className="w-8 h-8 text-slate-300 stroke-1" />
                          <p className="font-semibold text-slate-600 text-sm">কোনো রক্তদাতার তথ্য নেই</p>
                          <p className="text-xs text-slate-400">নতুন রক্তদাতা যুক্ত করতে উপরের "Add Donor" বাটনে ক্লিক করুন</p>
                          {onAddDonor && (
                            <button
                              onClick={onAddDonor}
                              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>নতুন রক্তদাতা যোগ করুন</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((d, idx) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {filtered.length} of {donors.length} donors
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
              {recentRequests.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <Droplet className="w-6 h-6 mx-auto mb-1.5 text-slate-300 stroke-1" />
                  <p className="text-xs font-medium text-slate-500">কোনো জরুরি রক্তের অনুরোধ নেই</p>
                </div>
              ) : (
                recentRequests.map((req, i) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
