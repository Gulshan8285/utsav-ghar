import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import ProductCatalogView from '@/components/catalog/ProductCatalogView';

export const revalidate = 0;

export default function OffersPage() {
  const dealsProducts = db.getProducts({ dealsOnly: true, status: 'active' });
  const categories = db.getCategories();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#686058]">Loading festive offers...</div>}>
      <ProductCatalogView
        initialProducts={dealsProducts}
        categories={categories}
        pageTitle="Diwali Mahotsav Offers & Deals"
        pageDescription="Special verified festive discounts on select handcrafted creations. Genuine transparent pricing with free shipping on orders above ₹999."
      />
    </Suspense>
  );
}
