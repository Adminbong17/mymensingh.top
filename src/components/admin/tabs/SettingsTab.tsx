import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  FileText,
  Layers,
  LayoutGrid,
  UserCheck,
  Store,
  Mail,
  Search,
  CreditCard,
  Lock,
  Server,
  MapPin,
  Share2,
  Save,
  CheckCircle2,
  Globe,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [activeSubNav, setActiveSubNav] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved settings from localStorage if available
  const savedSettings = (() => {
    try {
      const item = localStorage.getItem('mymensingh_platform_settings_v1');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })();

  // Form states
  const [siteName, setSiteName] = useState(savedSettings?.siteName || 'Mymensingh');
  const [tagline, setTagline] = useState(savedSettings?.tagline || 'People | Community | Development');
  const [description, setDescription] = useState(
    savedSettings?.description ||
      "Mymensingh's largest community platform for business, education, accommodation, blood donation, news, events and more."
  );
  const [websiteUrl, setWebsiteUrl] = useState(savedSettings?.websiteUrl || 'https://mymensingh.top');
  const [contactEmail, setContactEmail] = useState(savedSettings?.contactEmail || 'info@mymensingh.top');

  // Location settings
  const [division, setDivision] = useState(savedSettings?.division || 'Mymensingh');
  const [zilla, setZilla] = useState(savedSettings?.zilla || 'Mymensingh');
  const [upazila, setUpazila] = useState(savedSettings?.upazila || 'Muktagacha');
  const [address, setAddress] = useState(savedSettings?.address || 'Muktagacha, Mymensingh, Bangladesh');

  // Social Links
  const [fbUrl, setFbUrl] = useState(savedSettings?.fbUrl || 'https://facebook.com/mymensingh');
  const [ytUrl, setYtUrl] = useState(savedSettings?.ytUrl || 'https://youtube.com/@mymensingh');
  const [instaUrl, setInstaUrl] = useState(savedSettings?.instaUrl || 'https://instagram.com/mymensingh');
  const [xUrl, setXUrl] = useState(savedSettings?.xUrl || 'https://x.com/mymensingh');
  const [liUrl, setLiUrl] = useState(savedSettings?.liUrl || 'https://linkedin.com/company/mymensingh');

  // Appearance
  const [primaryColor, setPrimaryColor] = useState(savedSettings?.primaryColor || '#16a34a');
  const [secondaryColor, setSecondaryColor] = useState(savedSettings?.secondaryColor || '#2563eb');
  const [themeMode, setThemeMode] = useState(savedSettings?.themeMode || 'Light');
  const [fontFamily, setFontFamily] = useState(savedSettings?.fontFamily || 'Inter (Default)');

  // Platform Status
  const [maintenanceMode, setMaintenanceMode] = useState(savedSettings?.maintenanceMode ?? false);
  const [allowRegistration, setAllowRegistration] = useState(savedSettings?.allowRegistration ?? true);
  const [allowBusinessListings, setAllowBusinessListings] = useState(savedSettings?.allowBusinessListings ?? true);
  const [autoApproveListings, setAutoApproveListings] = useState(savedSettings?.autoApproveListings ?? false);

  // Defaults
  const [defaultLang, setDefaultLang] = useState(savedSettings?.defaultLang || 'English');
  const [itemsPerPage, setItemsPerPage] = useState(savedSettings?.itemsPerPage || '10');
  const [dateFormat, setDateFormat] = useState(savedSettings?.dateFormat || '26 Sep 2026');
  const [timeFormat, setTimeFormat] = useState(savedSettings?.timeFormat || '12 Hour (AM/PM)');
  const [timezone, setTimezone] = useState(savedSettings?.timezone || '(GMT +6:00) Dhaka');

  const subNavItems = [
    { id: 'general', label: 'General Settings', desc: 'Site information, basic configuration', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', desc: 'Logo, colors, theme, layout', icon: Palette },
    { id: 'pages', label: 'Pages & Content', desc: 'Manage static pages', icon: FileText },
    { id: 'categories', label: 'Categories', desc: 'Manage categories settings', icon: Layers },
    { id: 'modules', label: 'Modules', desc: 'Blood Bank, Tuition, To-Let, News', icon: LayoutGrid },
    { id: 'users', label: 'Users & Permissions', desc: 'Roles, permissions, access control', icon: UserCheck },
    { id: 'business', label: 'Business Settings', desc: 'Approval, listing, verification', icon: Store },
    { id: 'email', label: 'Email & SMS', desc: 'Notifications, templates', icon: Mail },
    { id: 'seo', label: 'SEO & Analytics', desc: 'Meta tags, analytics, sitemap', icon: Search },
    { id: 'payment', label: 'Payment Settings', desc: 'Payment gateways and plans', icon: CreditCard },
    { id: 'security', label: 'Security', desc: 'Banned users, spam control', icon: Lock },
    { id: 'system', label: 'System', desc: 'Cache, backup, maintenance', icon: Server }
  ];

  const handleSave = () => {
    // Save settings
    const settingsPayload = {
      siteName,
      tagline,
      description,
      websiteUrl,
      contactEmail,
      division,
      zilla,
      upazila,
      address,
      fbUrl,
      ytUrl,
      instaUrl,
      xUrl,
      liUrl,
      primaryColor,
      secondaryColor,
      themeMode,
      fontFamily,
      maintenanceMode,
      allowRegistration,
      allowBusinessListings,
      autoApproveListings,
      defaultLang,
      itemsPerPage,
      dateFormat,
      timeFormat,
      timezone
    };
    try {
      localStorage.setItem('mymensingh_platform_settings_v1', JSON.stringify(settingsPayload));
    } catch (e) {
      // storage quota or disabled
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Settings</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage your platform settings, preferences and configurations.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Platform settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Layout matching media_1790618966151.jpg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Sub-Navigation Menu */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubNav(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50/70 border-l-4 border-emerald-600 text-slate-900'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isActive ? 'text-emerald-700 font-bold' : 'text-slate-400'
                  }`}
                />
                <div>
                  <div
                    className={`text-xs ${
                      isActive ? 'font-black text-emerald-950' : 'font-bold text-slate-800'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium line-clamp-1">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center / Right Settings Panels */}
        <div className="lg:col-span-9 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Center Column: Site Info, Location, Socials */}
            <div className="lg:col-span-7 space-y-5">
              {/* Site Information */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <SettingsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Site Information</h3>
                    <p className="text-[10px] text-slate-400">Basic information about your platform</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Website Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        This name will be displayed across the platform.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Logo Preview & Change Button */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                    <span className="text-[10px] font-bold text-slate-500 mb-2">Site Logo</span>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-700/20 mb-2">
                      <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current" aria-hidden="true">
                        <path d="M12 2L4 9l2 1.5L12 5l6 5.5L20 9l-8-7zm0 6l-6 5.25 1.5 1.35L12 9.5l4.5 3.1 1.5-1.35L12 8zm-8 8.5L12 22l8-5.5-2-1.5L12 19l-6-4-2 1.5z" />
                      </svg>
                    </div>
                    <div className="font-extrabold text-[11px] text-slate-900 mb-2">Mymensingh</div>
                    <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold shadow-xs cursor-pointer">
                      Change Logo
                    </button>
                    <span className="text-[8px] text-slate-400 mt-1">Recommended size: 200 × 200 px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location Settings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Location Settings</h3>
                    <p className="text-[10px] text-slate-400">Set default location for your platform</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Default Division
                    </label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>Mymensingh</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Default Zilla
                    </label>
                    <select
                      value={zilla}
                      onChange={(e) => setZilla(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>Mymensingh</option>
                      <option>Jamalpur</option>
                      <option>Netrokona</option>
                      <option>Sherpur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Default Upazila
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>Muktagacha</option>
                      <option>Mymensingh Sadar</option>
                      <option>Trishal</option>
                      <option>Bhaluka</option>
                      <option>Fulbaria</option>
                      <option>Gaffargaon</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Map (Optional)
                    </label>
                    <button className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Set Location</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Social Media Links</h3>
                    <p className="text-[10px] text-slate-400">Add your official social media pages</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">f</span>
                      <span>Facebook</span>
                    </label>
                    <input
                      type="text"
                      value={fbUrl}
                      onChange={(e) => setFbUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-black">▶</span>
                      <span>YouTube</span>
                    </label>
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center text-[9px] font-black">📷</span>
                      <span>Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={instaUrl}
                      onChange={(e) => setInstaUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black">𝕏</span>
                      <span>X (Twitter)</span>
                    </label>
                    <input
                      type="text"
                      value={xUrl}
                      onChange={(e) => setXUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center text-[9px] font-black">in</span>
                      <span>LinkedIn</span>
                    </label>
                    <input
                      type="text"
                      value={liUrl}
                      onChange={(e) => setLiUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Appearance, Platform Status, Default Settings */}
            <div className="lg:col-span-5 space-y-5">
              {/* Appearance Settings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Appearance Settings</h3>
                    <p className="text-[10px] text-slate-400">Customize the look and feel</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-semibold text-slate-700">{primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-semibold text-slate-700">{secondaryColor}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Theme Mode
                    </label>
                    <select
                      value={themeMode}
                      onChange={(e) => setThemeMode(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>Inter (Default)</option>
                      <option>Hind Siliguri</option>
                      <option>Roboto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Platform Status */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Platform Status</h3>
                    <p className="text-[10px] text-slate-400">Control platform availability</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Maintenance Mode</div>
                      <div className="text-[10px] text-slate-400">Temporarily take the site offline for maintenance.</div>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        maintenanceMode ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Allow New Registrations</div>
                      <div className="text-[10px] text-slate-400">Allow new users to register.</div>
                    </div>
                    <button
                      onClick={() => setAllowRegistration(!allowRegistration)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        allowRegistration ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          allowRegistration ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Allow New Business Listings</div>
                      <div className="text-[10px] text-slate-400">Allow new business submissions.</div>
                    </div>
                    <button
                      onClick={() => setAllowBusinessListings(!allowBusinessListings)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        allowBusinessListings ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          allowBusinessListings ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Auto Approve Listings</div>
                      <div className="text-[10px] text-slate-400">Automatically approve new listings.</div>
                    </div>
                    <button
                      onClick={() => setAutoApproveListings(!autoApproveListings)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        autoApproveListings ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          autoApproveListings ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Default Settings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Default Settings</h3>
                    <p className="text-[10px] text-slate-400">System preferences</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Default Language
                    </label>
                    <select
                      value={defaultLang}
                      onChange={(e) => setDefaultLang(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>English</option>
                      <option>বাংলা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Items Per Page
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>26 Sep 2026</option>
                      <option>2026-09-26</option>
                      <option>26/09/2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Time Format
                    </label>
                    <select
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                    >
                      <option>12 Hour (AM/PM)</option>
                      <option>24 Hour</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden cursor-pointer"
                  >
                    <option>(GMT +6:00) Dhaka</option>
                    <option>(GMT +0:00) UTC</option>
                  </select>
                </div>
              </div>

              {/* Save Settings Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
