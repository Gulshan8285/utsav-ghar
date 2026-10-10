'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Flame, 
  ChevronDown 
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useAuth } from '@/lib/auth/auth-context';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItemCount, openCartDrawer, wishlist } = useCart();
  const { user, isAdmin, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: 'Diwali Lights', href: '/category/lights', isShop: false },
    { name: 'Chunri & Clothes', href: '/category/chunri', isShop: false },
    { name: 'Murti', href: '/category/murti', isShop: false },
    { name: 'Shop', href: '/shop', isShop: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-2 sm:pt-3 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* 1. FLOATING ROUNDED GEMINI-STYLE MAIN CONTAINER (NO overflow-hidden so dropdown popovers are never clipped) */}
      <div className="bg-gradient-to-br from-[#1A121C] via-[#140E16] to-[#110B13] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/30 backdrop-blur-md transition-all relative">
        
        {/* TOP COMPACT ANNOUNCEMENT STRIP */}
        <div className="bg-black/50 text-[10px] sm:text-xs py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] animate-pulse"></span>
            <span className="text-neutral-300 font-medium">
              Free Delivery on Orders ₹249+ • Guaranteed Delivery Before Dhanteras
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-neutral-300">
            <Link href="/track-order" className="hover:text-[#DFBA73] transition-colors underline">
              Track Order
            </Link>
          </div>
        </div>

        {/* MAIN NAV ROW */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Mobile Menu Button */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-300 hover:text-white rounded-xl hover:bg-white/10"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#DFBA73] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#141416] fill-[#141416]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-wider uppercase text-white leading-none">
                UTSAV GHAR
              </span>
              <span className="text-[9px] tracking-widest uppercase font-semibold text-[#DFBA73] mt-0.5">
                Diwali Puja Store
              </span>
            </div>
          </Link>

          {/* DESKTOP ROUNDED NAVIGATION PILLS WITH ANIMATED ACTIVE STATE */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 mx-auto">
            {navCategories.map((cat) => {
              const isActive = pathname === cat.href || (cat.href !== '/' && pathname?.startsWith(cat.href));
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#DFBA73] to-[#C5A059] text-neutral-950 font-black shadow-[0_2px_12px_rgba(212,175,55,0.4)] scale-105'
                      : cat.isShop
                      ? 'bg-white hover:bg-neutral-100 text-neutral-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          {/* SEARCH BAR (Compact Rounded Pill) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex max-w-[200px] xl:max-w-xs relative">
            <input
              type="text"
              placeholder="Search store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white focus:text-neutral-950 border border-white/15 focus:border-[#DFBA73]/50 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-400 outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          </form>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Wishlist */}
            <Link 
              href="/account/wishlist" 
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 relative transition-all"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#DFBA73] text-neutral-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Dropdown (Luxury Popover with NO clipping) */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-full border transition-all text-xs font-semibold ${
                  isAccountMenuOpen 
                    ? 'bg-white/20 text-white border-[#DFBA73]/60 shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border-white/10'
                }`}
                title="Account"
                aria-expanded={isAccountMenuOpen}
              >
                <User className="w-4 h-4 text-[#DFBA73]" />
                <span className="hidden sm:inline">
                  {user ? user.fullName.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className={`w-3 h-3 hidden sm:inline text-neutral-400 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180 text-[#DFBA73]' : ''}`} />
              </button>

              {isAccountMenuOpen && (
                <>
                  {/* Invisible backdrop to dismiss menu on click outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsAccountMenuOpen(false)} 
                  />
                  <div 
                    className="absolute right-0 top-full mt-2 w-64 bg-[#18121A] text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-[#DFBA73]/40 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-2.5 border-b border-white/10">
                          <p className="text-[10px] uppercase tracking-wider text-[#DFBA73] font-bold">Signed in as</p>
                          <p className="text-xs font-bold text-white truncate mt-0.5">{user.fullName}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link 
                            href="/account/orders" 
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <span>My Orders</span>
                            <span className="text-[10px] text-[#DFBA73]">View &rarr;</span>
                          </Link>
                          <Link 
                            href="/account/wishlist" 
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <span>My Wishlist</span>
                            <span className="text-[10px] text-[#DFBA73]">{wishlist.length}</span>
                          </Link>
                        </div>
                        <div className="pt-1.5 border-t border-white/10">
                          <button 
                            type="button"
                            onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3 p-1">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#DFBA73] flex items-center justify-center shrink-0">
                            <Flame className="w-4 h-4 text-black fill-black" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">Utsav Ghar</p>
                            <p className="text-[10px] text-[#DFBA73] font-semibold">Flat ₹101 Shagun Store</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-snug">
                          Sign in to track orders, saved addresses, and access festive shagun perks.
                        </p>
                        <Link 
                          href="/login" 
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block text-center py-2 px-3 bg-gradient-to-r from-[#D4AF37] via-[#DFBA73] to-[#C5A059] text-black rounded-xl text-xs font-black shadow-md hover:brightness-105 transition-all"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button 
              type="button"
              onClick={openCartDrawer}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-sm font-bold active:scale-95 group"
              aria-label="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DFBA73] text-neutral-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide">
                Bag {totalItemCount > 0 ? `(${totalItemCount})` : ''}
              </span>
            </button>

          </div>
        </div>

        {/* MOBILE HORIZONTAL PILL BAR */}
        <div className="md:hidden flex items-center gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-none border-t border-white/10 pt-2 rounded-b-2xl sm:rounded-b-3xl">
          {navCategories.map((cat) => {
            const isActive = pathname === cat.href || (cat.href !== '/' && pathname?.startsWith(cat.href));
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#DFBA73] text-neutral-950 font-black'
                    : cat.isShop
                    ? 'bg-white text-neutral-950'
                    : 'bg-white/10 text-white border border-white/15'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

      </div>

      {/* MOBILE FULL DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex backdrop-blur-sm animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-gradient-to-br from-[#1A121C] via-[#140E16] to-[#110B13] text-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto border-r border-[#DFBA73]/30">
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#DFBA73] fill-[#DFBA73]" />
                <span className="font-black text-lg text-white">UTSAV GHAR</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold text-[#DFBA73]">
              All Products Flat ₹101 • Mega Combo at ₹249
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Categories</p>
              {navCategories.map(cat => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between border ${
                    cat.isShop
                      ? 'bg-white text-neutral-950 border-white'
                      : 'bg-white/5 text-white hover:bg-white/15 border-white/10'
                  }`}
                >
                  <span>{cat.name}</span>
                  {!cat.isShop && <span className="text-[11px] font-bold text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full">₹101</span>}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/15 flex flex-col gap-2 text-xs text-neutral-300">
              <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-1">
                Track Order
              </Link>
            </div>

          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
