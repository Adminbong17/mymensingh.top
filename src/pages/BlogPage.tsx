import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  X
} from 'lucide-react';
import { INITIAL_BLOG_POSTS } from '../data/blogData';
import type { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const [blogs] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  const categories = ['All', 'খাবার ও ঐতিহ্য', 'ভ্রমণ গাইড', 'শিক্ষা ও প্রকৃতি', 'আবাসন ও টু-লেট'];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Blog Hero */}
        <div className="bg-gradient-to-r from-teal-950 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mymensingh City Blog & Guides</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              ময়মনসিংহ ব্লগে আপনাকে স্বাগতম
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              শহরের শতবর্ষী ইতিহাস, মুক্তাগাছার মণ্ডা ও ঐতিহ্যবাহী মিষ্টির গল্প, একদিনের ভ্রমণ গাইড এবং নাগরিক জীবনের খুঁটিনাটি নিয়ে আমাদের বিশেষ আয়োজন।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Category Filter Pills */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'সকল ব্লগ' : cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            মোট <strong>{filteredBlogs.length}টি আর্টিকেল</strong>
          </span>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveBlog(post)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={post.image_url}
                    alt={post.title_bn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.read_time}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {post.title_bn}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author & Read More Bar */}
              <div className="p-5 px-6 sm:px-7 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {post.author_avatar ? (
                    <img
                      src={post.author_avatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-bold text-slate-800">{post.author}</span>
                    <span className="text-[10px] text-slate-400">লেখক ও গবেষক</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  পড়ুন <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blog Detail Reader Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
            <div className="relative aspect-16/9 bg-slate-100 shrink-0">
              <img
                src={activeBlog.image_url}
                alt={activeBlog.title_bn}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveBlog(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-md">
                  {activeBlog.category}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">লেখক: {activeBlog.author}</span>
                  <span>•</span>
                  <span>{activeBlog.date}</span>
                  <span>•</span>
                  <span>{activeBlog.read_time}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('ব্লগের লিংক কপি করা হয়েছে!');
                  }}
                  className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>শেয়ার করুন</span>
                </button>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {activeBlog.title_bn}
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {activeBlog.title}
                </p>
              </div>

              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 pt-2">
                {activeBlog.content.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-400 block mb-2">ট্যাগসমূহ:</span>
                <div className="flex flex-wrap gap-2">
                  {activeBlog.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
