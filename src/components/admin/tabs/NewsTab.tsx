import React, { useState } from 'react';
import {
  Newspaper,
  Plus,
  ExternalLink,
  Eye,
  MessageSquare,
  Star,
  Filter,
  RotateCcw,
  Download,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { NewsArticle } from '../../../types';

interface NewsTabProps {
  news: NewsArticle[];
  onAddNews: () => void;
  onDeleteNews: (id: string) => void;
  onViewPublicPage: () => void;
}

export const NewsTab: React.FC<NewsTabProps> = ({
  news,
  onAddNews,
  onDeleteNews,
  onViewPublicPage
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'featured' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [sortBy, setSortBy] = useState('Sort by Newest');
  const [selectedNewsIds, setSelectedNewsIds] = useState<string[]>([]);
  const [featuredMap, setFeaturedMap] = useState<Record<string, boolean>>({
    'n1': true,
    'n3': true,
    'n5': true
  });

  const initialNewsItems = [
    {
      id: 'n1',
      title: 'ময়মনসিংহে নতুন সেতুর কাজ শুরু হচ্ছে আগামী মাসে',
      category: 'Development',
      author: 'Mehedi Hasan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      views: '3,420',
      status: 'Published',
      publishedAt: '26 Sep 2026, 10:30 AM',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n2',
      title: 'মুক্তাগাছায় ফ্রি মেডিকেল ক্যাম্প অনুষ্ঠিত',
      category: 'Health',
      author: 'Tanvir Ahmed',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      views: '2,850',
      status: 'Published',
      publishedAt: '25 Sep 2026, 4:15 PM',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n3',
      title: 'ময়মনসিংহে শিক্ষার্থীদের জন্য নতুন উদ্যোগ',
      category: 'Education',
      author: 'Nusrat Jahan',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
      views: '1,920',
      status: 'Published',
      publishedAt: '24 Sep 2026, 2:20 PM',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n4',
      title: 'ভারী বৃষ্টিতে ময়মনসিংহের নিম্নাঞ্চলে জলাবদ্ধতা',
      category: 'Environment',
      author: 'Arif Hossain',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      views: '1,640',
      status: 'Published',
      publishedAt: '23 Sep 2026, 11:10 AM',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n5',
      title: 'ত্রিশালে ঐতিহ্যবাহী নৌকা বাইচ প্রতিযোগিতা অনুষ্ঠিত',
      category: 'Culture',
      author: 'Faria Islam',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      views: '1,380',
      status: 'Published',
      publishedAt: '22 Sep 2026, 6:45 PM',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n6',
      title: 'ময়মনসিংহে ট্রাফিক ব্যবস্থায় নতুন নির্দেশনা',
      category: 'Crime',
      author: 'Hasan Mahmud',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      views: '1,120',
      status: 'Published',
      publishedAt: '21 Sep 2026, 1:30 PM',
      image: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n7',
      title: 'ময়মনসিংহ জেলা দল জয় পেল বিভাগীয় ম্যাচে',
      category: 'Sports',
      author: 'Imran Hossain',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
      views: '980',
      status: 'Pending',
      publishedAt: '20 Sep 2026, 9:20 AM',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n8',
      title: 'মুক্তাগাছা বাজারে নিত্যপণ্যের দামে স্বস্তি',
      category: 'Economy',
      author: 'Samiha Rahman',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      views: '870',
      status: 'Published',
      publishedAt: '19 Sep 2026, 5:10 PM',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n9',
      title: 'ময়মনসিংহে বইমেলা উদ্বোধন আগামী সপ্তাহে',
      category: 'Event',
      author: 'Rakibul Hasan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      views: '760',
      status: 'Draft',
      publishedAt: '18 Sep 2026, 3:40 PM',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'n10',
      title: 'জেলায় তাপমাত্রা কমার সম্ভাবনা, হতে পারে বৃষ্টি',
      category: 'Weather',
      author: 'Labiba Ahmed',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      views: '642',
      status: 'Published',
      publishedAt: '17 Sep 2026, 12:15 PM',
      image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=120&q=80'
    }
  ];

  // Merge context news with initial news if available
  const displayNews = news.length > 0 ? news.map((item, idx) => ({
    id: item.id,
    title: item.title,
    category: item.category || 'Development',
    author: 'Mehedi Hasan',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    views: '1,240',
    status: idx === 1 ? 'Pending' : idx === 2 ? 'Draft' : 'Published',
    publishedAt: item.date || '26 Sep 2026',
    image: item.image_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80'
  })) : initialNewsItems;

  const toggleFeatured = (id: string) => {
    setFeaturedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    if (selectedNewsIds.length === displayNews.length) {
      setSelectedNewsIds([]);
    } else {
      setSelectedNewsIds(displayNews.map(n => n.id));
    }
  };

  const toggleSelectNews = (id: string) => {
    if (selectedNewsIds.includes(id)) {
      setSelectedNewsIds(selectedNewsIds.filter(i => i !== id));
    } else {
      setSelectedNewsIds([...selectedNewsIds, id]);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Development':
        return 'bg-blue-50 text-blue-600';
      case 'Health':
        return 'bg-rose-50 text-rose-600';
      case 'Education':
        return 'bg-purple-50 text-purple-600';
      case 'Environment':
        return 'bg-emerald-50 text-emerald-600';
      case 'Culture':
        return 'bg-amber-50 text-amber-600';
      case 'Crime':
        return 'bg-red-50 text-red-600';
      case 'Sports':
        return 'bg-sky-50 text-sky-600';
      case 'Economy':
        return 'bg-teal-50 text-teal-600';
      case 'Event':
        return 'bg-indigo-50 text-indigo-600';
      case 'Weather':
        return 'bg-cyan-50 text-cyan-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const newsCategoryStats = [
    { name: 'Development', count: 48, color: 'bg-emerald-500', width: '80%' },
    { name: 'Education', count: 42, color: 'bg-pink-500', width: '70%' },
    { name: 'Health', count: 36, color: 'bg-purple-500', width: '60%' },
    { name: 'Sports', count: 28, color: 'bg-blue-400', width: '50%' },
    { name: 'Culture/Economy', count: 22, color: 'bg-amber-400', width: '40%' },
    { name: 'Crime', count: 18, color: 'bg-red-500', width: '30%' },
    { name: 'Environment', count: 16, color: 'bg-teal-500', width: '25%' },
    { name: 'Event', count: 12, color: 'bg-indigo-500', width: '20%' },
    { name: 'Weather', count: 10, color: 'bg-sky-500', width: '15%' }
  ];

  const recentComments = [
    {
      name: 'Rafiq Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      time: '2 minutes ago',
      comment: 'খুব ভালো উদ্যোগ। ময়মনসিংহের জন্য দরকার ছিল এমন একটি প্ল্যাটফর্ম।'
    },
    {
      name: 'Jannatul Ferdous',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      time: '15 minutes ago',
      comment: 'আরও বিস্তারিত তথ্য দিলে ভালো হতো।'
    },
    {
      name: 'Sabbir Hossain',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      time: '1 hour ago',
      comment: 'আগামীতেও এমন আয়োজন নিয়মিত হওয়া উচিত।'
    },
    {
      name: 'Mim Akter',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
      time: '2 hours ago',
      comment: 'Great news! 👏'
    },
    {
      name: 'Karim Uddin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      time: '3 hours ago',
      comment: 'স্থানীয় মানুষের জীবনমানে নিশ্চিত উন্নয়ন হবে আশা করছি।'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">News</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                News Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Create, edit and manage news articles, categories and comments.
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
              onClick={onAddNews}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add News</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total News */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total News</div>
            <div className="text-2xl font-black text-slate-900 mt-1">248</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+26 this month</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 28%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Views</div>
            <div className="text-2xl font-black text-slate-900 mt-1">48,320</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+10,562 this month</div>
          </div>
        </div>

        {/* Total Comments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 18%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Comments</div>
            <div className="text-2xl font-black text-slate-900 mt-1">1,842</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+276 this month</div>
          </div>
        </div>

        {/* Featured News */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 9%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Featured News</div>
            <div className="text-2xl font-black text-slate-900 mt-1">12</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">+2 this month</div>
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
            placeholder="Search news title, content..."
            className="w-full text-xs pl-3 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Categories</option>
          <option>Development</option>
          <option>Health</option>
          <option>Education</option>
          <option>Environment</option>
          <option>Culture</option>
          <option>Crime</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Status</option>
          <option>Published</option>
          <option>Pending</option>
          <option>Draft</option>
        </select>

        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Authors</option>
          <option>Mehedi Hasan</option>
          <option>Tanvir Ahmed</option>
          <option>Nusrat Jahan</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>Sort by Newest</option>
          <option>Sort by Views</option>
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
            setSelectedStatus('All Status');
            setSelectedAuthor('All Authors');
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
                All News (248)
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'published'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Published (218)
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'draft'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Draft (12)
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'scheduled'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Scheduled (8)
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'featured'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Featured (12)
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'trash'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Trash (3)
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
                      checked={selectedNewsIds.length === displayNews.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Image</th>
                  <th className="pb-3 px-3">Title</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-3">Author</th>
                  <th className="pb-3 px-2">Views</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Featured</th>
                  <th className="pb-3 px-3">Published At</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayNews.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedNewsIds.includes(item.id)}
                        onChange={() => toggleSelectNews(item.id)}
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
                    <td className="py-3 px-3 font-bold text-slate-900 line-clamp-1 max-w-[170px]">
                      {item.title}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadge(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={item.authorAvatar}
                          alt={item.author}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-semibold text-slate-800 truncate">
                          {item.author}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-700">{item.views}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : item.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className="cursor-pointer transition-transform active:scale-125"
                      >
                        {featuredMap[item.id] ? (
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                      {item.publishedAt}
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
                          onClick={() => onDeleteNews(item.id)}
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
              Showing 1 to 10 of 248 news articles
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
                25
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: News Categories & Recent Comments */}
        <div className="lg:col-span-4 space-y-5">
          {/* News Categories */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">News Categories</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-2.5">
              {newsCategoryStats.map((cat) => (
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

          {/* Recent Comments */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-slate-900 text-sm">Recent Comments</span>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">View All</span>
            </div>

            <div className="space-y-3.5">
              {recentComments.map((com, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={com.avatar}
                    alt={com.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">{com.name}</span>
                      <span className="text-[10px] text-slate-400">{com.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2 leading-tight">
                      {com.comment}
                    </p>
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
