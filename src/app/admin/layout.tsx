'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  ShoppingCart, 
  Users, 
  Tag, 
  Megaphone, 
  Star, 
  Settings, 
  FileText, 
  Flame, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, login, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
    { name: 'Festive Campaigns', href: '/admin/campaigns', icon: Megaphone },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  ];

  // If not staff/admin, display rapid role sign-in banner
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#292521] text-[#EDE3D5] flex items-center justify-center p-4">
        <div className="bg-[#332D28] p-8 rounded-2xl border border-[#443E38] max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#641C24] text-[#C6A15B] flex items-center justify-center mx-auto border border-[#C6A15B]/40">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-white">Staff Authorization Required</h1>
            <p className="text-xs text-[#EDE3D5]/80">
              This area is restricted to authorized store managers and operations personnel.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => login('admin@utsavghar.com', 'super_admin')}
              className="w-full bg-[#641C24] hover:bg-[#832833] text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-colors border border-[#C6A15B]/30 shadow-md"
            >
              Sign In as Store Director (admin@utsavghar.com)
            </button>

            <Link
              href="/"
              className="block text-xs text-[#C6A15B] hover:underline"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E7] text-[#292521] flex flex-col lg:flex-row">
      
      {/* 1. SIDEBAR (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#292521] text-[#EDE3D5] border-r border-[#443E38] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'}
      `}>
        {/* Brand in Sidebar */}
        <div className="p-5 border-b border-[#443E38] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#641C24] flex items-center justify-center text-[#C6A15B] border border-[#C6A15B]/40">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white leading-none block">Utsav Ghar</span>
              <span className="text-[9px] uppercase tracking-widest text-[#C6A15B] font-bold">Admin Portal</span>
            </div>
          </Link>

          <button 
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#EDE3D5] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#641C24] text-white font-bold shadow-sm border border-[#C6A15B]/30' 
                    : 'text-[#EDE3D5]/80 hover:bg-[#332D28] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C6A15B]' : 'text-[#EDE3D5]/60'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-[#443E38] space-y-3 bg-[#1F1C18]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#332D28] text-xs font-semibold text-[#EDE3D5] hover:text-white transition-colors border border-[#443E38]"
          >
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-[#C6A15B]" /> View Live Store
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-1 text-[11px] text-[#EDE3D5]/70">
            <div>
              <p className="font-bold text-white truncate max-w-[130px]">{user.fullName}</p>
              <p className="text-[10px] uppercase text-[#C6A15B] font-mono">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-red-400 hover:text-red-300 p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#EDE3D5] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#292521] rounded hover:bg-[#FAF3E7]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif text-sm font-bold text-[#641C24] hidden sm:inline">
              Diwali Operations Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-[#FAF3E7] text-[#641C24] px-2.5 py-1 rounded-full font-bold border border-[#EDE3D5]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Storefront Connected
            </span>

            <div className="relative">
              <button 
                type="button" 
                className="p-2 text-[#686058] hover:text-[#292521] rounded-full hover:bg-[#FAF3E7]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C64B32] rounded-full" />
            </div>

            <div className="hidden sm:block text-right">
              <p className="font-bold text-[#292521] leading-tight">{user.fullName}</p>
              <p className="text-[10px] text-[#686058] uppercase font-mono">{user.role}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
