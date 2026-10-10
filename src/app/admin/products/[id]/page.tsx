'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Product, Category } from '@/lib/types';

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDeal, setIsDeal] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.categories) setCategories(data.categories);
      });

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const found = data.products.find((p: Product) => p.id === params.id);
          if (found) {
            setProduct(found);
            setTitle(found.title);
            setCategoryId(found.categoryId);
            setRegularPrice(found.regularPrice);
            setSalePrice(found.salePrice);
            setStockQuantity(found.stockQuantity);
            setDescription(found.description);
            setMaterials(found.materials || '');
            setStatus(found.status);
            setIsFeatured(found.isFeatured);
            setIsDeal(found.isDeal);
          }
        }
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const payload = {
        id: product.id,
        title,
        categoryId,
        regularPrice: Number(regularPrice),
        salePrice: salePrice ? Number(salePrice) : undefined,
        stockQuantity: Number(stockQuantity),
        description,
        materials,
        status,
        isFeatured,
        isDeal,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this product from the catalogue?')) return;
    try {
      await fetch(`/api/products/${product?.slug}`, { method: 'DELETE' });
      router.push('/admin/products');
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) {
    return <div className="p-8 text-center text-xs text-[#686058]">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Edit Product</h1>
          <p className="text-xs text-[#686058] mt-0.5 font-mono">{product.sku}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 border border-red-200 px-3 py-1.5 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <Link href="/admin/products" className="text-xs font-semibold text-[#641C24] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Product updated successfully! Changes are live on the storefront.</span>
        </div>
      )}

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
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Category</label>
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
            <label className="font-bold text-[#292521] block mb-1">Stock Quantity</label>
            <input
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
            >
              <option value="active">Active (Published)</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
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
            <label className="font-bold text-[#292521] block mb-1">Festive Sale Price (₹)</label>
            <input
              type="number"
              min={0}
              value={salePrice || ''}
              onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Leave blank for regular price"
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
            className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
          />
        </div>

        <div>
          <label className="font-bold text-[#292521] block mb-1">Materials</label>
          <input
            type="text"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
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
            <span className="font-bold">Diwali Deals Section</span>
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
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
