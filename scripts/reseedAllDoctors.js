import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU4MjkyOCwiZXhwIjoyMTA2MTU4OTI4fQ.1NWqRMe_VQnkXtlUMEscuwUvHnolwt7HWjpdJitW5Is';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateDoctorBannerSvg(nameBn, nameEn, specialty, chamber) {
  const cleanBn = (nameBn || 'বিশেষজ্ঞ চিকিৎসক').replace(/[<>&"]/g, '');
  const cleanEn = (nameEn || '').replace(/[<>&"]/g, '');
  const cleanSpec = (specialty || 'ডাক্তার ও বিশেষজ্ঞ').replace(/[<>&"]/g, '');
  const cleanChamber = (chamber || 'ময়মনসিংহ').replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="45%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  </defs>

  <rect width="800" height="450" fill="url(#bg)" />
  <circle cx="700" cy="80" r="180" fill="#10b981" fill-opacity="0.15" />
  <circle cx="100" cy="380" r="140" fill="#14b8a6" fill-opacity="0.1" />

  <g transform="translate(50, 38)">
    <rect width="180" height="34" rx="17" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" />
    <circle cx="20" cy="17" r="7" fill="#10b981" />
    <text x="36" y="22" fill="#ffffff" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" letter-spacing="0.5">mymensingh.top</text>
  </g>

  <g transform="translate(575, 38)">
    <rect width="175" height="34" rx="17" fill="rgba(16, 185, 129, 0.25)" stroke="rgba(16, 185, 129, 0.6)" stroke-width="1.2" />
    <text x="88" y="22" fill="#34d399" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="12" font-weight="800" text-anchor="middle">&#10003; ভেরিফাইড চিকিৎসক</text>
  </g>

  <g transform="translate(650, 240)">
    <circle cx="0" cy="0" r="68" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    <circle cx="0" cy="0" r="52" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2" />
    <rect x="-8" y="-28" width="16" height="56" rx="4" fill="#ffffff" />
    <rect x="-28" y="-8" width="56" height="16" rx="4" fill="#ffffff" />
    <circle cx="0" cy="0" r="7" fill="#10b981" />
  </g>

  <g transform="translate(50, 115)">
    <rect width="260" height="34" rx="10" fill="url(#accent)" />
    <text x="18" y="22" fill="#022c22" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13" font-weight="900">&#129658; ${cleanSpec}</text>
  </g>

  <text x="50" y="205" fill="#ffffff" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="30" font-weight="900">
    ${cleanBn}
  </text>

  <text x="50" y="245" fill="#a7f3d0" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700">
    ${cleanEn}
  </text>

  <g transform="translate(50, 290)">
    <rect width="530" height="70" rx="14" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />
    <text x="20" y="28" fill="#94a3b8" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="12" font-weight="700">&#127973; চেম্বার ও রোগী দেখার স্থান:</text>
    <text x="20" y="52" fill="#f8fafc" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="14" font-weight="700">${cleanChamber}</text>
  </g>

  <rect x="0" y="442" width="800" height="8" fill="url(#accent)" />
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const DOCTOR_DATA = [
  // 1. Medicine Specialist
  {
    name_bn: 'অধ্যাপক ডাঃ শঙ্কর নারায়ণ দাস',
    name: 'Prof. Dr. Shankar Narayan Das',
    specialty: 'মেডিসিন ও বাতজ্বর বিশেষজ্ঞ',
    subcategory_slug: 'medicine-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এফসিপিএস (মেডিসিন), এমডি (মেডিসিন), এফআরসিপি (গ্লাসগো, ইউকে)। সাবেক বিভাগীয় প্রধান, মেডিসিন বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 78,
    is_featured: true,
  },
  {
    name_bn: 'অধ্যাপক ডাঃ মোঃ টিটু মিয়া',
    name: 'Prof. Dr. Md. Titu Miah',
    specialty: 'মেডিসিন, হরমোন ও রিউমাটোলজি',
    subcategory_slug: 'medicine-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এফসিপিএস (ইন্টারনাল মেডিসিন), এমডি (এন্ডোক্রাইনোলজি), এমএসিপি (আমেরিকা)। মেডিসিন, ডায়াবেটিস, থাইরয়েড, হরমোন ও বাতজ্বর বিশেষজ্ঞ।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৯:০০ (বৃহস্পতি ও শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 85,
    is_featured: true,
  },
  {
    name_bn: 'অধ্যাপক ডাঃ সত্য রঞ্জন সূত্রধর',
    name: 'Prof. Dr. Satya Ranjan Sutradhar',
    specialty: 'মেডিসিন ও বাতজ্বর বিশেষজ্ঞ',
    subcategory_slug: 'medicine-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এমসিপিএস, এফসিপিএস, এমডি (মেডিসিন), এমএসিপি (ইউএসএ)। অধ্যাপক, মেডিসিন বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৮:৩০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 64,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ মো. খোরশেদ আলম',
    name: 'Dr. Md. Khurshed Alam',
    specialty: 'মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ',
    subcategory_slug: 'medicine-specialist',
    chamber: 'স্বদেশ হাসপাতাল প্রাঃ লিঃ, মাছুয়াকান্দা মোড়, ময়মনসিংহ',
    location: 'স্বদেশ হাসপাতাল, মাসকান্দা মোড়, ঢাকা রোড, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস, এফসিপিএস (মেডিসিন)। সহযোগী অধ্যাপক, মেডিসিন বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৯:০০',
    phone: '01712-888999',
    rating: 4.8,
    review_count: 42,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ ফয়সাল আহমেদ সজীব',
    name: 'Dr. Faisal Ahmed Sajib',
    specialty: 'বক্ষব্যাধি, অ্যাজমা ও মেডিসিন',
    subcategory_slug: 'medicine-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (পালমোনোলজি / বক্ষব্যাধি)। সহকারী অধ্যাপক, বক্ষব্যাধি বিভাগ, ময়মনসিংহ মেডিকেল কলেজ।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.8,
    review_count: 49,
    is_featured: false,
  },

  // 2. Child & Pediatrician
  {
    name_bn: 'সহকারী অধ্যাপক ডাঃ মোঃ মাহমুদুল হাসান',
    name: 'Dr. Md. Mahmudul Hasan',
    specialty: 'শিশু ও নবজাতক রোগ বিশেষজ্ঞ',
    subcategory_slug: 'child-pediatrician',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (পেডিয়াট্রিকস)। সহকারী অধ্যাপক, শিশু বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৮:৩০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 81,
    is_featured: true,
  },
  {
    name_bn: 'সহযোগী অধ্যাপক ডাঃ প্রভাবতী পন্ডিত',
    name: 'Assoc. Prof. Dr. Provati Pondit',
    specialty: 'শিশু ও কিশোর রোগ বিশেষজ্ঞ',
    subcategory_slug: 'child-pediatrician',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিসিএইচ, এফসিপিএস (পেডিয়াট্রিকস)। সহযোগী অধ্যাপক, শিশু স্বাস্থ্য বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'প্রতিদিন বিকাল ৩:০০ - রাত ৮:০০',
    phone: '09613787814',
    rating: 4.9,
    review_count: 88,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ মোহাম্মদ শওকত আলী',
    name: 'Dr. Mahammud Shawkat Ali',
    specialty: 'শিশু সার্জারি ও ল্যাপারোস্কপিক সার্জন',
    subcategory_slug: 'child-pediatrician',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এমএস (পেডিয়াট্রিক সার্জারি)। শিশু সার্জন, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:০০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 39,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ মানিক মজুমদার',
    name: 'Dr. Manik Mazumder',
    specialty: 'শিশু ও নবজাতক রোগ বিশেষজ্ঞ',
    subcategory_slug: 'child-pediatrician',
    chamber: 'ল্যাবএইড ডায়াগনস্টিক সেন্টার, ৭২ মেডিকেল গেট, চরপাড়া, ময়মনসিংহ',
    location: 'ল্যাবএইড ডায়াগনস্টিক সেন্টার, চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিসিএইচ, এমডি (শিশু)। কনসালট্যান্ট, শিশু রোগ বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০',
    phone: '01713-123456',
    rating: 4.8,
    review_count: 51,
    is_featured: false,
  },

  // 3. Gynecology & Obstetrics
  {
    name_bn: 'অধ্যাপক ডাঃ তৈয়বা তানজিন মির্জা',
    name: 'Prof. Dr. Tayeeba Tanjin Mirza',
    specialty: 'গাইনি ও প্রসূতি বিশেষজ্ঞ',
    subcategory_slug: 'gynecology-obstetrics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিজিও, এফসিপিএস (অবস ও গাইনি)। অধ্যাপক ও বিভাগীয় প্রধান (গাইনি ও প্রসূতি), ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:০০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 119,
    is_featured: true,
  },
  {
    name_bn: 'সহকারী অধ্যাপক ডাঃ কামরুন নাহার',
    name: 'Asst. Prof. Dr. Kamrunnaher',
    specialty: 'গাইনি ও প্রসূতি রোগ বিশেষজ্ঞ',
    subcategory_slug: 'gynecology-obstetrics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (অবস ও গাইনি), এমএস (অবস ও গাইনি)। সহকারী অধ্যাপক, গাইনি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বুধবার ও শনিবার: বিকাল ৩:৩০ - সন্ধ্যা ৬:০০',
    phone: '09613787814',
    rating: 4.9,
    review_count: 58,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ রুমা আফরোজ',
    name: 'Dr. Ruma Afrose',
    specialty: 'গাইনি, বন্ধ্যাত্ব ও প্রসূতি বিশেষজ্ঞ',
    subcategory_slug: 'gynecology-obstetrics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (গাইনি ও অবস)। কনসালট্যান্ট গাইনি ও প্রসূতি বিশেষজ্ঞ, ময়মনসিংহ।',
    opening_hours: 'প্রতিদিন দুপুর ২:৩০ - রাত ৮:০০ (শুক্রবার দুপুর ২:০০ - সন্ধ্যা ৭:০০)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 73,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ নিবেদিতা রায় দোলা',
    name: 'Dr. Nibedita Roy Dola',
    specialty: 'স্ত্রী রোগ ও প্রসূতি বিশেষজ্ঞ',
    subcategory_slug: 'gynecology-obstetrics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমএস (অবস ও গাইনি)। সহকারী অধ্যাপক, গাইনি বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৫:০০ - রাত ৮:০০',
    phone: '09613787814',
    rating: 4.8,
    review_count: 67,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ সিমলা আফতাব শাওন',
    name: 'Dr. Simla Aftab Shaon',
    specialty: 'গাইনি ও প্রসূতি বিশেষজ্ঞ',
    subcategory_slug: 'gynecology-obstetrics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (গাইনি ও অবস)। কনসালট্যান্ট, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'শনি, রবি ও মঙ্গলবার: বিকাল ৩:৩০ - সন্ধ্যা ৭:০০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 46,
    is_featured: false,
  },

  // 4. Cardiology
  {
    name_bn: 'ডাঃ শিবলী সাদেক শাকিল',
    name: 'Dr. Shiblee Sadeque Shakil',
    specialty: 'হৃদরোগ ও কার্ডিওলজি বিশেষজ্ঞ',
    subcategory_slug: 'cardiology',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), ডি-কার্ড, এমডি (কার্ডিওলজি)। সিনিয়র কনসালট্যান্ট, কার্ডিওলজি বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৮:৩০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 92,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ গোলাম রহমান ভূঁইয়া রাহেল',
    name: 'Dr. Golam Rahman Bhuiyan Rahel',
    specialty: 'হৃদরোগ, উচ্চ রক্তচাপ ও হার্ট বিশেষজ্ঞ',
    subcategory_slug: 'cardiology',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (কার্ডিওলজি)। সহকারী অধ্যাপক, হৃদরোগ বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৯:০০',
    phone: '09613787814',
    rating: 4.9,
    review_count: 68,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ গোবিন্দ কান্তি পাল',
    name: 'Dr. Gobinda Kanti Pal',
    specialty: 'হৃদরোগ ও রক্তচাপ বিশেষজ্ঞ',
    subcategory_slug: 'cardiology',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডি-কার্ড (ডিইউ), এমডি (কার্ডিওলজি)। সহকারী অধ্যাপক, কার্ডিওলজি বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 53,
    is_featured: false,
  },

  // 5. Orthopedics
  {
    name_bn: 'ডাঃ মোহাম্মদ সাইফুল ইসলাম',
    name: 'Dr. Mohammad Saiful Islam',
    specialty: 'অর্থোপেডিক, ট্রমা ও স্পাইন সার্জন',
    subcategory_slug: 'orthopedics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এমএস (অর্থোপেডিকস), ফেলো স্পাইন সার্জারি। সহযোগী অধ্যাপক ও বিভাগীয় প্রধান, অর্থোপেডিক সার্জারি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '01777339228',
    rating: 4.9,
    review_count: 99,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ মালয় কুমার সাহা',
    name: 'Dr. Malay Kumar Saha',
    specialty: 'অর্থোপেডিক ও আর্থ্রোস্কোপি সার্জন',
    subcategory_slug: 'orthopedics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডি-অর্থো, এমএস (অর্থোপেডিক সার্জারি)। সিনিয়র কনসালট্যান্ট ও বিশেষজ্ঞ অর্থোপেডিক সার্জন, ময়মনসিংহ।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 57,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ মামুনুর রশিদ চৌধুরী',
    name: 'Dr. Mamunur Rashid Chowdhury',
    specialty: 'অর্থোপেডিক ও জয়েন্ট সার্জন',
    subcategory_slug: 'orthopedics',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এমএস (অর্থোপেডিক সার্জারি)। হাড়-জোড়া, ট্রমা ও আর্থ্রাইটিস বিশেষজ্ঞ সার্জন, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৯:০০',
    phone: '09613787814',
    rating: 4.8,
    review_count: 50,
    is_featured: false,
  },

  // 6. Skin & VD
  {
    name_bn: 'ডাঃ দিলশাদ আরমিন লিজু',
    name: 'Dr. Dilshad Armin Liju',
    specialty: 'চর্ম, অ্যালার্জি ও যৌন রোগ বিশেষজ্ঞ',
    subcategory_slug: 'skin-allergy-vd',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিডিভি (বিএসএমএমইউ), এফসিপিএস (ডার্মাটোলজি)। কনসালট্যান্ট ডার্মাটোলজিস্ট, ময়মনসিংহ।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০',
    phone: '09666787814',
    rating: 4.9,
    review_count: 66,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ আতিয়া শারমিন শিমু',
    name: 'Dr. Atia Sharmin Shimu',
    specialty: 'চর্ম, সেক্স ও লেজার স্পেশালিস্ট',
    subcategory_slug: 'skin-allergy-vd',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস (ঢাকা), ডিভিডি (ডিইউ), এফসিপিএস (স্কিন ও ভিডি)। কনসালট্যান্ট, চর্ম ও যৌন রোগ বিভাগ, ময়মনসিংহ।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০',
    phone: '09613787814',
    rating: 4.8,
    review_count: 55,
    is_featured: false,
  },
  {
    name_bn: 'অধ্যাপক ডাঃ মোঃ ফসিউর রহমান',
    name: 'Prof. Dr. Md. Fashiur Rahman',
    specialty: 'চর্ম ও যৌন রোগ বিশেষজ্ঞ',
    subcategory_slug: 'skin-allergy-vd',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিডিভি, এফসিপিএস (ডার্মাটোলজি ও ভেনেরিওলজি)। সাবেক অধ্যাপক ও বিভাগীয় প্রধান, চর্ম বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৮:০০',
    phone: '09666787814',
    rating: 4.9,
    review_count: 75,
    is_featured: false,
  },

  // 7. Neurology
  {
    name_bn: 'ডাঃ মানবেন্দ্র ভট্টাচার্য',
    name: 'Dr. Manabendra Bhattacharya',
    specialty: 'নিউরোমেডিসিন ও স্নায়ুরোগ বিশেষজ্ঞ',
    subcategory_slug: 'neurology',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (নিউরোলজি)। সহকারী অধ্যাপক, নিউরোলজি বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09613787814',
    rating: 4.9,
    review_count: 79,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ মোঃ মহিউদ্দিন খান মুন',
    name: 'Dr. Md. Mohiuddin Khan Moon',
    specialty: 'মেডিসিন ও নিউরোলজি বিশেষজ্ঞ',
    subcategory_slug: 'neurology',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (মেডিসিন), এমডি (নিউরোলজি)। বিশেষজ্ঞ চিকিৎসক, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.8,
    review_count: 45,
    is_featured: false,
  },

  // 8. Gastroenterology & Liver
  {
    name_bn: 'ডাঃ মোঃ সাইফুল মালেক',
    name: 'Dr. Md. Saiful Malek',
    specialty: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার বিশেষজ্ঞ',
    subcategory_slug: 'gastroenterology-liver',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (গ্যাস্ট্রোএন্টারোলজি)। সহযোগী অধ্যাপক, গ্যাস্ট্রোএন্টারোলজি ও হেপাটোলজি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09613787814',
    rating: 4.9,
    review_count: 71,
    is_featured: true,
  },

  // 9. Urology & Kidney
  {
    name_bn: 'সহযোগী অধ্যাপক ডাঃ ওমর ফারুক মিয়া',
    name: 'Assoc. Prof. Dr. Omar Faruque Miah',
    specialty: 'কিডনি ও নেফ্রোলজি বিশেষজ্ঞ',
    subcategory_slug: 'urology-kidney',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি (নেফ্রোলজি)। সহযোগী অধ্যাপক ও বিভাগীয় প্রধান (নেফ্রোলজি বিভাগ), মমেক হাসপাতাল।',
    opening_hours: 'দুপুর ২:৩০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 82,
    is_featured: true,
  },
  {
    name_bn: 'অধ্যাপক ডাঃ মৃণাল কান্তি রায়',
    name: 'Prof. Dr. Mrinal Kanti Roy',
    specialty: 'ইউরোলজি ও মূত্রনালী সার্জন',
    subcategory_slug: 'urology-kidney',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এফসিপিএস (সার্জারি), এমএস (ইউরোলজি)। সাবেক অধ্যাপক ও বিভাগীয় প্রধান, ইউরোলজি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:৩০ - রাত ৮:৩০',
    phone: '09613787814',
    rating: 4.9,
    review_count: 69,
    is_featured: true,
  },

  // 10. ENT Specialist
  {
    name_bn: 'ডাঃ শাকের আহমেদ',
    name: 'Dr. Shaker Ahmed',
    specialty: 'নাক, কান, গলা ও হেড-নেক সার্জন',
    subcategory_slug: 'ent-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), ডিএলও, এমএস (ইএনটি)। সহকারী অধ্যাপক, নাক কান গলা বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০ (শুক্রবার বন্ধ)',
    phone: '09666787814',
    rating: 4.9,
    review_count: 63,
    is_featured: true,
  },
  {
    name_bn: 'অধ্যাপক ডাঃ সমরেশ চন্দ্র কুন্ডু',
    name: 'Prof. Dr. Samresh Chandra Kundu',
    specialty: 'নাক, কান ও গলা বিশেষজ্ঞ',
    subcategory_slug: 'ent-specialist',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিএলও, এফসিপিএস (ইএনটি)। সাবেক অধ্যাপক ও বিভাগীয় প্রধান, নাক কান গলা বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০',
    phone: '09613787814',
    rating: 4.8,
    review_count: 48,
    is_featured: false,
  },

  // 11. Oncology / Cancer
  {
    name_bn: 'অধ্যাপক ডাঃ মোঃ আমিনুল ইসলাম',
    name: 'Prof. Dr. Md. Aminul Islam',
    specialty: 'ক্যান্সার ও অনকোলজি বিশেষজ্ঞ',
    subcategory_slug: 'oncology-cancer',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিএমআরটি (ডিইউ), এফএসিপি (ইউএসএ)। সাবেক অধ্যাপক ও বিভাগীয় প্রধান, রেডিওথেরাপি ও অনকোলজি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৮:৩০',
    phone: '09666787814',
    rating: 4.9,
    review_count: 67,
    is_featured: true,
  },
  {
    name_bn: 'ডাঃ বিউটি সাহা',
    name: 'Dr. Beauty Saha',
    specialty: 'ক্যান্সার, ব্রেস্ট ও টিউমার বিশেষজ্ঞ',
    subcategory_slug: 'oncology-cancer',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস (ডিইউ), ডিএমইউ (ডিআইইউ), এমডি (অনকোলজি)। কনসালট্যান্ট ক্যান্সার বিশেষজ্ঞ, ময়মনসিংহ।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৯:০০',
    phone: '09613787814',
    rating: 4.8,
    review_count: 40,
    is_featured: false,
  },

  // 12. Surgery & Laparoscopy
  {
    name_bn: 'ডাঃ মোঃ আশেক মাহমুদ ফেরদৌস',
    name: 'Dr. Md. Ashek Mahmud Ferdaus',
    specialty: 'কোলোরেকটাল ও ল্যাপারোস্কপিক সার্জন',
    subcategory_slug: 'surgery-laparoscopy',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এফসিপিএস (সার্জারি), এমএস (কোলোরেকটাল সার্জারি)। সহকারী অধ্যাপক, সার্জারি বিভাগ, মমেক হাসপাতাল।',
    opening_hours: 'বিকাল ৩:০০ - রাত ৮:০০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 52,
    is_featured: false,
  },
  {
    name_bn: 'ডাঃ নাজিয়া ইসলাম',
    name: 'Dr. Nazia Islam',
    specialty: 'জেনারেল ও ল্যাপারোস্কপিক সার্জন',
    subcategory_slug: 'surgery-laparoscopy',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ',
    location: 'পপুলার ডায়াগনস্টিক সেন্টার, ১৭১ চরপাড়া, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, এফসিপিএস (সার্জারি)। বিশেষজ্ঞ সার্জন, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল।',
    opening_hours: 'বিকাল ৪:০০ - রাত ৮:৩০',
    phone: '09666787814',
    rating: 4.8,
    review_count: 41,
    is_featured: false,
  },

  // 13. Dental Surgeon
  {
    name_bn: 'ডাঃ খন্দকার আবু সাঈদ',
    name: 'Dr. Khandaker Abu Sayed',
    specialty: 'ডেন্টাল সার্জন ও অর্থোডন্টিক বিশেষজ্ঞ',
    subcategory_slug: 'dental-surgeon',
    chamber: 'স্মাইল ডেন্টাল কেয়ার, চরপাড়া মোড়, ময়মনসিংহ',
    location: 'স্মাইল ডেন্টাল কেয়ার, চরপাড়া, ময়মনসিংহ সদর',
    description: 'বিডিএস (ঢাকা), পিজিটি (অর্থোডন্টিক্স)। আধুনিক ডেন্টাল ইমপ্ল্যান্ট, রুট ক্যানেল ও আঁকাবাঁকা দাঁতের বিশেষজ্ঞ চিকিৎসক।',
    opening_hours: 'সকাল ১০:০০ - রাত ৯:০০',
    phone: '01711-445566',
    rating: 4.9,
    review_count: 36,
    is_featured: false,
  },

  // 14. Eye Specialist
  {
    name_bn: 'অধ্যাপক ডাঃ অসীম কুমার নন্দী',
    name: 'Prof. Dr. Asim Kumar Nandi',
    specialty: 'চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন',
    subcategory_slug: 'eye-specialist',
    chamber: 'ময়মনসিংহ চক্ষু হাসপাতাল, গাঙ্গিনার পাড়, ময়মনসিংহ',
    location: 'গাঙ্গিনার পাড়, ময়মনসিংহ সদর',
    description: 'এমবিবিএস, ডিও, এফসিপিএস (চক্ষু)। সাবেক অধ্যাপক, চক্ষু বিজ্ঞান বিভাগ, ময়মনসিংহ মেডিকেল কলেজ ও হাসপাতাল। ক্যাটারাক্ট ও লেজার সার্জন।',
    opening_hours: 'বিকাল ৪:৩০ - রাত ৮:৩০ (শুক্রবার বন্ধ)',
    phone: '01712-334455',
    rating: 4.9,
    review_count: 64,
    is_featured: true,
  }
];

async function seed() {
  console.log('Seeding doctors category to Supabase...');

  // 1. Insert cat-doctor
  await supabase.from('categories').upsert({
    id: 'cat-doctor',
    name_en: 'Doctors',
    name_bn: 'ডাক্তার ও বিশেষজ্ঞ',
    slug: 'doctors',
    icon: 'Stethoscope',
    color: 'teal',
    order_index: 4,
    count: DOCTOR_DATA.length
  }, { onConflict: 'id' });
  console.log('✓ Inserted category: cat-doctor (Doctors)');

  // 2. Insert businesses
  console.log(`Seeding ${DOCTOR_DATA.length} verified doctors with official mymensingh.top banner cards...`);
  for (let i = 0; i < DOCTOR_DATA.length; i++) {
    const doc = DOCTOR_DATA[i];
    const id = `biz-doctor-${i + 1}`;
    const bannerUrl = generateDoctorBannerSvg(doc.name_bn, doc.name, doc.specialty, doc.chamber);

    const record = {
      id,
      name: doc.name,
      name_bn: doc.name_bn,
      category: 'Doctors',
      category_id: 'cat-doctor',
      category_slug: 'doctors',
      rating: doc.rating,
      review_count: doc.review_count,
      location: doc.location,
      area: 'চরপাড়া',
      district: 'ময়মনসিংহ',
      upazila: 'ময়মনসিংহ সদর',
      phone: doc.phone,
      image_url: bannerUrl,
      gallery_images: [],
      description: `${doc.specialty}। চেম্বার: ${doc.chamber}। ${doc.description}`,
      opening_hours: doc.opening_hours,
      price_range: '৳৮০০ - ৳১৫০০',
      is_featured: doc.is_featured,
      latitude: 24.7337,
      longitude: 90.4132,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('businesses').upsert(record, { onConflict: 'id' });
    if (error) {
      console.error(`Error inserting ${doc.name}:`, error);
    } else {
      console.log(`✓ Inserted: ${doc.name_bn} (${doc.specialty})`);
    }
  }

  console.log('All doctors successfully seeded into Supabase.');
}

seed();
