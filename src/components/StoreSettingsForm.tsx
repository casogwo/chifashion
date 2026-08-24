'use client';

import { useState } from 'react';

interface Setting {
  id: string;
  key: string;
  value: string;
}

const SECTIONS = [
  {
    title: 'Contact Information',
    fields: [
      { key: 'store_name', label: 'Store Name', type: 'text' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'email', label: 'Email Address', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'instagram', label: 'Instagram Handle', type: 'text' },
      { key: 'twitter', label: 'Twitter Handle', type: 'text' },
    ],
  },
  {
    title: 'Payment Details',
    fields: [
      { key: 'bank_name', label: 'Bank Name', type: 'text' },
      { key: 'account_number', label: 'Account Number', type: 'text' },
      { key: 'account_name', label: 'Account Name', type: 'text' },
    ],
  },
  {
    title: 'Delivery',
    fields: [
      { key: 'delivery_fee', label: 'Delivery Fee (₦)', type: 'text' },
    ],
  },
  {
    title: 'Shipping',
    fields: [
      { key: 'shipping_threshold', label: 'Free Shipping Threshold (₦)', type: 'text' },
      { key: 'shipping_fee', label: 'Shipping Fee (₦)', type: 'text' },
    ],
  },
  {
    title: 'Currency',
    fields: [
      { key: 'currency', label: 'Currency Code', type: 'text' },
      { key: 'currency_symbol', label: 'Currency Symbol', type: 'text' },
    ],
  },
];

export default function StoreSettingsForm({ settings }: { settings: Setting[] }) {
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const [form, setForm] = useState(settingsMap);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      for (const [key, value] of Object.entries(form)) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif font-bold text-lg mb-4">{section.title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
            ))}
          </div>
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
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
