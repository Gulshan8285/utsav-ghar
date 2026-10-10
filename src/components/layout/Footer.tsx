'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribeStatus('Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        setSubscribeStatus('Subscription recorded.');
      }
    } catch {
      setSubscribeStatus('Thank you for subscribing!');
    }
  };

  return (
    <footer className="w-full px-3 sm:px-6 max-w-7xl mx-auto mb-8 mt-12">
      {/* FLOATING ROUNDED GEMINI-STYLE FOOTER CONTAINER WITH MATCHING ROYAL MIDNIGHT VELVET */}
      <div className="bg-gradient-to-br from-[#1A121C] via-[#140E16] to-[#110B13] text-neutral-300 rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/25 p-6 sm:p-10 overflow-hidden space-y-10">
        
        {/* 1. TRUST BADGES ROW (ROUNDED CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#DFBA73] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-[#DFBA73]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Sacred Puja Craft</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Handcrafted murtis and pure silk chunri</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#C5A059] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Express Delivery</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Guaranteed delivery before Dhanteras</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#C5A059] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safe Cushion Packing</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">7-layer damage-proof transit packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#C5A059] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Delivery on ₹249+</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Free shipping on all orders ₹249 and above</p>
            </div>
          </div>
        </div>

        {/* 2. MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#DFBA73] flex items-center justify-center shadow">
                <Flame className="w-5 h-5 text-[#141416] fill-[#141416]" />
              </div>
              <span className="font-black tracking-widest text-lg uppercase text-white">UTSAV GHAR</span>
            </div>
            <p className="text-xs text-neutral-300/80 leading-relaxed max-w-sm font-medium">
              Auspicious Diwali shopping destination offering sacred Lakshmi murtis, vibrant festive lights, and devotional red chunris at flat Shagun price of ₹101.
            </p>
            
            <div className="space-y-1.5 text-xs text-neutral-400 pt-1 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:support@utsavghar.com" className="hover:text-white transition-colors">support@utsavghar.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 98765 43210 (9 AM - 8 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Connaught Place, New Delhi 110001</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest mb-3.5">
              Categories
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/category/lights" className="hover:text-amber-300 transition-colors">
                  Diwali Lights (₹101)
                </Link>
              </li>
              <li>
                <Link href="/category/chunri" className="hover:text-amber-300 transition-colors">
                  Chunri & Clothes (₹101)
                </Link>
              </li>
              <li>
                <Link href="/category/murti" className="hover:text-amber-300 transition-colors">
                  Murti (₹101)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-amber-400 font-bold hover:underline">
                  Shop All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest mb-3.5">
              Customer Help
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/track-order" className="hover:text-amber-300 transition-colors text-white font-semibold">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-300 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-amber-300 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest mb-3.5">
              Festive Updates
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              Get notified of new festive lights and Diwali shagun drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input 
                type="email"
                required
                placeholder="Enter email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-400 outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#C5A059] hover:bg-[#B8860B] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribeStatus && (
              <p className="text-[11px] text-amber-300 flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> {subscribeStatus}
              </p>
            )}
          </div>

        </div>

        {/* 3. BOTTOM COPYRIGHT (ROUNDED STRIP) */}
        <div className="pt-6 border-t border-white/10 text-[11px] text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} UTSAV GHAR. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/admin" className="text-amber-400 hover:underline">Admin Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
