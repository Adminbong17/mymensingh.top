/**
 * Official Brand & Business Banner SVG Generator for Mymensingh.top
 * Designed to exactly match the official co-branded partnership visual aesthetic:
 * 1. Ultra-clean white background with dynamic corner swooshes
 * 2. Official Brand Logo / Monogram hero section
 * 3. Signature "mymensingh.top" brand text lockup with the red map-pin location marker
 * 4. Dynamic arching underline swoosh
 * 5. Mymensingh Landmark Skyline Watermark (Shambhuganj Brahmaputra Bridge, Alexander Castle / Town Hall Clock Tower, Muktijuddho Memorial Monument, and footpath with footwear tread marks)
 */

interface BrandThemeConfig {
  primary: string;
  darkPrimary: string;
  accent: string;
  renderLogo: (primary: string, darkPrimary: string, accent: string, nameBn?: string, nameEn?: string) => string;
}

// BATA authentic cursive script vector path
const BATA_LOGO_SVG = `
  <g transform="translate(512, 260)">
    <!-- Bata Authentic Cursive Vector Script -->
    <path d="
      M -320,60 
      C -340,55 -345,20 -330,-15 
      C -315,-50 -280,-85 -240,-105 
      C -200,-125 -160,-120 -155,-95 
      C -150,-70 -180,-45 -220,-30 
      C -200,-25 -165,-5 -165,25 
      C -165,55 -195,75 -245,75 
      C -280,75 -305,65 -320,60 Z
      M -235,-48
      C -205,-55 -190,-75 -195,-88
      C -200,-95 -220,-95 -245,-80
      C -270,-65 -288,-45 -295,-28
      C -285,-38 -260,-44 -235,-48 Z
      M -245,55
      C -215,55 -195,45 -195,25
      C -195,5 -220,-5 -250,-5
      C -275,-5 -290,15 -290,32
      C -290,48 -270,55 -245,55 Z

      M -150,45
      C -155,20 -130,-10 -105,-10
      C -90,-10 -80,-2 -75,10
      L -70,-8 L -48,-8 L -66,70 L -90,70 L -87,55
      C -95,65 -110,75 -130,75
      C -150,75 -165,60 -150,45 Z
      M -102,10
      C -118,10 -130,22 -130,38
      C -130,50 -120,58 -108,58
      C -95,58 -82,48 -80,35
      C -78,22 -88,10 -102,10 Z

      M -42,-45 L -18,-45 L -26,-8 L 6,-8 L 2,12 L -30,12 L -42,50
      C -46,62 -40,70 -26,70
      C -18,70 -8,66 -2,62
      L 4,80
      C -8,86 -24,90 -40,90
      C -65,90 -74,75 -66,48
      L -54,12 L -75,12 L -71,-8 L -50,-8 Z

      M 18,45
      C 13,20 38,-10 63,-10
      C 78,-10 88,-2 93,10
      L 98,-8 L 120,-8 L 102,70 L 78,70 L 81,55
      C 73,65 58,75 38,75
      C 18,75 3,60 18,45 Z
      M 66,10
      C 50,10 38,22 38,38
      C 38,50 48,58 60,58
      C 73,58 86,48 88,35
      C 90,22 80,10 66,10 Z
    " fill="#e11d2a" />

    <!-- Registered Trademark ® -->
    <g transform="translate(138, -60)">
      <circle cx="0" cy="0" r="11" fill="none" stroke="#e11d2a" stroke-width="2.5" />
      <text x="0" y="4.5" fill="#e11d2a" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" text-anchor="middle">R</text>
    </g>
  </g>
`;

const BRAND_CONFIGS: Record<string, BrandThemeConfig> = {
  bata: {
    primary: '#e11d2a',
    darkPrimary: '#991b1b',
    accent: '#ef4444',
    renderLogo: () => BATA_LOGO_SVG
  },
  apex: {
    primary: '#0284c7',
    darkPrimary: '#003b70',
    accent: '#38bdf8',
    renderLogo: (primary, dark) => `
      <g transform="translate(512, 235)">
        <polygon points="0,-85 54,0 -54,0" fill="${primary}" />
        <polygon points="0,-60 34,-10 -34,-10" fill="#ffffff" />
        <polygon points="0,-40 20,-16 -20,-16" fill="${dark}" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="82" fill="${dark}" letter-spacing="8">
          APEX<tspan font-size="28" dy="-40">®</tspan>
        </text>
      </g>
    `
  },
  aarong: {
    primary: '#881337',
    darkPrimary: '#4c0519',
    accent: '#d97706',
    renderLogo: (_p, _d, accent) => `
      <g transform="translate(512, 230)">
        <path d="M 0,-75 C -22,-90 -7,-110 12,-99 C 28,-90 36,-70 28,-53 C 20,-40 -2,-37 -17,-49 C -27,-59 -24,-73 -17,-80 Z" fill="${accent}" />
        <circle cx="-2" cy="-77" r="4" fill="#ffffff" />
        <path d="M -12,-57 Q 6,-45 23,-59" stroke="#ffffff" stroke-width="2.5" fill="none" />
        <text x="0" y="85" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', Georgia, serif" font-weight="900" font-size="76" fill="#780016" letter-spacing="12">
          AARONG
        </text>
      </g>
    `
  },
  walton: {
    primary: '#0284c7',
    darkPrimary: '#00529b',
    accent: '#38bdf8',
    renderLogo: (primary, dark) => `
      <g transform="translate(512, 230)">
        <circle cx="0" cy="-45" r="38" fill="${primary}" />
        <circle cx="0" cy="-45" r="28" fill="#ffffff" opacity="0.3" />
        <path d="M -28,-45 Q 0,-62 28,-45 Q 0,-28 -28,-45 Z" fill="#ffffff" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="82" fill="${dark}" letter-spacing="6">
          WALTON
        </text>
      </g>
    `
  },
  samsung: {
    primary: '#1428a0',
    darkPrimary: '#0f172a',
    accent: '#3b82f6',
    renderLogo: (primary) => `
      <g transform="translate(512, 235)">
        <ellipse cx="0" cy="0" rx="205" ry="76" transform="rotate(-6)" fill="${primary}" />
        <text x="0" y="24" text-anchor="middle" transform="rotate(-6)" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="64" fill="#ffffff" letter-spacing="6">
          SAMSUNG
        </text>
      </g>
    `
  },
  singer: {
    primary: '#c8102e',
    darkPrimary: '#881337',
    accent: '#ef4444',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Georgia', 'Times New Roman', serif" font-weight="900" font-size="94" fill="${primary}" letter-spacing="12">
          S I N G E R
        </text>
      </g>
    `
  },
  sailor: {
    primary: '#0d9488',
    darkPrimary: '#115e59',
    accent: '#2dd4bf',
    renderLogo: (primary) => `
      <g transform="translate(512, 230)">
        <path d="M 0,-85 L 0,-25 M -17,-70 L 17,-70 M -30,-45 C -30,-15 30,-15 30,-45" fill="none" stroke="${primary}" stroke-width="6" stroke-linecap="round" />
        <circle cx="0" cy="-88" r="8" fill="none" stroke="${primary}" stroke-width="5" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="78" fill="${primary}" letter-spacing="10">
          SAILOR
        </text>
      </g>
    `
  },
  illiyeen: {
    primary: '#1e293b',
    darkPrimary: '#0f172a',
    accent: '#d97706',
    renderLogo: (primary, _d, accent) => `
      <g transform="translate(512, 230)">
        <path d="M -27,-70 L 0,-95 L 27,-70 L 20,-45 L -20,-45 Z" fill="${accent}" />
        <text x="0" y="85" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="72" fill="${primary}" letter-spacing="14">
          ILLIYEEN
        </text>
      </g>
    `
  },
  twelve: {
    primary: '#334155',
    darkPrimary: '#0f172a',
    accent: '#f43f5e',
    renderLogo: (primary, _d, accent) => `
      <g transform="translate(512, 235)">
        <text x="0" y="10" text-anchor="middle" font-family="'Impact', Arial Black, sans-serif" font-size="115" fill="${primary}">12</text>
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="44" fill="${accent}" letter-spacing="10">TWELVE</text>
      </g>
    `
  },
  lotto: {
    primary: '#dc2626',
    darkPrimary: '#991b1b',
    accent: '#fbbf24',
    renderLogo: (primary) => `
      <g transform="translate(512, 230)">
        <polygon points="-30,-80 0,-105 30,-80 0,-55" fill="${primary}" />
        <polygon points="0,-80 30,-105 60,-80 30,-55" fill="${primary}" opacity="0.8" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="82" fill="${primary}" font-style="italic" letter-spacing="4">
          lotto
        </text>
      </g>
    `
  },
  richman: {
    primary: '#334155',
    darkPrimary: '#0f172a',
    accent: '#d97706',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="82" fill="${primary}" letter-spacing="8">
          RICHMAN
        </text>
      </g>
    `
  },
  gentle_park: {
    primary: '#475569',
    darkPrimary: '#1e293b',
    accent: '#f59e0b',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="70" fill="${primary}" letter-spacing="8">
          GENTLE PARK
        </text>
      </g>
    `
  },
  infinity: {
    primary: '#0f766e',
    darkPrimary: '#134e4a',
    accent: '#14b8a6',
    renderLogo: (primary) => `
      <g transform="translate(512, 230)">
        <path d="M -32,-45 C -52,-65 -72,-45 -52,-25 C -32,-5 0,-45 20,-65 C 40,-85 60,-65 40,-45 C 20,-25 -12,-65 -32,-45 Z" fill="none" stroke="${primary}" stroke-width="7" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="64" fill="${primary}" letter-spacing="6">
          INFINITY MEGA MALL
        </text>
      </g>
    `
  },
  easy: {
    primary: '#0284c7',
    darkPrimary: '#075985',
    accent: '#38bdf8',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="94" fill="${primary}" letter-spacing="10">
          EASY
        </text>
      </g>
    `
  },
  bishworang: {
    primary: '#b91c1c',
    darkPrimary: '#7f1d1d',
    accent: '#f59e0b',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Hind Siliguri', 'Cinzel', serif" font-weight="900" font-size="78" fill="${primary}" letter-spacing="6">
          BISHWORANG
        </text>
      </g>
    `
  },
  artisan: {
    primary: '#7c2d12',
    darkPrimary: '#431407',
    accent: '#f97316',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="78" fill="${primary}" letter-spacing="8">
          ARTISAN
        </text>
      </g>
    `
  },
  shwapno: {
    primary: '#16a34a',
    darkPrimary: '#14532d',
    accent: '#dc2626',
    renderLogo: (primary, _d, accent) => `
      <g transform="translate(512, 230)">
        <path d="M -27,-40 C -27,-70 27,-70 27,-40" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round" />
        <circle cx="0" cy="-50" r="14" fill="${accent}" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="900" font-size="76" fill="${primary}" letter-spacing="3">
          shwapno
        </text>
      </g>
    `
  },
  agora: {
    primary: '#15803d',
    darkPrimary: '#14532d',
    accent: '#ea580c',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="900" font-size="90" fill="${primary}" letter-spacing="4">
          agora
        </text>
      </g>
    `
  },
  diamond_world: {
    primary: '#831843',
    darkPrimary: '#500724',
    accent: '#f59e0b',
    renderLogo: (_p, _d, accent) => `
      <g transform="translate(512, 230)">
        <polygon points="0,-95 38,-65 23,-20 -23,-20 -38,-65" fill="${accent}" stroke="#701a75" stroke-width="3" />
        <text x="0" y="85" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="62" fill="#701a75" letter-spacing="6">
          DIAMOND WORLD
        </text>
      </g>
    `
  },
  butterfly: {
    primary: '#0284c7',
    darkPrimary: '#0369a1',
    accent: '#f97316',
    renderLogo: (primary) => `
      <g transform="translate(512, 250)">
        <text x="0" y="0" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="76" fill="${primary}" letter-spacing="6">
          BUTTERFLY
        </text>
      </g>
    `
  },
  rfl: {
    primary: '#dc2626',
    darkPrimary: '#991b1b',
    accent: '#facc15',
    renderLogo: (primary) => `
      <g transform="translate(512, 230)">
        <rect x="-92" y="-95" width="184" height="65" rx="14" fill="${primary}" />
        <text x="0" y="-45" text-anchor="middle" font-family="'Impact', Arial Black, sans-serif" font-size="52" fill="#ffffff" letter-spacing="4">RFL</text>
        <text x="0" y="80" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', sans-serif" font-weight="900" font-size="66" fill="${primary}" letter-spacing="4">
          BEST BUY
        </text>
      </g>
    `
  },
  restaurant_default: {
    primary: '#ea580c',
    darkPrimary: '#9a3412',
    accent: '#facc15',
    renderLogo: (primary, _d, _a, nameBn, nameEn) => {
      const title = (nameEn || nameBn || 'RESTAURANT').toUpperCase();
      return `
        <g transform="translate(512, 245)">
          <circle cx="0" cy="-65" r="30" fill="${primary}" />
          <path d="M -15,-65 L -15,-80 M -9,-65 L -9,-80 M -3,-65 L -3,-80 M -9,-65 L -9,-50" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 9,-80 L 15,-65 L 9,-65 L 9,-50" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <text x="0" y="45" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="52" fill="#1e293b" letter-spacing="4">
            ${title.length > 20 ? title.substring(0, 20) + '...' : title}
          </text>
        </g>
      `;
    }
  },
  hotel_default: {
    primary: '#0f766e',
    darkPrimary: '#134e4a',
    accent: '#f59e0b',
    renderLogo: (primary, _d, accent, nameBn, nameEn) => {
      const title = (nameEn || nameBn || 'HOTEL & RESORT').toUpperCase();
      return `
        <g transform="translate(512, 245)">
          <g fill="${accent}">
            <polygon points="-40,-65 -36,-53 -24,-53 -34,-45 -30,-33 -40,-41 -50,-33 -46,-45 -56,-53 -44,-53" />
            <polygon points="-20,-75 -16,-63 -4,-63 -14,-55 -10,-43 -20,-51 -30,-43 -26,-55 -36,-63 -24,-63" />
            <polygon points="0,-82 4,-70 16,-70 6,-62 10,-50 0,-58 -10,-50 -6,-62 -16,-70 -4,-70" />
            <polygon points="20,-75 24,-63 36,-63 26,-55 30,-43 20,-51 10,-43 14,-55 4,-63 16,-63" />
            <polygon points="40,-65 44,-53 56,-53 46,-45 50,-33 40,-41 30,-33 34,-45 24,-53 36,-53" />
          </g>
          <text x="0" y="45" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="50" fill="${primary}" letter-spacing="4">
            ${title.length > 22 ? title.substring(0, 22) + '...' : title}
          </text>
        </g>
      `;
    }
  },
  general_default: {
    primary: '#e11d2a',
    darkPrimary: '#991b1b',
    accent: '#ef4444',
    renderLogo: (primary, _d, _a, nameBn, nameEn) => {
      const title = (nameEn || nameBn || 'OFFICIAL OUTLET').toUpperCase();
      return `
        <g transform="translate(512, 245)">
          <circle cx="0" cy="-60" r="32" fill="${primary}" />
          <!-- Storefront shopping bag icon -->
          <path d="M -16,-60 L -12,-40 L 12,-40 L 16,-60 Z" fill="#ffffff" />
          <path d="M -7,-60 C -7,-70 7,-70 7,-60" fill="none" stroke="#ffffff" stroke-width="2.5" />
          <text x="0" y="45" text-anchor="middle" font-family="'Montserrat', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="52" fill="#111827" letter-spacing="4">
            ${title.length > 20 ? title.substring(0, 20) + '...' : title}
          </text>
        </g>
      `;
    }
  }
};

/**
 * Identify brand key from name
 */
function detectBrandKey(text: string): string {
  const n = text.toLowerCase();
  if (n.includes('bata') || n.includes('বাটা')) return 'bata';
  if (n.includes('apex') || n.includes('অ্যাপেক্স')) return 'apex';
  if (n.includes('aarong') || n.includes('আড়ং') || n.includes('আড়ং')) return 'aarong';
  if (n.includes('walton') || n.includes('ওয়ালটন') || n.includes('ওয়ালটন')) return 'walton';
  if (n.includes('samsung') || n.includes('স্যামসাং')) return 'samsung';
  if (n.includes('singer') || n.includes('সিঙ্গার')) return 'singer';
  if (n.includes('sailor') || n.includes('সেইলর')) return 'sailor';
  if (n.includes('illiyeen') || n.includes('ইলিয়ীন') || n.includes('ইলিয়ীন')) return 'illiyeen';
  if (n.includes('twelve') || n.includes('টুয়েলভ') || n.includes('টুয়েলভ')) return 'twelve';
  if (n.includes('lotto') || n.includes('লোটো')) return 'lotto';
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
  if (n.includes('hotel') || n.includes('হোটেল') || n.includes('resort') || n.includes('রিসোর্ট')) return 'hotel_default';
  if (n.includes('restaurant') || n.includes('রেস্টুরেন্ট') || n.includes('কেবিন') || n.includes('সুইটস')) return 'restaurant_default';
  return 'general_default';
}

/**
 * Generate official SVG theme image for brands & commercial businesses
 * Matches user's exact reference template:
 * - 1024x768 canvas
 * - Dynamic corner swooshes
 * - Prominent official brand logo
 * - "mymensingh.top" text lockup with red map pin
 * - Dynamic arching underline swoosh
 * - Mymensingh landmark skyline silhouette
 */
export function generateBrandBannerSvg(
  nameBn?: string,
  nameEn?: string,
  _categoryLabel?: string,
  _location?: string,
  _phone?: string
): string {
  const brandKey = detectBrandKey((nameEn || '') + ' ' + (nameBn || ''));
  const theme = BRAND_CONFIGS[brandKey] || BRAND_CONFIGS.general_default;
  const logoMarkup = theme.renderLogo(theme.primary, theme.darkPrimary, theme.accent, nameBn, nameEn);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
  <defs>
    <!-- Dynamic Corner Gradients -->
    <linearGradient id="topSwoosh" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="60%" stop-color="${theme.primary}" />
      <stop offset="100%" stop-color="${theme.darkPrimary}" />
    </linearGradient>

    <linearGradient id="bottomSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="50%" stop-color="${theme.primary}" />
      <stop offset="100%" stop-color="${theme.darkPrimary}" />
    </linearGradient>

    <linearGradient id="underlineSwoosh" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="80%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.primary}" />
    </linearGradient>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- 1. Background Base Canvas -->
  <rect width="1024" height="768" fill="#ffffff" />
  
  <!-- Subtle ambient radial tint -->
  <radialGradient id="centerGlow" cx="50%" cy="45%" r="65%">
    <stop offset="0%" stop-color="#ffffff" />
    <stop offset="75%" stop-color="#ffffff" />
    <stop offset="100%" stop-color="#f8fafc" />
  </radialGradient>
  <rect width="1024" height="768" fill="url(#centerGlow)" />

  <!-- 2. Top-Left Dynamic Swoosh Group -->
  <g>
    <!-- Secondary deep curve -->
    <path d="M 0,140 C 130,185 30,270 0,310 Z" fill="${theme.darkPrimary}" opacity="0.3" />
    <!-- White backing outline -->
    <path d="M 0,185 C 180,137 342,75 496,0 L 512,0 C 355,82 190,146 0,197 Z" fill="#ffffff" filter="url(#softShadow)" />
    <!-- Primary top swoosh -->
    <path d="M 0,0 L 480,0 C 330,70 170,130 0,175 Z" fill="url(#topSwoosh)" />
    <!-- White accent ribbon divider -->
    <path d="M 0,175 C 170,130 330,70 480,0 L 496,0 C 342,75 180,137 0,186 Z" fill="#ffffff" />
  </g>

  <!-- 3. Bottom-Right Dynamic Swoosh Group -->
  <g>
    <!-- Secondary base curve -->
    <path d="M 440,768 C 630,730 840,740 1024,650 L 1024,768 Z" fill="${theme.darkPrimary}" opacity="0.6" />
    <!-- White edge highlight -->
    <path d="M 1024,450 C 924,530 790,650 470,768 L 488,768 C 802,654 934,536 1024,460 Z" fill="#ffffff" opacity="0.9" />
    <!-- Main sweeping wave -->
    <path d="M 1024,768 L 1024,460 C 930,535 800,650 490,768 Z" fill="url(#bottomSwoosh)" />
    <!-- White interior ribbon flourish -->
    <path d="M 540,768 C 740,685 890,600 1024,530 L 1024,545 C 895,612 750,695 560,768 Z" fill="#ffffff" opacity="0.3" />
  </g>

  <!-- 4. Mymensingh Landmark Skyline Silhouette (Watermark Background) -->
  <g fill="${theme.primary}" opacity="0.22" style="color: ${theme.primary};">
    <!-- A. Trees & Riverbank Foliage Background -->
    <path d="M 20,590 C 20,570 45,560 65,570 C 80,555 105,560 115,575 C 130,560 155,565 160,585 C 170,575 190,580 195,595 Z" opacity="0.6" />
    <path d="M 210,595 C 220,575 245,570 260,582 C 275,568 300,572 310,590 C 320,578 340,580 345,600 Z" opacity="0.6" />
    <path d="M 370,602 C 380,580 405,575 425,588 C 440,575 465,580 470,605 Z" opacity="0.6" />
    <path d="M 680,610 C 690,585 715,580 730,595 C 745,582 770,588 775,612 Z" opacity="0.6" />
    <path d="M 800,612 C 810,588 835,585 850,600 C 865,590 885,595 890,615 Z" opacity="0.6" />

    <!-- B. Shambhuganj Brahmaputra Bridge (Left) -->
    <!-- Roadway deck -->
    <path d="M 0,584 L 430,612 L 430,622 L 0,594 Z" />
    <rect x="0" y="580" width="430" height="4" rx="1" />
    <!-- Railing Posts -->
    <g opacity="0.7">
      <line x1="20" y1="580" x2="20" y2="585" stroke="${theme.primary}" stroke-width="2" />
      <line x1="50" y1="582" x2="50" y2="587" stroke="${theme.primary}" stroke-width="2" />
      <line x1="80" y1="584" x2="80" y2="589" stroke="${theme.primary}" stroke-width="2" />
      <line x1="110" y1="586" x2="110" y2="591" stroke="${theme.primary}" stroke-width="2" />
      <line x1="140" y1="588" x2="140" y2="593" stroke="${theme.primary}" stroke-width="2" />
      <line x1="170" y1="590" x2="170" y2="595" stroke="${theme.primary}" stroke-width="2" />
      <line x1="200" y1="592" x2="200" y2="597" stroke="${theme.primary}" stroke-width="2" />
      <line x1="230" y1="594" x2="230" y2="599" stroke="${theme.primary}" stroke-width="2" />
      <line x1="260" y1="596" x2="260" y2="601" stroke="${theme.primary}" stroke-width="2" />
      <line x1="290" y1="598" x2="290" y2="603" stroke="${theme.primary}" stroke-width="2" />
      <line x1="320" y1="600" x2="320" y2="605" stroke="${theme.primary}" stroke-width="2" />
      <line x1="350" y1="602" x2="350" y2="607" stroke="${theme.primary}" stroke-width="2" />
      <line x1="380" y1="604" x2="380" y2="609" stroke="${theme.primary}" stroke-width="2" />
      <line x1="410" y1="606" x2="410" y2="611" stroke="${theme.primary}" stroke-width="2" />
    </g>

    <!-- Arches under deck -->
    <path d="M 0,594 Q 30,578 60,598 M 60,598 Q 98,582 135,602 M 135,602 Q 175,586 215,606 M 215,606 Q 258,590 300,610 M 300,610 Q 345,594 385,614 M 385,614 Q 410,605 430,616" fill="none" stroke="${theme.primary}" stroke-width="5" />
    
    <!-- Bridge Piers -->
    <rect x="56" y="598" width="8" height="38" rx="2" />
    <rect x="131" y="602" width="8" height="36" rx="2" />
    <rect x="211" y="606" width="9" height="34" rx="2" />
    <rect x="296" y="610" width="9" height="32" rx="2" />
    <rect x="381" y="614" width="9" height="30" rx="2" />

    <!-- Water ripples under bridge -->
    <line x1="15" y1="642" x2="160" y2="642" stroke="${theme.primary}" stroke-width="2.5" opacity="0.4" />
    <line x1="85" y1="650" x2="230" y2="650" stroke="${theme.primary}" stroke-width="2" opacity="0.3" />
    <line x1="190" y1="658" x2="350" y2="658" stroke="${theme.primary}" stroke-width="2.5" opacity="0.4" />

    <!-- C. Mymensingh Town Hall / Alexander Castle & Historic Clock Tower (Center) -->
    <!-- Castle Left Wing -->
    <path d="M 465,622 L 465,570 L 480,570 L 480,554 C 480,542 506,542 506,554 L 506,570 L 562,570 L 562,622 Z" />
    <!-- Castle Right Wing -->
    <path d="M 606,622 L 606,570 L 664,570 L 664,554 C 664,542 692,542 692,554 L 692,570 L 706,570 L 706,622 Z" />
    <!-- Wing turrets cupolas -->
    <path d="M 480,554 C 480,538 506,538 506,554 Z" />
    <path d="M 664,554 C 664,538 692,538 692,554 Z" />
    
    <!-- Central Tower Base & Mid Section -->
    <rect x="556" y="504" width="56" height="118" rx="2" />
    <!-- Clock Tower Cornice & Balcony -->
    <rect x="550" y="546" width="68" height="6" rx="1" />
    <rect x="552" y="500" width="64" height="6" rx="1" />
    <!-- Clock Dial -->
    <circle cx="584" cy="524" r="14" fill="#ffffff" stroke="${theme.primary}" stroke-width="2.5" />
    <circle cx="584" cy="524" r="2.5" fill="${theme.primary}" />
    <line x1="584" y1="524" x2="584" y2="515" stroke="${theme.primary}" stroke-width="2.5" stroke-linecap="round" />
    <line x1="584" y1="524" x2="592" y2="524" stroke="${theme.primary}" stroke-width="2" stroke-linecap="round" />
    <!-- Clock Tower Domed Roof -->
    <path d="M 556,500 C 556,468 612,468 612,500 Z" />
    <!-- Spire / Finial -->
    <line x1="584" y1="468" x2="584" y2="445" stroke="${theme.primary}" stroke-width="3" stroke-linecap="round" />
    <circle cx="584" cy="443" r="3.5" />

    <!-- Castle Arched Windows -->
    <g fill="#ffffff" opacity="0.75">
      <rect x="475" y="580" width="9" height="20" rx="4.5" />
      <rect x="495" y="580" width="9" height="20" rx="4.5" />
      <rect x="515" y="580" width="9" height="20" rx="4.5" />
      <rect x="535" y="580" width="9" height="20" rx="4.5" />
      <rect x="620" y="580" width="9" height="20" rx="4.5" />
      <rect x="640" y="580" width="9" height="20" rx="4.5" />
      <rect x="660" y="580" width="9" height="20" rx="4.5" />
      <rect x="680" y="580" width="9" height="20" rx="4.5" />
      <!-- Tower lower arched portal -->
      <rect x="575" y="575" width="18" height="40" rx="9" />
    </g>

    <!-- D. Liberation War Memorial Monument (Right side) -->
    <!-- Soaring Left Blade -->
    <path d="M 724,622 C 730,550 738,505 754,472 L 763,472 C 750,515 744,560 740,622 Z" />
    <!-- Soaring Tall Center Blade -->
    <path d="M 755,622 C 760,530 766,475 776,440 L 785,440 C 778,485 772,540 768,622 Z" />
    <!-- Soaring Right Blade -->
    <path d="M 780,622 C 785,550 793,505 806,472 L 815,472 C 802,515 796,560 792,622 Z" />
    <!-- Monument Base Step -->
    <rect x="712" y="620" width="112" height="6" rx="2" />

    <!-- E. Distant BAU Colonnade & Water Tower Silhouette -->
    <rect x="835" y="560" width="7" height="62" />
    <rect x="850" y="560" width="7" height="62" />
    <rect x="865" y="560" width="7" height="62" />
    <rect x="830" y="555" width="48" height="6" rx="1" />
    <!-- Distant tower -->
    <rect x="895" y="530" width="14" height="92" rx="2" />
    <circle cx="902" cy="522" r="12" />

    <!-- F. Foreground Roadway / Footpath with Stylized Shoe Prints -->
    <path d="M 160,725 C 320,685 480,665 710,642" fill="none" stroke="${theme.primary}" stroke-width="2.5" stroke-dasharray="6,12" opacity="0.35" />
    <path d="M 100,768 C 290,710 490,685 770,650" fill="none" stroke="${theme.primary}" stroke-width="3" opacity="0.28" />

    <!-- Stylized Shoe Tread Footprints leading to city -->
    <g transform="translate(290, 745) rotate(-22) scale(0.9)" opacity="0.45">
      <path d="M -10,-24 C 12,-24 16,-5 14,8 C 12,18 2,24 -8,22 C -16,20 -18,12 -16,0 C -15,-12 -14,-24 -10,-24 Z" fill="none" stroke="${theme.primary}" stroke-width="3" stroke-dasharray="3,3" />
      <line x1="-8" y1="-16" x2="8" y2="-16" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-10" y1="-8" x2="10" y2="-8" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-10" y1="0" x2="8" y2="0" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-8" y1="8" x2="6" y2="8" stroke="${theme.primary}" stroke-width="2" />
      <rect x="-8" y="16" width="14" height="10" rx="3" fill="none" stroke="${theme.primary}" stroke-width="2" />
    </g>

    <g transform="translate(360, 715) rotate(-20) scale(0.8)" opacity="0.4">
      <path d="M -10,-24 C 12,-24 16,-5 14,8 C 12,18 2,24 -8,22 C -16,20 -18,12 -16,0 C -15,-12 -14,-24 -10,-24 Z" fill="none" stroke="${theme.primary}" stroke-width="3" stroke-dasharray="3,3" />
      <line x1="-8" y1="-16" x2="8" y2="-16" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-10" y1="-8" x2="10" y2="-8" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-10" y1="0" x2="8" y2="0" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-8" y1="8" x2="6" y2="8" stroke="${theme.primary}" stroke-width="2" />
      <rect x="-8" y="16" width="14" height="10" rx="3" fill="none" stroke="${theme.primary}" stroke-width="2" />
    </g>

    <g transform="translate(470, 680) rotate(-18) scale(0.68)" opacity="0.35">
      <path d="M -10,-24 C 12,-24 16,-5 14,8 C 12,18 2,24 -8,22 C -16,20 -18,12 -16,0 C -15,-12 -14,-24 -10,-24 Z" fill="none" stroke="${theme.primary}" stroke-width="3" stroke-dasharray="3,3" />
      <line x1="-8" y1="-16" x2="8" y2="-16" stroke="${theme.primary}" stroke-width="2" />
      <line x1="-10" y1="-8" x2="10" y2="-8" stroke="${theme.primary}" stroke-width="2" />
      <rect x="-8" y="16" width="14" height="10" rx="3" fill="none" stroke="${theme.primary}" stroke-width="2" />
    </g>

    <g transform="translate(545, 656) rotate(-16) scale(0.55)" opacity="0.3">
      <path d="M -10,-24 C 12,-24 16,-5 14,8 C 12,18 2,24 -8,22 C -16,20 -18,12 -16,0 C -15,-12 -14,-24 -10,-24 Z" fill="none" stroke="${theme.primary}" stroke-width="3" stroke-dasharray="3,3" />
      <line x1="-8" y1="-16" x2="8" y2="-16" stroke="${theme.primary}" stroke-width="2" />
      <rect x="-8" y="16" width="14" height="10" rx="3" fill="none" stroke="${theme.primary}" stroke-width="2" />
    </g>

    <g transform="translate(630, 638) rotate(-14) scale(0.45)" opacity="0.25">
      <path d="M -10,-24 C 12,-24 16,-5 14,8 C 12,18 2,24 -8,22 C -16,20 -18,12 -16,0 C -15,-12 -14,-24 -10,-24 Z" fill="none" stroke="${theme.primary}" stroke-width="3" stroke-dasharray="3,3" />
    </g>
  </g>

  <!-- 5. Center Stage: Official Brand Logo & mymensingh.top Lockup -->
  
  <!-- A. Official Brand Logo / Monogram -->
  ${logoMarkup}

  <!-- B. "mymensingh.top" Brand Text Lockup -->
  <!-- Starts at x=178, baseline at y=425 -->
  <g id="logoLockup">
    <!-- "mymensingh.t" in heavy geometric black sans -->
    <text x="178" y="425" font-family="'Montserrat', 'Inter', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="78" letter-spacing="-1.2" fill="#111827">mymensingh.t</text>

    <!-- Map Pin for the letter "o" (Centered at x=805, y=388) -->
    <g transform="translate(805, 388)">
      <!-- Radar / Beacon Ring on ground -->
      <ellipse cx="0" cy="34" rx="24" ry="6" fill="none" stroke="${theme.primary}" stroke-width="3.5" />
      
      <!-- Teardrop Map Pin -->
      <path d="M 0,-38 C -19,-38 -32,-22 -32,0 C -32,20 0,38 0,38 C 0,38 32,20 32,0 C 32,-22 19,-38 0,-38 Z" fill="${theme.primary}" />
      
      <!-- Inner cutout circle -->
      <circle cx="0" cy="-8" r="11" fill="#ffffff" />
    </g>

    <!-- "p" in heavy geometric black sans -->
    <text x="844" y="425" font-family="'Montserrat', 'Inter', 'Segoe UI Black', Arial Black, sans-serif" font-weight="900" font-size="78" letter-spacing="-1.2" fill="#111827">p</text>
  </g>

  <!-- C. Dynamic Underline Swoosh -->
  <!-- Arching right below mymensingh.top -->
  <path d="M 110,488 C 260,434 500,430 885,456 C 560,446 290,458 130,496 Z" fill="url(#underlineSwoosh)" />

</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
