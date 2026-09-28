import React, { useState } from 'react';
import {
  Compass,
  Heart,
  Globe2,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
  Train,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onOpenFavorites: () => void;
  onOpenAdminLogin: () => void;
  onSelectTab: (tab: 'places' | 'map' | 'emergency' | 'transport' | 'admin') => void;
  activeTab: 'places' | 'map' | 'emergency' | 'transport' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFavorites,
  onOpenAdminLogin,
  onSelectTab,
  activeTab,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin, logout } = useAuth();
  const { favorites, isCloudSynced } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div
            onClick={() => onSelectTab('places')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-800 bg-clip-text text-transparent">
                  {language === 'bn' ? 'ময়মনসিংহ' : 'Mymensingh'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Sparkles className="w-2.5 h-2.5" />
                  {language === 'bn' ? 'সিটি গাইড' : 'City Guide'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                {language === 'bn' ? 'ব্রহ্মপুত্র ভ্যালির ঐতিহ্য ও নির্দেশিকা' : 'Heart of Brahmaputra Valley'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('places')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'places'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              {language === 'bn' ? 'দর্শনীয় স্থান' : 'Places'}
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {language === 'bn' ? 'সিটি ম্যাপ' : 'City Map'}
            </button>

            <button
              onClick={() => onSelectTab('emergency')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'emergency'
                  ? 'bg-rose-50 text-rose-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-rose-500" />
              {language === 'bn' ? 'জরুরি সেবা' : 'Emergency'}
            </button>

            <button
              onClick={() => onSelectTab('transport')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'transport'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Train className="w-4 h-4 text-blue-500" />
              {language === 'bn' ? 'ট্রেন ও যাতায়াত' : 'Transit'}
            </button>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cloud Sync indicator */}
            <div
              title={isCloudSynced ? 'Connected to Supabase' : 'Offline / Local-first mode'}
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudSynced ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-[11px] font-semibold">{isCloudSynced ? 'Supabase' : 'Local'}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-xs"
              aria-label="Switch Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Favorites Drawer Toggle */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-200/80"
              aria-label="Favorites"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelectTab('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin'}</span>
                </button>
                <button
                  onClick={logout}
                  className="hidden sm:inline-block text-xs text-slate-500 hover:text-rose-600 px-2 py-1"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => { onSelectTab('places'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'places' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'দর্শনীয় স্থানসমূহ' : 'Places & Attractions'}
            </button>

            <button
              onClick={() => { onSelectTab('map'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'map' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              {language === 'bn' ? 'ইন্টারেক্টিভ সিটি ম্যাপ' : 'Interactive Map'}
            </button>

            <button
              onClick={() => { onSelectTab('emergency'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'emergency' ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              {language === 'bn' ? 'জরুরি সেবা ও হাসপাতাল' : 'Emergency Directory'}
            </button>

            <button
              onClick={() => { onSelectTab('transport'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'transport' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Train className="w-4 h-4 text-blue-600" />
              {language === 'bn' ? 'ট্রেন সময়সূচি ও পরিবহন' : 'Transit & Train Guide'}
            </button>

            {isAdmin && (
              <button
                onClick={() => { onSelectTab('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 bg-slate-900 text-white"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
