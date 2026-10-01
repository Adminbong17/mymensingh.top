import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Building2,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Send,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  const stats = [
    { label: 'নাগরিক সেবা', value: '১,০০০+', desc: 'সকল জরুরি ফোন ও তথ্য' },
    { label: 'উপজেলা কভারেজ', value: '৩৫টি (৪ জেলা)', desc: 'সমগ্র ময়মনসিংহ বিভাগ' },
    { label: 'ভেরিফাইড ব্যবসা', value: '২৫০+', desc: '১০০% সঠিক তথ্য' },
    { label: 'মাসিক ভিজিটর', value: '৫০,০০০+', desc: 'শহরবাসী ও পর্যটক' }
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'ভেরিফাইড ও নির্ভরযোগ্য তথ্য',
      desc: 'প্রতিটি রেস্টুরেন্ট, ডাক্তার, হাসপাতাল ও ব্যবসার লোকেশন ও ফোন নম্বর যাচাই করে প্রকাশ করা হয়।'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-teal-600" />,
      title: 'নাগরিক সেবায় অঙ্গীকার',
      desc: 'জরুরি রক্তের প্রয়োজনে ব্লাড ব্যাংক, শিক্ষার্থীদের টিউশন মিডিয়া ও আবাসন সন্ধান সম্পূর্ণ উন্মুক্ত ও ফ্রি।'
    },
    {
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      title: 'স্থানীয় উদ্যোক্তা বান্ধব',
      desc: 'ময়মনসিংহের ছোট-বড় সকল ব্যবসায়ীকে ডিজিটাল প্রচারের মাধ্যমে কাস্টমার সংযোগ তৈরিতে সহযোগিতা করা।'
    }
  ];

  const faqs = [
    {
      q: 'Mymensingh.top কী এবং কেন ব্যবহার করবেন?',
      a: 'Mymensingh.top হলো ময়মনসিংহ বিভাগের (ময়মনসিংহ, জামালপুর, শেরপুর ও নেত্রকোণা) আধুনিক ডিজিটাল ডিরেক্টরি ও স্মার্ট সিটি গাইড। এর মাধ্যমে বিভাগের যেকোনো হাসপাতাল, রেস্তোরাঁ, জরুরি রক্তদাতা, টিউশন, বাসা ভাড়া, সংবাদ এবং অফার সহজে খুঁজে পাওয়া যায়।'
    },
    {
      q: 'আমার ব্যবসা কীভাবে যুক্ত করব? কোনো ফি দিতে হবে?',
      a: 'আমাদের প্ল্যাটফর্মে সাধারণ লিস্টিং সম্পূর্ণ ফ্রি। উপরে থাকা "+ List Your Business" বাটনে ক্লিক করে ২ মিনিটে আপনার প্রতিষ্ঠানের নাম, ঠিকানা ও ফোন নম্বর দিয়ে সাবমিট করতে পারেন।'
    },
    {
      q: 'জরুরি রক্তের প্রয়োজনে কী করব?',
      a: 'আমাদের "Special Services" সেকশনের Blood Bank অপশনে যান। সেখানে আপনার কাঙ্ক্ষিত ব্লাড গ্রুপ ও উপজেলা অনুযায়ী সক্রিয় রক্তদাতাদের সরাসরি মোবাইল নম্বর পেয়ে যাবেন।'
    },
    {
      q: 'তথ্য পরিবর্তন বা সংশোধনের নিয়ম কী?',
      a: 'যেকোনো লিস্টিংয়ের তথ্য সংশোধন বা আপডেটের জন্য আমাদের সাপোর্ট ইমেইলে (support@mymensingh.top) অথবা নিচের কন্টাক্ট ফর্মের মাধ্যমে মেসেজ পাঠান।'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* About Hero */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-xl text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Compass className="w-3.5 h-3.5" />
              <span>About Mymensingh.top</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              আমার শহর, আমাদের ডিজিটাল গাইড
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              ঐতিহ্যবাহী ময়মনসিংহ বিভাগের (ময়মনসিংহ, জামালপুর, শেরপুর ও নেত্রকোণা) প্রতিটি নাগরিক, শিক্ষার্থী, ব্যবসায়ী এবং পর্যটকদের জন্য তথ্যপ্রযুক্তির সর্বোত্তম সেবা নিশ্চিত করতে Mymensingh.top নিবেদিত।
            </p>
          </div>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-1"
            >
              <div className="text-2xl sm:text-4xl font-black text-emerald-600">
                {s.value}
              </div>
              <div className="text-sm font-bold text-slate-800">{s.label}</div>
              <div className="text-[11px] text-slate-400">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              আমাদের মূল দর্শন ও উদ্দেশ্য
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ময়মনসিংহের নাগরিক জীবনকে সহজ ও প্রযুক্তিবান্ধব করাই আমাদের লক্ষ্য
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="p-3 rounded-2xl bg-slate-50 w-fit border border-slate-100">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900">
              প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 font-bold text-sm text-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Information */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                যোগাযোগের ঠিকানা
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                আমাদের সাথে যুক্ত হোন
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                আপনার কোনো মতামত, পরামর্শ, বিজ্ঞাপন বা অভিযোগ থাকলে সরাসরি আমাদের টিমকে জানাতে পারেন।
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">অফিসের ঠিকানা:</strong>
                  <span className="text-slate-300">
                    গাঙ্গিনার পাড় মোড়, টাউন হল এরিয়া, ময়মনসিংহ সদর, ময়মনসিংহ - ২২০০
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white">ইমেইল:</strong>
                  <a href="mailto:support@mymensingh.top" className="text-slate-300 hover:text-emerald-300">
                    support@mymensingh.top
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white">হেল্পলাইন / হোয়াটসঅ্যাপ:</strong>
                  <a href="tel:+8801711000000" className="text-slate-300 hover:text-emerald-300">
                    +880 1711-000000
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                বার্তা পাঠান (Send a Message)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                আমরা সাধারণত ২৪ ঘণ্টার মধ্যে সকল বার্তার উত্তর দিয়ে থাকি।
              </p>
            </div>

            {contactSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা দ্রুত যোগাযোগ করব।</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="০১৭১১-XXXXXX"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="যেমন: বিজ্ঞাপন / তথ্য সংশোধন"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার বার্তা *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-slate-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>বার্তা পাঠান (Send Message)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
