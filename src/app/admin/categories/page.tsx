'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, Plus, CheckCircle2 } from 'lucide-react';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchCats = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories) setCategories(data.categories);
      });
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setDescription('');
        setImageUrl('');
        setShowNewModal(false);
        fetchCats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Festive Category Management</h1>
          <p className="text-xs text-[#686058] mt-0.5">Organize store navigation, homepage category cards, and catalog groupings</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="bg-[#641C24] hover:bg-[#832833] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-[#FFF9F0] relative overflow-hidden">
              <Image src={cat.imageUrl} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#292521]">{cat.name}</h3>
                <p className="text-[11px] text-[#686058] line-clamp-2 mt-1">{cat.description}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#EDE3D5] flex justify-between text-xs font-semibold text-[#641C24]">
                <span>Slug: /{cat.slug}</span>
                <span>{cat.productCount} Items</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EDE3D5] space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#641C24]">Create Category</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Handmade Festive Wall Hangings"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 border border-[#EDE3D5] rounded-lg font-bold text-[#686058]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#641C24] text-white rounded-lg font-bold hover:bg-[#832833]"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
