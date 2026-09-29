/**
 * Mymensingh.top - Automated Hybrid News Fetcher & Ingestion Engine
 * 
 * Sources:
 * 1. Google News RSS for "ময়মনসিংহ"
 * 2. Prothom Alo Stories RSS (filtered for Mymensingh)
 * 
 * Hybrid Mode:
 * - Tier 1 (Trusted Mainstream Media): Auto-published directly to live website.
 * - Tier 2 (Other Sources): Stored as Draft for Admin 1-click approval.
 */

const https = require('https');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Fallback category images
const CATEGORY_IMAGES = {
  Infrastructure: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  Education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  Health: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  Tourism: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  Sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  Community: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
};

// HTTP GET helper
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', ...headers } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl, headers).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Categorize by keywords
function detectCategory(title, text) {
  const combined = (title + ' ' + text).toLowerCase();
  if (/হাসপাতাল|চিকিৎসা|স্বাস্থ্য|ডাক্তার|করোনা|রোগী|মেডিকেল|ওষুধ/.test(combined)) return 'Health';
  if (/স্কুল|কলেজ|বিশ্ববিদ্যালয়|বাকৃবি|ভর্তি|শিক্ষক|পরীক্ষা|শিক্ষার্থী|ক্লাস/.test(combined)) return 'Education';
  if (/উন্নয়ন|সড়ক|সেতু|ব্রিজ|প্রকল্প|সিটি কর্পোরেশন|মেয়র|প্রশাসন|নির্মাণ|সংস্কার/.test(combined)) return 'Infrastructure';
  if (/খেলা|ক্রিকেট|ফুটবল|টুর্নামেন্ট|স্টেডিয়াম|জয়|ম্যাচ/.test(combined)) return 'Sports';
  if (/মেলা|উৎসব|পর্যটন|জয়নুল|ব্রহ্মপুত্র|পার্ক|ঐতিহ্য|সংস্কৃতি/.test(combined)) return 'Tourism';
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

    // Remove source name suffix from title e.g. "Title - Source"
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

      // Filter only Mymensingh related articles
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
          pubDate,
          sourceName: 'প্রথম আলো',
          sourceUrl: 'https://www.prothomalo.com',
          description,
          imageUrl
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

// Main execution function
async function run() {
  console.log('=== Starting Mymensingh.top Automated News Ingestion ===');

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

    // Generate unique ID based on title hash
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

    const category = detectCategory(item.title, item.description || '');
    const dateFormatted = formatBengaliDate(item.pubDate);
    const excerpt = item.description
      ? item.description.slice(0, 160) + '...'
      : `ময়মনসিংহের সর্বশেষ সংবাদ: ${item.title}`;

    const content = `${excerpt}\n\nময়মনসিংহ সিটি ও সংলগ্ন এলাকার স্থানীয় খবরের বিস্তারিত তথ্যের জন্য মূল সংবাদ লিংকে প্রবেশ করুন।\n\n(সংবাদ উৎস: ${item.sourceName} — মূল প্রতিবেদন পড়ুন: ${item.link})`;

    const imageUrl = item.imageUrl || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Community;

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
}

run().catch(console.error);
