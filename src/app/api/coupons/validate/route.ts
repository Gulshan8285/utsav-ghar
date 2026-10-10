import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ valid: false, message: 'Code and subtotal are required' }, { status: 400 });
    }

    const result = db.validateCoupon(code, subtotal);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}
