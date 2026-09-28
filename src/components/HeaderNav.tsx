import React, { useState } from 'react';
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
  LogOut
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

  const navLinks = [
    { id: 'home', path: '/', label: 'Home' },
    { id: 'categories', path: '/categories', label: 'Categories' },
    { id: 'news', path: '/news', label: 'News' },
    { id: 'events', path: '/events', label: 'Events' },
    { id: 'offers', path: '/offers', label: 'Offers' },
    { id: 'blog', path: '/blog', label: 'Blog' },
    { id: 'about', path: '/about', label: 'About' },
  ];

  const handleLinkClick = (path: string, id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string, id: string) => {
    if (path === '/') {
      return location.pathname === '/' && activeSection === 'home';
    }
    return location.pathname.startsWith(path) || activeSection === id;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* 1. Mymensingh.top Logo */}
          <div
            onClick={() => handleLinkClick('/', 'home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Mymensingh<span className="text-emerald-600">.top</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10px] sm:text-[11px] font-semibold text-slate-400 -mt-0.5 tracking-wider uppercase">
                City Guide & Business Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path, link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.path, link.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-emerald-700 bg-emerald-50/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Search Icon Trigger */}
            <button
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/categories');
                } else {
                  const el = document.getElementById('home');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-all border border-slate-200/80 shadow-2xs"
              title="Search Mymensingh"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop / Tablet Login / Admin Button */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <div className="flex items-center gap-1.5">
                  {isAdmin ? (
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-xs hover:bg-slate-800"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 flex items-center gap-1.5 border border-slate-200 hover:bg-slate-200"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="max-w-[110px] truncate">{user.full_name || user.email?.split('@')[0]}</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 border border-slate-200"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>

            {/* + List Your Business Button */}
            <button
              onClick={() => {
                if (onOpenListBusiness) onOpenListBusiness();
                else navigate('/list-business');
              }}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">+ List Your Business</span>
              <span className="sm:hidden">+ List</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-2 animate-in slide-in-from-top duration-200">
            
            {/* Mobile Auth / Admin section */}
            <div className="pb-2">
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="truncate">{user.full_name || user.email}</span>
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Login / Register (লগইন বা একাউন্ট)</span>
                </button>
              )}
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path, link.id);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.path, link.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25"
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
