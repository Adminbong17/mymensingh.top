import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
          <Mail className="w-3.5 h-3.5" />
          <span>Email Bulletin</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Stay Updated
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          ময়মনসিংহের সর্বশেষ সংবাদ, বিশেষ ছাড়ের অফার এবং গুরুত্বপূর্ণ আসন্ন ইভেন্ট সংক্রান্ত আপডেট পান সরাসরি আপনার ইনবক্সে (News / Offers / Events update)।
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold inline-flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল ঠিকানা দিন..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
          <span>🔒 কোনো স্প্যাম পাঠানো হবে না</span>
          <span>•</span>
          <span>যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন</span>
        </div>

      </div>
    </section>
  );
};
