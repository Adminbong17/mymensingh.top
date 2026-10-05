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
  { id: 'cat-1', name_en: 'Restaurants', name_bn: 'রেস্টুরেন্ট', slug: 'restaurants', icon: 'Utensils', color: 'orange', order_index: 1, count: 0, parent_id: null },
  { id: 'cat-2', name_en: 'Hotels', name_bn: 'হোটেল', slug: 'hotels', icon: 'Bed', color: 'blue', order_index: 2, count: 0, parent_id: null },
  { id: 'cat-3', name_en: 'Hospitals', name_bn: 'হাসপাতাল', slug: 'hospitals', icon: 'PlusSquare', color: 'rose', order_index: 3, count: 0, parent_id: null },
  { id: 'cat-doctor', name_en: 'Doctors', name_bn: 'ডাক্তার ও বিশেষজ্ঞ', slug: 'doctors', icon: 'Stethoscope', color: 'teal', order_index: 4, count: 0, parent_id: null },
  { id: 'cat-4', name_en: 'Pharmacy', name_bn: 'ফার্মেসি', slug: 'pharmacy', icon: 'Pill', color: 'emerald', order_index: 5, count: 0, parent_id: null },
  { id: 'cat-5', name_en: 'Blood Bank', name_bn: 'ব্লাড ব্যাংক', slug: 'blood-bank', icon: 'Droplets', color: 'red', order_index: 5, count: 0, parent_id: null },
  { id: 'cat-6', name_en: 'Tuition Media', name_bn: 'টিউশন মিডিয়া', slug: 'tuition-media', icon: 'GraduationCap', color: 'purple', order_index: 6, count: 0, parent_id: null },
  { id: 'cat-7', name_en: 'To Let', name_bn: 'বাসা ভাড়া / টু-লেট', slug: 'to-let', icon: 'Home', color: 'orange', order_index: 7, count: 0, parent_id: null },
  { id: 'cat-8', name_en: 'Shopping', name_bn: 'শপিং ও মার্কেট', slug: 'shopping', icon: 'ShoppingBag', color: 'pink', order_index: 8, count: 0, parent_id: null },
  { id: 'cat-9', name_en: 'Cafes', name_bn: 'ক্যাফে ও কফি শপ', slug: 'cafes', icon: 'Coffee', color: 'amber', order_index: 9, count: 0, parent_id: null },
  { id: 'cat-10', name_en: 'Tourist Places', name_bn: 'দর্শনীয় স্থান', slug: 'tourist-places', icon: 'Trees', color: 'emerald', order_index: 10, count: 0, parent_id: null },
  { id: 'cat-11', name_en: 'Education', name_bn: 'শিক্ষা প্রতিষ্ঠান', slug: 'education', icon: 'BookOpen', color: 'blue', order_index: 11, count: 0, parent_id: null },
  { id: 'cat-12', name_en: 'Transport', name_bn: 'পরিবহন ও যাতায়াত', slug: 'transport', icon: 'Bus', color: 'sky', order_index: 12, count: 0, parent_id: null },
  { id: 'cat-13', name_en: 'Mosques', name_bn: 'মসজিদ ও ধর্মীয় স্থান', slug: 'mosques', icon: 'Moon', color: 'teal', order_index: 13, count: 0, parent_id: null },
  { id: 'cat-14', name_en: 'Events', name_bn: 'ইভেন্ট ও উৎসব', slug: 'events', icon: 'Calendar', color: 'orange', order_index: 14, count: 0, parent_id: null },
  { id: 'cat-15', name_en: 'Offers', name_bn: 'অফার ও ডিসকাউন্ট', slug: 'offers', icon: 'Tag', color: 'pink', order_index: 15, count: 0, parent_id: null },
  { id: 'cat-16', name_en: 'News', name_bn: 'সংবাদ ও বুলেটিন', slug: 'news', icon: 'Newspaper', color: 'emerald', order_index: 16, count: 0, parent_id: null },
  { id: 'cat-17', name_en: 'Real Estate', name_bn: 'রিয়েল এস্টেট ও জমি', slug: 'real-estate', icon: 'Building2', color: 'indigo', order_index: 17, count: 0, parent_id: null },
  { id: 'cat-18', name_en: 'Jobs', name_bn: 'চাকরি ও ক্যারিয়ার', slug: 'jobs', icon: 'Briefcase', color: 'slate', order_index: 18, count: 0, parent_id: null },
  { id: 'cat-19', name_en: 'Services', name_bn: 'পেশাদার সার্ভিস', slug: 'services', icon: 'Settings', color: 'blue', order_index: 19, count: 0, parent_id: null },
  { id: 'cat-20', name_en: 'More', name_bn: 'আরও সেবা', slug: 'more', icon: 'MoreHorizontal', color: 'blue', order_index: 20, count: 0, parent_id: null },
];

export const INITIAL_SUBCATEGORIES: Category[] = [
  // Restaurants
  { id: 'sub-101', name_en: 'Bengali & Biryani', name_bn: 'বাংলা খাবার ও বিরিয়ানি', slug: 'bengali-biryani', icon: 'Utensils', color: 'orange', parent_id: 'cat-1', order_index: 1, count: 0 },
  { id: 'sub-102', name_en: 'Fast Food & Pizza', name_bn: 'ফাস্ট ফুড ও পিৎজা', slug: 'fast-food', icon: 'Pizza', color: 'orange', parent_id: 'cat-1', order_index: 2, count: 0 },
  { id: 'sub-103', name_en: 'Chinese & Thai', name_bn: 'চাইনিজ ও থাই', slug: 'chinese-thai', icon: 'Utensils', color: 'orange', parent_id: 'cat-1', order_index: 3, count: 0 },
  { id: 'sub-104', name_en: 'Cafe & Coffee', name_bn: 'ক্যাফে ও কফি', slug: 'cafe-coffee', icon: 'Coffee', color: 'amber', parent_id: 'cat-1', order_index: 4, count: 0 },
  { id: 'sub-105', name_en: 'Bakery & Sweets', name_bn: 'বেকারি ও মিষ্টি', slug: 'bakery-sweets', icon: 'Cake', color: 'pink', parent_id: 'cat-1', order_index: 5, count: 0 },

  // Hotels
  { id: 'sub-201', name_en: 'Residential Hotel', name_bn: 'আবাসিক হোটেল', slug: 'residential-hotel', icon: 'Bed', color: 'blue', parent_id: 'cat-2', order_index: 1, count: 0 },
  { id: 'sub-202', name_en: 'Resort & Guest House', name_bn: 'রিসোর্ট ও গেস্ট হাউজ', slug: 'resort-guesthouse', icon: 'Trees', color: 'emerald', parent_id: 'cat-2', order_index: 2, count: 0 },
  { id: 'sub-203', name_en: 'Hostel & Mess', name_bn: 'হোস্টেল ও মেস', slug: 'hostel-mess', icon: 'Home', color: 'blue', parent_id: 'cat-2', order_index: 3, count: 0 },

  // Hospitals
  { id: 'sub-301', name_en: 'Government Hospital', name_bn: 'সরকারি হাসপাতাল', slug: 'government-hospital', icon: 'PlusSquare', color: 'rose', parent_id: 'cat-3', order_index: 1, count: 0 },
  { id: 'sub-302', name_en: 'Private Clinic & Hospital', name_bn: 'বেসরকারি ক্লিনিক ও হাসপাতাল', slug: 'private-clinic', icon: 'Building2', color: 'rose', parent_id: 'cat-3', order_index: 2, count: 0 },
  { id: 'sub-303', name_en: 'Diagnostic & Lab', name_bn: 'ডায়াগনস্টিক ও ল্যাব', slug: 'diagnostic-lab', icon: 'HeartPulse', color: 'rose', parent_id: 'cat-3', order_index: 3, count: 0 },
  { id: 'sub-304', name_en: 'Dental Care', name_bn: 'ডেন্টাল ক্লিনিক', slug: 'dental-care', icon: 'Stethoscope', color: 'sky', parent_id: 'cat-3', order_index: 4, count: 0 },
  { id: 'sub-305', name_en: 'Eye Hospital', name_bn: 'চক্ষু হাসপাতাল', slug: 'eye-hospital', icon: 'Glasses', color: 'sky', parent_id: 'cat-3', order_index: 5, count: 0 },

  // Doctors & Specialists
  { id: 'sub-doc-1', name_en: 'Medicine Specialist', name_bn: 'মেডিসিন বিশেষজ্ঞ', slug: 'medicine-specialist', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 1, count: 0 },
  { id: 'sub-doc-2', name_en: 'Child & Pediatrician', name_bn: 'শিশু ও নবজাতক রোগ', slug: 'child-pediatrician', icon: 'Baby', color: 'teal', parent_id: 'cat-doctor', order_index: 2, count: 0 },
  { id: 'sub-doc-3', name_en: 'Gynecology & Obstetrics', name_bn: 'গাইনি ও প্রসূতি বিশেষজ্ঞ', slug: 'gynecology-obstetrics', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 3, count: 0 },
  { id: 'sub-doc-4', name_en: 'Cardiology (Heart)', name_bn: 'হৃদরোগ বিশেষজ্ঞ (কার্ডিওলজি)', slug: 'cardiology', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 4, count: 0 },
  { id: 'sub-doc-5', name_en: 'Orthopedics', name_bn: 'অর্থোপেডিক ও হাড় জোড়া', slug: 'orthopedics', icon: 'Hammer', color: 'teal', parent_id: 'cat-doctor', order_index: 5, count: 0 },
  { id: 'sub-doc-6', name_en: 'Skin, Allergy & VD', name_bn: 'চর্ম, অ্যালার্জি ও যৌন রোগ', slug: 'skin-allergy-vd', icon: 'Sparkles', color: 'teal', parent_id: 'cat-doctor', order_index: 6, count: 0 },
  { id: 'sub-doc-7', name_en: 'Dental Surgeon', name_bn: 'ডেন্টাল সার্জন ও দন্ত বিশেষজ্ঞ', slug: 'dental-surgeon', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 7, count: 0 },
  { id: 'sub-doc-8', name_en: 'Eye Specialist', name_bn: 'চক্ষু বিশেষজ্ঞ (অপথ্যালমোলজি)', slug: 'eye-specialist', icon: 'Glasses', color: 'teal', parent_id: 'cat-doctor', order_index: 8, count: 0 },
  { id: 'sub-doc-9', name_en: 'ENT Specialist', name_bn: 'নাক, কান ও গলা বিশেষজ্ঞ', slug: 'ent-specialist', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 9, count: 0 },
  { id: 'sub-doc-10', name_en: 'Urology & Kidney', name_bn: 'ইউরোলজি ও কিডনি রোগ', slug: 'urology-kidney', icon: 'Activity', color: 'teal', parent_id: 'cat-doctor', order_index: 10, count: 0 },
  { id: 'sub-doc-11', name_en: 'Neurology & Brain', name_bn: 'নিউরোমেডিসিন ও স্নায়ুরোগ', slug: 'neurology', icon: 'Brain', color: 'teal', parent_id: 'cat-doctor', order_index: 11, count: 0 },
  { id: 'sub-doc-12', name_en: 'Oncology / Cancer', name_bn: 'ক্যান্সার ও টিউমার বিশেষজ্ঞ', slug: 'oncology-cancer', icon: 'ShieldAlert', color: 'teal', parent_id: 'cat-doctor', order_index: 12, count: 0 },
  { id: 'sub-doc-13', name_en: 'Gastroenterology & Liver', name_bn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার', slug: 'gastroenterology-liver', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 13, count: 0 },
  { id: 'sub-doc-14', name_en: 'Surgery & Laparoscopy', name_bn: 'সার্জারি ও ল্যাপারোস্কপিক', slug: 'surgery-laparoscopy', icon: 'Scissors', color: 'teal', parent_id: 'cat-doctor', order_index: 14, count: 0 },

  // Pharmacy
  { id: 'sub-401', name_en: 'Retail Pharmacy', name_bn: 'খুচরা ফার্মেসি', slug: 'retail-pharmacy', icon: 'Pill', color: 'emerald', parent_id: 'cat-4', order_index: 1, count: 0 },
  { id: 'sub-402', name_en: 'Model Pharmacy', name_bn: 'মডেল ফার্মেসি', slug: 'model-pharmacy', icon: 'ShieldCheck', color: 'emerald', parent_id: 'cat-4', order_index: 2, count: 0 },

  // Shopping
  { id: 'sub-801', name_en: 'Shopping Mall', name_bn: 'শপিং মল ও মার্কেট', slug: 'shopping-mall', icon: 'ShoppingBag', color: 'pink', parent_id: 'cat-8', order_index: 1, count: 0 },
  { id: 'sub-802', name_en: 'Clothing & Fashion', name_bn: 'পোশাক ও ফ্যাশন', slug: 'clothing-fashion', icon: 'Shirt', color: 'purple', parent_id: 'cat-8', order_index: 2, count: 0 },
  { id: 'sub-803', name_en: 'Mobile & Gadgets', name_bn: 'মোবাইল ও গ্যাজেট', slug: 'mobile-gadgets', icon: 'Smartphone', color: 'blue', parent_id: 'cat-8', order_index: 3, count: 0 },
  { id: 'sub-804', name_en: 'Jewelry Shop', name_bn: 'জুয়েলারি ও অলংকার', slug: 'jewelry-shop', icon: 'Sparkles', color: 'amber', parent_id: 'cat-8', order_index: 4, count: 0 },

  // Education
  { id: 'sub-1101', name_en: 'School & College', name_bn: 'স্কুল ও কলেজ', slug: 'school-college', icon: 'BookOpen', color: 'blue', parent_id: 'cat-11', order_index: 1, count: 0 },
  { id: 'sub-1102', name_en: 'University', name_bn: 'বিশ্ববিদ্যালয়', slug: 'university', icon: 'GraduationCap', color: 'purple', parent_id: 'cat-11', order_index: 2, count: 0 },
  { id: 'sub-1103', name_en: 'Coaching Center', name_bn: 'কোচিং সেন্টার', slug: 'coaching-center', icon: 'BookOpen', color: 'blue', parent_id: 'cat-11', order_index: 3, count: 0 },

  // Transport
  { id: 'sub-1201', name_en: 'Bus Service', name_bn: 'বাস সার্ভিস', slug: 'bus-service', icon: 'Bus', color: 'sky', parent_id: 'cat-12', order_index: 1, count: 0 },
  { id: 'sub-1202', name_en: 'Rent-A-Car', name_bn: 'রেন্ট-এ-কার', slug: 'rent-a-car', icon: 'Car', color: 'sky', parent_id: 'cat-12', order_index: 2, count: 0 },
  { id: 'sub-1203', name_en: 'Courier & Parcel', name_bn: 'কুরিয়ার ও পার্সেল', slug: 'courier-parcel', icon: 'Truck', color: 'sky', parent_id: 'cat-12', order_index: 3, count: 0 },

  // Services
  { id: 'sub-1901', name_en: 'Electrician & Plumber', name_bn: 'ইলেকট্রিশিয়ান ও প্লাম্বার', slug: 'electrician-plumber', icon: 'Wrench', color: 'blue', parent_id: 'cat-19', order_index: 1, count: 0 },
  { id: 'sub-1902', name_en: 'Salon & Parlour', name_bn: 'সেলুন ও বিউটি পার্লার', slug: 'salon-parlour', icon: 'Scissors', color: 'pink', parent_id: 'cat-19', order_index: 2, count: 0 },
  { id: 'sub-1903', name_en: 'Appliance Repair', name_bn: 'টিভি, ফ্রিজ ও এসি মেরামত', slug: 'appliance-repair', icon: 'Settings', color: 'blue', parent_id: 'cat-19', order_index: 3, count: 0 },

  // Real Estate
  { id: 'sub-1701', name_en: 'Land & Plots', name_bn: 'জমি ও প্লট', slug: 'land-plots', icon: 'Building2', color: 'indigo', parent_id: 'cat-17', order_index: 1, count: 0 },
  { id: 'sub-1702', name_en: 'Flat & Apartment', name_bn: 'ফ্ল্যাট ও অ্যাপার্টমেন্ট', slug: 'flat-apartment', icon: 'Home', color: 'indigo', parent_id: 'cat-17', order_index: 2, count: 0 }
];

export const ALL_INITIAL_CATEGORIES: Category[] = [
  ...INITIAL_CATEGORIES,
  ...INITIAL_SUBCATEGORIES
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
// 7. LOCATION DATA (Mymensingh Division Administrative Geography - 4 Districts, 35 Upazilas)
// ============================================================================
export const MYMENSINGH_DIVISION = 'ময়মনসিংহ বিভাগ';

export const DIVISION_DISTRICTS = [
  'ময়মনসিংহ',
  'জামালপুর',
  'শেরপুর',
  'নেত্রকোণা'
];

export const DISTRICT_UPAZILAS_MAP: Record<string, string[]> = {
  'ময়মনসিংহ': [
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
  ],
  'জামালপুর': [
    'জামালপুর সদর',
    'মেলান্দহ',
    'মাদারগঞ্জ',
    'ইসলামপুর',
    'সরিষাবাড়ী',
    'দেওয়ানগঞ্জ',
    'বকশীগঞ্জ'
  ],
  'শেরপুর': [
    'শেরপুর সদর',
    'নালিতাবাড়ী',
    'নকলা',
    'শ্রীবরদী',
    'ঝিনাইগাতী'
  ],
  'নেত্রকোণা': [
    'নেত্রকোণা সদর',
    'দুর্গাপুর',
    'কলমাকান্দা',
    'পূর্বধলা',
    'বারহাট্টা',
    'মোহনগঞ্জ',
    'আটপাড়া',
    'কেন্দুয়া',
    'মদন',
    'খালিয়াজুরী'
  ]
};

// All 35 upazilas across Mymensingh Division
export const ALL_DIVISION_UPAZILAS = [
  ...DISTRICT_UPAZILAS_MAP['ময়মনসিংহ'],
  ...DISTRICT_UPAZILAS_MAP['জামালপুর'],
  ...DISTRICT_UPAZILAS_MAP['শেরপুর'],
  ...DISTRICT_UPAZILAS_MAP['নেত্রকোণা']
];

export const MYMENSINGH_DISTRICT = 'ময়মনসিংহ';
export const MYMENSINGH_UPAZILAS = ALL_DIVISION_UPAZILAS;

export const MYMENSINGH_UNIONS_MAP: Record<string, string[]> = {
  // ময়মনসিংহ জেলা
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
  'গৌরীপুর': ['গৌরীপুর পৌরসভা', 'বোকাইনগর', 'মাওহা', 'রামগোপালপুর'],

  // জামালপুর জেলা
  'জামালপুর সদর': ['জামালপুর পৌরসভা', 'নরুন্দি', 'কেন্দুয়া', 'ঘোড়াধাপ', 'রশিদপুর', 'শরীফপুর'],
  'মেলান্দহ': ['মেলান্দহ পৌরসভা', 'কুলিয়া', 'মাহমুদপুর', 'নাংলা', 'শ্যামপুর'],
  'মাদারগঞ্জ': ['মাদারগঞ্জ পৌরসভা', 'আদারভিটা', 'সিধুলী', 'বালিজুড়ী', 'গুনারীতলা'],
  'ইসলামপুর': ['ইসলামপুর পৌরসভা', 'বেলগাছা', 'কুলকান্দি', 'পলবান্ধা', 'চিনাদুলী'],
  'সরিষাবাড়ী': ['সরিষাবাড়ী পৌরসভা', 'পোগলদিঘা', 'ভাটারা', 'মহাদান', 'পিংনা'],
  'দেওয়ানগঞ্জ': ['দেওয়ানগঞ্জ পৌরসভা', 'বাহাদুরাবাদ', 'চিকাজানী', 'তারাটিয়া', 'চর আমখাওয়া'],
  'বকশীগঞ্জ': ['বকশীগঞ্জ পৌরসভা', 'ধানুয়া কামালপুর', 'বাট্টাজোড়', 'সাধুরপাড়া', 'মেরুরচর'],

  // শেরপুর জেলা
  'শেরপুর সদর': ['শেরপুর পৌরসভা', 'কামারেরচর', 'লছমনপুর', 'চরশেরপুর', 'বাজিতখিলা', 'গাজীরখামার'],
  'নালিতাবাড়ী': ['নালিতাবাড়ী পৌরসভা', 'কাকরকান্দি', 'নন্নী', 'পোড়াগাঁও', 'বাঘবেড়'],
  'নকলা': ['নকলা পৌরসভা', 'গণপদ্দী', 'উরফা', 'বানেশ্বর্দী', 'চন্দ্রকোনা'],
  'শ্রীবরদী': ['শ্রীবরদী পৌরসভা', 'কুড়িকাহনিয়া', 'সিংগাবরুনা', 'ভেলাতুলা', 'গোশাইপুর'],
  'ঝিনাইগাতী': ['ঝিনাইগাতী সদর', 'ধানশাইল', 'কাংশা', 'মালিঝিকান্দা', 'গৌরীপুর'],

  // নেত্রকোণা জেলা
  'নেত্রকোণা সদর': ['নেত্রকোণা পৌরসভা', 'মৌগাতি', 'কালিয়াগাবড়', 'চল্লিশা', 'মেদনী'],
  'দুর্গাপুর': ['দুর্গাপুর পৌরসভা', 'কুল্লাগড়া', 'বিরিশিরি', 'গাঁওরকান্দিয়া', 'বাকলজোড়া'],
  'কলমাকান্দা': ['কলমাকান্দা সদর', 'নাজিরপুর', 'লেংগুরা', 'খারনৈ', 'পোগলা'],
  'পূর্বধলা': ['পূর্বধলা সদর', 'হোগলা', 'ঘাগড়া', 'জারিয়া', 'বিসকা'],
  'বারহাট্টা': ['বারহাট্টা সদর', 'বাউসী', 'সাহতা', 'রায়পুর', 'আসমা'],
  'মোহনগঞ্জ': ['মোহনগঞ্জ পৌরসভা', 'সুয়াইর', 'তেঁতুলিয়া', 'মাঘান সিয়াধার', 'বরকাশিয়া'],
  'আটপাড়া': ['আটপাড়া সদর', 'বানিয়াযান', 'শুনই', 'লুন্েশ্বর', 'দোয়াজ'],
  'কেন্দুয়া': ['কেন্দুয়া পৌরসভা', 'রোয়াইলবাড়ী', 'চিথলিয়া', 'বলাইশিমুল', 'কান্দিউড়া'],
  'মদন': ['মদন পৌরসভা', 'তিয়শ্রী', 'ফতেপুর', 'মাঘান', 'গোবিন্দশ্রী'],
  'খালিয়াজুরী': ['খালিয়াজুরী সদর', 'চাকুয়া', 'কৃষ্ণপুর', 'নগর', 'মেন্দিপুর']
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
