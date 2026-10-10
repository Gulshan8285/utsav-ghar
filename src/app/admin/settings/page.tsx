'use client';

import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) setSettings(data.settings);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return <div className="p-8 text-center text-xs text-[#686058]">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[#EDE3D5] pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#641C24]">Store Configuration</h1>
        <p className="text-xs text-[#686058] mt-0.5">Manage store brand identity, contact channels, and checkout calculation rules</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved! Calculation rules updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#292521] block mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Customer Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#292521] block mb-1">Support Phone Helpline</label>
            <input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EDE3D5] pt-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              value={settings.standardShippingFee}
              onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Return Window (Days)</label>
            <input
              type="number"
              value={settings.returnWindowDays}
              onChange={(e) => setSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
