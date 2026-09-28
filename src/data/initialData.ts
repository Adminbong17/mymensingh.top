import type {
  Category,
  Business,
  NewsArticle,
  EventItem,
  OfferItem,
  BloodDonor,
  TuitionListing,
  ToLetListing,
  EmergencyContact,
  TrainSchedule,
  Review
} from '../types';

// ============================================================================
// 1. 20 CATEGORIES (Taxonomy definitions with count initialized to 0)
// ============================================================================
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name_en: 'Restaurants', name_bn: 'রেস্টুরেন্ট', slug: 'restaurants', icon: 'Utensils', color: 'rose', order_index: 1, count: 0 },
  { id: 'cat-2', name_en: 'Hotels', name_bn: 'হোটেল', slug: 'hotels', icon: 'Hotel', color: 'indigo', order_index: 2, count: 0 },
  { id: 'cat-3', name_en: 'Hospitals', name_bn: 'হাসপাতাল', slug: 'hospitals', icon: 'Hospital', color: 'red', order_index: 3, count: 0 },
  { id: 'cat-4', name_en: 'Pharmacy', name_bn: 'ফার্মেসি', slug: 'pharmacy', icon: 'Pill', color: 'emerald', order_index: 4, count: 0 },
  { id: 'cat-5', name_en: 'Blood Bank', name_bn: 'ব্লাড ব্যাংক', slug: 'blood-bank', icon: 'Droplets', color: 'red', order_index: 5, count: 0 },
  { id: 'cat-6', name_en: 'Tuition Media', name_bn: 'টিউশন মিডিয়া', slug: 'tuition-media', icon: 'GraduationCap', color: 'purple', order_index: 6, count: 0 },
  { id: 'cat-7', name_en: 'To Let', name_bn: 'বাসা ভাড়া / টু-লেট', slug: 'to-let', icon: 'Home', color: 'amber', order_index: 7, count: 0 },
  { id: 'cat-8', name_en: 'Shopping', name_bn: 'শপিং ও মার্কেট', slug: 'shopping', icon: 'ShoppingBag', color: 'blue', order_index: 8, count: 0 },
  { id: 'cat-9', name_en: 'Cafes', name_bn: 'ক্যাফে ও কফি শপ', slug: 'cafes', icon: 'Coffee', color: 'amber', order_index: 9, count: 0 },
  { id: 'cat-10', name_en: 'Tourist Places', name_bn: 'দর্শনীয় স্থান', slug: 'tourist-places', icon: 'Landmark', color: 'emerald', order_index: 10, count: 0 },
  { id: 'cat-11', name_en: 'Education', name_bn: 'শিক্ষা প্রতিষ্ঠান', slug: 'education', icon: 'BookOpen', color: 'sky', order_index: 11, count: 0 },
  { id: 'cat-12', name_en: 'Transport', name_bn: 'পরিবহন ও যাতায়াত', slug: 'transport', icon: 'Train', color: 'cyan', order_index: 12, count: 0 },
  { id: 'cat-13', name_en: 'Mosques', name_bn: 'মসজিদ ও ধর্মীয় স্থান', slug: 'mosques', icon: 'Moon', color: 'teal', order_index: 13, count: 0 },
  { id: 'cat-14', name_en: 'Events', name_bn: 'ইভেন্ট ও উৎসব', slug: 'events', icon: 'Calendar', color: 'orange', order_index: 14, count: 0 },
  { id: 'cat-15', name_en: 'Offers', name_bn: 'অফার ও ডিসকাউন্ট', slug: 'offers', icon: 'Tag', color: 'pink', order_index: 15, count: 0 },
  { id: 'cat-16', name_en: 'News', name_bn: 'সংবাদ ও বুলেটিন', slug: 'news', icon: 'Newspaper', color: 'slate', order_index: 16, count: 0 },
  { id: 'cat-17', name_en: 'Real Estate', name_bn: 'রিয়েল এস্টেট ও জমি', slug: 'real-estate', icon: 'Building2', color: 'violet', order_index: 17, count: 0 },
  { id: 'cat-18', name_en: 'Jobs', name_bn: 'চাকরি ও ক্যারিয়ার', slug: 'jobs', icon: 'Briefcase', color: 'blue', order_index: 18, count: 0 },
  { id: 'cat-19', name_en: 'Services', name_bn: 'পেশাদার সার্ভিস', slug: 'services', icon: 'Wrench', color: 'yellow', order_index: 19, count: 0 },
  { id: 'cat-20', name_en: 'More', name_bn: 'আরও সেবা', slug: 'more', icon: 'Grid', color: 'gray', order_index: 20, count: 0 },
];

// ============================================================================
// 2. BUSINESSES (Empty starter - only real listings from admin/database)
// ============================================================================
export const INITIAL_BUSINESSES: Business[] = [];

// ============================================================================
// 3. NEWS ITEMS (Empty starter - only real news from admin/database)
// ============================================================================
export const INITIAL_NEWS: NewsArticle[] = [];

// ============================================================================
// 4. UPCOMING EVENTS (Empty starter - only real events from admin/database)
// ============================================================================
export const INITIAL_EVENTS: EventItem[] = [];

// ============================================================================
// 5. LATEST OFFERS (Empty starter - only real offers from admin/database)
// ============================================================================
export const INITIAL_OFFERS: OfferItem[] = [];

// ============================================================================
// 6. SPECIAL SERVICES (BLOOD BANK, TUITION MEDIA, TO-LET)
// ============================================================================
export const INITIAL_BLOOD_DONORS: BloodDonor[] = [];
export const INITIAL_TUITION_LISTINGS: TuitionListing[] = [];
export const INITIAL_TO_LET_LISTINGS: ToLetListing[] = [];

// ============================================================================
// 7. LOCATION DATA (Mymensingh Administrative Geography)
// ============================================================================
export const MYMENSINGH_DISTRICT = 'ময়মনসিংহ';

export const MYMENSINGH_UPAZILAS = [
  'ময়মনসিংহ সদর',
  'মুক্তাগাছা',
  'ত্রিশাল',
  'ভালুকা',
  'ফুলপুর',
  'গফরগাঁও',
  'নান্দাইল',
  'ঈশ্বরগঞ্জ',
  'ধোবাউড়া',
  'হালুয়াঘাট',
  'ফুলবাড়িয়া',
  'তারাকান্দা',
  'গৌরীপুর'
];

export const MYMENSINGH_UNIONS_MAP: Record<string, string[]> = {
  'ময়মনসিংহ সদর': ['সিটি ওয়ার্ড ০১-১০', 'সিটি ওয়ার্ড ১১-২১', 'দাপুনিয়া', 'বয়রা', 'ভাবখালী', 'চর ঈশ্বরদিয়া', 'খাগডহর', 'সিরতা'],
  'মুক্তাগাছা': ['মুক্তাগাছা পৌরসভা', 'কাঁঠাল', 'তারাটি', 'কুমারগাতা', 'দাওগাঁও', 'ঘোগা', 'মানকোন'],
  'ত্রিশাল': ['ত্রিশাল পৌরসভা', 'ধানীখোলা', 'বৈলর', 'কাঁঠাল', 'রামপুর', 'সাখুয়া', 'আমিরাবাড়ী'],
  'ভালুকা': ['ভালুকা পৌরসভা', 'উথুরা', 'মেদুয়ার', 'হবিরবাড়ী', 'মল্লিকবাড়ী', 'বিরুনিয়া'],
  'ফুলপুর': ['ফুলপুর পৌরসভা', 'ছনধরা', 'রামভদ্রপুর', 'বওলা', 'ফুলপুর সদর'],
  'গফরগাঁও': ['গফরগাঁও পৌরসভা', 'রসুলপুর', 'বারবাড়িয়া', 'পাঁচবাগ', 'সালটিয়া'],
  'নান্দাইল': ['নান্দাইল পৌরসভা', 'বেতাগৈর', 'মোয়াজ্জেমপুর', 'গাংগাইল', 'চণ্ডীপাশা'],
  'ঈশ্বরগঞ্জ': ['ঈশ্বরগঞ্জ পৌরসভা', 'জাটিয়া', 'সোহাগী', 'সরস্বতীপুর', 'উচাখিলা'],
  'ধোবাউড়া': ['ধোবাউড়া সদর', 'বাঘবেড়', 'গামারীতলা', 'পোড়াকান্দুলিয়া'],
  'হালুয়াঘাট': ['হালুয়াঘাট পৌরসভা', 'বিলডোরা', 'ধুরইল', 'গজহরপুর'],
  'ফুলবাড়িয়া': ['ফুলবাড়ীয়া পৌরসভা', 'বাকতা', 'কুশমাইল', 'রাঙ্গামাটিয়া'],
  'তারাকান্দা': ['তারাকান্দা সদর', 'গালাগাঁও', 'বানিহালা', 'বিসকা'],
  'গৌরীপুর': ['গৌরীপুর পৌরসভা', 'বোকাইনগর', 'মাওহা', 'রামগোপালপুর']
};

// Kept for backward compatibility
export const INITIAL_PLACES = INITIAL_BUSINESSES;

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'em-1', title_en: 'MMCH Emergency Hotline', title_bn: 'ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল জরুরি বিভাগ', category: 'hospital', phone: '091-66063', is_24_hours: true, address_en: 'Charpara', address_bn: 'চরপাড়া' },
  { id: 'em-2', title_en: 'National Helpline', title_bn: 'জাতীয় জরুরি সেবা (পুলিশ/অ্যাম্বুলেন্স)', category: 'helpline', phone: '999', is_24_hours: true, address_en: 'National', address_bn: 'সারাদেশে' },
  { id: 'em-3', title_en: 'Kotwali Model Police Station', title_bn: 'কোতোয়ালী মডেল থানা ময়মনসিংহ', category: 'police', phone: '01713-373650', is_24_hours: true, address_en: 'Kachijhuli', address_bn: 'কাঁচিঝুলি' },
];

export const INITIAL_TRAIN_SCHEDULES: TrainSchedule[] = [
  { id: 'tr-1', train_name_en: 'Teesta Express', train_name_bn: 'তীস্তা এক্সপ্রেস (৭০৭/৭০৮)', train_number: '707/708', route_en: 'Dhaka - Mymensingh', route_bn: 'ঢাকা - ময়মনসিংহ', departure_time: '07:30 AM', arrival_time: '10:45 AM', off_day_en: 'Monday', off_day_bn: 'সোমবার' }
];

export const INITIAL_REVIEWS: Review[] = [];
