import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-xs text-[#443E38] leading-relaxed">
      <h1 className="font-serif text-3xl font-bold text-[#641C24]">Shipping & Delivery Policy</h1>
      <p className="text-[11px] text-[#686058]">Last updated: October 2026</p>

      <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] space-y-4 shadow-sm">
        <h2 className="font-serif text-base font-bold text-[#641C24]">1. Delivery Coverage</h2>
        <p>
          Utsav Ghar ships to all serviceable PIN codes across India through Tier-1 express logistics partners including BlueDart Express, Delhivery, and DTDC.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">2. Shipping Charges & Free Delivery Threshold</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Orders above ₹999:</strong> 100% Free Express Delivery across India.</li>
          <li><strong>Orders below ₹999:</strong> A nominal flat shipping charge of ₹99 applies.</li>
          <li><strong>Express Air Priority (Optional):</strong> ₹149 extra for dispatch priority within 24 hours.</li>
        </ul>

        <h2 className="font-serif text-base font-bold text-[#641C24]">3. Dispatch & Transit Timelines</h2>
        <p>
          Standard orders are processed within 24-48 business hours. Transit typically takes 3 to 5 business days for metro cities, and 4 to 6 business days for non-metro locations. During peak Dhanteras & Diwali festive weeks, we recommend placing orders at least 6 days in advance.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">4. Transit Protection & Safe Packaging</h2>
        <p>
          Every brass idol, urli bowl, and terracotta diya set is wrapped in triple-layer bubble wrap, placed in heavy corrugated boxes with corner protectors, and sealed with tamper-evident security tape.
        </p>

        <h2 className="font-serif text-base font-bold text-[#641C24]">5. Tracking Your Parcel</h2>
        <p>
          Upon dispatch, an automated SMS and email containing the Air Waybill (AWB) number and live tracking link will be sent to your registered contact details.
        </p>
      </div>
    </div>
  );
}
