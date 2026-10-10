export type UserRole = 
  | 'admin'
  | 'super_admin'
  | 'store_manager'
  | 'catalog_manager'
  | 'order_manager'
  | 'customer_support'
  | 'analyst'
  | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  houseNo: string;
  streetLocality: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  showOnHome: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku: string;
  priceOverride?: number; // In INR Rupees
  stockQuantity: number;
  attributes?: Record<string, string>; // e.g. { size: 'Large', material: 'Pure Brass' }
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId?: string;
  url: string;
  alt: string;
  sortOrder?: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  regularPrice: number; // In INR Rupees
  salePrice?: number;   // Genuine discount price
  costPrice?: number;
  shortDescription?: string;
  description: string;
  materials?: string;
  dimensions?: string;
  weightGrams?: number;
  isFeatured: boolean;
  isDeal: boolean;
  status: 'draft' | 'active' | 'archived';
  images: ProductImage[];
  variants: ProductVariant[];
  stockQuantity: number;
  rating?: number;
  reviewCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  slug: string;
  sku: string;
  imageUrl: string;
  price: number;
  regularPrice: number;
  quantity: number;
  variantTitle?: string;
  maxStock: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_failed'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 
  | 'unpaid'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingProvider?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 15 for 15%) or flat INR
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productTitle?: string;
  userId?: string;
  customerName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  announcementBar: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  ctaLink: string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  timeZone: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxPercentage: number;
  returnWindowDays: number;
  announcementText: string;
  maintenanceMode: boolean;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId?: string;
  productTitle: string;
  sku: string;
  changeAmount: number;
  newStock: number;
  reason: string;
  adminEmail?: string;
  createdAt: string;
}
