'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#641C24]">Contact Customer Care</h1>
        <p className="text-xs sm:text-sm text-[#686058] max-w-md mx-auto">
          Our festive concierge is here to help with orders, custom corporate hampers, and product queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CONTACT INFO TILES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#641C24] border-b border-[#EDE3D5] pb-2">
              Utsav Ghar Retail India Pvt. Ltd.
            </h3>

            <div className="space-y-3 text-xs text-[#443E38]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292521]">Email Us</p>
                  <a href="mailto:support@utsavghar.com" className="text-[#641C24] hover:underline">
                    support@utsavghar.com
                  </a>
                  <p className="text-[11px] text-[#686058]">Average response time: 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292521]">Phone Support</p>
                  <p>+91 98765 43210</p>
                  <p className="text-[11px] text-[#686058]">Mon to Sat: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292521]">Registered Heritage Studios</p>
                  <p className="text-[11px] text-[#686058] leading-relaxed">
                    Utsav Ghar Heritage Studios, Connaught Place, New Delhi, Delhi 110001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292521]">Corporate & Bulk Gifting</p>
                  <p className="text-[11px] text-[#686058]">bulk@utsavghar.com for orders above 25 units</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#EDE3D5] shadow-festive-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#641C24]">Send Us a Message</h3>

          {submitted ? (
            <div className="bg-[#FAF3E7] p-8 rounded-xl border border-[#EDE3D5] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#C6A15B] mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#641C24]">Message Received!</h4>
              <p className="text-xs text-[#443E38]">
                Thank you, {name}. A member of our festive care team will reach out to you within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#292521] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#292521] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#292521] block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order query, delivery status, or gift hamper request"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#292521] block mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist your Diwali preparations?"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-lg font-bold tracking-wide transition-colors flex items-center gap-2"
              >
                Send Message <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
