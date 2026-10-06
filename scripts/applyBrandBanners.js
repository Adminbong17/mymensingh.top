import { createClient } from '@supabase/supabase-js';
import { generateBrandBannerSvg } from '../src/lib/brandBannerUtils.ts';

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU4MjkyOCwiZXhwIjoyMTA2MTU4OTI4fQ.1NWqRMe_VQnkXtlUMEscuwUvHnolwt7HWjpdJitW5Is';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Fetching non-doctor businesses & brand shops from Supabase...');
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, name_bn, category, category_slug, location, phone')
    .not('category_slug', 'in', '("doctors","doctor")');

  if (error) {
    console.error('Error fetching businesses:', error);
    return;
  }

  console.log(`Found ${businesses.length} brand shops & businesses. Applying mymensingh.top branded banner SVG cards...`);

  let count = 0;
  for (const b of businesses) {
    const bannerUrl = generateBrandBannerSvg(
      b.name_bn || b.name,
      b.name,
      b.category,
      b.location,
      b.phone
    );

    const { error: updateErr } = await supabase
      .from('businesses')
      .update({
        image_url: bannerUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', b.id);

    if (updateErr) {
      console.error(`Failed to update ${b.name}:`, updateErr);
    } else {
      count++;
      console.log(`✓ [${count}/${businesses.length}] Applied branded banner for: ${b.name_bn || b.name} (${b.name})`);
    }
  }

  console.log('All brand shops & businesses have been updated with mymensingh.top theme images!');
}

run();
