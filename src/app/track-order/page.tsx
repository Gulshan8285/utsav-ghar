'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (queryNumber: string) => {
    if (!queryNumber.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(queryNumber.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError('No order found with this reference number. Please check the order ID provided in your confirmation message.');
        setOrder(null);
      }
    } catch {
      setError('Unable to fetch tracking information at this moment.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'processing', label: 'Artisan QC & Packing' },
    { key: 'packed', label: 'Dispatched to Hub' },
    { key: 'shipped', label: 'In Transit with Express Courier' },
    { key: 'delivered', label: 'Delivered at Doorstep' },
  ];

  const getStepIndex = (current: OrderStatus) => {
    if (current === 'pending_payment') return 0;
    if (current === 'confirmed') return 1;
    if (current === 'processing') return 2;
    if (current === 'packed') return 3;
    if (current === 'shipped') return 4;
    if (current === 'delivered') return 5;
    return 1;
  };

  const activeIndex = order ? getStepIndex(order.fulfillmentStatus) : 0;

  return (
    <div className="space-y-10">
      {/* TRACKING LOOKUP FORM */}
      <div className="bg-white p-6 rounded-2xl border border-[#EDE3D5] shadow-festive-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Order Number (e.g. UG-2026-1001)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-semibold uppercase outline-none"
            />
            <Search className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#641C24] hover:bg-[#832833] text-white px-8 py-3 rounded-xl text-xs font-bold tracking-wide transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-[#FAE8E4] border border-[#C64B32] rounded-xl flex items-center gap-2 text-xs text-[#641C24]">
            <AlertCircle className="w-4 h-4 text-[#C64B32] shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* TRACKING TIMELINE RESULT */}
      {order && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Card */}
          <div className="bg-[#FAF3E7] p-6 rounded-2xl border border-[#EDE3D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#C6A15B] tracking-wider">Order Reference</span>
              <h2 className="font-mono text-xl font-bold text-[#641C24]">{order.orderNumber}</h2>
              <p className="text-xs text-[#686058] mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[10px] font-bold uppercase text-[#686058] block">Courier Partner</span>
              <p className="text-xs font-bold text-[#292521] flex items-center gap-1.5 justify-end">
                <Truck className="w-4 h-4 text-[#C6A15B]" /> {order.trackingProvider || 'BlueDart Express'}
              </p>
              <p className="text-xs font-mono text-[#641C24] font-bold mt-0.5">AWB: {order.trackingNumber || 'Pending Generation'}</p>
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EDE3D5] shadow-festive-sm space-y-6">
            <h3 className="font-serif text-base font-bold text-[#641C24]">
              Shipment Milestones
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDE3D5]">
              {statusSteps.map((step, idx) => {
                const isPassed = activeIndex >= idx + 1;
                const isCurrent = activeIndex === idx + 1;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 sm:-left-8 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isPassed 
                        ? 'bg-[#641C24] border-[#641C24] text-white' 
                        : 'bg-white border-[#EDE3D5] text-transparent'
                    }`}>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" />}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#641C24]' : isPassed ? 'text-[#292521]' : 'text-[#686058]'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-[#686058] mt-0.5">
                        {isPassed ? 'Completed with safe handling protocol' : 'Pending milestone'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EDE3D5] space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#641C24] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C6A15B]" /> Delivery Address
              </h4>
              <p className="text-xs font-bold text-[#292521]">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-[#686058] leading-relaxed">
                {order.shippingAddress.houseNo}, {order.shippingAddress.streetLocality}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EDE3D5] space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#641C24] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#C6A15B]" /> Items in Parcel ({order.items.length})
              </h4>
              <div className="space-y-2 text-xs">
                {order.items.map(it => (
                  <div key={it.id} className="flex justify-between text-[#443E38]">
                    <span className="truncate max-w-[200px]">{it.title}</span>
                    <span className="font-bold">x{it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-widest">
          Live Shipment Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#641C24]">
          Track Your Festive Delivery
        </h1>
        <p className="text-xs sm:text-sm text-[#686058] max-w-md mx-auto">
          Enter your Utsav Ghar order number (e.g. UG-2026-1001) to trace the exact transit whereabouts of your parcel.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-xs text-[#686058] py-8">Loading order lookup...</div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
