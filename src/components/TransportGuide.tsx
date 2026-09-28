import React from 'react';
import { Train, Bus, Compass, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const TransportGuide: React.FC = () => {
  const { language } = useLanguage();
  const { trainSchedules } = useData();

  const busTerminals = [
    {
      name_en: 'Maskanda Inter-District Bus Terminal',
      name_bn: 'মাসকান্দা আন্তঃজেলা বাস টার্মিনাল',
      route_en: 'Direct AC/Non-AC coaches to Dhaka (Mohakhali), Gazipur, and Chittagong. Principal operators: Ena Transport, Shoukhin, Shamoli.',
      route_bn: 'ঢাকা (মহাখালী), গাজীপুর ও চট্টগ্রামগামী বিলাসবহুল এসি ও নন-এসি চেয়ার কোচ। প্রধান বাস: এনা ট্রান্সপোর্ট, শৌখিন, শ্যামলী।',
      timing_en: 'Buses depart every 10–15 minutes from 5:30 AM to 10:00 PM.',
      timing_bn: 'সকাল ৫:৩০ থেকে রাত ১০:০০ পর্যন্ত প্রতি ১০–১৫ মিনিট পর পর বাস ছেড়ে যায়।',
    },
    {
      name_en: 'Brahmaputra Bridge / Patgudam Bus Stand',
      name_bn: 'পাটগুদাম ও ব্রহ্মপুত্র সেতু বাস টার্মিনাল',
      route_en: 'Buses to Netrokona, Birishiri (Susang Durgapur), Kishoreganj, Sherpur, and Jamalpur.',
      route_bn: 'নেত্রকোণা, বিরিশিরি (সুসং দুর্গাপুর), কিশোরগঞ্জ, শেরপুর ও জামালপুরগামী বাস ও লোকাল পরিবহন।',
      timing_en: 'Frequent daytime services.',
      timing_bn: 'সারাদিন নিয়মিত পরিবহন সেবা চালু থাকে।',
    },
  ];

  const localTransitTips = [
    {
      mode_en: 'Battery Easy-Bike / Auto Rickshaw',
      mode_bn: 'ব্যাটারিচালিত ইজি-বাইক / অটো রিকশা',
      details_en: 'Primary mode of city commute. Standard shared fare within town: BDT 10 - 20 per person.',
      details_bn: 'ময়মনসিংহ শহরের প্রধান বাহন। শহরের এক প্রান্ত থেকে অন্য প্রান্তে শেয়ার্ড ভাড়া মাত্র ১০ থেকে ২০ টাকা।',
    },
    {
      mode_en: 'Traditional Pedal Rickshaw',
      mode_bn: 'ঐতিহ্যবাহী প্যাডেল রিকশা',
      details_en: 'Best for narrow alleys of Ganginar Par, Chotto Bazar, and leisurely evening rides along Park Road.',
      details_bn: 'গাঙ্গিনার পাড়, ছোট বাজার এবং পার্ক রোডে ব্রহ্মপুত্রের হিমেল বাতাসে ঘুরে বেড়ানোর জন্য সবচেয়ে মনোরম বাহন।',
    },
    {
      mode_en: 'Brahmaputra Country Boat (Nouka)',
      mode_bn: 'ব্রহ্মপুত্র নদের ইঞ্জিন ও হস্তচালিত নৌকা',
      details_en: 'Available at Zainul Abedin Park Ghat & Patgudam Ghat. River sunset tours BDT 150 - 300 / hour (reserved).',
      details_bn: 'জয়নুল আবেদিন পার্ক ঘাট ও পাটগুদাম ঘাটে নৌকা পাওয়া যায়। সূর্যাস্ত দেখতে ১ ঘণ্টার রিজার্ভ নৌকা ভাড়া ১৫০ থেকে ৩০০ টাকা।',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold mb-3 border border-white/10">
            <Train className="w-3.5 h-3.5 text-blue-300" />
            <span>{language === 'bn' ? 'যাতায়াত ও ট্রেন নির্দেশিকা' : 'Mymensingh Transit & Railway Guide'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'bn' ? 'ঢাকা – ময়মনসিংহ যোগাযোগ ও রেল শিডিউল' : 'Dhaka – Mymensingh Transit & Timetable'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            {language === 'bn'
              ? 'ময়মনসিংহ রেলওয়ে স্টেশনের প্রধান আন্তঃনগর ট্রেন সময়সূচি, বাস টার্মিনাল এবং স্থানীয় অটোরিকশা ও নৌকা ভ্রমণের তথ্য।'
              : 'Official intercity railway timetable between Kamalapur/Dhaka Cantonment and Mymensingh Junction, plus highway bus terminal guides.'}
          </p>
        </div>
      </div>

      {/* Train Schedule Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'আন্তঃনগর ট্রেনের সময়সূচি' : 'Intercity Express Trains'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'ময়মনসিংহ রেলওয়ে জংশন' : 'Mymensingh Railway Junction'}
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3">{language === 'bn' ? 'ট্রেনের নাম' : 'Train Name'}</th>
                <th className="py-3 px-3">{language === 'bn' ? 'রুট' : 'Route'}</th>
                <th className="py-3 px-3">{language === 'bn' ? 'ছাড়ার সময়' : 'Departure'}</th>
                <th className="py-3 px-3">{language === 'bn' ? 'পৌঁছানোর সময়' : 'Arrival'}</th>
                <th className="py-3 px-3">{language === 'bn' ? 'ছুটির দিন' : 'Off Day'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainSchedules.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                    <div>{language === 'bn' ? tr.train_name_bn : tr.train_name_en}</div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                      #{tr.train_number}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {language === 'bn' ? tr.route_bn : tr.route_en}
                  </td>
                  <td className="py-3.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {tr.departure_time}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                    {tr.arrival_time}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {language === 'bn' ? tr.off_day_bn : tr.off_day_en}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {language === 'bn'
              ? 'টিকেট সংগ্রহের জন্য বাংলাদেশ রেলওয়ের অফিসিয়াল ওয়েবসাইট (eticket.railway.gov.bd) অথবা ময়মনসিংহ রেলওয়ে স্টেশনের কাউন্টারে যোগাযোগ করুন।'
              : 'Railway tickets can be booked online at eticket.railway.gov.bd or purchased at Mymensingh Railway Station counters.'}
          </span>
        </div>
      </div>

      {/* Highway Bus Stations */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'প্রধান বাস টার্মিনালসমূহ' : 'Key Bus Terminals'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'আন্তঃজেলা ও আঞ্চলিক যোগাযোগ' : 'Inter-District Highway Connectivity'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {busTerminals.map((bus, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? bus.name_bn : bus.name_en}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'bn' ? bus.route_bn : bus.route_en}
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                ⏱ {language === 'bn' ? bus.timing_bn : bus.timing_en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Commute Tips */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'শহরের ভেতরের স্থানীয় যাতায়াত' : 'Local City Commute & Fares'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'ইজি-বাইক, রিকশা ও নৌকা ভাড়ার ধারণা' : 'Estimated fares for rickshaws and boat cruises'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {localTransitTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? tip.mode_bn : tip.mode_en}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'bn' ? tip.details_bn : tip.details_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
