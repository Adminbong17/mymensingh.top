import React, { useState } from 'react';
import {
  X,
  Droplets,
  GraduationCap,
  Home,
  Phone,
  MapPin
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface SpecialServicesModalProps {
  activeService: 'blood-bank' | 'tuition-media' | 'to-let' | null;
  onClose: () => void;
}

export const SpecialServicesModal: React.FC<SpecialServicesModalProps> = ({
  activeService,
  onClose,
}) => {
  const { bloodDonors, tuitionListings, toLetListings } = useData();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedToLetType, setSelectedToLetType] = useState<string>('all');

  if (!activeService) return null;

  const filteredDonors = bloodDonors.filter(
    (d) => selectedBloodGroup === 'all' || d.blood_group === selectedBloodGroup
  );

  const filteredToLet = toLetListings.filter(
    (l) => selectedToLetType === 'all' || l.type === selectedToLetType
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className={`px-6 py-4 text-white flex items-center justify-between ${
          activeService === 'blood-bank'
            ? 'bg-red-600'
            : activeService === 'tuition-media'
            ? 'bg-purple-700'
            : 'bg-amber-600'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              {activeService === 'blood-bank' && <Droplets className="w-5 h-5" />}
              {activeService === 'tuition-media' && <GraduationCap className="w-5 h-5" />}
              {activeService === 'to-let' && <Home className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {activeService === 'blood-bank' && '🔴 ময়মনসিংহ ব্লাড ব্যাংক ও ডোনার ডিরেক্টরি'}
                {activeService === 'tuition-media' && '🟣 টিউশন মিডিয়া ময়মনসিংহ'}
                {activeService === 'to-let' && '🟠 বাসা ভাড়া / টু-লেট ডিরেক্টরি'}
              </h3>
              <p className="text-xs text-white/80">
                {activeService === 'blood-bank' && 'সরাসরি রক্তদাতাদের সাথে যোগাযোগ করুন'}
                {activeService === 'tuition-media' && 'দক্ষ গৃহশিক্ষক ও শিক্ষার্থী সংযোগ'}
                {activeService === 'to-let' && 'ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস ও সাবলেট'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          
          {/* 1. BLOOD BANK CONTENT */}
          {activeService === 'blood-bank' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b">
                <span className="text-xs font-bold text-slate-500 mr-2">ব্লাড গ্রুপ:</span>
                {['all', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedBloodGroup === bg
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {bg === 'all' ? 'সকল গ্রুপ' : bg}
                  </button>
                ))}
              </div>

              {filteredDonors.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-2">
                  <Droplets className="w-8 h-8 text-red-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">বর্তমানে কোনো রক্তদাতার তথ্য তালিকাভুক্ত নেই</p>
                  <p className="text-xs text-slate-400">রক্তদাতা হিসেবে নিবন্ধন করতে বা সেবা যুক্ত করতে যোগাযোগ করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDonors.map((donor) => (
                    <div
                      key={donor.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 font-black text-lg flex items-center justify-center border border-red-200 shrink-0">
                          {donor.blood_group}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{donor.name}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{donor.upazila}</span>
                          </p>
                          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                            ● {donor.availability}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${donor.phone}`}
                        className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors shrink-0"
                        title="Call Donor"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. TUITION MEDIA CONTENT */}
          {activeService === 'tuition-media' && (
            <div className="space-y-4">
              {tuitionListings.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-2">
                  <GraduationCap className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">বর্তমানে কোনো সক্রিয় টিউশন অফার নেই</p>
                  <p className="text-xs text-slate-400">গৃহশিক্ষক নিয়োগ বা শিক্ষক হিসেবে লিস্টিং দিতে যোগাযোগ করুন।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tuitionListings.map((tuition) => (
                    <div
                      key={tuition.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                            {tuition.class_level}
                          </span>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {tuition.salary}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{tuition.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{tuition.location} • {tuition.days_per_week}</span>
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tuition.subjects.map((sub, i) => (
                            <span key={i} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={`tel:${tuition.phone}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>যোগাযোগ করুন</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. TO-LET CONTENT */}
          {activeService === 'to-let' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <span className="text-xs font-bold text-slate-500 mr-2">ধরন:</span>
                {['all', 'Family', 'Bachelor', 'Sublet'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedToLetType(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedToLetType === t
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'all' ? 'সকল বাসা' : t}
                  </button>
                ))}
              </div>

              {filteredToLet.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-2">
                  <Home className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">বর্তমানে কোনো বাসা ভাড়ার বিজ্ঞাপন নেই</p>
                  <p className="text-xs text-slate-400">ফ্ল্যাট, ব্যাচেলর মেস বা সাবলেটের নতুন বিজ্ঞাপন যুক্ত হলে এখানে দেখতে পাবেন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredToLet.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                            {item.type}
                          </span>
                          <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl text-xs font-black bg-black/70 text-white backdrop-blur-md">
                            {item.rent}
                          </span>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.area}</span>
                          </p>
                          <div className="text-[11px] text-slate-600 font-semibold">
                            {item.bedrooms} বেডরুম • {item.bathrooms} বাথরুম
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <a
                          href={`tel:${item.phone}`}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>মালিকের সাথে কল করুন</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
