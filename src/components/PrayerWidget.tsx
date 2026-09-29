import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import {
  BANGLADESH_CITIES,
  fetchPrayerTimes,
  formatTo12Hour,
  getCurrentWaqtInfo,
  formatRemainingTime,
  type PrayerDayData,
} from '../lib/prayerTimes';

interface PrayerWidgetProps {
  className?: string;
}

export const PrayerWidget: React.FC<PrayerWidgetProps> = ({ className = '' }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('user_prayer_city') || 'Mymensingh';
  });
  const [data, setData] = useState<PrayerDayData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cityDropdownOpen, setCityDropdownOpen] = useState<boolean>(false);
  const [countdownStr, setCountdownStr] = useState<string>('');
  const [activeWaqt, setActiveWaqt] = useState<string>('Isha');

  // Load prayer times
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const savedMethod = parseInt(localStorage.getItem('prayer_calc_method') || '1', 10);
    fetchPrayerTimes(new Date(), selectedCityId, savedMethod)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCityId]);

  // Save selected city
  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    localStorage.setItem('user_prayer_city', cityId);
    setCityDropdownOpen(false);
  };

  // Live Countdown Timer ticking every second
  useEffect(() => {
    if (!data) return;

    const tick = () => {
      const waqtInfo = getCurrentWaqtInfo(data.timings);
      setActiveWaqt(waqtInfo.currentWaqt);
      setCountdownStr(formatRemainingTime(waqtInfo.remainingSeconds));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data || isLoading) {
    return (
      <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-center min-h-[300px] ${className}`}>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">নামাজের সময়সূচি লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  const { timings, city, readableDate, hijriDateStr } = data;

  const sahriTime = formatTo12Hour(timings.Fajr);
  const iftarTime = formatTo12Hour(timings.Sunset || timings.Maghrib);
  const sunriseTime = formatTo12Hour(timings.Sunrise);
  const sunsetTime = formatTo12Hour(timings.Sunset || timings.Maghrib);

  const prayerList = [
    { name: 'Fajr', nameBn: 'ফজর', start: formatTo12Hour(timings.Fajr), end: formatTo12Hour(timings.Dhuhr) },
    { name: 'Dhuhr', nameBn: 'যোহর', start: formatTo12Hour(timings.Dhuhr), end: formatTo12Hour(timings.Asr) },
    { name: 'Asr', nameBn: 'আসর', start: formatTo12Hour(timings.Asr), end: formatTo12Hour(timings.Maghrib) },
    { name: 'Maghrib', nameBn: 'মাগরিব', start: formatTo12Hour(timings.Maghrib), end: formatTo12Hour(timings.Isha) },
    { name: 'Isha', nameBn: 'ইশা', start: formatTo12Hour(timings.Isha), end: '11:59 PM' },
  ];

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm max-w-sm sm:max-w-md w-full mx-auto relative ${className}`}>
      
      {/* 1. Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
            <Moon className="w-4 h-4 fill-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            নামাজ ও রোজা
          </h3>
        </div>

        <Link
          to="/prayer"
          className="text-sm font-bold text-rose-700 hover:text-rose-800 hover:underline transition-colors"
        >
          বিস্তারিত
        </Link>
      </div>

      {/* 2. City Selector & Date */}
      <div className="py-3">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{city.name_en}, Bangladesh</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* City Dropdown Menu */}
          {cityDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 max-h-60 overflow-y-auto">
              {BANGLADESH_CITIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCitySelect(c.id)}
                  className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCityId === c.id
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.name_en}</span>
                  <span className="text-[11px] text-slate-400">{c.name_bn}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Row */}
        <p className="text-xs text-slate-500 font-medium mt-1.5 leading-snug">
          {readableDate} • {hijriDateStr}
        </p>
      </div>

      {/* 3. Sahri & Iftar Quick Info Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-left">
          <span className="block text-[11px] font-semibold text-slate-500">
            পরবর্তী সাহরি
          </span>
          <span className="block text-base sm:text-lg font-black text-slate-900 mt-0.5 tracking-tight">
            {sahriTime}
          </span>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-2.5 sm:p-3 text-left">
          <span className="block text-[11px] font-semibold text-slate-500">
            আজকের ইফতার
          </span>
          <span className="block text-base sm:text-lg font-black text-slate-900 mt-0.5 tracking-tight">
            {iftarTime}
          </span>
        </div>
      </div>

      {/* 4. Active Prayer Card (Pink Box) */}
      <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3.5 text-center mb-3">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-500 mb-1">
          <Sun className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
        </div>
        <div className="text-xs font-semibold text-slate-600">
          এখন
        </div>
        <div className="text-xl sm:text-2xl font-black text-[#9F1239] tracking-tight leading-tight mt-0.5">
          {activeWaqt}
        </div>
        <div className="text-xs font-medium text-slate-500 mt-1">
          ওয়াক্ত বাকি
        </div>
        <div className="text-sm sm:text-base font-black text-rose-600 tracking-wider font-mono mt-0.5">
          {countdownStr}
        </div>
      </div>

      {/* 5. Five Waqt Schedule Table */}
      <div className="space-y-1.5 mb-3.5">
        {prayerList.map((p) => {
          const isCurrent = activeWaqt.toLowerCase() === p.name.toLowerCase();
          return (
            <div
              key={p.name}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors ${
                isCurrent
                  ? 'border border-rose-400 bg-rose-50/60 font-bold text-rose-900 shadow-2xs'
                  : 'border border-slate-100 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{p.name}</span>
                <span className="text-[11px] text-slate-400 font-normal">({p.nameBn})</span>
              </div>
              <div className={`font-mono text-xs sm:text-[13px] ${isCurrent ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                {p.start} – {p.end}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Footer (Sunrise & Sunset) */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-600 font-semibold">
        <div className="flex items-center gap-1">
          <Sunrise className="w-3.5 h-3.5 text-amber-500" />
          <span>সূর্যোদয় {sunriseTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Sunset className="w-3.5 h-3.5 text-orange-500" />
          <span>সূর্যাস্ত {sunsetTime}</span>
        </div>
      </div>

    </div>
  );
};
