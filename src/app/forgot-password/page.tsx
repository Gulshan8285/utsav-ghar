'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-8 rounded-2xl border border-[#EDE3D5] shadow-festive-md space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#641C24]">Reset Password</h1>
          <p className="text-xs text-[#686058] mt-1">
            Enter your registered email address and we will dispatch a secure reset link.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FAF3E7] p-5 rounded-xl border border-[#EDE3D5] text-center space-y-2 text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#C6A15B] mx-auto" />
            <p className="font-bold text-[#641C24]">Instructions Sent</p>
            <p className="text-[#443E38]">
              We have dispatched a password recovery link to <strong>{email}</strong>.
            </p>
            <div className="pt-2">
              <Link href="/login" className="font-bold text-[#641C24] hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

            <button
              type="submit"
              className="w-full bg-[#641C24] hover:bg-[#832833] text-white py-3 rounded-lg font-bold tracking-wide transition-colors"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-[#686058] hover:text-[#292521]">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
