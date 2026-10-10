'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useCart } from '@/lib/cart/cart-context';
import { Order } from '@/lib/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAdmin, logout, isLoading } = useAuth();
  const { wishlist } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-[#686058]">
        Loading your account details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* HEADER GREETING */}
      <div className="bg-[#FAF3E7] p-6 sm:p-8 rounded-2xl border border-[#EDE3D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#641C24] text-[#C6A15B] flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#641C24]">
                Namaste, {user.fullName}!
              </h1>
              {isAdmin && (
                <span className="bg-[#641C24] text-[#C6A15B] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Staff Role: {user.role}
                </span>
              )}
            </div>
            <p className="text-xs text-[#686058]">{user.email} • {user.phone || '+91 Verified'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-[#C64B32] hover:bg-[#A33720] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Open Admin Portal
            </Link>
          )}
          <button
            type="button"
            onClick={() => { logout(); router.push('/'); }}
            className="border border-[#EDE3D5] bg-white text-xs font-semibold px-4 py-2 rounded-lg hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <Link 
          href="/account/orders"
          className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm hover:border-[#C6A15B] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#C6A15B]" />
            </div>
            <div>
              <p className="text-xs text-[#686058]">Total Orders</p>
              <p className="font-serif text-lg font-bold text-[#641C24]">{orders.length}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#686058] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="/account/wishlist"
          className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm hover:border-[#C6A15B] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#C64B32]" />
            </div>
            <div>
              <p className="text-xs text-[#686058]">Saved Wishlist</p>
              <p className="font-serif text-lg font-bold text-[#641C24]">{wishlist.length} items</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#686058] group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <div>
            <p className="text-xs text-[#686058]">Account Security</p>
            <p className="text-xs font-bold text-[#641C24]">Protected & Active</p>
          </div>
        </div>

      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
          <h2 className="font-serif text-lg font-bold text-[#641C24] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6A15B]" /> Recent Orders
          </h2>
          <Link href="/account/orders" className="text-xs font-bold text-[#C6A15B] hover:underline">
            View All Orders →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#686058] space-y-2">
            <p>You haven't placed any festive orders yet.</p>
            <Link href="/shop" className="inline-block text-[#641C24] font-bold hover:underline">
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EDE3D5]">
            {orders.slice(0, 3).map(ord => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#641C24]">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FAF3E7] text-[#C64B32] border border-[#EDE3D5]">
                      {ord.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[#686058] text-[11px] mt-0.5">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif text-sm font-bold text-[#292521]">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/order-confirmation/${ord.orderNumber}`}
                    className="bg-[#FFF9F0] border border-[#EDE3D5] hover:border-[#641C24] text-[#641C24] px-3 py-1.5 rounded text-xs font-bold"
                  >
                    View Receipt
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
