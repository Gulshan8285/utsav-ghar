'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  User 
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

export default function AdminOrderProcessPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [trackingProvider, setTrackingProvider] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) {
          setOrder(data.order);
          setStatus(data.order.fulfillmentStatus);
          setTrackingProvider(data.order.trackingProvider || 'BlueDart Express');
          setTrackingNumber(data.order.trackingNumber || '');
        }
      });
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg(false);

    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingProvider,
          trackingNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return <div className="p-8 text-center text-xs text-[#686058]">Loading order details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-[#641C24] font-mono">{order.orderNumber}</h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FAF3E7] text-[#C6A15B] border border-[#EDE3D5]">
              {order.paymentStatus}
            </span>
          </div>
          <p className="text-xs text-[#686058] mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <Link href="/admin/orders" className="text-xs font-semibold text-[#641C24] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Order fulfillment and tracking updated successfully! Customer notified.</span>
        </div>
      )}

      {/* WORKFLOW DISPATCH BOX */}
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-4 text-xs">
        <h3 className="font-serif text-sm font-bold text-[#641C24] flex items-center gap-2 border-b border-[#EDE3D5] pb-2">
          <Truck className="w-4 h-4 text-[#C6A15B]" /> Fulfillment & Shipping Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Fulfillment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3 py-2 outline-none uppercase font-bold text-[#641C24]"
            >
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing & QC</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Logistics Courier</label>
            <select
              value={trackingProvider}
              onChange={(e) => setTrackingProvider(e.target.value)}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3 py-2 outline-none"
            >
              <option value="BlueDart Express">BlueDart Express</option>
              <option value="Delhivery Express">Delhivery Express</option>
              <option value="DTDC Express">DTDC Express</option>
              <option value="India Post Speed Post">India Post Speed Post</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Air Waybill (AWB) / Tracking #</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BD892019283IN"
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3 py-2 outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-[#641C24] hover:bg-[#832833] text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Update Fulfillment & Tracking'}
          </button>
        </div>
      </form>

      {/* CUSTOMER & SHIPPING ADDRESS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] space-y-2">
          <h4 className="font-serif text-xs font-bold text-[#641C24] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#C6A15B]" /> Customer Profile
          </h4>
          <p className="font-bold text-[#292521]">{order.customerName}</p>
          <p className="text-[#686058]">{order.customerEmail}</p>
          <p className="text-[#686058]">{order.customerPhone}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] space-y-2">
          <h4 className="font-serif text-xs font-bold text-[#641C24] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" /> Delivery Destination
          </h4>
          <p className="font-bold text-[#292521]">{order.shippingAddress.fullName}</p>
          <p className="text-[#686058] leading-tight">
            {order.shippingAddress.houseNo}, {order.shippingAddress.streetLocality}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      {/* ORDER ITEMS TABLE */}
      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden text-xs">
        <div className="p-4 bg-[#FAF3E7] font-serif font-bold text-[#641C24] border-b border-[#EDE3D5] flex justify-between items-center">
          <span>Items in Order ({order.items.length})</span>
          <span className="font-mono text-xs font-normal text-[#686058]">Method: {order.paymentMethod}</span>
        </div>

        <div className="divide-y divide-[#EDE3D5] p-4">
          {order.items.map((it) => (
            <div key={it.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#292521]">{it.title}</p>
                <p className="text-[11px] text-[#686058]">SKU: {it.sku} | Quantity: {it.quantity}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#641C24]">₹{it.total.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-[#686058]">₹{it.price.toLocaleString('en-IN')} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF9F0] p-4 border-t border-[#EDE3D5] space-y-1.5 text-right">
          <p className="text-[#686058]">Subtotal: ₹{order.subtotal.toLocaleString('en-IN')}</p>
          {order.discountAmount > 0 && (
            <p className="text-[#C64B32] font-semibold">Discount ({order.couponCode}): -₹{order.discountAmount.toLocaleString('en-IN')}</p>
          )}
          <p className="text-[#686058]">Shipping Fee: ₹{order.shippingFee}</p>
          <p className="font-serif text-base font-bold text-[#641C24] pt-1 border-t border-[#EDE3D5]">
            Total Amount: ₹{order.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

    </div>
  );
}
