import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Compass,
  Bell,
  BellOff,
  X,
  ChevronDown
} from 'lucide-react';
import {
  BANGLADESH_CITIES,
  CALCULATION_METHODS,
  fetchPrayerTimes,
  formatTo12Hour,
  getCurrentWaqtInfo,
  formatRemainingTime,
  calculateQiblaBearing,
  type PrayerDayData,
} from '../lib/prayerTimes';

export const PrayerTimesPage: React.FC = () => {
  const navigate = useNavigate();

  // Settings & City state
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('user_prayer_city') || 'Mymensingh';
  });
  const [calculationMethod, setCalculationMethod] = useState<number>(() => {
    return parseInt(localStorage.getItem('prayer_calc_method') || '1', 10);
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Date navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<PrayerDayData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Live timer & waqt info
  const [activeWaqt, setActiveWaqt] = useState<string>('Isha');
  const [nextWaqt, setNextWaqt] = useState<string>('Fajr');
  const [nextWaqtTime, setNextWaqtTime] = useState<string>('4:35 AM');
  const [countdownStr, setCountdownStr] = useState<string>('00:00:00 মিনিট');

  // Reminders state
  const [allRemindersEnabled, setAllRemindersEnabled] = useState<boolean>(() => {
    return localStorage.getItem('prayer_reminders_all') === 'true';
  });
  const [mutedPrayers, setMutedPrayers] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('prayer_muted_map');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Compass state
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [compassActive, setCompassActive] = useState<boolean>(false);

  // Load Prayer Data whenever date, city, or calculation method changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchPrayerTimes(currentDate, selectedCityId, calculationMethod)
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
  }, [currentDate, selectedCityId, calculationMethod]);

  // Live Waqt and Countdown tick
  useEffect(() => {
    if (!data) return;

    const tick = () => {
      const waqtInfo = getCurrentWaqtInfo(data.timings);
      setActiveWaqt(waqtInfo.currentWaqt);
      setNextWaqt(waqtInfo.nextWaqt);
      setNextWaqtTime(waqtInfo.nextWaqtTimeFormatted);
      setCountdownStr(formatRemainingTime(waqtInfo.remainingSeconds));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data]);

  // City change handler
  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    localStorage.setItem('user_prayer_city', cityId);
    setCityDropdownOpen(false);
  };

  // Date step helper (yesterday / tomorrow)
  const handleStepDay = (delta: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + delta);
    setCurrentDate(next);
  };

  // Date headline label ("আজ", "আগামীকাল", "গতকাল")
  const getDateLabel = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(currentDate);
    compareDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((compareDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (diffDays === 0) return `আজ, ${formattedDate}`;
    if (diffDays === 1) return `আগামীকাল, ${formattedDate}`;
    if (diffDays === -1) return `গতকাল, ${formattedDate}`;
    return formattedDate;
  };

  // Toggle all reminders
  const handleToggleAllReminders = () => {
    const nextVal = !allRemindersEnabled;
    setAllRemindersEnabled(nextVal);
    localStorage.setItem('prayer_reminders_all', nextVal ? 'true' : 'false');

    if (nextVal && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  // Toggle individual prayer mute
  const handleTogglePrayerMute = (prayerName: string) => {
    const updated = {
      ...mutedPrayers,
      [prayerName]: !mutedPrayers[prayerName],
    };
    setMutedPrayers(updated);
    localStorage.setItem('prayer_muted_map', JSON.stringify(updated));
  };

  // Device orientation compass support
  const enableCompass = async () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setCompassActive(true);
        }
      } catch (e) {
        console.warn('Orientation permission error:', e);
      }
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
      setCompassActive(true);
    } else {
      setCompassActive(true);
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let heading = 0;
    if ((e as any).webkitCompassHeading) {
      // iOS
      heading = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
      // Android
      heading = 360 - e.alpha;
    }
    setCompassHeading(Math.round(heading));
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const city =
    BANGLADESH_CITIES.find((c) => c.id.toLowerCase() === selectedCityId.toLowerCase()) ||
    BANGLADESH_CITIES[0];

  const qiblaAngle = calculateQiblaBearing(city.lat, city.lng);

  if (!data || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">নামাজের সময়সূচি প্রস্তুত হচ্ছে...</span>
        </div>
      </div>
    );
  }

  const { timings, hijriDateStr } = data;
  const sahriTime = formatTo12Hour(timings.Fajr);
  const iftarTime = formatTo12Hour(timings.Sunset || timings.Maghrib);
  const sunriseTime = formatTo12Hour(timings.Sunrise);
  const sunsetTime = formatTo12Hour(timings.Sunset || timings.Maghrib);

  const prayerSchedule = [
    {
      name: 'Fajr',
      nameBn: 'ফজর',
      start: formatTo12Hour(timings.Fajr),
      end: formatTo12Hour(timings.Dhuhr),
      icon: <Sunrise className="w-5 h-5 text-amber-500" />,
      iconBg: 'bg-amber-100/70',
    },
    {
      name: 'Dhuhr',
      nameBn: 'যোহর',
      start: formatTo12Hour(timings.Dhuhr),
      end: formatTo12Hour(timings.Asr),
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      iconBg: 'bg-amber-100/70',
    },
    {
      name: 'Asr',
      nameBn: 'আসর',
      start: formatTo12Hour(timings.Asr),
      end: formatTo12Hour(timings.Maghrib),
      icon: <Sun className="w-5 h-5 text-orange-400" />,
      iconBg: 'bg-orange-100/70',
    },
    {
      name: 'Maghrib',
      nameBn: 'মাগরিব',
      start: formatTo12Hour(timings.Maghrib),
      end: formatTo12Hour(timings.Isha),
      icon: <Sunset className="w-5 h-5 text-orange-500" />,
      iconBg: 'bg-orange-100/70',
    },
    {
      name: 'Isha',
      nameBn: 'ইশা',
      start: formatTo12Hour(timings.Isha),
      end: '11:59 PM',
      icon: <Moon className="w-5 h-5 text-amber-500" />,
      iconBg: 'bg-rose-100/70',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden p-4 sm:p-6 space-y-4">
        
        {/* 1. Header with Back button, Title & Date Stepper */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-base sm:text-lg font-black text-slate-800">
            বিস্তারিত
          </h1>

          <div className="flex items-center gap-1 text-slate-600">
            <button
              type="button"
              onClick={() => handleStepDay(-1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="পূর্ববর্তী দিন"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleStepDay(1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="পরবর্তী দিন"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Date Headline & Hijri */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            {getDateLabel()}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {hijriDateStr}
          </p>
        </div>

        {/* 3. Location Dropdown & Settings Link */}
        <div className="flex items-center justify-between pt-1">
          {/* City Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{city.name_en}, Bangladesh</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

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

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 cursor-pointer transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>সেটিংস</span>
          </button>
        </div>

        {/* 4. Four Summary Stat Boxes (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Box 1: পরবর্তী সাহরি */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3">
            <span className="block text-[11px] font-semibold text-slate-500">
              পরবর্তী সাহরি
            </span>
            <span className="block text-base sm:text-lg font-black text-slate-900 mt-0.5 tracking-tight">
              {sahriTime}
            </span>
          </div>

          {/* Box 2: আজ ইফতার */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3">
            <span className="block text-[11px] font-semibold text-slate-500">
              আজ ইফতার
            </span>
            <span className="block text-base sm:text-lg font-black text-slate-900 mt-0.5 tracking-tight">
              {iftarTime}
            </span>
          </div>

          {/* Box 3: এখন : Active Waqt & Remaining Time */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3">
            <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
              <span>এখন :</span>
              <strong className="text-rose-800 font-bold">{activeWaqt}</strong>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">ওয়াক্ত বাকি</div>
            <div className="text-xs sm:text-sm font-black text-rose-600 font-mono mt-0.5">
              {countdownStr}
            </div>
          </div>

          {/* Box 4: পরবর্তী : Next Waqt */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3">
            <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
              <span>পরবর্তী :</span>
              <strong className="text-emerald-800 font-bold">{nextWaqt}</strong>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">ওয়াক্ত শুরু</div>
            <div className="text-xs sm:text-sm font-black text-slate-800 font-mono mt-0.5">
              {nextWaqtTime}
            </div>
          </div>
        </div>

        {/* 5. Sunrise & Sunset Row */}
        <div className="flex items-center justify-between px-1 py-1 text-xs text-slate-600 font-semibold border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-500" />
            <span>সূর্যোদয় {sunriseTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sunset className="w-4 h-4 text-orange-500" />
            <span>সূর্যাস্ত {sunsetTime}</span>
          </div>
        </div>

        {/* 6. Qibla Compass Card */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-rose-700">
            <Compass className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900">কিবলা খুঁজুন</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Qibla bearing: <strong className="text-slate-800">{qiblaAngle}°</strong> from North
          </p>

          {/* Visual Compass Dial */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto my-2">
            {/* Outer Compass Circle */}
            <div
              className="w-full h-full rounded-full border-4 border-slate-200 bg-white shadow-inner flex items-center justify-center relative transition-transform duration-300"
              style={{
                transform: `rotate(${-compassHeading}deg)`,
              }}
            >
              {/* Compass Cardinal Points */}
              <span className="absolute top-1 text-[11px] font-black text-rose-600">N</span>
              <span className="absolute right-2 text-[11px] font-bold text-slate-400">E</span>
              <span className="absolute bottom-1 text-[11px] font-bold text-slate-400">S</span>
              <span className="absolute left-2 text-[11px] font-black text-slate-700">W</span>

              {/* Dial tick marks */}
              <div className="absolute inset-2 border border-dashed border-slate-200 rounded-full" />

              {/* Kaaba Direction Pointer (Rotated by Qibla angle) */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500 pointer-events-none"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                {/* Arrow & Kaaba Indicator */}
                <div className="w-full flex items-center justify-start pl-3 relative">
                  {/* Arrowhead */}
                  <div className="w-0 h-0 border-y-6 border-y-transparent border-r-10 border-r-rose-600" />
                  {/* Small Kaaba representation */}
                  <div className="w-3.5 h-3.5 bg-slate-900 border border-amber-400 rounded-xs shadow-xs ml-1 flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-amber-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Center Pivot */}
              <div className="w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow-xs z-10" />
            </div>
          </div>

          <button
            type="button"
            onClick={enableCompass}
            className="w-full py-2.5 px-4 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            {compassActive ? 'Compass Active' : 'Enable compass'}
          </button>
        </div>

        {/* 7. Detailed Prayer Schedule & Reminders */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              নামাজের সময়সূচি
            </h3>

            {/* Toggle: All Reminders */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                সকল নামাজের রিমাইন্ডার
              </span>
              <button
                type="button"
                onClick={handleToggleAllReminders}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  allRemindersEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    allRemindersEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* List of 5 Waqt with individual bells */}
          <div className="space-y-2">
            {prayerSchedule.map((p) => {
              const isCurrent = activeWaqt.toLowerCase() === p.name.toLowerCase();
              const isMuted = mutedPrayers[p.name] ?? !allRemindersEnabled;

              return (
                <div
                  key={p.name}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-rose-400 bg-rose-50/50 shadow-2xs ring-1 ring-rose-300'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0`}>
                      {p.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">({p.nameBn})</span>
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5">
                        {p.start} – {p.end}
                      </div>
                    </div>
                  </div>

                  {/* Individual Bell / Mute Button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePrayerMute(p.name)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isMuted
                        ? 'border-slate-200 text-slate-400 hover:text-slate-600 bg-slate-50'
                        : 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                    }`}
                    title={isMuted ? 'রিমাইন্ডার চালু করুন' : 'রিমাইন্ডার বন্ধ করুন'}
                  >
                    {isMuted ? (
                      <BellOff className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4 fill-rose-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 8. Prayer Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Prayer Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calculation Methods List */}
            <div className="space-y-2.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                Calculation method
              </label>

              <div className="space-y-2">
                {CALCULATION_METHODS.map((method) => {
                  const isChecked = calculationMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      onClick={() => setCalculationMethod(method.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-indigo-600' : 'border-slate-300'
                      }`}>
                        {isChecked && (
                          <div className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <span className="leading-tight">{method.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Location Notice */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Location</div>
              <div>Currently: <strong className="text-slate-900">{city.name_en}, Bangladesh</strong></div>
              <p className="text-[11px] text-slate-500">
                Use the city dropdown on the page to change location.
              </p>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('prayer_calc_method', calculationMethod.toString());
                setIsSettingsOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Done
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
