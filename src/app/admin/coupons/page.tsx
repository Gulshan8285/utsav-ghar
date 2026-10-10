'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';
import { Coupon } from '@/lib/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(999);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(500);

  const fetchCoupons = () => {
    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.coupons) setCoupons(data.coupons);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount),
          maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCode('');
        setDescription('');
        setShowModal(false);
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Discounts & Promo Coupons</h1>
          <p className="text-xs text-[#686058] mt-0.5">Create festive promo codes, configure minimum spend limits, and track redemption statistics</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-[#641C24] hover:bg-[#832833] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-[#641C24] bg-[#FAF3E7] px-3 py-1 rounded border border-[#EDE3D5]">
                {coupon.code}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <p className="text-xs text-[#443E38]">{coupon.description}</p>

            <div className="space-y-1 text-xs text-[#686058] border-t border-[#EDE3D5] pt-3">
              <div className="flex justify-between">
                <span>Discount Value:</span>
                <span className="font-bold text-[#292521]">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min Order Amount:</span>
                <span className="font-bold text-[#292521]">₹{coupon.minOrderAmount}</span>
              </div>
              {coupon.maxDiscountAmount && (
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span className="font-bold text-[#292521]">₹{coupon.maxDiscountAmount}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-[#EDE3D5]/60">
                <span>Times Redeemed:</span>
                <span className="font-bold text-[#641C24]">{coupon.timesUsed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EDE3D5] space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#641C24]">Create Promotional Coupon</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DHANTERAS20"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% off for Dhanteras celebrations"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Max Cap (₹) (Optional)</label>
                  <input
                    type="number"
                    value={maxDiscountAmount || ''}
                    onChange={(e) => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 1000"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#EDE3D5] rounded-lg font-bold text-[#686058]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#641C24] text-white rounded-lg font-bold hover:bg-[#832833]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
