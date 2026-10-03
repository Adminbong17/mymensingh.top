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
  MoreHorizontal,
  // Subcategories & popular directory icons
  Car,
  Bike,
  Truck,
  Fuel,
  Stethoscope,
  HeartPulse,
  Ambulance,
  Scissors,
  Shirt,
  Sparkles,
  Dumbbell,
  Laptop,
  Camera,
  Tv,
  Baby,
  Plane,
  Scale,
  ShieldCheck,
  Paintbrush,
  Hammer,
  Wrench,
  Pizza,
  Cake,
  Apple,
  Fish,
  Store,
  Landmark,
  Music,
  Film,
  Glasses,
  Clock,
  MapPin,
  PhoneCall
} from 'lucide-react';

export interface CategoryVisual {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgLight: string;
  borderLight: string;
  nameBn: string;
  nameEn: string;
}

export interface AvailableIconOption {
  name: string;
  labelBn: string;
  labelEn: string;
  group: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

// 20 Core Platform Categories
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

// Popular Subcategories & Extended Icons
export const SUB_CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  'car': { icon: Car, color: '#0284C7', bgLight: 'bg-sky-50', borderLight: 'border-sky-200', nameBn: 'গাড়ি / রেন্ট-এ-কার', nameEn: 'Car & Rental' },
  'bike': { icon: Bike, color: '#EA580C', bgLight: 'bg-orange-50', borderLight: 'border-orange-200', nameBn: 'মোটরসাইকেল ও বাইক', nameEn: 'Bike & Service' },
  'truck': { icon: Truck, color: '#0369A1', bgLight: 'bg-sky-50', borderLight: 'border-sky-200', nameBn: 'ট্রাক ও কুরিয়ার', nameEn: 'Truck & Logistics' },
  'fuel': { icon: Fuel, color: '#D97706', bgLight: 'bg-amber-50', borderLight: 'border-amber-200', nameBn: 'ফিলিং স্টেশন / গ্যাস', nameEn: 'Fuel & Gas' },
  'scissors': { icon: Scissors, color: '#EC4899', bgLight: 'bg-pink-50', borderLight: 'border-pink-200', nameBn: 'সেলুন ও পার্লার', nameEn: 'Salon & Spa' },
  'stethoscope': { icon: Stethoscope, color: '#0284C7', bgLight: 'bg-sky-50', borderLight: 'border-sky-200', nameBn: 'ডাক্তার ও কনসালটেন্ট', nameEn: 'Doctors' },
  'heartpulse': { icon: HeartPulse, color: '#E11D48', bgLight: 'bg-rose-50', borderLight: 'border-rose-200', nameBn: 'ডায়াগনস্টিক ও ল্যাব', nameEn: 'Diagnostic Center' },
  'ambulance': { icon: Ambulance, color: '#DC2626', bgLight: 'bg-red-50', borderLight: 'border-red-200', nameBn: 'অ্যাম্বুলেন্স', nameEn: 'Ambulance' },
  'dumbbell': { icon: Dumbbell, color: '#EF4444', bgLight: 'bg-red-50', borderLight: 'border-red-200', nameBn: 'জিম ও ফিটনেস', nameEn: 'Gym & Fitness' },
  'shirt': { icon: Shirt, color: '#9333EA', bgLight: 'bg-purple-50', borderLight: 'border-purple-200', nameBn: 'পোশাক ও ফ্যাশন', nameEn: 'Fashion & Tailoring' },
  'store': { icon: Store, color: '#16A34A', bgLight: 'bg-emerald-50', borderLight: 'border-emerald-200', nameBn: 'মুদি ও সুপারশপ', nameEn: 'Grocery & Store' },
  'pizza': { icon: Pizza, color: '#F97316', bgLight: 'bg-orange-50', borderLight: 'border-orange-200', nameBn: 'ফাস্ট ফুড ও পিৎজা', nameEn: 'Fast Food' },
  'cake': { icon: Cake, color: '#DB2777', bgLight: 'bg-pink-50', borderLight: 'border-pink-200', nameBn: 'বেকারি ও মিষ্টি', nameEn: 'Bakery & Sweets' },
  'apple': { icon: Apple, color: '#16A34A', bgLight: 'bg-emerald-50', borderLight: 'border-emerald-200', nameBn: 'ফলমূল ও অরগানিক', nameEn: 'Fruits & Organic' },
  'fish': { icon: Fish, color: '#0284C7', bgLight: 'bg-sky-50', borderLight: 'border-sky-200', nameBn: 'মাছ ও কাঁচাবাজার', nameEn: 'Fish & Market' },
  'laptop': { icon: Laptop, color: '#2563EB', bgLight: 'bg-blue-50', borderLight: 'border-blue-200', nameBn: 'কম্পিউটার ও আইটি', nameEn: 'Computers & IT' },
  'camera': { icon: Camera, color: '#475569', bgLight: 'bg-slate-100', borderLight: 'border-slate-200', nameBn: 'ফটোগ্রাফি ও স্টুডিও', nameEn: 'Photography & Studio' },
  'tv': { icon: Tv, color: '#6366F1', bgLight: 'bg-indigo-50', borderLight: 'border-indigo-200', nameBn: 'ইলেকট্রনিক্স ও শোরুম', nameEn: 'Electronics & TV' },
  'scale': { icon: Scale, color: '#B45309', bgLight: 'bg-amber-50', borderLight: 'border-amber-200', nameBn: 'আইনজীবী ও নোটারি', nameEn: 'Lawyers & Legal' },
  'landmark': { icon: Landmark, color: '#0F766E', bgLight: 'bg-teal-50', borderLight: 'border-teal-200', nameBn: 'ব্যাংক ও আর্থিক প্রতিষ্ঠান', nameEn: 'Bank & Finance' },
  'baby': { icon: Baby, color: '#F43F5E', bgLight: 'bg-rose-50', borderLight: 'border-rose-200', nameBn: 'শিশু যত্ন ও খেলনা', nameEn: 'Baby & Kids' },
  'plane': { icon: Plane, color: '#0284C7', bgLight: 'bg-sky-50', borderLight: 'border-sky-200', nameBn: 'ট্রাভেল ও হজ এজেন্সি', nameEn: 'Travel & Aviation' },
  'shieldcheck': { icon: ShieldCheck, color: '#059669', bgLight: 'bg-emerald-50', borderLight: 'border-emerald-200', nameBn: 'সিকিউরিটি সার্ভিস', nameEn: 'Security Services' },
  'paintbrush': { icon: Paintbrush, color: '#F59E0B', bgLight: 'bg-amber-50', borderLight: 'border-amber-200', nameBn: 'পেইন্ট ও ইন্টেরিয়র', nameEn: 'Interior & Paint' },
  'hammer': { icon: Hammer, color: '#78716C', bgLight: 'bg-stone-100', borderLight: 'border-stone-200', nameBn: 'হার্ডওয়্যার ও নির্মাণ', nameEn: 'Hardware & Build' },
  'wrench': { icon: Wrench, color: '#3B82F6', bgLight: 'bg-blue-50', borderLight: 'border-blue-200', nameBn: 'মেরামত ও টেকনিশিয়ান', nameEn: 'Repair & Tech' },
  'music': { icon: Music, color: '#8B5CF6', bgLight: 'bg-purple-50', borderLight: 'border-purple-200', nameBn: 'সঙ্গীত ও বাদ্যযন্ত্র', nameEn: 'Music & Audio' },
  'film': { icon: Film, color: '#D97706', bgLight: 'bg-amber-50', borderLight: 'border-amber-200', nameBn: 'সিনেমা ও বিনোদন', nameEn: 'Cinema & Media' },
  'glasses': { icon: Glasses, color: '#475569', bgLight: 'bg-slate-100', borderLight: 'border-slate-200', nameBn: 'চশমা ও অপটিক্যাল', nameEn: 'Opticals & Eyewear' },
  'clock': { icon: Clock, color: '#B45309', bgLight: 'bg-amber-50', borderLight: 'border-amber-200', nameBn: 'ঘড়ি ও জুয়েলারি', nameEn: 'Watch & Jewelry' },
  'sparkles': { icon: Sparkles, color: '#EAB308', bgLight: 'bg-yellow-50', borderLight: 'border-yellow-200', nameBn: 'উপহার ও বিশেষ সেবা', nameEn: 'Gifts & Specials' },
  'mappin': { icon: MapPin, color: '#EF4444', bgLight: 'bg-red-50', borderLight: 'border-red-200', nameBn: 'লোকেশন ও পর্যটন গাইড', nameEn: 'Location & Guide' },
  'phonecall': { icon: PhoneCall, color: '#16A34A', bgLight: 'bg-emerald-50', borderLight: 'border-emerald-200', nameBn: 'জরুরি হেল্পলাইন', nameEn: 'Helpline & Contacts' }
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
  // Restaurants
  'food': 'restaurants',
  'utensils': 'restaurants',
  'utensilscrossed': 'restaurants',
  // Tourist places
  'tourist': 'tourist-places',
  'nature': 'tourist-places',
  'heritage': 'tourist-places',
  'trees': 'tourist-places',
  // Transport
  'train': 'transport',
  // Services
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
  'building2': 'real-estate',
  // Subcategory aliases
  'doctor': 'stethoscope',
  'gym': 'dumbbell',
  'fitness': 'dumbbell',
  'salon': 'scissors',
  'parlour': 'scissors',
  'parlor': 'scissors',
  'tailor': 'shirt',
  'fashion': 'shirt',
  'grocery': 'store',
  'computer': 'laptop',
  'it': 'laptop',
  'studio': 'camera',
  'photo': 'camera',
  'electronics': 'tv',
  'lawyer': 'scale',
  'legal': 'scale',
  'bank': 'landmark',
  'travel': 'plane',
  'security': 'shieldcheck',
  'repair': 'wrench',
  'hardware': 'hammer',
  'interior': 'paintbrush',
  'bakery': 'cake',
  'sweet': 'cake',
  'fastfood': 'pizza'
};

// Comprehensive list for Admin Modal Icon Picker
export const AVAILABLE_CATEGORY_ICONS: AvailableIconOption[] = [
  // Core Categories
  { name: 'Utensils', labelBn: 'রেস্টুরেন্ট / খাবার', labelEn: 'Restaurants', group: 'খাবার ও রেস্তোরাঁ', color: '#F97316', icon: Utensils },
  { name: 'Coffee', labelBn: 'ক্যাফে ও কফি শপ', labelEn: 'Cafes', group: 'খাবার ও রেস্তোরাঁ', color: '#92400E', icon: Coffee },
  { name: 'Pizza', labelBn: 'ফাস্ট ফুড ও পিৎজা', labelEn: 'Fast Food', group: 'খাবার ও রেস্তোরাঁ', color: '#F97316', icon: Pizza },
  { name: 'Cake', labelBn: 'বেকারি ও মিষ্টি', labelEn: 'Bakery & Sweets', group: 'খাবার ও রেস্তোরাঁ', color: '#DB2777', icon: Cake },
  { name: 'Store', labelBn: 'মুদি ও সুপারশপ', labelEn: 'Grocery Store', group: 'খাবার ও রেস্তোরাঁ', color: '#16A34A', icon: Store },
  { name: 'Apple', labelBn: 'ফলমূল ও অরগানিক', labelEn: 'Fruits & Organic', group: 'খাবার ও রেস্তোরাঁ', color: '#16A34A', icon: Apple },
  { name: 'Fish', labelBn: 'মাছ ও কাঁচাবাজার', labelEn: 'Fish & Market', group: 'খাবার ও রেস্তোরাঁ', color: '#0284C7', icon: Fish },

  // Health & Medical
  { name: 'PlusSquare', labelBn: 'হাসপাতাল ও ক্লিনিক', labelEn: 'Hospitals', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#E11D48', icon: PlusSquare },
  { name: 'Pill', labelBn: 'ফার্মেসি ও ঔষধ', labelEn: 'Pharmacy', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#10B981', icon: Pill },
  { name: 'Droplets', labelBn: 'রক্ত ব্যাংক ও ডোনার', labelEn: 'Blood Bank', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#EF4444', icon: Droplets },
  { name: 'Stethoscope', labelBn: 'ডাক্তার ও কনসালটেন্ট', labelEn: 'Doctors', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#0284C7', icon: Stethoscope },
  { name: 'HeartPulse', labelBn: 'ডায়াগনস্টিক ও ল্যাব', labelEn: 'Diagnostic Center', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#E11D48', icon: HeartPulse },
  { name: 'Ambulance', labelBn: 'অ্যাম্বুলেন্স সার্ভিস', labelEn: 'Ambulance', group: 'স্বাস্থ্য ও চিকিৎসা', color: '#DC2626', icon: Ambulance },

  // Living & Hospitality
  { name: 'Bed', labelBn: 'হোটেল ও রিসোর্ট', labelEn: 'Hotels', group: 'আবাসন ও ভ্রমণ', color: '#2563EB', icon: Bed },
  { name: 'Home', labelBn: 'বাসা ভাড়া / টু-লেট', labelEn: 'To Let / Rent', group: 'আবাসন ও ভ্রমণ', color: '#F97316', icon: Home },
  { name: 'Building2', labelBn: 'রিয়েল এস্টেট ও জমি', labelEn: 'Real Estate', group: 'আবাসন ও ভ্রমণ', color: '#4F46E5', icon: Building2 },
  { name: 'Trees', labelBn: 'দর্শনীয় ও পর্যটন স্থান', labelEn: 'Tourist Places', group: 'আবাসন ও ভ্রমণ', color: '#047857', icon: Trees },
  { name: 'Moon', labelBn: 'মসজিদ ও ধর্মীয় স্থান', labelEn: 'Mosques', group: 'ধর্ম ও সংস্কৃতি', color: '#0D9488', icon: Moon },

  // Transport & Vehicles
  { name: 'Bus', labelBn: 'বাস ও গণপরিবহন', labelEn: 'Bus & Transport', group: 'পরিবহন ও গাড়ি', color: '#0284C7', icon: Bus },
  { name: 'Car', labelBn: 'গাড়ি ও রেন্ট-এ-কার', labelEn: 'Car & Rental', group: 'পরিবহন ও গাড়ি', color: '#0284C7', icon: Car },
  { name: 'Bike', labelBn: 'মোটরসাইকেল ও বাইক', labelEn: 'Bike & Service', group: 'পরিবহন ও গাড়ি', color: '#EA580C', icon: Bike },
  { name: 'Truck', labelBn: 'ট্রাক ও কুরিয়ার পার্সেল', labelEn: 'Logistics & Courier', group: 'পরিবহন ও গাড়ি', color: '#0369A1', icon: Truck },
  { name: 'Fuel', labelBn: 'ফিলিং স্টেশন ও সিএনজি', labelEn: 'Fuel & Gas Station', group: 'পরিবহন ও গাড়ি', color: '#D97706', icon: Fuel },
  { name: 'Plane', labelBn: 'ট্রাভেল ও হজ এজেন্সি', labelEn: 'Travel & Airlines', group: 'পরিবহন ও গাড়ি', color: '#0284C7', icon: Plane },

  // Shopping & Fashion
  { name: 'ShoppingBag', labelBn: 'শপিং ও মার্কেট', labelEn: 'Shopping & Malls', group: 'শপিং ও লাইফস্টাইল', color: '#DB2777', icon: ShoppingBag },
  { name: 'Shirt', labelBn: 'পোশাক ও দর্জি / ফ্যাশন', labelEn: 'Fashion & Tailoring', group: 'শপিং ও লাইফস্টাইল', color: '#9333EA', icon: Shirt },
  { name: 'Scissors', labelBn: 'সেলুন ও বিউটি পার্লার', labelEn: 'Salon & Spa', group: 'শপিং ও লাইফস্টাইল', color: '#EC4899', icon: Scissors },
  { name: 'Dumbbell', labelBn: 'জিম ও ফিটনেস সেন্টার', labelEn: 'Gym & Fitness', group: 'শপিং ও লাইফস্টাইল', color: '#EF4444', icon: Dumbbell },
  { name: 'Glasses', labelBn: 'চশমা ও অপটিক্যাল', labelEn: 'Opticals', group: 'শপিং ও লাইফস্টাইল', color: '#475569', icon: Glasses },
  { name: 'Clock', labelBn: 'ঘড়ি ও জুয়েলারি', labelEn: 'Watch & Jewelry', group: 'শপিং ও লাইফস্টাইল', color: '#B45309', icon: Clock },
  { name: 'Tag', labelBn: 'অফার ও ডিসকাউন্ট', labelEn: 'Offers', group: 'শপিং ও লাইফস্টাইল', color: '#EC4899', icon: Tag },

  // Education & Professional
  { name: 'BookOpen', labelBn: 'শিক্ষা প্রতিষ্ঠান ও স্কুল', labelEn: 'Education', group: 'শিক্ষা ও ক্যারিয়ার', color: '#2563EB', icon: BookOpen },
  { name: 'GraduationCap', labelBn: 'টিউশন মিডিয়া ও কোচিং', labelEn: 'Tuition Media', group: 'শিক্ষা ও ক্যারিয়ার', color: '#7C3AED', icon: GraduationCap },
  { name: 'Briefcase', labelBn: 'চাকরি ও ক্যারিয়ার', labelEn: 'Jobs & Careers', group: 'শিক্ষা ও ক্যারিয়ার', color: '#334155', icon: Briefcase },
  { name: 'Scale', labelBn: 'আইনজীবী ও নোটারি', labelEn: 'Lawyers & Legal', group: 'শিক্ষা ও ক্যারিয়ার', color: '#B45309', icon: Scale },
  { name: 'Landmark', labelBn: 'ব্যাংক ও আর্থিক প্রতিষ্ঠান', labelEn: 'Bank & Finance', group: 'শিক্ষা ও ক্যারিয়ার', color: '#0F766E', icon: Landmark },

  // Tech, Services & Media
  { name: 'Laptop', labelBn: 'কম্পিউটার ও আইটি সার্ভিস', labelEn: 'Computers & IT', group: 'প্রযুক্তি ও সেবা', color: '#2563EB', icon: Laptop },
  { name: 'Camera', labelBn: 'ফটোগ্রাফি ও স্টুডিও', labelEn: 'Photography & Studio', group: 'প্রযুক্তি ও সেবা', color: '#475569', icon: Camera },
  { name: 'Tv', labelBn: 'ইলেকট্রনিক্স ও গ্যাজেট', labelEn: 'Electronics', group: 'প্রযুক্তি ও সেবা', color: '#6366F1', icon: Tv },
  { name: 'Settings', labelBn: 'পেশাদার সার্ভিস ও মেকানিক', labelEn: 'Services', group: 'প্রযুক্তি ও সেবা', color: '#3B82F6', icon: Settings },
  { name: 'Wrench', labelBn: 'প্লাম্বার ও ইলেকট্রিশিয়ান', labelEn: 'Technician & Repair', group: 'প্রযুক্তি ও সেবা', color: '#3B82F6', icon: Wrench },
  { name: 'Paintbrush', labelBn: 'রং ও ইন্টেরিয়র ডিজাইন', labelEn: 'Interior & Paint', group: 'প্রযুক্তি ও সেবা', color: '#F59E0B', icon: Paintbrush },
  { name: 'Hammer', labelBn: 'হার্ডওয়্যার ও নির্মাণ সামগ্রী', labelEn: 'Hardware & Build', group: 'প্রযুক্তি ও সেবা', color: '#78716C', icon: Hammer },
  { name: 'ShieldCheck', labelBn: 'সিকিউরিটি ও গার্ড সার্ভিস', labelEn: 'Security Services', group: 'প্রযুক্তি ও সেবা', color: '#059669', icon: ShieldCheck },

  // News, Events & Community
  { name: 'Newspaper', labelBn: 'সংবাদ ও বুলেটিন', labelEn: 'News', group: 'সংবাদ ও তথ্য', color: '#059669', icon: Newspaper },
  { name: 'Calendar', labelBn: 'ইভেন্ট ও উৎসব', labelEn: 'Events', group: 'সংবাদ ও তথ্য', color: '#EA580C', icon: Calendar },
  { name: 'Sparkles', labelBn: 'বিশেষ ফিচার ও অফার', labelEn: 'Specials', group: 'সংবাদ ও তথ্য', color: '#EAB308', icon: Sparkles },
  { name: 'Baby', labelBn: 'শিশু যত্ন ও খেলনা', labelEn: 'Baby & Kids', group: 'সাধারণ ও অন্যান্য', color: '#F43F5E', icon: Baby },
  { name: 'Music', labelBn: 'সঙ্গীত ও সংস্কৃতি', labelEn: 'Music & Culture', group: 'সাধারণ ও অন্যান্য', color: '#8B5CF6', icon: Music },
  { name: 'Film', labelBn: 'সিনেমা ও বিনোদন', labelEn: 'Entertainment', group: 'সাধারণ ও অন্যান্য', color: '#D97706', icon: Film },
  { name: 'PhoneCall', labelBn: 'জরুরি হেল্পলাইন নম্বর', labelEn: 'Helpline', group: 'সাধারণ ও অন্যান্য', color: '#16A34A', icon: PhoneCall },
  { name: 'MapPin', labelBn: 'লোকাল গাইড ও মানচিত্র', labelEn: 'Local Guide', group: 'সাধারণ ও অন্যান্য', color: '#EF4444', icon: MapPin },
  { name: 'MoreHorizontal', labelBn: 'আরও অন্যান্য সেবা', labelEn: 'More Services', group: 'সাধারণ ও অন্যান্য', color: '#3B82F6', icon: MoreHorizontal }
];

export function getCategoryVisual(slugOrIcon?: string): CategoryVisual {
  if (!slugOrIcon) return CATEGORY_VISUALS['more'];
  const key = slugOrIcon.toLowerCase().trim();

  // 1. Direct match in core platform categories
  if (CATEGORY_VISUALS[key]) return CATEGORY_VISUALS[key];

  // 2. Direct match in subcategories & extended icons
  if (SUB_CATEGORY_VISUALS[key]) return SUB_CATEGORY_VISUALS[key];

  // 3. Match via alias
  const alias = SLUG_ALIASES[key];
  if (alias) {
    if (CATEGORY_VISUALS[alias]) return CATEGORY_VISUALS[alias];
    if (SUB_CATEGORY_VISUALS[alias]) return SUB_CATEGORY_VISUALS[alias];
  }

  // 4. Case-insensitive match in AVAILABLE_CATEGORY_ICONS
  const foundOption = AVAILABLE_CATEGORY_ICONS.find(
    opt => opt.name.toLowerCase() === key || opt.labelEn.toLowerCase() === key
  );
  if (foundOption) {
    return {
      icon: foundOption.icon,
      color: foundOption.color,
      bgLight: 'bg-slate-50',
      borderLight: 'border-slate-200',
      nameBn: foundOption.labelBn,
      nameEn: foundOption.labelEn
    };
  }

  // Fallback
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
