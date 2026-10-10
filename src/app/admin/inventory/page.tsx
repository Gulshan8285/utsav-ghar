'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, CheckCircle2, History } from 'lucide-react';
import { Product, InventoryMovement } from '@/lib/types';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<{ product: Product; available: number; lowStock: boolean }[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState('Diwali Restock Batch Inward');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchInventory = () => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInventory(data.inventory);
          setMovements(data.movements);
        }
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsAdjusting(true);
    setMsg(null);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          changeAmount: Number(adjustmentAmount),
          reason: adjustmentReason,
          adminEmail: 'admin@utsavghar.com',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(`Stock updated for ${selectedProduct.title}!`);
        setSelectedProduct(null);
        fetchInventory();
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3D5] pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Inventory & Stock Control</h1>
          <p className="text-xs text-[#686058] mt-0.5">Track live warehouse stock levels, execute manual adjustments, and audit stock movements</p>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* STOCK TABLE */}
      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="p-4 bg-[#FAF3E7] font-serif font-bold text-[#641C24] border-b border-[#EDE3D5] flex justify-between items-center text-xs">
          <span>Active Warehouse SKUs ({inventory.length})</span>
          <span className="text-[#C64B32] font-semibold">
            {inventory.filter(i => i.lowStock).length} SKUs below threshold (≤ 5 units)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">SKU</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Available Stock</th>
                <th className="py-3 px-4 font-bold">Threshold Status</th>
                <th className="py-3 px-4 font-bold text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE3D5]">
              {inventory.map(({ product, available, lowStock }) => (
                <tr key={product.id} className="hover:bg-[#FFF9F0] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#292521] max-w-xs truncate">
                    {product.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#686058]">{product.sku}</td>
                  <td className="py-3 px-4 text-[#443E38]">{product.categoryName}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-sm text-[#641C24]">{available}</span> units
                  </td>
                  <td className="py-3 px-4">
                    {lowStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-[#FAE8E4] text-[#C64B32] font-bold px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#FAF3E7] hover:bg-[#641C24] hover:text-white text-[#641C24] px-3 py-1 rounded text-xs font-bold transition-colors"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK MOVEMENT AUDIT TRAIL */}
      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-[#641C24] flex items-center gap-2 border-b border-[#EDE3D5] pb-2">
          <History className="w-4 h-4 text-[#C6A15B]" /> Recent Stock Movement Logs
        </h3>

        <div className="space-y-2 text-xs">
          {movements.map((mov) => (
            <div key={mov.id} className="p-3 rounded-lg bg-[#FFF9F0] border border-[#EDE3D5] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#292521]">{mov.productTitle} ({mov.sku})</p>
                <p className="text-[11px] text-[#686058]">
                  Reason: {mov.reason} • By: {mov.adminEmail}
                </p>
              </div>
              <div className="text-right">
                <span className={`font-mono font-bold ${mov.changeAmount >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {mov.changeAmount >= 0 ? `+${mov.changeAmount}` : mov.changeAmount} units
                </span>
                <p className="text-[10px] text-[#686058]">Balance: {mov.newStock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOCK ADJUSTMENT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EDE3D5] space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#641C24]">
              Adjust Stock: {selectedProduct.title}
            </h3>
            <p className="text-[11px] text-[#686058]">Current Stock: {selectedProduct.stockQuantity} units</p>

            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Stock Change Amount (+ or -)</label>
                <input
                  type="number"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  placeholder="e.g. 15 for restocking, -2 for audit correction"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Reason for Adjustment *</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] rounded-lg px-3 py-2 outline-none"
                >
                  <option value="Diwali Restock Batch Inward">Diwali Restock Batch Inward</option>
                  <option value="Artisan Warehouse Return">Artisan Warehouse Return</option>
                  <option value="Physical Audit Correction">Physical Audit Correction</option>
                  <option value="Damaged in Storage Write-Off">Damaged in Storage Write-Off</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2.5 border border-[#EDE3D5] rounded-lg font-bold text-[#686058]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="flex-1 py-2.5 bg-[#641C24] text-white rounded-lg font-bold hover:bg-[#832833]"
                >
                  {isAdjusting ? 'Updating...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
