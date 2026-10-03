import React from 'react';
import {
  Utensils,
  Bed,
  PlusSquare,
  Pill,
  Droplets,
  GraduationCap,
  Home,
  ShoppingBag,
  Coffee,
  Trees,
  BookOpen,
  Bus,
  Moon,
  Calendar,
  Tag,
  Newspaper,
  Building2,
  Briefcase,
  Settings,
  MoreHorizontal
} from 'lucide-react';

export interface CategoryVisual {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgLight: string;
  borderLight: string;
  nameBn: string;
  nameEn: string;
}

export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  'restaurants': {
    icon: Utensils,
    color: '#F97316',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    nameBn: 'রেস্টুরেন্ট',
    nameEn: 'Restaurants'
  },
  'hotels': {
    icon: Bed,
    color: '#2563EB',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    nameBn: 'হোটেল',
    nameEn: 'Hotels'
  },
  'hospitals': {
    icon: PlusSquare,
    color: '#E11D48',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    nameBn: 'হাসপাতাল',
    nameEn: 'Hospitals'
  },
  'pharmacy': {
    icon: Pill,
    color: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    nameBn: 'ফার্মেসি',
    nameEn: 'Pharmacy'
  },
  'blood-bank': {
    icon: Droplets,
    color: '#EF4444',
    bgLight: 'bg-red-50',
    borderLight: 'border-red-200',
    nameBn: 'রক্ত ব্যাংক',
    nameEn: 'Blood Bank'
  },
  'tuition-media': {
    icon: GraduationCap,
    color: '#7C3AED',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    nameBn: 'টিউশন মিডিয়া',
    nameEn: 'Tuition Media'
  },
  'to-let': {
    icon: Home,
    color: '#F97316',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    nameBn: 'বাসা ভাড়া',
    nameEn: 'To Let'
  },
  'shopping': {
    icon: ShoppingBag,
    color: '#DB2777',
    bgLight: 'bg-pink-50',
    borderLight: 'border-pink-200',
    nameBn: 'শপিং',
    nameEn: 'Shopping'
  },
  'cafes': {
    icon: Coffee,
    color: '#92400E',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    nameBn: 'ক্যাফে',
    nameEn: 'Cafes'
  },
  'tourist-places': {
    icon: Trees,
    color: '#047857',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    nameBn: 'দর্শনীয় স্থান',
    nameEn: 'Tourist Places'
  },
  'education': {
    icon: BookOpen,
    color: '#2563EB',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    nameBn: 'শিক্ষা প্রতিষ্ঠান',
    nameEn: 'Education'
  },
  'transport': {
    icon: Bus,
    color: '#0284C7',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-200',
    nameBn: 'পরিবহন',
    nameEn: 'Transport'
  },
  'mosques': {
    icon: Moon,
    color: '#0D9488',
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-200',
    nameBn: 'মসজিদ',
    nameEn: 'Mosques'
  },
  'events': {
    icon: Calendar,
    color: '#EA580C',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    nameBn: 'ইভেন্ট',
    nameEn: 'Events'
  },
  'offers': {
    icon: Tag,
    color: '#EC4899',
    bgLight: 'bg-pink-50',
    borderLight: 'border-pink-200',
    nameBn: 'অফার',
    nameEn: 'Offers'
  },
  'news': {
    icon: Newspaper,
    color: '#059669',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    nameBn: 'সংবাদ',
    nameEn: 'News'
  },
  'real-estate': {
    icon: Building2,
    color: '#4F46E5',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    nameBn: 'রিয়েল এস্টেট',
    nameEn: 'Real Estate'
  },
  'jobs': {
    icon: Briefcase,
    color: '#334155',
    bgLight: 'bg-slate-100',
    borderLight: 'border-slate-200',
    nameBn: 'চাকরি',
    nameEn: 'Jobs'
  },
  'services': {
    icon: Settings,
    color: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    nameBn: 'সেবা',
    nameEn: 'Services'
  },
  'more': {
    icon: MoreHorizontal,
    color: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    nameBn: 'আরও',
    nameEn: 'More'
  }
};

// Aliases matching alternative slugs and legacy icon names
const SLUG_ALIASES: Record<string, string> = {
  // Hotels
  'hotel': 'hotels',
  'bed': 'hotels',
  // Hospitals
  'hospital': 'hospitals',
  'plussquare': 'hospitals',
  'emergency': 'hospitals',
  'heartpulse': 'hospitals',
  // Restaurants
  'food': 'restaurants',
  'utensils': 'restaurants',
  'utensilscrossed': 'restaurants',
  // Tourist places
  'tourist': 'tourist-places',
  'landmark': 'tourist-places',
  'nature': 'tourist-places',
  'heritage': 'tourist-places',
  'trees': 'tourist-places',
  // Transport
  'train': 'transport',
  'bus': 'transport',
  // Services
  'wrench': 'services',
  'settings': 'services',
  // More
  'grid': 'more',
  'morehorizontal': 'more',
  // Blood bank
  'blood': 'blood-bank',
  'droplets': 'blood-bank',
  // Tuition
  'tuition': 'tuition-media',
  'graduationcap': 'tuition-media',
  // Shopping
  'shoppingbag': 'shopping',
  // Education
  'bookopen': 'education',
  // Real Estate
  'building2': 'real-estate'
};

export function getCategoryVisual(slugOrIcon?: string): CategoryVisual {
  if (!slugOrIcon) return CATEGORY_VISUALS['more'];
  const key = slugOrIcon.toLowerCase().trim();
  if (CATEGORY_VISUALS[key]) return CATEGORY_VISUALS[key];
  const alias = SLUG_ALIASES[key];
  if (alias && CATEGORY_VISUALS[alias]) return CATEGORY_VISUALS[alias];
  return CATEGORY_VISUALS['more'];
}

export function renderCategoryIcon(
  slugOrIcon?: string,
  className = 'w-6 h-6',
  useSignatureColor = true
): React.ReactElement {
  const visual = getCategoryVisual(slugOrIcon);
  const IconComponent = visual.icon;
  return (
    <IconComponent
      className={className}
      style={useSignatureColor ? { color: visual.color } : undefined}
    />
  );
}
