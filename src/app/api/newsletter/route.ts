import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }
    db.subscribeNewsletter(body.email);
    return NextResponse.json({ success: true, message: 'Thank you for subscribing to Utsav Ghar festive updates!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
