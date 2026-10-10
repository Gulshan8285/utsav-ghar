import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Truck, 
  Star, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { db } from '@/lib/db';
import ComboOfferCard from '@/components/home/ComboOfferCard';
import AnimatedCategorySection from '@/components/home/AnimatedCategorySection';

export const revalidate = 0; // Fresh database data

export default function HomePage() {
  const allProducts = db.getProducts({ status: 'active' });

  // Special Combo Product
  const comboProduct = allProducts.find(p => p.id === 'prod-combo-1') || allProducts[0];

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 bg-[#FAF7F2]">
      
      {/* =========================================================================
          1. DEVOTIONAL HINDU FESTIVE HERO BANNER (Gemini Rounded Container)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1A121C] via-[#140E16] to-[#110B13] text-white border border-[#D4AF37]/35 shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Authentic warm festive ambient diya halos */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500/20 via-[#DFBA73]/15 to-transparent blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-500/10 via-[#DFBA73]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-[#DFBA73] border border-[#DFBA73]/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                <Flame className="w-4 h-4 fill-[#DFBA73]" />
                <span>DIWALI SHAGUN STORE</span>
                <span>•</span>
                <span>FLAT ₹101 EACH</span>
              </div>

              {/* SINGLE LINE HERO HEADING AS REQUESTED */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Devotional Deepawali Puja Essentials
              </h1>

              {/* CLEAN CONCISE SUBLINE */}
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                Sacred Lakshmi Murtis, Pure Red Silk Chunris & Radiant Festive Lights • Every product at Flat Shagun price of ₹101.
              </p>

              {/* Direct Navigation Links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <Link
                  href="/shop"
                  className="bg-gradient-to-r from-[#D4AF37] via-[#DFBA73] to-[#C5A059] text-neutral-950 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] flex items-center gap-1.5 active:scale-95"
                >
                  <span>Shop All Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/category/lights"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-[#DFBA73]/50 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Diwali Lights
                </Link>

                <Link
                  href="/category/murti"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-[#DFBA73]/50 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Murti
                </Link>

                <Link
                  href="/category/chunri"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-[#DFBA73]/50 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Chunri & Clothes
                </Link>
              </div>

              {/* Trust Badges (Free Delivery on 249+, Dhanteras, No COD) */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-neutral-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#DFBA73]" /> Free Delivery on Orders ₹249+
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DFBA73]" /> Guaranteed Delivery Before Dhanteras
                </span>
              </div>
            </div>

            {/* Right Visual Previews (Rounded Cards) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full lg:max-w-md shrink-0">
              <Link href="/category/lights" className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#DFBA73]/30 shadow-xl bg-neutral-900 block hover:scale-[1.02] transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=600&q=80"
                  alt="Diwali Lights"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-white">
                    <p className="text-[10px] font-bold text-[#DFBA73]">LIGHTS</p>
                    <p className="text-xs font-black">₹101</p>
                  </div>
                </div>
              </Link>

              <Link href="/category/murti" className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#DFBA73]/30 shadow-xl bg-neutral-900 block hover:scale-[1.02] transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                  alt="Lakshmi Murti"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-white">
                    <p className="text-[10px] font-bold text-[#DFBA73]">MURTI</p>
                    <p className="text-xs font-black">₹101</p>
                  </div>
                </div>
              </Link>

              <Link href="/category/chunri" className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#DFBA73]/30 shadow-xl bg-neutral-900 block hover:scale-[1.02] transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                  alt="Mata Chunri"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-white">
                    <p className="text-[10px] font-bold text-[#DFBA73]">CHUNRI</p>
                    <p className="text-xs font-black">₹101</p>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SPECIAL DIWALI MEGA COMBO SECTION (₹249 OFFER)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <ComboOfferCard comboProduct={comboProduct} />
      </section>

      {/* =========================================================================
          3. ANIMATED INTERACTIVE CATEGORY HIGHLIGHTS
         ========================================================================= */}
      <AnimatedCategorySection allProducts={allProducts} />

      {/* =========================================================================
          4. CUSTOMER REVIEWS (AUTHENTIC, DEVOTIONAL)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Verified Customer Feedback
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">
              Loved by 10,000+ Festive Families
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 font-medium">
                &ldquo;Ordered the ₹249 mega combo pack. The Lakshmi Ji murti is peaceful, the lights are super bright, and the red chunri has heavy zari lace.&rdquo;
              </p>
              <p className="text-[11px] font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                — Rohit S., Delhi (Verified Buyer)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 font-medium">
                &ldquo;All items at flat ₹101 is an unbelievable blessing for Diwali. Everything arrived in cushion box packaging in just 2 days.&rdquo;
              </p>
              <p className="text-[11px] font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                — Sunita A., Jaipur (Verified Buyer)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 font-medium">
                &ldquo;The curtain lights and lotus blossom string look divine in our temple room. Very happy with the quality and spiritual touch.&rdquo;
              </p>
              <p className="text-[11px] font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                — Meenakshi S., Mumbai (Verified Buyer)
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
