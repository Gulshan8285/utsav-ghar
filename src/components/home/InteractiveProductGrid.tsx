'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  products: Product[];
  categories: Category[];
}

export default function InteractiveProductGrid({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Curations' },
    { id: 'ganesh-lakshmi-idols', label: 'Brass Idols' },
    { id: 'diyas-candles', label: 'Diyas & Lamps' },
    { id: 'decorative-lights', label: 'Festive Lights' },
    { id: 'puja-essentials', label: 'Puja Thalis' },
    { id: 'gift-hampers', label: 'Gift Hampers' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products.slice(0, 8)
    : products.filter(p => {
        const cat = categories.find(c => c.id === p.categoryId);
        return cat?.slug === selectedCategory;
      }).slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Category Tab Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm scale-[1.02]'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/80 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All CTA */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 transition-all hover:shadow-md group"
        >
          <span>Explore Entire Catalog ({products.length} Items)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
