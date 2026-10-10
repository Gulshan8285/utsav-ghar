'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, ArrowLeft, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { Order } from '@/lib/types';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          // If customer, filter to user orders or show customer orders
          if (user?.id) {
            setOrders(data.orders.filter((o: Order) => !o.userId || o.userId === user.id || o.customerEmail === user.email));
          } else {
            setOrders(data.orders);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      <div className="border-b border-[#EDE3D5] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641C24]">My Orders</h1>
          <p className="text-xs text-[#686058] mt-0.5">Track your past and active Diwali parcels</p>
        </div>
        <Link href="/account" className="flex items-center gap-1.5 text-xs font-semibold text-[#641C24] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Account Dashboard
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-[#686058]">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#EDE3D5] text-center space-y-3">
          <Package className="w-12 h-12 text-[#C6A15B] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#641C24]">No orders yet</h3>
          <p className="text-xs text-[#686058]">Explore our handcrafted festive collection to place your first order.</p>
          <Link href="/shop" className="inline-block bg-[#641C24] text-white text-xs font-bold px-6 py-2.5 rounded-full">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE3D5] pb-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#641C24] text-sm">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FAF3E7] text-[#C64B32] border border-[#EDE3D5]">
                      {ord.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#686058]">
                    Ordered on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif text-base font-bold text-[#292521]">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/order-confirmation/${ord.orderNumber}`}
                    className="bg-[#FFF9F0] border border-[#EDE3D5] hover:border-[#641C24] text-[#641C24] px-3.5 py-1.5 rounded-lg text-xs font-bold"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/track-order?order=${ord.orderNumber}`}
                    className="bg-[#641C24] hover:bg-[#832833] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track
                  </Link>
                </div>
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {ord.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 bg-[#FFF9F0] p-2.5 rounded-lg border border-[#EDE3D5]">
                    <div className="w-12 h-12 bg-white rounded border border-[#EDE3D5] overflow-hidden relative shrink-0">
                      {it.imageUrl && <Image src={it.imageUrl} alt={it.title} fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#292521] truncate">{it.title}</p>
                      <p className="text-[11px] text-[#686058]">Qty: {it.quantity} • ₹{it.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
