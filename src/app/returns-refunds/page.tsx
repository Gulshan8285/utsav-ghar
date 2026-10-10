import React from 'react';

export default function ReturnsRefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-xs text-[#443E38] leading-relaxed">
      <h1 className="font-serif text-3xl font-bold text-[#641C24]">Returns & Refund Policy</h1>
      <p className="text-[11px] text-[#686058]">Last updated: October 2026</p>

      <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] space-y-4 shadow-sm">
        <h2 className="font-serif text-base font-bold text-[#641C24]">1. 7-Day Easy Returns Window</h2>
        <p>
          We want you to be completely delighted with your festive items. You may request a return within 7 calendar days of delivery if the item is unused, in original packaging, with all certificates and tags intact.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">2. Damaged in Transit (Zero-Risk Guarantee)</h2>
        <p>
          In the rare event that an earthen diya or handcrafted idol arrives broken or dented during transit, simply email a photo of the package to <strong>support@utsavghar.com</strong> or WhatsApp our helpline within 48 hours. We will immediately dispatch a free replacement or initiate a 100% refund without requiring return courier hassles.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">3. Non-Returnable Festive Categories</h2>
        <p>
          For food safety and hygiene reasons, edible items such as gourmet dry fruits, festive mithai boxes, opened incense dhoop cones, and customized engraved brass plaques are non-returnable unless received in a damaged condition.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">4. Refund Processing Time</h2>
        <p>
          Approved refunds are processed back to the original payment source (UPI, Credit/Debit Card, or NetBanking) within 3 to 5 business days from approval.
        </p>
      </div>
    </div>
  );
}
