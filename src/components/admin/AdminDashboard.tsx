import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Database,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  Search
} from 'lucide-react';
import type { Place } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PlaceFormModal } from './PlaceFormModal';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import { AdminActionSlider } from './AdminActionSlider';
import { AdminEntityModal, type EntityModalType } from './AdminEntityModal';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const { language, t } = useLanguage();
  const { user, isDemoAdmin, logout } = useAuth();
  const {
    places,
    reviews,
    categories,
    deletePlace,
    updateReviewStatus,
    deleteReview,
    resetToInitialData,
    seedDatabaseFromInitial,
    refreshData,
    isCloudSynced,
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<'places' | 'reviews'>('places');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState<Place | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seedNotice, setSeedNotice] = useState('');
  const [entityModalType, setEntityModalType] = useState<EntityModalType>(null);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
    setSeedNotice('সরাসরি Supabase ডেটাবেজ থেকে সকল ডেটা সফলভাবে সিঙ্ক হয়েছে!');
    setTimeout(() => setSeedNotice(''), 4000);
  };

  const handleSeedData = async () => {
    if (window.confirm('আপনি কি প্রাথমিক নমুনা ডেটা (ব্যবসায়িক প্রতিষ্ঠান, সংবাদ, ইভেন্ট ও অফার) Supabase ডেটাবেজে সেভ করতে চান?')) {
      setIsSeeding(true);
      const res = await seedDatabaseFromInitial();
      setIsSeeding(false);
      setSeedNotice(res.message);
      setTimeout(() => setSeedNotice(''), 5000);
    }
  };

  const filteredPlaces = places.filter((p) => {
    const q = searchTerm.toLowerCase();
    const name = p.name || p.name_en || '';
    const nameBn = p.name_bn || '';
    const area = p.area || p.location || '';
    return (
      name.toLowerCase().includes(q) ||
      nameBn.toLowerCase().includes(q) ||
      area.toLowerCase().includes(q)
    );
  });

  const handleEditPlace = (place: Place) => {
    setPlaceToEdit(place);
    setIsPlaceModalOpen(true);
  };

  const handleAddPlace = () => {
    setPlaceToEdit(null);
    setIsPlaceModalOpen(true);
  };

  const handleDeletePlace = (id: string, name: string) => {
    if (window.confirm(`${t('confirm_delete')}\n\n"${name}"`)) {
      deletePlace(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Top Navigation & Welcome */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToApp}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সিটি গাইডে ফিরে যান' : 'Back to City Guide'}</span>
              </button>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user?.email === 'admin@bongbangla.top' ? '👑 Super Admin' : (isDemoAdmin ? 'Demo Admin' : 'Authorized Admin')}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'bn' ? 'ময়মনসিংহ সিটি গাইড অ্যাডমিন কনসোল' : 'Mymensingh City Guide Admin Console'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {user?.email} • {isCloudSynced ? 'Synced with Supabase Cloud' : 'Local Storage Mode'}
            </p>

            {seedNotice && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold animate-in fade-in">
                {seedNotice}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Seed Initial Starter Records directly to Supabase"
            >
              <RotateCcw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'সিড হচ্ছে...' : 'Supabase এ ডাটা সিড'}</span>
            </button>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all shadow-xs"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{t('supabase_settings')}</span>
            </button>

            <button
              onClick={handleAddPlace}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('add_place')}</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{places.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Places</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {places.filter((p) => p.is_featured).length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Featured Landmarks</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-teal-400">{reviews.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Reviews</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-xl sm:text-2xl font-black text-indigo-400">{categories.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Categories</div>
          </div>
        </div>
      </div>

      {/* Dynamic Action Toggle Slider */}
      <AdminActionSlider
        onOpenPlaceModal={handleAddPlace}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onSeedData={handleSeedData}
        onRefreshData={handleRefreshData}
        onOpenEntityModal={(type) => setEntityModalType(type)}
        isSeeding={isSeeding}
        isRefreshing={isRefreshing}
      />

      {/* Admin Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('places')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeAdminTab === 'places'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'সকল স্থান ব্যবস্থাপনা' : 'Places Directory'} ({places.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'reviews'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>{t('moderation')}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
              {reviews.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all data back to original Mymensingh seed dataset?')) {
              resetToInitialData();
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100"
          title="Reset Seed Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Seed Data</span>
        </button>
      </div>

      {/* PLACES TAB */}
      {activeAdminTab === 'places' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          
          {/* Search Table */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search places by name or area..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleAddPlace}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('add_place')}</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Place</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Area</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.image_url}
                          alt={place.name_en}
                          className="w-12 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {place.name_en}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {place.name_bn}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {place.category_slug}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700">
                      {place.area}
                    </td>

                    <td className="py-3 px-3 font-bold text-emerald-700">
                      ★ {place.rating} ({place.review_count})
                    </td>

                    <td className="py-3 px-3">
                      {place.is_featured ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditPlace(place)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place.id, place.name_en || place.name || 'Unnamed')}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS MODERATION TAB */}
      {activeAdminTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'ব্যবহারকারীদের রিভিউ ও মতামত নিয়ন্ত্রণ' : 'User Reviews & Feedback Moderation'}
              </h3>
              <p className="text-xs text-slate-500">
                Approve, reject, or delete visitor reviews
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => {
              const place = places.find((p) => p.id === rev.place_id);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.user_name}</span>
                      <span className="text-[10px] text-slate-400">for</span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {place?.name_en || 'Unknown Place'}
                      </span>
                      <div className="flex items-center text-amber-400 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">
                      Status: <strong className="uppercase">{rev.status}</strong> •{' '}
                      {new Date(rev.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('approve')}</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('reject')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Place Edit / Create Modal */}
      <PlaceFormModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        placeToEdit={placeToEdit}
      />

      {/* Supabase Config & Migration Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Admin Quick Entity Creation Modal (News, Event, Offer, Donor, Tuition, To-Let) */}
      <AdminEntityModal
        type={entityModalType}
        isOpen={!!entityModalType}
        onClose={() => setEntityModalType(null)}
      />

    </div>
  );
};
