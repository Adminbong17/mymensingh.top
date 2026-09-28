-- ====================================================================
-- MYMENSINGH.TOP - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- ====================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select or create your project.
-- 3. Open the "SQL Editor" on the left menu.
-- 4. Paste this script and click "Run".
-- ====================================================================

-- 1. CATEGORIES TABLE (20 Categories)
create table if not exists public.categories (
  id text primary key,
  name_en text not null,
  name_bn text not null,
  slug text not null unique,
  icon text not null,
  color text default 'emerald',
  order_index integer default 0,
  count integer default 20
);

-- 2. BUSINESSES TABLE (Directory Listings)
create table if not exists public.businesses (
  id text primary key,
  name text not null,
  name_bn text,
  category text not null,
  category_id text,
  category_slug text not null,
  rating numeric(3, 2) default 4.80,
  review_count integer default 0,
  location text not null,
  area text,
  district text default 'ময়মনসিংহ',
  upazila text default 'ময়মনসিংহ সদর',
  union_ward text,
  phone text not null,
  website text,
  image_url text not null,
  gallery_images text[] default '{}',
  description text,
  opening_hours text,
  price_range text,
  is_featured boolean default false,
  latitude numeric(10, 6) default 24.755,
  longitude numeric(10, 6) default 90.403,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. LATEST NEWS TABLE
create table if not exists public.news (
  id text primary key,
  title text not null,
  title_en text,
  excerpt text not null,
  category text not null,
  date text not null,
  image_url text not null,
  read_time text default '৩ মিনিট পাঠ',
  content text not null,
  created_at timestamptz default now()
);

-- 4. UPCOMING EVENTS TABLE
create table if not exists public.events (
  id text primary key,
  title text not null,
  title_bn text not null,
  date text not null,
  time text not null,
  venue text not null,
  category text not null,
  image_url text not null,
  entry_fee text default 'Free / উন্মুক্ত',
  description text not null,
  created_at timestamptz default now()
);

-- 5. LATEST OFFERS TABLE
create table if not exists public.offers (
  id text primary key,
  title text not null,
  discount text not null,
  business_name text not null,
  category text not null,
  expiry_date text not null,
  promo_code text not null,
  image_url text not null,
  description text not null,
  created_at timestamptz default now()
);

-- 6. SPECIAL SERVICES: BLOOD BANK TABLE
create table if not exists public.blood_donors (
  id text primary key,
  name text not null,
  blood_group text not null check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  upazila text not null,
  phone text not null,
  availability text default 'Available',
  last_donation text,
  created_at timestamptz default now()
);

-- 7. SPECIAL SERVICES: TUITION MEDIA TABLE
create table if not exists public.tuition_listings (
  id text primary key,
  title text not null,
  class_level text not null,
  subjects text[] default '{}',
  location text not null,
  salary text not null,
  days_per_week text not null,
  phone text not null,
  posted_date text default 'আজ',
  created_at timestamptz default now()
);

-- 8. SPECIAL SERVICES: TO-LET TABLE
create table if not exists public.to_let_listings (
  id text primary key,
  title text not null,
  type text not null check (type in ('Family', 'Bachelor', 'Sublet', 'Commercial')),
  rent text not null,
  bedrooms integer default 1,
  bathrooms integer default 1,
  area text not null,
  phone text not null,
  image_url text not null,
  available_from text,
  created_at timestamptz default now()
);

-- 9. REVIEWS TABLE
create table if not exists public.reviews (
  id text primary key,
  place_id text not null,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.offers enable row level security;
alter table public.blood_donors enable row level security;
alter table public.tuition_listings enable row level security;
alter table public.to_let_listings enable row level security;
alter table public.reviews enable row level security;

-- Public read policies
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read businesses" on public.businesses for select using (true);
create policy "Allow public read news" on public.news for select using (true);
create policy "Allow public read events" on public.events for select using (true);
create policy "Allow public read offers" on public.offers for select using (true);
create policy "Allow public read blood donors" on public.blood_donors for select using (true);
create policy "Allow public read tuitions" on public.tuition_listings for select using (true);
create policy "Allow public read to-let" on public.to_let_listings for select using (true);
create policy "Allow public read reviews" on public.reviews for select using (status = 'approved');

-- Public insert policies (e.g. users listing businesses, submitting reviews)
create policy "Allow public insert business" on public.businesses for insert with check (true);
create policy "Allow public insert reviews" on public.reviews for insert with check (true);
create policy "Allow public insert blood donor" on public.blood_donors for insert with check (true);
create policy "Allow public insert tuition" on public.tuition_listings for insert with check (true);
create policy "Allow public insert to-let" on public.to_let_listings for insert with check (true);

-- Admin modification policies
create policy "Allow full business modify" on public.businesses for all using (true);
create policy "Allow full review modify" on public.reviews for all using (true);
create policy "Allow full news modify" on public.news for all using (true);
create policy "Allow full events modify" on public.events for all using (true);
create policy "Allow full offers modify" on public.offers for all using (true);

-- ====================================================================
-- SEED DATA (MYMENSINGH.TOP INITIAL RECORDS)
-- ====================================================================

-- 20 Categories
insert into public.categories (id, name_en, name_bn, slug, icon, color, order_index, count)
values
  ('cat-1', 'Restaurants', 'রেস্টুরেন্ট', 'restaurants', 'Utensils', 'rose', 1, 48),
  ('cat-2', 'Hotels', 'হোটেল', 'hotels', 'Hotel', 'indigo', 2, 24),
  ('cat-3', 'Hospitals', 'হাসপাতাল', 'hospitals', 'Hospital', 'red', 3, 32),
  ('cat-4', 'Pharmacy', 'ফার্মেসি', 'pharmacy', 'Pill', 'emerald', 4, 65),
  ('cat-5', 'Blood Bank', 'ব্লাড ব্যাংক', 'blood-bank', 'Droplets', 'red', 5, 18),
  ('cat-6', 'Tuition Media', 'টিউশন মিডিয়া', 'tuition-media', 'GraduationCap', 'purple', 6, 112),
  ('cat-7', 'To Let', 'বাসা ভাড়া / টু-লেট', 'to-let', 'Home', 'amber', 7, 76),
  ('cat-8', 'Shopping', 'শপিং ও মার্কেট', 'shopping', 'ShoppingBag', 'blue', 8, 54),
  ('cat-9', 'Cafes', 'ক্যাফে ও কফি শপ', 'cafes', 'Coffee', 'amber', 9, 29),
  ('cat-10', 'Tourist Places', 'দর্শনীয় স্থান', 'tourist-places', 'Landmark', 'emerald', 10, 22),
  ('cat-11', 'Education', 'শিক্ষা প্রতিষ্ঠান', 'education', 'BookOpen', 'sky', 11, 45),
  ('cat-12', 'Transport', 'পরিবহন ও যাতায়াত', 'transport', 'Train', 'cyan', 12, 38),
  ('cat-13', 'Mosques', 'মসজিদ ও ধর্মীয় স্থান', 'mosques', 'Moon', 'teal', 13, 85),
  ('cat-14', 'Events', 'ইভেন্ট ও উৎসব', 'events', 'Calendar', 'orange', 14, 15),
  ('cat-15', 'Offers', 'অফার ও ডিসকাউন্ট', 'offers', 'Tag', 'pink', 15, 28),
  ('cat-16', 'News', 'সংবাদ ও বুলেটিন', 'news', 'Newspaper', 'slate', 16, 90),
  ('cat-17', 'Real Estate', 'রিয়েল এস্টেট ও জমি', 'real-estate', 'Building2', 'violet', 17, 34),
  ('cat-18', 'Jobs', 'চাকরি ও ক্যারিয়ার', 'jobs', 'Briefcase', 'blue', 18, 42),
  ('cat-19', 'Services', 'পেশাদার সার্ভিস', 'services', 'Wrench', 'yellow', 19, 68),
  ('cat-20', 'More', 'আরও সেবা', 'more', 'Grid', 'gray', 20, 150)
on conflict (id) do nothing;

-- 6 Featured Businesses
insert into public.businesses (
  id, name, name_bn, category, category_slug, rating, review_count, location, upazila, union_ward, phone, image_url, description, is_featured, latitude, longitude
) values
(
  'biz-1', 'The River View Restaurant', 'দ্য রিভার ভিউ রেস্টুরেন্ট', 'Restaurants', 'restaurants', 4.80, 142,
  'Park Road, Old Brahmaputra Riverfront, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 08', '+880 1711-234567',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'Premier riverfront dining in Mymensingh offering traditional Bangladeshi river fish delicacies, Chinese cuisine, and scenic sunset views.', true, 24.7645, 90.3956
),
(
  'biz-2', 'Hotel Brahmaputra', 'হোটেল ব্রহ্মপুত্র', 'Hotels', 'hotels', 4.70, 98,
  'Court Road, Town Hall Area, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 03', '+880 1712-345678',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'Modern luxury boutique hotel offering high-speed Wi-Fi, executive suites, conference facilities, and 24/7 room service.', true, 24.7570, 90.4040
),
(
  'biz-3', 'Community Hospital', 'কমিউনিটি হাসপাতাল ময়মনসিংহ', 'Hospitals', 'hospitals', 4.90, 215,
  'Charpara Medical Road, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 12', '+880 1713-456789',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'Advanced multi-specialty hospital with 24/7 emergency trauma wing, ICU, modern pathology lab, and renowned specialist physicians.', true, 24.7348, 90.4135
),
(
  'biz-4', 'Sheikh Pharma', 'শেখ ফার্মা ও সার্জিক্যাল', 'Pharmacy', 'pharmacy', 4.90, 87,
  'Station Road, Ganginar Par, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 05', '+880 1714-567890',
  'https://images.unsplash.com/photo-1586015555751-63c2c1615a6b?auto=format&fit=crop&w=1200&q=80',
  '100% authentic medicine retailer with temperature-controlled storage, baby foods, surgical items, and fast home delivery.', true, 24.7532, 90.4060
),
(
  'biz-5', 'Cafe Arong', 'ক্যাফে আড়ং', 'Cafes', 'cafes', 4.60, 175,
  'Town Hall Moar, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 04', '+880 1715-678901',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  'Cozy boutique coffee shop popular for artisanal espresso drinks, gourmet waffles, burgers, and acoustic musical evenings.', true, 24.7562, 90.4048
),
(
  'biz-6', 'Arab Paradise Market', 'আরব প্যারাডাইস মার্কেট', 'Shopping', 'shopping', 4.70, 130,
  'Chotto Bazar, Commercial Area, Mymensingh Sadar', 'ময়মনসিংহ সদর', 'City Ward 02', '+880 1716-789012',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
  'Multi-level modern retail paradise featuring international fashion brand outlets, traditional sarees, and electronics.', true, 24.7580, 90.4020
)
on conflict (id) do nothing;
