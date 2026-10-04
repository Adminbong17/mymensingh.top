import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { Place, Business } from '../../types';

// Modals
import { PlaceFormModal } from './PlaceFormModal';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import { AdminEntityModal, type EntityModalType } from './AdminEntityModal';

// Layout components
import { AdminSidebar, type AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

// Tab Views
import { OverviewTab } from './tabs/OverviewTab';
import { EventsTab } from './tabs/EventsTab';
import { NewsTab } from './tabs/NewsTab';
import { ToLetTab } from './tabs/ToLetTab';
import { SettingsTab } from './tabs/SettingsTab';
import { UsersTab } from './tabs/UsersTab';
import { BusinessesTab } from './tabs/BusinessesTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { BloodBankTab } from './tabs/BloodBankTab';
import { TuitionTab } from './tabs/TuitionTab';
import { OffersTab } from './tabs/OffersTab';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const { user, logout } = useAuth();
  const {
    places,
    categories,
    news,
    events,
    offers,
    bloodDonors,
    tuitionListings,
    toLetListings,
    deletePlace,
    deleteNews,
    deleteEvent,
    deleteOffer,
    deleteBloodDonor,
    deleteTuition,
    deleteToLet
  } = useData();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const usersCount = (() => {
    try {
      const raw = localStorage.getItem('mymensingh_registered_users_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {}
    return 2;
  })();

  // Modals state
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState<Place | null>(null);
  const [entityModalType, setEntityModalType] = useState<EntityModalType>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Business CRUD helpers
  const handleAddBusiness = () => {
    setPlaceToEdit(null);
    setIsPlaceModalOpen(true);
  };

  const handleEditBusiness = (b: Business) => {
    setPlaceToEdit(b);
    setIsPlaceModalOpen(true);
  };

  const handleDeleteBusiness = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deletePlace(id);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      await deleteNews(id);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      await deleteOffer(id);
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this blood donor record?')) {
      await deleteBloodDonor(id);
    }
  };

  const handleDeleteTuition = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tuition listing?')) {
      await deleteTuition(id);
    }
  };

  const handleDeleteToLet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this to-let rental listing?')) {
      await deleteToLet(id);
    }
  };

  // Render the current active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewTab
            onSelectTab={setActiveTab}
            onOpenEntityModal={(type) => setEntityModalType(type)}
            onOpenBusinessModal={handleAddBusiness}
            onOpenUserModal={() => setActiveTab('users')}
            businessesCount={places.length}
            bloodDonorsCount={bloodDonors.length}
            tuitionCount={tuitionListings.length}
            toLetCount={toLetListings.length}
            newsCount={news.length}
            eventsCount={events.length}
            offersCount={offers.length}
          />
        );

      case 'events':
        return (
          <EventsTab
            events={events}
            onAddEvent={() => setEntityModalType('event')}
            onDeleteEvent={handleDeleteEvent}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'news':
        return (
          <NewsTab
            news={news}
            onAddNews={() => setEntityModalType('news')}
            onDeleteNews={handleDeleteNews}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'to-let':
        return (
          <ToLetTab
            toLets={toLetListings}
            onAddToLet={() => setEntityModalType('tolet')}
            onDeleteToLet={handleDeleteToLet}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'settings':
        return <SettingsTab />;

      case 'users':
        return <UsersTab />;

      case 'businesses':
        return (
          <BusinessesTab
            businesses={places}
            onAddBusiness={handleAddBusiness}
            onEditBusiness={handleEditBusiness}
            onDeleteBusiness={handleDeleteBusiness}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'categories':
        return (
          <CategoriesTab
            categories={categories}
            businessesCount={places.length}
          />
        );

      case 'blood-bank':
        return (
          <BloodBankTab
            donors={bloodDonors}
            onAddDonor={() => setEntityModalType('donor')}
            onDeleteDonor={handleDeleteDonor}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'tuition':
        return (
          <TuitionTab
            tuitions={tuitionListings}
            onAddTuition={() => setEntityModalType('tuition')}
            onDeleteTuition={handleDeleteTuition}
            onViewPublicPage={onBackToApp}
          />
        );

      case 'offers':
        return (
          <OffersTab
            offers={offers}
            onAddOffer={() => setEntityModalType('offer')}
            onDeleteOffer={handleDeleteOffer}
            onViewPublicPage={onBackToApp}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans antialiased">
      {/* Dark Green Sidebar matching screenshots */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onVisitWebsite={onBackToApp}
        onLogout={logout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        usersCount={usersCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <AdminHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onVisitWebsite={onBackToApp}
          onLogout={logout}
          onSelectTab={setActiveTab}
          userEmail={user?.email || 'admin@mymensingh.top'}
        />

        {/* Tab Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Place / Business Form Modal */}
      <PlaceFormModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        placeToEdit={placeToEdit}
      />

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Admin Entity Creation Modal (News, Event, Offer, Donor, Tuition, To-Let) */}
      <AdminEntityModal
        type={entityModalType}
        isOpen={!!entityModalType}
        onClose={() => setEntityModalType(null)}
      />
    </div>
  );
};
