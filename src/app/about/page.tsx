import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* HERO */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#FAF3E7] text-[#641C24] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#EDE3D5]">
          <Flame className="w-4 h-4 text-[#C64B32]" />
          <span>Our Heritage Story</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#641C24]">
          Bring Home the Light of Diwali
        </h1>
        <p className="text-xs sm:text-sm text-[#443E38] leading-relaxed">
          Utsav Ghar was founded with a singular devotion: to honour the ancient festive craftsmanship of India and deliver museum-grade brass idols, hand-painted earthen diyas, and celebratory hampers directly to your doorstep.
        </p>
      </div>

      {/* STORY IMAGE */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-festive-md border border-[#EDE3D5]">
        <Image
          src="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80"
          alt="Artisans crafting brass idols in Moradabad"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 text-white">
          <div>
            <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-widest">Generational Guilds</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1">Moradabad Sand-Casting & Terracotta Kilns</h3>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#641C24]">Authentic Solid Metals</h3>
          <p className="text-xs text-[#686058] leading-relaxed">
            We never use hollow resin or electroplated plastic. Every idol is cast in solid brass with high heft and protective micro-lacquering.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#641C24]">Fair-Trade Artisan Remuneration</h3>
          <p className="text-xs text-[#686058] leading-relaxed">
            We work directly with traditional generational guilds in Uttar Pradesh, Rajasthan, and West Bengal, ensuring dignified livelihoods.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#641C24]">Zero-Breakage Packaging</h3>
          <p className="text-xs text-[#686058] leading-relaxed">
            Every festive idol and terracotta lamp is fortified with dense foam cushions to ensure spotless delivery on auspicious dates.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#FAF3E7] p-8 rounded-2xl border border-[#EDE3D5] text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#641C24]">Ready to celebrate with timeless craftsmanship?</h3>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#641C24] hover:bg-[#832833] text-white px-8 py-3.5 rounded-full text-xs font-bold transition-colors"
        >
          Explore Diwali Store <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
