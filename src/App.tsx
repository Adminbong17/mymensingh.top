import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Layout & Core Components
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { SpecialServices } from './components/SpecialServices';
import { ExploreCategories } from './components/ExploreCategories';
import { ExploreByLocation } from './components/ExploreByLocation';
import { FeaturedBusinesses } from './components/FeaturedBusinesses';
import { LatestNewsSection } from './components/LatestNewsSection';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { LatestOffersSection } from './components/LatestOffersSection';
import { BusinessCTA } from './components/BusinessCTA';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { PrayerWidget } from './components/PrayerWidget';

// Dedicated Pages
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
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
import { PrayerTimesPage } from './pages/PrayerTimesPage';

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
  const { businesses, categories, mainCategories, news, events, offers } = useData();

  // Search redirection to dedicated /search results page
  const handleHeroSearch = (params: {
    keyword: string;
    district: string;
    upazila: string;
    unionWard: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.keyword?.trim()) queryParams.set('q', params.keyword.trim());
    if (params.district && params.district !== 'সকল জেলা') queryParams.set('district', params.district);
    if (params.upazila) queryParams.set('upazila', params.upazila);
    if (params.unionWard) queryParams.set('union', params.unionWard);

    navigate(`/search?${queryParams.toString()}`);
  };

  const handleQuickCategory = (categorySlug: string) => {
    if (categorySlug === 'blood-bank' || categorySlug === 'tuition-media' || categorySlug === 'to-let') {
      navigate(`/${categorySlug}`);
      return;
    }
    navigate(`/categories?category=${categorySlug}`);
  };

  const handleAreaSelect = (upazila: string, union?: string) => {
    const queryParams = new URLSearchParams();
    if (upazila) queryParams.set('upazila', upazila);
    if (union) queryParams.set('union', union);
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-0">
      {/* 2. Hero Section */}
      <HeroSection
        onSearch={handleHeroSearch}
        onQuickCategory={handleQuickCategory}
        onSelectBusiness={onSelectBusiness}
      />

      {/* 3. Special Services (3 Big Cards) */}
      <SpecialServices onSelectService={(service) => navigate(`/${service}`)} />

      {/* 4. Explore Categories (Auto-Scroll Slider) */}
      <ExploreCategories
        categories={mainCategories.length > 0 ? mainCategories : categories}
        selectedCategory=""
        onSelectCategory={(slug) => {
          if (slug === 'blood-bank' || slug === 'tuition-media' || slug === 'to-let') {
            navigate(`/${slug}`);
          } else if (slug === 'news') {
            navigate('/news');
          } else if (slug === 'mosques') {
            navigate('/prayer');
          } else if (slug === 'all') {
            navigate('/categories');
          } else {
            navigate(`/categories?category=${slug}`);
          }
        }}
        onSeeAll={() => navigate('/categories')}
      />

      {/* 4.5 Prayer Times & Islamic Bulletin Section (Compact Strip) */}
      <section className="py-4 sm:py-6 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <PrayerWidget />
        </div>
      </section>

      {/* 5. Latest News Section (Slider) */}
      <LatestNewsSection news={news} />

      {/* 6. Featured Businesses (Slider) */}
      <FeaturedBusinesses
        businesses={businesses}
        onSelectBusiness={onSelectBusiness}
      />

      {/* 7. Explore by Location (District, Upazila, Union selector) */}
      <ExploreByLocation onSelectArea={handleAreaSelect} />

      {/* 8. Upcoming Events (Slider) */}
      <UpcomingEventsSection events={events} />

      {/* 9. Latest Offers (Slider) */}
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
  const location = useLocation();

  // Modals state
  const [isListBusinessOpen, setIsListBusinessOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Dedicated Full-Screen Layout for Admin Dashboard (No public navbar/footer or max-w-7xl restriction)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-x-hidden">
        <ScrollToTop />
        <AdminDashboard onBackToApp={() => navigate('/')} />
      </div>
    );
  }

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
          <Route path="/search" element={<SearchResultsPage />} />
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
          <Route path="/prayer" element={<PrayerTimesPage />} />
          <Route path="/prayer-times" element={<PrayerTimesPage />} />
          <Route path="/namaz" element={<PrayerTimesPage />} />
          <Route path="/namaz-roza" element={<PrayerTimesPage />} />
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
