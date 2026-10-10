import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Are the brass idols cast in pure solid brass?',
      a: 'Yes. All idols at Utsav Ghar are cast in heavy solid brass using the centuries-old Moradabad sand-casting method. They are never hollow resin and are finished with a protective tarnish-resistant coat.',
    },
    {
      q: 'What is the shipping timeline for Diwali orders?',
      a: 'Standard deliveries arrive in 3-5 business days across all Indian pincodes via BlueDart and Delhivery Express. For urgent celebrations, Express Air Priority ensures dispatch within 24-48 hours.',
    },
    {
      q: 'Do you offer free shipping?',
      a: 'Yes! We offer 100% Free Express Shipping on all orders of ₹999 and above. For orders below ₹999, a nominal flat delivery charge of ₹99 applies.',
    },
    {
      q: 'What happens if a delicate item or clay diya is damaged in transit?',
      a: 'We pack every parcel with multi-layer bubble wrap and reinforced cardboard crates. If any item arrives cracked or damaged, notify us with a photograph within 48 hours and we immediately dispatch a free replacement or full refund.',
    },
    {
      q: 'Can I customize corporate Diwali gift hampers?',
      a: 'Yes. For bulk orders above 25 units, we offer bespoke branding, customized gift scrolls, and greeting ribbons. Please email bulk@utsavghar.com or call +91 98765 43210.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, American Express, and NetBanking across 50+ banks through the secure Razorpay payment gateway.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#641C24]">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-[#686058]">Clear answers about our crafts, shipping, care, and payments.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-2">
            <h3 className="font-serif text-sm font-bold text-[#641C24]">{faq.q}</h3>
            <p className="text-xs text-[#443E38] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF3E7] p-6 rounded-xl border border-[#EDE3D5] text-center text-xs space-y-2">
        <p className="font-bold text-[#641C24]">Have another festive inquiry?</p>
        <p className="text-[#686058]">Our customer concierge is happy to assist you anytime.</p>
        <Link href="/contact" className="inline-block font-bold text-[#C64B32] hover:underline pt-1">
          Contact Us Here →
        </Link>
      </div>
    </div>
  );
}
