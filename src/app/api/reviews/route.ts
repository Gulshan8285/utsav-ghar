import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = db.getReviews(productId);
    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.customerName || !body.rating || !body.title || !body.comment) {
      return NextResponse.json({ success: false, error: 'Product, customer name, rating, title, and comment are required' }, { status: 400 });
    }

    const review = db.addReview({
      productId: body.productId,
      customerName: body.customerName,
      rating: Number(body.rating),
      title: body.title,
      comment: body.comment,
      isVerifiedPurchase: body.isVerifiedPurchase ?? true,
      userId: body.userId,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, status } = body;
    if (!reviewId || !status) {
      return NextResponse.json({ success: false, error: 'Review ID and status are required' }, { status: 400 });
    }

    const success = db.moderateReview(reviewId, status);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
