import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  onOpenListBusiness?: () => void;
  onSelectCategory?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenListBusiness,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const handleLink = (path: string, id: string) => {
    if (onNavigate) onNavigate(id);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) onSelectCategory(slug);
    navigate(`/categories?category=${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 5-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Socials (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => handleLink('/', 'home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                Mymensingh<span className="text-emerald-500">.top</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              ময়মনসিংহের সবচেয়ে বিশ্বস্ত ও আধুনিক অনলাইন সিটি গাইড ও বিজনেস ডিরেক্টরি। আপনার প্রয়োজনীয় সকল সেবা, ডাক্তার, রেস্তোরাঁ ও জরুরি তথ্য এক ঠিকানায়।
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href="https://m.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800"
                title="Messenger"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('/', 'home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home (হোম)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/about', 'about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us (আমাদের সম্পর্কে)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/news', 'news')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  News (সংবাদ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/events', 'events')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Events (ইভেন্ট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/offers', 'offers')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Offers (অফার)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/blog', 'blog')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Blog (ব্লগ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenListBusiness) onOpenListBusiness();
                    else handleLink('/list-business', 'list-business');
                  }}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  + List Your Business
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('restaurants')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Restaurants (রেস্টুরেন্ট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('hospitals')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Hospitals (হাসপাতাল)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('pharmacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Pharmacy (ফার্মেসি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('blood-bank')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Blood Bank (ব্লাড ব্যাংক)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('tuition-media')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tuition Media (টিউশন)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('to-let')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  To Let (বাসা ভাড়া)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>টাউন হল মোড়, ময়মনসিংহ সদর, ময়মনসিংহ</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="mailto:support@mymensingh.top"
                  className="hover:text-emerald-400 transition-colors"
                >
                  support@mymensingh.top
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="tel:+8801711000000"
                  className="hover:text-emerald-400 transition-colors"
                >
                  +880 1711-000000
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Mymensingh.top. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLink('/about', 'about')}
              className="hover:text-slate-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleLink('/auth', 'auth')}
              className="hover:text-slate-400 transition-colors"
            >
              Login / Admin
            </button>
            <a href="mailto:support@mymensingh.top" className="hover:text-slate-400 transition-colors">
              Support
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
