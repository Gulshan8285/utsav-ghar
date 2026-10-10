import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = db.getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = db.getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    const body = await req.json();
    const updated = db.saveProduct({ ...body, id: product.id });
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = db.getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    db.deleteProduct(product.id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
