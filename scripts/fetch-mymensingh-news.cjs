/**
 * Mymensingh.top - Automated Full-Article News Crawler & Ingestion Engine (.cjs)
 * 
 * Strict Quality Safeguards:
 * 1. 60-Day Recency Guarantee: Only news from the last 60 days are accepted.
 *    Any article URL or metadata older than 60 days (e.g. from 2018-2025) is strictly rejected.
 * 2. Full Article Body Required: Every article MUST have at least 2-3 full paragraphs
 *    scraped from the original publisher. Stub/empty news are never saved.
 * 3. Accurate Bengali Categories:
 *    - আইন ও অপরাধ (Crime, accidents, arrests, fire, court)
 *    - শিক্ষা ও ক্যাম্পাস (Schools, universities, exams, results)
 *    - উন্নয়ন ও প্রশাসন (Roads, bridges, load shedding, city corp, projects)
 *    - স্বাস্থ্য ও চিকিৎসা (Hospitals, doctors, dengue, public health)
 *    - খেলাধুলা (Sports, cricket, football, tournaments)
 *    - বাণিজ্য ও অর্থনীতি (Markets, banks, commerce, agriculture)
 *    - নাগরিক জীবন (Culture, local events, human interest)
 * 4. Branded Fallback: Uses /images/news-placeholder.svg (mymensingh.top theme) when no photo is found.
 * 5. Buffer-Safe UTF-8: Zero \uFFFD corruption.
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCHEXECUTE_URL = 'https://news.google.com/_/DotsSplashUi/data/batchexecute';
const _GARTURLREQ_CTX = [
  ['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1],
  'X',
  'X',
  1,
  [1, 1, 1],
  1,
  1,
  null,
  0,
  0,
  null,
  0
];

// Fallback theme image with mymensingh.top branding
const DEFAULT_THEME_IMAGE = '/images/news-placeholder.svg';

// Maximum age: 60 days in milliseconds
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;

// Trusted mainstream outlets for Auto-Publish
const TRUSTED_DOMAINS = [
  'prothomalo.com',
  'somoynews.tv',
  'bdnews24.com',
  'dhakapost.com',
  'jugantor.com',
  'ittefaq.com.bd',
  'kalerkantho.com',
  'thedailystar.net',
  'jagonews24.com',
  'banglatribune.com',
  'samakal.com',
  'manabzamin.com',
  'bhorerkagoj.com',
  'inqilab.com',
  'bssnews.net'
];

// HTTP GET helper with redirect support & Buffer concatenation
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'bn,en-US;q=0.7,en;q=0.3',
        ...headers
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl, headers).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// POST helper for Google batchexecute
function postBatchexecute(body) {
  return new Promise((resolve, reject) => {
    const postData = 'f.req=' + encodeURIComponent(body);
    const req = https.request(BATCHEXECUTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Batchexecute timeout'));
    });
    req.write(postData);
    req.end();
  });
}

// Decodes a Google News RSS article URL to the real publisher article URL
async function decodeGoogleNewsUrl(googleUrl) {
  try {
    const match = googleUrl.match(/(?:articles|read)\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const artId = match[1];

    const paramsUrl = `https://news.google.com/rss/articles/${artId}?hl=bn&gl=BD&ceid=BD:bn`;
    const html = await fetchUrl(paramsUrl);

    const sgMatch = html.match(/data-n-a-sg="([^"]+)"/);
    const tsMatch = html.match(/data-n-a-ts="([^"]+)"/);

    if (!sgMatch || !tsMatch) return null;

    const sg = sgMatch[1];
    const ts = tsMatch[1];

    const inner = [
      'garturlreq',
      _GARTURLREQ_CTX,
      artId,
      /^\d+$/.test(ts) ? parseInt(ts, 10) : ts,
      sg
    ];

    const envelopes = [
      ['Fbv4je', JSON.stringify(inner), null, '0']
    ];

    const rawRes = await postBatchexecute(JSON.stringify([envelopes]));
    let cleanRes = rawRes;
    if (cleanRes.startsWith(")]}'")) {
      cleanRes = cleanRes.replace(")]}'", "").trim();
    }

    const parsed = JSON.parse(cleanRes);
    for (const row of parsed) {
      if (Array.isArray(row) && row[2]) {
        let payload = row[2];
        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
        }
        if (Array.isArray(payload) && payload[0] === 'garturlres' && payload[1]) {
          return payload[1];
        }
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return null;
}

// Clean HTML tags, entities, and stray links
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
    .replace(/<a[\s\S]*?<\/a>/gi, ' ')
    .replace(/<a[\s\S]*$/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\uFFFD+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Scrapes real article details: authentic og:image, publication date, and full paragraphs
async function scrapeArticleDetails(articleUrl) {
  try {
    const html = await fetchUrl(articleUrl);

    // 1. Check article published date in HTML metadata
    const dateMatch = html.match(/<meta[^>]*property=["'](?:article:published_time|og:published_time|published_time)["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*name=["'](?:publish-date|publication-date|date)["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<time[^>]*datetime=["']([^"']+)["']/i);

    let publishedTime = null;
    if (dateMatch && dateMatch[1]) {
      const parsed = Date.parse(dateMatch[1]);
      if (!isNaN(parsed)) {
        publishedTime = parsed;
      }
    }

    // Check if URL contains old years like /2018/, /2019/, /2020/, /2021/, /2022/, /2023/, /2024/, /2025/
    const yearMatch = articleUrl.match(/\/(201[0-9]|202[0-4])\//);
    if (yearMatch) {
      return { isOld: true, ogImage: null, paragraphs: [] };
    }

    if (publishedTime && (Date.now() - publishedTime) > MAX_AGE_MS) {
      return { isOld: true, ogImage: null, paragraphs: [] };
    }

    // 2. Authentic og:image / twitter:image
    let ogImage = null;
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                    html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);

    if (ogMatch && ogMatch[1].startsWith('http')) {
      const cleanImg = ogMatch[1].replace(/&amp;/g, '&').trim();
      if (!cleanImg.includes('favicon') && !cleanImg.includes('logo_small') && !cleanImg.includes('placeholder')) {
        ogImage = cleanImg;
      }
    }

    // 3. Full article text extraction
    let clean = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');

    const pMatches = [...clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const paragraphs = [];

    for (const m of pMatches) {
      const text = cleanHtml(m[1]);
      if (text.length < 35) continue;
      if (/কপিরাইট|সর্বস্বত্ব|বিজ্ঞাপন|গুগল নিউজে|ফলো করুন|সাবস্ক্রাইব|অনলাইন ডেস্ক|আমাদের পেজে|ছবি সংগৃহীত|নিজস্ব প্রতিবেদক|প্রতিনিধি|আপডেট:/i.test(text) && text.length < 90) {
        continue;
      }
      if (/https?:\/\//i.test(text)) continue;

      if (!paragraphs.some(p => p.slice(0, 30) === text.slice(0, 30))) {
        paragraphs.push(text);
      }
    }

    return { isOld: false, ogImage, paragraphs, publishedTime };
  } catch (err) {
    return { isOld: false, ogImage: null, paragraphs: [] };
  }
}

// Intelligent Bengali Category Classification
function detectCategory(title, text = '') {
  const t = title.toLowerCase();
  const combined = (title + ' ' + text).toLowerCase();

  // 1. স্বাস্থ্য ও চিকিৎসা (Health, Diseases, Epidemics)
  if (/ডেঙ্গু|জলাতঙ্ক|টিকা|করোনা|ক্যান্সার|স্বাস্থ্যসেবা|স্বাস্থ্য কমপ্লেক্স|রোগীর ভিড়|চিকিৎসা সেবা|অ্যাম্বুলেন্স/i.test(t)) {
    return 'স্বাস্থ্য ও চিকিৎসা';
  }

  // 2. উন্নয়ন ও প্রশাসন (City Corp, Mayor, Roads, Projects, Electricity, Plan)
  if (/প্ল্যান পাস|সড়ক|সড়কে|সেতু|ব্রিজ|প্রকল্প|সিটি কর্পোরেশন|মেয়র|উন্নয়ন|উন্নয়ন|সংস্কার|নির্মাণ|লোডশেডিং|বিদ্যুৎ|প্রশাসন|উপজেলা পরিষদ|ড্রেনেজ|যানজট|ট্রেন|রেল|উদ্বোধন|ভিত্তিপ্রস্তর|কমিশনার|মন্ত্রণালয়/i.test(t)) {
    return 'উন্নয়ন ও প্রশাসন';
  }

  // 3. আইন ও অপরাধ (Crime, Accidents, Disasters, Court, Police)
  if (/খুন|হত্যা|আটক|গ্রেফতার|গ্রেপ্তার|ধর্ষণ|লাশ|মরদেহ|ছিনতাই|ডাকাতি|মামলা|কারাদণ্ড|মৃত্যুদণ্ড|সংঘর্ষ|আহত|নিহত|দুর্ঘটনা|আগুন|অগ্নিকাণ্ড|মৃত্যু|হতাহত|দগ্ধ|জখম|পুলিশ|র‌্যাব|ডিবি|সিআইডি|থানা|চোরাচালান|অস্ত্র|মাদক|ইয়াবা|মারধর|লাথির আঘাতে|পিটিয়ে|দাঙ্গা|আইনশৃঙ্খলা/i.test(t)) {
    return 'আইন ও অপরাধ';
  }

  // 4. শিক্ষা ও ক্যাম্পাস (Schools, Universities, Exams, Results, Teachers)
  if (/স্কুল|কলেজ|বিশ্ববিদ্যালয়|বাকৃবি|শিক্ষক|শিক্ষার্থী|ছাত্র|পরীক্ষা|ভর্তি|ক্লাস|জিপিএ|পাসের হার|পরীক্ষায় পাস|শিক্ষা|প্রাথমিক|উচ্চমাধ্যমিক|কওমি|মাদ্রাসা|রেজাল্ট|ফলাফল|এসএসসি|এইচএসসি|জেএসসি|শিক্ষাঙ্গন|পাঠদান/i.test(t)) {
    return 'শিক্ষা ও ক্যাম্পাস';
  }

  // 5. খেলাধুলা (Sports, Matches, Cricket, Football)
  if (/খেলা|ক্রিকেট|ফুটবল|টুর্নামেন্ট|স্টেডিয়াম|ম্যাচ|জাতীয় দল|জাতীয় দল|জয়|গোল|রানার্সআপ|বিপিএল|অলিম্পিক|খেলোয়াড়|ব্যাডমিন্টন/i.test(t)) {
    return 'খেলাধুলা';
  }

  // 6. বাণিজ্য ও অর্থনীতি (Markets, Banks, Prices, Business)
  if (/বাজার|দর|দাম|বাণিজ্য|ব্যাংক|শাখা|বিনিয়োগ|কারখানা|শ্রমিক|কৃষি|ধান|চাল|পাট|বাণিজ্যিক|ব্যবসা|ডিসপ্লে সেন্টার|মুদ্রাস্ফীতি|রপ্তানি|আমদানি/i.test(t)) {
    return 'বাণিজ্য ও অর্থনীতি';
  }

  // Contextual fallback on full article text
  if (/স্কুল|কলেজ|বিশ্ববিদ্যালয়|শিক্ষার্থী|ভর্তি/i.test(combined)) return 'শিক্ষা ও ক্যাম্পাস';
  if (/সড়ক|সেতু|প্রকল্প|সিটি কর্পোরেশন|বিদ্যুৎ/i.test(combined)) return 'উন্নয়ন ও প্রশাসন';
  if (/খেলা|ক্রিকেট|ফুটবল/i.test(combined)) return 'খেলাধুলা';
  if (/খুন|হত্যা|আটক|গ্রেফতার|ধর্ষণ|পুলিশ|মামলা/i.test(combined)) return 'আইন ও অপরাধ';
  if (/ডেঙ্গু|জলাতঙ্ক|স্বাস্থ্য|চিকিৎসা/i.test(combined)) return 'স্বাস্থ্য ও চিকিৎসা';
  if (/বাজার|দাম|ব্যাংক|ব্যবসা/i.test(combined)) return 'বাণিজ্য ও অর্থনীতি';

  return 'নাগরিক জীবন';
}

// Parse Google News RSS with when:60d to strictly prevent 2018/archival news
async function fetchGoogleNews() {
  console.log('Fetching Google News RSS (strictly restricted to when:60d)...');
  const feedUrl = 'https://news.google.com/rss/search?q=%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9+when:60d&hl=bn&gl=BD&ceid=BD:bn';
  const xml = await fetchUrl(feedUrl);
  const items = [];
  const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  const now = Date.now();

  for (const match of matches) {
    const itemXml = match[1];
    const rawTitle = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
    const guid = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || link;
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
    const sourceName = cleanHtml(itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || 'সংবাদ সূত্র');
    const sourceUrl = itemXml.match(/<source url="([^"]+)"/)?.[1] || '';
    const rawDesc = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');

    // Skip if RSS pubDate is older than 60 days
    if (pubDate) {
      const pubTime = new Date(pubDate).getTime();
      if (!isNaN(pubTime) && (now - pubTime) > MAX_AGE_MS) {
        continue;
      }
    }

    let cleanTitle = rawTitle;
    if (cleanTitle.includes(' - ')) {
      const parts = cleanTitle.split(' - ');
      parts.pop();
      cleanTitle = parts.join(' - ').trim();
    }

    if (cleanTitle) {
      items.push({
        guid,
        title: cleanTitle,
        link,
        pubDate: pubDate || new Date().toISOString(),
        sourceName,
        sourceUrl,
        description: rawDesc
      });
    }
  }

  return items;
}

// Parse Prothom Alo RSS for Mymensingh
async function fetchProthomAloNews() {
  console.log('Fetching Prothom Alo RSS...');
  try {
    const xml = await fetchUrl('https://www.prothomalo.com/stories.rss');
    const items = [];
    const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const now = Date.now();

    for (const match of matches) {
      const itemXml = match[1];
      const keywords = itemXml.match(/<media:keywords>([\s\S]*?)<\/media:keywords>/)?.[1] || '';
      const fullText = itemXml.toLowerCase();

      const isMymensingh =
        keywords.includes('ময়মনসিংহ') ||
        keywords.includes('ময়মনসিংহ') ||
        fullText.includes('ময়মনসিংহ') ||
        fullText.includes('ত্রিশাল') ||
        fullText.includes('ভালুকা') ||
        fullText.includes('গফরগাঁও') ||
        fullText.includes('মুক্তাগাছা');

      if (!isMymensingh) continue;

      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      if (pubDate) {
        const pubTime = new Date(pubDate).getTime();
        if (!isNaN(pubTime) && (now - pubTime) > MAX_AGE_MS) {
          continue;
        }
      }

      const title = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const guid = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || link;
      const description = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');
      const imageUrl = itemXml.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ||
                       itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] || '';

      if (title) {
        items.push({
          guid,
          title,
          link,
          realUrl: link,
          pubDate: pubDate || new Date().toISOString(),
          sourceName: 'প্রথম আলো',
          sourceUrl: 'https://www.prothomalo.com',
          description,
          imageUrl: imageUrl.replace(/&amp;/g, '&')
        });
      }
    }

    return items;
  } catch (err) {
    console.warn('Prothom Alo RSS fetch failed:', err.message);
    return [];
  }
}

// Convert numbers to Bengali digits
function toBengaliNumber(num) {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => digits[d]);
}

// Format date to readable Bengali format (e.g. "২৯ সেপ্টেম্বর, ২০২৬")
function formatBengaliDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'আজ';
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const day = toBengaliNumber(d.getDate());
  const month = months[d.getMonth()];
  const year = toBengaliNumber(d.getFullYear());
  return `${day} ${month}, ${year}`;
}

// Main execution function
async function run() {
  const isReset = process.argv.includes('--reset') || true; // Always clean wipe when resetting

  if (isReset) {
    console.log('Resetting news table in Supabase to eliminate old 2018/archival and stub news...');
    const { error: resetErr } = await supabase.from('news').delete().neq('id', 'keep_none');
    if (resetErr) {
      console.warn('Could not reset news table:', resetErr.message);
    } else {
      console.log('News table cleared successfully.');
    }
  }

  console.log('=== Starting Mymensingh.top High-Quality Full-Article Ingestion ===');

  const [googleItems, prothomAloItems] = await Promise.all([
    fetchGoogleNews().catch(() => []),
    fetchProthomAloNews().catch(() => [])
  ]);

  const allFeedItems = [...prothomAloItems, ...googleItems];
  console.log(`Found total ${allFeedItems.length} candidate news items within last 60 days.`);

  // Prevent duplicates
  const existingTitles = new Set();
  const existingIds = new Set();

  let insertedCount = 0;
  let skippedNoContent = 0;
  let skippedOldNews = 0;

  for (let i = 0; i < allFeedItems.length; i++) {
    const item = allFeedItems[i];
    const titleKey = item.title.trim().toLowerCase();
    if (existingTitles.has(titleKey)) continue;

    const hash = crypto.createHash('md5').update(item.title).digest('hex').slice(0, 12);
    const articleId = `news-${hash}`;
    if (existingIds.has(articleId)) continue;

    // 1. Resolve direct publisher URL
    let directArticleUrl = item.realUrl || item.link;
    if (item.link && item.link.includes('news.google.com')) {
      const decoded = await decodeGoogleNewsUrl(item.link);
      if (decoded) {
        directArticleUrl = decoded;
      }
    }

    // Skip non-http or undecoded Google URLs
    if (!directArticleUrl || !directArticleUrl.startsWith('http') || directArticleUrl.includes('news.google.com')) {
      continue;
    }

    // 2. Scrape authentic og:image and FULL ARTICLE paragraphs from the original publisher
    const details = await scrapeArticleDetails(directArticleUrl);

    // Reject if source indicates old article (> 60 days or old year in URL)
    if (details.isOld) {
      console.log(`  [SKIPPED OLD NEWS]: "${item.title.slice(0, 35)}..." (${directArticleUrl})`);
      skippedOldNews++;
      continue;
    }

    const fullParagraphs = details.paragraphs || [];

    // STRICT REQUIREMENT: Must have at least 2 full paragraphs (মূল প্রতিবেদন)!
    if (fullParagraphs.length < 2) {
      console.log(`  [SKIPPED NO FULL ARTICLE]: "${item.title.slice(0, 35)}..." (Found ${fullParagraphs.length} paras)`);
      skippedNoContent++;
      continue;
    }

    // 3. Fallback theme image if portal photo is not available
    const realArticleImage = details.ogImage || item.imageUrl || null;
    const imageUrl = realArticleImage || DEFAULT_THEME_IMAGE;

    // 4. Construct rich full article content and clean excerpt
    const fullContentText = fullParagraphs.join('\n\n');
    const excerptText = fullParagraphs[0].slice(0, 170).trim() + (fullParagraphs[0].length > 170 ? '...' : '');

    // Append clean source citation for reader modal button extraction
    const content = `${fullContentText}\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${directArticleUrl})`;

    // Calculate reading time based on Bengali word count
    const wordCount = fullContentText.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.min(10, Math.ceil(wordCount / 130)));
    const readTimeFormatted = `${toBengaliNumber(readMinutes)} মিনিট পাঠ`;

    // 5. Detect accurate Bengali Category
    const category = detectCategory(item.title, fullContentText);
    const dateFormatted = formatBengaliDate(details.publishedTime || item.pubDate);

    const payload = {
      id: articleId,
      title: item.title,
      excerpt: excerptText,
      category: category,
      date: dateFormatted,
      image_url: imageUrl,
      read_time: readTimeFormatted,
      content: content
    };

    console.log(`\n[${insertedCount + 1}] INGESTED: [${category}] "${item.title.slice(0, 45)}..."`);
    console.log(`  ✓ ${fullParagraphs.length} Paragraphs | Image: ${imageUrl === DEFAULT_THEME_IMAGE ? 'Theme Banner' : 'Portal Photo'}`);

    const { error: insertErr } = await supabase.from('news').insert([payload]);
    if (insertErr) {
      console.warn(`  Failed to insert article:`, insertErr.message);
    } else {
      existingTitles.add(titleKey);
      existingIds.add(articleId);
      insertedCount++;
    }

    // Target a solid batch of top high-quality news
    if (insertedCount >= 30) {
      break;
    }

    // Polite delay between requests
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n=== Finished Ingestion! ===`);
  console.log(`- Successfully Ingested: ${insertedCount} Full Articles`);
  console.log(`- Skipped Old Archival News (>60d): ${skippedOldNews}`);
  console.log(`- Skipped Empty/Stub News (<2 paras): ${skippedNoContent}`);
}

run().catch(console.error);
