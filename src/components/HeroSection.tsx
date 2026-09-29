import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Building2 } from 'lucide-react';
import { MYMENSINGH_UPAZILAS, MYMENSINGH_UNIONS_MAP } from '../data/initialData';

interface HeroSectionProps {
  onSearch: (params: { keyword: string; district: string; upazila: string; unionWard: string }) => void;
  onQuickCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onQuickCategory }) => {
  const [keyword, setKeyword] = useState('');
  const [district] = useState('ময়মনসিংহ');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');

  const unions = selectedUpazila ? (MYMENSINGH_UNIONS_MAP[selectedUpazila] || []) : [];

  const handleUpazilaChange = (up: string) => {
    setSelectedUpazila(up);
    setSelectedUnion('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword,
      district,
      upazila: selectedUpazila,
      unionWard: selectedUnion,
    });
  };

  const popularSearches = [
    { label: 'হাসপাতাল', query: 'hospitals' },
    { label: 'রেস্টুরেন্ট', query: 'restaurants' },
    { label: 'ফার্মেসি', query: 'pharmacy' },
    { label: 'বাসা ভাড়া', query: 'to-let' },
    { label: 'টিউশন', query: 'tuition-media' },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 sm:pt-20 sm:pb-28 px-3 sm:px-6 lg:px-8 w-full max-w-full">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-4 sm:space-y-8">
        
        {/* Badge: Discover Mymensingh */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Discover Mymensingh</span>
        </div>

        {/* Main Heading: আমার শহর, আমাদের গাইড */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight break-words px-1">
          আমার শহর,{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            আমাদের গাইড
          </span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
          ময়মনসিংহ শহরের প্রতিটি ব্যবসা, জরুরি সেবা, হাসপাতাল, রেস্টুরেন্ট, বাসা ভাড়া এবং শিক্ষা সংক্রান্ত তথ্যের সবচেয়ে নির্ভরযোগ্য ও সর্ববৃহৎ ডিজিটাল ডিরেক্টরি।
        </p>

        {/* Big Search Box Container */}
        <div className="pt-2 w-full max-w-5xl xl:max-w-6xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-2xl border border-white/20 text-slate-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
              
              {/* Field 1: কী খুঁজছেন (Keyword) */}
              <div className="lg:col-span-4 col-span-1 sm:col-span-2 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  কী খুঁজছেন?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="ব্যবসা, সেবা বা ডাক্তার..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-hidden placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Field 2: জেলা (District) */}
              <div className="lg:col-span-2 col-span-1 text-left bg-slate-50 rounded-2xl p-2.5 px-3 border border-slate-200/70 flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  জেলা
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <select
                    disabled
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 outline-hidden cursor-not-allowed"
                  >
                    <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                  </select>
                </div>
              </div>

              {/* Field 3: উপজেলা (Upazila) */}
              <div className="lg:col-span-2 col-span-1 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  উপজেলা
                </label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <select
                    value={selectedUpazila}
                    onChange={(e) => handleUpazilaChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="">সকল উপজেলা</option>
                    {MYMENSINGH_UPAZILAS.map((up) => (
                      <option key={up} value={up}>
                        {up}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 4: ইউনিয়ন / সিটি (Union/City) */}
              <div className="lg:col-span-2 col-span-1 text-left bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-2.5 px-3 border border-slate-200/70 transition-colors flex flex-col justify-center">
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  ইউনিয়ন / সিটি
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <select
                    value={selectedUnion}
                    onChange={(e) => setSelectedUnion(e.target.value)}
                    disabled={!selectedUpazila}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-hidden cursor-pointer disabled:text-slate-400 truncate"
                  >
                    <option value="" className="truncate">
                      {selectedUpazila ? 'সকল ইউনিয়ন / ওয়ার্ড' : 'উপজেলা নির্বাচন'}
                    </option>
                    {unions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5: Action Submit Button */}
              <div className="lg:col-span-2 col-span-1 sm:col-span-2 lg:col-auto flex items-stretch">
                <button
                  type="submit"
                  className="w-full h-full min-h-[50px] sm:min-h-[54px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md sm:shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>সন্ধান করুন</span>
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">
            জনপ্রিয় অনুসন্ধান:
          </span>
          {popularSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickCategory(item.query)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all hover:scale-105"
            >
              #{item.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
