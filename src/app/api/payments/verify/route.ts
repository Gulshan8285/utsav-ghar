import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/payment/razorpay';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Missing required payment verification details' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
    }

    if (orderId) {
      db.updatePaymentStatus(orderId, 'paid', razorpayPaymentId);
      db.updateOrderStatus(orderId, 'confirmed');
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpayPaymentId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
