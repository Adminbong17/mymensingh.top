import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  INITIAL_SUBCATEGORIES,
  ALL_INITIAL_CATEGORIES,
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
import { sortNewsByDate, parseNewsTimestamp } from '../lib/newsUtils';
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
  mainCategories: Category[];
  subcategories: Category[];
  getSubcategories: (parentSlugOrId: string) => Category[];
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
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (orderedList: Category[]) => Promise<boolean>;
  refreshData: () => Promise<void>;
  resetToInitialData: () => void;
  seedDatabaseFromInitial: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BUSINESSES: 'mymensingh_real_businesses_v2',
  NEWS: 'mymensingh_real_news_v3',
  EVENTS: 'mymensingh_real_events_v2',
  OFFERS: 'mymensingh_real_offers_v2',
  DONORS: 'mymensingh_real_donors_v2',
  TUITIONS: 'mymensingh_real_tuitions_v2',
  TOLETS: 'mymensingh_real_tolets_v2',
  REVIEWS: 'mymensingh_real_reviews_v2',
  CATEGORIES: 'mymensingh_real_categories_v2',
  FAVORITES: 'mymensingh_favorites_top_v1',
};

function loadStoredArray<T>(key: string, fallback: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function mergeWithLocal<T extends { id: string }>(cloudItems: T[] | null | undefined, localItems: T[]): T[] {
  if (!cloudItems || cloudItems.length === 0) {
    return localItems;
  }
  const map = new Map<string, T>();
  cloudItems.forEach(item => map.set(item.id, item));
  // Preserve locally created items that haven't synced to cloud yet
  localItems.forEach(item => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real data initialized with persistent localStorage cache
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const raw = loadStoredArray<Business>(STORAGE_KEYS.BUSINESSES, []);
    return raw.filter(b => b.category_id !== 'cat-doctor' && b.category_slug !== 'doctors' && b.category_slug !== 'doctor');
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const loaded = loadStoredArray(STORAGE_KEYS.CATEGORIES, ALL_INITIAL_CATEGORIES)
      .filter(c => c.id !== 'cat-doctor' && c.slug !== 'doctors' && c.slug !== 'doctor' && !c.id.startsWith('sub-doc-'));
    const existingIds = new Set(loaded.map(c => c.id));
    const missing = INITIAL_SUBCATEGORIES.filter(sc => !existingIds.has(sc.id));
    const full = (missing.length > 0 ? [...loaded, ...missing] : loaded)
      .filter(c => c.id !== 'cat-doctor' && c.slug !== 'doctors' && c.slug !== 'doctor' && !c.id.startsWith('sub-doc-'))
      .map(c => ({
        ...c,
        parent_id: c.parent_id ? c.parent_id : null
      }));
    return full.sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
  });

  const mainCategories = useMemo(() => {
    return categories
      .filter(c => !c.parent_id)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
  }, [categories]);

  const subcategories = useMemo(() => {
    return categories
      .filter(c => !!c.parent_id)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
  }, [categories]);

  const getSubcategories = useCallback((parentSlugOrId: string): Category[] => {
    if (!parentSlugOrId) return [];
    const parent = categories.find(c => c.slug === parentSlugOrId || c.id === parentSlugOrId);
    if (!parent) return [];
    return categories
      .filter(c => c.parent_id === parent.id || c.parent_id === parent.slug)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
  }, [categories]);
  const [news, setNews] = useState<NewsArticle[]>(() =>
    loadStoredArray(STORAGE_KEYS.NEWS, [])
  );
  const [events, setEvents] = useState<EventItem[]>(() =>
    loadStoredArray(STORAGE_KEYS.EVENTS, [])
  );
  const [offers, setOffers] = useState<OfferItem[]>(() =>
    loadStoredArray(STORAGE_KEYS.OFFERS, [])
  );
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(() =>
    loadStoredArray(STORAGE_KEYS.DONORS, [])
  );
  const [tuitionListings, setTuitionListings] = useState<TuitionListing[]>(() =>
    loadStoredArray(STORAGE_KEYS.TUITIONS, [])
  );
  const [toLetListings, setToLetListings] = useState<ToLetListing[]>(() =>
    loadStoredArray(STORAGE_KEYS.TOLETS, [])
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadStoredArray(STORAGE_KEYS.REVIEWS, [])
  );

  // Emergency contacts and train schedules (standard public municipal utility data)
  const [emergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [trainSchedules] = useState<TrainSchedule[]>(INITIAL_TRAIN_SCHEDULES);

  // User client-side favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Auto-persist all arrays to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(bloodDonors));
  }, [bloodDonors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TUITIONS, JSON.stringify(tuitionListings));
  }, [tuitionListings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOLETS, JSON.stringify(toLetListings));
  }, [toLetListings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Clean up legacy mock data storage and outdated news cache
  useEffect(() => {
    localStorage.removeItem('mymensingh_businesses_top_v1');
    localStorage.removeItem('mymensingh_reviews_top_v1');
    localStorage.removeItem('mymensingh_real_news_v2');
    localStorage.removeItem('mymensingh_real_news_v1');
  }, []);

  // Real Data Fetch (Supports cPanel MySQL or Supabase with non-destructive local merge)
  const refreshData = useCallback(async () => {
    // 1. Check if cPanel MySQL API is configured
    if (isCpanelConfigured()) {
      try {
        setIsLoading(true);
        const res = await cpanelFetchAll();
        if (res && res.success) {
          if (Array.isArray(res.businesses)) setBusinesses(prev => mergeWithLocal(res.businesses, prev));
          if (Array.isArray(res.categories) && res.categories.length > 0) setCategories(prev => mergeWithLocal(res.categories, prev));
          if (Array.isArray(res.news)) setNews(res.news);
          if (Array.isArray(res.events)) setEvents(prev => mergeWithLocal(res.events, prev));
          if (Array.isArray(res.offers)) setOffers(prev => mergeWithLocal(res.offers, prev));
          if (Array.isArray(res.blood_donors)) setBloodDonors(prev => mergeWithLocal(res.blood_donors, prev));
          if (Array.isArray(res.tuition_listings)) setTuitionListings(prev => mergeWithLocal(res.tuition_listings, prev));
          if (Array.isArray(res.to_let_listings)) setToLetListings(prev => mergeWithLocal(res.to_let_listings, prev));
          if (Array.isArray(res.reviews)) setReviews(prev => mergeWithLocal(res.reviews, prev));
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
        setBusinesses(prev => mergeWithLocal(dbBusinesses as Business[], prev));
        setIsCloudSynced(true);
      } else {
        // Fallback check to places table if businesses table not present
        const fallback = await supabase
          .from('places')
          .select('*')
          .order('is_featured', { ascending: false });
        if (!fallback.error && fallback.data !== null && fallback.data.length > 0) {
          setBusinesses(prev => mergeWithLocal(fallback.data as Business[], prev));
          setIsCloudSynced(true);
        }
      }

      // 2. Fetch real categories from Supabase
      try {
        const { data: dbCat, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('order_index');
        if (!catErr && dbCat && dbCat.length > 0) {
          setCategories(prev => {
            const merged = mergeWithLocal(dbCat as Category[], prev);
            const existingIds = new Set(merged.map(c => c.id));
            const missing = INITIAL_SUBCATEGORIES.filter(sc => !existingIds.has(sc.id));
            const full = (missing.length > 0 ? [...merged, ...missing] : merged).map(c => ({
              ...c,
              parent_id: c.parent_id ? c.parent_id : null
            }));
            return full.sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
          });
        }
      } catch (err) {
        console.warn('Could not fetch categories from Supabase:', err);
      }

      // 3. Fetch real news from Supabase (authoritative source)
      try {
        const { data: dbNews, error: newsErr } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (!newsErr && dbNews !== null && dbNews.length > 0) {
          // Automatic 60-day filter: keep only articles within 60 days
          const sixtyDaysAgoMs = Date.now() - 60 * 24 * 60 * 60 * 1000;
          const freshNews = (dbNews as NewsArticle[]).filter(item => {
            const itemTime = parseNewsTimestamp(item.date, (item as any).created_at);
            return itemTime === 0 || itemTime >= sixtyDaysAgoMs;
          });
          setNews(sortNewsByDate(freshNews));

          // Background auto-purge: delete news older than 60 days from Supabase table
          const sixtyDaysAgoIso = new Date(sixtyDaysAgoMs).toISOString();
          (async () => {
            try {
              await supabase.from('news').delete().lt('created_at', sixtyDaysAgoIso);
            } catch {
              // Silently ignore background cleanup errors
            }
          })();

        }
      } catch {}

      // 4. Fetch real events from Supabase
      try {
        const { data: dbEvents, error: evErr } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        if (!evErr && dbEvents !== null && dbEvents.length > 0) {
          setEvents(prev => mergeWithLocal(dbEvents as EventItem[], prev));
        }
      } catch {}

      // 5. Fetch real offers from Supabase
      try {
        const { data: dbOffers, error: offErr } = await supabase
          .from('offers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!offErr && dbOffers !== null && dbOffers.length > 0) {
          setOffers(prev => mergeWithLocal(dbOffers as OfferItem[], prev));
        }
      } catch {}

      // 6. Fetch real blood donors from Supabase
      try {
        const { data: dbDonors, error: donErr } = await supabase
          .from('blood_donors')
          .select('*')
          .order('created_at', { ascending: false });
        if (!donErr && dbDonors !== null && dbDonors.length > 0) {
          setBloodDonors(prev => mergeWithLocal(dbDonors as BloodDonor[], prev));
        }
      } catch {}

      // 7. Fetch real tuition listings from Supabase
      try {
        const { data: dbTuition, error: tuiErr } = await supabase
          .from('tuition_listings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!tuiErr && dbTuition !== null && dbTuition.length > 0) {
          setTuitionListings(prev => mergeWithLocal(dbTuition as TuitionListing[], prev));
        }
      } catch {}

      // 8. Fetch real to-let listings from Supabase
      try {
        const { data: dbToLet, error: toLetErr } = await supabase
          .from('to_let_listings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!toLetErr && dbToLet !== null && dbToLet.length > 0) {
          const mapped = dbToLet.map((item: any) => ({
            ...item,
            location: item.location || item.area || 'ময়মনসিংহ',
            property_type: item.property_type || item.type || 'Family'
          }));
          setToLetListings(prev => mergeWithLocal(mapped as ToLetListing[], prev));
        }
      } catch {}

      // 9. Fetch real reviews from Supabase
      try {
        const { data: dbReviews, error: revErr } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!revErr && dbReviews !== null && dbReviews.length > 0) {
          setReviews(prev => mergeWithLocal(dbReviews as Review[], prev));
        }
      } catch {}
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
        const cleanPayload = {
          id: newBusiness.id,
          name: newBusiness.name,
          name_bn: newBusiness.name_bn || null,
          category: newBusiness.category,
          category_id: newBusiness.category_id || null,
          category_slug: newBusiness.category_slug,
          rating: Number(newBusiness.rating) || 5.0,
          review_count: Number(newBusiness.review_count) || 0,
          location: newBusiness.location || 'ময়মনসিংহ',
          area: newBusiness.area || null,
          district: newBusiness.district || 'ময়মনসিংহ',
          upazila: newBusiness.upazila || 'ময়মনসিংহ সদর',
          union_ward: newBusiness.union_ward || null,
          phone: newBusiness.phone || '',
          website: newBusiness.website || null,
          image_url: newBusiness.image_url || '',
          gallery_images: newBusiness.gallery_images || [],
          description: newBusiness.description || newBusiness.description_bn || newBusiness.description_en || null,
          opening_hours: newBusiness.opening_hours || newBusiness.opening_hours_bn || newBusiness.opening_hours_en || null,
          price_range: newBusiness.price_range || null,
          is_featured: Boolean(newBusiness.is_featured),
          latitude: Number(newBusiness.latitude) || 24.755,
          longitude: Number(newBusiness.longitude) || 90.403,
        };
        await supabase.from('businesses').insert([cleanPayload]);
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
        const cleanUpdate: Record<string, any> = {};
        const allowedCols = [
          'name', 'name_bn', 'category', 'category_id', 'category_slug',
          'rating', 'review_count', 'location', 'area', 'district', 'upazila',
          'union_ward', 'phone', 'website', 'image_url', 'gallery_images',
          'description', 'opening_hours', 'price_range', 'is_featured',
          'latitude', 'longitude'
        ];
        for (const [k, v] of Object.entries(updatedFields)) {
          if (allowedCols.includes(k)) cleanUpdate[k] = v;
        }
        await supabase.from('businesses').update(cleanUpdate).eq('id', id);
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
      } catch (err) {
        console.warn('Supabase delete exception:', err);
      }
    }
    return true;
  };

  // News CRUD
  const addNews = async (article: Omit<NewsArticle, 'id'>): Promise<boolean> => {
    const nowIso = new Date().toISOString();
    const newArticle: NewsArticle = {
      ...article,
      id: `news-${Date.now()}`,
      created_at: article.created_at || nowIso,
    };
    setNews(prev => sortNewsByDate([newArticle, ...prev]));

    if (isCpanelConfigured()) {
      await cpanelAddNews(newArticle);
      return true;
    }

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const cleanPayload = {
          id: newArticle.id,
          title: newArticle.title,
          title_en: newArticle.title_en || null,
          excerpt: newArticle.excerpt || (newArticle.content ? newArticle.content.slice(0, 100) : newArticle.title),
          category: newArticle.category || 'General',
          date: newArticle.date || new Date().toISOString().split('T')[0],
          image_url: newArticle.image_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
          read_time: newArticle.read_time || '৩ মিনিট পাঠ',
          content: newArticle.content || newArticle.title,
          created_at: newArticle.created_at || nowIso,
        };
        await supabase.from('news').insert([cleanPayload]);
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
        const cleanPayload = {
          id: newEvent.id,
          title: newEvent.title || newEvent.title_bn,
          title_bn: newEvent.title_bn || newEvent.title,
          date: newEvent.date,
          time: newEvent.time || 'সন্ধ্যা ৬:০০',
          venue: newEvent.venue || 'ময়মনসিংহ',
          category: newEvent.category || 'সাধারণ',
          image_url: newEvent.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
          entry_fee: newEvent.entry_fee || 'Free / উন্মুক্ত',
          description: newEvent.description || newEvent.title
        };
        await supabase.from('events').insert([cleanPayload]);
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
        const cleanPayload = {
          id: newOffer.id,
          title: newOffer.title,
          discount: newOffer.discount || '১০% ছাড়',
          business_name: newOffer.business_name || 'ময়মনসিংহ পার্টনার',
          category: newOffer.category || 'শপিং ও ডাইনিং',
          expiry_date: newOffer.expiry_date || 'সীমিত সময়',
          promo_code: newOffer.promo_code || 'MYM2026',
          image_url: newOffer.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
          description: newOffer.description || newOffer.title
        };
        await supabase.from('offers').insert([cleanPayload]);
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
        const cleanPayload = {
          id: newDonor.id,
          name: newDonor.name,
          blood_group: newDonor.blood_group,
          upazila: newDonor.upazila || 'ময়মনসিংহ সদর',
          phone: newDonor.phone,
          availability: newDonor.availability || 'Available',
          last_donation: newDonor.last_donation || null
        };
        await supabase.from('blood_donors').insert([cleanPayload]);
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
        const cleanPayload = {
          id: newTuition.id,
          title: newTuition.title,
          class_level: newTuition.class_level,
          subjects: Array.isArray(newTuition.subjects) ? newTuition.subjects : [newTuition.subjects],
          location: newTuition.location,
          salary: String(newTuition.salary),
          days_per_week: String(newTuition.days_per_week),
          phone: newTuition.phone,
          posted_date: newTuition.posted_date || 'আজ'
        };
        await supabase.from('tuition_listings').insert([cleanPayload]);
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
        const cleanPayload = {
          id: newToLet.id,
          title: newToLet.title,
          type: (newToLet as any).property_type || newToLet.type || 'Family',
          rent: String(newToLet.rent),
          bedrooms: Number(newToLet.bedrooms) || 1,
          bathrooms: Number(newToLet.bathrooms) || 1,
          area: (newToLet as any).location || newToLet.area || 'ময়মনসিংহ',
          phone: newToLet.phone || '',
          image_url: newToLet.image_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
          available_from: newToLet.available_from || 'চলতি মাস'
        };
        await supabase.from('to_let_listings').insert([cleanPayload]);
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

  // Categories CRUD
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<boolean> => {
    const isMain = !catData.parent_id;
    const siblings = categories.filter(c => isMain ? !c.parent_id : (c.parent_id === catData.parent_id));
    const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order_index ?? 0), 0);

    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      count: catData.count ?? 0,
      order_index: catData.order_index ?? (maxOrder + 1),
      parent_id: catData.parent_id ? catData.parent_id : null,
    };

    setCategories(prev => [...prev, newCategory].sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999)));

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = {
          id: newCategory.id,
          name_en: newCategory.name_en,
          name_bn: newCategory.name_bn,
          slug: newCategory.slug,
          icon: newCategory.icon,
          color: newCategory.color || 'emerald',
          order_index: newCategory.order_index,
          count: newCategory.count || 0
        };

        if (newCategory.parent_id) {
          const { error } = await supabase.from('categories').insert([{ ...payload, parent_id: newCategory.parent_id }]);
          if (error && error.message.includes('parent_id')) {
            await supabase.from('categories').insert([payload]);
          }
        } else {
          await supabase.from('categories').insert([payload]);
        }
      } catch (err) {
        console.warn('Supabase addCategory error:', err);
      }
    }
    return true;
  };

  const updateCategory = async (id: string, catData: Partial<Category>): Promise<boolean> => {
    setCategories(prev =>
      prev
        .map(cat => (cat.id === id ? { ...cat, ...catData, parent_id: catData.parent_id !== undefined ? (catData.parent_id || null) : cat.parent_id } : cat))
        .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999))
    );

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const updatePayload: Record<string, any> = {};
        if (catData.name_en !== undefined) updatePayload.name_en = catData.name_en;
        if (catData.name_bn !== undefined) updatePayload.name_bn = catData.name_bn;
        if (catData.slug !== undefined) updatePayload.slug = catData.slug;
        if (catData.icon !== undefined) updatePayload.icon = catData.icon;
        if (catData.color !== undefined) updatePayload.color = catData.color;
        if (catData.order_index !== undefined) updatePayload.order_index = catData.order_index;
        if (catData.count !== undefined) updatePayload.count = catData.count;
        if (catData.parent_id !== undefined) updatePayload.parent_id = catData.parent_id || null;

        const { error } = await supabase.from('categories').update(updatePayload).eq('id', id);
        if (error && error.message.includes('parent_id')) {
          delete updatePayload.parent_id;
          await supabase.from('categories').update(updatePayload).eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase updateCategory error:', err);
      }
    }
    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setCategories(prev => prev.filter(cat => cat.id !== id));

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCategory error:', err);
      }
    }
    return true;
  };

  const reorderCategories = async (orderedList: Category[]): Promise<boolean> => {
    const orderMap = new Map<string, number>();
    orderedList.forEach((cat, idx) => {
      orderMap.set(cat.id, idx + 1);
    });

    setCategories(prev => {
      const next = prev.map(cat => {
        if (orderMap.has(cat.id)) {
          return { ...cat, order_index: orderMap.get(cat.id)! };
        }
        return cat;
      });
      return next.sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
    });

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        for (const cat of orderedList) {
          const newOrder = orderMap.get(cat.id);
          if (newOrder !== undefined) {
            await supabase.from('categories').update({ order_index: newOrder }).eq('id', cat.id);
          }
        }
      } catch (err) {
        console.warn('Supabase reorderCategories error:', err);
      }
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
    Object.values(STORAGE_KEYS).forEach(k => {
      if (k !== STORAGE_KEYS.FAVORITES) {
        localStorage.removeItem(k);
      }
    });
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
        mainCategories,
        subcategories,
        getSubcategories,
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
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
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
