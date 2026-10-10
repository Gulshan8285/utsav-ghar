'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

export default function CustomerWishlistPage() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products.filter((p: Product) => wishlist.includes(p.id)));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      <div className="border-b border-[#EDE3D5] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641C24]">My Wishlist</h1>
          <p className="text-xs text-[#686058] mt-0.5">Your curated festive favourites ({wishlist.length} saved)</p>
        </div>
        <Link href="/shop" className="flex items-center gap-1.5 text-xs font-semibold text-[#641C24] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Continue Browsing
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-[#686058]">Loading your wishlist...</div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#EDE3D5] text-center space-y-3">
          <Heart className="w-12 h-12 text-[#C64B32] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#641C24]">Your wishlist is currently empty</h3>
          <p className="text-xs text-[#686058]">Click the heart icon on any product to save it for Diwali gifting.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#641C24] text-white text-xs font-bold px-6 py-2.5 rounded-full">
            Explore Diwali Collection <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}
