import React, { useState } from 'react';
import { X, Database, Check, Copy, RefreshCw, ShieldCheck, UserPlus, Trash2, Server, Cloud } from 'lucide-react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, isSupabaseConfigured } from '../../lib/supabase';
import { getCpanelApiUrl, setCpanelApiUrl, isCpanelConfigured } from '../../lib/cpanelApi';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { refreshData, isCloudSynced } = useData();

  const [activeTab, setActiveTab] = useState<'cpanel' | 'supabase' | 'admin'>('cpanel');
  const [cpanelUrl, setCpanelUrlState] = useState(getCpanelApiUrl());
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSaveCpanel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpanelApiUrl(cpanelUrl);
    setSavedSuccess(true);
    await refreshData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    await refreshData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sampleSql = `-- Run this in your Supabase SQL Editor:
-- 1. Create Places Table
create table if not exists public.places (
  id text primary key,
  category_id text not null,
  category_slug text,
  name_en text not null,
  name_bn text not null,
  tagline_en text,
  tagline_bn text,
  description_en text,
  description_bn text,
  area text,
  address_en text,
  address_bn text,
  latitude numeric,
  longitude numeric,
  image_url text,
  gallery_images text[],
  phone text,
  website text,
  opening_hours_en text,
  opening_hours_bn text,
  entry_fee_en text,
  entry_fee_bn text,
  rating numeric default 4.8,
  review_count integer default 0,
  is_featured boolean default false,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create Reviews Table
create table if not exists public.reviews (
  id text primary key,
  place_id text references public.places(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text default 'approved',
  created_at timestamptz default now()
);

-- 3. Row Level Security (RLS)
alter table public.places enable row level security;
alter table public.reviews enable row level security;

-- Public can read places and approved reviews
create policy "Allow public read on places" on public.places for select using (true);
create policy "Allow public read on reviews" on public.reviews for select using (status = 'approved');

-- Allow inserts
create policy "Allow public insert on places" on public.places for insert with check (true);
create policy "Allow public update on places" on public.places for update using (true);
create policy "Allow public delete on places" on public.places for delete using (true);
create policy "Allow insert on reviews" on public.reviews for insert with check (true);
create policy "Allow update on reviews" on public.reviews for update using (true);
create policy "Allow delete on reviews" on public.reviews for delete using (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {t('supabase_settings')}
              </h3>
              <p className="text-xs text-slate-500">
                Supabase Backend & PostgreSQL Schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('cpanel')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cpanel'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>cPanel MySQL (নিজস্ব সার্ভার)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Supabase Cloud</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অ্যাডমিন রোল</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Status banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isCloudSynced
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${
                isCloudSynced ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              }`} />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {isCloudSynced ? 'ডেটাবেজ সক্রিয় ও সিঙ্ক হচ্ছে' : 'ডেটাবেজ সংযোগ বিচ্ছিন্ন'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isCpanelConfigured()
                    ? 'cPanel MySQL ব্যাকএন্ড সক্রিয় রয়েছে।'
                    : (configured ? 'Supabase ক্লাউড ডেটাবেজ সংযুক্ত।' : 'কোনো ডেটাবেজ সেট করা নেই।')}
                </p>
              </div>
            </div>

            <button
              onClick={() => refreshData()}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="টেস্ট কানেকশন"
            >
              <RefreshCw className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* TAB 1: cPanel MySQL */}
          {activeTab === 'cpanel' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveCpanel} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    cPanel API Endpoint URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={cpanelUrl}
                    onChange={(e) => setCpanelUrlState(e.target.value)}
                    placeholder="https://mymensingh.top/api অথবা https://yourdomain.com/api"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    আপনার cPanel-এ `public_html/api/` ফোল্ডার আপলোড করে সেই লিঙ্কটি এখানে বসান।
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    MySQL ফাইল: প্রজেক্টের `cpanel/database.sql`
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : null}
                    <span>{savedSuccess ? 'সংরক্ষিত হয়েছে!' : 'cPanel API সেভ করুন'}</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-2">
                <h5 className="font-bold flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>cPanel এ সেটআপ করার গাইড:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-indigo-900/90 leading-relaxed">
                  <li>cPanel ➔ <strong>MySQL Database Wizard</strong> এ গিয়ে ডাটাবেজ ও ইউজার তৈরি করুন।</li>
                  <li>cPanel ➔ <strong>phpMyAdmin</strong> ওপেন করে প্রজেক্টের <code>cpanel/database.sql</code> ফাইলটি <strong>Import</strong> করুন।</li>
                  <li>প্রজেক্টের <code>cpanel/api/config.php</code> ফাইলে আপনার ডাটাবেজের নাম, ইউজার ও পাসওয়ার্ড দিন।</li>
                  <li><code>cpanel/api/</code> ফোল্ডারটি আপনার cPanel এর <code>public_html/</code> এ আপলোড করুন।</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Supabase Cloud */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveSupabase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Anon Public Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="text"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Found in: Supabase Dashboard &gt; Project Settings &gt; API
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : null}
                    <span>{savedSuccess ? 'Saved & Synced!' : 'Save & Connect'}</span>
                  </button>
                </div>
              </form>

              {/* SQL Editor Migration Script */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Supabase SQL Migration Script
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Copy and run this in your Supabase SQL Editor.
                    </p>
                  </div>

                  <button
                    onClick={copySql}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800">
                  {sampleSql}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Admin Role Management */}
          {activeTab === 'admin' && (
            <AdminRoleManager />
          )}

        </div>

      </div>
    </div>
  );
};

const AdminRoleManager: React.FC = () => {
  const { adminEmails, addAdminEmail, removeAdminEmail } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [copiedRoleSql, setCopiedRoleSql] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    addAdminEmail(emailInput.trim());
    setFeedback(`"${emailInput.trim()}" কে অ্যাডমিন তালিকায় যুক্ত করা হয়েছে!`);
    setEmailInput('');
    setTimeout(() => setFeedback(''), 4000);
  };

  const adminRoleSql = `-- Supabase SQL Editor এ এই কমান্ডটি রান করুন:
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb 
WHERE email = '${emailInput.trim() || 'user@example.com'}';`;

  const copyRoleSql = () => {
    navigator.clipboard.writeText(adminRoleSql);
    setCopiedRoleSql(true);
    setTimeout(() => setCopiedRoleSql(false), 2500);
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            ইউজার আইডিকে অ্যাডমিন অনুমতি দিন (Assign Admin Role)
          </h4>
          <p className="text-[11px] text-slate-500">
            যেকোনো রেজিস্ট্রার্ড ইউজার ইমেইলকে সরাসরি অ্যাডমিন প্যানেলের ক্ষমতা দিন।
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* Add Email Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="email"
          required
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="ব্যবহারকারীর ইমেইল (যেমন: user@gmail.com)"
          className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>অ্যাডমিন বানান</span>
        </button>
      </form>

      {/* Supabase SQL quick copy */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700">
            বা Supabase SQL Editor এ স্থায়ীভাবে রোল দিতে:
          </span>
          <button
            type="button"
            onClick={copyRoleSql}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold cursor-pointer"
          >
            {copiedRoleSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedRoleSql ? 'কপি হয়েছে' : 'SQL কপি'}</span>
          </button>
        </div>
        <pre className="text-[10px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200 overflow-x-auto">
          {adminRoleSql}
        </pre>
      </div>

      {/* Active Admin List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 block">বর্তমান সক্রিয় অ্যাডমিন ইমেইল তালিকা:</span>
        <div className="flex flex-wrap gap-1.5">
          {adminEmails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-medium"
            >
              <span>{email}</span>
              {email !== 'admin@mymensingh.top' && (
                <button
                  type="button"
                  onClick={() => removeAdminEmail(email)}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="অ্যাডমিন থেকে সরান"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
