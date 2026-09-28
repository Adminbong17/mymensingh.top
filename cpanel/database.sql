-- ============================================================================
-- Mymensingh City Guide (Mymensingh.top) - MySQL Database Schema
-- Compatible with cPanel MySQL / MariaDB / phpMyAdmin
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+06:00";

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(191) DEFAULT '',
  `phone` VARCHAR(64) DEFAULT '',
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin account:
-- Email: admin@mymensingh.top | Password: admin123456 (Bcrypt hash)
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`) VALUES
('admin-user-01', 'admin@mymensingh.top', '$2y$10$wT2Hl9K7mIq.n4K9g5tB4ecvM9X3U.uB4aT3wW8c9oKzT4oZ8w9k6', 'City Guide Admin', '+880 1700-000000', 'admin')
ON DUPLICATE KEY UPDATE `role` = 'admin';

-- ----------------------------------------------------------------------------
-- 2. Table: categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `count` INT NOT NULL DEFAULT 0,
  `order_index` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial 20 Categories of Mymensingh
INSERT INTO `categories` (`id`, `name_en`, `name_bn`, `slug`, `icon`, `count`, `order_index`) VALUES
('cat-1', 'Restaurants', 'রেস্টুরেন্ট ও খাবার', 'restaurants', 'Utensils', 14, 1),
('cat-2', 'Hotels & Resorts', 'হোটেল ও রিসোর্ট', 'hotels', 'Hotel', 8, 2),
('cat-3', 'Hospitals', 'হাসপাতাল ও ক্লিনিক', 'hospitals', 'Hospital', 12, 3),
('cat-4', 'Pharmacy', 'ফার্মেসি ও ঔষধ', 'pharmacy', 'Pill', 18, 4),
('cat-5', 'Blood Bank', 'ব্লাড ব্যাংক', 'blood-bank', 'HeartPulse', 6, 5),
('cat-6', 'Tuition Media', 'টিউশন মিডিয়া', 'tuition-media', 'GraduationCap', 24, 6),
('cat-7', 'To Let', 'টু-লেট ও মেস ভাড়া', 'to-let', 'Home', 32, 7),
('cat-8', 'Shopping', 'শপিং ও মার্কেট', 'shopping', 'ShoppingBag', 16, 8),
('cat-9', 'Cafes & Fast Food', 'ক্যাফে ও ফাস্টফুড', 'cafes', 'Coffee', 10, 9),
('cat-10', 'Tourist Places', 'দর্শনীয় ও ঐতিহাসিক স্থান', 'tourist-places', 'Compass', 9, 10),
('cat-11', 'Education', 'শিক্ষা প্রতিষ্ঠান', 'education', 'BookOpen', 15, 11),
('cat-12', 'Transport', 'পরিবহন ও বাস স্ট্যান্ড', 'transport', 'Bus', 7, 12),
('cat-13', 'Mosques', 'মসজিদ ও উপাসনালয়', 'mosques', 'Building2', 11, 13),
('cat-14', 'Events', 'ইভেন্ট ও উৎসব', 'events', 'Calendar', 5, 14),
('cat-15', 'Offers', 'অফার ও ডিসকাউন্ট', 'offers', 'Tag', 6, 15),
('cat-16', 'News', 'তাজা সংবাদ', 'news', 'Newspaper', 8, 16),
('cat-17', 'Real Estate', 'রিয়েল এস্টেট ও জমি', 'real-estate', 'Building', 4, 17),
('cat-18', 'Jobs', 'চাকরি ও ক্যারিয়ার', 'jobs', 'Briefcase', 19, 18),
('cat-19', 'Services', 'জরুরি ও নাগরিক সেবা', 'services', 'Wrench', 14, 19),
('cat-20', 'More', 'অন্যান্য সেবা', 'more', 'MoreHorizontal', 5, 20)
ON DUPLICATE KEY UPDATE `name_bn` = VALUES(`name_bn`);

-- ----------------------------------------------------------------------------
-- 3. Table: businesses (places)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `businesses` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `name_en` VARCHAR(191) DEFAULT NULL,
  `name_bn` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `category_slug` VARCHAR(100) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `area` VARCHAR(191) DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `phone` VARCHAR(64) DEFAULT NULL,
  `rating` DECIMAL(3,1) DEFAULT 4.8,
  `review_count` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `tags` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_biz_category_slug` (`category_slug`),
  KEY `idx_biz_is_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: news
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) DEFAULT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'সাধারণ',
  `date` VARCHAR(100) DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `read_time` VARCHAR(50) DEFAULT '৩ মিনিট',
  `content` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `title_bn` VARCHAR(255) DEFAULT NULL,
  `date` VARCHAR(100) DEFAULT NULL,
  `time` VARCHAR(100) DEFAULT NULL,
  `venue` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'মেলা ও উৎসব',
  `image_url` TEXT DEFAULT NULL,
  `entry_fee` VARCHAR(100) DEFAULT 'ফ্রি',
  `description` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table: offers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `offers` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `discount` VARCHAR(100) DEFAULT 'বিশেষ ছাড়',
  `business_name` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'শপিং ও রেস্টুরেন্ট',
  `expiry_date` VARCHAR(100) DEFAULT NULL,
  `promo_code` VARCHAR(50) DEFAULT 'MYM20',
  `image_url` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table: blood_donors
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blood_donors` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `upazila` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `availability` ENUM('Available', 'Unavailable') NOT NULL DEFAULT 'Available',
  `last_donation` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blood_group` (`blood_group`),
  KEY `idx_donor_upazila` (`upazila`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Table: tuition_listings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tuition_listings` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `class_level` VARCHAR(100) DEFAULT NULL,
  `subjects` TEXT DEFAULT NULL,
  `location` VARCHAR(191) DEFAULT NULL,
  `salary` VARCHAR(100) DEFAULT NULL,
  `days_per_week` VARCHAR(50) DEFAULT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `posted_date` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Table: to_let_listings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `to_let_listings` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` ENUM('Family', 'Bachelor', 'Sublet', 'Commercial') NOT NULL DEFAULT 'Family',
  `rent` VARCHAR(100) DEFAULT NULL,
  `bedrooms` INT DEFAULT 1,
  `bathrooms` INT DEFAULT 1,
  `area` VARCHAR(191) DEFAULT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `image_url` TEXT DEFAULT NULL,
  `available_from` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Table: reviews
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(64) NOT NULL,
  `place_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_place_id` (`place_id`),
  KEY `idx_reviews_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Initial Sample Places for Mymensingh City
-- ----------------------------------------------------------------------------
INSERT INTO `businesses` (`id`, `name`, `name_en`, `name_bn`, `category`, `category_slug`, `location`, `area`, `image_url`, `phone`, `rating`, `review_count`, `is_featured`, `tags`) VALUES
('biz-1', 'শশী লজ (Shashi Lodge)', 'Shashi Lodge', 'শশী লজ (ময়মনসিংহ রাজবাড়ি)', 'Tourist Places', 'tourist-places', 'জুবিলী ঘাট রোড, ময়মনসিংহ', 'জুবিলী ঘাট', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', '+880 1711-000001', 4.9, 210, 1, '["ঐতিহাসিক", "পর্যটন", "জমিদার বাড়ি"]'),
('biz-2', 'ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল', 'Mymensingh Medical College Hospital (MMCH)', 'ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল', 'Hospitals', 'hospitals', 'চরপাড়া, ময়মনসিংহ', 'চরপাড়া', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80', '+880 1700-000002', 4.7, 430, 1, '["জরুরি চিকিৎসা", "সরকারি হাসপাতাল", "আইসিইউ"]'),
('biz-3', 'হোটেল মোস্তফা ইন্টারন্যাশনাল', 'Hotel Mustafiz International', 'হোটেল মোস্তফিজ ইন্টারন্যাশনাল', 'Hotels', 'hotels', 'গাঙ্গিনার পাড়, ময়মনসিংহ', 'গাঙ্গিনার পাড়', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', '+880 1711-223344', 4.6, 95, 1, '["থাকার হোটেল", "এসি রুম", "রেস্টুরেন্ট"]'),
('biz-4', 'সারেং ক্যাফে ও রেস্টুরেন্ট', 'Sareng Cafe & Restaurant', 'সারেং ক্যাফে ও রেস্টুরেন্ট', 'Restaurants', 'restaurants', 'টাউন হল মোড়, ময়মনসিংহ', 'টাউন হল', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', '+880 1712-334455', 4.8, 142, 1, '["বিরিয়ানি", "বাংলা খাবার", "কফি ও স্ন্যাক্স"]')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Initial News
INSERT INTO `news` (`id`, `title`, `title_en`, `excerpt`, `category`, `date`, `image_url`, `read_time`, `content`) VALUES
('news-1', 'ময়মনসিংহে ব্রহ্মপুত্র নদের তীরে আধুনিক ওয়াকওয়ে নির্মাণ কাজ শুরু', 'Brahmaputra River Walkway Project', 'শহরের জুবিলী ঘাট থেকে ব্রহ্মপুত্র নদ বরাবর দৃষ্টিনন্দন হাঁটার পথ ও বিনোদন পার্ক নির্মাণের উদ্যোগ নিয়েছে সিটি কর্পোরেশন।', 'উন্নয়ন ও অবকাঠামো', '২৮ সেপ্টেম্বর, ২০২৬', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80', '৩ মিনিট', 'ময়মনসিংহ সিটি কর্পোরেশনের উদ্যোগে ব্রহ্মপুত্র নদের তীর ঘেঁষে দৃষ্টিনন্দন ওয়াকওয়ে, সবুজ পার্কিং ও বিনোদন শেড নির্মাণের মেগা প্রকল্প শুরু হয়েছে। প্রকল্পটি সমাপ্ত হলে নগরবাসীর সান্ধ্যকালীন বিনোদন ও হাঁটার চমৎকার পরিবেশ সৃষ্টি হবে।')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Initial Event
INSERT INTO `events` (`id`, `title`, `title_bn`, `date`, `time`, `venue`, `category`, `image_url`, `entry_fee`, `description`) VALUES
('evt-1', 'ময়মনসিংহ শিল্প ও বাণিজ্য মেলা ২০২৬', 'ময়মনসিংহ শিল্প ও বাণিজ্য মেলা ২০২৬', '১৫ অক্টোবর - ১৫ নভেম্বর', 'প্রতিদিন সকাল ১০:০০ - রাত ৯:০০', 'সার্কিট হাউস মাঠ, ময়মনসিংহ', 'মেলা ও উৎসব', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', '৳২০', 'মাসব্যাপী জমকালো বাণিজ্য মেলা। দেশি-বিদেশি স্টল, শিশুদের রাইড এবং প্রতিদিন সন্ধ্যায় মনোজ্ঞ সাংস্কৃতিক অনুষ্ঠান।')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Initial Offer
INSERT INTO `offers` (`id`, `title`, `discount`, `business_name`, `category`, `expiry_date`, `promo_code`, `image_url`, `description`) VALUES
('off-1', 'উইকএন্ড ফ্যামিলি বুফে স্পেশাল ২০% ছাড়', '২০% ক্যাশব্যাক', 'সারেং রেস্টুরেন্ট', 'খাবার ও রেস্টুরেন্ট', '৩১ অক্টোবর পর্যন্ত', 'MYM20', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', '৪ জন বা ততোধিক সদস্যদের ফ্যামিলি বুফেতে সরাসরি ২০% মূল্যছাড়।')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
