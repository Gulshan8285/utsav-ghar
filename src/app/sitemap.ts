import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://utsavghar.com';

  const products = db.getProducts({ status: 'active' });
  const categories = db.getCategories();

  const staticRoutes = [
    '',
    '/shop',
    '/offers',
    '/about',
    '/contact',
    '/faq',
    '/shipping-policy',
    '/returns-refunds',
    '/privacy-policy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryRoutes = categories.map(cat => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const productRoutes = products.map(prod => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
