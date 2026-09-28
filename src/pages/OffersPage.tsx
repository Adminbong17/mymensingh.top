import React, { useState } from 'react';
import {
  Tag,
  Clock,
  Copy,
  Check,
  Building,
  Sparkles,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const OffersPage: React.FC = () => {
  const { offers } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const categories = ['All', 'Dining', 'Healthcare', 'Hotels', 'Shopping'];

  const filteredOffers = offers.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBiz = item.business_name.toLowerCase().includes(q);
      const matchPromo = item.promo_code.toLowerCase().includes(q);
      if (!matchTitle && !matchBiz && !matchPromo) return false;
    }
    return true;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Offers Hero */}
        <div className="bg-gradient-to-r from-rose-950 via-pink-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Tag className="w-3.5 h-3.5" />
              <span>Special Discounts & Deals</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              ময়মনসিংহের সেরা অফার ও ডিসকাউন্ট
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              রেস্তোরাঁর খাবার, হোটেলের রুম বুকিং, ডায়াগনস্টিক টেস্ট এবং কেনাকাটায় এক্সক্লুসিভ প্রোমো কোড ও সাশ্রয়ী অফার উপভোগ করুন।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'সকল অফার' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="অফার বা প্রতিষ্ঠানের নাম..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-rose-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl p-6 border border-slate-200">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো অফার বা ছাড় পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-400 mt-1">অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে দেখুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md flex items-center gap-1.5 animate-bounce">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{item.discount}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.business_name}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>মেয়াদ: {item.expiry_date} পর্যন্ত</span>
                    </div>
                  </div>
                </div>

                {/* Promo code copy bar */}
                <div className="p-4 px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">কোড:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-rose-600 tracking-wider">
                      {item.promo_code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.promo_code)}
                    className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      copiedCode === item.promo_code
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {copiedCode === item.promo_code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Business Offer Submit CTA */}
        <div className="bg-rose-50 rounded-3xl p-6 sm:p-8 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-rose-950">
                আপনার ব্যবসায়ের জন্য অফার বা ডিসকাউন্ট প্রচার করতে চান?
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Mymensingh.top-এর বিশেষ অফার পেজে আপনার ক্যাম্পেইন যুক্ত করে কাস্টমার সংখ্যা বহুগুণ বাড়িয়ে নিন।
              </p>
            </div>
          </div>
          <a
            href="mailto:offers@mymensingh.top"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            অফার পাবলিশ করুন
          </a>
        </div>
      </div>
    </div>
  );
};
