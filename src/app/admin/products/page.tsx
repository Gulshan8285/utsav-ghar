import Link from 'next/link';
import Image from 'next/image';
import { Package, Plus, Sparkles, Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

export default function AdminProductsPage() {
  const products = db.getProducts({ status: 'all' });
  const categories = db.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Product Management</h1>
          <p className="text-xs text-[#686058] mt-0.5">Manage Diwali products, pricing, stock levels, and publication status</p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#641C24] hover:bg-[#832833] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF3E7] border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">SKU</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Price (₹)</th>
                <th className="py-3 px-4 font-bold">Stock</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE3D5]">
              {products.map((p) => {
                const category = categories.find(c => c.id === p.categoryId);
                const price = p.salePrice || p.regularPrice;
                return (
                  <tr key={p.id} className="hover:bg-[#FFF9F0] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FAF3E7] rounded border border-[#EDE3D5] overflow-hidden relative shrink-0">
                          {p.images[0] && (
                            <Image src={p.images[0].url} alt={p.title} fill sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/product/${p.slug}`} target="_blank" className="font-bold text-[#292521] hover:text-[#641C24] line-clamp-1">
                            {p.title}
                          </Link>
                          {p.isFeatured && (
                            <span className="text-[10px] text-[#C6A15B] font-bold">★ Featured Pick</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#686058]">{p.sku}</td>
                    <td className="py-3 px-4 text-[#443E38]">{category?.name || 'Unassigned'}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#641C24]">₹{price.toLocaleString('en-IN')}</span>
                      {p.salePrice && (
                        <span className="text-[10px] text-[#686058] line-through block">₹{p.regularPrice.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${p.stockQuantity <= 5 ? 'text-[#C64B32]' : 'text-emerald-700'}`}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1 text-[#686058] hover:text-[#641C24]"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
