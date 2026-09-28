import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default from environment variables if present
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Stored in localStorage for quick in-browser config
const STORAGE_KEY_URL = 'mymensingh_supabase_url';
const STORAGE_KEY_ANON = 'mymensingh_supabase_anon_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || ENV_SUPABASE_URL;
  const localKey = localStorage.getItem(STORAGE_KEY_ANON) || ENV_SUPABASE_ANON_KEY;
  return { url: localUrl, anonKey: localKey };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_ANON);

  // Rebuild client
  initSupabase();
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
}

// Initial invocation
initSupabase();

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    initSupabase();
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(url && anonKey);
}
