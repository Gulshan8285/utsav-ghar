'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ShoppingBag,
  Flame
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useAuth } from '@/lib/auth/auth-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState('');

  // Address Fields
  const [houseNo, setHouseNo] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pinCode, setPinCode] = useState('');
  const [country] = useState('India');

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 
    'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Adjust total for express delivery if selected
  const expressFee = deliveryMethod === 'express' ? 149 : 0;
  const finalTotal = totalAmount + expressFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!customerName || !customerEmail || !customerPhone) {
        setErrorMessage('Please fill in your name, email, and 10-digit mobile number.');
        return;
      }
      if (!/^\d{10}$/.test(customerPhone.replace(/[^0-9]/g, '').slice(-10))) {
        setErrorMessage('Please enter a valid 10-digit Indian phone number.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!houseNo || !streetLocality || !city || !state || !pinCode) {
        setErrorMessage('Please complete all required shipping address fields.');
        return;
      }
      if (!/^\d{6}$/.test(pinCode)) {
        setErrorMessage('Please enter a valid 6-digit PIN code.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Create order on the server
      const orderPayload = {
        userId: user?.id,
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress: {
          fullName: customerName,
          phone: customerPhone,
          houseNo,
          streetLocality,
          landmark,
          city,
          state,
          pinCode,
          country,
        },
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.title,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        couponCode,
        paymentMethod: paymentMethod === 'razorpay' ? 'razorpay_upi_cards' : 'cash_on_delivery',
        notes: `Delivery Method: ${deliveryMethod === 'express' ? 'Express Air Priority' : 'Standard Festive Delivery'}`,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize order on server');
      }

      const createdOrder = orderData.order;

      // 2. Generate Razorpay Payment order server-side
      const razorpayRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInRupees: finalTotal,
          orderReference: createdOrder.orderNumber,
        }),
      });

      const razorpayData = await razorpayRes.json();
      if (!razorpayData.success) {
        throw new Error(razorpayData.error || 'Failed to initialize payment gateway');
      }

      // 3. Verify Payment Signature on server
      // In sandbox/test checkout, we pass the simulated sandbox signature
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createdOrder.id,
          razorpayOrderId: razorpayData.orderId,
          razorpayPaymentId: `pay_sbx_${Date.now()}`,
          razorpaySignature: 'sbx_sig_verified_mock_token_8899',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error('Payment signature verification failed.');
      }

      // 4. Clear cart and redirect to order confirmation
      clearCart();
      router.push(`/order-confirmation/${createdOrder.orderNumber}`);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during payment processing. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#641C24]">Your cart is empty</h2>
        <p className="text-xs text-[#686058]">Add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block bg-[#641C24] text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* CHECKOUT HEADER & PROGRESS BAR */}
      <div className="border-b border-[#EDE3D5] pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641C24] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C6A15B]" /> Secure Festive Checkout
            </h1>
            <p className="text-xs text-[#686058] mt-0.5">Encrypted 256-Bit SSL Checkout | Razorpay Secured</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-full ${currentStep >= 1 ? 'bg-[#641C24] text-white' : 'bg-[#EDE3D5] text-[#686058]'}`}>
              1
            </span>
            <span className="text-[#EDE3D5]">―</span>
            <span className={`px-2.5 py-1 rounded-full ${currentStep >= 2 ? 'bg-[#641C24] text-white' : 'bg-[#EDE3D5] text-[#686058]'}`}>
              2
            </span>
            <span className="text-[#EDE3D5]">―</span>
            <span className={`px-2.5 py-1 rounded-full ${currentStep >= 3 ? 'bg-[#641C24] text-white' : 'bg-[#EDE3D5] text-[#686058]'}`}>
              3
            </span>
            <span className="text-[#EDE3D5]">―</span>
            <span className={`px-2.5 py-1 rounded-full ${currentStep >= 4 ? 'bg-[#641C24] text-white' : 'bg-[#EDE3D5] text-[#686058]'}`}>
              4
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-[#FAE8E4] border border-[#C64B32] p-4 rounded-xl flex items-center gap-3 text-xs text-[#641C24]">
          <AlertCircle className="w-5 h-5 text-[#C64B32] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MULTI-STEP FORMS */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: CUSTOMER DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#641C24] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C6A15B]" /> Step 1: Customer Details
                </h3>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292521] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Verma"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">Mobile Number (for SMS & Tracking) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9811122334"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292521] block mb-1">Company Name (Optional for GST Invoice)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Optional business name"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  Continue to Shipping Address <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#641C24] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C6A15B]" /> Step 2: Shipping Address
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#C64B32] hover:underline"
                >
                  Edit Customer Info
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292521] block mb-1">Flat, House no., Building, Apartment *</label>
                <input
                  type="text"
                  required
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 402, Lotus Towers"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#292521] block mb-1">Area, Street, Sector, Village *</label>
                <input
                  type="text"
                  required
                  value={streetLocality}
                  onChange={(e) => setStreetLocality(e.target.value)}
                  placeholder="e.g. Indiranagar 100ft Road"
                  className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Metro Station"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">Town / City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full bg-[#FFF9F0] border border-[#EDE3D5] focus:border-[#C6A15B] rounded-lg px-3.5 py-2.5 text-xs text-[#292521] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#292521] block mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-[#EDE3D5]/40 border border-[#EDE3D5] rounded-lg px-3.5 py-2.5 text-xs text-[#686058]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#686058] hover:text-[#292521]"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  Continue to Delivery Method <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: DELIVERY METHOD */}
          {currentStep === 3 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#641C24] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#C6A15B]" /> Step 3: Choose Delivery Method
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#C64B32] hover:underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="space-y-3">
                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'standard' ? 'border-[#641C24] bg-[#FAF3E7]' : 'border-[#EDE3D5] bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="accent-[#641C24]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#292521]">Standard Festive Delivery (BlueDart / Delhivery)</h4>
                        <p className="text-[11px] text-[#686058] mt-0.5">Delivered within 3 - 5 business days with festive care packaging</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#641C24]">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>
                </label>

                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'express' ? 'border-[#641C24] bg-[#FAF3E7]' : 'border-[#EDE3D5] bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="accent-[#641C24]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#292521] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Express Air Priority Delivery
                        </h4>
                        <p className="text-[11px] text-[#686058] mt-0.5">Guaranteed priority dispatch within 24-48 hours</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#641C24]">+₹149</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-[#686058] hover:text-[#292521]"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-[#641C24] hover:bg-[#832833] text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT SELECTION & CONFIRMATION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE3D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#641C24] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#C6A15B]" /> Step 4: Payment Method
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#C64B32] hover:underline"
                >
                  Edit Options
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' ? 'border-[#641C24] bg-[#FAF3E7]' : 'border-[#EDE3D5] bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-[#641C24] mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#292521]">Razorpay Gateway (UPI, Cards, NetBanking)</h4>
                          <span className="text-[10px] bg-[#641C24] text-[#C6A15B] font-extrabold px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <p className="text-[11px] text-[#686058] mt-1">
                          Instant UPI via Google Pay, PhonePe, Paytm, BHIM or all Major Credit/Debit Cards & NetBanking.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#686058]">
                          <span className="bg-white border px-1.5 py-0.5 rounded font-mono">UPI</span>
                          <span className="bg-white border px-1.5 py-0.5 rounded font-mono">RuPay</span>
                          <span className="bg-white border px-1.5 py-0.5 rounded font-mono">Visa</span>
                          <span className="bg-white border px-1.5 py-0.5 rounded font-mono">Mastercard</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Sandbox notice */}
              <div className="bg-[#FAF3E7] p-3.5 rounded-xl border border-[#C6A15B]/50 text-xs text-[#641C24] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B]" /> Verified Safe Checkout Environment
                </p>
                <p className="text-[11px] text-[#443E38]">
                  Test Mode is enabled. Clicking "Pay & Confirm Order" securely communicates with the backend signature verification pipeline without charging your actual bank card.
                </p>
              </div>

              {/* Address Review Box */}
              <div className="bg-[#FFF9F0] p-4 rounded-xl border border-[#EDE3D5] text-xs text-[#443E38] space-y-1">
                <p className="font-bold text-[#641C24]">Delivering to:</p>
                <p>{customerName} | {customerPhone}</p>
                <p>{houseNo}, {streetLocality}, {city}, {state} - {pinCode}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-[#686058] hover:text-[#292521]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="bg-[#641C24] hover:bg-[#832833] text-white px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-luxury shadow-festive-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Processing Payment...'
                  ) : (
                    <>Pay ₹{finalTotal.toLocaleString('en-IN')} & Confirm Order <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm p-6 space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#641C24] border-b border-[#EDE3D5] pb-3">
            Items in Order ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-[#EDE3D5] pr-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-2.5 flex items-center gap-3 first:pt-0">
                <div className="w-14 h-14 bg-[#FFF9F0] rounded border border-[#EDE3D5] overflow-hidden relative shrink-0">
                  <Image src={item.imageUrl} alt={item.title} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#292521] truncate">{item.title}</p>
                  <p className="text-[10px] text-[#686058]">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-xs font-bold text-[#641C24]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-[#443E38] border-t border-[#EDE3D5] pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#292521]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#C64B32] font-semibold">
                <span>Diwali Discount ({couponCode})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-[#292521]">
                {shippingFee === 0 ? <span className="text-[#641C24] font-bold">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            {deliveryMethod === 'express' && (
              <div className="flex justify-between text-[#C6A15B] font-semibold">
                <span>Express Air Priority</span>
                <span>+₹149</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#641C24] border-t border-[#EDE3D5] pt-3">
              <span>Total Payable</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-[#FAF3E7] p-3.5 rounded-lg border border-[#EDE3D5] text-xs text-[#686058] space-y-1">
            <p className="font-bold text-[#641C24] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Festive Delivery Assurance
            </p>
            <p className="text-[11px]">
              Inspected by traditional quality control officers before dispatch. Tracking link sent via SMS and email immediately upon dispatch.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
