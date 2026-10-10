'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    isCartDrawerOpen,
    closeCartDrawer,
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

  if (!isCartDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative border-l border-neutral-100 text-neutral-900 animate-in slide-in-from-right duration-300"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold tracking-tight text-neutral-900">Shopping Bag</h2>
            <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button 
            type="button" 
            onClick={closeCartDrawer}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FREE SHIPPING PROGRESS BAR */}
        <div className="bg-neutral-50 p-4 border-b border-neutral-100">
          <div className="flex items-center justify-between text-xs mb-2 font-medium">
            {qualifiesForFreeShipping ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free Express Delivery Unlocked!
              </span>
            ) : (
              <span className="text-neutral-600">
                Add <strong>₹{amountNeededForFreeShipping}</strong> for <strong>Free Delivery</strong>
              </span>
            )}
            <span className="text-[11px] font-semibold text-neutral-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Your bag is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                Discover our handcrafted brass idols, terracotta lamps, and festive gifts to brighten your sanctuary.
              </p>
              <Link 
                href="/shop" 
                onClick={closeCartDrawer}
                className="mt-2 inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-black transition-colors"
              >
                Explore Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                <div className="w-20 h-20 bg-neutral-100 rounded-xl border border-neutral-100 overflow-hidden relative shrink-0">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    sizes="80px"
                    className="object-cover" 
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link 
                        href={`/product/${item.slug}`} 
                        onClick={closeCartDrawer}
                        className="text-xs font-semibold text-neutral-900 hover:text-[#5A121A] line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantTitle && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">{item.variantTitle}</p>
                    )}

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-neutral-900">₹{item.price.toLocaleString('en-IN')}</span>
                      {item.regularPrice > item.price && (
                        <span className="text-[10px] text-neutral-400 line-through">₹{item.regularPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-neutral-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER CHECKOUT AREA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-white space-y-4">
            
            {/* Coupon Code Section */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> Coupon <strong>{couponCode}</strong> (-₹{discountAmount})
                  </span>
                  <button 
                    type="button" 
                    onClick={removeCoupon}
                    className="text-xs text-neutral-500 hover:text-rose-600 underline font-normal"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Coupon code (e.g. DIWALI10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    className="flex-1 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 text-xs uppercase outline-none transition-colors"
                  />
                  <button 
                    type="submit" 
                    disabled={isApplying}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${couponMsg.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {couponMsg.error ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-500 border-t border-neutral-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Festival Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold uppercase tracking-wider text-[11px]">Free</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-100 pt-2">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                type="button" 
                onClick={closeCartDrawer}
                className="w-full py-2 text-center text-xs text-neutral-400 hover:text-neutral-900 font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
