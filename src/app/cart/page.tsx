'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    freeShippingThreshold,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setInputCoupon('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#FAF3E7] text-[#C6A15B] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#641C24]">Your Festive Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-[#686058] max-w-md mx-auto">
          You haven't added any Diwali essentials to your cart yet. Explore our handcrafted brass idols, clay diyas, and festive hampers.
        </p>
        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#641C24] hover:bg-[#832833] text-white px-8 py-3 rounded-full text-xs font-bold tracking-wide transition-colors"
          >
            Explore Diwali Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="border-b border-[#EDE3D5] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#641C24]">Shopping Cart</h1>
          <p className="text-xs text-[#686058] mt-1">Review your selected festive items before proceeding to secure checkout.</p>
        </div>
        <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#641C24] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Free Shipping Alert */}
      <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#EDE3D5]">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          {qualifiesForFreeShipping ? (
            <span className="text-[#641C24] font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C6A15B]" /> Congratulations! You have unlocked Free Express Delivery
            </span>
          ) : (
            <span>Add items worth <strong>₹{amountNeededForFreeShipping}</strong> more to qualify for <strong>FREE Delivery</strong></span>
          )}
          <span className="text-xs font-bold text-[#C6A15B]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#EDE3D5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#C6A15B] to-[#C64B32] rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: ITEMS TABLE */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm divide-y divide-[#EDE3D5] overflow-hidden">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId || 'base'}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              
              <div className="w-20 h-20 bg-[#FFF9F0] rounded-lg border border-[#EDE3D5] overflow-hidden relative shrink-0">
                <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" />
              </div>

              <div className="flex-1 space-y-1">
                <Link href={`/product/${item.slug}`} className="font-serif text-sm font-bold text-[#292521] hover:text-[#641C24] transition-colors line-clamp-1">
                  {item.title}
                </Link>
                {item.variantTitle && (
                  <p className="text-[11px] text-[#686058]">Variant: {item.variantTitle}</p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-[#641C24]">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.regularPrice > item.price && (
                    <span className="text-[10px] text-[#686058] line-through">₹{item.regularPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#EDE3D5] rounded-lg bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="p-1.5 text-[#686058] hover:text-[#292521]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#292521]">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className="p-1.5 text-[#686058] hover:text-[#292521]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="font-serif text-sm font-bold text-[#292521]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId, item.variantId)}
                  className="text-[#686058] hover:text-red-600 p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#641C24] border-b border-[#EDE3D5] pb-3">
            Order Summary
          </h3>

          {/* Coupon Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#292521] uppercase tracking-wider block">
              Have a Promo Code?
            </label>
            {couponCode ? (
              <div className="flex items-center justify-between bg-[#FDF6F4] border border-[#C64B32]/30 px-3 py-2 rounded text-xs text-[#C64B32] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Code: <strong>{couponCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-[#686058] hover:text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. DIWALI10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded px-3 py-2 text-xs uppercase outline-none"
                />
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-[#641C24] hover:bg-[#832833] text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {couponMsg && (
              <p className={`text-[11px] flex items-center gap-1 ${couponMsg.error ? 'text-red-600' : 'text-[#641C24]'}`}>
                {couponMsg.error ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3 text-[#C6A15B]" />}
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2 text-xs text-[#443E38] border-t border-[#EDE3D5] pt-4">
            <div className="flex justify-between">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-semibold text-[#292521]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#C64B32] font-semibold">
                <span>Festival Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span className="font-semibold text-[#292521]">
                {shippingFee === 0 ? <span className="text-[#641C24] font-bold">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Taxes (GST)</span>
              <span className="font-semibold text-[#292521]">Inclusive (0%)</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#641C24] border-t border-[#EDE3D5] pt-3">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-[#641C24] hover:bg-[#832833] text-white py-3.5 rounded-xl text-xs font-bold tracking-wide transition-luxury shadow-festive-md"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="text-[11px] text-[#686058] space-y-1.5 pt-2 text-center">
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" /> 100% Safe & Secure Checkout
            </p>
            <p>Razorpay Encrypted UPI, Cards & NetBanking</p>
          </div>

        </div>

      </div>

    </div>
  );
}
