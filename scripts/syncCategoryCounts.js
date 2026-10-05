import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU4MjkyOCwiZXhwIjoyMTA2MTU4OTI4fQ.1NWqRMe_VQnkXtlUMEscuwUvHnolwt7HWjpdJitW5Is';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncCounts() {
  const { data: cats } = await supabase.from('categories').select('*');
  const { data: biz } = await supabase.from('businesses').select('id, category_slug');
  const counts = {};
  biz.forEach(b => {
    const s = b.category_slug || '';
    counts[s] = (counts[s] || 0) + 1;
  });
  console.log('Business counts by category_slug:', counts);

  for (const cat of cats) {
    const realCount = counts[cat.slug] || 0;
    if (cat.count !== realCount) {
      await supabase.from('categories').update({ count: realCount }).eq('id', cat.id);
      console.log(`Updated count for ${cat.name_en} (${cat.slug}) from ${cat.count} to ${realCount}`);
    }
  }
}

syncCounts();
