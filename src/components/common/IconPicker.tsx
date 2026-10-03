import React, { useState, useMemo } from 'react';
import { Search, X, ExternalLink, Check, Sparkles } from 'lucide-react';
import { AVAILABLE_CATEGORY_ICONS, renderCategoryIcon } from '../../lib/categoryIcons';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
  showColorPicker?: boolean;
}

const COLOR_PALETTE = [
  { name: 'orange', hex: '#F97316', bg: 'bg-orange-500', label: 'কমলা (Orange)' },
  { name: 'emerald', hex: '#10B981', bg: 'bg-emerald-500', label: 'সবুজ (Emerald)' },
  { name: 'blue', hex: '#2563EB', bg: 'bg-blue-500', label: 'নীল (Blue)' },
  { name: 'rose', hex: '#E11D48', bg: 'bg-rose-500', label: 'গোলাপি লাল (Rose)' },
  { name: 'red', hex: '#EF4444', bg: 'bg-red-500', label: 'লাল (Red)' },
  { name: 'purple', hex: '#7C3AED', bg: 'bg-purple-500', label: 'বেগুনী (Purple)' },
  { name: 'pink', hex: '#DB2777', bg: 'bg-pink-500', label: 'গোলাপী (Pink)' },
  { name: 'amber', hex: '#D97706', bg: 'bg-amber-500', label: 'অ্যাম্বার (Amber)' },
  { name: 'teal', hex: '#0D9488', bg: 'bg-teal-500', label: 'টিল (Teal)' },
  { name: 'sky', hex: '#0284C7', bg: 'bg-sky-500', label: 'আকাশি (Sky)' },
  { name: 'indigo', hex: '#4F46E5', bg: 'bg-indigo-500', label: 'ইন্ডিগো (Indigo)' },
  { name: 'slate', hex: '#334155', bg: 'bg-slate-700', label: 'স্লেট (Slate)' },
];

const GROUP_TABS = [
  'সব (All)',
  'খাবার ও রেস্তোরাঁ',
  'স্বাস্থ্য ও চিকিৎসা',
  'আবাসন ও ভ্রমণ',
  'পরিবহন ও গাড়ি',
  'শপিং ও লাইফস্টাইল',
  'শিক্ষা ও ক্যারিয়ার',
  'প্রযুক্তি ও সেবা',
  'সংবাদ ও তথ্য',
  'সাধারণ ও অন্যান্য'
];

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  selectedColor,
  onSelectColor,
  showColorPicker = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('সব (All)');
  const [customIconInput, setCustomIconInput] = useState('');

  // Find visual info for currently selected icon
  const currentVisual = useMemo(() => {
    return AVAILABLE_CATEGORY_ICONS.find(
      ic => ic.name.toLowerCase() === selectedIcon.toLowerCase()
    );
  }, [selectedIcon]);

  // Filtered icons by search and category group tab
  const filteredIcons = useMemo(() => {
    return AVAILABLE_CATEGORY_ICONS.filter(ic => {
      const matchesGroup = activeGroup === 'সব (All)' || ic.group === activeGroup;
      if (!matchesGroup) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        ic.name.toLowerCase().includes(q) ||
        ic.labelBn.toLowerCase().includes(q) ||
        ic.labelEn.toLowerCase().includes(q) ||
        ic.group.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, activeGroup]);

  const handleApplyCustomIcon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customIconInput.trim()) return;
    const cleanName = customIconInput.trim().replace(/[^a-zA-Z0-9]/g, '');
    onSelectIcon(cleanName);
    setCustomIconInput('');
  };

  return (
    <div className="space-y-3.5 bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200">
      
      {/* 1. Selected Icon Live Preview Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-inner">
            {renderCategoryIcon(selectedIcon, "w-6 h-6", true)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 font-mono">{selectedIcon}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {currentVisual ? `${currentVisual.labelBn} (${currentVisual.labelEn})` : 'কাস্টম আইকন'}
            </p>
          </div>
        </div>

        <a
          href="https://lucide.dev/icons"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors shrink-0"
          title="Browse 1,500+ free vector icons on lucide.dev"
        >
          <span>১,৫০০+ আইকন লাইব্রেরি</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2. Color Palette Selector (Optional) */}
      {showColorPicker && onSelectColor && (
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            সিগনেচার কালার (Accent Color):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PALETTE.map((col) => {
              const isColorSelected = selectedColor === col.name || selectedColor === col.hex;
              return (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => onSelectColor(col.name)}
                  className={`w-6 h-6 rounded-full ${col.bg} flex items-center justify-center transition-all cursor-pointer ${
                    isColorSelected
                      ? 'ring-2 ring-offset-2 ring-emerald-600 scale-110 shadow-xs'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                  title={col.label}
                >
                  {isColorSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="আইকন খুঁজুন (যেমন: car, doctor, salon, food, bike, gym, school)..."
          className="w-full text-xs pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500 shadow-2xs font-medium"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4. Group Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
        {GROUP_TABS.map((grp) => (
          <button
            type="button"
            key={grp}
            onClick={() => setActiveGroup(grp)}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              activeGroup === grp
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* 5. Icons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-52 overflow-y-auto p-1.5 border border-slate-200/80 rounded-xl bg-white">
        {filteredIcons.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 space-y-1">
            <Sparkles className="w-6 h-6 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">কোনো আইকন মেলেনি</p>
            <p className="text-[11px] text-slate-400">নিচে সরাসরি Lucide আইকনের নাম লিখে সেট করুন</p>
          </div>
        ) : (
          filteredIcons.map((ic) => {
            const isSelected = selectedIcon.toLowerCase() === ic.name.toLowerCase();
            return (
              <button
                type="button"
                key={ic.name}
                onClick={() => onSelectIcon(ic.name)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 ring-1 ring-emerald-500'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border border-slate-200/60 hover:border-emerald-300'
                }`}
              >
                <div className={`p-1 rounded-lg shrink-0 ${isSelected ? 'text-white' : ''}`}>
                  {renderCategoryIcon(ic.name, "w-5 h-5", !isSelected)}
                </div>
                <span className="text-[10px] font-bold truncate w-full leading-tight">{ic.name}</span>
                <span className={`text-[8px] truncate w-full leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {ic.labelBn}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* 6. Custom Icon Name Input */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-200/80">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-[11px] font-bold text-slate-600 shrink-0">
            কাস্টম আইকন নাম:
          </label>
          <input
            type="text"
            value={customIconInput}
            onChange={(e) => setCustomIconInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyCustomIcon();
              }
            }}
            placeholder="e.g. Flame, Shield, Heart"
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 outline-hidden focus:border-emerald-500 font-mono flex-1 shadow-2xs"
          />
          <button
            type="button"
            onClick={() => handleApplyCustomIcon()}
            disabled={!customIconInput.trim()}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            প্রয়োগ করুন
          </button>
        </div>
      </div>

    </div>
  );
};
