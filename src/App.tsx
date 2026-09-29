import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Layout Components
import { HeaderNav } from './components/HeaderNav';
import { Footer } from './components/Footer';

// Homepage Sections
import { HeroSection } from './components/HeroSection';
import { SpecialServices } from './components/SpecialServices';
import { ExploreCategories } from './components/ExploreCategories';
import { LatestNewsSection } from './components/LatestNewsSection';
import { FeaturedBusinesses } from './components/FeaturedBusinesses';
import { ExploreByLocation } from './components/ExploreByLocation';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { LatestOffersSection } from './components/LatestOffersSection';
import { BusinessCTA } from './components/BusinessCTA';
import { NewsletterSection } from './components/NewsletterSection';

// Dedicated Pages
import { CategoriesPage } from './pages/CategoriesPage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { OffersPage } from './pages/OffersPage';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { ListBusinessPage } from './pages/ListBusinessPage';
import { BloodBankPage } from './pages/BloodBankPage';
import { TuitionMediaPage } from './pages/TuitionMediaPage';
import { ToLetPage } from './pages/ToLetPage';

// Modals & Admin
import { ListBusinessModal } from './components/ListBusinessModal';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Contexts
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import type { Business } from './types';
import { SearchX, Filter } from 'lucide-react';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ============================================================================
// Main Homepage Component
// ============================================================================
const HomePage: React.FC<{
  onOpenListBusiness: () => void;
  onSelectBusiness: (biz: Business) => void;
}> = ({ onOpenListBusiness, onSelectBusiness }) => {
  const navigate = useNavigate();
  const { businesses, categories, news, events, offers } = useData();

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState<{
    keyword: string;
    district: string;
    upazila: string;
    unionWard: string;
  }>({
    keyword: '',
    district: 'ময়মনসিংহ',
    upazila: '',
    unionWard: '',
  });

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');

  // Filtered Businesses Logic
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      if (selectedCategorySlug && biz.category_slug !== selectedCategorySlug) {
        return false;
      }
      if (searchFilter.keyword.trim()) {
        const q = searchFilter.keyword.toLowerCase().trim();
        const matchName = biz.name.toLowerCase().includes(q) || (biz.name_bn && biz.name_bn.toLowerCase().includes(q));
        const matchCategory = biz.category.toLowerCase().includes(q);
        const matchDesc = biz.description && biz.description.toLowerCase().includes(q);
        const matchLocation = biz.location.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchDesc && !matchLocation) {
          return false;
        }
      }
      if (searchFilter.upazila && biz.upazila !== searchFilter.upazila && !biz.location.includes(searchFilter.upazila)) {
        return false;
      }
      if (searchFilter.unionWard && biz.union_ward && !biz.union_ward.includes(searchFilter.unionWard)) {
        return false;
      }
      return true;
    });
  }, [businesses, selectedCategorySlug, searchFilter]);

  const isFilterActive = Boolean(
    selectedCategorySlug || searchFilter.keyword || searchFilter.upazila || searchFilter.unionWard
  );

  const handleHeroSearch = (params: { keyword: string; district: string; upazila: string; unionWard: string }) => {
    setSearchFilter(params);
    const resultsEl = document.getElementById('search-results-section');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickCategory = (categorySlug: string) => {
    if (categorySlug === 'blood-bank' || categorySlug === 'tuition-media' || categorySlug === 'to-let') {
      navigate(`/${categorySlug}`);
      return;
    }
    navigate(`/categories?category=${categorySlug}`);
  };

  const handleAreaSelect = (upazila: string, union?: string) => {
    setSearchFilter((prev) => ({
      ...prev,
      upazila,
      unionWard: union || '',
    }));
    const resultsEl = document.getElementById('search-results-section');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0">
      {/* 2. Hero Section */}
      <HeroSection
        onSearch={handleHeroSearch}
        onQuickCategory={handleQuickCategory}
      />

      {/* Filter / Search Results Section (Appears if user searched on homepage) */}
      {isFilterActive && (
        <div id="search-results-section" className="py-10 bg-emerald-50/40 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  অনুসন্ধানের ফলাফল ({filteredBusinesses.length}টি লিস্টিং পাওয়া গেছে)
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedCategorySlug('');
                  setSearchFilter({ keyword: '', district: 'ময়মনসিংহ', upazila: '', unionWard: '' });
                }}
                className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors self-start sm:self-auto"
              >
                ফিল্টার রিসেট করুন (Clear)
              </button>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-200">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">কোনো ফলাফল পাওয়া যায়নি।</p>
                <p className="text-xs text-slate-500 mt-1">অন্য কোনো কি-ওয়ার্ড অথবা অন্য উপজেলা দিয়ে অনুসন্ধান করুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((biz) => (
                  <div
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all cursor-pointer p-4 space-y-3"
                  >
                    <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {biz.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{biz.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{biz.location}</p>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-600">★ {biz.rating} ({biz.review_count})</span>
                      <span className="font-semibold text-slate-700 underline">বিস্তারিত দেখুন</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Special Services (3 Big Cards) */}
      <SpecialServices onSelectService={(service) => navigate(`/${service}`)} />

      {/* 4. Explore Categories (20 categories) */}
      <ExploreCategories
        categories={categories}
        selectedCategory={selectedCategorySlug}
        onSelectCategory={(slug) => navigate(`/categories?category=${slug}`)}
      />

      {/* 5. Latest News Section (5 news cards) */}
      <LatestNewsSection news={news} />

      {/* 6. Featured Businesses (6 verified business cards) */}
      <FeaturedBusinesses
        businesses={businesses}
        onSelectBusiness={onSelectBusiness}
      />

      {/* 7. Explore by Location (District, Upazila, Union selector) */}
      <ExploreByLocation onSelectArea={handleAreaSelect} />

      {/* 8. Upcoming Events (3 event cards) */}
      <UpcomingEventsSection events={events} />

      {/* 9. Latest Offers (3 discount cards) */}
      <LatestOffersSection offers={offers} />

      {/* 10. Business CTA */}
      <BusinessCTA onOpenListBusiness={onOpenListBusiness} />

      {/* 11. Newsletter Bulletin Section */}
      <NewsletterSection />
    </div>
  );
};

// ============================================================================
// Main Application with Router
// ============================================================================
const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isListBusinessOpen, setIsListBusinessOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <ScrollToTop />

      {/* Sticky Header */}
      <HeaderNav
        onOpenListBusiness={() => navigate('/list-business')}
        onOpenAdminLogin={() => navigate('/auth')}
      />

      {/* Main Page Routing */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenListBusiness={() => navigate('/list-business')}
                onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              />
            }
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<AuthPage />} />
          <Route path="/list-business" element={<ListBusinessPage />} />
          <Route path="/blood-bank" element={<BloodBankPage />} />
          <Route path="/tuition-media" element={<TuitionMediaPage />} />
          <Route path="/to-let" element={<ToLetPage />} />
          <Route
            path="/admin"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminDashboard onBackToApp={() => navigate('/')} />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <HomePage
                onOpenListBusiness={() => navigate('/list-business')}
                onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer
        onOpenListBusiness={() => navigate('/list-business')}
        onSelectCategory={(slug) => navigate(`/categories?category=${slug}`)}
      />

      {/* Modals */}
      <ListBusinessModal
        isOpen={isListBusinessOpen}
        onClose={() => setIsListBusinessOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          navigate('/admin');
        }}
      />

      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
