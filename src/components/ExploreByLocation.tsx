import React, { useState } from 'react';
import { Search, Compass, Building } from 'lucide-react';
import {
  DIVISION_DISTRICTS,
  DISTRICT_UPAZILAS_MAP,
  ALL_DIVISION_UPAZILAS,
  MYMENSINGH_UNIONS_MAP
} from '../data/initialData';

interface ExploreByLocationProps {
  onSelectArea: (upazila: string, union?: string) => void;
}

export const ExploreByLocation: React.FC<ExploreByLocationProps> = ({ onSelectArea }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');

  const quickAreas = [
    'ময়মনসিংহ সদর',
    'জামালপুর সদর',
    'শেরপুর সদর',
    'নেত্রকোণা সদর',
    'মুক্তাগাছা',
    'ত্রিশাল',
    'সরিষাবাড়ী',
    'নালিতাবাড়ী',
    'দুর্গাপুর',
    'ভালুকা'
  ];

  const availableUpazilas = selectedDistrict
    ? (DISTRICT_UPAZILAS_MAP[selectedDistrict] || [])
    : ALL_DIVISION_UPAZILAS;

  const unions = selectedUpazila ? (MYMENSINGH_UNIONS_MAP[selectedUpazila] || []) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUpazila) {
      onSelectArea(selectedUpazila, selectedUnion);
    }
  };

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Geo Search • ময়মনসিংহ বিভাগ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore by Location
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ময়মনসিংহ বিভাগের ৪টি জেলা (ময়মনসিংহ, জামালপুর, শেরপুর, নেত্রকোণা) ও ৩৫টি উপজেলার সেবা খুঁজুন
          </p>
        </div>

        {/* Location Form Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* জেলা */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জেলা
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedUpazila('');
                    setSelectedUnion('');
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white font-medium"
                >
                  <option value="">সকল জেলা (বিভাগ)</option>
                  {DIVISION_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* উপজেলা */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উপজেলা *
                </label>
                <select
                  required
                  value={selectedUpazila}
                  onChange={(e) => {
                    setSelectedUpazila(e.target.value);
                    setSelectedUnion('');
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white font-medium"
                >
                  <option value="">উপজেলা নির্বাচন করুন ({availableUpazilas.length}টি)</option>
                  {availableUpazilas.map((up) => (
                    <option key={up} value={up}>
                      {up}
                    </option>
                  ))}
                </select>
              </div>

              {/* ইউনিয়ন / সিটি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইউনিয়ন / সিটি
                </label>
                <select
                  value={selectedUnion}
                  onChange={(e) => setSelectedUnion(e.target.value)}
                  disabled={!selectedUpazila}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white font-medium disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">সকল ইউনিয়ন / ওয়ার্ড</option>
                  {unions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>এলাকা অনুযায়ী খুঁজুন</span>
            </button>
          </form>

          {/* Quick Area Badges */}
          <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Quick Areas:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => onSelectArea(area)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1.5"
                >
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{area}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
