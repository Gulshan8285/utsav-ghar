import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = db.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, trackingProvider, trackingNumber, adminEmail } = body;

    const order = db.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updated = db.updateOrderStatus(
      params.id,
      status || order.fulfillmentStatus,
      trackingProvider && trackingNumber ? { provider: trackingProvider, number: trackingNumber } : undefined,
      adminEmail || 'admin@utsavghar.com'
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
