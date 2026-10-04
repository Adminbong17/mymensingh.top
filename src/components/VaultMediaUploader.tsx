import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { uploadMediaToVault } from '../lib/vaultStorage';

interface VaultMediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const VaultMediaUploader: React.FC<VaultMediaUploaderProps> = ({
  value,
  onChange,
  label = 'ছবি বা ব্যানার আপলোড (Image Upload)',
  required = false,
  placeholder = 'https://...',
  helperText = 'ছবি নির্বাচন করলে স্বয়ংক্রিয়ভাবে আপলোড হবে এবং লাইভ প্রিভিউ দেখতে পাবেন।'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const result = await uploadMediaToVault(file);
      onChange(result.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsManualMode(!isManualMode)}
          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          {isManualMode ? (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>ফাইল আপলোড করুন</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5" />
              <span>সরাসরি ছবির লিঙ্ক দিন</span>
            </>
          )}
        </button>
      </div>

      {isManualMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 bg-white"
          />
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />

          {!value && !isUploading && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100/60 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-700 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                ছবি নির্বাচন করতে এখানে ক্লিক করুন
              </div>
              <p className="text-[11px] text-slate-500">
                PNG, JPG, WEBP অথবা MP4 ফরম্যাট সমর্থিত
              </p>
            </div>
          )}

          {isUploading && (
            <div className="border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center bg-emerald-50/50 flex flex-col items-center justify-center gap-2 animate-pulse">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              <div className="text-xs font-bold text-emerald-900">
                ছবি আপলোড হচ্ছে...
              </div>
              <p className="text-[11px] text-emerald-600">অনুগ্রহ করে একটু অপেক্ষা করুন</p>
            </div>
          )}

          {value && !isUploading && (
            <div className="relative rounded-2xl border border-slate-200 bg-white p-2.5 flex items-center gap-3">
              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={value}
                  alt="Uploaded Media"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ছবি সফলভাবে সংযুক্ত হয়েছে</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  ✓ ক্লাউড স্টোরেজে সংরক্ষিত
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline"
                >
                  অন্য ছবি পরিবর্তন করুন
                </button>
              </div>

              <button
                type="button"
                onClick={handleClear}
                title="মুছে ফেলুন"
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ছবি সফলভাবে আপলোড হয়েছে!</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {helperText && !uploadError && (
        <p className="text-[11px] text-slate-400 leading-normal">
          {helperText}
        </p>
      )}
    </div>
  );
};
