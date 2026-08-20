'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

export default function ImageUpload({
  value,
  onChange,
  label,
  required,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
}) {
  const [error, setError] = useState('');
  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url);
        setError('');
      }
    },
    onUploadError: (err) => {
      setError('Upload failed: ' + err.message);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('File too large. Max 4MB');
      return;
    }

    setError('');
    try {
      await startUpload([file]);
    } catch {
      setError('Upload failed');
    }

    if (e.target) e.target.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {value && (
        <div className="mb-3 relative inline-block">
          <img
            src={value}
            alt="Current"
            className="w-28 h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow"
          >
            ✕
          </button>
        </div>
      )}

      <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isUploading
          ? 'border-brand-400 bg-brand-50'
          : value
            ? 'border-brand-300 bg-brand-50/50 hover:bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
      }`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Uploading to cloud...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {value ? 'Click to replace image' : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF (max 4MB)</p>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or paste URL</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder="https://images.pexels.com/photos/..."
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
      />
    </div>
  );
}
