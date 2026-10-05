import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU4MjkyOCwiZXhwIjoyMTA2MTU4OTI4fQ.1NWqRMe_VQnkXtlUMEscuwUvHnolwt7HWjpdJitW5Is';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: allBiz, error } = await supabase.from('businesses').select('*');
  if (error) {
    console.error('Error fetching businesses:', error);
    return;
  }

  const doctors = allBiz.filter(b => 
    b.category_slug === 'doctors' || 
    b.category_slug === 'doctor' || 
    b.category === 'Doctors' || 
    b.category === 'Doctor' ||
    b.category_id === 'cat-doctor'
  );

  const nonDoctors = allBiz.filter(b => 
    b.category_slug !== 'doctors' && 
    b.category_slug !== 'doctor' && 
    b.category !== 'Doctors' && 
    b.category !== 'Doctor' &&
    b.category_id !== 'cat-doctor'
  );

  console.log(`Total: ${allBiz.length}, Doctors: ${doctors.length}, Non-doctors: ${nonDoctors.length}`);
  console.log('Non-doctor businesses:');
  console.log(JSON.stringify(nonDoctors.map(b => ({ id: b.id, name: b.name, category: b.category, is_featured: b.is_featured })), null, 2));

  // Set is_featured = false for all doctors in Supabase
  const featuredDoctors = doctors.filter(d => d.is_featured);
  console.log(`Found ${featuredDoctors.length} doctors with is_featured = true. Updating them to false...`);
  if (featuredDoctors.length > 0) {
    const { error: updateErr } = await supabase
      .from('businesses')
      .update({ is_featured: false })
      .or('category_slug.eq.doctors,category_slug.eq.doctor,category.eq.Doctors,category.eq.Doctor,category_id.eq.cat-doctor');
    
    if (updateErr) {
      console.error('Update error:', updateErr);
    } else {
      console.log('Successfully set is_featured = false for all doctor records in Supabase.');
    }
  }
}

run();
