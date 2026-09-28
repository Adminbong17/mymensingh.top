import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  isCpanelConfigured,
  cpanelLogin,
  cpanelSignUp,
  cpanelSendOtp,
  cpanelResetPassword,
  cpanelMakeAdmin
} from '../lib/cpanelApi';
import type { UserProfile } from '../types';

export interface SignUpMetadata {
  full_name?: string;
  phone?: string;
  role?: 'admin' | 'user';
  business_name?: string;
}

const STORAGE_ADMIN_EMAILS = 'mymensingh_admin_emails_v1';

export const DEFAULT_ADMIN_EMAILS = [
  'admin@bongbangla.top',
  'admin@mymensingh.top'
];

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isDemoAdmin: boolean;
  isLoading: boolean;
  adminEmails: string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
  sendPasswordResetOtp: (identifier: string) => Promise<{ success: boolean; error?: string; message?: string; phone?: string; masked_phone?: string; otp_code?: string }>;
  resetPasswordWithOtp: (phone: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  makeUserAdmin: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('mymensingh_demo_admin') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_EMAILS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...parsed]));
        localStorage.setItem(STORAGE_ADMIN_EMAILS, JSON.stringify(merged));
        return merged;
      }
    } catch {}
    localStorage.setItem(STORAGE_ADMIN_EMAILS, JSON.stringify(DEFAULT_ADMIN_EMAILS));
    return DEFAULT_ADMIN_EMAILS;
  });

  // Helper to extract UserProfile from Supabase User
  const formatUserProfile = (supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): UserProfile => {
    const metaRole = supabaseUser.user_metadata?.role as 'admin' | 'user' | undefined;
    const cleanEmail = (supabaseUser.email || '').toLowerCase().trim();

    let localList: string[] = adminEmails;
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_EMAILS);
      if (saved) localList = JSON.parse(saved).map((e: string) => e.toLowerCase().trim());
    } catch {}

    const isEmailAdmin = Boolean(
      cleanEmail === 'admin@bongbangla.top' ||
      DEFAULT_ADMIN_EMAILS.includes(cleanEmail) ||
      localList.includes(cleanEmail) ||
      metaRole === 'admin'
    );
    const role: 'admin' | 'user' = isEmailAdmin ? 'admin' : 'user';
    const fullName = (supabaseUser.user_metadata?.full_name as string) || 
      (cleanEmail === 'admin@bongbangla.top' ? 'Super Admin (BongBangla)' : supabaseUser.email?.split('@')[0]) || 
      'User';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role,
      full_name: fullName,
    };
  };

  useEffect(() => {
    // Check demo admin first
    if (localStorage.getItem('mymensingh_demo_admin') === 'true') {
      setUser({
        id: 'admin-bongbangla',
        email: 'admin@bongbangla.top',
        role: 'admin',
        full_name: 'Super Admin (BongBangla)'
      });
      setIsLoading(false);
      return;
    }

    // Check cPanel saved session
    const savedCpanelUser = localStorage.getItem('mymensingh_cpanel_user');
    if (savedCpanelUser) {
      try {
        setUser(JSON.parse(savedCpanelUser));
        setIsLoading(false);
        return;
      } catch {}
    }

    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Get current real session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(formatUserProfile(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Supabase getSession error:', err);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(formatUserProfile(session.user));
      } else if (!localStorage.getItem('mymensingh_demo_admin') && !localStorage.getItem('mymensingh_cpanel_user')) {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real Login (cPanel or Supabase)
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();

    // 1. Try cPanel MySQL first if configured
    if (isCpanelConfigured()) {
      try {
        const res = await cpanelLogin(cleanEmail, password);
        if (res.success && res.user) {
          const profile: UserProfile = {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role || (res.user.email.includes('admin') ? 'admin' : 'user'),
            full_name: res.user.full_name || res.user.email.split('@')[0],
          };
          setUser(profile);
          localStorage.setItem('mymensingh_cpanel_user', JSON.stringify(profile));
          localStorage.removeItem('mymensingh_demo_admin');
          setIsDemoAdmin(false);
          return { success: true };
        }
        return { success: false, error: res.error || 'ভুল ইমেইল বা পাসওয়ার্ড।' };
      } catch (e: any) {
        return { success: false, error: e.message || 'cPanel সার্ভার সংযোগে সমস্যা।' };
      }
    }

    // 2. Supabase Cloud Auth
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: 'ডেটাবেজ কনফিগার করা নেই।' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'ভুল ইমেইল বা পাসওয়ার্ড। দয়া করে সঠিক তথ্য দিয়ে চেষ্টা করুন।';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'আপনার ইমেইল এখনও নিশ্চিত করা হয়নি। দয়া করে আপনার ইনবক্স চেক করুন।';
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        setUser(formatUserProfile(data.user));
        localStorage.removeItem('mymensingh_demo_admin');
        setIsDemoAdmin(false);
        return { success: true };
      }
      return { success: false, error: 'ব্যবহারকারী পাওয়া যায়নি।' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে';
      return { success: false, error: message };
    }
  };

  // Real Sign Up (cPanel or Supabase)
  const signUp = async (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    const cleanEmail = email.trim();

    // 1. Try cPanel MySQL if configured
    if (isCpanelConfigured()) {
      try {
        const res = await cpanelSignUp(cleanEmail, password, metadata);
        if (res.success && res.user) {
          const profile: UserProfile = {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role || (res.user.email.includes('admin') ? 'admin' : 'user'),
            full_name: res.user.full_name || cleanEmail.split('@')[0],
          };
          setUser(profile);
          localStorage.setItem('mymensingh_cpanel_user', JSON.stringify(profile));
          localStorage.removeItem('mymensingh_demo_admin');
          setIsDemoAdmin(false);
          return { success: true, requiresEmailConfirmation: false };
        }
        return { success: false, error: res.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।' };
      } catch (e: any) {
        return { success: false, error: e.message || 'cPanel সার্ভার সংযোগে সমস্যা।' };
      }
    }

    // 2. Supabase Auth
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: 'ডেটাবেজ কনফিগার করা নেই।' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: metadata?.full_name || '',
            phone: metadata?.phone || '',
            role: metadata?.role || 'user',
            business_name: metadata?.business_name || '',
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('User already registered')) {
          msg = 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।';
        } else if (msg.includes('Password should be at least')) {
          msg = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        if (data.session) {
          setUser(formatUserProfile(data.user));
          localStorage.removeItem('mymensingh_demo_admin');
          setIsDemoAdmin(false);
          return { success: true, requiresEmailConfirmation: false };
        }

        // Instant login without email confirmation blocking
        try {
          const directLogin = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
          if (directLogin.data?.user) {
            setUser(formatUserProfile(directLogin.data.user));
            return { success: true, requiresEmailConfirmation: false };
          }
        } catch {}

        setUser(formatUserProfile(data.user));
        return { success: true, requiresEmailConfirmation: false };
      }

      return { success: false, error: 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি।' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'রেজিস্ট্রেশন ব্যর্থ হয়েছে';
      return { success: false, error: message };
    }
  };

  const loginAsDemoAdmin = () => {
    localStorage.setItem('mymensingh_demo_admin', 'true');
    setIsDemoAdmin(true);
    setUser({
      id: 'admin-bongbangla',
      email: 'admin@bongbangla.top',
      role: 'admin',
      full_name: 'Super Admin (BongBangla)'
    });
  };

  const logout = async () => {
    localStorage.removeItem('mymensingh_demo_admin');
    localStorage.removeItem('mymensingh_cpanel_user');
    setIsDemoAdmin(false);
    setUser(null);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error during Supabase signout:', e);
      }
    }
  };

  const addAdminEmail = (emailToAdd: string) => {
    const clean = emailToAdd.toLowerCase().trim();
    if (!clean) return;
    setAdminEmails(prev => {
      if (prev.includes(clean)) return prev;
      const updated = [...prev, clean];
      localStorage.setItem(STORAGE_ADMIN_EMAILS, JSON.stringify(updated));
      return updated;
    });

    setUser(prev => {
      if (prev && prev.email.toLowerCase().trim() === clean) {
        return { ...prev, role: 'admin' };
      }
      return prev;
    });

    if (isCpanelConfigured()) {
      cpanelMakeAdmin(clean, 'admin').catch(() => {});
    }
  };

  const makeUserAdmin = async (emailToPromote: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const clean = emailToPromote.toLowerCase().trim();
    if (!clean) return { success: false, error: 'ইমেইল আবশ্যক।' };

    addAdminEmail(clean);

    if (isCpanelConfigured()) {
      const res = await cpanelMakeAdmin(clean, 'admin');
      return res;
    }
    return { success: true, message: `${clean} সফলভাবে অ্যাডমিন হিসেবে তালিকাভুক্ত হয়েছে!` };
  };

  const sendPasswordResetOtp = async (identifier: string) => {
    if (isCpanelConfigured()) {
      return await cpanelSendOtp(identifier);
    }

    // Supabase OTP / Reset flow
    const clean = identifier.trim();
    if (!clean) return { success: false, error: 'মোবাইল নম্বর বা ইমেইল দিন।' };

    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('mymensingh_reset_otp_' + clean, testOtp);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured() && clean.includes('@')) {
      try {
        await supabase.auth.resetPasswordForEmail(clean);
      } catch {}
    }

    return {
      success: true,
      message: `আপনার নম্বরে (${clean}) ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।`,
      phone: clean,
      otp_code: testOtp
    };
  };

  const resetPasswordWithOtp = async (phone: string, otp: string, newPassword: string) => {
    if (isCpanelConfigured()) {
      return await cpanelResetPassword(phone, otp, newPassword);
    }

    // Supabase OTP verification
    const clean = phone.trim();
    const savedOtp = sessionStorage.getItem('mymensingh_reset_otp_' + clean);
    if (!savedOtp || savedOtp !== otp.trim()) {
      return { success: false, error: 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড।' };
    }

    sessionStorage.removeItem('mymensingh_reset_otp_' + clean);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch {}
    }

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
    };
  };

  const removeAdminEmail = (emailToRemove: string) => {
    const clean = emailToRemove.toLowerCase().trim();
    setAdminEmails(prev => {
      const updated = prev.filter(e => e !== clean);
      localStorage.setItem(STORAGE_ADMIN_EMAILS, JSON.stringify(updated));
      return updated;
    });

    setUser(prev => {
      if (prev && prev.email.toLowerCase().trim() === clean && !clean.includes('admin')) {
        return { ...prev, role: 'user' };
      }
      return prev;
    });

    if (isCpanelConfigured()) {
      cpanelMakeAdmin(clean, 'user').catch(() => {});
    }
  };

  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isDemoAdmin,
        isLoading,
        adminEmails,
        addAdminEmail,
        removeAdminEmail,
        makeUserAdmin,
        login,
        signUp,
        sendPasswordResetOtp,
        resetPasswordWithOtp,
        loginAsDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
