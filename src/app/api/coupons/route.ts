import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = db.getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ success: false, error: 'Code and discountValue are required' }, { status: 400 });
    }
    const coupon = db.saveCoupon(body);
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
