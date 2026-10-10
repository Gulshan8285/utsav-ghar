import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = db.getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }
    const category = db.saveCategory(body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
