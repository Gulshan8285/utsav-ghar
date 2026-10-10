'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  Check, 
  ArrowUpDown, 
  Sparkles, 
  PackageOpen,
  Flame 
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function ProductCatalogView({
  initialProducts,
  categories,
  initialCategorySlug,
  pageTitle = 'Diwali Festive Catalog',
  pageDescription = 'Handcrafted brass idols, terracotta diyas, warm fairy lights, and curated gift hampers.',
}: ProductCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || searchParams.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  );
  const [priceRange, setPriceRange] = useState<string>(
    searchParams.get('priceRange') || ''
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    searchParams.get('material') || ''
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Available Materials
  const materialsList = ['Brass', 'Clay', 'Marble', 'Copper', 'Soy Wax', 'Wood', 'Silk'];

  // Filter and sort items locally
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Category filter
      if (selectedCategory) {
        const cat = categories.find(c => c.slug === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = product.title.toLowerCase().includes(q);
        const inDesc = product.description.toLowerCase().includes(q);
        const inSku = product.sku.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inSku) return false;
      }

      // Price Range
      const effectivePrice = product.salePrice || product.regularPrice;
      if (priceRange === 'under-500' && effectivePrice > 499) return false;
      if (priceRange === '500-999' && (effectivePrice < 500 || effectivePrice > 999)) return false;
      if (priceRange === '1000-2499' && (effectivePrice < 1000 || effectivePrice > 2499)) return false;
      if (priceRange === '2500-above' && effectivePrice < 2500) return false;

      // Material
      if (selectedMaterial && product.materials) {
        if (!product.materials.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
      }

      // Stock
      if (inStockOnly && product.stockQuantity <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.regularPrice;
      const priceB = b.salePrice || b.regularPrice;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // relevance
    });
  }, [initialProducts, categories, selectedCategory, searchQuery, priceRange, selectedMaterial, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange('');
    setSelectedMaterial('');
    setInStockOnly(false);
    setSortBy('relevance');
  };

  const hasActiveFilters = Boolean(
    selectedCategory || searchQuery || priceRange || selectedMaterial || inStockOnly
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* 1. PAGE HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">
              <span>Home</span>
              <span>/</span>
              <span>Catalog</span>
              {selectedCategory && (
                <>
                  <span>/</span>
                  <span className="text-neutral-900">
                    {categories.find(c => c.slug === selectedCategory)?.name}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">{pageDescription}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 rounded-full text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3.5 py-2 rounded-full shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              >
                <option value="relevance">Featured & Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. ACTIVE FILTER PILLS */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
            <span className="text-xs text-neutral-400 font-medium">Applied:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-800">
                "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-neutral-500" /></button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button type="button" onClick={() => setSelectedCategory('')}><X className="w-3 h-3 text-white" /></button>
              </span>
            )}

            {priceRange && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-800">
                Price: {priceRange.replace('-', ' - ')}
                <button type="button" onClick={() => setPriceRange('')}><X className="w-3 h-3 text-neutral-500" /></button>
              </span>
            )}

            {selectedMaterial && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-800">
                {selectedMaterial}
                <button type="button" onClick={() => setSelectedMaterial('')}><X className="w-3 h-3 text-neutral-500" /></button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-800">
                In Stock
                <button type="button" onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-neutral-500" /></button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-neutral-400 hover:text-neutral-900 underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* 3. LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-500" /> Refine By
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#C64B32] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#292521] mb-2.5">Category</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      !selectedCategory ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>All Festive Categories</span>
                    <span className={`text-[10px] ${!selectedCategory ? 'text-neutral-300' : 'text-neutral-400'}`}>{initialProducts.length}</span>
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-neutral-300' : 'text-neutral-400'}`}>{cat.productCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Ranges */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">Price Range</h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                {[
                  { id: 'under-500', label: 'Under ₹500' },
                  { id: '500-999', label: '₹500 - ₹999' },
                  { id: '1000-2499', label: '₹1,000 - ₹2,499' },
                  { id: '2500-above', label: '₹2,500 and above' },
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="price-filter"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(priceRange === p.id ? '' : p.id)}
                      className="accent-neutral-900"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">Craft Material</h4>
              <div className="flex flex-wrap gap-1.5">
                {materialsList.map(mat => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setSelectedMaterial(selectedMaterial === mat ? '' : mat)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                      selectedMaterial === mat 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock switch */}
            <div className="border-t border-neutral-200 pt-4">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-neutral-900"
                />
                <span>In Stock Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-[#686058]">
            <span>Showing <strong>{filteredProducts.length}</strong> items</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">No festive creations found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                We couldn't find items matching your active filter criteria. Try resetting your filters to explore our full collection.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="bg-neutral-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <div 
                  key={product.id} 
                  className="page-enter-animation"
                  style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Filters</h3>
              <button type="button" onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-6 h-6 text-neutral-800" />
              </button>
            </div>

            <div className="space-y-6 py-4 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setSelectedCategory(''); setIsMobileFilterOpen(false); }}
                    className={`block w-full text-left py-2 px-2.5 rounded-xl ${!selectedCategory ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-100'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug); setIsMobileFilterOpen(false); }}
                      className={`block w-full text-left py-2 px-2.5 rounded-xl ${selectedCategory === cat.slug ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-100'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-neutral-200 pt-4">
                <h4 className="text-xs font-bold uppercase mb-2">Price Range</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'under-500', label: 'Under ₹499' },
                    { id: '500-999', label: '₹500 - ₹999' },
                    { id: '1000-2499', label: '₹1,000 - ₹2,499' },
                    { id: '2500-above', label: '₹2,500 and above' },
                  ].map(p => (
                    <label key={p.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mob-price"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="accent-neutral-900"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-neutral-200 text-xs font-bold text-neutral-600 rounded-xl"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-black"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
