'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = () => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reviews) setReviews(data.reviews);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status }),
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#EDE3D5] pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#641C24]">Review Moderation</h1>
        <p className="text-xs text-[#686058] mt-0.5">Moderate customer reviews, verify purchase statuses, and maintain authentic community trust</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#C6A15B]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {rev.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-[#292521] text-sm">"{rev.title}"</h4>
              <p className="text-[#443E38] mt-1 leading-relaxed">{rev.comment}</p>
            </div>

            <div className="border-t border-[#EDE3D5] pt-3 flex items-center justify-between text-[11px] text-[#686058]">
              <div>
                <p className="font-bold text-[#641C24]">{rev.customerName}</p>
                <p className="truncate max-w-[200px]">{rev.productTitle}</p>
              </div>

              <div className="flex gap-2">
                {rev.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(rev.id, 'approved')}
                    className="bg-emerald-700 text-white px-2.5 py-1 rounded font-bold hover:bg-emerald-800 transition-colors"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(rev.id, 'rejected')}
                    className="bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
