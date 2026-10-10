import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || undefined;
    const query = searchParams.get('q') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const material = searchParams.get('material') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const dealsOnly = searchParams.get('deals') === 'true';
    const status = (searchParams.get('status') as any) || 'active';
    const sortBy = (searchParams.get('sort') as any) || 'relevance';

    const products = db.getProducts({
      categorySlug,
      query,
      minPrice,
      maxPrice,
      material,
      featuredOnly,
      dealsOnly,
      status,
      sortBy,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.regularPrice || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title, regularPrice, and categoryId are required' },
        { status: 400 }
      );
    }

    const newProduct = db.saveProduct(body);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
