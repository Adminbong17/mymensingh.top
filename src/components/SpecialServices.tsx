import React from 'react';
import { Droplets, GraduationCap, Home, ChevronRight } from 'lucide-react';

interface SpecialServicesProps {
  onSelectService: (service: 'blood-bank' | 'tuition-media' | 'to-let') => void;
}

export const SpecialServices: React.FC<SpecialServicesProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'blood-bank' as const,
      title: 'Blood Bank',
      titleBn: 'রক্তদাতা ও রক্ত ব্যাংক খুঁজুন',
      icon: <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-white shrink-0" />,
      bgClass: 'bg-[#D92534] hover:bg-[#C91827] shadow-red-500/20',
    },
    {
      id: 'tuition-media' as const,
      title: 'Tuition Media',
      titleBn: 'শিক্ষক, কোচিং ও টিউশন খুঁজুন',
      icon: <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white shrink-0" />,
      bgClass: 'bg-[#6342E8] hover:bg-[#5332D8] shadow-indigo-500/20',
    },
    {
      id: 'to-let' as const,
      title: 'To Let',
      titleBn: 'বাসা, রুম, অফিস ভাড়া খুঁজুন',
      icon: <Home className="w-7 h-7 sm:w-8 sm:h-8 text-white shrink-0" />,
      bgClass: 'bg-[#FF6A1A] hover:bg-[#EE5909] shadow-orange-500/20',
    },
  ];

  return (
    <section className="pt-6 pb-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {services.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => onSelectService(srv.id)}
              className={`group flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl ${srv.bgClass} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-left w-full border border-white/10`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="shrink-0 p-0.5">
                  {srv.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/90 font-medium truncate mt-0.5">
                    {srv.titleBn}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
