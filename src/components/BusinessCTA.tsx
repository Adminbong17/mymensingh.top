import { PlusCircle, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

interface BusinessCTAProps {
  onOpenListBusiness: () => void;
}

export const BusinessCTA: React.FC<BusinessCTAProps> = ({ onOpenListBusiness }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient blurred circles */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>Grow Your Business</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Mymensingh.top-এ আপনার ব্যবসা যুক্ত করুন
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              ময়মনসিংহের প্রতিদিন হাজার হাজার ক্রেতা ও সেবাগ্রহীতার কাছে আপনার রেস্তোরাঁ, দোকান, ক্লিনিক, ফার্মেসি কিংবা পেশাদার সেবার তথ্য তুলে ধরুন। সম্পূর্ণ ফ্রি ও ঝামেলামুক্ত প্রক্রিয়ায় যুক্ত হোন আমাদের ডিজিটাল ডিরেক্টরিতে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সরাসরি কল ও কাস্টমার ট্রাফিক</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>গুগল ম্যাপে লোকেশন ও ডিরেকশন</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>রিভিউ ও কাস্টমার রেটিং সুবিধা</span>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  আজই শুরু করুন
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  মাত্র ২ মিনিটে আপনার ব্যবসার প্রোফাইল প্রকাশ করুন
                </p>
              </div>

              <button
                onClick={onOpenListBusiness}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>List Your Business</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
