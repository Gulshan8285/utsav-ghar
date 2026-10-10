import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import ProductCatalogView from '@/components/catalog/ProductCatalogView';

export const revalidate = 0;

export default function ShopPage() {
  const products = db.getProducts({ status: 'active' });
  const categories = db.getCategories();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#686058]">Loading catalog...</div>}>
      <ProductCatalogView
        initialProducts={products}
        categories={categories}
        pageTitle="Diwali Shagun Store — Everything Flat ₹101"
        pageDescription="Shop handcrafted Lakshmi Ji Ki Murti, sacred Mata Ki Chunri, and vibrant Rang-Birange Festive Lights at Shagun price ₹101."
      />
    </Suspense>
  );
}
