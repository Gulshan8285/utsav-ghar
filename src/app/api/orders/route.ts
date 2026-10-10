import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const orderNumber = searchParams.get('orderNumber') || undefined;

    if (orderNumber) {
      const order = db.getOrderByNumber(orderNumber);
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    const orders = db.getOrders(userId);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerEmail || !body.customerName || !body.customerPhone || !body.shippingAddress || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer details, shipping address, and at least one item are required' },
        { status: 400 }
      );
    }

    const order = db.createOrder({
      userId: body.userId,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      items: body.items,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod || 'razorpay',
      notes: body.notes,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
