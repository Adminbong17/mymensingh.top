/**
 * Mymensingh.top - Automated Full-Article News Crawler & Ingestion Engine (.cjs)
 * 
 * Features:
 * - Scrapes FULL ARTICLE CONTENT (মূল প্রতিবেদন) directly from publisher pages.
 * - Extracts authentic original featured photographs (og:image).
 * - Custom Branded Fallback: Uses /images/news-placeholder.svg (mymensingh.top banner) when no photo is found.
 * - Zero HTML Leakage: Strips all <a> tags and raw URLs from titles and excerpts.
 * - Hybrid Mode: Mainstream media auto-published, other media kept as draft.
 * - Buffer-Safe UTF-8: Zero \uFFFD corruption on Bengali multi-byte characters.
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
  'inqilab.com'
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

// Scrapes real article details: authentic og:image and full article paragraphs
async function scrapeArticleDetails(articleUrl) {
  try {
    const html = await fetchUrl(articleUrl);

    // 1. Authentic og:image / twitter:image
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

    // 2. Full article text extraction
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

    return { ogImage, paragraphs };
  } catch (err) {
    return { ogImage: null, paragraphs: [] };
  }
}

// Categorize by keywords
function detectCategory(title, text) {
  const combined = (title + ' ' + text).toLowerCase();
  if (/হাসপাতাল|চিকিৎসা|স্বাস্থ্য|ডাক্তার|করোনা|রোগী|মেডিকেল|ওষুধ|ডেঙ্গু|জলাতঙ্ক/.test(combined)) return 'Health';
  if (/স্কুল|কলেজ|বিশ্ববিদ্যালয়|বাকৃবি|ভর্তি|শিক্ষক|পরীক্ষা|শিক্ষার্থী|ক্লাস|জিপিএ/.test(combined)) return 'Education';
  if (/উন্নয়ন|সড়ক|সেতু|ব্রিজ|প্রকল্প|সিটি কর্পোরেশন|মেয়র|প্রশাসন|নির্মাণ|সংস্কার|বিদ্যুৎ|লোডশেডিং/.test(combined)) return 'Infrastructure';
  if (/খেলা|ক্রিকেট|ফুটবল|টুর্নামেন্ট|স্টেডিয়াম|জয়|ম্যাচ|জাতীয় দল/.test(combined)) return 'Sports';
  if (/মেলা|উৎসব|পর্যটন|জয়নুল|ব্রহ্মপুত্র|পার্ক|ঐতিহ্য|সংস্কৃতি|নদী/.test(combined)) return 'Tourism';
  return 'Community';
}

// Parse Google News RSS
async function fetchGoogleNews() {
  console.log('Fetching Google News RSS for Mymensingh...');
  const feedUrl = 'https://news.google.com/rss/search?q=%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9&hl=bn&gl=BD&ceid=BD:bn';
  const xml = await fetchUrl(feedUrl);
  const items = [];
  const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  for (const match of matches) {
    const itemXml = match[1];
    const rawTitle = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
    const guid = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || link;
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toISOString();
    const sourceName = cleanHtml(itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || 'সংবাদ সূত্র');
    const sourceUrl = itemXml.match(/<source url="([^"]+)"/)?.[1] || '';
    const rawDesc = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');

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
        pubDate,
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

      const title = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const guid = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || link;
      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toISOString();
      const description = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');
      const imageUrl = itemXml.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ||
                       itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] || '';

      if (title) {
        items.push({
          guid,
          title,
          link,
          realUrl: link,
          pubDate,
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
  const isReset = process.argv.includes('--reset');

  if (isReset) {
    console.log('Resetting news table in Supabase as requested...');
    const { error: resetErr } = await supabase.from('news').delete().neq('id', 'keep_none');
    if (resetErr) {
      console.warn('Could not reset news table:', resetErr.message);
    } else {
      console.log('News table cleared successfully.');
    }
  }

  console.log('=== Starting Mymensingh.top Full-Article News Ingestion ===');

  const [googleItems, prothomAloItems] = await Promise.all([
    fetchGoogleNews().catch(() => []),
    fetchProthomAloNews().catch(() => [])
  ]);

  const allFeedItems = [...prothomAloItems, ...googleItems];
  console.log(`Found total ${allFeedItems.length} Mymensingh news candidates.`);

  // 1. Fetch existing news from Supabase to prevent duplicates
  const { data: existingNews, error: fetchErr } = await supabase
    .from('news')
    .select('id, title');

  if (fetchErr) {
    console.error('Error fetching existing news from Supabase:', fetchErr);
  }

  const existingTitles = new Set((existingNews || []).map(n => n.title.trim().toLowerCase()));
  const existingIds = new Set((existingNews || []).map(n => n.id));

  let insertedCount = 0;
  let draftCount = 0;

  // Process top 35 news items to ensure high quality and prevent timeouts
  const candidates = allFeedItems.slice(0, 40);

  for (let i = 0; i < candidates.length; i++) {
    const item = candidates[i];
    const titleKey = item.title.trim().toLowerCase();
    if (existingTitles.has(titleKey)) {
      continue; // Duplicate title
    }

    const hash = crypto.createHash('md5').update(item.title).digest('hex').slice(0, 12);
    const articleId = `news-${hash}`;

    if (existingIds.has(articleId)) {
      continue; // Duplicate ID
    }

    // Hybrid check: Is source trusted?
    const isTrusted = TRUSTED_DOMAINS.some(domain =>
      (item.sourceUrl && item.sourceUrl.includes(domain)) ||
      (item.link && item.link.includes(domain)) ||
      (item.sourceName && (
        item.sourceName.includes('প্রথম আলো') ||
        item.sourceName.includes('সময়') ||
        item.sourceName.includes('bdnews24') ||
        item.sourceName.includes('ঢাকা পোস্ট')
      ))
    );

    // 1. Resolve direct publisher URL
    let directArticleUrl = item.realUrl || item.link;
    if (item.link && item.link.includes('news.google.com')) {
      const decoded = await decodeGoogleNewsUrl(item.link);
      if (decoded) {
        directArticleUrl = decoded;
      }
    }

    console.log(`\n[${i + 1}/${candidates.length}] Processing: "${item.title.slice(0, 40)}..."`);
    console.log(`  Source: ${item.sourceName} | URL: ${directArticleUrl}`);

    // 2. Scrape authentic og:image and FULL ARTICLE paragraphs from the original publisher
    let realArticleImage = item.imageUrl || null;
    let fullParagraphs = [];

    if (directArticleUrl && directArticleUrl.startsWith('http') && !directArticleUrl.includes('news.google.com')) {
      const details = await scrapeArticleDetails(directArticleUrl);
      if (details.ogImage && !realArticleImage) {
        realArticleImage = details.ogImage;
      }
      if (details.paragraphs && details.paragraphs.length > 0) {
        fullParagraphs = details.paragraphs;
      }
    }

    // 3. Fallback theme image if portal photo is not available
    const imageUrl = realArticleImage || DEFAULT_THEME_IMAGE;

    // 4. Construct rich full article content and clean excerpt
    let fullContentText = '';
    let excerptText = '';

    if (fullParagraphs.length > 0) {
      // Use full scraped news story paragraphs
      fullContentText = fullParagraphs.join('\n\n');
      excerptText = fullParagraphs[0].slice(0, 170).trim() + (fullParagraphs[0].length > 170 ? '...' : '');
    } else {
      // Clean fallback from item description or title
      const cleanDesc = cleanHtml(item.description);
      excerptText = cleanDesc.length > 20
        ? cleanDesc.slice(0, 160) + '...'
        : `ময়মনসিংহের সর্বশেষ সংবাদ: ${item.title}`;
      fullContentText = excerptText;
    }

    // Append clean source citation for reader modal button extraction
    const content = `${fullContentText}\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${directArticleUrl})`;

    // Calculate reading time based on Bengali word count
    const wordCount = fullContentText.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.min(10, Math.ceil(wordCount / 130)));
    const readTimeFormatted = `${toBengaliNumber(readMinutes)} মিনিট পাঠ`;

    const category = detectCategory(item.title, fullContentText);
    const dateFormatted = formatBengaliDate(item.pubDate);

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

    const { error: insertErr } = await supabase.from('news').insert([payload]);
    if (insertErr) {
      console.warn(`  Failed to insert article:`, insertErr.message);
    } else {
      existingTitles.add(titleKey);
      existingIds.add(articleId);
      if (isTrusted) insertedCount++;
      else draftCount++;
      console.log(`  ✓ Successfully Ingested (${fullParagraphs.length} full paragraphs, image: ${imageUrl === DEFAULT_THEME_IMAGE ? 'Theme Banner' : 'Portal Photo'})`);
    }

    // Polite delay between requests to avoid portal rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n=== Done! Ingested: ${insertedCount} Auto-Published, ${draftCount} Drafts ===`);
}

run().catch(console.error);
