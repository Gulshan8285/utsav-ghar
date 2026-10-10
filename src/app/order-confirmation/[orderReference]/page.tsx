import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

interface Props {
  params: { orderReference: string };
}

export default function OrderConfirmationPage({ params }: Props) {
  const order = db.getOrderByNumber(params.orderReference);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      
      {/* 1. CELEBRATION HEADER */}
      <div className="bg-gradient-to-br from-[#641C24] to-[#832833] text-white rounded-2xl p-8 sm:p-10 shadow-festive-lg text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 text-[#C6A15B]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#C6A15B] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Order Successfully Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            May Joy & Prosperity Light Your Home!
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE3D5] max-w-lg mx-auto">
            Thank you, <strong className="text-white">{order.customerName}</strong>. We have received your festive order and our artisans are carefully packaging your items for safe transit.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider">
          <span>Order No: {order.orderNumber}</span>
          <span className="text-[#C6A15B]">•</span>
          <span className="text-[#C6A15B] uppercase">{order.paymentStatus === 'paid' ? 'PAID & VERIFIED' : order.paymentStatus}</span>
        </div>
      </div>

      {/* 2. ORDER DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tracking & Carrier Info */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#641C24]">
            <Truck className="w-4 h-4 text-[#C6A15B]" /> Shipping & Tracking
          </div>
          <p className="text-xs font-semibold text-[#292521]">Carrier: {order.trackingProvider || 'BlueDart Express'}</p>
          <p className="text-xs font-mono text-[#686058]">AWB: {order.trackingNumber || 'Pending Generation'}</p>
          <p className="text-[11px] text-[#641C24] font-medium pt-1">
            Status: <span className="uppercase font-bold">{order.fulfillmentStatus.replace('_', ' ')}</span>
          </p>
        </div>

        {/* Customer Contact */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#641C24]">
            <Clock className="w-4 h-4 text-[#C6A15B]" /> Order Date & Time
          </div>
          <p className="text-xs text-[#292521]">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-[11px] text-[#686058] truncate">Email: {order.customerEmail}</p>
          <p className="text-[11px] text-[#686058]">Phone: {order.customerPhone}</p>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#641C24]">
            <MapPin className="w-4 h-4 text-[#C6A15B]" /> Delivery Destination
          </div>
          <p className="text-xs text-[#292521] font-semibold">{order.shippingAddress.fullName}</p>
          <p className="text-[11px] text-[#686058] leading-tight">
            {order.shippingAddress.houseNo}, {order.shippingAddress.streetLocality}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
          </p>
        </div>

      </div>

      {/* 3. ORDER ITEMS TABLE */}
      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="p-5 border-b border-[#EDE3D5] bg-[#FAF3E7] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#641C24] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#C6A15B]" /> Items Purchased ({order.items.length})
          </h3>
          <span className="text-xs text-[#686058]">Payment ID: {order.paymentId || 'Verified'}</span>
        </div>

        <div className="divide-y divide-[#EDE3D5] p-5">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
              <div className="w-16 h-16 bg-[#FFF9F0] rounded-lg border border-[#EDE3D5] overflow-hidden relative shrink-0">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#292521] truncate">{item.title}</h4>
                <p className="text-[11px] text-[#686058]">SKU: {item.sku} | Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-sm font-bold text-[#641C24]">
                  ₹{item.total.toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] text-[#686058]">₹{item.price.toLocaleString('en-IN')} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="bg-[#FFF9F0] p-5 border-t border-[#EDE3D5] flex flex-col sm:flex-row justify-between gap-6">
          <div className="text-xs text-[#686058] space-y-1">
            <p className="font-bold text-[#292521] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" /> Razorpay Verified Payment
            </p>
            <p>A copy of this invoice has been transmitted to {order.customerEmail}.</p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs text-[#443E38]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#292521]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#C64B32] font-semibold">
                <span>Festive Discount ({order.couponCode}):</span>
                <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-[#292521]">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#641C24] border-t border-[#EDE3D5] pt-2">
              <span>Grand Total:</span>
              <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href={`/track-order?order=${order.orderNumber}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-full text-xs font-bold transition-colors shadow-festive-sm"
        >
          Track Shipment Progress <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[#EDE3D5] text-[#292521] hover:bg-[#FAF3E7] px-6 py-3 rounded-full text-xs font-bold transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
