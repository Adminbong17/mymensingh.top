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
// 1. 20 CATEGORIES
// ============================================================================
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name_en: 'Restaurants', name_bn: 'রেস্টুরেন্ট', slug: 'restaurants', icon: 'Utensils', color: 'rose', order_index: 1, count: 48 },
  { id: 'cat-2', name_en: 'Hotels', name_bn: 'হোটেল', slug: 'hotels', icon: 'Hotel', color: 'indigo', order_index: 2, count: 24 },
  { id: 'cat-3', name_en: 'Hospitals', name_bn: 'হাসপাতাল', slug: 'hospitals', icon: 'Hospital', color: 'red', order_index: 3, count: 32 },
  { id: 'cat-4', name_en: 'Pharmacy', name_bn: 'ফার্মেসি', slug: 'pharmacy', icon: 'Pill', color: 'emerald', order_index: 4, count: 65 },
  { id: 'cat-5', name_en: 'Blood Bank', name_bn: 'ব্লাড ব্যাংক', slug: 'blood-bank', icon: 'Droplets', color: 'red', order_index: 5, count: 18 },
  { id: 'cat-6', name_en: 'Tuition Media', name_bn: 'টিউশন মিডিয়া', slug: 'tuition-media', icon: 'GraduationCap', color: 'purple', order_index: 6, count: 112 },
  { id: 'cat-7', name_en: 'To Let', name_bn: 'বাসা ভাড়া / টু-লেট', slug: 'to-let', icon: 'Home', color: 'amber', order_index: 7, count: 76 },
  { id: 'cat-8', name_en: 'Shopping', name_bn: 'শপিং ও মার্কেট', slug: 'shopping', icon: 'ShoppingBag', color: 'blue', order_index: 8, count: 54 },
  { id: 'cat-9', name_en: 'Cafes', name_bn: 'ক্যাফে ও কফি শপ', slug: 'cafes', icon: 'Coffee', color: 'amber', order_index: 9, count: 29 },
  { id: 'cat-10', name_en: 'Tourist Places', name_bn: 'দর্শনীয় স্থান', slug: 'tourist-places', icon: 'Landmark', color: 'emerald', order_index: 10, count: 22 },
  { id: 'cat-11', name_en: 'Education', name_bn: 'শিক্ষা প্রতিষ্ঠান', slug: 'education', icon: 'BookOpen', color: 'sky', order_index: 11, count: 45 },
  { id: 'cat-12', name_en: 'Transport', name_bn: 'পরিবহন ও যাতায়াত', slug: 'transport', icon: 'Train', color: 'cyan', order_index: 12, count: 38 },
  { id: 'cat-13', name_en: 'Mosques', name_bn: 'মসজিদ ও ধর্মীয় স্থান', slug: 'mosques', icon: 'Moon', color: 'teal', order_index: 13, count: 85 },
  { id: 'cat-14', name_en: 'Events', name_bn: 'ইভেন্ট ও উৎসব', slug: 'events', icon: 'Calendar', color: 'orange', order_index: 14, count: 15 },
  { id: 'cat-15', name_en: 'Offers', name_bn: 'অফার ও ডিসকাউন্ট', slug: 'offers', icon: 'Tag', color: 'pink', order_index: 15, count: 28 },
  { id: 'cat-16', name_en: 'News', name_bn: 'সংবাদ ও বুলেটিন', slug: 'news', icon: 'Newspaper', color: 'slate', order_index: 16, count: 90 },
  { id: 'cat-17', name_en: 'Real Estate', name_bn: 'রিয়েল এস্টেট ও জমি', slug: 'real-estate', icon: 'Building2', color: 'violet', order_index: 17, count: 34 },
  { id: 'cat-18', name_en: 'Jobs', name_bn: 'চাকরি ও ক্যারিয়ার', slug: 'jobs', icon: 'Briefcase', color: 'blue', order_index: 18, count: 42 },
  { id: 'cat-19', name_en: 'Services', name_bn: 'পেশাদার সার্ভিস', slug: 'services', icon: 'Wrench', color: 'yellow', order_index: 19, count: 68 },
  { id: 'cat-20', name_en: 'More', name_bn: 'আরও সেবা', slug: 'more', icon: 'Grid', color: 'gray', order_index: 20, count: 150 },
];

// ============================================================================
// 2. 6 FEATURED BUSINESSES
// ============================================================================
export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    name: 'The River View Restaurant',
    name_bn: 'দ্য রিভার ভিউ রেস্টুরেন্ট',
    category: 'Restaurants',
    category_slug: 'restaurants',
    rating: 4.8,
    review_count: 142,
    location: 'Park Road, Old Brahmaputra Riverfront, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 08',
    phone: '+880 1711-234567',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier riverfront dining in Mymensingh offering traditional Bangladeshi river fish delicacies, Chinese cuisine, and scenic sunset views of the Old Brahmaputra.',
    is_featured: true,
    latitude: 24.7645,
    longitude: 90.3956,
    opening_hours: '11:00 AM - 11:00 PM',
    price_range: '৳৳ - Moderate'
  },
  {
    id: 'biz-2',
    name: 'Hotel Brahmaputra',
    name_bn: 'হোটেল ব্রহ্মপুত্র',
    category: 'Hotels',
    category_slug: 'hotels',
    rating: 4.7,
    review_count: 98,
    location: 'Court Road, Town Hall Area, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 03',
    phone: '+880 1712-345678',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    description: 'Modern luxury boutique hotel offering high-speed Wi-Fi, executive suites, conference facilities, and 24/7 room service in the commercial heart of town.',
    is_featured: true,
    latitude: 24.7570,
    longitude: 90.4040,
    opening_hours: 'Open 24/7',
    price_range: '৳৳৳ - Premium'
  },
  {
    id: 'biz-3',
    name: 'Community Hospital',
    name_bn: 'কমিউনিটি হাসপাতাল ময়মনসিংহ',
    category: 'Hospitals',
    category_slug: 'hospitals',
    rating: 4.9,
    review_count: 215,
    location: 'Charpara Medical Road, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 12',
    phone: '+880 1713-456789',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Advanced multi-specialty hospital with 24/7 emergency trauma wing, ICU, modern pathology lab, and renowned specialist physicians.',
    is_featured: true,
    latitude: 24.7348,
    longitude: 90.4135,
    opening_hours: '24/7 Emergency',
    price_range: '৳৳ - Affordable'
  },
  {
    id: 'biz-4',
    name: 'Sheikh Pharma',
    name_bn: 'শেখ ফার্মা ও সার্জিক্যাল',
    category: 'Pharmacy',
    category_slug: 'pharmacy',
    rating: 4.9,
    review_count: 87,
    location: 'Station Road, Ganginar Par, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 05',
    phone: '+880 1714-567890',
    image_url: 'https://images.unsplash.com/photo-1586015555751-63c2c1615a6b?auto=format&fit=crop&w=1200&q=80',
    description: '100% authentic medicine retailer with temperature-controlled storage, baby foods, surgical items, and fast home delivery in Mymensingh city.',
    is_featured: true,
    latitude: 24.7532,
    longitude: 90.4060,
    opening_hours: '8:00 AM - 12:00 AM',
    price_range: '৳ - Standard'
  },
  {
    id: 'biz-5',
    name: 'Cafe Arong',
    name_bn: 'ক্যাফে আড়ং',
    category: 'Cafes',
    category_slug: 'cafes',
    rating: 4.6,
    review_count: 175,
    location: 'Town Hall Moar, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 04',
    phone: '+880 1715-678901',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    description: 'Cozy boutique coffee shop popular among university students for artisanal espresso drinks, gourmet waffles, burgers, and acoustic musical evenings.',
    is_featured: true,
    latitude: 24.7562,
    longitude: 90.4048,
    opening_hours: '11:00 AM - 10:30 PM',
    price_range: '৳৳ - Moderate'
  },
  {
    id: 'biz-6',
    name: 'Arab Paradise Market',
    name_bn: 'আরব প্যারাডাইস মার্কেট',
    category: 'Shopping',
    category_slug: 'shopping',
    rating: 4.7,
    review_count: 130,
    location: 'Chotto Bazar, Commercial Area, Mymensingh Sadar',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    union_ward: 'City Ward 02',
    phone: '+880 1716-789012',
    image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
    description: 'Multi-level modern retail paradise featuring international fashion brand outlets, traditional handloom sarees, cosmetics, electronics, and kids play zone.',
    is_featured: true,
    latitude: 24.7580,
    longitude: 90.4020,
    opening_hours: '10:00 AM - 9:30 PM',
    price_range: '৳৳ - Wide Range'
  }
];

// ============================================================================
// 3. 5 LATEST NEWS ITEMS
// ============================================================================
export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'শহরের নতুন সেতু নির্মাণ',
    title_en: 'New City Bridge Construction across Brahmaputra',
    excerpt: 'পুরাতন ব্রহ্মপুত্র নদের ওপর আধুনিক চার লেনের নতুন দৃষ্টিনন্দন সেতু নির্মাণের কাজ দ্রুত এগিয়ে চলছে। এতে শহরের যানজট নিরসন হবে।',
    category: 'Infrastructure',
    date: '২৮ সেপ্টেম্বর, ২০২৬',
    image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
    read_time: '৩ মিনিট পাঠ',
    content: 'ময়মনসিংহ শহরকে সম্প্রসারিত করতে এবং যাতায়াত আরও দ্রুত ও নির্বিঘ্ন করতে পুরাতন ব্রহ্মপুত্র নদের ওপর মেগা ব্রিজ প্রকল্পের কাজ শুরু হয়েছে। স্থানীয় সরকার ও সড়ক বিভাগ জানিয়েছে, এই সেতু চালুর পর মুক্তাগাছা, জামালপুর ও শেরপুরগামী পরিবহন সহজে শহরে প্রবেশ না করেই বাইপাস দিয়ে যেতে পারবে।'
  },
  {
    id: 'news-2',
    title: 'শিক্ষা খাতে নতুন উদ্যোগ',
    title_en: 'New Educational Initiatives in Mymensingh Division',
    excerpt: 'বিভাগের তরুণ প্রজন্মকে তথ্যপ্রযুক্তি ও আধুনিক গবেষণায় দক্ষ করে তুলতে ময়মনসিংহে স্থাপিত হচ্ছে হাই-টেক ইনকিউবেশন হাব।',
    category: 'Education',
    date: '২৬ সেপ্টেম্বর, ২০২৬',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    read_time: '৪ মিনিট পাঠ',
    content: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (বাকৃবি) এবং আনন্দ মোহন কলেজের শিক্ষার্থীদের যৌথ উদ্যোগে ময়মনসিংহে আধুনিক এআই এবং কৃষি-প্রযুক্তি উদ্ভাবন ল্যাব স্থাপন করা হয়েছে। এর মাধ্যমে স্থানীয় উদ্যোক্তারা আন্তর্জাতিক পর্যায়ে প্রশিক্ষণ পাবেন।'
  },
  {
    id: 'news-3',
    title: 'ব্রহ্মপুত্র নদে পর্যটন উদ্যোগ',
    title_en: 'Brahmaputra River Tourism & Eco-Park Drive',
    excerpt: 'জয়নুল আবেদিন পার্ক থেকে কাঁচিঝুলি পর্যন্ত বিস্তৃত পরিবেশবান্ধব রিভারওয়াক এবং আধুনিক বোট ক্রুজ টার্মিনাল উদ্বোধন।',
    category: 'Tourism',
    date: '২৫ সেপ্টেম্বর, ২০২৬',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    read_time: '৩ মিনিট পাঠ',
    content: 'ময়মনসিংহের প্রাকৃতিক সৌন্দর্যকে দেশ-বিদেশের পর্যটকদের কাছে তুলে ধরতে জেলা প্রশাসন ও সিটি করপোরেশনের উদ্যোগে ব্রহ্মপুত্র নদে সৌরচালিত আধুনিক পর্যটন বোট ও সানসেট ক্রুজ সার্ভিস চালু করা হয়েছে।'
  },
  {
    id: 'news-4',
    title: 'শহরের নতুন মার্কেট',
    title_en: 'Ultra-Modern Commercial Mall in City Center',
    excerpt: 'গাঙ্গিনার পাড় ও ছোট বাজারের সংযোগস্থলে আধুনিক সুযোগ-সুবিধাসম্পন্ন বহুতল শপিং আর্কেড চালু হচ্ছে।',
    category: 'Business',
    date: '২৩ সেপ্টেম্বর, ২০২৬',
    image_url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=800&q=80',
    read_time: '২ মিনিট পাঠ',
    content: 'শহরের ব্যবসায়ীদের অর্থনৈতিক বিস্তার এবং ক্রেতাদের স্বাচ্ছন্দ্যে কেনাকাটার জন্য অত্যাধুনিক অগ্নি-নির্বাপক ব্যবস্থা ও পার্কিংসহ এই মেগা বাণিজ্যিক মলটি নির্মিত হয়েছে।'
  },
  {
    id: 'news-5',
    title: 'ময়মনসিংহে নতুন ইভেন্ট',
    title_en: 'Grand Youth Tech & Cultural Fest Announced',
    excerpt: 'আসন্ন শীতে ময়মনসিংহ টাউন হল ময়দানে অনুষ্ঠিত হতে যাচ্ছে তিন দিনব্যাপী বিভাগীয় সাংস্কৃতিক ও প্রযুক্তি উৎসব।',
    category: 'Community',
    date: '২০ সেপ্টেম্বর, ২০২৬',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    read_time: '৩ মিনিট পাঠ',
    content: 'ময়মনসিংহের শিল্প-সাহিত্যের ঐতিহ্যকে এগিয়ে নিতে সংগীত পরিবেশনা, পিঠা মেলা, রোবোটিক্স প্রদর্শনী এবং তরুণ স্টার্টআপ প্রতিযোগিতার আয়োজন করা হচ্ছে।'
  }
];

// ============================================================================
// 4. 3 UPCOMING EVENTS
// ============================================================================
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Mymensingh Book Fair',
    title_bn: 'ময়মনসিংহ অমর একুশে বইমেলা ২০২৬',
    date: '১৫ - ২৫ অক্টোবর, ২০২৬',
    time: 'প্রতিদিন দুপুর ৩:০০ - রাত ৯:০০',
    venue: 'জয়নুল আবেদিন পার্ক চত্বর, ময়মনসিংহ',
    category: 'Literature & Culture',
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    entry_fee: 'Free / উন্মুক্ত প্রবেশ',
    description: 'দেশের শীর্ষস্থানীয় প্রকাশনী সংস্থা ও স্থানীয় সাহিত্যপ্রেমীদের অংশগ্রহণে বর্ণাঢ্য বইমেলা, লেখক সমাবেশ ও সাংস্কৃতিক আড্ডা।'
  },
  {
    id: 'evt-2',
    title: 'Cultural Fest Mymensingh',
    title_bn: 'ময়মনসিংহ ঐতিহ্য ও নাট্যোৎসব',
    date: '৫ - ৮ নভেম্বর, ২০২৬',
    time: 'সন্ধ্যা ৬:০০ - রাত ১০:০০',
    venue: 'ময়মনসিংহ টাউন হল অডিটোরিয়াম',
    category: 'Arts & Drama',
    image_url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    entry_fee: 'Free / উন্মুক্ত',
    description: 'ময়মনসিংহের লোকগান, জারি-সারি ও মঞ্চনাটকের জমকালো পরিবেশনা নিয়ে চার দিনব্যাপী সাংস্কৃতিক উৎসব।'
  },
  {
    id: 'evt-3',
    title: 'Food Festival Mymensingh',
    title_bn: 'ময়মনসিংহ ফুড অ্যান্ড সুইটস কার্নিভাল',
    date: '২০ - ২২ নভেম্বর, ২০২৬',
    time: 'সকাল ১১:০০ - রাত ১০:০০',
    venue: 'জিমনেসিয়াম প্রাঙ্গণ, সার্কিট হাউজ রোড',
    category: 'Food Carnival',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    entry_fee: 'BDT 50 / টিকিট ৫০ টাকা',
    description: 'মুক্তাগাছার খাঁটি মণ্ডা, ব্রহ্মপুত্রের ঐতিহ্যবাহী মাছের রেসিপি এবং শহরের সেরা রেস্টুরেন্টগুলোর মুখরোচক স্টল।'
  }
];

// ============================================================================
// 5. 3 LATEST OFFERS
// ============================================================================
export const INITIAL_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: '20% OFF — The River View Restaurant',
    discount: '20% OFF',
    business_name: 'The River View Restaurant',
    category: 'Dining',
    expiry_date: '১৫ অক্টোবর, ২০২৬',
    promo_code: 'RIVER20',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Get an exclusive 20% discount on all family buffet orders and river-view candle dinner bookings!'
  },
  {
    id: 'off-2',
    title: 'Flat 15% Discount — Sheikh Pharma',
    discount: 'Flat 15% OFF',
    business_name: 'Sheikh Pharma',
    category: 'Healthcare',
    expiry_date: '৩১ অক্টোবর, ২০২৬',
    promo_code: 'HEALTH15',
    image_url: 'https://images.unsplash.com/photo-1586015555751-63c2c1615a6b?auto=format&fit=crop&w=800&q=80',
    description: 'Enjoy 15% instant cashback & savings on prescription purchases above BDT 1,000 with free home delivery.'
  },
  {
    id: 'off-3',
    title: 'Special Room Rate — Hotel Brahmaputra',
    discount: 'Save BDT 1,200',
    business_name: 'Hotel Brahmaputra',
    category: 'Hotels',
    expiry_date: '৩০ অক্টোবর, ২০২৬',
    promo_code: 'STAYBRAHMA',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury deluxe suite bookings include complimentary breakfast for two and riverfront airport pickup shuttle.'
  }
];

// ============================================================================
// 6. SPECIAL SERVICES (BLOOD BANK, TUITION MEDIA, TO-LET)
// ============================================================================
export const INITIAL_BLOOD_DONORS: BloodDonor[] = [
  { id: 'bd-1', name: 'Tanvir Hossain', blood_group: 'O+', upazila: 'ময়মনসিংহ সদর', phone: '01711-123456', availability: 'Available', last_donation: '৩ মাস আগে' },
  { id: 'bd-2', name: 'Nusrat Jahan', blood_group: 'A+', upazila: 'মুক্তাগাছা', phone: '01712-234567', availability: 'Available', last_donation: '৪ মাস আগে' },
  { id: 'bd-3', name: 'Rakibul Islam', blood_group: 'B+', upazila: 'ত্রিশাল', phone: '01713-345678', availability: 'Available', last_donation: '২ মাস আগে' },
  { id: 'bd-4', name: 'Mahmud Hasan', blood_group: 'AB+', upazila: 'ভালুকা', phone: '01714-456789', availability: 'Available', last_donation: '৫ মাস আগে' },
  { id: 'bd-5', name: 'Sabbir Ahmed (Rare)', blood_group: 'O-', upazila: 'ময়মনসিংহ সদর', phone: '01715-567890', availability: 'Available', last_donation: '৬ মাস আগে' },
];

export const INITIAL_TUITION_LISTINGS: TuitionListing[] = [
  { id: 'tu-1', title: 'HSC Higher Math & Physics Tutor Needed', class_level: 'HSC 1st/2nd Year', subjects: ['Physics', 'Higher Math'], location: 'Charpara / Medical Road', salary: '৳ ৬,০০০ - ৭,৫০০', days_per_week: '৪ দিন / সপ্তাহ', phone: '01719-876543', posted_date: 'আজ' },
  { id: 'tu-2', title: 'Class 9-10 General Science & English Teacher', class_level: 'Class 9 (Bangla Medium)', subjects: ['General Science', 'English'], location: 'Town Hall Area', salary: '৳ ৪,৫০০ - ৫,০০০', days_per_week: '৩ দিন / সপ্তাহ', phone: '01718-765432', posted_date: 'গতকাল' },
  { id: 'tu-3', title: 'BAU Campus Child All Subjects Tutor', class_level: 'Class 6 (English Version)', subjects: ['All Subjects'], location: 'BAU Campus Residential Area', salary: '৳ ৫,০০০', days_per_week: '৪ দিন / সপ্তাহ', phone: '01717-654321', posted_date: '২ দিন আগে' },
];

export const INITIAL_TO_LET_LISTINGS: ToLetListing[] = [
  { id: 'tl-1', title: 'Spacious 3-Bed Family Flat with Lift & Generator', type: 'Family', rent: '৳ ১৫,৫০০ / মাস', bedrooms: 3, bathrooms: 2, area: 'Sankipara, Mymensingh Sadar', phone: '01711-998877', image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', available_from: '১ নভেম্বর ২০২৬' },
  { id: 'tl-2', title: 'Student & Job Holder Bachelor Room (Attached Bath)', type: 'Bachelor', rent: '৳ ৩,২০০ / সিট', bedrooms: 1, bathrooms: 1, area: 'Charpara (Near MMCH)', phone: '01712-887766', image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', available_from: 'তাৎক্ষণিক' },
  { id: 'tl-3', title: 'Quiet Sublet for Small Family or Female Student', type: 'Sublet', rent: '৳ ৬,০০০ / মাস', bedrooms: 1, bathrooms: 1, area: 'Town Hall Court Road', phone: '01713-776655', image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80', available_from: '১৫ অক্টোবর' },
];

// ============================================================================
// 7. LOCATION DATA (UPAZILAS & UNIONS)
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

export const INITIAL_REVIEWS: Review[] = [
  { id: 'rev-1', place_id: 'biz-1', user_name: 'Tanvir Ahmed', rating: 5, comment: 'Breathtaking river breeze and delicious fish curry!', status: 'approved', created_at: '2026-09-20' },
  { id: 'rev-2', place_id: 'biz-4', user_name: 'Sabrina Noor', rating: 5, comment: 'Super fast delivery and authentic medicines.', status: 'approved', created_at: '2026-09-22' },
];
