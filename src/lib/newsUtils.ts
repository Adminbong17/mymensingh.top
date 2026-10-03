import type { NewsArticle } from '../types';

/**
 * Utility to parse news content, strip raw URLs, HTML tags, and repetitive boilerplates,
 * and extract source name and external link for clean UI display.
 */
export interface ParsedNewsContent {
  cleanBody: string;
  sourceName: string | null;
  sourceUrl: string | null;
}

const BENGALI_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const BENGALI_MONTHS: Record<string, number> = {
  'জানুয়ারি': 0, 'জানুয়ারি': 0,
  'ফেব্রুয়ারি': 1, 'ফেব্রুয়ারি': 1,
  'মার্চ': 2,
  'এপ্রিল': 3,
  'মে': 4,
  'জুন': 5,
  'জুলাই': 6,
  'আগস্ট': 7,
  'সেপ্টেম্বর': 8,
  'অক্টোবর': 9,
  'নভেম্বর': 10,
  'ডিসেম্বর': 11
};

/**
 * Parse news article date string (supports Bengali format e.g. "২৯ সেপ্টেম্বর, ২০২৬",
 * ISO timestamp, or standard Date format) into numeric timestamp in milliseconds.
 */
export function parseNewsTimestamp(dateStr?: string, createdAt?: string): number {
  if (createdAt) {
    const t = new Date(createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (!dateStr) return 0;

  // Try standard JS Date parsing
  const directDate = new Date(dateStr).getTime();
  if (!isNaN(directDate) && directDate > 0) return directDate;

  // Convert Bengali digits to English
  const normalized = dateStr.replace(/[০-৯]/g, (d) => BENGALI_DIGITS[d] || d);

  // Match: Day Month Year (e.g., "29 সেপ্টেম্বর, 2026")
  const match = normalized.match(/(\d{1,2})\s*([^\d,\s]+),?\s*(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].trim();
    const year = parseInt(match[3], 10);
    const month = BENGALI_MONTHS[monthName];
    if (month !== undefined) {
      return new Date(year, month, day).getTime();
    }
  }

  return 0;
}

/**
 * Sorts news articles by recency (newest first) based on their source date or created_at timestamp.
 */
export function sortNewsByDate(articles: NewsArticle[]): NewsArticle[] {
  if (!articles || articles.length === 0) return [];
  return [...articles].sort((a, b) => {
    const timeA = parseNewsTimestamp(a.date, (a as any).created_at);
    const timeB = parseNewsTimestamp(b.date, (b as any).created_at);
    return timeB - timeA;
  });
}

/**
 * Normalizes Bengali and Latin punctuation marks so they do not break across lines or distort:
 * - Strips trailing publisher junk (e.g. "| বাংলাদেশ সংবাদ সংস্থা (বাসস)", "| প্রথম আলো")
 * - Converts curly quotes and non-standard dashes to clean, readable standard forms
 * - Removes unnatural spaces before colons, commas, semicolons, and Bengali Dari
 * - Ensures uniform spacing without breaking word conjuncts
 */
export function normalizePunctuation(str: string): string {
  if (!str) return '';
  return str
    // Strip trailing publisher suffix pipes from titles (e.g. | খেলাধুলা | বাংলাদেশ সংবাদ সংস্থা)
    .replace(/[ \t]*\|\s*[\s\S]*$/g, '')
    // Normalize quotes
    .replace(/[\u2018\u2019]/g, "'") // Left/Right single quotation mark (‘, ’)
    .replace(/[\u201C\u201D]/g, '"') // Left/Right double quotation mark (“, ”)
    // Normalize en-dash and em-dash with clean spaced hyphen so words don't break improperly
    .replace(/[ \t]*[\u2013\u2014][ \t]*/g, ' - ')
    // Fix spaces before punctuation (never allow punctuation to break onto a new line)
    .replace(/[ \t]+([,:;?!।])/g, '$1')
    // Fix missing space after punctuation (protecting URLs)
    .replace(/(https?:\/\/[^\s]+)|([,:;?!।])([^\s0-9'",।?!:;\r\n])/gi, (_m, url, punc, char) => {
      if (url) return url;
      return punc + ' ' + char;
    })
    // Remove replacement character \uFFFD if present anywhere
    .replace(/\uFFFD+/g, '')
    // Collapse horizontal whitespace only (spaces/tabs), preserving newlines!
    .replace(/[^\S\r\n]+/g, ' ')
    // Normalize multiple consecutive blank lines to max double newline
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function cleanNewsText(text: string): string {
  if (!text) return '';
  const stripped = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<a[\s\S]*?<\/a>/gi, ' ')
    .replace(/<a[\s\S]*$/gi, ' ')
    .replace(/\uFFFD+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return normalizePunctuation(stripped);
}

const JUNK_LINE_PATTERNS = [
  /©\s*\d{4}\s*thedailystar\.net/i,
  /Powered by:\s*RSI Lab/i,
  /Copyright:\s*Any unauthorized use/i,
  /বিডিনিউজ টোয়েন্টিফোর ডটকম নিউজ সার্ভিস/i,
  /রাজনৈতিক অস্থিরতার ‘ভরকেন্দ্র’/i,
  /রাজনৈতিক অস্থিরতার 'ভরকেন্দ্র'/i,
  /নারী ক্রিকেটের সংস্কার/i,
  /হকার উচ্ছেদ কি ঢাকার/i,
  /ভাতের নাকি অনুভূতির অভাব/i,
  /app_installed/i,
  /Google News-এ ফলো করুন/i,
  /ফেসবুক পেজে লাইক দিন/i,
  /সর্বস্বত্ব স্বত্বাধিকার সংরক্ষিত/i
];

function purgeJunkLines(text: string): string {
  if (!text) return '';
  return text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !JUNK_LINE_PATTERNS.some(p => p.test(line)))
    .join('\n\n');
}

export function parseArticleSource(rawContent: string): ParsedNewsContent {
  if (!rawContent) {
    return { cleanBody: '', sourceName: null, sourceUrl: null };
  }

  // Remove any remaining \uFFFD replacement characters & HTML tags
  let sanitized = rawContent
    .replace(/\uFFFD+/g, '')
    .replace(/<a[\s\S]*?<\/a>/gi, ' ')
    .replace(/<a[\s\S]*$/gi, ' ')
    .trim();

  // Pattern: (সংবাদ উৎস: [উৎস নাম] — মূল প্রতিবেদন পড়ুন: [URL])
  const match = sanitized.match(/\(?(?:সংবাদ\s*উৎস|উৎস):\s*([^—\n]+?)\s*—\s*মূল\s*প্রতিবেদন\s*পড়ুন:\s*(https?:\/\/[^\s)\n]+)\)?/i);

  if (match) {
    const sourceName = normalizePunctuation(match[1].trim());
    const sourceUrl = match[2].trim();

    let rawBody = sanitized
      .replace(/\n*\(?(?:সংবাদ\s*উৎস|উৎস):.*$/is, '')
      .replace(/\n*ময়মনসিংহ\s*(?:সিটি|বিভাগ)?\s*ও?\s*সংলগ্ন\s*এলাকার\s*স্থানীয়\s*খবরের\s*বিস্তারিত\s*তথ্যের\s*জন্য\s*মূল\s*সংবাদ\s*লিংকে\s*প্রবেশ\s*করুন।?/g, '')
      .replace(/<[^>]+>/g, ' ')
      .trim();

    const cleanBody = purgeJunkLines(rawBody);
    return { cleanBody: normalizePunctuation(cleanBody), sourceName, sourceUrl };
  }

  // Fallback: Check if there's any http/https URL in the content
  const urlFallback = sanitized.match(/(https?:\/\/[^\s)\n]+)/i);
  if (urlFallback) {
    const sourceUrl = urlFallback[1].trim();
    let rawBody = sanitized
      .replace(sourceUrl, '')
      .replace(/\(?(?:সংবাদ\s*উৎস|উৎস|মূল\s*প্রতিবেদন\s*পড়ুন)[:\s—\-]*\)?/gi, '')
      .replace(/\n*ময়মনসিংহ\s*(?:সিটি|বিভাগ)?\s*ও?\s*সংলগ্ন\s*এলাকার\s*স্থানীয়\s*খবরের\s*বিস্তারিত\s*তথ্যের\s*জন্য\s*মূল\s*সংবাদ\s*লিংকে\s*প্রবেশ\s*করুন।?/g, '')
      .replace(/<[^>]+>/g, ' ')
      .trim();

    const cleanBody = purgeJunkLines(rawBody);
    return { cleanBody: normalizePunctuation(cleanBody), sourceName: 'মূল পোর্টাল', sourceUrl };
  }

  const cleanBody = purgeJunkLines(sanitized.replace(/<[^>]+>/g, ' ').trim());
  return { cleanBody: normalizePunctuation(cleanBody), sourceName: null, sourceUrl: null };
}
