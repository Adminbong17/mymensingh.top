/**
 * Doctor Branded Banner SVG Generator for Mymensingh.top
 * Automatically creates a professional official banner card
 * combining mymensingh.top branding, doctor name, and specialty.
 */
export function generateDoctorBannerSvg(
  nameBn: string,
  nameEn?: string,
  specialty?: string,
  chamber?: string
): string {
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

  <!-- Background Canvas -->
  <rect width="800" height="450" fill="url(#bg)" />
  <circle cx="700" cy="80" r="180" fill="#10b981" fill-opacity="0.15" />
  <circle cx="100" cy="380" r="140" fill="#14b8a6" fill-opacity="0.1" />

  <!-- mymensingh.top Official Header Brand Seal -->
  <g transform="translate(50, 38)">
    <rect width="180" height="34" rx="17" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" />
    <circle cx="20" cy="17" r="7" fill="#10b981" />
    <text x="36" y="22" fill="#ffffff" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" letter-spacing="0.5">mymensingh.top</text>
  </g>

  <!-- Verified Doctor Seal -->
  <g transform="translate(575, 38)">
    <rect width="175" height="34" rx="17" fill="rgba(16, 185, 129, 0.25)" stroke="rgba(16, 185, 129, 0.6)" stroke-width="1.2" />
    <text x="88" y="22" fill="#34d399" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="12" font-weight="800" text-anchor="middle">&#10003; ভেরিফাইড চিকিৎসক</text>
  </g>

  <!-- Doctor Medical Emblem Graphic on Right -->
  <g transform="translate(650, 240)">
    <circle cx="0" cy="0" r="68" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    <circle cx="0" cy="0" r="52" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2" />
    <!-- Medical Cross -->
    <rect x="-8" y="-28" width="16" height="56" rx="4" fill="#ffffff" />
    <rect x="-28" y="-8" width="56" height="16" rx="4" fill="#ffffff" />
    <circle cx="0" cy="0" r="7" fill="#10b981" />
  </g>

  <!-- Specialty Badge -->
  <g transform="translate(50, 115)">
    <rect width="250" height="34" rx="10" fill="url(#accent)" />
    <text x="18" y="22" fill="#022c22" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13" font-weight="900">&#129658; ${cleanSpec}</text>
  </g>

  <!-- Doctor Bengali Name -->
  <text x="50" y="205" fill="#ffffff" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="30" font-weight="900">
    ${cleanBn}
  </text>

  <!-- Doctor English Name -->
  <text x="50" y="245" fill="#a7f3d0" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700">
    ${cleanEn}
  </text>

  <!-- Chamber / Hospital Location Banner -->
  <g transform="translate(50, 290)">
    <rect width="530" height="70" rx="14" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />
    <text x="20" y="28" fill="#94a3b8" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="12" font-weight="700">&#127973; চেম্বার ও রোগী দেখার স্থান:</text>
    <text x="20" y="52" fill="#f8fafc" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="14" font-weight="700">${cleanChamber}</text>
  </g>

  <!-- Bottom Accent Line -->
  <rect x="0" y="442" width="800" height="8" fill="url(#accent)" />
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
