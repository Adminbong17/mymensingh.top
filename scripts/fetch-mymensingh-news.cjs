/**
 * Mymensingh.top - Unified 10 Media Outlets News Aggregator (.cjs)
 * 
 * Aggregates fresh, authentic news ONLY from Bangladesh's TOP 10 Media Outlets:
 * 1. প্রথম আলো (Prothom Alo - prothomalo.com)
 * 2. দ্য ডেইলি স্টার (The Daily Star - bangla.thedailystar.net & thedailystar.net)
 * 3. বিডিনিউজ টোয়েন্টিফোর (bdnews24.com - bangla.bdnews24.com)
 * 4. বাংলা ট্রিবিউন (Bangla Tribune - banglatribune.com)
 * 5. ঢাকা পোস্ট (Dhaka Post - dhakapost.com)
 * 6. জাগোনিউজ২৪ (Jagonews24.com - jagonews24.com)
 * 7. রাইজিংবিডি (Risingbd.com - risingbd.com)
 * 8. বাংলাদেশ প্রতিদিন (Bangladesh Pratidin - bd-pratidin.com)
 * 9. কালের কণ্ঠ (Kaler Kantho - kalerkantho.com)
 * 10. বাংলানিউজ২৪ (Banglanews24.com - banglanews24.com)
 * 
 * Categories (User Specified):
 * 1. ময়মনসিংহ (Mymensingh local news & divisional updates)
 * 2. বাংলাদেশ (National news, governance, political affairs)
 * 3. আন্তর্জাতিক (World news, Middle East, USA, Europe, global events)
 * 4. খেলাধুলা (Cricket, football, sports tournaments)
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration with robust empty-string handling
const getCleanEnv = (key) => (process.env[key] && process.env[key].trim().length > 0 ? process.env[key].trim() : null);

const SUPABASE_URL = getCleanEnv('SUPABASE_URL') || getCleanEnv('VITE_SUPABASE_URL') || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = getCleanEnv('SUPABASE_SERVICE_ROLE_KEY') || getCleanEnv('SUPABASE_KEY') || getCleanEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_THEME_IMAGE = '/images/news-placeholder.svg';
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days maximum

// Generic HTTP GET with redirect handling and timeout safety
function fetchUrl(url, headers = {}, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'bn-BD,bn;q=0.9,en-US;q=0.8',
        ...headers
      },
      timeout: timeoutMs
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const origin = new URL(url).origin;
          redirectUrl = new URL(redirectUrl, origin).href;
        }
        return fetchUrl(redirectUrl, headers, timeoutMs).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

// Scrapes the real multi-paragraph article body from portal web page
async function fetchFullArticleBody(url) {
  if (!url || !url.startsWith('http')) return null;
  // Never attempt to scrape video, tube, gallery, or photo stories for article text
  if (/\/(tube|video|videos|gallery|photo|photos)\//i.test(url)) return null;

  try {
    const html = await fetchUrl(url, {}, 6000);
    // Strip scripts, styles, headers, footers, navs, aside, widgets
    const cleanDoc = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, ' ');

    const isJunkText = (text) => {
      return (
        text.length < 35 ||
        text.includes('কপিরাইট') ||
        text.includes('সর্বস্বত্ব') ||
        text.includes('Google News') ||
        text.includes('বিজ্ঞাপন') ||
        text.includes('app_installed') ||
        text.includes('ফেসবুক পেজে') ||
        text.includes('Powered by') ||
        text.includes('RSI Lab') ||
        text.includes('thedailystar.net') ||
        text.includes('বিডিনিউজ টোয়েন্টিফোর ডটকম নিউজ সার্ভিস') ||
        text.includes('রাজনৈতিক অস্থিরতার') ||
        text.includes('নারী ক্রিকেটের সংস্কার') ||
        text.includes('হকার উচ্ছেদ') ||
        text.includes('ভাতের নাকি অনুভূতির') ||
        text.includes('আরও পড়ুন') ||
        text.includes('মতামত') ||
        text.includes('Copyright') ||
        text.includes('All rights reserved') ||
        text.startsWith('{') ||
        text.includes('@context')
      );
    };

    const pMatches = [...cleanDoc.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const validParas = [];
    for (const m of pMatches) {
      const p = cleanHtml(m[1]);
      if (!isJunkText(p)) {
        validParas.push(p);
      }
    }
    if (validParas.length >= 2) {
      return validParas.slice(0, 15).join('\n\n');
    }
  } catch {}
  return null;
}

// Clean HTML tags and decode entities
function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/<a[\s\S]*?<\/a>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\uFFFD+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize Bengali punctuation
function normalizePunctuation(str) {
  if (!str) return '';
  return str
    .replace(/\s*\|\s*[\s\S]*$/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s*[\u2013\u2014]\s*/g, ' - ')
    .replace(/\s+([,:;?!।])/g, '$1')
    .replace(/\uFFFD+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert numbers to Bengali digits
function toBengaliNumber(num) {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => digits[d]);
}

// Format date to Bengali readable string
function formatBengaliDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'আজ';
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const day = toBengaliNumber(d.getDate());
  const month = months[d.getMonth()];
  const year = toBengaliNumber(d.getFullYear());
  return `${day} ${month}, ${year}`;
}

// Parse Bing News RSS items
function parseBingRss(xml, defaultSource = '') {
  const items = [];
  const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const m of matches) {
    const itemXml = m[1];
    const rawTitle = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
    const cleanTitle = cleanHtml(rawTitle).replace(/\s*-\s*[^|\n]+$/, '').trim();
    if (!cleanTitle || cleanTitle.length < 12 || /^Add\b.*on Google/i.test(cleanTitle) || cleanTitle.includes('Google News')) continue;

    const linkMatch = itemXml.match(/url=([^&"'>\s]+)/)?.[1] || itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
    const directUrl = linkMatch ? decodeURIComponent(linkMatch) : '';
    if (!directUrl || !directUrl.startsWith('http')) continue;

    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
    if (pubDate && (Date.now() - new Date(pubDate).getTime()) > MAX_AGE_MS) continue;

    const img = itemXml.match(/<News:Image>([\s\S]*?)<\/News:Image>/)?.[1] || null;
    const desc = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');

    items.push({
      title: cleanTitle,
      url: directUrl,
      pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      sourceName: defaultSource,
      imageUrl: img,
      excerpt: desc || cleanTitle,
      body: desc || cleanTitle
    });
  }
  return items;
}

// Classify news into the 4 target categories with precision
function classifyCategory(title = '', excerpt = '', url = '', rawCategory = '') {
  const normText = `${title} ${excerpt} ${url} ${rawCategory}`.toLowerCase().replace(/\u09AF\u09BC/g, '\u09DF');

  // 1. Mymensingh Division News (All 4 Districts: ময়মনসিংহ, জামালপুর, শেরপুর, নেত্রকোণা)
  const mymensinghKeywords = [
    // Districts
    'ময়মনসিংহ', 'ময়মনসিংহ', 'mymensingh',
    'জামালপুর', 'jamalpur',
    'শেরপুর', 'sherpur',
    'নেত্রকোণা', 'নেত্রকোনা', 'netrokona', 'netrakona',
    // Mymensingh District Upazilas & Places
    'গফরগাঁও', 'ত্রিশাল', 'ভালুকা', 'মুক্তাগাছা', 'ফুলবাড়িয়া', 'ফুলবাড়িয়া',
    'ফুলপুর', 'হালুয়াঘাট', 'হালুয়াঘাট', 'ধোবাউড়া', 'ধোবাউড়া', 'তারাকান্দা',
    'ঈশ্বরগঞ্জ', 'নান্দাইল', 'গৌরীপুর', 'চরপাড়া', 'গাঙ্গিনারপাড়', 'গাঙ্গিনারপাড়',
    'পাটগুদাম', 'শম্ভুগঞ্জ', 'বড়বাজার', 'বড়বাজার',
    // Jamalpur District Upazilas & Places
    'মেলান্দহ', 'মাদারগঞ্জ', 'ইসলামপুর', 'সরিষাবাড়ী', 'সরিষাবাড়ী',
    'দেওয়ানগঞ্জ', 'দেওয়ানগঞ্জ', 'বকশীগঞ্জ', 'বকশিগঞ্জ', 'বাহাদুরাবাদ',
    'যমুনা সার কারখানা',
    // Sherpur District Upazilas & Places
    'নালিতাবাড়ী', 'নালিতাবাড়ী', 'নকলা', 'শ্রীবরদী', 'ঝিনাইগাতী',
    'মধুটিলা', 'গজনী অবকাশ',
    // Netrokona District Upazilas & Places
    'দুর্গাপুর', 'সুসং দুর্গাপুর', 'বিরিশিরি', 'কলমাকান্দা', 'পূর্বধলা',
    'বারহাট্টা', 'মোহনগঞ্জ', 'আটপাড়া', 'আটপাড়া', 'কেন্দুয়া', 'মদন',
    'খালিয়াজুড়ি', 'খালিয়াজুরী', 'সোমেশ্বরী', 'বিজয়পুর', 'বিজয়পুর',
    // Key Divisional Landmarks & Institutions
    'ব্রহ্মপুত্র', 'আনন্দ মোহন', 'বাকৃবি', 'কৃষি বিশ্ববিদ্যালয়', 'কৃষি বিশ্ববিদ্যালয়',
    'ময়মনসিংহ বিভাগ', 'ময়মনসিংহ বিভাগ'
  ];

  // If title explicitly targets another division and has no Mymensingh Division term in title, treat as national
  const otherDivisions = ['চট্টগ্রাম', 'সিলেট', 'খুলনা', 'রাজশাহী', 'রংপুর', 'বরিশাল', 'কক্সবাজার'];
  const titleHasOther = otherDivisions.some(d => title.includes(d));
  const titleHasMymensingh = mymensinghKeywords.some(kw => title.toLowerCase().includes(kw));

  if (!titleHasOther || titleHasMymensingh) {
    if (mymensinghKeywords.some(kw => normText.includes(kw))) {
      return 'ময়মনসিংহ';
    }
  }

  // 2. Sports News (explicit sports terms, exclude 'আইসিসিবি' and innocent verbs like 'খেলতে গিয়ে')
  const isSportsUrl = /\/(sports|sport|cricket|football)\//i.test(url);
  const sportsKeywords = [
    'খেলাধুলা', 'ক্রিকেট', 'ফুটবল', 'বিশ্বকাপ', 'মেসি', 'রোনালদো',
    'সাকিব আল হাসান', 'তামিম ইকবাল', 'বিপিএল', 'আইপিএল', 'উইকেট', 'চ্যাম্পিয়ন',
    'লা লিগা', 'প্রিমিয়ার লিগ', 'ব্যাটসম্যান', 'বোলার', 'অলরাউন্ডার',
    'আনচেলত্তি', 'ভিনিসিউস', 'এমবাপ্পে', 'নেইমার', 'ইয়ামাল', 'ইয়ামাল',
    'ম্যানসিটি', 'ম্যান সিটি', 'বার্সেলোনা', 'রিয়াল মাদ্রিদ', 'রিয়াল',
    'আর্সেনাল', 'লিভারপুল', 'চেলসি', 'বায়ার্ন', 'জুভেন্টাস', 'পিএসজি',
    'উয়েফা', 'ব্যালন ডি', 'বিসিবি', 'বাফুফে', 'স্টেডিয়াম', 'টেস্ট ম্যাচ',
    'ওয়ানডে', 'টি-টোয়েন্টি', 'খেলার মাঠ', 'খেলার খবর', 'ক্রিকেট খেলা',
    'ফুটবল খেলা', 'আজকের খেলা'
  ];
  const hasIcc = normText.includes('আইসিসি') && !normText.includes('আইসিসিবি');
  const hasSportsWord = sportsKeywords.some(kw => normText.includes(kw)) ||
                        hasIcc ||
                        normText.includes('ফিফা') ||
                        /(^|\s)(ক্রিকেট|ফুটবল|মেসি|রোনালদো|গোলপোস্ট|সেমিফাইনাল|ফাইনাল ম্যাচ|টেস্ট সিরিজ)(\s|$)/.test(normText) ||
                        /(^|\s)গোল(ে|ের|টি|এ|\s|$)/.test(normText);

  if (isSportsUrl || hasSportsWord || rawCategory === 'খেলা' || rawCategory === 'খেলাধুলা' || rawCategory === 'sport' || rawCategory === 'sports') {
    return 'খেলাধুলা';
  }

  // 3. International News (exclude 'বিশ্ববিদ্যালয়' from 'বিশ্ব')
  const isIntlUrl = /\/(world|international|probash)\//i.test(url);
  const intlKeywords = [
    'আন্তর্জাতিক', 'বহির্বিশ্ব', 'আমেরিকা', 'যুক্তরাষ্ট্র', 'রাশিয়া', 'রাশিয়া',
    'ইউক্রেন', 'ইসরায়েল', 'ইসরায়েল', 'ফিলিস্তিন', 'গাজা', 'চীন', 'ভারত',
    'মধ্যপ্রাচ্য', 'ইরান', 'লেবানন', 'ট্রাম্প', 'বাইডেন', 'পুতিন', 'নেতানিয়াহু',
    'জাতিসংঘ', 'ইউরোপ', 'পাকিস্তান', 'সৌদি', 'আমিরাত', 'দুবাই', 'কাতার',
    'যুক্তরাজ্য', 'ব্রিটেন', 'লন্ডন', 'হোয়াইট হাউস', 'যুদ্ধবিরতি', 'মরক্কো',
    'মিশর', 'তুরস্ক', 'জাপান', 'জার্মানি', 'ফ্রান্স', 'কানাডা', 'অস্ট্রেলিয়া',
    'অস্ট্রেলিয়া', 'ইতালি', 'স্পেন', 'মালয়েশিয়া', 'মালয়েশিয়া', 'সিঙ্গাপুর',
    'ইন্দোনেশিয়া', 'আফগানিস্তান', 'প্রবাসী', 'প্রবাস'
  ];
  const hasIntlWord = intlKeywords.some(kw => normText.includes(kw)) ||
                      (/(^|\s)(বিশ্ব|বিশ্বের|বিশ্বজুড়ে|সারা বিশ্ব)(\s|$)/.test(normText) && !normText.includes('বিশ্ববিদ্যাল'));

  if (isIntlUrl || hasIntlWord || rawCategory === 'আন্তর্জাতিক' || rawCategory === 'বিশ্ব') {
    return 'আন্তর্জাতিক';
  }

  // 4. Default: বাংলাদেশ
  return 'বাংলাদেশ';
}

// ----------------------------------------------------------------------------
// 1. প্রথম আলো (Prothom Alo - Direct API with Full Article Elements)
// ----------------------------------------------------------------------------
async function fetchProthomAloNews() {
  const items = [];
  const queries = [
    { q: 'ময়মনসিংহ', cat: 'ময়মনসিংহ' },
    { q: 'জামালপুর', cat: 'ময়মনসিংহ' },
    { q: 'শেরপুর', cat: 'ময়মনসিংহ' },
    { q: 'নেত্রকোণা', cat: 'ময়মনসিংহ' },
    { q: 'বাংলাদেশ', cat: 'বাংলাদেশ' },
    { q: 'আন্তর্জাতিক', cat: 'আন্তর্জাতিক' },
    { q: 'খেলাধুলা', cat: 'খেলাধুলা' }
  ];

  for (const { q, cat } of queries) {
    try {
      const url = `https://www.prothomalo.com/api/v1/advanced-search?q=${encodeURIComponent(q)}&sort=published-at&limit=4`;
      const json = await fetchUrl(url);
      const data = JSON.parse(json);

      for (const it of data.items || []) {
        if (!it.headline || !it.url || it.url.includes('/video/')) continue;
        const pubTime = it['published-at'] ? new Date(it['published-at']).getTime() : Date.now();
        if (Date.now() - pubTime > MAX_AGE_MS) continue;

        let paragraphs = [];
        if (it.cards && Array.isArray(it.cards)) {
          for (const c of it.cards) {
            for (const el of c['story-elements'] || []) {
              if (el.type === 'text' && el.text) {
                const pMatches = [...el.text.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
                for (const pm of pMatches) {
                  const cleaned = cleanHtml(pm[1]);
                  if (cleaned.length > 25) paragraphs.push(cleaned);
                }
              }
            }
          }
        }

        const img = it['hero-image-s3-key'] ? `https://images.prothomalo.com/${it['hero-image-s3-key']}` : null;
        const summary = cleanHtml(it.summary);
        const excerpt = summary || paragraphs[0] || cleanHtml(it.headline);
        const body = paragraphs.length > 0 ? paragraphs.join('\n\n') : excerpt;

        items.push({
          title: cleanHtml(it.headline),
          url: it.url,
          pubDate: it['published-at'] || new Date().toISOString(),
          sourceName: 'প্রথম আলো',
          category: cat,
          imageUrl: img || DEFAULT_THEME_IMAGE,
          excerpt,
          body
        });
      }
    } catch (e) {
      console.warn('Prothom Alo error:', e.message);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 2. দ্য ডেইলি স্টার (The Daily Star - Bangla RSS & Bing Feed)
// ----------------------------------------------------------------------------
async function fetchDailyStarNews() {
  const items = [];
  try {
    const xml = await fetchUrl('https://bangla.thedailystar.net/rss.xml');
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const itemXml = m[1];
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      if (!link) continue;

      const desc = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
      const titleMatch = desc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const title = cleanHtml(titleMatch ? titleMatch[1] : '');
      if (!title) continue;

      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      const pMatches = [...desc.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(p => cleanHtml(p[1])).filter(t => t.length > 20);

      items.push({
        title,
        url: link,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        sourceName: 'দ্য ডেইলি স্টার',
        category: classifyCategory(title, pMatches.join(' '), link),
        imageUrl: DEFAULT_THEME_IMAGE,
        excerpt: pMatches[0] || title,
        body: pMatches.join('\n\n') || title
      });
    }
  } catch (e) {}

  const dailyStarQueries = [
    'site:bangla.thedailystar.net',
    'site:bangla.thedailystar.net ময়মনসিংহ',
    'site:bangla.thedailystar.net জামালপুর',
    'site:bangla.thedailystar.net শেরপুর',
    'site:bangla.thedailystar.net নেত্রকোণা'
  ];
  for (const q of dailyStarQueries) {
    try {
      const bingXml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
      const bingItems = parseBingRss(bingXml, 'দ্য ডেইলি স্টার');
      for (const it of bingItems) {
        it.category = classifyCategory(it.title, it.excerpt, it.url, 'দ্য ডেইলি স্টার');
        items.push(it);
      }
    } catch (e) {}
  }

  return items;
}

// ----------------------------------------------------------------------------
// 3. বিডিনিউজ টোয়েন্টিফোর (bdnews24.com - Direct Official API)
// ----------------------------------------------------------------------------
async function fetchBdnews24News() {
  const items = [];
  try {
    const json = await fetchUrl('https://bangla.bdnews24.com/api/v1/stories?limit=15');
    const data = JSON.parse(json);

    for (const story of data.stories || []) {
      if (!story.headline || !story.url) continue;

      const pubTime = story['published-at'] ? new Date(story['published-at']).getTime() : Date.now();
      if (Date.now() - pubTime > MAX_AGE_MS) continue;

      const img = story['hero-image-s3-key'] ? `https://images.assettype.com/${story['hero-image-s3-key']}` : DEFAULT_THEME_IMAGE;
      const sectionName = story.sections?.[0]?.name || '';
      const title = cleanHtml(story.headline);
      const excerpt = cleanHtml(story.subheadline) || title;
      const category = classifyCategory(title, excerpt, story.url, sectionName);

      // Extract full multi-paragraph article body if slug available (and NOT a tube/video story)
      let body = excerpt;
      const isVideoStory = story.url && /\/(tube|video|videos)\//i.test(story.url);
      if (story.slug && !isVideoStory) {
        try {
          const detailRaw = await fetchUrl(`https://bangla.bdnews24.com/api/v1/stories-by-slug?slug=${encodeURIComponent(story.slug)}`, {}, 4000);
          const detailJson = JSON.parse(detailRaw);
          const paras = (detailJson.story?.cards || [])
            .flatMap(c => (c['story-elements'] || []).filter(e => e.type === 'text').map(e => cleanHtml(e.text)))
            .filter(t => t.length > 30 && !t.includes('রাজনৈতিক অস্থিরতার') && !t.includes('নারী ক্রিকেটের') && !t.includes('হকার উচ্ছেদ') && !t.includes('বিডিনিউজ টোয়েন্টিফোর'));
          if (paras.length > 0) {
            body = paras.join('\n\n');
          }
        } catch {}
      }

      items.push({
        title,
        url: story.url,
        pubDate: story['published-at'] || new Date().toISOString(),
        sourceName: 'বিডিনিউজ টোয়েন্টিফোর',
        category,
        imageUrl: img,
        excerpt,
        body
      });
    }
  } catch (e) {
    console.warn('bdnews24 error:', e.message);
  }
  return items;
}

// ----------------------------------------------------------------------------
// 4. বাংলা ট্রিবিউন (Bangla Tribune - Direct RSS)
// ----------------------------------------------------------------------------
async function fetchBanglaTribuneNews() {
  const items = [];
  try {
    const xml = await fetchUrl('https://www.banglatribune.com/feed/');
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      if (items.length >= 12) break;
      const itemXml = m[1];
      const title = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      if (!title || !link) continue;

      const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
      const desc = cleanHtml(descMatch);
      const catMatch = itemXml.match(/<category>([\s\S]*?)<\/category>/)?.[1] || '';

      items.push({
        title,
        url: link,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        sourceName: 'বাংলা ট্রিবিউন',
        category: classifyCategory(title, desc, link, cleanHtml(catMatch)),
        imageUrl: imgMatch ? imgMatch[1] : DEFAULT_THEME_IMAGE,
        excerpt: desc || title,
        body: desc || title
      });
    }
  } catch (e) {
    console.warn('Bangla Tribune error:', e.message);
  }
  return items;
}

// ----------------------------------------------------------------------------
// 5. ঢাকা পোস্ট (Dhaka Post)
// ----------------------------------------------------------------------------
async function fetchDhakaPostNews() {
  const items = [];
  const queries = [
    'site:dhakapost.com',
    'site:dhakapost.com ময়মনসিংহ',
    'site:dhakapost.com জামালপুর',
    'site:dhakapost.com শেরপুর',
    'site:dhakapost.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'ঢাকা পোস্ট');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'ঢাকা পোস্ট');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 6. জাগোনিউজ২৪ (Jagonews24.com)
// ----------------------------------------------------------------------------
async function fetchJagonewsNews() {
  const items = [];
  const queries = [
    'site:jagonews24.com',
    'site:jagonews24.com ময়মনসিংহ',
    'site:jagonews24.com জামালপুর',
    'site:jagonews24.com শেরপুর',
    'site:jagonews24.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'জাগোনিউজ২৪');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'জাগোনিউজ২৪');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 7. রাইজিংবিডি (Risingbd.com)
// ----------------------------------------------------------------------------
async function fetchRisingbdNews() {
  const items = [];
  const queries = [
    'site:risingbd.com',
    'site:risingbd.com ময়মনসিংহ',
    'site:risingbd.com জামালপুর',
    'site:risingbd.com শেরপুর',
    'site:risingbd.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'রাইজিংবিডি');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'রাইজিংবিডি');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 8. বাংলাদেশ প্রতিদিন (Bangladesh Pratidin)
// ----------------------------------------------------------------------------
async function fetchBdPratidinNews() {
  const items = [];
  const queries = [
    'site:bd-pratidin.com',
    'site:bd-pratidin.com ময়মনসিংহ',
    'site:bd-pratidin.com জামালপুর',
    'site:bd-pratidin.com শেরপুর',
    'site:bd-pratidin.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'বাংলাদেশ প্রতিদিন');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'বাংলাদেশ প্রতিদিন');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 9. কালের কণ্ঠ (Kaler Kantho)
// ----------------------------------------------------------------------------
async function fetchKalerKanthoNews() {
  const items = [];
  const queries = [
    '"কালের কণ্ঠ"',
    'site:kalerkantho.com ময়মনসিংহ',
    'site:kalerkantho.com জামালপুর',
    'site:kalerkantho.com শেরপুর',
    'site:kalerkantho.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'কালের কণ্ঠ');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'কালের কণ্ঠ');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// 10. বাংলানিউজ২৪ (Banglanews24.com)
// ----------------------------------------------------------------------------
async function fetchBanglanewsNews() {
  const items = [];
  const queries = [
    '"বাংলানিউজ"',
    'site:banglanews24.com ময়মনসিংহ',
    'site:banglanews24.com জামালপুর',
    'site:banglanews24.com শেরপুর',
    'site:banglanews24.com নেত্রকোণা'
  ];
  for (const q of queries) {
    const xml = await fetchUrl(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss`).catch(() => '');
    const parsed = parseBingRss(xml, 'বাংলানিউজ২৪');
    for (const it of parsed) {
      it.category = classifyCategory(it.title, it.excerpt, it.url, 'বাংলানিউজ২৪');
      items.push(it);
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// MAIN EXECUTION
// ----------------------------------------------------------------------------
async function run() {
  console.log('=== Starting Mymensingh.top TOP 10 News Media Ingestion ===\n');

  console.log('Targeting the 10 media outlets:');
  console.log('1. প্রথম আলো (Prothom Alo)');
  console.log('2. দ্য ডেইলি স্টার (The Daily Star)');
  console.log('3. বিডিনিউজ টোয়েন্টিফোর (bdnews24.com)');
  console.log('4. বাংলা ট্রিবিউন (Bangla Tribune)');
  console.log('5. ঢাকা পোস্ট (Dhaka Post)');
  console.log('6. জাগোনিউজ২৪ (Jagonews24.com)');
  console.log('7. রাইজিংবিডি (Risingbd.com)');
  console.log('8. বাংলাদেশ প্রতিদিন (Bangladesh Pratidin)');
  console.log('9. কালের কণ্ঠ (Kaler Kantho)');
  console.log('10. বাংলানিউজ২৪ (Banglanews24.com)\n');

  // Fetch concurrently
  const [
    prothomAloItems,
    dailyStarItems,
    bdnews24Items,
    banglaTribuneItems,
    dhakaPostItems,
    jagonewsItems,
    risingbdItems,
    bdPratidinItems,
    kalerKanthoItems,
    banglanewsItems
  ] = await Promise.all([
    fetchProthomAloNews(),
    fetchDailyStarNews(),
    fetchBdnews24News(),
    fetchBanglaTribuneNews(),
    fetchDhakaPostNews(),
    fetchJagonewsNews(),
    fetchRisingbdNews(),
    fetchBdPratidinNews(),
    fetchKalerKanthoNews(),
    fetchBanglanewsNews()
  ]);

  const allArticles = [
    ...prothomAloItems,
    ...dailyStarItems,
    ...bdnews24Items,
    ...banglaTribuneItems,
    ...dhakaPostItems,
    ...jagonewsItems,
    ...risingbdItems,
    ...bdPratidinItems,
    ...kalerKanthoItems,
    ...banglanewsItems
  ];

  console.log(`\nTotal candidate articles gathered: ${allArticles.length}`);
  const sourceStats = {};
  for (const it of allArticles) {
    sourceStats[it.sourceName] = (sourceStats[it.sourceName] || 0) + 1;
  }
  console.log('Candidate Breakdown by Source:');
  console.log(JSON.stringify(sourceStats, null, 2));

  // Partition candidates by category
  const categoryPools = {
    'ময়মনসিংহ': [],
    'বাংলাদেশ': [],
    'আন্তর্জাতিক': [],
    'খেলাধুলা': []
  };

  for (const item of allArticles) {
    if (categoryPools[item.category]) {
      categoryPools[item.category].push(item);
    } else {
      categoryPools['বাংলাদেশ'].push(item);
    }
  }

  console.log('\nPool sizes per category:');
  console.log(`- ময়মনসিংহ: ${categoryPools['ময়মনসিংহ'].length}`);
  console.log(`- বাংলাদেশ: ${categoryPools['বাংলাদেশ'].length}`);
  console.log(`- আন্তর্জাতিক: ${categoryPools['আন্তর্জাতিক'].length}`);
  console.log(`- খেলাধুলা: ${categoryPools['খেলাধুলা'].length}`);

  // Step 2: Auto-delete news older than 60 days
  const sixtyDaysAgo = new Date(Date.now() - MAX_AGE_MS).toISOString();
  console.log(`\nAuto-deleting news older than 60 days (before ${sixtyDaysAgo})...`);
  try {
    const { data: purgedRows, error: purgeErr } = await supabase
      .from('news')
      .delete()
      .lt('created_at', sixtyDaysAgo)
      .select('id');
    if (purgeErr) {
      console.warn('Purge warning:', purgeErr.message);
    } else {
      console.log(`Auto-deleted ${purgedRows ? purgedRows.length : 0} news items older than 60 days.`);
    }
  } catch (err) {
    console.warn('Purge exception:', err.message);
  }

  // Fetch currently existing news IDs and Titles so existing news is preserved and new news is added at top
  const { data: dbExistingNews } = await supabase.from('news').select('id, title, category');
  const existingTitles = new Set((dbExistingNews || []).map(item => item.title.trim().toLowerCase()));
  const existingIds = new Set((dbExistingNews || []).map(item => item.id));
  console.log(`Preserving ${existingIds.size} existing articles in database.`);

  // Step 2.5: Enrich existing articles in Supabase that have short/missing full body
  try {
    const { data: allDbRows } = await supabase.from('news').select('id, title, content, excerpt');
    if (allDbRows && allDbRows.length > 0) {
      const needEnrichment = allDbRows.filter(r => !r.content || r.content.length < 280);
      if (needEnrichment.length > 0) {
        console.log(`\nFound ${needEnrichment.length} existing articles needing full body enrichment. Enriching...`);
        for (const row of needEnrichment) {
          const urlMatch = row.content?.match(/(https?:\/\/[^\s)\n]+)/);
          if (urlMatch) {
            const articleUrl = urlMatch[1];
            let fullBody = null;
            if (articleUrl.includes('/tube/') || articleUrl.includes('/video/') || articleUrl.includes('/videos/')) {
              continue; // Skip video/tube stories which do not contain written article text
            }
            if (articleUrl.includes('bdnews24.com')) {
              const slugMatch = articleUrl.match(/bdnews24\.com\/(.+?)(?:\?|$)/);
              if (slugMatch) {
                try {
                  const detailRaw = await fetchUrl(`https://bangla.bdnews24.com/api/v1/stories-by-slug?slug=${encodeURIComponent(slugMatch[1])}`, {}, 4000);
                  const detailJson = JSON.parse(detailRaw);
                  const paras = (detailJson.story?.cards || [])
                    .flatMap(c => (c['story-elements'] || []).filter(e => e.type === 'text').map(e => cleanHtml(e.text)))
                    .filter(t => t.length > 30 && !t.includes('রাজনৈতিক অস্থিরতার') && !t.includes('নারী ক্রিকেটের') && !t.includes('হকার উচ্ছেদ') && !t.includes('বিডিনিউজ টোয়েন্টিফোর'));
                  if (paras.length > 0) fullBody = paras.join('\n\n');
                } catch {}
              }
            }
            if (!fullBody) {
              fullBody = await fetchFullArticleBody(articleUrl);
            }
            if (fullBody && fullBody.length > 100) {
              const srcMatch = row.content.match(/\(?(?:সংবাদ\s*উৎস|উৎস):[\s\S]*$/i);
              const enrichedContent = `${fullBody}\n\n${srcMatch ? srcMatch[0] : ''}`.trim();
              const wordCount = fullBody.split(/\s+/).length;
              const readMinutes = Math.max(1, Math.min(10, Math.ceil(wordCount / 130)));
              await supabase.from('news').update({
                content: enrichedContent,
                read_time: `${toBengaliNumber(readMinutes)} মিনিট পাঠ`
              }).eq('id', row.id);
              console.log(`  ✓ Enriched [${wordCount} words]: "${row.title.slice(0, 35)}..."`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Enrichment notice:', err.message);
  }

  // Step 2.6: Retroactive reclassification of existing articles in Supabase to ময়মনসিংহ বিভাগ
  try {
    const { data: allDbForCat } = await supabase.from('news').select('id, title, excerpt, content, category');
    if (allDbForCat && allDbForCat.length > 0) {
      let reclassifiedCount = 0;
      for (const row of allDbForCat) {
        if (row.category !== 'ময়মনসিংহ') {
          const matchedCategory = classifyCategory(row.title, `${row.excerpt || ''} ${row.content || ''}`);
          if (matchedCategory === 'ময়মনসিংহ') {
            await supabase.from('news').update({ category: 'ময়মনসিংহ' }).eq('id', row.id);
            reclassifiedCount++;
            console.log(`  ✓ Re-classified to ময়মনসিংহ বিভাগ: "${row.title.slice(0, 35)}..."`);
          }
        }
      }
      if (reclassifiedCount > 0) {
        console.log(`Re-classified ${reclassifiedCount} existing articles to ময়মনসিংহ বিভাগ.`);
      }
    }
  } catch (err) {
    console.warn('Reclassification notice:', err.message);
  }

  // Step 3: Insert balanced fresh articles across categories using Round-Robin source selection
  const TARGET_PER_CATEGORY = 10;
  const insertedCounts = {
    'ময়মনসিংহ': 0,
    'বাংলাদেশ': 0,
    'আন্তর্জাতিক': 0,
    'খেলাধুলা': 0
  };

  const sourceInsertedCounts = {};
  const categories = ['ময়মনসিংহ', 'বাংলাদেশ', 'আন্তর্জাতিক', 'খেলাধুলা'];

  for (const cat of categories) {
    console.log(`\n--- Ingesting [${cat}] (Target: ${TARGET_PER_CATEGORY}) ---`);
    const pool = categoryPools[cat] || [];

    // Group items in this category by sourceName
    const sourceBuckets = {};
    for (const item of pool) {
      if (!sourceBuckets[item.sourceName]) {
        sourceBuckets[item.sourceName] = [];
      }
      sourceBuckets[item.sourceName].push(item);
    }

    // Sort each source's bucket by publication time descending
    for (const src of Object.keys(sourceBuckets)) {
      sourceBuckets[src].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    }

    // Prioritize sources that have fewer overall insertions across the whole database
    const sortedSources = Object.keys(sourceBuckets).sort((a, b) => {
      const countA = sourceInsertedCounts[a] || 0;
      const countB = sourceInsertedCounts[b] || 0;
      return countA - countB;
    });

    // Round-robin selection across sources
    let addedInRound = true;
    while (insertedCounts[cat] < TARGET_PER_CATEGORY && addedInRound) {
      addedInRound = false;

      for (const src of sortedSources) {
        if (insertedCounts[cat] >= TARGET_PER_CATEGORY) break;

        const bucket = sourceBuckets[src];
        if (!bucket || bucket.length === 0) continue;

        const item = bucket.shift();
        const titleKey = item.title.trim().toLowerCase();
        if (existingTitles.has(titleKey)) continue;

        const hash = crypto.createHash('md5').update(item.title).digest('hex').slice(0, 12);
        const articleId = `news-${hash}`;
        if (existingIds.has(articleId)) continue;

        // Ensure rich multi-paragraph body
        let articleBody = item.body;
        if (!articleBody || articleBody.length < 250) {
          const scrapedBody = await fetchFullArticleBody(item.url);
          if (scrapedBody && scrapedBody.length > 100) {
            articleBody = scrapedBody;
          }
        }

        // Construct excerpt & body with formatted source attribution button
        const cleanExcerpt = cleanHtml(item.excerpt).slice(0, 180).trim() + (item.excerpt.length > 180 ? '...' : '');
        const content = `${articleBody}\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${item.url})`;

        const wordCount = (articleBody || '').split(/\s+/).length;
        const readMinutes = Math.max(1, Math.min(10, Math.ceil(wordCount / 130)));
        const readTimeFormatted = `${toBengaliNumber(readMinutes)} মিনিট পাঠ`;
        const dateFormatted = formatBengaliDate(item.pubDate);

        const payload = {
          id: articleId,
          title: normalizePunctuation(item.title),
          excerpt: cleanExcerpt,
          category: cat,
          date: dateFormatted,
          image_url: item.imageUrl || DEFAULT_THEME_IMAGE,
          read_time: readTimeFormatted,
          content: content,
          created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        };

        const { error: insertErr } = await supabase.from('news').insert([payload]);
        if (insertErr) {
          console.warn(`  Failed inserting article:`, insertErr.message);
        } else {
          existingTitles.add(titleKey);
          existingIds.add(articleId);
          insertedCounts[cat] = (insertedCounts[cat] || 0) + 1;
          sourceInsertedCounts[item.sourceName] = (sourceInsertedCounts[item.sourceName] || 0) + 1;
          addedInRound = true;
          console.log(`  [+${insertedCounts[cat]}] [${cat} | ${item.sourceName}]: "${item.title.slice(0, 42)}..."`);
        }
      }
    }
  }

  console.log(`\n=== All 10 Outlets Ingestion Completed Successfully ===`);
  console.log(JSON.stringify(insertedCounts, null, 2));

  // Verify total count in Supabase
  const { data: dbNews, error: countErr } = await supabase.from('news').select('id, category, title, created_at');
  if (!countErr && dbNews) {
    console.log(`\nSupabase live records count: ${dbNews.length}`);
  }
}

run().catch(console.error);
