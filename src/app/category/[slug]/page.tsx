import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import ProductCatalogView from '@/components/catalog/ProductCatalogView';

export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = db.getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found | Utsav Ghar' };

  return {
    title: `${category.name} | Utsav Ghar Diwali Store`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Handcrafted for Diwali`,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = db.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const allProducts = db.getProducts({ status: 'active' });
  const categories = db.getCategories();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#686058]">Loading collection...</div>}>
      <ProductCatalogView
        initialProducts={allProducts}
        categories={categories}
        initialCategorySlug={params.slug}
        pageTitle={category.name}
        pageDescription={category.description}
      />
    </Suspense>
  );
}
