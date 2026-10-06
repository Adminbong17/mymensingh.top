import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Building2, MapPin, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  DIVISION_DISTRICTS,
  DISTRICT_UPAZILAS_MAP,
  MYMENSINGH_UNIONS_MAP
} from '../data/initialData';
import { VaultMediaUploader } from './VaultMediaUploader';

interface ListBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListBusinessModal: React.FC<ListBusinessModalProps> = ({ isOpen, onClose }) => {
  const { categories, mainCategories, getSubcategories, addBusiness } = useData();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState(mainCategories[0]?.slug || categories[0]?.slug || 'restaurants');
  const [subcategory, setSubcategory] = useState('');
  const [subcategorySlug, setSubcategorySlug] = useState('');
  const [district, setDistrict] = useState(DIVISION_DISTRICTS[0]);
  const [upazila, setUpazila] = useState(DISTRICT_UPAZILAS_MAP[DIVISION_DISTRICTS[0]][0]);
  const [unionWard, setUnionWard] = useState(MYMENSINGH_UNIONS_MAP[DISTRICT_UPAZILAS_MAP[DIVISION_DISTRICTS[0]][0]]?.[0] || 'সদর');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const districtUpazilas = DISTRICT_UPAZILAS_MAP[newDistrict] || [];
    const firstUpazila = districtUpazilas[0] || '';
    setUpazila(firstUpazila);
    const unions = MYMENSINGH_UNIONS_MAP[firstUpazila] || ['সদর'];
    setUnionWard(unions[0] || 'সদর');
  };

  const handleUpazilaChange = (newUpazila: string) => {
    setUpazila(newUpazila);
    const unions = MYMENSINGH_UNIONS_MAP[newUpazila] || ['সদর'];
    setUnionWard(unions[0] || 'সদর');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategoryObj = categories.find((c) => c.slug === category);

    await addBusiness({
      name,
      name_bn: nameBn || name,
      category: selectedCategoryObj?.name_en || 'Services',
      category_slug: category,
      subcategory,
      subcategory_slug: subcategorySlug,
      rating: 5.0,
      review_count: 1,
      location: location || `${unionWard}, ${upazila}, ${district}`,
      district: district,
      upazila,
      union_ward: unionWard,
      phone: phone || '+880 1700-000000',
      image_url: imageUrl || '',
      description,
      is_featured: false,
      latitude: 24.755,
      longitude: 90.403,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Mymensingh.top-এ আপনার ব্যবসা যুক্ত করুন
              </h3>
              <p className="text-xs text-emerald-100">
                Grow Your Business & Reach Thousands of Local Customers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-slate-900">
              অভিনন্দন! আপনার ব্যবসা সফলভাবে যুক্ত হয়েছে!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              আপনার লিস্টিংটি Mymensingh.top-এ যুক্ত করা হয়েছে এবং তাৎক্ষণিকভাবে প্রকাশিত হয়েছে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যবসার নাম (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Cafe & Sweets"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যবসার নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: রয়্যাল ক্যাফে অ্যান্ড সুইটস"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ক্যাটাগরি *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                    setSubcategorySlug('');
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white cursor-pointer font-medium"
                >
                  {(mainCategories.length > 0 ? mainCategories : categories).map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name_en} ({c.name_bn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  যোগাযোগ ফোন নম্বর *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: +880 1712-345678"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Subcategory selector if available */}
            {(() => {
              const availableSubs = getSubcategories(category);
              if (availableSubs.length === 0) return null;
              return (
                <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-1">
                  <label className="block text-xs font-bold text-purple-950">
                    উপ-বিভাগ / বিশেষ শাখা (ঐচ্ছিক)
                  </label>
                  <select
                    value={subcategorySlug}
                    onChange={(e) => {
                      const sub = availableSubs.find(s => s.slug === e.target.value);
                      setSubcategorySlug(e.target.value);
                      setSubcategory(sub ? (sub.name_bn || sub.name_en) : '');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 outline-hidden focus:border-purple-600 bg-white font-medium cursor-pointer"
                  >
                    <option value="">-- সুনির্দিষ্ট উপ-বিভাগ নির্বাচন করুন (ঐচ্ছিক) --</option>
                    {availableSubs.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name_bn} ({sub.name_en})
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}

            {/* Location Fields: Upazila & Union */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  জেলা *
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500 font-semibold text-slate-800"
                >
                  {DIVISION_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  উপজেলা *
                </label>
                <select
                  value={upazila}
                  onChange={(e) => handleUpazilaChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500 font-semibold text-slate-800"
                >
                  {(DISTRICT_UPAZILAS_MAP[district] || []).map((up) => (
                    <option key={up} value={up}>
                      {up}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  ইউনিয়ন / সিটি ওয়ার্ড *
                </label>
                <select
                  value={unionWard}
                  onChange={(e) => setUnionWard(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                >
                  {(MYMENSINGH_UNIONS_MAP[upazila] || ['সদর']).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সুনির্দিষ্ট ঠিকানা ও রোড নম্বর
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="যেমন: টাউন হল মোড়, কোর্ট রোড, ময়মনসিংহ সদর"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <VaultMediaUploader
              value={imageUrl}
              onChange={setImageUrl}
              label="ছবি বা লোগো (Image Upload)"
              placeholder="https://..."
              helperText="ছবি আপলোড করলে স্বয়ংক্রিয়ভাবে ক্লাউডে সেভ হবে এবং লাইভ প্রিভিউ দেখতে পাবেন।"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ব্যবসা ও সেবার বিবরণ
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="আপনার ব্যবসার বিশেষত্ব ও গ্রাহক সুবিধাসমূহ বর্ণনা করুন..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ব্যবসা সাবমিট করুন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
