'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Category } from '@/lib/types';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(1499);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weightGrams, setWeightGrams] = useState<number>(500);
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDeal, setIsDeal] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) setCategoryId(data.categories[0].id);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !regularPrice || !categoryId) {
      setError('Title, Regular Price, and Category are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        categoryId,
        regularPrice: Number(regularPrice),
        salePrice: salePrice ? Number(salePrice) : undefined,
        stockQuantity: Number(stockQuantity),
        description,
        materials,
        dimensions,
        weightGrams: Number(weightGrams),
        isFeatured,
        isDeal,
        images: imageUrl ? [
          { id: `img-${Date.now()}`, productId: '', url: imageUrl, alt: title, sortOrder: 1, isPrimary: true }
        ] : undefined,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Add New Diwali Product</h1>
          <p className="text-xs text-[#686058] mt-0.5">Publish an authentic festive handcrafted item to the catalog</p>
        </div>
        <Link href="/admin/products" className="text-xs font-semibold text-[#641C24] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-[#FAE8E4] border border-[#C64B32] p-3 rounded-lg text-xs text-[#641C24]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-5 text-xs">
        <div>
          <label className="font-bold text-[#292521] block mb-1">Product Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Royal Brass Peacock Diya Lamp"
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Initial Stock Quantity *</label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Regular MRP Price (₹) *</label>
            <input
              type="number"
              required
              min={1}
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Festive Sale Price (₹) (Optional)</label>
            <input
              type="number"
              min={0}
              value={salePrice || ''}
              onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Leave blank if no discount"
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#292521] block mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of craftsmanship, heritage, and usage..."
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Materials</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="e.g. Solid Cast Brass"
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#292521] block mb-1">Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. Height: 8 inches"
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#292521] block mb-1">Weight (Grams)</label>
            <input
              type="number"
              value={weightGrams}
              onChange={(e) => setWeightGrams(Number(e.target.value))}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-[#292521] block mb-1">High-Resolution Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
          />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-[#641C24]"
            />
            <span className="font-bold">Feature on Homepage</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDeal}
              onChange={(e) => setIsDeal(e.target.checked)}
              className="accent-[#641C24]"
            />
            <span className="font-bold">Include in Diwali Deals Section</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#EDE3D5] flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-[#EDE3D5] rounded-lg font-bold text-[#686058]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
