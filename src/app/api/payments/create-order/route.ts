import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, RazorpayConfig } from '@/lib/payment/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountInRupees, orderReference } = body;

    if (!amountInRupees || amountInRupees <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    const order = await createRazorpayOrder({
      amountInRupees,
      receipt: orderReference || `receipt_${Date.now()}`,
      notes: {
        platform: 'Utsav Ghar Festive Store',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RazorpayConfig.keyId,
      isSandbox: order.isSandbox,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
