import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import ProductDetailView from '@/components/product/ProductDetailView';

export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = db.getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found | Utsav Ghar' };

  return {
    title: `${product.title} | Utsav Ghar Diwali Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = db.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
