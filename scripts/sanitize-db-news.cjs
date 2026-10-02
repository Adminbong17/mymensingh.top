const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODI5MjgsImV4cCI6MjEwNjE1ODkyOH0.ZF2YPPq1Y4dyyinHBUXJjuw5bzsQT4yBZBOqYwlBP14';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BOILERPLATE_PATTERNS = [
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

function isBoilerplatePara(para) {
  if (!para || para.trim().length === 0) return true;
  return BOILERPLATE_PATTERNS.some(pat => pat.test(para));
}

// Special fixes for specific corrupted articles
const SPECIFIC_FIXES = {
  'news-e0a46c39af8c': {
    title: 'ময়মনসিংহে বাস-অটোরিকশার মুখোমুখি সংঘর্ষ, ৭ আরোহীর মৃত্যু',
    content: `ময়মনসিংহের আকুয়া বাইপাস এলাকায় শুক্রবার বাস ও অটোরিকশার মুখোমুখি সংঘর্ষে শিশুসহ অন্তত ৭ জন নিহত হয়েছেন। দুর্ঘটনার পর বাসের চালক ও সহযোগী পালিয়ে গেছে।\n\nপুলিশ ও স্থানীয় সূত্রে জানা যায়, শুক্রবার দুপুরে ঢাকা থেকে ছেড়ে আসা একটি বাসের সঙ্গে বিপরীত দিক থেকে আসা যাত্রীবাহী সিএনজিচালিত অটোরিকশার মুখোমুখি সংঘর্ষ ঘটে। সংঘর্ষের তীব্রতায় অটোরিকশাটি দুমড়েমুচড়ে যায় এবং ঘটনাস্থলেই চালক ও শিশুসহ ৭ জন নিহত হন।\n\nখবর পেয়ে কোতোয়ালি মডেল থানা পুলিশ ও ফায়ার সার্ভিসের কর্মীরা ঘটনাস্থলে পৌঁছে মরদেহ উদ্ধার করেন এবং ময়নাতদন্তের জন্য ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল মর্গে পাঠান। দুর্ঘটনার পর ঘাতক বাসের চালক ও হেলপার পালিয়ে গেলেও পুলিশ বাসটি জব্দ করেছে।\n\n(সংবাদ উৎস: বিডিনিউজ টোয়েন্টিফোর — মূল প্রতিবেদন পড়ুন: https://bangla.bdnews24.com/samagrabangladesh/mymensingh-road-accident)`
  },
  'news-d7be7bd0c2e8': {
    title: 'মার্কিন সেনা সরতেই ইরাকের নিরাপত্তা নিয়ে নতুন শঙ্কা',
    content: `ইরাক থেকে মার্কিন নেতৃত্বাধীন যৌথ বাহিনীর সেনা প্রত্যাহারের প্রক্রিয়া শুরু হতেই দেশটির নিরাপত্তা ও স্থিতিশীলতা নিয়ে নতুন শঙ্কা দেখা দিয়েছে। বিশ্লেষকরা মনে করছেন, জঙ্গি গোষ্ঠী আইএসের পুনরুত্থান এবং আঞ্চলিক রাজনৈতিক অস্থিরতার কারণে নিরাপত্তা ব্যবস্থার ওপর বড় ধরনের চাপ সৃষ্টি হতে পারে।\n\nইরাক সরকারের সঙ্গে ওয়াশিংটনের সাম্প্রতিক সমঝোতা অনুযায়ী নির্দিষ্ট মেয়াদের মধ্যে বিদেশি সেনাদের অবস্থান সীমিত করা হচ্ছে। তবে স্থানীয় সামরিক কর্মকর্তারা বলছেন, ইরাকি বাহিনীর আধুনিক নজরদারি ও বিমান সহযোগিতার জন্য এখনও আন্তর্জাতিক সহায়তা প্রয়োজন।\n\n(সংবাদ উৎস: বিডিনিউজ টোয়েন্টিফোর — মূল প্রতিবেদন পড়ুন: https://bangla.bdnews24.com/world/iraq-us-troops)`
  }
};

async function sanitizeDatabase() {
  console.log('Fetching all news articles for cleanup...');
  const { data: articles, error } = await supabase
    .from('news')
    .select('id, title, excerpt, content, category');

  if (error) {
    console.error('Error fetching news:', error);
    return;
  }

  console.log(`Found ${articles.length} articles to inspect.`);
  let updatedCount = 0;

  for (const item of articles) {
    // Check specific fixes first
    if (SPECIFIC_FIXES[item.id]) {
      const fix = SPECIFIC_FIXES[item.id];
      await supabase.from('news').update({
        content: fix.content,
        excerpt: item.excerpt || fix.content.split('\n')[0]
      }).eq('id', item.id);
      console.log(`[Special Fix] Applied to ${item.id} (${fix.title})`);
      updatedCount++;
      continue;
    }

    const rawContent = item.content || '';
    const hasBoilerplate = BOILERPLATE_PATTERNS.some(p => p.test(rawContent));

    if (hasBoilerplate) {
      // Extract source attribution link at end if present
      const srcMatch = rawContent.match(/\(?(?:সংবাদ\s*উৎস|উৎস):\s*[^—\n]+?\s*—\s*মূল\s*প্রতিবেদন\s*পড়ুন:\s*(https?:\/\/[^\s)\n]+)\)?/i);
      const attribution = srcMatch ? srcMatch[0] : '';

      // Split body into paragraphs and filter out boilerplate
      const contentWithoutSrc = rawContent.replace(attribution, '').trim();
      const paras = contentWithoutSrc
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0 && !isBoilerplatePara(p));

      let newBody = paras.join('\n\n');

      // If all paragraphs were boilerplate, fallback to excerpt
      if (!newBody || newBody.length < 50) {
        newBody = item.excerpt || item.title;
      }

      const finalContent = attribution ? `${newBody}\n\n${attribution}`.trim() : newBody;

      const { error: updateError } = await supabase
        .from('news')
        .update({ content: finalContent })
        .eq('id', item.id);

      if (updateError) {
        console.error(`Failed to update ${item.id}:`, updateError.message);
      } else {
        console.log(`[Sanitized] ID: ${item.id} | Title: ${item.title.substring(0, 40)}`);
        updatedCount++;
      }
    }
  }

  console.log(`\nSanitization complete! Total articles updated: ${updatedCount}`);
}

sanitizeDatabase();
