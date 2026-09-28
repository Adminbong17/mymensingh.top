export type Language = 'en' | 'bn';

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  icon: string;
  color: string;
  order_index: number;
  count?: number;
}

export interface Business {
  id: string;
  name: string;
  name_en?: string;
  name_bn?: string;
  category: string;
  category_id?: string;
  category_slug: string;
  rating: number;
  review_count: number;
  location: string;
  area?: string;
  district?: string;
  upazila?: string;
  union_ward?: string;
  phone?: string;
  website?: string;
  image_url: string;
  gallery_images?: string[];
  description?: string;
  description_en?: string;
  description_bn?: string;
  tagline_en?: string;
  tagline_bn?: string;
  address_en?: string;
  address_bn?: string;
  opening_hours?: string;
  opening_hours_en?: string;
  opening_hours_bn?: string;
  entry_fee_en?: string;
  entry_fee_bn?: string;
  price_range?: string;
  is_featured?: boolean;
  tags?: string[];
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

// Backward compatibility alias
export type Place = Business;

export interface NewsArticle {
  id: string;
  title: string;
  title_en?: string;
  excerpt: string;
  category: string;
  date: string;
  image_url: string;
  read_time: string;
  content: string;
}

export interface EventItem {
  id: string;
  title: string;
  title_bn: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image_url: string;
  entry_fee: string;
  description: string;
}

export interface OfferItem {
  id: string;
  title: string;
  discount: string;
  business_name: string;
  category: string;
  expiry_date: string;
  promo_code: string;
  image_url: string;
  description: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  upazila: string;
  phone: string;
  availability: 'Available' | 'Unavailable';
  last_donation?: string;
}

export interface TuitionListing {
  id: string;
  title: string;
  class_level: string;
  subjects: string[];
  location: string;
  salary: string;
  days_per_week: string;
  phone: string;
  posted_date: string;
}

export interface ToLetListing {
  id: string;
  title: string;
  type: 'Family' | 'Bachelor' | 'Sublet' | 'Commercial';
  rent: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  phone: string;
  image_url: string;
  available_from: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  title_en: string;
  title_bn: string;
  category: 'police' | 'hospital' | 'fire' | 'ambulance' | 'blood' | 'helpline';
  phone: string;
  alt_phone?: string;
  address_en: string;
  address_bn: string;
  is_24_hours: boolean;
}

export interface TrainSchedule {
  id: string;
  train_name_en: string;
  train_name_bn: string;
  train_number: string;
  route_en: string;
  route_bn: string;
  departure_time: string;
  arrival_time: string;
  off_day_en: string;
  off_day_bn: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_bn: string;
  slug: string;
  author: string;
  author_avatar?: string;
  category: string;
  date: string;
  read_time: string;
  image_url: string;
  excerpt: string;
  content: string[];
  tags: string[];
}
