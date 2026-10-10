'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';

interface Props {
  comboProduct: Product;
}

export default function ComboOfferCard({ comboProduct }: Props) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddCombo = () => {
    addToCart(comboProduct, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#1A121C] via-[#140E16] to-[#110B13] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-[#D4AF37]/35 relative overflow-hidden">
      {/* Background Subtle Warm Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-amber-500/20 via-[#DFBA73]/15 to-transparent blur-3xl pointer-events-none animate-pulse-subtle"></div>
      <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-500/10 via-[#DFBA73]/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Information */}
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#DFBA73] border border-[#DFBA73]/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <span>SPECIAL DIWALI 3-IN-1 COMBO</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Murti + Lights + Chunri <br />
            <span className="text-neutral-300">Complete 3-in-1 Set at ₹249</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Everything for Deepawali Puja in one auspicious package: 1x Handcrafted Lakshmi Murti + 1x 10M LED Lights + 1x Red Silk Chunri. Separate total ₹303, combo price only <strong>₹249</strong> with Free Delivery included!
          </p>

          {/* Combo Items Included Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-base block mb-1">🌸</span>
              <p className="font-bold text-white">Lakshmi Murti</p>
              <p className="text-[11px] text-[#DFBA73]">Separate: ₹101</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-base block mb-1">⚡</span>
              <p className="font-bold text-white">10M LED Lights</p>
              <p className="text-[11px] text-[#DFBA73]">Separate: ₹101</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-base block mb-1">✨</span>
              <p className="font-bold text-white">Red Silk Chunri</p>
              <p className="text-[11px] text-[#DFBA73]">Separate: ₹101</p>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                ₹249
              </span>
              <span className="text-sm text-neutral-400 line-through">
                ₹303
              </span>
              <span className="text-xs font-bold bg-[#DFBA73] text-neutral-950 px-2.5 py-0.5 rounded-full ml-1">
                Save ₹54
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddCombo}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#DFBA73] to-[#C5A059] text-neutral-950 hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span>Combo Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Combo to Bag (₹249)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 text-[11px] text-neutral-300 pt-1">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#DFBA73]" /> Free Delivery on ₹249
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA73]" /> Guaranteed Delivery Before Dhanteras
            </span>
          </div>
        </div>

        {/* Right Visual Tri-Pack Preview */}
        <div className="lg:col-span-5 relative">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                alt="Lakshmi Murti in Combo"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-neutral-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                1x Murti
              </span>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=600&q=80"
                alt="Diwali Lights in Combo"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-neutral-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                1x Lights
              </span>
            </div>

            <div className="col-span-2 relative aspect-[21/9] rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Red Silk Chunri in Combo"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-neutral-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                1x Red Silk Zari Chunri
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
