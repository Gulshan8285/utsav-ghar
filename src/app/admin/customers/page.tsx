import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

export default function AdminCustomersPage() {
  const orders = db.getOrders();
  
  // Aggregate customer records from order history
  const customerMap: Record<string, { email: string; name: string; phone: string; totalSpent: number; orderCount: number; lastOrder: string }> = {};

  for (const ord of orders) {
    if (!customerMap[ord.customerEmail]) {
      customerMap[ord.customerEmail] = {
        email: ord.customerEmail,
        name: ord.customerName,
        phone: ord.customerPhone,
        totalSpent: 0,
        orderCount: 0,
        lastOrder: ord.createdAt,
      };
    }
    customerMap[ord.customerEmail].totalSpent += ord.totalAmount;
    customerMap[ord.customerEmail].orderCount += 1;
  }

  const customerList = Object.values(customerMap);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#EDE3D5] pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#641C24]">Customer Profiles & Gifting History</h1>
        <p className="text-xs text-[#686058] mt-0.5">Verified customer contact details and cumulative festive purchases</p>
      </div>

      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF3E7] border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Phone</th>
                <th className="py-3 px-4 font-bold">Orders Placed</th>
                <th className="py-3 px-4 font-bold">Total Spent (₹)</th>
                <th className="py-3 px-4 font-bold text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE3D5]">
              {customerList.map((cust) => (
                <tr key={cust.email} className="hover:bg-[#FFF9F0] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#292521]">{cust.name}</td>
                  <td className="py-3.5 px-4 text-[#686058]">{cust.email}</td>
                  <td className="py-3.5 px-4 font-mono text-[#686058]">{cust.phone}</td>
                  <td className="py-3.5 px-4 font-bold text-[#641C24]">{cust.orderCount} orders</td>
                  <td className="py-3.5 px-4 font-bold text-[#292521]">₹{cust.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right text-[#686058]">
                    {new Date(cust.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
