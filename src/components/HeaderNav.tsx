import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Search,
  PlusCircle,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  Droplet,
  GraduationCap,
  Home,
  BookOpen,
  Info,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderNavProps {
  onOpenListBusiness?: () => void;
  onOpenAdminLogin?: () => void;
  onNavigate?: (pathOrId: string) => void;
  activeSection?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenListBusiness,
  onOpenAdminLogin,
  onNavigate,
  activeSection = 'home',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Close dropdowns on route changes
  useEffect(() => {
    setServicesOpen(false);
    setMoreOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLinkClick = (path: string, id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    navigate(path);
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setMoreOpen(false);
  };

  const isLinkActive = (path: string, id: string) => {
    if (path === '/') {
      return location.pathname === '/' && activeSection === 'home';
    }
    return location.pathname.startsWith(path) || activeSection === id;
  };

  const isServiceActive =
    ['/blood-bank', '/tuition-media', '/to-let'].some((p) =>
      location.pathname.startsWith(p)
    ) || ['blood-bank', 'tuition-media', 'to-let'].includes(activeSection);

  const isMoreActive =
    ['/blog', '/about'].some((p) => location.pathname.startsWith(p)) ||
    ['blog', 'about'].includes(activeSection);

  // Nav list for mobile drawer
  const mobileNavLinks = [
    { id: 'home', path: '/', label: 'Home (হোম)' },
    { id: 'categories', path: '/categories', label: 'Categories (ক্যাটাগরি)' },
    { id: 'prayer', path: '/prayer', label: 'Prayer Times (নামাজ ও রোজা)' },
    { id: 'blood-bank', path: '/blood-bank', label: 'Blood Bank (রক্তদান)' },
    { id: 'tuition-media', path: '/tuition-media', label: 'Tuition (টিউশন)' },
    { id: 'to-let', path: '/to-let', label: 'To-Let (বাসা ভাড়া)' },
    { id: 'news', path: '/news', label: 'News (সংবাদ)' },
    { id: 'events', path: '/events', label: 'Events (ইভেন্ট)' },
    { id: 'offers', path: '/offers', label: 'Offers (অফার)' },
    { id: 'blog', path: '/blog', label: 'Blog (ব্লগ)' },
    { id: 'about', path: '/about', label: 'About (আমাদের সম্পর্কে)' },
  ];

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      navigate('/categories');
    } else {
      const el = document.getElementById('search-results-section') || document.getElementById('home');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
        
        {/* ================================================================= */}
        {/* ROW 1: BRAND LOGO & PRIMARY ACTIONS (Never clips at any zoom!)   */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
          
          {/* 1. Mymensingh.top Logo */}
          <div
            onClick={() => handleLinkClick('/', 'home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  Mymensingh<span className="text-emerald-600">.top</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10px] sm:text-[11px] font-semibold text-slate-400 -mt-0.5 tracking-wider uppercase whitespace-nowrap">
                City Guide & Business Portal
              </span>
            </div>
          </div>

          {/* 2. Middle Search Bar (Visible on md+ screens, fully flexible) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-2 lg:mx-4">
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-slate-400 hover:text-slate-600 transition-all text-xs group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-500 font-medium truncate">ময়মনসিংহের হাসপাতাল, রেস্টুরেন্ট বা সেবা খুঁজুন...</span>
              </div>
              <span className="hidden lg:inline-flex text-[10px] font-bold bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded-md font-mono shrink-0 ml-2">
                অনুসন্ধান
              </span>
            </button>
          </div>

          {/* 3. Right Action Utilities (Never overflows or touches screen edge) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Mobile Search Icon Trigger (md:hidden) */}
            <button
              onClick={handleSearchClick}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-all border border-slate-200/80 shadow-2xs shrink-0 cursor-pointer"
              title="অনুসন্ধান করুন"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop / Tablet Login / Admin Button */}
            <div className="hidden sm:flex items-center shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  {isAdmin ? (
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs transition-all shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Admin</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="max-w-[90px] truncate">{user.full_name || user.email?.split('@')[0]}</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-rose-100"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (onOpenAdminLogin) onOpenAdminLogin();
                    else navigate('/auth');
                  }}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all flex items-center gap-1.5 border border-slate-200 shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>লগইন</span>
                </button>
              )}
            </div>

            {/* + List Your Business Primary CTA Button */}
            <button
              onClick={() => {
                if (onOpenListBusiness) onOpenListBusiness();
                else navigate('/list-business');
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">+ ব্যবসা যুক্ত করুন</span>
              <span className="sm:hidden">+ যোগ করুন</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer border border-slate-200/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 2: DESKTOP NAVIGATION STRIP (Adjustable & Zoom-Proof!)       */}
        {/* ================================================================= */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-100/90 py-1.5 -mx-1">
          
          {/* Navigation Links in a flexible, scrollable safe strip */}
          <nav className="flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-nowrap">
            {/* Home */}
            <button
              onClick={() => handleLinkClick('/', 'home')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/', 'home')
                  ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </button>

            {/* Categories */}
            <button
              onClick={() => handleLinkClick('/categories', 'categories')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/categories', 'categories')
                  ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Categories
            </button>

            {/* Services Dropdown (Blood Bank, Tuition Media, To-Let) */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer ${
                  isServiceActive
                    ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                  <button
                    onClick={() => handleLinkClick('/blood-bank', 'blood-bank')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      location.pathname.startsWith('/blood-bank')
                        ? 'bg-rose-50 text-rose-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600 shrink-0">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Blood Bank</div>
                      <div className="text-[10px] text-slate-400 font-normal">রক্তদাতা ডিরেক্টরি</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('/tuition-media', 'tuition-media')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      location.pathname.startsWith('/tuition-media')
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Tuition Media</div>
                      <div className="text-[10px] text-slate-400 font-normal">শিক্ষক ও শিক্ষার্থী</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('/to-let', 'to-let')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      location.pathname.startsWith('/to-let')
                        ? 'bg-amber-50 text-amber-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-600 shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">To-Let</div>
                      <div className="text-[10px] text-slate-400 font-normal">বাসা ও মেস ভাড়া</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* News */}
            <button
              onClick={() => handleLinkClick('/news', 'news')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/news', 'news')
                  ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              News
            </button>

            {/* Events */}
            <button
              onClick={() => handleLinkClick('/events', 'events')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/events', 'events')
                  ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Events
            </button>

            {/* Offers */}
            <button
              onClick={() => handleLinkClick('/offers', 'offers')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/offers', 'offers')
                  ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Offers
            </button>

            {/* Prayer Times (নামাজ ও রোজা) */}
            <button
              onClick={() => handleLinkClick('/prayer', 'prayer')}
              className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                isLinkActive('/prayer', 'prayer')
                  ? 'text-rose-700 bg-rose-50 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>নামাজ</span>
            </button>

            {/* More Dropdown (Blog, About) */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer ${
                  isMoreActive
                    ? 'text-emerald-700 bg-emerald-50 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                  <button
                    onClick={() => handleLinkClick('/blog', 'blog')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      location.pathname.startsWith('/blog')
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100/80 flex items-center justify-center text-sky-600 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Blog</div>
                      <div className="text-[10px] text-slate-400 font-normal">আর্টিকেল ও গাইড</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleLinkClick('/about', 'about')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      location.pathname.startsWith('/about')
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">About Us</div>
                      <div className="text-[10px] text-slate-400 font-normal">আমাদের পরিচিতি</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right badge on Nav Row */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 pl-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/70 whitespace-nowrap select-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ময়মনসিংহ বিভাগীয় সিটি পোর্টাল</span>
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MOBILE DROPDOWN MENU DRAWER                                      */}
        {/* ================================================================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-2.5 animate-in slide-in-from-top duration-200">
            
            {/* Mobile Auth / Admin section */}
            <div className="pb-1">
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="truncate">{user.full_name || user.email}</span>
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Login / Register (লগইন বা একাউন্ট)</span>
                </button>
              )}
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {mobileNavLinks.map((link) => {
                const active = isLinkActive(link.path, link.id);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.path, link.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <Sparkles className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
            
            {/* Prominent + List Business Button in Mobile Menu */}
            <div className="pt-2">
              <button
                onClick={() => { navigate('/list-business'); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List Your Business (ব্যবসা যোগ করুন)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
