import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-xs text-[#443E38] leading-relaxed">
      <h1 className="font-serif text-3xl font-bold text-[#641C24]">Privacy Policy</h1>
      <p className="text-[11px] text-[#686058]">Last updated: October 2026</p>

      <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] space-y-4 shadow-sm">
        <h2 className="font-serif text-base font-bold text-[#641C24]">1. Information We Collect</h2>
        <p>
          Utsav Ghar collects only the personal information required to process and deliver your orders, including your name, delivery address, email, phone number, and transaction references. We never store raw debit/credit card numbers or banking passwords.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">2. How We Use Your Data</h2>
        <p>
          Your information is used strictly to fulfill orders, provide shipment tracking via SMS/email, and verify payments via authorized payment gateways (Razorpay).
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">3. Data Security & Storage</h2>
        <p>
          All network communications utilize 256-bit SSL encryption. We adhere strictly to Indian Information Technology (IT) Rules and never sell or rent your personal data to third-party marketing companies.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">4. Data Access and Deletion Requests</h2>
        <p>
          You may request an export or complete deletion of your customer profile at any time by contacting our Data Privacy Officer at <strong>support@utsavghar.com</strong>.
        </p>
      </div>
    </div>
  );
}
