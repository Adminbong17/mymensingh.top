import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Flame,
  Ambulance,
  Droplet,
  Hospital,
  Clock,
  MapPin,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const EmergencyDirectory: React.FC = () => {
  const { language } = useLanguage();
  const { emergencyContacts } = useData();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital':
        return <Hospital className="w-5 h-5 text-emerald-600" />;
      case 'police':
        return <ShieldAlert className="w-5 h-5 text-blue-600" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'ambulance':
        return <Ambulance className="w-5 h-5 text-rose-600" />;
      case 'blood':
        return <Droplet className="w-5 h-5 text-red-600" />;
      default:
        return <PhoneCall className="w-5 h-5 text-indigo-600" />;
    }
  };

  const filteredContacts = emergencyContacts.filter((contact) => {
    if (selectedCat === 'all') return true;
    return contact.category === selectedCat;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-200 text-xs font-bold mb-3 border border-white/10">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'bn' ? '২৪ ঘণ্টা জরুরি হেল্পলাইন সেবা' : '24/7 Rapid Emergency Response'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'bn' ? 'ময়মনসিংহ জরুরি সেবা ও ডিরেক্টরি' : 'Mymensingh Emergency Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-2 leading-relaxed">
            {language === 'bn'
              ? 'ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (মমেকহ), কোতোয়ালী থানা, ফায়ার সার্ভিস, রক্তদাতা নেটওয়ার্ক এবং সরকারি অ্যাম্বুলেন্সের সরাসরি যোগাযোগ নম্বর।'
              : 'Direct hotline access for Mymensingh Medical College Hospital (MMCH), Kotwali Police, Fire Brigade, Sandhani Blood Bank & Ambulance.'}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="tel:999"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-rose-700 font-extrabold text-sm shadow-md hover:bg-rose-50 transition-all"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{language === 'bn' ? 'জাতীয় জরুরি কল: ৯৯৯' : 'National Emergency: 999'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', en: 'All Services', bn: 'সকল সেবা' },
          { id: 'hospital', en: 'Hospitals', bn: 'হাসপাতাল' },
          { id: 'police', en: 'Police', bn: 'পুলিশ স্টেশন' },
          { id: 'fire', en: 'Fire Service', bn: 'ফায়ার সার্ভিস' },
          { id: 'ambulance', en: 'Ambulance', bn: 'অ্যাম্বুলেন্স' },
          { id: 'blood', en: 'Blood Banks', bn: 'ব্লাড ব্যাংক' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCat === cat.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'bn' ? cat.bn : cat.en}
          </button>
        ))}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const title = language === 'bn' ? contact.title_bn : contact.title_en;
          const address = language === 'bn' ? contact.address_bn : contact.address_en;

          return (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getCategoryIcon(contact.category)}
                  </div>
                  {contact.is_24_hours && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      24/7 Available
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{address}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{contact.phone}</span>
                </a>

                <button
                  onClick={() => handleCopy(contact.id, contact.phone)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Copy number"
                >
                  {copiedId === contact.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
