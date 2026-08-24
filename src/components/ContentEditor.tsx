'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface ContentItem {
  id: string;
  key: string;
  value: string;
}

const LABELS: Record<string, string> = {
  hero_tagline: 'Hero Tagline (e.g. New Collection 2026)',
  hero_heading: 'Hero Heading',
  hero_subheading: 'Hero Subheading',
  hero_cta: 'Hero CTA Button Text',
  hero_image: 'Hero Image',
  promo_banner: 'Promotional Banner Text',
  brand_story: 'Brand Story',
  newsletter_heading: 'Newsletter Heading',
  newsletter_text: 'Newsletter Description',
};

export default function ContentEditor({ content }: { content: ContentItem[] }) {
  const [items, setItems] = useState(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateItem = (key: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((item) => ({ key: item.key, value: item.value })) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {items.map((item) => (
        <div key={item.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LABELS[item.key] || item.key}
          </label>
          {item.key === 'hero_image' ? (
            <ImageUpload
              value={item.value}
              onChange={(url) => updateItem(item.key, url)}
              label=""
            />
          ) : item.key === 'brand_story' || item.key === 'hero_subheading' || item.key === 'newsletter_text' ? (
            <textarea
              value={item.value}
              onChange={(e) => updateItem(item.key, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none"
            />
          ) : (
            <input
              type="text"
              value={item.value}
              onChange={(e) => updateItem(item.key, e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-8 py-3 rounded-full font-medium text-sm transition-colors ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-brand-500 hover:bg-brand-600 text-white'
        } disabled:bg-brand-300`}
      >
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
