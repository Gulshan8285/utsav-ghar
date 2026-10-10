import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const inventory = db.getInventory();
    const movements = db.getInventoryMovements();
    return NextResponse.json({ success: true, inventory, movements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, changeAmount, reason, adminEmail } = body;

    if (!productId || typeof changeAmount !== 'number' || !reason) {
      return NextResponse.json({ success: false, error: 'Product ID, changeAmount, and reason are required' }, { status: 400 });
    }

    const success = db.adjustInventory(productId, changeAmount, reason, adminEmail || 'admin@utsavghar.com');
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
