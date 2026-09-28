import React from 'react';
import { Droplets, GraduationCap, Home, ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

interface SpecialServicesProps {
  onSelectService: (service: 'blood-bank' | 'tuition-media' | 'to-let') => void;
}

export const SpecialServices: React.FC<SpecialServicesProps> = ({ onSelectService }) => {
  const { bloodDonors, tuitionListings, toLetListings } = useData();

  const services = [
    {
      id: 'blood-bank' as const,
      colorTheme: 'red',
      badge: 'জরুরি সেবা',
      title: 'Blood Bank',
      titleBn: 'ব্লাড ব্যাংক ময়মনসিংহ',
      desc: 'জরুরি মুহূর্তে ময়মনসিংহের সকল ব্লাড গ্রুপের স্বেচ্ছাসেবী রক্তদাতাদের সরাসরি ফোন নম্বর ও সন্ধান।',
      icon: <Droplets className="w-8 h-8 text-white" />,
      gradient: 'from-red-600 via-rose-600 to-red-700',
      shadow: 'shadow-red-500/25',
      stat: bloodDonors.length > 0 ? `${bloodDonors.length} জন নিবন্ধিত রক্তদাতা` : 'রক্তদাতা ডিরেক্টরি',
      actionText: 'রক্তদাতা খুঁজুন',
    },
    {
      id: 'tuition-media' as const,
      colorTheme: 'purple',
      badge: 'শিক্ষা ও ক্যারিয়ার',
      title: 'Tuition Media',
      titleBn: 'টিউশন মিডিয়া',
      desc: 'বাকৃবি ও আনন্দ মোহন কলেজের দক্ষ হোম টিউটর খুঁজুন অথবা শিক্ষক হিসেবে নতুন টিউশন গ্রহণ করুন।',
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      gradient: 'from-purple-600 via-indigo-600 to-purple-800',
      shadow: 'shadow-purple-500/25',
      stat: tuitionListings.length > 0 ? `${tuitionListings.length}টি সক্রিয় টিউশন ও শিক্ষক` : 'টিউশন সার্ভিস',
      actionText: 'টিউশন ব্রাউজ করুন',
    },
    {
      id: 'to-let' as const,
      colorTheme: 'orange',
      badge: 'আবাসন ও মেস',
      title: 'To Let',
      titleBn: 'বাসা ভাড়া / টু-লেট',
      desc: 'চরপাড়া, সাঙ্কিাপাড়া, টাউন হল সহ ময়মনসিংহ শহরের ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস ও সাবলেট সন্ধান।',
      icon: <Home className="w-8 h-8 text-white" />,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      shadow: 'shadow-orange-500/25',
      stat: toLetListings.length > 0 ? `${toLetListings.length}টি ভাড়ার বিজ্ঞাপন` : 'টু-লেট সার্ভিস',
      actionText: 'বাসা ভাড়া দেখুন',
    },
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              বিশেষ জরুরি ও নাগরিক সেবাসমূহ
            </h2>
          </div>
        </div>

        {/* 3 Big Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectService(srv.id)}
              className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${srv.gradient} text-white shadow-xl ${srv.shadow} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px] border border-white/20`}
            >
              {/* Background ambient bubble */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
                    {srv.icon}
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                    {srv.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black tracking-tight text-white group-hover:translate-x-1 transition-transform">
                    {srv.title}
                  </h3>
                  <div className="text-sm font-bold text-white/90">
                    {srv.titleBn}
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
                    {srv.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-white/90">
                  {srv.stat}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-slate-900 px-4 py-2 rounded-xl group-hover:bg-slate-100 transition-colors shadow-md">
                  <span>{srv.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
