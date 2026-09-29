/**
 * Utility to parse news content, strip raw URLs and repetitive boilerplates,
 * and extract source name and external link for clean UI display.
 */
export interface ParsedNewsContent {
  cleanBody: string;
  sourceName: string | null;
  sourceUrl: string | null;
}

export function parseArticleSource(rawContent: string): ParsedNewsContent {
  if (!rawContent) {
    return { cleanBody: '', sourceName: null, sourceUrl: null };
  }

  // Remove any remaining \uFFFD replacement characters
  const sanitized = rawContent.replace(/\uFFFD+/g, '').trim();

  // Pattern: (সংবাদ উৎস: [উৎস নাম] — মূল প্রতিবেদন পড়ুন: [URL])
  const match = sanitized.match(/\(?(?:সংবাদ\s*উৎস|উৎস):\s*([^—\n]+?)\s*—\s*মূল\s*প্রতিবেদন\s*পড়ুন:\s*(https?:\/\/[^\s)\n]+)\)?/i);

  if (match) {
    const sourceName = match[1].trim();
    const sourceUrl = match[2].trim();

    const cleanBody = sanitized
      .replace(/\n*\(?(?:সংবাদ\s*উৎস|উৎস):.*$/is, '')
      .replace(/\n*ময়মনসিংহ\s*সিটি\s*ও\s*সংলগ্ন\s*এলাকার\s*স্থানীয়\s*খবরের\s*বিস্তারিত\s*তথ্যের\s*জন্য\s*মূল\s*সংবাদ\s*লিংকে\s*প্রবেশ\s*করুন।?/g, '')
      .trim();

    return { cleanBody, sourceName, sourceUrl };
  }

  // Fallback: Check if there's any http/https URL in the content
  const urlFallback = sanitized.match(/(https?:\/\/[^\s)\n]+)/i);
  if (urlFallback) {
    const sourceUrl = urlFallback[1].trim();
    const cleanBody = sanitized
      .replace(sourceUrl, '')
      .replace(/\(?(?:সংবাদ\s*উৎস|উৎস|মূল\s*প্রতিবেদন\s*পড়ুন)[:\s—\-]*\)?/gi, '')
      .replace(/\n*ময়মনসিংহ\s*সিটি\s*ও\s*সংলগ্ন\s*এলাকার\s*স্থানীয়\s*খবরের\s*বিস্তারিত\s*তথ্যের\s*জন্য\s*মূল\s*সংবাদ\s*লিংকে\s*প্রবেশ\s*করুন।?/g, '')
      .trim();
    return { cleanBody, sourceName: 'মূল পোর্টাল', sourceUrl };
  }

  return { cleanBody: sanitized, sourceName: null, sourceUrl: null };
}
