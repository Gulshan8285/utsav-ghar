'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles, 
  MapPin, 
  Share2, 
  Info, 
  ChevronRight 
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';
import ProductCard from './ProductCard';

interface ProductDetailViewProps {
  product: Product & { relatedProducts: Product[]; reviews: Review[] };
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Variant selection
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Pincode estimation
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  // Reviews form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewPhone, setReviewPhone] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const price = selectedVariant?.priceOverride || product.salePrice || product.regularPrice;
  const hasDiscount = product.regularPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.regularPrice - price) / product.regularPrice) * 100) 
    : 0;

  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryEstimate(`Express Delivery to ${pincode} by 2-3 business days (Safe Transit Guaranteed)`);
    } else {
      setDeliveryEstimate('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          isVerifiedPurchase: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const activeImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#686058]">
        <Link href="/" className="hover:text-[#641C24]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[#641C24]">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        {product.categoryName && (
          <>
            <span className="text-[#C6A15B] font-semibold">{product.categoryName}</span>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-[#292521] truncate max-w-xs">{product.title}</span>
      </nav>

      {/* 2. MAIN PRODUCT SECTION: GALLERY + DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#EDE3D5] shadow-festive-md">
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={activeImage.alt || product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-[#C64B32] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {discountPercent}% OFF
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${
                isWishlisted ? 'bg-[#641C24] text-white' : 'bg-white/90 text-[#292521] hover:text-[#641C24]'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 relative shrink-0 transition-all ${
                    selectedImageIndex === idx ? 'border-[#641C24] scale-95 shadow-sm' : 'border-[#EDE3D5] opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-widest">
                {product.categoryName || 'Diwali Festive Edition'}
              </span>
              <span className="text-[11px] font-mono text-[#686058]">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating Summary */}
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 stroke-amber-500' : 'text-neutral-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
                <span className="text-xs text-neutral-400">({product.reviews.length || product.reviewCount || 0} reviews)</span>
              </div>
            )}
          </div>

          {/* Price Block */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-neutral-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.regularPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full ml-auto">
              Save ₹{(product.regularPrice - price).toLocaleString('en-IN')} ({discountPercent}% OFF)
            </span>
          </div>

          {/* Detailed Product Overview & Highlights */}
          <div className="space-y-2.5 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Sacred Significance & Detailed Overview
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
              {product.description}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed pt-2 border-t border-neutral-200/60">
              Hand-selected for Deepawali rituals, this auspicious piece invites peace, wealth, and spiritual bliss into your sanctuary. Carefully cushioned with 7-layer shock-absorbing box packaging for damage-proof transit before Dhanteras.
            </p>
          </div>

          {/* Variants (if any) */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                Select Option / Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedVariant?.id === variant.id 
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' 
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {variant.title} {variant.priceOverride ? `(₹${variant.priceOverride})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Grid */}
          <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-3 text-xs">
            {product.materials && (
              <div className="bg-white p-3 rounded-xl border border-neutral-200/70">
                <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Craft Material</span>
                <span className="font-semibold text-neutral-900">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="bg-white p-3 rounded-xl border border-neutral-200/70">
                <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Dimensions</span>
                <span className="font-semibold text-neutral-900">{product.dimensions}</span>
              </div>
            )}
            {product.weightGrams && (
              <div className="bg-white p-3 rounded-xl border border-neutral-200/70">
                <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Approx Weight</span>
                <span className="font-semibold text-neutral-900">{product.weightGrams}g</span>
              </div>
            )}
            <div className="bg-white p-3 rounded-xl border border-neutral-200/70">
              <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Availability</span>
              <span className={`font-semibold ${currentStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currentStock > 0 ? (currentStock <= 5 ? `Only ${currentStock} left` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-900">Quantity:</span>
              <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-500 hover:text-neutral-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="p-2 text-neutral-500 hover:text-neutral-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={currentStock <= 0}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* PIN CODE DELIVERY ESTIMATOR */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 space-y-2">
            <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C5A059]" /> Check Delivery Pincode:
            </span>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode (e.g. 110001)"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-[11px] text-emerald-700 font-medium pt-1">
                {deliveryEstimate}
              </p>
            )}
          </div>

        </div>

      </div>

      {/* 3. PRODUCT CARE & AUTHENTICITY */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
            Puja Ritual Guidelines & Craft Care
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full border border-neutral-200">
            Artisan Certified
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-neutral-600">
          <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
            <h4 className="font-bold text-neutral-900">Cleaning & Maintenance</h4>
            <p className="leading-relaxed">
              Wipe gently with a dry soft microfiber cloth. Do not use harsh chemical acids or ammonia-based cleaners.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
            <h4 className="font-bold text-neutral-900">Puja Preparation</h4>
            <p className="leading-relaxed">
              Clean with fresh water and dry thoroughly before applying chandan and kumkum tilak. Safe for daily oil, ghee, and camphor rituals.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
            <h4 className="font-bold text-neutral-900">Safe Delivery Guarantee</h4>
            <p className="leading-relaxed">
              Every parcel is cushioned with 7-layer bubble wrapping. Guaranteed express arrival before Dhanteras.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CUSTOMER REVIEWS SECTION */}
      <div className="space-y-8 pt-8 border-t border-[#EDE3D5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#641C24]">
              Customer Reviews ({product.reviews.length})
            </h3>
            <p className="text-xs text-[#686058] mt-0.5">
              Real reviews submitted by verified patrons of Utsav Ghar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 bg-white border border-[#C6A15B] text-[#641C24] hover:bg-[#FAF3E7] px-5 py-2.5 rounded-full text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Write a Review
          </button>
        </div>

        {product.reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#EDE3D5] text-center">
            <p className="text-xs text-[#686058]">Be the first to review this festive piece!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-xl border border-[#EDE3D5] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#C6A15B]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] font-bold text-[#641C24] bg-[#FAF3E7] px-2 py-0.5 rounded border border-[#EDE3D5] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#C6A15B]" /> Verified Purchase
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-sm font-bold text-[#292521]">{rev.title}</h4>
                <p className="text-xs text-[#443E38] leading-relaxed">{rev.comment}</p>

                <div className="pt-2 text-[11px] text-[#686058] flex justify-between">
                  <span className="font-bold text-[#641C24]">{rev.customerName}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. RELATED PRODUCTS */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#EDE3D5]">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#641C24]">
              You May Also Like
            </h3>
            <Link href={`/category/${product.categoryName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-xs font-bold text-[#C6A15B] hover:underline">
              View Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* 6. WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EDE3D5] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#641C24]">Share Your Review</h3>
            
            {reviewSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#C6A15B] mx-auto" />
                <p className="text-sm font-bold text-[#641C24]">Review Submitted!</p>
                <p className="text-xs text-[#686058]">Thank you for your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full border border-[#EDE3D5] rounded-xl px-3 py-2 outline-none"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Mobile / WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    className="w-full border border-[#EDE3D5] rounded-xl px-3 py-2 outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full border border-[#EDE3D5] rounded px-3 py-2 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Disappointed)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full border border-[#EDE3D5] rounded px-3 py-2 outline-none"
                    placeholder="e.g. Magnificent Moradabad Brass!"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-[#EDE3D5] rounded px-3 py-2 outline-none"
                    placeholder="Describe the craftsmanship, weight, and festive aura..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-2.5 border border-[#EDE3D5] rounded font-bold text-[#686058]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex-1 py-2.5 bg-[#641C24] text-white rounded font-bold hover:bg-[#832833]"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
