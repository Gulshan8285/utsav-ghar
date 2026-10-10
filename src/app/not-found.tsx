import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FAF3E7] text-[#641C24] flex items-center justify-center mx-auto border border-[#EDE3D5]">
        <Flame className="w-8 h-8 text-[#C6A15B]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C6A15B]">404 Not Found</span>
        <h1 className="font-serif text-3xl font-bold text-[#641C24]">May Your Way Be Lit</h1>
        <p className="text-xs text-[#686058]">
          The festive page or creation you are searching for may have been moved or is no longer available.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-full text-xs font-bold transition-colors shadow-sm"
        >
          Return to Utsav Ghar Storefront <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
