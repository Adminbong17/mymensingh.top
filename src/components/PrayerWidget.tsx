import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Sunrise,
  Sunset,
  Moon,
  ChevronDown,
  ArrowRight
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
      <div className={`bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-center min-h-[140px] ${className}`}>
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
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
    { name: 'Fajr', nameBn: 'ফজর', time: formatTo12Hour(timings.Fajr) },
    { name: 'Dhuhr', nameBn: 'যোহর', time: formatTo12Hour(timings.Dhuhr) },
    { name: 'Asr', nameBn: 'আসর', time: formatTo12Hour(timings.Asr) },
    { name: 'Maghrib', nameBn: 'মাগরিব', time: formatTo12Hour(timings.Maghrib) },
    { name: 'Isha', nameBn: 'ইশা', time: formatTo12Hour(timings.Isha) },
  ];

  return (
    <div
      className={`bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 relative overflow-hidden space-y-4 ${className}`}
    >
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10 relative z-10">
        
        {/* Title, Badge & Hijri Date */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Moon className="w-4 h-4 fill-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                নামাজ ও রোজার সময়সূচি
              </h3>
              <span className="text-[11px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.2 rounded-full hidden sm:inline">
                দৈনন্দিন ইসলামিক সেবা
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {readableDate} • {hijriDateStr}
            </p>
          </div>
        </div>

        {/* Right: City Selector & Link Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* City Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-slate-200 transition-colors cursor-pointer select-none"
            >
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{city.name_en}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 sm:right-0 mt-1.5 w-44 bg-slate-900 border border-white/15 rounded-xl shadow-2xl z-30 py-1 max-h-56 overflow-y-auto text-left">
                {BANGLADESH_CITIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCitySelect(c.id)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCityId === c.id
                        ? 'bg-rose-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{c.name_en}</span>
                    <span className="text-[10px] text-slate-400">{c.name_bn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full Schedule / Qibla Link */}
          <Link
            to="/prayer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>কিবলা ও বিস্তারিত</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Quick Summary Cards (Sehri, Iftar, Active Waqt with Countdown) */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2 sm:gap-3 relative z-10">
        
        {/* 1. পরবর্তী সাহরি */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between min-[480px]:block text-left">
          <span className="text-[11px] font-semibold text-slate-300">
            পরবর্তী সাহরি শেষ
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-300 font-mono tracking-tight block mt-0.5">
            {sahriTime}
          </span>
        </div>

        {/* 2. আজকের ইফতার */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between min-[480px]:block text-left">
          <span className="text-[11px] font-semibold text-slate-300">
            আজকের ইফতার শুরু
          </span>
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-tight block mt-0.5">
            {iftarTime}
          </span>
        </div>

        {/* 3. বর্তমান ওয়াক্ত ও কাউন্টডাউন */}
        <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between min-[480px]:block text-left">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[11px] font-bold text-rose-200">
              এখন {activeWaqt} (বাকি)
            </span>
          </div>
          <span className="text-sm sm:text-base font-black text-rose-300 font-mono tracking-wider block mt-0.5">
            {countdownStr}
          </span>
        </div>

      </div>

      {/* Horizontal 5-Waqt Times Strip */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-xs relative z-10">
        
        {prayerList.map((p) => {
          const isCurrent = activeWaqt.toLowerCase() === p.name.toLowerCase();

          return (
            <div
              key={p.name}
              className={`flex-1 min-w-[62px] py-1.5 px-2 rounded-xl text-center border transition-all ${
                isCurrent
                  ? 'bg-rose-500 text-white font-black border-rose-400 shadow-md shadow-rose-500/20 scale-102'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <div className="text-[10.5px] font-semibold opacity-90 leading-tight">
                {p.nameBn}
              </div>
              <div className="text-[11.5px] sm:text-xs font-black font-mono mt-0.5 leading-tight">
                {p.time}
              </div>
            </div>
          );
        })}

        {/* Sunrise / Sunset compact indicators */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-semibold pl-2">
          <div className="flex items-center gap-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span>{sunriseTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>{sunsetTime}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
