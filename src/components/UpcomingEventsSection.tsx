import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { EventItem } from '../types';

interface UpcomingEventsSectionProps {
  events: EventItem[];
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events }) => {
  return (
    <section id="events" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Happening in Mymensingh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Upcoming Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহের আসন্ন বইমেলা, সাংস্কৃতিক উৎসব ও ফুড কার্নিভাল
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {events.length > 0 ? `${events.length}টি বিশেষ আয়োজন` : 'আসন্ন ইভেন্ট'}
          </span>
        </div>

        {/* Events Grid or Empty State */}
        {events.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              বর্তমানে কোনো আসন্ন ইভেন্ট তালিকাভুক্ত নেই
            </h3>
            <p className="text-xs text-slate-500">
              নতুন মেলা, উৎসব বা আয়োজনের শিডিউল যুক্ত হলে এখানে সরাসরি দেখতে পাবেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={evt.image_url}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                        {evt.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-900 shadow-md">
                        {evt.entry_fee}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">
                        {evt.title_bn}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => alert(`ইভেন্ট: ${evt.title}\nস্থান: ${evt.venue}\nসময়সূচি: ${evt.date}`)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>অংশগ্রহণ করুন / Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
