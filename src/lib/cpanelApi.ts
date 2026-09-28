/**
 * cPanel MySQL REST API Client for Mymensingh.top
 * Connects React frontend directly to cPanel PHP/MySQL Backend
 */

const STORAGE_CPANEL_URL = 'mymensingh_cpanel_api_url_v1';

export const getCpanelApiUrl = (): string => {
  const saved = localStorage.getItem(STORAGE_CPANEL_URL);
  if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');
  
  if (import.meta.env.VITE_CPANEL_API_URL) {
    return import.meta.env.VITE_CPANEL_API_URL.trim().replace(/\/+$/, '');
  }

  // If in production hosted on the same domain, default to /api
  if (typeof window !== 'undefined' && window.location.origin) {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
    if (!isLocal) {
      return `${window.location.origin}/api`;
    }
  }
  return '';
};

export const setCpanelApiUrl = (url: string) => {
  localStorage.setItem(STORAGE_CPANEL_URL, url.trim().replace(/\/+$/, ''));
};

export const isCpanelConfigured = (): boolean => {
  const url = getCpanelApiUrl();
  return Boolean(url && url.length > 5);
};

// Generic fetcher
async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string; [key: string]: any }> {
  const baseUrl = getCpanelApiUrl();
  if (!baseUrl) {
    return { success: false, error: 'cPanel API URL কনফিগার করা নেই।' };
  }

  // Handle both clean URL (e.g. /api/news) and query URL (e.g. /api/index.php?action=news)
  const separator = baseUrl.includes('.php') ? '&' : '?';
  const url = baseUrl.includes('.php') 
    ? `${baseUrl}${separator}action=${endpoint}` 
    : `${baseUrl}/index.php?action=${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

export const cpanelFetchAll = async () => {
  return await apiRequest('init');
};

export const cpanelLogin = async (email: string, password: string) => {
  return await apiRequest('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const cpanelSignUp = async (email: string, password: string, metadata?: any) => {
  return await apiRequest('auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: metadata?.full_name || '',
      phone: metadata?.phone || ''
    })
  });
};

export const cpanelSendOtp = async (identifier: string) => {
  return await apiRequest('auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, phone: identifier })
  });
};

export const cpanelVerifyOtp = async (phone: string, otp: string) => {
  return await apiRequest('auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp })
  });
};

export const cpanelResetPassword = async (phone: string, otp: string, newPassword: string) => {
  return await apiRequest('auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ phone, otp, new_password: newPassword })
  });
};

export const cpanelMakeAdmin = async (email: string, role: string = 'admin') => {
  return await apiRequest('auth/make-admin', {
    method: 'POST',
    body: JSON.stringify({ email, role, admin_secret: 'mymensingh_admin_master_2026' })
  });
};

export const cpanelGetUsers = async () => {
  return await apiRequest('auth/users');
};

export const cpanelAddBusiness = async (biz: any) => {
  return await apiRequest('businesses', {
    method: 'POST',
    body: JSON.stringify(biz)
  });
};

export const cpanelUpdateBusiness = async (id: string, fields: any) => {
  return await apiRequest('businesses', {
    method: 'PUT',
    body: JSON.stringify({ id, ...fields })
  });
};

export const cpanelDeleteBusiness = async (id: string) => {
  return await apiRequest(`businesses&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddNews = async (article: any) => {
  return await apiRequest('news', {
    method: 'POST',
    body: JSON.stringify(article)
  });
};

export const cpanelDeleteNews = async (id: string) => {
  return await apiRequest(`news&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddEvent = async (event: any) => {
  return await apiRequest('events', {
    method: 'POST',
    body: JSON.stringify(event)
  });
};

export const cpanelDeleteEvent = async (id: string) => {
  return await apiRequest(`events&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddOffer = async (offer: any) => {
  return await apiRequest('offers', {
    method: 'POST',
    body: JSON.stringify(offer)
  });
};

export const cpanelDeleteOffer = async (id: string) => {
  return await apiRequest(`offers&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddDonor = async (donor: any) => {
  return await apiRequest('blood_donors', {
    method: 'POST',
    body: JSON.stringify(donor)
  });
};

export const cpanelDeleteDonor = async (id: string) => {
  return await apiRequest(`blood_donors&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddTuition = async (tuition: any) => {
  return await apiRequest('tuition', {
    method: 'POST',
    body: JSON.stringify(tuition)
  });
};

export const cpanelDeleteTuition = async (id: string) => {
  return await apiRequest(`tuition&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelAddToLet = async (toLet: any) => {
  return await apiRequest('tolet', {
    method: 'POST',
    body: JSON.stringify(toLet)
  });
};

export const cpanelDeleteToLet = async (id: string) => {
  return await apiRequest(`tolet&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const cpanelSubmitReview = async (review: any) => {
  return await apiRequest('reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  });
};

export const cpanelUpdateReview = async (id: string, status: string) => {
  return await apiRequest('reviews', {
    method: 'PUT',
    body: JSON.stringify({ id, status })
  });
};

export const cpanelDeleteReview = async (id: string) => {
  return await apiRequest(`reviews&id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};
