import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oxdywhgcdqkdxmnzlofg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZHl3aGdjZHFrZHhtbnpsb2ZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU4MjkyOCwiZXhwIjoyMTA2MTU4OTI4fQ.1NWqRMe_VQnkXtlUMEscuwUvHnolwt7HWjpdJitW5Is';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DOCTOR_SUBCATS = [
  { id: 'sub-doc-1', name_en: 'Medicine Specialist', name_bn: 'মেডিসিন বিশেষজ্ঞ', slug: 'medicine-specialist', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 1, count: 0 },
  { id: 'sub-doc-2', name_en: 'Child & Pediatrician', name_bn: 'শিশু ও নবজাতক রোগ', slug: 'child-pediatrician', icon: 'Baby', color: 'teal', parent_id: 'cat-doctor', order_index: 2, count: 0 },
  { id: 'sub-doc-3', name_en: 'Gynecology & Obstetrics', name_bn: 'গাইনি ও প্রসূতি বিশেষজ্ঞ', slug: 'gynecology-obstetrics', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 3, count: 0 },
  { id: 'sub-doc-4', name_en: 'Cardiology (Heart)', name_bn: 'হৃদরোগ বিশেষজ্ঞ (কার্ডিওলজি)', slug: 'cardiology', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 4, count: 0 },
  { id: 'sub-doc-5', name_en: 'Orthopedics', name_bn: 'অর্থোপেডিক ও হাড় জোড়া', slug: 'orthopedics', icon: 'Hammer', color: 'teal', parent_id: 'cat-doctor', order_index: 5, count: 0 },
  { id: 'sub-doc-6', name_en: 'Skin, Allergy & VD', name_bn: 'চর্ম, অ্যালার্জি ও যৌন রোগ', slug: 'skin-allergy-vd', icon: 'Sparkles', color: 'teal', parent_id: 'cat-doctor', order_index: 6, count: 0 },
  { id: 'sub-doc-7', name_en: 'Dental Surgeon', name_bn: 'ডেন্টাল সার্জন ও দন্ত বিশেষজ্ঞ', slug: 'dental-surgeon', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 7, count: 0 },
  { id: 'sub-doc-8', name_en: 'Eye Specialist', name_bn: 'চক্ষু বিশেষজ্ঞ (অপথ্যালমোলজি)', slug: 'eye-specialist', icon: 'Glasses', color: 'teal', parent_id: 'cat-doctor', order_index: 8, count: 0 },
  { id: 'sub-doc-9', name_en: 'ENT Specialist', name_bn: 'নাক, কান ও গলা বিশেষজ্ঞ', slug: 'ent-specialist', icon: 'Stethoscope', color: 'teal', parent_id: 'cat-doctor', order_index: 9, count: 0 },
  { id: 'sub-doc-10', name_en: 'Urology & Kidney', name_bn: 'ইউরোলজি ও কিডনি রোগ', slug: 'urology-kidney', icon: 'Activity', color: 'teal', parent_id: 'cat-doctor', order_index: 10, count: 0 },
  { id: 'sub-doc-11', name_en: 'Neurology & Brain', name_bn: 'নিউরোমেডিসিন ও স্নায়ুরোগ', slug: 'neurology', icon: 'Brain', color: 'teal', parent_id: 'cat-doctor', order_index: 11, count: 0 },
  { id: 'sub-doc-12', name_en: 'Oncology / Cancer', name_bn: 'ক্যান্সার ও টিউমার বিশেষজ্ঞ', slug: 'oncology-cancer', icon: 'ShieldAlert', color: 'teal', parent_id: 'cat-doctor', order_index: 12, count: 0 },
  { id: 'sub-doc-13', name_en: 'Gastroenterology & Liver', name_bn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার', slug: 'gastroenterology-liver', icon: 'HeartPulse', color: 'teal', parent_id: 'cat-doctor', order_index: 13, count: 0 },
  { id: 'sub-doc-14', name_en: 'Surgery & Laparoscopy', name_bn: 'সার্জারি ও ল্যাপারোস্কপিক', slug: 'surgery-laparoscopy', icon: 'Scissors', color: 'teal', parent_id: 'cat-doctor', order_index: 14, count: 0 },
];

async function syncCategories() {
  console.log('Syncing doctor categories to Supabase...');
  for (const cat of DOCTOR_SUBCATS) {
    const { error } = await supabase.from('categories').upsert({
      id: cat.id,
      name_en: cat.name_en,
      name_bn: cat.name_bn,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      parent_id: cat.parent_id,
      order_index: cat.order_index,
      count: cat.count || 0
    }, { onConflict: 'id' });
    if (error) console.error(`Error syncing category ${cat.name_en}:`, error);
    else console.log(`✓ Synced subcategory: ${cat.name_bn}`);
  }
  console.log('Categories sync complete.');
}

syncCategories();
