import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ExternalLink,
  Users,
  Ticket,
  Filter,
  RotateCcw,
  Download,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import type { EventItem } from '../../../types';

interface EventsTabProps {
  events: EventItem[];
  onAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
  onViewPublicPage: () => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
  onViewPublicPage
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'past' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Sort by Date');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  // Demo fallback events matching the mockup screenshot
  const initialEvents = [
    {
      id: 'e1',
      title: 'ময়মনসিংহ বইমেলা ২০২৬',
      date: '15 Oct 2026',
      time: '9:00 AM - 8:00 PM',
      location: 'ময়মনসিংহ টাউন হল',
      category: 'Culture',
      attendees: '1.2K',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e2',
      title: 'ফ্রি মেডিকেল ক্যাম্প',
      date: '20 Sep 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'ত্রিশাল উপজেলা',
      category: 'Health',
      attendees: '850',
      status: 'Ongoing',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e3',
      title: 'ক্যারিয়ার গাইডলাইন সেমিনার',
      date: '25 Sep 2026',
      time: '10:00 AM - 1:00 PM',
      location: 'ময়মনসিংহ মেডিকেল কলেজ',
      category: 'Education',
      attendees: '420',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e4',
      title: 'চাকরি মেলা ২০২৬',
      date: '2 Oct 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'জেলা পরিষদ প্রাঙ্গণ',
      category: 'Career',
      attendees: '1.8K',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e5',
      title: 'ফুটবল টুর্নামেন্ট (জেলা পর্যায়)',
      date: '18 Sep 2026',
      time: '3:00 PM - 7:00 PM',
      location: 'মুক্তাগাছা স্টেডিয়াম',
      category: 'Sports',
      attendees: '980',
      status: 'Ongoing',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e6',
      title: 'ঐতিহ্যবাহী নৌকা বাইচ',
      date: '5 Oct 2026',
      time: '8:00 AM - 5:00 PM',
      location: 'ব্রহ্মপুত্র নদ, ময়মনসিংহ',
      category: 'Culture',
      attendees: '2.5K',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e7',
      title: 'টেকনোলজি ও আইটি ওয়ার্কশপ',
      date: '28 Sep 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'আনন্দ মোহন কলেজ',
      category: 'Technology',
      attendees: '320',
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e8',
      title: 'পরিবেশ সচেতনতা র‍্যালী',
      date: '12 Sep 2026',
      time: '8:00 AM - 11:00 AM',
      location: 'ময়মনসিংহ সদর',
      category: 'Environment',
      attendees: '640',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e9',
      title: 'ইসলামী সাংস্কৃতিক অনুষ্ঠান',
      date: '30 Sep 2026',
      time: '6:00 PM - 10:00 PM',
      location: 'কেন্দ্রীয় ঈদগাহ মাঠ',
      category: 'Religious',
      attendees: '1.1K',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'e10',
      title: 'রক্তদান উৎসব',
      date: '10 Oct 2026',
      time: '9:00 AM - 3:00 PM',
      location: 'ময়মনসিংহ মেডিকেল কলেজ',
      category: 'Health',
      attendees: '920',
      status: 'Cancelled',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=120&q=80'
    }
  ];

  // Merge context events with initial demo events if needed
  const displayEvents = events.length > 0 ? events.map((e, idx) => ({
    id: e.id,
    title: e.title || e.title_bn,
    date: e.date,
    time: e.time,
    location: e.venue,
    category: e.category,
    attendees: '450',
    status: idx % 2 === 0 ? 'Upcoming' : 'Ongoing',
    image: e.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80'
  })) : initialEvents;

  const toggleSelectAll = () => {
    if (selectedEventIds.length === displayEvents.length) {
      setSelectedEventIds([]);
    } else {
      setSelectedEventIds(displayEvents.map(e => e.id));
    }
  };

  const toggleSelectEvent = (id: string) => {
    if (selectedEventIds.includes(id)) {
      setSelectedEventIds(selectedEventIds.filter(i => i !== id));
    } else {
      setSelectedEventIds([...selectedEventIds, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Ongoing':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border border-slate-200';
      case 'Completed':
        return 'bg-slate-50 text-slate-500 border border-slate-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      default:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Culture':
        return 'bg-amber-50 text-amber-600';
      case 'Health':
        return 'bg-rose-50 text-rose-600';
      case 'Education':
        return 'bg-purple-50 text-purple-600';
      case 'Career':
        return 'bg-blue-50 text-blue-600';
      case 'Sports':
        return 'bg-emerald-50 text-emerald-600';
      case 'Technology':
        return 'bg-cyan-50 text-cyan-600';
      case 'Environment':
        return 'bg-teal-50 text-teal-600';
      case 'Religious':
        return 'bg-indigo-50 text-indigo-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const categoryStats = [
    { name: 'Cultural', count: 28, color: 'bg-amber-400', width: '70%' },
    { name: 'Educational', count: 24, color: 'bg-purple-500', width: '60%' },
    { name: 'Health', count: 18, color: 'bg-rose-400', width: '45%' },
    { name: 'Sports', count: 16, color: 'bg-teal-500', width: '40%' },
    { name: 'Career', count: 14, color: 'bg-blue-500', width: '35%' },
    { name: 'Religious', count: 12, color: 'bg-indigo-500', width: '30%' },
    { name: 'Environment', count: 10, color: 'bg-emerald-500', width: '25%' },
    { name: 'Technology', count: 8, color: 'bg-sky-500', width: '20%' },
    { name: 'Others', count: 6, color: 'bg-slate-400', width: '15%' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Events</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Events Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Create, manage and promote events in Mymensingh.
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
              onClick={onAddEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 28%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Events</div>
            <div className="text-2xl font-black text-slate-900 mt-1">156</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+34 this month</div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Upcoming Events</div>
            <div className="text-2xl font-black text-slate-900 mt-1">62</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+12 this month</div>
          </div>
        </div>

        {/* Total Attendees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 42%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Attendees</div>
            <div className="text-2xl font-black text-slate-900 mt-1">12,840</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+3,120 this month</div>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 36%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Tickets Sold</div>
            <div className="text-2xl font-black text-slate-900 mt-1">4,320</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+1,140 this month</div>
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
            placeholder="Search events by title, keyword..."
            className="w-full text-xs pl-3 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Categories</option>
          <option>Culture</option>
          <option>Education</option>
          <option>Health</option>
          <option>Sports</option>
          <option>Career</option>
          <option>Technology</option>
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Locations</option>
          <option>ময়মনসিংহ সদর</option>
          <option>মুক্তাগাছা</option>
          <option>ত্রিশাল</option>
          <option>ভালুকা</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Status</option>
          <option>Upcoming</option>
          <option>Ongoing</option>
          <option>Draft</option>
          <option>Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>Sort by Date</option>
          <option>Sort by Attendees</option>
          <option>Sort by Title</option>
        </select>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All Categories');
            setSelectedLocation('All Locations');
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
                All Events (156)
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Upcoming (62)
              </button>
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'ongoing'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Ongoing (8)
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'past'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Past (76)
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'draft'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Draft (10)
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
                      checked={selectedEventIds.length === displayEvents.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Image</th>
                  <th className="pb-3 px-3">Event Title</th>
                  <th className="pb-3 px-3">Date & Time</th>
                  <th className="pb-3 px-3">Location</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Attendees</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayEvents.map((evt, idx) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedEventIds.includes(evt.id)}
                        onChange={() => toggleSelectEvent(evt.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-10 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 line-clamp-1 max-w-[160px]">
                      {evt.title}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{evt.date}</div>
                      <div className="text-[10px] text-slate-400">{evt.time}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 line-clamp-1 max-w-[130px]">
                      {evt.location}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadge(evt.category)}`}>
                        {evt.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{evt.attendees}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(evt.status)}`}>
                        {evt.status}
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
                          onClick={() => onDeleteEvent(evt.id)}
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
              Showing 1 to 10 of 156 events
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
                16
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar, Category Stats, Upcoming mini cards */}
        <div className="lg:col-span-4 space-y-5">
          {/* Events Calendar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Events Calendar</span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>September 2026</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 py-2 border-b border-slate-100">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold py-2">
              <span className="text-slate-300 p-1.5"></span>
              <span className="text-slate-300 p-1.5"></span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">1</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">2</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">3</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">4</span>
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg font-bold cursor-pointer">5</span>

              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">6</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">7</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">8</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">9</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">10</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">11</span>
              <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg font-bold cursor-pointer">12</span>

              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">13</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">14</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">15</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">16</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">17</span>
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer shadow-xs">18</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">19</span>

              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">20</span>
              <span className="p-1.5 bg-blue-600 text-white rounded-lg font-bold cursor-pointer shadow-xs">21</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">22</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">23</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">24</span>
              <span className="p-1.5 bg-purple-200 text-purple-800 rounded-lg font-bold cursor-pointer">25</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">26</span>

              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">27</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">28</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">29</span>
              <span className="text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">30</span>
            </div>
          </div>

          {/* Event Category Statistics */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Event Category Statistics</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-2.5">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 w-28">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span className="text-slate-600 font-medium truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-[130px]">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.width }} />
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] w-6 text-right">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Mini Cards */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Upcoming Events</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=80&q=80"
                    alt="বইমেলা"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">ময়মনসিংহ বইমেলা ২০২৬</h5>
                    <p className="text-[10px] text-slate-400">15 Oct 2026 • টাউন হল</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  5 days left
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=80&q=80"
                    alt="ক্যারিয়ার"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">ক্যারিয়ার গাইডলাইন সেমিনার</h5>
                    <p className="text-[10px] text-slate-400">25 Sep 2026 • মেডিকেল কলেজ</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                  15 days left
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=80&q=80"
                    alt="চাকরি মেলা"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">চাকরি মেলা ২০২৬</h5>
                    <p className="text-[10px] text-slate-400">2 Oct 2026 • জেলা পরিষদ</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full shrink-0">
                  22 days left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
