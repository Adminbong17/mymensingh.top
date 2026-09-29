/**
 * Mymensingh.top - Automated Hybrid News Fetcher & Ingestion Engine (.cjs)
 * 
 * Sources:
 * 1. Google News RSS for "ময়মনসিংহ"
 * 2. Prothom Alo Stories RSS (filtered for Mymensingh)
 * 
 * Features:
 * - Real Portal Photos: Extracts exact og:image from the publisher's article.
 * - Hybrid Mode: Mainstream media auto-published, other media kept as draft.
 * - Google News Link Decoder: Resolves Google News RSS redirect to real article URLs.
 * - Backfill Updater: Replaces placeholder images with real portal photographs.
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

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
  'bhorerkagoj.com'
];

// Fallback category images (only used if publisher has no image at all)
const CATEGORY_IMAGES = {
  Infrastructure: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  Education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  Health: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  Tourism: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  Sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  Community: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
};

// HTTP GET helper with redirect support
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

// Extracts the authentic OpenGraph or Twitter featured image from a news article URL
async function getArticleOgImage(articleUrl) {
  try {
    const html = await fetchUrl(articleUrl);
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                    html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);

    if (ogMatch && ogMatch[1].startsWith('http')) {
      const cleanImg = ogMatch[1].replace(/&amp;/g, '&').trim();
      // Filter out tiny generic icons or logos
      if (!cleanImg.includes('favicon') && !cleanImg.includes('logo_small')) {
        return cleanImg;
      }
    }
  } catch (err) {
    // Fail quietly and fall back
  }
  return null;
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

// Clean HTML tags and entities
function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\uFFFD+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
        sourceUrl
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

// Format date to readable Bengali format (e.g. "২৯ সেপ্টেম্বর, ২০২৬")
function formatBengaliDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'আজ';
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

// Backfill real portal images for existing articles in Supabase
async function backfillRealImages(limit = 15) {
  console.log(`Checking existing articles to replace placeholder images with real portal photos (Limit: ${limit})...`);
  try {
    const { data: rows, error } = await supabase
      .from('news')
      .select('id, title, content, image_url')
      .order('created_at', { ascending: false })
      .limit(60);

    if (error || !rows) return;

    const needsImage = rows.filter(r => r.image_url && r.image_url.includes('images.unsplash.com')).slice(0, limit);
    console.log(`Found ${needsImage.length} articles with stock images.`);

    for (const item of needsImage) {
      const linkMatch = item.content && item.content.match(/মূল প্রতিবেদন পড়ুন:\s*(https?:\/\/[^\s)]+)/i);
      let targetUrl = linkMatch ? linkMatch[1] : null;

      if (!targetUrl) continue;

      // If Google News link, decode it
      let realUrl = targetUrl;
      if (targetUrl.includes('news.google.com')) {
        const decoded = await decodeGoogleNewsUrl(targetUrl);
        if (decoded) {
          realUrl = decoded;
        }
      }

      console.log(`Fetching real photo for: "${item.title.slice(0, 30)}..." -> ${realUrl}`);
      const realPhoto = await getArticleOgImage(realUrl);

      if (realPhoto) {
        console.log(`  ✓ Found real photo: ${realPhoto.slice(0, 60)}...`);
        const updatedContent = item.content.replace(targetUrl, realUrl);
        await supabase
          .from('news')
          .update({
            image_url: realPhoto,
            content: updatedContent
          })
          .eq('id', item.id);
      }
    }
  } catch (e) {
    console.warn('Backfill notice:', e.message);
  }
}

// Main execution function
async function run() {
  console.log('=== Starting Mymensingh.top Automated News Ingestion with Real Photos ===');

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

  for (const item of allFeedItems) {
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

    // Extract REAL article photo
    let realArticleImage = item.imageUrl || null;
    let directArticleUrl = item.realUrl || item.link;

    if (!realArticleImage && item.link && item.link.includes('news.google.com')) {
      // Decode Google News URL to real portal article URL
      const decodedUrl = await decodeGoogleNewsUrl(item.link);
      if (decodedUrl) {
        directArticleUrl = decodedUrl;
        realArticleImage = await getArticleOgImage(decodedUrl);
      }
    }

    const category = detectCategory(item.title, item.description || '');
    const dateFormatted = formatBengaliDate(item.pubDate);
    const excerpt = item.description
      ? item.description.slice(0, 160) + '...'
      : `ময়মনসিংহের সর্বশেষ সংবাদ: ${item.title}`;

    const content = `${excerpt}\n\nময়মনসিংহ সিটি ও সংলগ্ন এলাকার স্থানীয় খবরের বিস্তারিত তথ্যের জন্য মূল সংবাদ লিংকে প্রবেশ করুন।\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${directArticleUrl})`;

    // Use REAL photo from portal, or fallback only if unavailable
    const imageUrl = realArticleImage || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Community;

    const payload = {
      id: articleId,
      title: item.title,
      excerpt: excerpt,
      category: category,
      date: dateFormatted,
      image_url: imageUrl,
      read_time: '২ মিনিট পাঠ',
      content: content
    };

    console.log(`[${isTrusted ? 'AUTO-PUBLISH' : 'DRAFT'}] Ingesting: ${item.title} (${item.sourceName})`);
    if (realArticleImage) {
      console.log(`  📸 Real Portal Photo: ${realArticleImage.slice(0, 70)}...`);
    }

    const { error: insertErr } = await supabase.from('news').insert([payload]);
    if (insertErr) {
      console.warn(`Failed to insert article "${item.title}":`, insertErr.message);
    } else {
      existingTitles.add(titleKey);
      existingIds.add(articleId);
      if (isTrusted) {
        insertedCount++;
      } else {
        draftCount++;
      }
    }
  }

  console.log(`=== Done! Auto-Published: ${insertedCount}, Drafts: ${draftCount} ===`);

  // Run backfill to update existing stock images with real news photos
  await backfillRealImages(25);
}

run().catch(console.error);
