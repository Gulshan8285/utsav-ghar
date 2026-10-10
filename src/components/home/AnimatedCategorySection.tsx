'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  allProducts: Product[];
}

export default function AnimatedCategorySection({ allProducts }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'lights' | 'murti' | 'chunri'>('all');
  const [animating, setAnimating] = useState(false);

  const categories = [
    { id: 'all', label: 'All Highlights', href: '/shop' },
    { id: 'lights', label: 'Diwali Lights', categoryId: 'cat-lights', href: '/category/lights' },
    { id: 'murti', label: 'Murti', categoryId: 'cat-murti', href: '/category/murti' },
    { id: 'chunri', label: 'Chunri & Clothes', categoryId: 'cat-chunri', href: '/category/chunri' },
  ];

  const handleTabChange = (tabId: 'all' | 'lights' | 'murti' | 'chunri') => {
    if (tabId === activeTab) return;
    setAnimating(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setAnimating(false);
    }, 350);
  };

  // Filter products based on selected tab
  let displayedProducts: Product[] = [];
  if (activeTab === 'all') {
    // Pick 4 curated highlights (1 Murti, 1 Lights, 1 Chunri, 1 Additional Light)
    const m = allProducts.find(p => p.categoryId === 'cat-murti' && p.id !== 'prod-combo-1');
    const l = allProducts.find(p => p.categoryId === 'cat-lights');
    const c = allProducts.find(p => p.categoryId === 'cat-chunri');
    const l2 = allProducts.find(p => p.categoryId === 'cat-lights' && p.id !== l?.id);
    displayedProducts = [m, l, c, l2].filter(Boolean) as Product[];
  } else if (activeTab === 'lights') {
    displayedProducts = allProducts.filter(p => p.categoryId === 'cat-lights').slice(0, 4);
  } else if (activeTab === 'murti') {
    displayedProducts = allProducts.filter(p => p.categoryId === 'cat-murti' && p.id !== 'prod-combo-1').slice(0, 4);
  } else if (activeTab === 'chunri') {
    displayedProducts = allProducts.filter(p => p.categoryId === 'cat-chunri').slice(0, 4);
  }

  const currentTabObj = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6">
      {/* SECTION HEADER WITH ANIMATED CATEGORY TABS */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Diwali Highlights
            </h2>
            <span className="bg-neutral-900 text-white text-[11px] font-black px-3 py-1 rounded-full">
              FLAT ₹101 EACH
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Click categories below to switch items with smooth animation.
          </p>
        </div>

        {/* ANIMATED INTERACTIVE CATEGORY TABS */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTabChange(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm scale-[1.02]'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ANIMATED PRODUCT GRID */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 transition-all duration-300 transform ${
          animating ? 'opacity-30 translate-y-2 scale-[0.99]' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="transition-all duration-300 hover:-translate-y-1"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* BOTTOM SHOP CTA */}
      <div className="text-center pt-8">
        <Link
          href={currentTabObj.href}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-900 hover:bg-black text-white transition-all shadow-md group"
        >
          <span>View All in {currentTabObj.label}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
