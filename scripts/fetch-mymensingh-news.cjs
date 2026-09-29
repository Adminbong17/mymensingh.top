/**
 * Mymensingh.top - Automated Global, National, Local & Sports News Aggregator (.cjs)
 * 
 * Categories (User Specified):
 * 1. ময়মনসিংহ (Mymensingh local news & updates)
 * 2. বাংলাদেশ (National news, politics, affairs)
 * 3. আন্তর্জাতিক (World news, global events, Middle East, USA, Europe)
 * 4. খেলাধুলা (Sports, cricket, football, tournaments)
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_THEME_IMAGE = '/images/news-placeholder.svg';
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;

// HTTP GET helper with redirect support & Buffer concatenation
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7',
        ...headers
      },
      timeout: 12000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const origin = new URL(url).origin;
          redirectUrl = new URL(redirectUrl, origin).href;
        }
        return fetchUrl(redirectUrl, headers).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const fullBuffer = Buffer.concat(chunks);
        resolve(fullBuffer.toString('utf8'));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

// Clean HTML tags and entities
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

// Scrapes real article details: og:image, date, and full paragraphs
async function scrapeArticleDetails(articleUrl) {
  try {
    const html = await fetchUrl(articleUrl);

    // 1. Check article published date
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

    // Check if URL indicates old years
    const yearMatch = articleUrl.match(/\/(201[0-9]|202[0-4])\//);
    if (yearMatch) {
      return { isOld: true, ogImage: null, paragraphs: [] };
    }

    if (publishedTime && (Date.now() - publishedTime) > MAX_AGE_MS) {
      return { isOld: true, ogImage: null, paragraphs: [] };
    }

    // 2. Authentic og:image
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

// Fetch candidate news via Prothom Alo search API with published-at sorting
async function fetchCandidatesForCategory(query, category) {
  try {
    const url = `https://www.prothomalo.com/api/v1/advanced-search?q=${encodeURIComponent(query)}&sort=published-at&limit=15`;
    const jsonStr = await fetchUrl(url);
    const data = JSON.parse(jsonStr);
    const items = [];

    if (data && Array.isArray(data.items)) {
      for (const it of data.items) {
        if (!it.headline || !it.url) continue;

        // Skip non-story or video links
        if (it.url.includes('/video/') || it.url.includes('kishoralo') || it.url.includes('bondhushava')) {
          continue;
        }

        // Check age
        if (it['published-at']) {
          const pubTime = new Date(it['published-at']).getTime();
          if (!isNaN(pubTime) && (Date.now() - pubTime) > MAX_AGE_MS) {
            continue;
          }
        }

        items.push({
          title: cleanHtml(it.headline),
          url: it.url,
          pubDate: it['published-at'] || new Date().toISOString(),
          category: category,
          sourceName: 'প্রথম আলো'
        });
      }
    }
    return items;
  } catch (err) {
    console.warn(`Search failed for ${category} ("${query}"):`, err.message);
    return [];
  }
}

// Fetch Prothom Alo Master Stories RSS for supplementary items
async function fetchMasterRssItems() {
  try {
    const xml = await fetchUrl('https://www.prothomalo.com/stories.rss');
    const items = [];
    const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const now = Date.now();

    for (const match of matches) {
      const itemXml = match[1];
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      if (!link || link.includes('/video/') || link.includes('kishoralo')) continue;

      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      if (pubDate) {
        const pubTime = new Date(pubDate).getTime();
        if (!isNaN(pubTime) && (now - pubTime) > MAX_AGE_MS) continue;
      }

      const title = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
      let category = 'বাংলাদেশ';
      if (link.includes('/sports/')) category = 'খেলাধুলা';
      else if (link.includes('/world/')) category = 'আন্তর্জাতিক';
      else if (link.includes('mymensingh') || title.includes('ময়মনসিংহ') || title.includes('ময়মনসিংহ')) category = 'ময়মনসিংহ';

      if (title && link) {
        items.push({
          title,
          url: link,
          pubDate: pubDate || new Date().toISOString(),
          category,
          sourceName: 'প্রথম আলো'
        });
      }
    }
    return items;
  } catch (err) {
    console.warn('Master RSS failed:', err.message);
    return [];
  }
}

// Main Aggregator Execution
async function run() {
  console.log('=== Starting Mymensingh.top Global, National & Sports News Aggregator ===');

  // Step 1: Wipe outdated news table in Supabase so categories are 100% cleanly populated
  console.log('Resetting news table in Supabase...');
  try {
    const { error: resetErr } = await supabase.from('news').delete().neq('id', 'keep_none');
    if (resetErr) {
      console.warn('Reset warning:', resetErr.message);
    } else {
      console.log('News table cleared.');
    }
  } catch (err) {
    console.warn('Wipe notice:', err.message);
  }

  // Step 2: Fetch candidates for each category
  console.log('Fetching fresh candidates across all 4 categories...');
  const [
    mymensinghItems,
    bangladeshItems,
    intlItems,
    sportsItems,
    masterItems
  ] = await Promise.all([
    fetchCandidatesForCategory('ময়মনসিংহ', 'ময়মনসিংহ'),
    fetchCandidatesForCategory('বাংলাদেশ OR রাজনীতি OR সরকার', 'বাংলাদেশ'),
    fetchCandidatesForCategory('যুদ্ধ OR আন্তর্জাতিক OR গাজা OR ট্রাম্প', 'আন্তর্জাতিক'),
    fetchCandidatesForCategory('খেলাধুলা OR ক্রিকেট OR ফুটবল', 'খেলাধুলা'),
    fetchMasterRssItems()
  ]);

  const categoryPools = {
    'ময়মনসিংহ': [...mymensinghItems],
    'বাংলাদেশ': [...bangladeshItems],
    'আন্তর্জাতিক': [...intlItems],
    'খেলাধুলা': [...sportsItems]
  };

  // Merge master RSS items into respective categories
  for (const m of masterItems) {
    if (categoryPools[m.category]) {
      categoryPools[m.category].push(m);
    }
  }

  console.log(`Candidate pools:`);
  console.log(`- ময়মনসিংহ: ${categoryPools['ময়মনসিংহ'].length}`);
  console.log(`- বাংলাদেশ: ${categoryPools['বাংলাদেশ'].length}`);
  console.log(`- আন্তর্জাতিক: ${categoryPools['আন্তর্জাতিক'].length}`);
  console.log(`- খেলাধুলা: ${categoryPools['খেলাধুলা'].length}`);

  const TARGET_PER_CATEGORY = 8;
  const insertedCounts = {
    'ময়মনসিংহ': 0,
    'বাংলাদেশ': 0,
    'আন্তর্জাতিক': 0,
    'খেলাধুলা': 0
  };

  const existingTitles = new Set();
  const existingIds = new Set();
  const categories = ['ময়মনসিংহ', 'বাংলাদেশ', 'আন্তর্জাতিক', 'খেলাধুলা'];

  for (const cat of categories) {
    console.log(`\n--- Ingesting Category: [${cat}] (Target: ${TARGET_PER_CATEGORY}) ---`);
    const pool = categoryPools[cat] || [];

    for (let i = 0; i < pool.length; i++) {
      if (insertedCounts[cat] >= TARGET_PER_CATEGORY) break;

      const item = pool[i];
      const titleKey = item.title.trim().toLowerCase();
      if (existingTitles.has(titleKey)) continue;

      const hash = crypto.createHash('md5').update(item.title).digest('hex').slice(0, 12);
      const articleId = `news-${hash}`;
      if (existingIds.has(articleId)) continue;

      // Scrape details & full paragraphs directly from publisher
      const details = await scrapeArticleDetails(item.url);
      if (details.isOld) continue;

      const fullParagraphs = details.paragraphs || [];
      if (fullParagraphs.length < 2) {
        continue; // Must be full article
      }

      // Fallback theme image if portal photo is not available
      const realArticleImage = details.ogImage || null;
      const imageUrl = realArticleImage || DEFAULT_THEME_IMAGE;

      // Construct content
      const fullContentText = fullParagraphs.join('\n\n');
      const cleanExcerpt = fullParagraphs[0].slice(0, 170).trim() + (fullParagraphs[0].length > 170 ? '...' : '');
      const content = `${fullContentText}\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${item.url})`;

      const wordCount = fullContentText.split(/\s+/).length;
      const readMinutes = Math.max(1, Math.min(10, Math.ceil(wordCount / 130)));
      const readTimeFormatted = `${toBengaliNumber(readMinutes)} মিনিট পাঠ`;
      const dateFormatted = formatBengaliDate(details.publishedTime || item.pubDate);

      const payload = {
        id: articleId,
        title: normalizePunctuation(item.title),
        excerpt: cleanExcerpt,
        category: cat,
        date: dateFormatted,
        image_url: imageUrl,
        read_time: readTimeFormatted,
        content: content
      };

      const { error: insertErr } = await supabase.from('news').insert([payload]);
      if (insertErr) {
        console.warn(`  Failed inserting article:`, insertErr.message);
      } else {
        existingTitles.add(titleKey);
        existingIds.add(articleId);
        insertedCounts[cat] = (insertedCounts[cat] || 0) + 1;
        console.log(`  [+${insertedCounts[cat]}] [${cat}]: "${item.title.slice(0, 42)}..."`);
      }

      // Polite delay between article fetches
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.log(`\n=== Aggregation Completed Successfully ===`);
  console.log(JSON.stringify(insertedCounts, null, 2));
}

run().catch(console.error);
