import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Boxes 
} from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

export default function AdminOverviewPage() {
  const metrics = db.getMetrics();

  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME & REFRESH HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641C24]">
            Store Operations Overview
          </h1>
          <p className="text-xs text-[#686058] mt-0.5">
            Real-time Diwali festive performance metrics calculated directly from verified database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="bg-[#641C24] hover:bg-[#832833] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Add New Product
          </Link>
        </div>
      </div>

      {/* 2. TOP METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#686058] uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-[#C6A15B]" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#641C24]">
            ₹{metrics.totalSales.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Verified Paid Orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#686058] uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#C6A15B]" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#292521]">
            {metrics.totalOrders}
          </p>
          <p className="text-[11px] text-[#686058]">
            {metrics.pendingOrders} pending dispatch
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#686058] uppercase tracking-wider">Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3E7] text-[#641C24] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#C6A15B]" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#292521]">
            ₹{metrics.averageOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#686058]">
            {metrics.productsSold} total festive items sold
          </p>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#686058] uppercase tracking-wider">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAE8E4] text-[#C64B32] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#C64B32]">
            {metrics.lowStockCount}
          </p>
          <p className="text-[11px] text-[#686058]">
            {metrics.outOfStockCount} out-of-stock items
          </p>
        </div>

      </div>

      {/* 3. RECENT ORDERS & BESTSELLERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
            <h3 className="font-serif text-base font-bold text-[#641C24] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C6A15B]" /> Recent Storefront Orders
            </h3>
            <Link href="/admin/orders" className="text-xs font-bold text-[#C6A15B] hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                  <th className="pb-2 font-bold">Order #</th>
                  <th className="pb-2 font-bold">Customer</th>
                  <th className="pb-2 font-bold">Items</th>
                  <th className="pb-2 font-bold">Amount</th>
                  <th className="pb-2 font-bold">Status</th>
                  <th className="pb-2 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE3D5]">
                {metrics.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FFF9F0] transition-colors">
                    <td className="py-3 font-mono font-bold text-[#641C24]">{ord.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-bold text-[#292521]">{ord.customerName}</p>
                      <p className="text-[10px] text-[#686058]">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 text-[#686058]">{ord.items.length} units</td>
                    <td className="py-3 font-bold text-[#292521]">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.fulfillmentStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.fulfillmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        ord.fulfillmentStatus === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ord.fulfillmentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="bg-[#FAF3E7] text-[#641C24] hover:bg-[#641C24] hover:text-white px-2.5 py-1 rounded font-bold transition-colors text-[11px]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PERFORMING PRODUCTS */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
            <h3 className="font-serif text-base font-bold text-[#641C24] flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#C6A15B]" /> Bestselling Products
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-[#C6A15B] hover:underline">
              Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.bestsellingProducts.length === 0 ? (
              <p className="text-xs text-[#686058]">Sales data will rank here as orders complete.</p>
            ) : (
              metrics.bestsellingProducts.map((prod, idx) => (
                <div key={prod.id} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-[#FFF9F0] border border-[#EDE3D5]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#641C24] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-[#292521] truncate">{prod.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#641C24]">{prod.count} units</span>
                    <p className="text-[10px] text-[#686058]">₹{prod.revenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
