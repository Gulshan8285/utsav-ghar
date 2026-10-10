'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    const res = await login(email);
    setIsLoading(false);

    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('festive_utsav_pass');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-8 rounded-2xl border border-[#EDE3D5] shadow-festive-md space-y-6">
        
        {/* LOGO */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#641C24] flex items-center justify-center mx-auto text-[#C6A15B]">
            <Flame className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Welcome Back</h1>
          <p className="text-xs text-[#686058]">Sign in to access your festive orders and saved wishlist</p>
        </div>

        {error && (
          <div className="p-3 bg-[#FAE8E4] border border-[#C64B32] rounded-lg flex items-center gap-2 text-xs text-[#641C24]">
            <AlertCircle className="w-4 h-4 text-[#C64B32] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 text-xs outline-none"
              />
              <Mail className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#292521]">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-[#C64B32] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 text-xs outline-none"
              />
              <Lock className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#641C24] hover:bg-[#832833] text-white py-3 rounded-lg font-bold tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-festive-sm"
          >
            {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNTS QUICK FILL */}
        <div className="bg-[#FAF3E7] p-3.5 rounded-xl border border-[#EDE3D5] text-[11px] text-[#443E38] space-y-2">
          <p className="font-bold text-[#641C24] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Quick Test Logins:
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@utsavghar.com')}
              className="text-left bg-white border border-[#EDE3D5] px-2.5 py-1.5 rounded hover:border-[#641C24] flex justify-between"
            >
              <span>👑 Super Admin: <strong>admin@utsavghar.com</strong></span>
              <span className="text-[#C6A15B] font-bold">Use</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ananya@example.com')}
              className="text-left bg-white border border-[#EDE3D5] px-2.5 py-1.5 rounded hover:border-[#641C24] flex justify-between"
            >
              <span>🛍️ Customer: <strong>ananya@example.com</strong></span>
              <span className="text-[#C6A15B] font-bold">Use</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#686058] pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-[#641C24] hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
