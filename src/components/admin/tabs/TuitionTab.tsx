import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  Trash2,
  Phone,
  RotateCcw
} from 'lucide-react';
import type { TuitionListing } from '../../../types';

interface TuitionTabProps {
  tuitions: TuitionListing[];
  onAddTuition: () => void;
  onDeleteTuition: (id: string) => void;
  onViewPublicPage: () => void;
}

export const TuitionTab: React.FC<TuitionTabProps> = ({
  tuitions,
  onAddTuition,
  onDeleteTuition,
  onViewPublicPage
}) => {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const filtered = tuitions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.toLowerCase().includes(q));
    const matchClass = classFilter === 'All' || t.class_level.includes(classFilter);
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Tuition Media</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tuition Media Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Connect students and professional home tutors across Mymensingh city.
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
              onClick={onAddTuition}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tuition Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Tuition Posts</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{tuitions.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Live active listings</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Active Search Filter</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{filtered.length}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Matching current criteria</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Subjects Covered</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {new Set(tuitions.flatMap((t) => t.subjects)).size}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Unique curriculum topics</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Locations</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {new Set(tuitions.map((t) => t.location)).size}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">City areas covered</div>
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
              placeholder="Search by subject, class or location..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
          >
            <option value="All">All Classes</option>
            <option value="Class 1-5">Class 1-5</option>
            <option value="Class 6-8">Class 6-8</option>
            <option value="Class 9-10">Class 9-10 (SSC)</option>
            <option value="HSC">HSC / College</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setClassFilter('All');
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
                <th className="pb-3 px-3">Tuition Title</th>
                <th className="pb-3 px-3">Class Level</th>
                <th className="pb-3 px-3">Subjects</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Salary & Schedule</th>
                <th className="pb-3 px-3">Phone</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">কোনো টিউশন পোস্ট পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-0.5">নতুন টিউশন রিকোয়েস্ট বা অফার যুক্ত করতে নিচের বাটনে চাপ দিন</p>
                    <button
                      onClick={onAddTuition}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন টিউশন যোগ করুন</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{t.title}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {t.class_level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {t.subjects.map((sub, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{t.location}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-emerald-700">{t.salary}</div>
                      <div className="text-[10px] text-slate-400">{t.days_per_week}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteTuition(t.id)}
                        className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        title="Delete Tuition Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-800">{tuitions.length}</span> tuition listings
          </div>
          <div className="text-[11px] text-slate-400">
            Page 1 of {Math.max(1, Math.ceil(filtered.length / 10))}
          </div>
        </div>
      </div>
    </div>
  );
};
