'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { Campaign } from '@/lib/types';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setAnnouncementText(data.settings.announcementText || '');
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementText,
        }),
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[#EDE3D5] pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#641C24]">Festive Campaign Banners</h1>
        <p className="text-xs text-[#686058] mt-0.5">Control the top announcement bar and festival promotional messaging</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Announcement banner updated and broadcasted to all visitors!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-5 text-xs">
        <div>
          <label className="font-bold text-[#292521] block mb-1">Storefront Announcement Bar Text</label>
          <textarea
            rows={3}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none font-medium"
          />
          <p className="text-[11px] text-[#686058] mt-1">This text appears at the very top of all customer-facing storefront pages.</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Updating Banner...' : 'Publish Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
}
