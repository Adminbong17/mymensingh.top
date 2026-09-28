import React, { useState } from 'react';
import {
  Users,
  Store,
  Droplet,
  GraduationCap,
  Calendar,
  UserPlus,
  Newspaper,
  Percent,
  MoreVertical
} from 'lucide-react';
import type { AdminTab } from '../AdminSidebar';

interface OverviewTabProps {
  onSelectTab: (tab: AdminTab) => void;
  onOpenEntityModal: (type: 'news' | 'event' | 'offer' | 'donor' | 'tuition' | 'tolet') => void;
  onOpenBusinessModal: () => void;
  onOpenUserModal: () => void;
  businessesCount: number;
  bloodDonorsCount: number;
  tuitionCount: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onSelectTab,
  onOpenEntityModal,
  onOpenBusinessModal,
  onOpenUserModal,
  businessesCount,
  bloodDonorsCount,
  tuitionCount
}) => {
  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');

  const recentUsers = [
    {
      id: 1,
      name: 'Rakibul Hasan',
      phone: '01712-345678',
      email: 'rakib@gmail.com',
      role: 'User',
      joinedAt: '26 Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 2,
      name: 'Tanjiha Afrin',
      phone: '01823-456789',
      email: 'tanjiha@gmail.com',
      role: 'User',
      joinedAt: '26 Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 3,
      name: 'Sabbir Ahmed',
      phone: '01911-223344',
      email: 'sabbir@gmail.com',
      role: 'Admin',
      joinedAt: '25 Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 4,
      name: 'Nusrat Jahan',
      phone: '01678-556677',
      email: 'nusrat@gmail.com',
      role: 'User',
      joinedAt: '25 Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: 5,
      name: 'Arif Hossain',
      phone: '01890-112233',
      email: 'arif@gmail.com',
      role: 'User',
      joinedAt: '24 Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
    }
  ];

  const recentActivities = [
    {
      icon: Users,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'New user registered',
      time: '2 minutes ago'
    },
    {
      icon: Store,
      color: 'bg-blue-100 text-blue-600',
      title: 'New business added',
      time: '15 minutes ago'
    },
    {
      icon: Droplet,
      color: 'bg-rose-100 text-rose-600',
      title: 'Blood donor joined',
      time: '1 hour ago'
    },
    {
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-600',
      title: 'New tuition post',
      time: '2 hours ago'
    },
    {
      icon: Newspaper,
      color: 'bg-amber-100 text-amber-600',
      title: 'News published',
      time: '3 hours ago'
    }
  ];

  // Total posts calculated for donut chart
  const donutData = [
    { label: 'Businesses', count: 142, color: '#10b981' },
    { label: 'To-Let', count: 98, color: '#3b82f6' },
    { label: 'News', count: 86, color: '#f59e0b' },
    { label: 'Events', count: 64, color: '#ef4444' },
    { label: 'Offers', count: 52, color: '#06b6d4' },
    { label: 'Tuition Media', count: 40, color: '#a855f7' }
  ];
  const totalDonutCount = donutData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Greeting & Date pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Good Afternoon <span className="inline-block animate-wave">👋</span>
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Mehedi Hasan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Date Pill Widget */}
        <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Saturday, 26 September 2026
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              ১০ আশ্বিন ১৪৩৩, শনিবার
            </div>
          </div>
        </div>
      </div>

      {/* 4 Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">1,245</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+132 this month</div>
          </div>
        </div>

        {/* Businesses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 8%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Businesses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businessesCount || 328}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+24 this month</div>
          </div>
        </div>

        {/* Blood Donors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Droplet className="w-6 h-6 fill-rose-600" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 15%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Blood Donors</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{bloodDonorsCount || 564}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+73 this month</div>
          </div>
        </div>

        {/* Tuition Posts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Tuition Posts</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tuitionCount || 1032}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+158 this month</div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Trend Chart, Donut Breakdown, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User Registration Trend */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-bold text-slate-900 text-sm">User Registration Trend</h3>
            <div className="relative">
              <select
                value={trendPeriod}
                onChange={(e) => setTrendPeriod(e.target.value)}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-hidden cursor-pointer"
              >
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="75" x2="480" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="165" x2="480" y2="165" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="15" y="34" className="text-[10px] fill-slate-400 font-medium">200</text>
              <text x="15" y="79" className="text-[10px] fill-slate-400 font-medium">150</text>
              <text x="15" y="124" className="text-[10px] fill-slate-400 font-medium">100</text>
              <text x="20" y="169" className="text-[10px] fill-slate-400 font-medium">50</text>
              <text x="26" y="195" className="text-[10px] fill-slate-400 font-medium">0</text>

              {/* Gradient Area Fill */}
              <path
                d="M 50 165 C 90 140, 110 120, 140 100 C 170 125, 200 135, 230 115 C 260 135, 290 110, 320 85 C 350 95, 380 70, 410 65 C 440 65, 460 65, 470 65 L 470 190 L 50 190 Z"
                fill="url(#trendGradient)"
              />

              {/* Line */}
              <path
                d="M 50 165 C 90 140, 110 120, 140 100 C 170 125, 200 135, 230 115 C 260 135, 290 110, 320 85 C 350 95, 380 70, 410 65 C 440 65, 460 65, 470 65"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Points */}
              {[
                { cx: 50, cy: 165 },
                { cx: 95, cy: 135 },
                { cx: 140, cy: 100 },
                { cx: 185, cy: 125 },
                { cx: 230, cy: 115 },
                { cx: 275, cy: 125 },
                { cx: 320, cy: 85 },
                { cx: 365, cy: 92 },
                { cx: 410, cy: 65 },
                { cx: 455, cy: 65 }
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="3.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}

              {/* X Axis Labels */}
              <text x="45" y="196" className="text-[10px] fill-slate-400 font-medium">Jan</text>
              <text x="90" y="196" className="text-[10px] fill-slate-400 font-medium">Feb</text>
              <text x="135" y="196" className="text-[10px] fill-slate-400 font-medium">Mar</text>
              <text x="180" y="196" className="text-[10px] fill-slate-400 font-medium">Apr</text>
              <text x="225" y="196" className="text-[10px] fill-slate-400 font-medium">May</text>
              <text x="270" y="196" className="text-[10px] fill-slate-400 font-medium">Jun</text>
              <text x="315" y="196" className="text-[10px] fill-slate-400 font-medium">Jul</text>
              <text x="360" y="196" className="text-[10px] fill-slate-400 font-medium">Aug</text>
              <text x="405" y="196" className="text-[10px] fill-slate-400 font-medium">Sep</text>
              <text x="450" y="196" className="text-[10px] fill-slate-400 font-medium">Oct</text>
            </svg>
          </div>
        </div>

        {/* Content Summary (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm pb-2">Content Summary</h3>
          <div className="flex items-center justify-between gap-4 my-auto">
            {/* Donut SVG */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="4"
                />
                {/* Segments */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="26 74"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-26"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="18 82"
                  strokeDashoffset="-46"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="14 86"
                  strokeDashoffset="-64"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeDasharray="12 88"
                  strokeDashoffset="-78"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="4"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black text-slate-900">{totalDonutCount}</span>
                <span className="text-[10px] text-slate-400 font-semibold">Total Posts</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-1.5 flex-1 text-xs">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-slate-600 font-medium">{d.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Recent Activities</h3>
            <button
              onClick={() => onSelectTab('users')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-3.5 flex-1">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${act.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{act.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Users & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Users Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Users</h3>
            <button
              onClick={() => onSelectTab('users')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-3">Name</th>
                  <th className="pb-3 px-3">Phone</th>
                  <th className="pb-3 px-3">Email</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Joined At</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-400">{u.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{u.phone}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{u.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'Admin'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-500">{u.joinedAt}</td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (6 colorful cards) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm pb-3">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Add User */}
            <button
              onClick={onOpenUserModal}
              className="p-4 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-950">Add User</span>
            </button>

            {/* Add Business */}
            <button
              onClick={onOpenBusinessModal}
              className="p-4 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-950">Add Business</span>
            </button>

            {/* New Blood Post */}
            <button
              onClick={() => onOpenEntityModal('donor')}
              className="p-4 rounded-xl bg-rose-50/60 hover:bg-rose-100/70 border border-rose-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xs font-bold text-rose-950">New Blood Post</span>
            </button>

            {/* New Tuition Post */}
            <button
              onClick={() => onOpenEntityModal('tuition')}
              className="p-4 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-950">New Tuition Post</span>
            </button>

            {/* New Event */}
            <button
              onClick={() => onOpenEntityModal('event')}
              className="p-4 rounded-xl bg-orange-50/60 hover:bg-orange-100/70 border border-orange-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-orange-950">New Event</span>
            </button>

            {/* New Offer */}
            <button
              onClick={() => onOpenEntityModal('offer')}
              className="p-4 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-100 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-950">New Offer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
