import Link from 'next/link';
import { ShoppingCart, Truck, Clock } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

export default function AdminOrdersPage() {
  const orders = db.getOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Order Management</h1>
          <p className="text-xs text-[#686058] mt-0.5">Manage customer orders, track payments, update shipping AWB and dispatch status</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF3E7] border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Order #</th>
                <th className="py-3 px-4 font-bold">Customer Details</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Payment</th>
                <th className="py-3 px-4 font-bold">Fulfillment Status</th>
                <th className="py-3 px-4 font-bold">Total (₹)</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE3D5]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FFF9F0] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#641C24]">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#292521]">{ord.customerName}</p>
                    <p className="text-[11px] text-[#686058]">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#686058]">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.fulfillmentStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.fulfillmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      ord.fulfillmentStatus === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ord.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#292521]">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="bg-[#641C24] text-white hover:bg-[#832833] px-3 py-1.5 rounded text-xs font-bold transition-colors inline-block"
                    >
                      Process Order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
