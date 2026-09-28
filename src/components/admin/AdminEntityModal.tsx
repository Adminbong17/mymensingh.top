import React, { useState } from 'react';
import {
  X,
  Newspaper,
  Calendar,
  Tag,
  Heart,
  GraduationCap,
  Home,
  CheckCircle,
  AlertCircle,
  Upload
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export type EntityModalType = 'news' | 'event' | 'offer' | 'donor' | 'tuition' | 'tolet' | null;

interface AdminEntityModalProps {
  type: EntityModalType;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminEntityModal: React.FC<AdminEntityModalProps> = ({ type, isOpen, onClose }) => {
  const { addNews, addEvent, addOffer, addBloodDonor, addTuition, addToLet } = useData();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  // 1. News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsCategory, setNewsCategory] = useState('উন্নয়ন ও অবকাঠামো');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1200&q=80');
  const [newsContent, setNewsContent] = useState('');

  // 2. Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('সন্ধ্যা ৬:০০');
  const [eventVenue, setEventVenue] = useState('ময়মনসিংহ জিলা স্কুল মাঠ');
  const [eventCategory, setEventCategory] = useState('মেলা ও উৎসব');
  const [eventEntryFee, setEventEntryFee] = useState('ফ্রি');
  const [eventImage, setEventImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [eventDesc, setEventDesc] = useState('');

  // 3. Offer
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('২০% ছাড়');
  const [offerBizName, setOfferBizName] = useState('');
  const [offerPromoCode, setOfferPromoCode] = useState('MYM20');
  const [offerExpiry, setOfferExpiry] = useState('১৫ দিন বাকি');
  const [offerImage, setOfferImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80');
  const [offerDesc, setOfferDesc] = useState('');

  // 4. Blood Donor
  const [donorName, setDonorName] = useState('');
  const [donorGroup, setDonorGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [donorUpazila, setDonorUpazila] = useState('ময়মনসিংহ সদর');
  const [donorPhone, setDonorPhone] = useState('+880 1700-000000');
  const [donorAvail, setDonorAvail] = useState<'Available' | 'Unavailable'>('Available');

  // 5. Tuition
  const [tuitionTitle, setTuitionTitle] = useState('');
  const [tuitionClass, setTuitionClass] = useState('Class 9-10');
  const [tuitionSubjects, setTuitionSubjects] = useState('পদার্থবিজ্ঞান, গণিত');
  const [tuitionLocation, setTuitionLocation] = useState('নয়াগাঁও, ময়মনসিংহ');
  const [tuitionSalary, setTuitionSalary] = useState('৳৫,০০০ / মাস');
  const [tuitionDays, setTuitionDays] = useState('৩ দিন / সপ্তাহ');
  const [tuitionPhone, setTuitionPhone] = useState('+880 1700-000000');

  // 6. To-Let
  const [toLetTitle, setToLetTitle] = useState('');
  const [toLetType, setToLetType] = useState<'Family' | 'Bachelor' | 'Sublet' | 'Commercial'>('Family');
  const [toLetRent, setToLetRent] = useState('৳১২,০০০ / মাস');
  const [toLetBedrooms, setToLetBedrooms] = useState(3);
  const [toLetBathrooms, setToLetBathrooms] = useState(2);
  const [toLetArea, setToLetArea] = useState('কাঁচিঝুলি, ময়মনসিংহ');
  const [toLetPhone, setToLetPhone] = useState('+880 1700-000000');
  const [toLetImage, setToLetImage] = useState('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80');
  const [toLetAvailableFrom, setToLetAvailableFrom] = useState('১ আগামী মাস');

  if (!isOpen || !type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (type === 'news') {
        if (!newsTitle.trim()) throw new Error('সংবাদের শিরোনাম দিন');
        await addNews({
          title: newsTitle,
          excerpt: newsExcerpt || newsTitle,
          category: newsCategory,
          date: new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
          image_url: newsImage,
          read_time: '৩ মিনিট',
          content: newsContent || newsExcerpt || newsTitle
        });
        setSuccessMsg('সংবাদটি সফলভাবে Supabase ডেটাবেজে সংরক্ষিত হয়েছে!');
      } else if (type === 'event') {
        if (!eventTitle.trim()) throw new Error('ইভেন্টের নাম লিখুন');
        await addEvent({
          title: eventTitle,
          title_bn: eventTitle,
          date: eventDate || 'আসন্ন শুক্রবার',
          time: eventTime,
          venue: eventVenue,
          category: eventCategory,
          image_url: eventImage,
          entry_fee: eventEntryFee,
          description: eventDesc || eventTitle
        });
        setSuccessMsg('ইভেন্টটি সফলভাবে যুক্ত হয়েছে!');
      } else if (type === 'offer') {
        if (!offerTitle.trim()) throw new Error('অফারের নাম লিখুন');
        await addOffer({
          title: offerTitle,
          discount: offerDiscount,
          business_name: offerBizName || 'ময়মনসিংহ পার্টনার শপ',
          category: 'শপিং ও ডাইনিং',
          expiry_date: offerExpiry,
          promo_code: offerPromoCode,
          image_url: offerImage,
          description: offerDesc || offerTitle
        });
        setSuccessMsg('অফারটি সফলভাবে যুক্ত হয়েছে!');
      } else if (type === 'donor') {
        if (!donorName.trim()) throw new Error('রক্তদাতার নাম লিখুন');
        await addBloodDonor({
          name: donorName,
          blood_group: donorGroup,
          upazila: donorUpazila,
          phone: donorPhone,
          availability: donorAvail,
          last_donation: '২ মাস আগে'
        });
        setSuccessMsg('রক্তদাতা সফলভাবে তালিকাভুক্ত হয়েছেন!');
      } else if (type === 'tuition') {
        if (!tuitionTitle.trim()) throw new Error('টিউশনের শিরোনাম লিখুন');
        await addTuition({
          title: tuitionTitle,
          class_level: tuitionClass,
          subjects: tuitionSubjects.split(',').map(s => s.trim()),
          location: tuitionLocation,
          salary: tuitionSalary,
          days_per_week: tuitionDays,
          phone: tuitionPhone,
          posted_date: 'আজই পোস্ট করা'
        });
        setSuccessMsg('টিউশন লিস্টিং সফলভাবে পোস্ট হয়েছে!');
      } else if (type === 'tolet') {
        if (!toLetTitle.trim()) throw new Error('বাসা ভাড়ার শিরোনাম লিখুন');
        await addToLet({
          title: toLetTitle,
          type: toLetType,
          rent: toLetRent,
          bedrooms: Number(toLetBedrooms),
          bathrooms: Number(toLetBathrooms),
          area: toLetArea,
          phone: toLetPhone,
          image_url: toLetImage,
          available_from: toLetAvailableFrom
        });
        setSuccessMsg('টু-লেট বিজ্ঞাপন সফলভাবে প্রকাশিত হয়েছে!');
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'একটি সমস্যা দেখা দিয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getModalMeta = () => {
    switch (type) {
      case 'news':
        return {
          title: 'নতুন সংবাদ প্রকাশ করুন',
          subtitle: 'Mymensingh.top এর জন্য সংবাদ যুক্ত করুন',
          icon: <Newspaper className="w-5 h-5 text-sky-400" />,
          color: 'from-sky-500 to-blue-600'
        };
      case 'event':
        return {
          title: 'নতুন ইভেন্ট যুক্ত করুন',
          subtitle: 'ময়মনসিংহের আসন্ন সাংস্কৃতিক বা জনকল্যাণমূলক ইভেন্ট',
          icon: <Calendar className="w-5 h-5 text-violet-400" />,
          color: 'from-violet-500 to-indigo-600'
        };
      case 'offer':
        return {
          title: 'নতুন অফার ও ডিসকাউন্ট যোগ করুন',
          subtitle: 'শহরের সেরা শপ ও রেস্টুরেন্টের বিশেষ ছাড়',
          icon: <Tag className="w-5 h-5 text-amber-400" />,
          color: 'from-amber-500 to-orange-600'
        };
      case 'donor':
        return {
          title: 'নতুন রক্তদাতা যুক্ত করুন',
          subtitle: 'ব্লাড ব্যাংকে স্বেচ্ছাসেবী রক্তদাতার তথ্য যোগ করুন',
          icon: <Heart className="w-5 h-5 text-rose-400" />,
          color: 'from-rose-500 to-red-600'
        };
      case 'tuition':
        return {
          title: 'নতুন টিউশন পোস্ট করুন',
          subtitle: 'টিউশন মিডিয়া সেকশনে শিক্ষার্থী ও গৃহশিক্ষকের বিজ্ঞাপন',
          icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
          color: 'from-emerald-500 to-teal-600'
        };
      case 'tolet':
        return {
          title: 'নতুন বাসা ভাড়া / টু-লেট যোগ করুন',
          subtitle: 'ফ্যামিলি, ব্যাচেলর বা সাবলেট ফ্ল্যাটের বিজ্ঞাপন',
          icon: <Home className="w-5 h-5 text-purple-400" />,
          color: 'from-purple-500 to-fuchsia-600'
        };
      default:
        return {
          title: 'তথ্য যোগ করুন',
          subtitle: '',
          icon: null,
          color: 'from-slate-700 to-slate-900'
        };
    }
  };

  const meta = getModalMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8">
        
        {/* Modal Header */}
        <div className={`p-6 bg-linear-to-r ${meta.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
              {meta.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold">{meta.title}</h3>
              <p className="text-xs text-white/80">{meta.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Notices */}
        {successMsg && (
          <div className="m-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* NEWS FORM */}
          {type === 'news' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সংবাদের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="যেমন: ময়মনসিংহে আধুনিক ড্রেনেজ ব্যবস্থার উদ্বোধন"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ / ক্যাটাগরি</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-hidden bg-white"
                  >
                    <option value="উন্নয়ন ও অবকাঠামো">উন্নয়ন ও অবকাঠামো</option>
                    <option value="প্রশাসন ও সিটি কর্পোরেশন">প্রশাসন ও সিটি কর্পোরেশন</option>
                    <option value="শিক্ষা ও ক্যাম্পাস">শিক্ষা ও ক্যাম্পাস</option>
                    <option value="স্বাস্থ্য ও চিকিৎসা">স্বাস্থ্য ও চিকিৎসা</option>
                    <option value="সংস্কৃতি ও সাহিত্য">সংস্কৃতি ও সাহিত্য</option>
                    <option value="খেলাধুলা">খেলাধুলা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবির URL</label>
                  <input
                    type="url"
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (Excerpt)</label>
                <textarea
                  rows={2}
                  value={newsExcerpt}
                  onChange={(e) => setNewsExcerpt(e.target.value)}
                  placeholder="১-২ লাইনে সংবাদের সারসংক্ষেপ..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণাঙ্গ সংবাদ</label>
                <textarea
                  rows={4}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="সংবাদের বিস্তারিত বিবরণ লিখুন..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-hidden resize-none"
                />
              </div>
            </>
          )}

          {/* EVENT FORM */}
          {type === 'event' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইভেন্টের নাম *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="যেমন: ময়মনসিংহ বসন্ত উৎসব ও নাট্যমেলা"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="যেমন: ২৫ অক্টোবর, ২০২৬"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সময়</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="যেমন: বিকেল ৪:০০ - রাত ৯:০০"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্থান / ভেন্যু</label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="যেমন: শিল্পকলা একাডেমি মিলনায়তন"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইভেন্ট ক্যাটাগরি</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden bg-white"
                  >
                    <option value="মেলা ও উৎসব">মেলা ও উৎসব</option>
                    <option value="সঙ্গীত ও সংস্কৃতি">সঙ্গীত ও সংস্কৃতি</option>
                    <option value="শিক্ষা ও কর্মশালা">শিক্ষা ও কর্মশালা</option>
                    <option value="খেলাধুলা ও টুর্নামেন্ট">খেলাধুলা ও টুর্নামেন্ট</option>
                    <option value="সামাজিক ও সেবামূলক">সামাজিক ও সেবামূলক</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এন্ট্রি ফি</label>
                  <input
                    type="text"
                    value={eventEntryFee}
                    onChange={(e) => setEventEntryFee(e.target.value)}
                    placeholder="যেমন: সবার জন্য উন্মুক্ত (ফ্রি)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবির URL</label>
                  <input
                    type="url"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইভেন্ট সম্পর্কে বিস্তারিত</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="ইভেন্টের আকর্ষণ ও নিয়মাবলী..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 outline-hidden resize-none"
                />
              </div>
            </>
          )}

          {/* OFFER FORM */}
          {type === 'offer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অফারের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="যেমন: উইকএন্ড ফ্যামিলি বুফে অফার"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম</label>
                  <input
                    type="text"
                    value={offerBizName}
                    onChange={(e) => setOfferBizName(e.target.value)}
                    placeholder="যেমন: সারেং রেস্তোরাঁ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছাড়ের পরিমাণ</label>
                  <input
                    type="text"
                    value={offerDiscount}
                    onChange={(e) => setOfferDiscount(e.target.value)}
                    placeholder="যেমন: ২৫% ক্যাশব্যাক বা Buy 1 Get 1"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রোমো কোড</label>
                  <input
                    type="text"
                    value={offerPromoCode}
                    onChange={(e) => setOfferPromoCode(e.target.value)}
                    placeholder="যেমন: MYM25"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মেয়াদ</label>
                  <input
                    type="text"
                    value={offerExpiry}
                    onChange={(e) => setOfferExpiry(e.target.value)}
                    placeholder="যেমন: ৩১ অক্টোবর পর্যন্ত"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ছবির URL</label>
                <input
                  type="url"
                  value={offerImage}
                  onChange={(e) => setOfferImage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শর্তাবলী ও বিবরণ</label>
                <textarea
                  rows={2}
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  placeholder="অফারের প্রযোজ্য শর্ত..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden resize-none"
                />
              </div>
            </>
          )}

          {/* BLOOD DONOR FORM */}
          {type === 'donor' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তদাতার নাম *</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="যেমন: মো: তানভীর আহমেদ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={donorGroup}
                    onChange={(e) => setDonorGroup(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-white font-bold text-rose-600"
                  >
                    <option value="O+">O+ (পজিটিভ)</option>
                    <option value="O-">O- (নেগেটিভ)</option>
                    <option value="A+">A+ (পজিটিভ)</option>
                    <option value="A-">A- (নেগেটিভ)</option>
                    <option value="B+">B+ (পজিটিভ)</option>
                    <option value="B-">B- (নেগেটিভ)</option>
                    <option value="AB+">AB+ (পজিটিভ)</option>
                    <option value="AB-">AB- (নেগেটিভ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা / এলাকা</label>
                  <select
                    value={donorUpazila}
                    onChange={(e) => setDonorUpazila(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-white"
                  >
                    <option value="ময়মনসিংহ সদর">ময়মনসিংহ সদর</option>
                    <option value="মুক্তাগাছা">মুক্তাগাছা</option>
                    <option value="ত্রিশাল">ত্রিশাল</option>
                    <option value="ফুলবাড়িয়া">ফুলবাড়িয়া</option>
                    <option value="ভালুকা">ভালুকা</option>
                    <option value="গফরগাঁও">গফরগাঁও</option>
                    <option value="ঈশ্বরগঞ্জ">ঈশ্বরগঞ্জ</option>
                    <option value="নান্দাইল">নান্দাইল</option>
                    <option value="হালুয়াঘাট">হালুয়াঘাট</option>
                    <option value="ধোবাউড়া">ধোবাউড়া</option>
                    <option value="ফুলপুর">ফুলপুর</option>
                    <option value="তারাকান্দা">তারাকান্দা</option>
                    <option value="গৌরীপুর">গৌরীপুর</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রক্তদানের প্রাপ্যতা (Availability)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={donorAvail === 'Available'}
                      onChange={() => setDonorAvail('Available')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-emerald-700">Available (রক্তদানে প্রস্তুত)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={donorAvail === 'Unavailable'}
                      onChange={() => setDonorAvail('Unavailable')}
                      className="text-slate-400 focus:ring-slate-400"
                    />
                    <span className="text-slate-500">Unavailable (আপাতত সম্ভব নয়)</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* TUITION FORM */}
          {type === 'tuition' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">টিউশনের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={tuitionTitle}
                  onChange={(e) => setTuitionTitle(e.target.value)}
                  placeholder="যেমন: ক্লাস ৯ এর জন্য অভিজ্ঞ গণিত ও বিজ্ঞান শিক্ষক আবশ্যক"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণী / স্তর</label>
                  <input
                    type="text"
                    value={tuitionClass}
                    onChange={(e) => setTuitionClass(e.target.value)}
                    placeholder="যেমন: Class 9-10 বা HSC"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিষয়সমূহ (কমা দিয়ে লিখুন)</label>
                  <input
                    type="text"
                    value={tuitionSubjects}
                    onChange={(e) => setTuitionSubjects(e.target.value)}
                    placeholder="যেমন: গণিত, রসায়ন, পদার্থবিজ্ঞান"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা</label>
                  <input
                    type="text"
                    value={tuitionLocation}
                    onChange={(e) => setTuitionLocation(e.target.value)}
                    placeholder="যেমন: পুলিশ লাইনস"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সম্মানী (বেতন)</label>
                  <input
                    type="text"
                    value={tuitionSalary}
                    onChange={(e) => setTuitionSalary(e.target.value)}
                    placeholder="যেমন: ৳৫,০০০ / মাস"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">দিন / সপ্তাহ</label>
                  <input
                    type="text"
                    value={tuitionDays}
                    onChange={(e) => setTuitionDays(e.target.value)}
                    placeholder="যেমন: ৩ দিন / সপ্তাহ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ নম্বর *</label>
                <input
                  type="text"
                  required
                  value={tuitionPhone}
                  onChange={(e) => setTuitionPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </>
          )}

          {/* TO-LET FORM */}
          {type === 'tolet' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিজ্ঞাপনের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={toLetTitle}
                  onChange={(e) => setToLetTitle(e.target.value)}
                  placeholder="যেমন: ৩ রুমের সম্পূর্ণ নতুন টাইলসকৃত দক্ষিণমুখী ফ্ল্যাট ভাড়া"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভাড়ার ধরণ</label>
                  <select
                    value={toLetType}
                    onChange={(e) => setToLetType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden bg-white font-medium"
                  >
                    <option value="Family">ফ্যামিলি (Family)</option>
                    <option value="Bachelor">ব্যাচেলর (Bachelor)</option>
                    <option value="Sublet">সাবলেট (Sublet)</option>
                    <option value="Commercial">কমার্শিয়াল (Commercial)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মাসিক ভাড়া</label>
                  <input
                    type="text"
                    value={toLetRent}
                    onChange={(e) => setToLetRent(e.target.value)}
                    placeholder="যেমন: ৳১৪,৫০০ / মাস"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কখন থেকে প্রাপ্য</label>
                  <input
                    type="text"
                    value={toLetAvailableFrom}
                    onChange={(e) => setToLetAvailableFrom(e.target.value)}
                    placeholder="যেমন: ১ নভেম্বর থেকে"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বেডরুম সংখ্যা</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={toLetBedrooms}
                    onChange={(e) => setToLetBedrooms(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাথরুম সংখ্যা</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={toLetBathrooms}
                    onChange={(e) => setToLetBathrooms(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা / ঠিকানা</label>
                  <input
                    type="text"
                    value={toLetArea}
                    onChange={(e) => setToLetArea(e.target.value)}
                    placeholder="যেমন: নতুন বাজার মোড়"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ মোবাইল *</label>
                  <input
                    type="text"
                    required
                    value={toLetPhone}
                    onChange={(e) => setToLetPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফ্ল্যাটের ছবির URL</label>
                  <input
                    type="url"
                    value={toLetImage}
                    onChange={(e) => setToLetImage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{loading ? 'সংরক্ষণ হচ্ছে...' : 'ডাটাবেজে যুক্ত করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
