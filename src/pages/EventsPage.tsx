import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Sparkles,
  X,
  PlusCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { EventItem } from '../types';

export const EventsPage: React.FC = () => {
  const { events } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');

  const categories = ['All', 'Literature & Culture', 'Arts & Drama', 'Food Carnival', 'Education & Tech'];

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpPhone) return;
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setActiveEvent(null);
      setRsvpName('');
      setRsvpPhone('');
    }, 2500);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Events Hero */}
        <div className="bg-gradient-to-r from-amber-950 via-orange-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>City Happenings & Fests</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              ময়মনসিংহের আসন্ন ইভেন্ট ও উৎসব
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              বইমেলা, সাংস্কৃতিক উৎসব, নাট্যোৎসব, ফুড কার্নিভাল কিংবা কর্মশালা—ময়মনসিংহে কী ঘটছে জানুন সবার আগে।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter Pills */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'সকল ইভেন্ট' : cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            মোট <strong>{filteredEvents.length}টি ইভেন্ট</strong> পাওয়া গেছে
          </span>
        </div>

        {/* Events Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো ইভেন্ট পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-400 mt-1">অন্য কোনো ক্যাটাগরি ফিল্টার করে দেখুন অথবা নতুন ইভেন্ট যুক্ত করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setActiveEvent(evt)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={evt.image_url}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{evt.category}</span>
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {evt.entry_fee}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{evt.date}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                      {evt.title_bn}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 -mt-1">
                      {evt.title}
                    </p>

                    <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="line-clamp-1">{evt.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 group-hover:underline">
                    বিস্তারিত ও নিবন্ধন →
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>ওপেন ফর অল</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Event Banner */}
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-950">
                আপনি কি কোনো ইভেন্ট বা কর্মশালা আয়োজন করছেন?
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Mymensingh.top-এ বিনামূল্যে আপনার ইভেন্টের প্রচারণা চালান এবং হাজারো দর্শকের কাছে পৌঁছে যান।
              </p>
            </div>
          </div>
          <a
            href="mailto:events@mymensingh.top"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            + ইভেন্ট যোগ করুন
          </a>
        </div>
      </div>

      {/* Event Details & RSVP Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
            <div className="relative aspect-16/9 bg-slate-100 shrink-0">
              <img
                src={activeEvent.image_url}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white shadow-md">
                  {activeEvent.category}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeEvent.title_bn}
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  {activeEvent.title}
                </p>
              </div>

              {/* Event Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">তারিখ</span>
                    <span>{activeEvent.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">সময়সূচি</span>
                    <span>{activeEvent.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">স্থান / ভেন্যু</span>
                    <span>{activeEvent.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">প্রবেশ ফি</span>
                    <span>{activeEvent.entry_fee}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">ইভেন্ট বিবরণী:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>

              {/* RSVP Form */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>বিনামূল্যে সিট বুকিং বা অংশগ্রহণ নিশ্চিত করুন (RSVP)</span>
                </h4>

                {rsvpSuccess ? (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ধন্যবাদ! আপনার অংশগ্রহণ সংরক্ষিত হয়েছে। আমরা আপনাকে এসএমএস পাঠাবো।</span>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="আপনার নাম..."
                      className="text-xs px-3 py-2 rounded-xl border border-amber-200 bg-white outline-hidden focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      required
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="মোবাইল নম্বর (০১৭১১...)"
                      className="text-xs px-3 py-2 rounded-xl border border-amber-200 bg-white outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="sm:col-span-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      নিশ্চিত করুন (Confirm RSVP)
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
