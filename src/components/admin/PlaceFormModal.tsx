import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Sparkles } from 'lucide-react';
import type { Place } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { VaultMediaUploader } from '../VaultMediaUploader';

interface PlaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeToEdit?: Place | null;
}

export const PlaceFormModal: React.FC<PlaceFormModalProps> = ({
  isOpen,
  onClose,
  placeToEdit,
}) => {
  const { language, t } = useLanguage();
  const { categories, mainCategories, getSubcategories, addPlace, updatePlace } = useData();

  const [formData, setFormData] = useState<Partial<Place>>({
    name_en: '',
    name_bn: '',
    tagline_en: '',
    tagline_bn: '',
    description_en: '',
    description_bn: '',
    category_id: mainCategories[0]?.id || categories[0]?.id || 'cat-heritage',
    subcategory: '',
    subcategory_slug: '',
    area: 'Town Hall',
    address_en: '',
    address_bn: '',
    latitude: 24.7550,
    longitude: 90.4030,
    image_url: '',
    phone: '',
    website: '',
    opening_hours_en: '',
    opening_hours_bn: '',
    entry_fee_en: '',
    entry_fee_bn: '',
    is_featured: false,
    tags: [],
    rating: 4.8,
    review_count: 1,
  });

  const [tagsString, setTagsString] = useState('');

  useEffect(() => {
    if (placeToEdit) {
      setFormData(placeToEdit);
      setTagsString(placeToEdit.tags ? placeToEdit.tags.join(', ') : '');
    } else {
      setFormData({
        name_en: '',
        name_bn: '',
        tagline_en: '',
        tagline_bn: '',
        description_en: '',
        description_bn: '',
        category_id: categories[0]?.id || 'cat-heritage',
        area: 'Town Hall',
        address_en: '',
        address_bn: '',
        latitude: 24.7550,
        longitude: 90.4030,
        image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
        phone: '',
        website: '',
        opening_hours_en: '',
        opening_hours_bn: '',
        entry_fee_en: '',
        entry_fee_bn: '',
        is_featured: false,
        tags: ['Mymensingh', 'Attraction'],
        rating: 4.8,
        review_count: 1,
      });
      setTagsString('Mymensingh, Attraction');
    }
  }, [placeToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategory = categories.find((c) => c.id === formData.category_id);
    const parsedTags = tagsString
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      category_slug: selectedCategory?.slug || 'heritage',
      tags: parsedTags,
      latitude: Number(formData.latitude) || 24.7550,
      longitude: Number(formData.longitude) || 90.4030,
    } as Omit<Place, 'id'>;

    if (placeToEdit) {
      await updatePlace(placeToEdit.id, payload);
    } else {
      await addPlace(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Form Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {placeToEdit ? t('edit_place') : t('add_place')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'ময়মনসিংহের দর্শনীয় স্থানের বিবরণ' : 'Manage city place information'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          
          {/* Basic Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('place_name_en')} *
              </label>
              <input
                type="text"
                required
                value={formData.name_en || ''}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="e.g. Shashi Lodge"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('place_name_bn')} *
              </label>
              <input
                type="text"
                required
                value={formData.name_bn || ''}
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                placeholder="যেমন: শশী লজ (ময়মনসিংহ রাজবাড়ী)"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('category')} *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({
                  ...formData,
                  category_id: e.target.value,
                  subcategory: '',
                  subcategory_slug: ''
                })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white cursor-pointer"
              >
                {(mainCategories.length > 0 ? mainCategories : categories).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en} ({c.name_bn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('area')} *
              </label>
              <input
                type="text"
                required
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. Town Hall, BAU Campus, Muktagacha"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Subcategory if available */}
          {(() => {
            const currentCat = categories.find(c => c.id === formData.category_id);
            const availableSubs = currentCat ? getSubcategories(currentCat.slug || currentCat.id) : [];
            if (availableSubs.length === 0) return null;
            return (
              <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-1">
                <label className="block text-xs font-bold text-purple-950">
                  উপ-বিভাগ (Subcategory - Optional)
                </label>
                <select
                  value={formData.subcategory_slug || ''}
                  onChange={(e) => {
                    const sub = availableSubs.find(s => s.slug === e.target.value);
                    setFormData({
                      ...formData,
                      subcategory_slug: e.target.value,
                      subcategory: sub ? (sub.name_bn || sub.name_en) : ''
                    });
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-purple-200 outline-hidden focus:border-purple-600 bg-white font-medium cursor-pointer"
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

          {/* Taglines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tagline_en')}
              </label>
              <input
                type="text"
                value={formData.tagline_en || ''}
                onChange={(e) => setFormData({ ...formData, tagline_en: e.target.value })}
                placeholder="Short highlight in English"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tagline_bn')}
              </label>
              <input
                type="text"
                value={formData.tagline_bn || ''}
                onChange={(e) => setFormData({ ...formData, tagline_bn: e.target.value })}
                placeholder="এক লাইনে আকর্ষণীয় তথ্য"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('description_en')} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Detailed history and features in English..."
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('description_bn')} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description_bn || ''}
                onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                placeholder="পূর্ণাঙ্গ ইতিহাস ও বৈশিষ্ট্য বাংলায়..."
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Coordinates (Latitude, Longitude) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Map Coordinates (Latitude & Longitude in Mymensingh)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Latitude (e.g. 24.7577)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude ?? ''}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Longitude (e.g. 90.4042)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude ?? ''}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Image Upload via FileVault */}
          <VaultMediaUploader
            value={formData.image_url || ''}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label={`${t('image_url')} (FileVault Media)`}
            required
            helperText="সরাসরি vault.bongbangla.top-এ আপলোড হয়ে সুপাবেজ ডাটাবেজের সাথে লাইভ কানেক্ট হবে।"
          />

          {/* Contact & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('phone')}
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 1711-xxxxxx"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('website')}
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tags & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tags')}
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Palace, Heritage, Photography"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="is_featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                {t('is_featured')}
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{t('save_changes')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
