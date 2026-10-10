'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, ProductVariant, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  totalItemCount: number;
  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 249;
const STANDARD_SHIPPING_FEE = 40;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('utsav_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('utsav_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedCoupon = localStorage.getItem('utsav_coupon');
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('utsav_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isLoaded]);

  // Save wishlist
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('utsav_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, isLoaded]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems(prevItems => {
      const variantId = variant?.id;
      const existingIndex = prevItems.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      );

      const price = variant?.priceOverride || product.salePrice || product.regularPrice;
      const imageUrl = product.images[0]?.url || 'https://images.unsplash.com/photo-1567591370504-20b1f7e7195c?auto=format&fit=crop&w=800&q=80';
      const maxStock = variant ? variant.stockQuantity : product.stockQuantity;

      if (existingIndex >= 0) {
        const updated = [...prevItems];
        const newQty = Math.min(maxStock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variantId || 'base'}-${Date.now()}`,
          productId: product.id,
          variantId,
          title: product.title,
          slug: product.slug,
          sku: variant?.sku || product.sku,
          imageUrl,
          price,
          regularPrice: product.regularPrice,
          quantity: Math.min(maxStock, Math.max(1, quantity)),
          variantTitle: variant?.title,
          maxStock,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        const validatedQty = Math.min(item.maxStock, quantity);
        return { ...item, quantity: validatedQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountAmount(0);
    localStorage.removeItem('utsav_cart');
    localStorage.removeItem('utsav_coupon');
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponCode(code.toUpperCase());
        setDiscountAmount(data.discount);
        localStorage.setItem('utsav_coupon', code.toUpperCase());
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch {
      // Local fallback calculation if offline
      if (code.toUpperCase() === 'DIWALI10' && subtotal >= 999) {
        const disc = Math.round(subtotal * 0.1);
        setCouponCode('DIWALI10');
        setDiscountAmount(disc);
        return { success: true, message: `DIWALI10 applied! You saved ₹${disc}` };
      } else if (code.toUpperCase() === 'WELCOME100' && subtotal >= 499) {
        setCouponCode('WELCOME100');
        setDiscountAmount(100);
        return { success: true, message: 'WELCOME100 applied! You saved ₹100' };
      }
      return { success: false, message: 'Unable to validate coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    localStorage.removeItem('utsav_coupon');
  };

  // Wishlist controls
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        applyCoupon,
        removeCoupon,
        discountAmount,
        subtotal,
        shippingFee,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        qualifiesForFreeShipping,
        amountNeededForFreeShipping,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        totalItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
