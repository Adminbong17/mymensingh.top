import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Business,
  Category,
  EmergencyContact,
  TrainSchedule,
  Review,
  NewsArticle,
  EventItem,
  OfferItem,
  BloodDonor,
  TuitionListing,
  ToLetListing
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_BUSINESSES,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_OFFERS,
  INITIAL_BLOOD_DONORS,
  INITIAL_TUITION_LISTINGS,
  INITIAL_TO_LET_LISTINGS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_TRAIN_SCHEDULES,
  INITIAL_REVIEWS,
} from '../data/initialData';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  isCpanelConfigured,
  cpanelFetchAll,
  cpanelAddBusiness,
  cpanelUpdateBusiness,
  cpanelDeleteBusiness,
  cpanelAddNews,
  cpanelDeleteNews,
  cpanelAddEvent,
  cpanelDeleteEvent,
  cpanelAddOffer,
  cpanelDeleteOffer,
  cpanelAddDonor,
  cpanelDeleteDonor,
  cpanelAddTuition,
  cpanelDeleteTuition,
  cpanelAddToLet,
  cpanelDeleteToLet,
  cpanelSubmitReview,
  cpanelUpdateReview,
  cpanelDeleteReview
} from '../lib/cpanelApi';

interface DataContextType {
  businesses: Business[];
  places: Business[]; // Alias for backward compatibility
  categories: Category[];
  news: NewsArticle[];
  events: EventItem[];
  offers: OfferItem[];
  bloodDonors: BloodDonor[];
  tuitionListings: TuitionListing[];
  toLetListings: ToLetListing[];
  emergencyContacts: EmergencyContact[];
  trainSchedules: TrainSchedule[];
  reviews: Review[];
  favorites: string[];
  isLoading: boolean;
  isCloudSynced: boolean;
  addBusiness: (business: Omit<Business, 'id'>) => Promise<boolean>;
  addPlace: (place: Omit<Business, 'id'>) => Promise<boolean>;
  updatePlace: (id: string, place: Partial<Business>) => Promise<boolean>;
  deletePlace: (id: string) => Promise<boolean>;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  submitReview: (review: { place_id: string; user_name: string; rating: number; comment: string }) => Promise<boolean>;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  addNews: (article: Omit<NewsArticle, 'id'>) => Promise<boolean>;
  deleteNews: (id: string) => Promise<boolean>;
  addEvent: (item: Omit<EventItem, 'id'>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  addOffer: (item: Omit<OfferItem, 'id'>) => Promise<boolean>;
  deleteOffer: (id: string) => Promise<boolean>;
  addBloodDonor: (donor: Omit<BloodDonor, 'id'>) => Promise<boolean>;
  deleteBloodDonor: (id: string) => Promise<boolean>;
  addTuition: (tuition: Omit<TuitionListing, 'id'>) => Promise<boolean>;
  deleteTuition: (id: string) => Promise<boolean>;
  addToLet: (toLet: Omit<ToLetListing, 'id'>) => Promise<boolean>;
  deleteToLet: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  resetToInitialData: () => void;
  seedDatabaseFromInitial: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_FAVORITES = 'mymensingh_favorites_top_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real data arrays initialized to empty (no mock data fallback)
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [tuitionListings, setTuitionListings] = useState<TuitionListing[]>([]);
  const [toLetListings, setToLetListings] = useState<ToLetListing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Emergency contacts and train schedules (standard public municipal utility data)
  const [emergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [trainSchedules] = useState<TrainSchedule[]>(INITIAL_TRAIN_SCHEDULES);

  // User client-side favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Clean up legacy mock data storage
  useEffect(() => {
    localStorage.removeItem('mymensingh_businesses_top_v1');
    localStorage.removeItem('mymensingh_reviews_top_v1');
  }, []);

  // Real Data Fetch (Supports cPanel MySQL or Supabase)
  const refreshData = useCallback(async () => {
    // 1. Check if cPanel MySQL API is configured
    if (isCpanelConfigured()) {
      try {
        setIsLoading(true);
        const res = await cpanelFetchAll();
        if (res && res.success) {
          if (Array.isArray(res.businesses)) setBusinesses(res.businesses);
          if (Array.isArray(res.categories) && res.categories.length > 0) setCategories(res.categories);
          if (Array.isArray(res.news)) setNews(res.news);
          if (Array.isArray(res.events)) setEvents(res.events);
          if (Array.isArray(res.offers)) setOffers(res.offers);
          if (Array.isArray(res.blood_donors)) setBloodDonors(res.blood_donors);
          if (Array.isArray(res.tuition_listings)) setTuitionListings(res.tuition_listings);
          if (Array.isArray(res.to_let_listings)) setToLetListings(res.to_let_listings);
          if (Array.isArray(res.reviews)) setReviews(res.reviews);
          setIsCloudSynced(true);
          return;
        }
      } catch (err) {
        console.warn('cPanel API fetch exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    // 2. Fallback to Supabase Cloud
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      setIsLoading(false);
      setIsCloudSynced(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Fetch real businesses from Supabase
      const { data: dbBusinesses, error: bizErr } = await supabase
        .from('businesses')
        .select('*')
        .order('is_featured', { ascending: false });

      if (!bizErr && dbBusinesses !== null) {
        setBusinesses(dbBusinesses as Business[]);
        setIsCloudSynced(true);
      } else {
        // Fallback check to places table if businesses table not present
        const fallback = await supabase
          .from('places')
          .select('*')
          .order('is_featured', { ascending: false });
        if (!fallback.error && fallback.data !== null) {
          setBusinesses(fallback.data as Business[]);
          setIsCloudSynced(true);
        } else {
          setBusinesses([]);
          setIsCloudSynced(false);
        }
      }

      // 2. Fetch real categories from Supabase
      try {
        const { data: dbCat, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('order_index');
        if (!catErr && dbCat && dbCat.length > 0) {
          setCategories(dbCat as Category[]);
        }
      } catch (err) {
        console.warn('Could not fetch categories from Supabase:', err);
      }

      // 3. Fetch real news from Supabase
      try {
        const { data: dbNews, error: newsErr } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (!newsErr && dbNews !== null) {
          setNews(dbNews as NewsArticle[]);
        } else {
          setNews([]);
        }
      } catch {
        setNews([]);
      }

      // 4. Fetch real events from Supabase
      try {
        const { data: dbEvents, error: evErr } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        if (!evErr && dbEvents !== null) {
          setEvents(dbEvents as EventItem[]);
        } else {
          setEvents([]);
        }
      } catch {
        setEvents([]);
      }

      // 5. Fetch real offers from Supabase
      try {
        const { data: dbOffers, error: offErr } = await supabase
          .from('offers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!offErr && dbOffers !== null) {
          setOffers(dbOffers as OfferItem[]);
        } else {
          setOffers([]);
        }
      } catch {
        setOffers([]);
      }

      // 6. Fetch real blood donors from Supabase
      try {
        const { data: dbDonors, error: donErr } = await supabase
          .from('blood_donors')
          .select('*')
          .order('created_at', { ascending: false });
        if (!donErr && dbDonors !== null) {
          setBloodDonors(dbDonors as BloodDonor[]);
        } else {
          setBloodDonors([]);
        }
      } catch {
        setBloodDonors([]);
      }

      // 7. Fetch real tuition listings from Supabase
      try {
        const { data: dbTuition, error: tuiErr } = await supabase
          .from('tuition_listings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!tuiErr && dbTuition !== null) {
          setTuitionListings(dbTuition as TuitionListing[]);
        } else {
          setTuitionListings([]);
        }
      } catch {
        setTuitionListings([]);
      }

      // 8. Fetch real to-let listings from Supabase
      try {
        const { data: dbToLet, error: toLetErr } = await supabase
          .from('to_let_listings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!toLetErr && dbToLet !== null) {
          setToLetListings(dbToLet as ToLetListing[]);
        } else {
          setToLetListings([]);
        }
      } catch {
        setToLetListings([]);
      }

      // 9. Fetch real reviews from Supabase
      try {
        const { data: dbReviews, error: revErr } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!revErr && dbReviews !== null) {
          setReviews(dbReviews as Review[]);
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    } catch (e) {
      console.warn('Supabase fetch exception:', e);
      setIsCloudSynced(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Favorites
  const toggleFavorite = (placeId: string) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const isFavorite = (placeId: string) => favorites.includes(placeId);

  // Business / Place CRUD
  const addBusiness = async (newBizData: Omit<Business, 'id'>): Promise<boolean> => {
    const newId = `biz-${Date.now()}`;
    const newBusiness: Business = {
      ...newBizData,
      id: newId,
      name: newBizData.name || newBizData.name_en || newBizData.name_bn || 'Unnamed Place',
      category: newBizData.category || 'Services',
      category_slug: newBizData.category_slug || 'services',
      location: newBizData.location || 'ময়মনসিংহ',
      image_url: newBizData.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      phone: newBizData.phone || '+880 1700-000000',
      rating: newBizData.rating || 5.0,
      review_count: newBizData.review_count || 0,
    };

    setBusinesses(prev => [newBusiness, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddBusiness(newBusiness);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const res = await supabase.from('businesses').insert([newBusiness]);
        if (res.error) {
          await supabase.from('places').insert([newBusiness]);
        }
      } catch (err) {
        console.warn('Supabase business insert exception:', err);
      }
    }
    return true;
  };

  const addPlace = addBusiness;

  const updatePlace = async (id: string, updatedFields: Partial<Business>): Promise<boolean> => {
    setBusinesses(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    if (isCpanelConfigured()) {
      await cpanelUpdateBusiness(id, updatedFields);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const res = await supabase.from('businesses').update(updatedFields).eq('id', id);
        if (res.error) {
          await supabase.from('places').update(updatedFields).eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase update exception:', err);
      }
    }
    return true;
  };

  const deletePlace = async (id: string): Promise<boolean> => {
    setBusinesses(prev => prev.filter(p => p.id !== id));

    if (isCpanelConfigured()) {
      await cpanelDeleteBusiness(id);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('businesses').delete().eq('id', id);
        await supabase.from('places').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete exception:', err);
      }
    }
    return true;
  };

  // News CRUD
  const addNews = async (article: Omit<NewsArticle, 'id'>): Promise<boolean> => {
    const newArticle: NewsArticle = {
      ...article,
      id: `news-${Date.now()}`
    };
    setNews(prev => [newArticle, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddNews(newArticle);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('news').insert([newArticle]);
      } catch (e) {
        console.warn('Error inserting news:', e);
      }
    }
    return true;
  };

  const deleteNews = async (id: string): Promise<boolean> => {
    setNews(prev => prev.filter(n => n.id !== id));

    if (isCpanelConfigured()) {
      await cpanelDeleteNews(id);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('news').delete().eq('id', id);
      } catch (e) {
        console.warn('Error deleting news:', e);
      }
    }
    return true;
  };

  // Events CRUD
  const addEvent = async (item: Omit<EventItem, 'id'>): Promise<boolean> => {
    const newEvent: EventItem = {
      ...item,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [newEvent, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddEvent(newEvent);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('events').insert([newEvent]);
      } catch (e) {
        console.warn('Error inserting event:', e);
      }
    }
    return true;
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    setEvents(prev => prev.filter(e => e.id !== id));

    if (isCpanelConfigured()) {
      await cpanelDeleteEvent(id);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('events').delete().eq('id', id);
      } catch (e) {
        console.warn('Error deleting event:', e);
      }
    }
    return true;
  };

  // Offers CRUD
  const addOffer = async (item: Omit<OfferItem, 'id'>): Promise<boolean> => {
    const newOffer: OfferItem = {
      ...item,
      id: `off-${Date.now()}`
    };
    setOffers(prev => [newOffer, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddOffer(newOffer);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('offers').insert([newOffer]);
      } catch (e) {
        console.warn('Error inserting offer:', e);
      }
    }
    return true;
  };

  const deleteOffer = async (id: string): Promise<boolean> => {
    setOffers(prev => prev.filter(o => o.id !== id));

    if (isCpanelConfigured()) {
      await cpanelDeleteOffer(id);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('offers').delete().eq('id', id);
      } catch (e) {
        console.warn('Error deleting offer:', e);
      }
    }
    return true;
  };

  // Blood Donor CRUD
  const addBloodDonor = async (donor: Omit<BloodDonor, 'id'>): Promise<boolean> => {
    const newDonor: BloodDonor = {
      ...donor,
      id: `donor-${Date.now()}`
    };
    setBloodDonors(prev => [newDonor, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddDonor(newDonor);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('blood_donors').insert([newDonor]);
      } catch (e) {
        console.warn('Error inserting blood donor:', e);
      }
    }
    return true;
  };

  const deleteBloodDonor = async (id: string): Promise<boolean> => {
    setBloodDonors(prev => prev.filter(d => d.id !== id));
    if (isCpanelConfigured()) {
      await cpanelDeleteDonor(id);
      return true;
    }
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try { await supabase.from('blood_donors').delete().eq('id', id); } catch {}
    }
    return true;
  };

  // Tuition CRUD
  const addTuition = async (tuition: Omit<TuitionListing, 'id'>): Promise<boolean> => {
    const newTuition: TuitionListing = {
      ...tuition,
      id: `tui-${Date.now()}`
    };
    setTuitionListings(prev => [newTuition, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddTuition(newTuition);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('tuition_listings').insert([newTuition]);
      } catch (e) {
        console.warn('Error inserting tuition:', e);
      }
    }
    return true;
  };

  const deleteTuition = async (id: string): Promise<boolean> => {
    setTuitionListings(prev => prev.filter(t => t.id !== id));
    if (isCpanelConfigured()) {
      await cpanelDeleteTuition(id);
      return true;
    }
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try { await supabase.from('tuition_listings').delete().eq('id', id); } catch {}
    }
    return true;
  };

  // To-Let CRUD
  const addToLet = async (toLet: Omit<ToLetListing, 'id'>): Promise<boolean> => {
    const newToLet: ToLetListing = {
      ...toLet,
      id: `tolet-${Date.now()}`
    };
    setToLetListings(prev => [newToLet, ...prev]);

    if (isCpanelConfigured()) {
      await cpanelAddToLet(newToLet);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('to_let_listings').insert([newToLet]);
      } catch (e) {
        console.warn('Error inserting to-let:', e);
      }
    }
    return true;
  };

  const deleteToLet = async (id: string): Promise<boolean> => {
    setToLetListings(prev => prev.filter(tl => tl.id !== id));
    if (isCpanelConfigured()) {
      await cpanelDeleteToLet(id);
      return true;
    }
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try { await supabase.from('to_let_listings').delete().eq('id', id); } catch {}
    }
    return true;
  };

  // Reviews CRUD
  const submitReview = async (reviewInput: {
    place_id: string;
    user_name: string;
    rating: number;
    comment: string;
  }): Promise<boolean> => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      place_id: reviewInput.place_id,
      user_name: reviewInput.user_name || 'Visitor',
      rating: reviewInput.rating,
      comment: reviewInput.comment,
      status: 'approved',
      created_at: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);

    const placeReviews = [...reviews.filter(r => r.place_id === reviewInput.place_id), newReview];
    const totalRating = placeReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / placeReviews.length).toFixed(1));

    updatePlace(reviewInput.place_id, {
      rating: avgRating,
      review_count: placeReviews.length,
    });

    if (isCpanelConfigured()) {
      await cpanelSubmitReview(newReview);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('reviews').insert([newReview]);
      } catch (err) {
        console.warn('Supabase review insert error:', err);
      }
    }
    return true;
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    setReviews(prev => prev.map(r => (r.id === reviewId ? { ...r, status } : r)));

    if (isCpanelConfigured()) {
      await cpanelUpdateReview(reviewId, status);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('reviews').update({ status }).eq('id', reviewId);
      } catch (err) {
        console.warn('Supabase review update error:', err);
      }
    }
    return true;
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));

    if (isCpanelConfigured()) {
      await cpanelDeleteReview(reviewId);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('reviews').delete().eq('id', reviewId);
      } catch (err) {
        console.warn('Supabase review delete error:', err);
      }
    }
    return true;
  };

  const resetToInitialData = () => {
    setBusinesses([]);
    setReviews([]);
    setNews([]);
    setEvents([]);
    setOffers([]);
    setBloodDonors([]);
    setTuitionListings([]);
    setToLetListings([]);
  };

  // Optional: Seed Supabase database with starter records
  const seedDatabaseFromInitial = async (): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, message: 'Supabase ডেটাবেজ কানেক্টেড নেই।' };
    }

    try {
      setIsLoading(true);
      // Upsert into Supabase tables
      await supabase.from('categories').upsert(INITIAL_CATEGORIES);
      await supabase.from('businesses').upsert(INITIAL_BUSINESSES);
      await supabase.from('news').upsert(INITIAL_NEWS);
      await supabase.from('events').upsert(INITIAL_EVENTS);
      await supabase.from('offers').upsert(INITIAL_OFFERS);
      await supabase.from('blood_donors').upsert(INITIAL_BLOOD_DONORS);
      await supabase.from('tuition_listings').upsert(INITIAL_TUITION_LISTINGS);
      await supabase.from('to_let_listings').upsert(INITIAL_TO_LET_LISTINGS);
      await supabase.from('reviews').upsert(INITIAL_REVIEWS);

      await refreshData();
      return { success: true, message: 'সফলভাবে সকল প্রাথমিক ডেটা Supabase এ সংরক্ষণ করা হয়েছে।' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'সিড করতে ব্যর্থ হয়েছে';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        businesses,
        places: businesses,
        categories,
        news,
        events,
        offers,
        bloodDonors,
        tuitionListings,
        toLetListings,
        emergencyContacts,
        trainSchedules,
        reviews,
        favorites,
        isLoading,
        isCloudSynced,
        addBusiness,
        addPlace,
        updatePlace,
        deletePlace,
        toggleFavorite,
        isFavorite,
        submitReview,
        updateReviewStatus,
        deleteReview,
        addNews,
        deleteNews,
        addEvent,
        deleteEvent,
        addOffer,
        deleteOffer,
        addBloodDonor,
        deleteBloodDonor,
        addTuition,
        deleteTuition,
        addToLet,
        deleteToLet,
        refreshData,
        resetToInitialData,
        seedDatabaseFromInitial,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
