/**
 * Brand & Business Themed Banner SVG Generator for Mymensingh.top
 * Creates high-quality official branded banners combining:
 * 1. mymensingh.top official branding & seal
 * 2. Official Brand Logo / Monogram & Emblem
 * 3. Verified Outlet Badge
 * 4. Brand Name in Bengali & English
 * 5. Branch Location & Phone number
 */

interface BrandTheme {
  primary: string;
  secondary: string;
  darkBg: string;
  accent: string;
  tag: string;
  logoSvg: string; // SVG inner elements for the logo
}

// Brand-specific signature palettes & vector logos
const BRAND_THEMES: Record<string, BrandTheme> = {
  aarong: {
    primary: '#780016',
    secondary: '#b91c1c',
    darkBg: '#2d060e',
    accent: '#f59e0b',
    tag: 'লাইফস্টাইল ও ফ্যাশন',
    logoSvg: `
      <!-- Aarong Signature Bird/Artisan Icon -->
      <path d="M-20,-12 C-20,-24 -5,-30 12,-20 C25,-12 30,5 24,18 C18,28 0,30 -14,20 C-22,12 -20,0 -20,-12 Z" fill="#f59e0b" opacity="0.9"/>
      <circle cx="-2" cy="-6" r="4" fill="#ffffff"/>
      <path d="M-8,14 Q8,24 22,12" stroke="#ffffff" stroke-width="2.5" fill="none"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" letter-spacing="2" text-anchor="middle">AARONG</text>
    `
  },
  apex: {
    primary: '#0369a1',
    secondary: '#0284c7',
    darkBg: '#082f49',
    accent: '#38bdf8',
    tag: 'প্রিমিয়াম ফুটওয়্যার',
    logoSvg: `
      <!-- Apex Bold Triangle Emblem -->
      <polygon points="0,-28 26,20 -26,20" fill="#38bdf8"/>
      <polygon points="0,-16 16,14 -16,14" fill="#082f49"/>
      <polygon points="0,-4 8,10 -8,10" fill="#ffffff"/>
      <text x="0" y="34" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" letter-spacing="3" text-anchor="middle">APEX</text>
    `
  },
  bata: {
    primary: '#b91c1c',
    secondary: '#dc2626',
    darkBg: '#450a0a',
    accent: '#ffffff',
    tag: 'ফুটওয়্যার শোরুম',
    logoSvg: `
      <!-- Bata Signature Slanted Logo -->
      <rect x="-38" y="-18" width="76" height="36" rx="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <text x="0" y="7" fill="#ffffff" font-family="'Arial Black', Impact, sans-serif" font-size="20" font-weight="900" font-style="italic" letter-spacing="1" text-anchor="middle">Bata</text>
    `
  },
  lotto: {
    primary: '#15803d',
    secondary: '#dc2626',
    darkBg: '#0f172a',
    accent: '#22c55e',
    tag: 'স্পোর্টস ও স্নিকার্স',
    logoSvg: `
      <!-- Lotto Double Diamond -->
      <polygon points="0,-22 20,-2 0,18 -20,-2" fill="#dc2626"/>
      <polygon points="0,-12 12,0 0,12 -12,0" fill="#ffffff"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" letter-spacing="2" text-anchor="middle">LOTTO</text>
    `
  },
  walton: {
    primary: '#0284c7',
    secondary: '#2563eb',
    darkBg: '#0f172a',
    accent: '#38bdf8',
    tag: 'ইলেকট্রনিক্স ও গ্যাজেট',
    logoSvg: `
      <!-- Walton Futuristic 'W' -->
      <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#1e40af" stroke="#60a5fa" stroke-width="1.5"/>
      <path d="M-22,-8 L-14,10 L-6,-4 L2,10 L10,-8" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="0" y="30" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="900" letter-spacing="2" text-anchor="middle">WALTON</text>
    `
  },
  singer: {
    primary: '#991b1b',
    secondary: '#b91c1c',
    darkBg: '#27272a',
    accent: '#ef4444',
    tag: 'হোম অ্যাপ্লায়েন্স',
    logoSvg: `
      <!-- Singer Ribbon Crest -->
      <circle cx="0" cy="0" r="24" fill="#991b1b" stroke="#ffffff" stroke-width="2"/>
      <text x="0" y="8" fill="#ffffff" font-family="'Times New Roman', serif" font-size="24" font-weight="900" text-anchor="middle">S</text>
      <text x="0" y="34" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" letter-spacing="2" text-anchor="middle">SINGER</text>
    `
  },
  samsung: {
    primary: '#1d4ed8',
    secondary: '#2563eb',
    darkBg: '#02183b',
    accent: '#60a5fa',
    tag: 'স্মার্টফোন ও প্লাজা',
    logoSvg: `
      <!-- Samsung Oval Badge -->
      <ellipse cx="0" cy="0" rx="42" ry="22" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.8" transform="rotate(-10)"/>
      <text x="0" y="6" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="900" letter-spacing="1" text-anchor="middle">SAMSUNG</text>
    `
  },
  illiyeen: {
    primary: '#b45309',
    secondary: '#d97706',
    darkBg: '#0f172a',
    accent: '#fbbf24',
    tag: 'প্রিমিয়াম ফ্যাশন',
    logoSvg: `
      <!-- Illiyeen Luxury Crown -->
      <path d="M-22,12 L-22,-6 L-10,4 L0,-16 L10,4 L22,-6 L22,12 Z" fill="#fbbf24"/>
      <circle cx="0" cy="-20" r="3" fill="#fbbf24"/>
      <circle cx="-22" cy="-10" r="2.5" fill="#fbbf24"/>
      <circle cx="22" cy="-10" r="2.5" fill="#fbbf24"/>
      <text x="0" y="30" fill="#fde68a" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" letter-spacing="3" text-anchor="middle">ILLIYEEN</text>
    `
  },
  sailor: {
    primary: '#0f766e',
    secondary: '#0d9488',
    darkBg: '#042f2e',
    accent: '#2dd4bf',
    tag: 'ট্রেন্ডি ফ্যাশন ও পোশাক',
    logoSvg: `
      <!-- Sailor Anchor & Compass -->
      <circle cx="0" cy="-10" r="6" stroke="#2dd4bf" stroke-width="2.5" fill="none"/>
      <line x1="0" y1="-4" x2="0" y2="18" stroke="#ffffff" stroke-width="3"/>
      <line x1="-12" y1="2" x2="12" y2="2" stroke="#ffffff" stroke-width="2.5"/>
      <path d="M-18,10 C-18,22 18,22 18,10" stroke="#2dd4bf" stroke-width="3" fill="none"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" letter-spacing="2" text-anchor="middle">SAILOR</text>
    `
  },
  twelve: {
    primary: '#6b21a8',
    secondary: '#7e22ce',
    darkBg: '#2e1065',
    accent: '#c084fc',
    tag: 'ওয়েস্টার্ন ও এথনিক ফ্যাশন',
    logoSvg: `
      <!-- Twelve Roman XII Motif -->
      <rect x="-30" y="-18" width="60" height="36" rx="6" fill="#581c87" stroke="#c084fc" stroke-width="1.5"/>
      <text x="0" y="7" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="17" font-weight="900" text-anchor="middle">12</text>
      <text x="0" y="30" fill="#e9d5ff" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="800" letter-spacing="2" text-anchor="middle">TWELVE</text>
    `
  },
  richman: {
    primary: '#334155',
    secondary: '#475569',
    darkBg: '#0f172a',
    accent: '#94a3b8',
    tag: 'স্যুট ও ফর্মাল পোশাক',
    logoSvg: `
      <!-- Richman Elegant Bowtie & Shield -->
      <path d="M-20,-12 L-4,0 L-20,12 Z M20,-12 L4,0 L20,12 Z" fill="#94a3b8"/>
      <circle cx="0" cy="0" r="4" fill="#ffffff"/>
      <text x="0" y="30" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" letter-spacing="2" text-anchor="middle">RICHMAN</text>
    `
  },
  gentle_park: {
    primary: '#18181b',
    secondary: '#27272a',
    darkBg: '#09090b',
    accent: '#10b981',
    tag: 'ক্যাজুয়াল ও জেন্টলওয়্যার',
    logoSvg: `
      <!-- Gentle Park Modern Emblem -->
      <rect x="-26" y="-18" width="52" height="36" rx="6" fill="#27272a" stroke="#10b981" stroke-width="1.5"/>
      <text x="0" y="6" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="15" font-weight="900" text-anchor="middle">GP</text>
      <text x="0" y="30" fill="#a7f3d0" font-family="'Segoe UI', sans-serif" font-size="8" font-weight="900" letter-spacing="1" text-anchor="middle">GENTLE PARK</text>
    `
  },
  infinity: {
    primary: '#4c1d95',
    secondary: '#6d28d9',
    darkBg: '#1e1b4b',
    accent: '#a78bfa',
    tag: 'মেগা শপিং মল',
    logoSvg: `
      <!-- Infinity Symbol -->
      <path d="M-18,0 C-18,-10 -6,-10 0,0 C6,10 18,10 18,0 C18,-10 6,-10 0,0 C-6,10 -18,10 -18,0 Z" stroke="#a78bfa" stroke-width="4.5" fill="none"/>
      <text x="0" y="30" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" letter-spacing="2" text-anchor="middle">INFINITY</text>
    `
  },
  easy: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    darkBg: '#172554',
    accent: '#60a5fa',
    tag: 'ইউথ ফ্যাশন কালেকশন',
    logoSvg: `
      <!-- Easy Fashion Badge -->
      <rect x="-30" y="-16" width="60" height="32" rx="16" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>
      <text x="0" y="6" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="900" letter-spacing="1" text-anchor="middle">EASY</text>
    `
  },
  bishworang: {
    primary: '#9a3412',
    secondary: '#ea580c',
    darkBg: '#431407',
    accent: '#fed7aa',
    tag: 'ঐতিহ্যবাহী রঙ ও ফ্যাশন',
    logoSvg: `
      <!-- Bishworang Lotus / Spectrum -->
      <circle cx="0" cy="0" r="20" fill="#ea580c" opacity="0.4"/>
      <path d="M0,-18 Q12,-4 0,10 Q-12,-4 0,-18 Z" fill="#fdba74"/>
      <path d="M-14,-6 Q-2,4 10,-6 Q2,-16 -14,-6 Z" fill="#f97316"/>
      <text x="0" y="32" fill="#ffedd5" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5" text-anchor="middle">BISHWORANG</text>
    `
  },
  artisan: {
    primary: '#854d0e',
    secondary: '#a16207',
    darkBg: '#422006',
    accent: '#fde047',
    tag: 'প্রিমিয়াম আউটফিট',
    logoSvg: `
      <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#713f12" stroke="#fde047" stroke-width="1.5"/>
      <text x="0" y="6" fill="#fef08a" font-family="'Segoe UI', sans-serif" font-size="18" font-weight="900" text-anchor="middle">A</text>
      <text x="0" y="30" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="8" font-weight="900" letter-spacing="2" text-anchor="middle">ARTISAN</text>
    `
  },
  shwapno: {
    primary: '#dc2626',
    secondary: '#16a34a',
    darkBg: '#1e293b',
    accent: '#facc15',
    tag: 'গ্রোসারি ও সুপার শপ',
    logoSvg: `
      <!-- Shwapno Shopping Cart & Smile -->
      <path d="M-18,-10 L-12,-10 L-6,10 L16,10 L22,-2 L-4,-2" stroke="#facc15" stroke-width="2.5" fill="none"/>
      <circle cx="-2" cy="16" r="3" fill="#facc15"/>
      <circle cx="12" cy="16" r="3" fill="#facc15"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" letter-spacing="2" text-anchor="middle">SHWAPNO</text>
    `
  },
  agora: {
    primary: '#047857',
    secondary: '#059669',
    darkBg: '#064e3b',
    accent: '#34d399',
    tag: 'মেগা সুপারমার্কেট',
    logoSvg: `
      <!-- Agora Leaf Emblem -->
      <path d="M-18,12 C-18,-8 0,-18 18,-18 C18,2 0,12 -18,12 Z" fill="#34d399"/>
      <path d="M-18,12 Q0,2 18,-18" stroke="#064e3b" stroke-width="2" fill="none"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" letter-spacing="2" text-anchor="middle">AGORA</text>
    `
  },
  diamond_world: {
    primary: '#4c1d95',
    secondary: '#7c3aed',
    darkBg: '#0f172a',
    accent: '#fbbf24',
    tag: 'স্বর্ণ ও ডায়মন্ড জুয়েলারি',
    logoSvg: `
      <!-- Diamond Gem Facet -->
      <polygon points="0,-22 22,-8 14,16 0,22 -14,16 -22,-8" fill="none" stroke="#fbbf24" stroke-width="2"/>
      <polygon points="0,-22 14,16 -14,16" fill="none" stroke="#fef08a" stroke-width="1.2"/>
      <circle cx="0" cy="-4" r="3" fill="#ffffff"/>
      <text x="0" y="34" fill="#fbbf24" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" letter-spacing="1" text-anchor="middle">DIAMOND WORLD</text>
    `
  },
  butterfly: {
    primary: '#9d174d',
    secondary: '#be185d',
    darkBg: '#500724',
    accent: '#f472b6',
    tag: 'এলজি ইলেকট্রনিক্স শোরুম',
    logoSvg: `
      <!-- Butterfly Wing Emblem -->
      <path d="M-2,0 C-18,-20 -24,4 -2,8 C-24,14 -12,24 -2,8 Z M2,0 C18,-20 24,4 2,8 C24,14 12,24 2,8 Z" fill="#f472b6"/>
      <circle cx="0" cy="8" r="2" fill="#ffffff"/>
      <text x="0" y="30" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" letter-spacing="1" text-anchor="middle">BUTTERFLY</text>
    `
  },
  rfl: {
    primary: '#1d4ed8',
    secondary: '#dc2626',
    darkBg: '#1e293b',
    accent: '#f87171',
    tag: 'গৃহস্থালি ও রিটেল পণ্য',
    logoSvg: `
      <!-- RFL Blue & Red Oval -->
      <rect x="-32" y="-16" width="64" height="32" rx="16" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
      <text x="0" y="6" fill="#ffffff" font-family="'Arial Black', Impact, sans-serif" font-size="14" font-weight="900" letter-spacing="1" text-anchor="middle">RFL</text>
    `
  },
  restaurant_default: {
    primary: '#c2410c',
    secondary: '#ea580c',
    darkBg: '#431407',
    accent: '#fdba74',
    tag: 'ঐতিহ্যবাহী রেস্টুরেন্ট',
    logoSvg: `
      <!-- Chef / Dining Emblem -->
      <circle cx="0" cy="0" r="22" fill="#ea580c" stroke="#fed7aa" stroke-width="1.5"/>
      <path d="M-10,-4 L-10,12 M-6,-4 L-6,12 M-14,-4 L-14,12 M-10,-4 Q-6,-14 -10,-14" stroke="#ffffff" stroke-width="2"/>
      <path d="M10,-14 L10,12 M6,-4 Q14,-4 10,-14" stroke="#ffffff" stroke-width="2"/>
    `
  },
  hotel_default: {
    primary: '#1e40af',
    secondary: '#2563eb',
    darkBg: '#0f172a',
    accent: '#93c5fd',
    tag: 'আবাসিক হোটেল ও রিসোর্ট',
    logoSvg: `
      <!-- Hotel / Star Emblem -->
      <polygon points="0,-20 6,-6 20,-6 9,4 13,18 0,9 -13,18 -9,4 -20,-6 -6,-6" fill="#facc15"/>
      <text x="0" y="32" fill="#ffffff" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="900" letter-spacing="1" text-anchor="middle">HOTEL</text>
    `
  }
};

/**
 * Detect brand key from brand name or slug
 */
function detectBrandKey(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('aarong') || n.includes('আড়ং')) return 'aarong';
  if (n.includes('apex') || n.includes('এপেক্স')) return 'apex';
  if (n.includes('bata') || n.includes('বাটা')) return 'bata';
  if (n.includes('lotto') || n.includes('লোটো')) return 'lotto';
  if (n.includes('walton') || n.includes('ওয়ালটন')) return 'walton';
  if (n.includes('singer') || n.includes('সিঙ্গার')) return 'singer';
  if (n.includes('samsung') || n.includes('স্যামসাং')) return 'samsung';
  if (n.includes('illiyeen') || n.includes('ইলিয়ীন')) return 'illiyeen';
  if (n.includes('sailor') || n.includes('সেইলর')) return 'sailor';
  if (n.includes('twelve') || n.includes('টুয়েলভ')) return 'twelve';
  if (n.includes('richman') || n.includes('lubnan') || n.includes('রিচম্যান') || n.includes('লুবনান')) return 'richman';
  if (n.includes('gentle park') || n.includes('জেন্টল পার্ক')) return 'gentle_park';
  if (n.includes('infinity') || n.includes('ইনফিনিটি')) return 'infinity';
  if (n.includes('easy') || n.includes('ইজি')) return 'easy';
  if (n.includes('bishworang') || n.includes('বিশ্ব রঙ') || n.includes('বিশ্ববং')) return 'bishworang';
  if (n.includes('artisan') || n.includes('আর্টিসান')) return 'artisan';
  if (n.includes('shwapno') || n.includes('স্বপ্ন')) return 'shwapno';
  if (n.includes('agora') || n.includes('আগোরা')) return 'agora';
  if (n.includes('diamond world') || n.includes('ডায়মন্ড')) return 'diamond_world';
  if (n.includes('butterfly') || n.includes('বাটারফ্লাই')) return 'butterfly';
  if (n.includes('rfl') || n.includes('আরএফএল')) return 'rfl';
  if (n.includes('hotel') || n.includes('হোটেল')) return 'hotel_default';
  if (n.includes('restaurant') || n.includes('রেস্টুরেন্ট') || n.includes('কেবিন') || n.includes('সুইটস')) return 'restaurant_default';
  return 'aarong'; // fallback stylish theme
}

/**
 * Generate official SVG theme image for brands & commercial businesses
 */
export function generateBrandBannerSvg(
  nameBn?: string,
  nameEn?: string,
  categoryLabel?: string,
  location?: string,
  phone?: string
): string {
  const brandKey = detectBrandKey((nameEn || '') + ' ' + (nameBn || ''));
  const theme = BRAND_THEMES[brandKey] || BRAND_THEMES.aarong;

  const cleanBn = (nameBn || 'অফিশিয়াল শোরুম').replace(/[<>&"]/g, '');
  const cleanEn = (nameEn || 'Official Brand Store').replace(/[<>&"]/g, '');
  const cleanCat = (categoryLabel || theme.tag).replace(/[<>&"]/g, '');
  const cleanLoc = (location || 'ময়মনসিংহ').replace(/[<>&"]/g, '');
  const cleanPhone = (phone || 'হটলাইন').replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="55%" stop-color="${theme.secondary}" />
      <stop offset="100%" stop-color="${theme.darkBg}" />
    </linearGradient>

    <!-- Accent Gradient -->
    <linearGradient id="accGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.secondary}" />
    </linearGradient>

    <!-- Brand Emblem Circle Glow -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="450" fill="url(#bgGrad)" />

  <!-- Geometric Decorative Backdrop Elements -->
  <circle cx="700" cy="90" r="220" fill="url(#glow)" />
  <circle cx="90" cy="380" r="160" fill="url(#glow)" />
  
  <!-- Subtle Grid Overlay -->
  <g opacity="0.04" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="90" x2="800" y2="90" />
    <line x1="0" y1="180" x2="800" y2="180" />
    <line x1="0" y1="270" x2="800" y2="270" />
    <line x1="0" y1="360" x2="800" y2="360" />
    <line x1="160" y1="0" x2="160" y2="450" />
    <line x1="320" y1="0" x2="320" y2="450" />
    <line x1="480" y1="0" x2="480" y2="450" />
    <line x1="640" y1="0" x2="640" y2="450" />
  </g>

  <!-- ======================================================== -->
  <!-- Top Left: mymensingh.top Official Brand Seal              -->
  <!-- ======================================================== -->
  <g transform="translate(46, 36)">
    <rect width="186" height="36" rx="18" fill="rgba(15,23,42,0.65)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" />
    <circle cx="20" cy="18" r="6" fill="#10b981" />
    <text x="36" y="23" fill="#ffffff" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" letter-spacing="0.5">mymensingh.top</text>
  </g>

  <!-- ======================================================== -->
  <!-- Top Right: Verified Official Brand Shop Seal             -->
  <!-- ======================================================== -->
  <g transform="translate(560, 36)">
    <rect width="194" height="36" rx="18" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.2" />
    <text x="97" y="23" fill="#34d399" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="12" font-weight="800" text-anchor="middle">&#10003; অফিসিয়াল ব্র্যান্ড শোরুম</text>
  </g>

  <!-- ======================================================== -->
  <!-- Right Side: Official Brand Emblem Container               -->
  <!-- ======================================================== -->
  <g transform="translate(660, 230)">
    <circle cx="0" cy="0" r="76" fill="rgba(15,23,42,0.5)" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
    <circle cx="0" cy="0" r="62" fill="rgba(255,255,255,0.08)" stroke="${theme.accent}" stroke-width="2" />
    ${theme.logoSvg}
  </g>

  <!-- ======================================================== -->
  <!-- Category / Tag Pill Badge                                -->
  <!-- ======================================================== -->
  <g transform="translate(46, 110)">
    <rect width="260" height="32" rx="10" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
    <text x="18" y="21" fill="#ffffff" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13" font-weight="800">&#10022; ${cleanCat}</text>
  </g>

  <!-- ======================================================== -->
  <!-- Brand Main Bengali Name                                  -->
  <!-- ======================================================== -->
  <text x="46" y="195" fill="#ffffff" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="34" font-weight="900">
    ${cleanBn}
  </text>

  <!-- Brand English Name & Tagline                             -->
  <text x="46" y="235" fill="${theme.accent}" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" letter-spacing="0.5">
    ${cleanEn}
  </text>

  <!-- ======================================================== -->
  <!-- Location & Contact Info Panel                            -->
  <!-- ======================================================== -->
  <g transform="translate(46, 280)">
    <rect width="540" height="85" rx="14" fill="rgba(15,23,42,0.65)" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" />
    
    <!-- Location Pin & Text -->
    <text x="20" y="32" fill="#cbd5e1" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13" font-weight="700">
      &#128205; ঠিকানা: <tspan fill="#ffffff" font-weight="800">${cleanLoc}</tspan>
    </text>

    <!-- Phone Hotline -->
    <text x="20" y="64" fill="#cbd5e1" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13" font-weight="700">
      &#128222; যোগাযোগ ও হেল্পলাইন: <tspan fill="#38bdf8" font-weight="800">${cleanPhone}</tspan>
    </text>
  </g>

  <!-- Bottom Accent Stripe with mymensingh.top signature gradient -->
  <rect x="0" y="440" width="800" height="10" fill="url(#accGrad)" />
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
