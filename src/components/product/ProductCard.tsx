'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const price = product.salePrice || product.regularPrice || 101;
  const regularPrice = product.regularPrice || 299;
  const discountPercent = Math.round(((regularPrice - price) / regularPrice) * 100);

  const imageUrl = product.images[0]?.url || 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/5 flex flex-col overflow-hidden">
      
      {/* 1. MEDIA CONTAINER */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Shagun Flat 101 Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="bg-[#141416] text-white text-[10px] sm:text-xs font-black tracking-wide px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <span>FLAT ₹101</span>
          </span>
          {discountPercent > 0 && (
            <span className="bg-[#C5A059] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isWishlisted 
              ? 'bg-[#141416] text-white scale-105' 
              : 'bg-white/85 hover:bg-white text-neutral-700 hover:text-black'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
            {product.categoryName || 'Diwali Special'}
          </span>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-black transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
            </div>
            <span className="text-xs font-bold text-neutral-800">{product.rating || '4.9'}</span>
            <span className="text-[10px] text-neutral-400">({product.reviewCount || 95})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-neutral-900">
                ₹{price}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                ₹{regularPrice}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save ₹{regularPrice - price}
            </span>
          </div>

          {/* ADD TO BAG BUTTON */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 hover:bg-[#141416] text-white shadow-sm hover:shadow'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag • ₹{price}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
