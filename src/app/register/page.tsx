'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email);
    setIsLoading(false);
    router.push('/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-8 rounded-2xl border border-[#EDE3D5] shadow-festive-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#641C24] flex items-center justify-center mx-auto text-[#C6A15B]">
            <Flame className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Create Account</h1>
          <p className="text-xs text-[#686058]">Join the Utsav Ghar festive family for special privileges</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#292521] block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 outline-none"
              />
              <User className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 outline-none"
              />
              <Mail className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 outline-none"
              />
              <Phone className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#292521] block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg py-2.5 pl-9 pr-3 outline-none"
              />
              <Lock className="w-4 h-4 text-[#C6A15B] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#641C24] hover:bg-[#832833] text-white py-3 rounded-lg font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-festive-sm"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#686058] pt-2">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-[#641C24] hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
