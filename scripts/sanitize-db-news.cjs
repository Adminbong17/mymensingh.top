/**
 * Database News Sanitizer Script
 * Removes \uFFFD corruption and restores proper Bengali text in Supabase.
 */

const https = require('https');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'bn,en-US;q=0.7,en;q=0.3'
      }
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    }).on('error', reject);
  });
}

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

// Common dictionary fixes for words corrupted by UTF-8 chunk splits
const WORD_FIXES = [
  [/ব্\uFFFD+াংকের/g, 'ব্যাংকের'],
  [/ব্াংকের/g, 'ব্যাংকের'],
  [/ট্র\uFFFD+নচালকের/g, 'ট্রেনচালকের'],
  [/ট্রনচালকের/g, 'ট্রেনচালকের'],
  [/এনআইডি\uFFFD+/g, 'এনআইডি'],
  [/এনআইডি /g, 'এনআইডি '],
  [/ঢাকা-ময়\uFFFD+নসিংহ/g, 'ঢাকা-ময়মনসিংহ'],
  [/ঢাকা-ময়নসিংহ/g, 'ঢাকা-ময়মনসিংহ'],
  [/ঢা\uFFFD+া-ময়মনসিংহ/g, 'ঢাকা-ময়মনসিংহ'],
  [/ঢাা-ময়মনসিংহ/g, 'ঢাকা-ময়মনসিংহ'],
  [/মেডি\uFFFD+েলে/g, 'মেডিকেলে'],
  [/মেডিেলে/g, 'মেডিকেলে'],
  [/\uFFFD+াসপাতালে/g, 'হাসপাতালে'],
  [/াসপাতালে/g, 'হাসপাতালে'],
  [/ঘণ\uFFFD+টায়/g, 'ঘণ্টায়'],
  [/ঘণ্টায়/g, 'ঘণ্টায়'],
  [/এক্সক্লুস\uFFFD+ভ/g, 'এক্সক্লুসিভ'],
  [/এক্সক্লুসভ/g, 'এক্সক্লুসিভ'],
  [/রাকি\uFFFD+ুলের/g, 'রাকিবুলের'],
  [/রাকুলের/g, 'রাকিবুলের'],
  [/পালি\uFFFD+/g, 'পালিত'],
  [/পালি$/g, 'পালিত'],
  [/দাব\uFFFD+/g, 'দাবি'],
  [/\uFFFD+াড়ছে/g, 'বাড়ছে'],
  [/\uFFFD+্রাণীর/g, 'প্রাণীর'],
  [/\uFFFD+ড়িয়া/g, 'খড়িয়া'],
  [/নিয়\uFFFD+ বিরোধে/g, 'নিয়ে বিরোধে'],
  [/অন্তরঙ\uFFFD+গ/g, 'অন্তরঙ্গ'],
  [/চাহ\uFFFD+দা/g, 'চাহিদা'],
  [/ওয়ার্\uFFFD+ে/g, 'ওয়ার্ডে'],
  [/গ\uFFFD+রেফতার/g, 'গ্রেফতার']
];

function applyWordFixes(text) {
  if (!text) return '';
  let res = text;
  for (const [pattern, replacement] of WORD_FIXES) {
    res = res.replace(pattern, replacement);
  }
  // Strip any remaining \uFFFD
  res = res.replace(/\uFFFD+/g, '');
  return res.trim();
}

async function run() {
  console.log('Fetching live RSS to match exact original headlines...');
  let rssTitles = [];
  try {
    const feedXml = await fetchUrl('https://news.google.com/rss/search?q=%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9&hl=bn&gl=BD&ceid=BD:bn');
    const matches = [...feedXml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    for (const m of matches) {
      const itemXml = m[1];
      let title = cleanHtml(itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        parts.pop();
        title = parts.join(' - ').trim();
      }
      const desc = cleanHtml(itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '');
      if (title) rssTitles.push({ title, desc });
    }
    console.log(`Loaded ${rssTitles.length} fresh headlines from Google News RSS.`);
  } catch (err) {
    console.warn('Could not load RSS:', err.message);
  }

  console.log('Fetching news records from Supabase...');
  const { data: newsItems, error } = await supabase
    .from('news')
    .select('id, title, excerpt, content');

  if (error) {
    console.error('Supabase fetch error:', error);
    return;
  }

  console.log(`Checking ${newsItems.length} articles for \\uFFFD corruption...`);
  let fixedCount = 0;

  for (const item of newsItems) {
    const hasCorrupt = 
      (item.title && item.title.includes('\uFFFD')) ||
      (item.excerpt && item.excerpt.includes('\uFFFD')) ||
      (item.content && item.content.includes('\uFFFD'));

    if (!hasCorrupt) continue;

    console.log(`\nFixing corrupted item [${item.id}]:`);
    console.log(`  Before: "${item.title}"`);

    // Check if RSS has a match
    const cleanSearch = item.title.replace(/\uFFFD+/g, '');
    const matchedRss = rssTitles.find(r => {
      const words = cleanSearch.split(/\s+/).filter(w => w.length >= 3);
      if (words.length === 0) return false;
      const matchedWords = words.filter(w => r.title.includes(w));
      return (matchedWords.length / words.length) >= 0.7;
    });

    let newTitle = '';
    let newExcerpt = '';
    let newContent = '';

    if (matchedRss) {
      newTitle = matchedRss.title;
      newExcerpt = matchedRss.desc ? matchedRss.desc.slice(0, 160) + '...' : `ময়মনসিংহের সর্বশেষ সংবাদ: ${newTitle}`;
      newContent = item.content.replace(item.title, newTitle);
      newContent = applyWordFixes(newContent);
      console.log(`  After (Matched RSS): "${newTitle}"`);
    } else {
      newTitle = applyWordFixes(item.title);
      newExcerpt = applyWordFixes(item.excerpt || '');
      newContent = applyWordFixes(item.content || '');
      console.log(`  After (Pattern Clean): "${newTitle}"`);
    }

    const { error: updateErr } = await supabase
      .from('news')
      .update({
        title: newTitle,
        excerpt: newExcerpt,
        content: newContent
      })
      .eq('id', item.id);

    if (updateErr) {
      console.error(`  Error updating ${item.id}:`, updateErr.message);
    } else {
      fixedCount++;
      console.log(`  ✓ Successfully updated in Supabase`);
    }
  }

  console.log(`\n=== Finished! Repaired ${fixedCount} corrupted articles in Supabase. ===`);
}

run().catch(console.error);
