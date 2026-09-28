import React, { useState } from 'react';
import {
  Droplet,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  Trash2,
  Phone,
  RotateCcw
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
  const [groupFilter, setGroupFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');

  const filtered = donors.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.upazila.toLowerCase().includes(q);
    const matchGroup = groupFilter === 'All' || d.blood_group === groupFilter;
    const matchAvail = availFilter === 'All' || d.availability === availFilter;
    return matchSearch && matchGroup && matchAvail;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
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
                Manage volunteer blood donors and emergency blood requests across Mymensingh.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Registered Donors</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{donors.length || 564}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 15% (+73 this month)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Available Now</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {donors.filter((d) => d.availability === 'Available').length || 492}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Ready for direct call</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">O+ Group Donors</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {donors.filter((d) => d.blood_group === 'O+').length || 188}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Universal donor group</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Emergency Dispatches</div>
          <div className="text-2xl font-black text-purple-600 mt-1">142</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Matched successfully</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor by name, phone or upazila..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
          >
            <option value="All">All Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
          >
            <option value="All">All Availability</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setGroupFilter('All');
              setAvailFilter('All');
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-3">Donor Name</th>
                <th className="pb-3 px-3">Blood Group</th>
                <th className="pb-3 px-3">Upazila / Area</th>
                <th className="pb-3 px-3">Contact Phone</th>
                <th className="pb-3 px-3">Availability</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      <Droplet className="w-3 h-3 fill-rose-600" />
                      <span>{d.blood_group}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600">{d.upazila}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.availability === 'Available'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d.availability}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteDonor(d.id)}
                      className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                      title="Delete Donor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
