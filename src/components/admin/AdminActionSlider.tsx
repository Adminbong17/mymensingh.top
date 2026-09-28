import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Sparkles,
  RotateCcw,
  Database,
  Newspaper,
  Calendar,
  Tag,
  Heart,
  GraduationCap,
  Home,
  RefreshCw,
  Building2,
  LayoutGrid,
  ScrollText,
  X,
  Zap,
  Phone,
  BarChart3,
  Shield,
  MessageCircle,
  Bell,
  Star
} from 'lucide-react';
import type { EntityModalType } from './AdminEntityModal';

export interface CustomAdminButton {
  id: string;
  label: string;
  subtitle: string;
  url: string;
  iconName: string;
  colorTheme: 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan' | 'slate';
  createdAt: number;
}

const STORAGE_CUSTOM_BUTTONS = 'mymensingh_admin_custom_buttons_v1';
const STORAGE_SLIDER_ENABLED = 'mymensingh_admin_slider_enabled_v1';
const STORAGE_SLIDER_LAYOUT = 'mymensingh_admin_slider_layout_v1';

interface AdminActionSliderProps {
  onOpenPlaceModal: () => void;
  onOpenConfigModal: () => void;
  onSeedData: () => void;
  onRefreshData: () => void;
  onOpenEntityModal: (type: EntityModalType) => void;
  isSeeding: boolean;
  isRefreshing: boolean;
}

export const AdminActionSlider: React.FC<AdminActionSliderProps> = ({
  onOpenPlaceModal,
  onOpenConfigModal,
  onSeedData,
  onRefreshData,
  onOpenEntityModal,
  isSeeding,
  isRefreshing,
}) => {
  // Slider Toggle States
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_SLIDER_ENABLED);
    return saved !== null ? saved === 'true' : true;
  });

  const [layoutMode, setLayoutMode] = useState<'slider' | 'grid'>(() => {
    const saved = localStorage.getItem(STORAGE_SLIDER_LAYOUT);
    return (saved as 'slider' | 'grid') || 'slider';
  });

  // Custom Buttons State
  const [customButtons, setCustomButtons] = useState<CustomAdminButton[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_BUTTONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'btn-default-1',
        label: 'অফিসিয়াল ফেসবুক পেজ',
        subtitle: 'Mymensingh Guide Facebook',
        url: 'https://facebook.com',
        iconName: 'Globe',
        colorTheme: 'blue',
        createdAt: 1
      },
      {
        id: 'btn-default-2',
        label: 'জরুরি হেল্পলাইন ৯৯৯',
        subtitle: 'Emergency BD Support',
        url: 'tel:999',
        iconName: 'Phone',
        colorTheme: 'rose',
        createdAt: 2
      }
    ];
  });

  // Add Custom Button Modal State
  const [isAddButtonModalOpen, setIsAddButtonModalOpen] = useState(false);
  const [btnLabel, setBtnLabel] = useState('');
  const [btnSubtitle, setBtnSubtitle] = useState('');
  const [btnUrl, setBtnUrl] = useState('');
  const [btnIcon, setBtnIcon] = useState('Globe');
  const [btnColor, setBtnColor] = useState<'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan' | 'slate'>('emerald');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Persist slider toggle
  useEffect(() => {
    localStorage.setItem(STORAGE_SLIDER_ENABLED, String(isSliderOpen));
  }, [isSliderOpen]);

  // Persist layout mode
  useEffect(() => {
    localStorage.setItem(STORAGE_SLIDER_LAYOUT, layoutMode);
  }, [layoutMode]);

  // Persist custom buttons
  useEffect(() => {
    localStorage.setItem(STORAGE_CUSTOM_BUTTONS, JSON.stringify(customButtons));
  }, [customButtons]);

  // Scroll Slider Handlers
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Add Custom Button Handler
  const handleCreateCustomButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!btnLabel.trim()) return;

    const newBtn: CustomAdminButton = {
      id: `btn-${Date.now()}`,
      label: btnLabel.trim(),
      subtitle: btnSubtitle.trim() || 'Custom Action Link',
      url: btnUrl.trim() || '#',
      iconName: btnIcon,
      colorTheme: btnColor,
      createdAt: Date.now()
    };

    setCustomButtons(prev => [...prev, newBtn]);
    setBtnLabel('');
    setBtnSubtitle('');
    setBtnUrl('');
    setIsAddButtonModalOpen(false);
  };

  // Delete Custom Button Handler
  const handleDeleteCustomButton = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই কাস্টম বাটনটি মুছে ফেলতে চান?')) {
      setCustomButtons(prev => prev.filter(b => b.id !== id));
    }
  };

  // Helper for rendering custom icons
  const renderIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Globe': return <Globe className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'ExternalLink': return <ExternalLink className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'Bell': return <Bell className={className} />;
      case 'Star': return <Star className={className} />;
      default: return <Zap className={className} />;
    }
  };

  // Color mappings
  const getColorClasses = (theme: string) => {
    switch (theme) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          iconBg: 'bg-emerald-500/10 text-emerald-600',
          ring: 'focus:ring-emerald-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200 text-blue-950',
          badge: 'bg-blue-600 text-white',
          iconBg: 'bg-blue-500/10 text-blue-600',
          ring: 'focus:ring-blue-500'
        };
      case 'violet':
        return {
          bg: 'bg-violet-50 hover:bg-violet-100/80 border-violet-200 text-violet-950',
          badge: 'bg-violet-600 text-white',
          iconBg: 'bg-violet-500/10 text-violet-600',
          ring: 'focus:ring-violet-500'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-950',
          badge: 'bg-amber-600 text-white',
          iconBg: 'bg-amber-500/10 text-amber-600',
          ring: 'focus:ring-amber-500'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-950',
          badge: 'bg-rose-600 text-white',
          iconBg: 'bg-rose-500/10 text-rose-600',
          ring: 'focus:ring-rose-500'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200 text-cyan-950',
          badge: 'bg-cyan-600 text-white',
          iconBg: 'bg-cyan-500/10 text-cyan-600',
          ring: 'focus:ring-cyan-500'
        };
      default:
        return {
          bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900',
          badge: 'bg-slate-700 text-white',
          iconBg: 'bg-slate-200 text-slate-700',
          ring: 'focus:ring-slate-500'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm transition-all duration-300">
      
      {/* 1. Header with Toggle Switch & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                অ্যাডমিন কুইক অ্যাকশন স্লাইডার
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                Toggle Slider
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              এক ক্লিকে নতুন কন্টেন্ট যোগ ও নতুন বাটন তৈরি করুন ({10 + customButtons.length} টি অ্যাকশন)
            </p>
          </div>
        </div>

        {/* Toggle Slider Switch & Layout Buttons */}
        <div className="flex items-center gap-3">
          {/* Layout Mode (Slider vs Grid) */}
          {isSliderOpen && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setLayoutMode('slider')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  layoutMode === 'slider'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="স্লাইডার মোড"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">স্লাইডার</span>
              </button>

              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="গ্রিড মোড"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">গ্রিড</span>
              </button>
            </div>
          )}

          {/* Slider ON/OFF Toggle Switch */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              {isSliderOpen ? 'চালু' : 'বন্ধ'}
            </span>
            <button
              onClick={() => setIsSliderOpen(!isSliderOpen)}
              type="button"
              role="switch"
              aria-checked={isSliderOpen}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isSliderOpen ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isSliderOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Collapsible Slider Body */}
      {isSliderOpen ? (
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Navigation Arrows for Slider Mode */}
          {layoutMode === 'slider' && (
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>মাউস বা হাত দিয়ে ডানে-বামে স্লাইড করুন</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleScroll('left')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-800 text-slate-500 transition-colors shadow-2xs cursor-pointer"
                  title="Previous Actions"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-800 text-slate-500 transition-colors shadow-2xs cursor-pointer"
                  title="Next Actions"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Cards Container: Slider Track or Grid */}
          <div
            ref={scrollRef}
            className={
              layoutMode === 'slider'
                ? 'flex items-stretch gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1'
            }
          >
            {/* Core Action 1: Add Place / Business */}
            <button
              onClick={onOpenPlaceModal}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('emerald').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('emerald').iconBg}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-emerald-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                  + নতুন ব্যবসা / স্থান
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  দোকান, হোটেল, রেস্টুরেন্ট
                </div>
              </div>
            </button>

            {/* Core Action 2: Add News */}
            <button
              onClick={() => onOpenEntityModal('news')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('blue').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('blue').iconBg}`}>
                  <Newspaper className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-blue-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                  + সংবাদ প্রকাশ
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  ময়মনসিংহের তাজা খবর
                </div>
              </div>
            </button>

            {/* Core Action 3: Add Event */}
            <button
              onClick={() => onOpenEntityModal('event')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('violet').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('violet').iconBg}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-violet-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition-colors">
                  + নতুন ইভেন্ট
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  মেলা, উৎসব ও কর্মশালা
                </div>
              </div>
            </button>

            {/* Core Action 4: Add Offer */}
            <button
              onClick={() => onOpenEntityModal('offer')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('amber').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('amber').iconBg}`}>
                  <Tag className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-amber-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
                  + অফার ও ছাড়
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  কুপন ও বিশেষ ডিসকাউন্ট
                </div>
              </div>
            </button>

            {/* Core Action 5: Add Blood Donor */}
            <button
              onClick={() => onOpenEntityModal('donor')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('rose').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('rose').iconBg}`}>
                  <Heart className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-rose-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition-colors">
                  + রক্তদাতা তালিকা
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  ব্লাড ব্যাংক ডোনার ভলান্টিয়ার
                </div>
              </div>
            </button>

            {/* Core Action 6: Add Tuition */}
            <button
              onClick={() => onOpenEntityModal('tuition')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('emerald').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('emerald').iconBg}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-emerald-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                  + টিউশন মিডিয়া
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  শিক্ষার্থী ও গৃহশিক্ষক
                </div>
              </div>
            </button>

            {/* Core Action 7: Add To-Let */}
            <button
              onClick={() => onOpenEntityModal('tolet')}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('violet').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('violet').iconBg}`}>
                  <Home className="w-4 h-4" />
                </div>
                <span className="p-1 rounded-lg bg-violet-600 text-white shadow-2xs group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition-colors">
                  + বাসা ভাড়া টু-লেট
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  ফ্ল্যাট, ব্যাচেলর ও সাবলেট
                </div>
              </div>
            </button>

            {/* Core Action 8: Live Cloud Refresh */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer disabled:opacity-60 ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('cyan').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('cyan').iconBg}`}>
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-600 text-white">
                  Live
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {isRefreshing ? 'রিফ্রেশ হচ্ছে...' : '⚡ ক্লাউড সিঙ্ক'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  Supabase লাইভ রিফ্রেশ
                </div>
              </div>
            </button>

            {/* Core Action 9: Seed Supabase Database */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer disabled:opacity-60 ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } bg-indigo-50/80 hover:bg-indigo-100/90 border-indigo-200 text-indigo-950`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <RotateCcw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-600 text-white">
                  Seed
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {isSeeding ? 'সিড হচ্ছে...' : '🔄 প্রাথমিক সিড'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  Supabase-এ ডাটা পুশ
                </div>
              </div>
            </button>

            {/* Core Action 10: Database Settings Modal */}
            <button
              onClick={onOpenConfigModal}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              } ${getColorClasses('slate').bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getColorClasses('slate').iconBg}`}>
                  <Database className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-700 text-white">
                  Config
                </span>
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-slate-700 transition-colors">
                  ⚙️ ডেটাবেজ সেটিংস
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                  Supabase API ও টেবিল
                </div>
              </div>
            </button>

            {/* Custom Admin Buttons created dynamically by Admin */}
            {customButtons.map(button => {
              const theme = getColorClasses(button.colorTheme);
              return (
                <div
                  key={button.id}
                  onClick={() => {
                    if (button.url && button.url !== '#') {
                      window.open(button.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex flex-col justify-between group cursor-pointer ${
                    layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
                  } ${theme.bg}`}
                >
                  {/* Delete button for custom button */}
                  <button
                    onClick={(e) => handleDeleteCustomButton(button.id, e)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/80 hover:bg-rose-500 hover:text-white text-slate-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${theme.iconBg}`}>
                      {renderIcon(button.iconName, 'w-4 h-4')}
                    </div>
                    <span className="p-1 rounded-lg bg-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {button.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                      {button.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* SPECIAL CARD: + বাটন যোগ করুন (Add Custom Button Creator) */}
            <button
              onClick={() => setIsAddButtonModalOpen(true)}
              className={`p-3.5 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-center items-center gap-2 group cursor-pointer min-h-[110px] ${
                layoutMode === 'slider' ? 'w-48 shrink-0' : 'w-full'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="font-black text-xs text-indigo-900 group-hover:text-indigo-700">
                  + বাটন যোগ করুন
                </div>
                <div className="text-[10px] text-indigo-500 font-semibold">
                  কাস্টম বাটন তৈরি করুন
                </div>
              </div>
            </button>

          </div>
        </div>
      ) : (
        <div className="mt-3 py-2 px-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium">
            ⚡ কুইক অ্যাকশন স্লাইডারটি বন্ধ আছে — বাটনগুলো দেখতে ও ব্যবহার করতে উপরের টগল সুইচটি চালু করুন।
          </p>
        </div>
      )}

      {/* 3. Modal for Adding Custom Button to Slider */}
      {isAddButtonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">নতুন অ্যাডমিন বাটন যোগ করুন</h3>
                  <p className="text-xs text-white/80">স্লাইডারে নিজস্ব অ্যাকশন বা লিংক বাটন তৈরি করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddButtonModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomButton} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাটনের নাম (Label) *</label>
                <input
                  type="text"
                  required
                  value={btnLabel}
                  onChange={(e) => setBtnLabel(e.target.value)}
                  placeholder="যেমন: সিটি কর্পোরেশন নোটিশ বা ফেসবুক পেজ"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (Subtitle)</label>
                <input
                  type="text"
                  value={btnSubtitle}
                  onChange={(e) => setBtnSubtitle(e.target.value)}
                  placeholder="যেমন: জরুরী নোটিশ বোর্ড বা অনলাইন লিংক"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাকশন লিংক বা গন্তব্য URL</label>
                <input
                  type="text"
                  value={btnUrl}
                  onChange={(e) => setBtnUrl(e.target.value)}
                  placeholder="https://... অথবা tel:017XXXXXXXX"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-hidden"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">আইকন নির্বাচন করুন</label>
                <div className="flex flex-wrap gap-2">
                  {['Globe', 'Phone', 'ExternalLink', 'Sparkles', 'BarChart3', 'Shield', 'MessageCircle', 'Bell', 'Star', 'Zap'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setBtnIcon(icon)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        btnIcon === icon
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {renderIcon(icon, 'w-4 h-4')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">কালার থিম</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'emerald', label: 'সবুজ' },
                    { id: 'blue', label: 'নীল' },
                    { id: 'violet', label: 'বেগুনি' },
                    { id: 'amber', label: 'কমলা' },
                    { id: 'rose', label: 'লাল' },
                    { id: 'cyan', label: 'সায়ান' },
                    { id: 'slate', label: 'ধূসর' },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setBtnColor(theme.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        btnColor === theme.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddButtonModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  বাটন যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
