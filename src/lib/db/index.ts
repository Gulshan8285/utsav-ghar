import fs from 'fs';
import path from 'path';
import { 
  Product, 
  Category, 
  Coupon, 
  Campaign, 
  StoreSettings, 
  Order, 
  Review, 
  UserProfile, 
  InventoryMovement, 
  AuditLog,
  Cart,
  OrderStatus,
  PaymentStatus
} from '../types';
import { 
  initialCategories, 
  initialProducts, 
  initialCoupons, 
  initialCampaigns, 
  initialStoreSettings, 
  initialReviews, 
  initialProfiles 
} from './seed-data';

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  campaigns: Campaign[];
  storeSettings: StoreSettings;
  orders: Order[];
  reviews: Review[];
  profiles: UserProfile[];
  inventoryMovements: InventoryMovement[];
  auditLogs: AuditLog[];
  newsletterSubscribers: { email: string; date: string }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'utsav_store.json');

// Ensure data directory exists
function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      categories: initialCategories,
      products: initialProducts,
      coupons: initialCoupons,
      campaigns: initialCampaigns,
      storeSettings: initialStoreSettings,
      orders: [
        {
          id: 'ord-1001',
          orderNumber: 'UG-2026-1001',
          userId: 'usr-customer-1',
          customerEmail: 'ananya@example.com',
          customerName: 'Ananya Verma',
          customerPhone: '+91 98111 22334',
          shippingAddress: {
            id: 'addr-1',
            fullName: 'Ananya Verma',
            phone: '+91 98111 22334',
            houseNo: 'Flat 402, Lotus Towers',
            streetLocality: 'Indiranagar 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560038',
            country: 'India',
          },
          items: [
            {
              id: 'item-1',
              orderId: 'ord-1001',
              productId: 'prod-1',
              title: 'Heritage Brass Lakshmi Ganesh Idol Set',
              sku: 'UG-IDL-001',
              price: 2899,
              quantity: 1,
              total: 2899,
              imageUrl: 'https://images.unsplash.com/photo-1567591370504-20b1f7e7195c?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'item-2',
              orderId: 'ord-1001',
              productId: 'prod-4',
              title: 'Traditional Hand-Painted Clay Diya Set (Pack of 12)',
              sku: 'UG-DYA-001',
              price: 449,
              quantity: 2,
              total: 898,
              imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
            }
          ],
          subtotal: 3797,
          discountAmount: 379,
          shippingFee: 0,
          taxAmount: 0,
          totalAmount: 3418,
          couponCode: 'DIWALI10',
          paymentStatus: 'paid',
          fulfillmentStatus: 'shipped',
          paymentMethod: 'razorpay',
          paymentId: 'pay_live_sample_98432',
          trackingProvider: 'BlueDart Express',
          trackingNumber: 'BD892019283IN',
          notes: 'Please pack in extra festive bubble wrap',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ],
      reviews: initialReviews,
      profiles: initialProfiles,
      inventoryMovements: [
        {
          id: 'mov-1',
          productId: 'prod-1',
          productTitle: 'Heritage Brass Lakshmi Ganesh Idol Set',
          sku: 'UG-IDL-001',
          changeAmount: 20,
          newStock: 20,
          reason: 'Initial Diwali Festive Stock Inward',
          adminEmail: 'admin@utsavghar.com',
          createdAt: new Date().toISOString(),
        }
      ],
      auditLogs: [
        {
          id: 'aud-1',
          adminEmail: 'admin@utsavghar.com',
          action: 'STORE_INITIALIZED',
          entityType: 'STORE',
          entityId: 'utsav-ghar',
          details: { message: 'Store database loaded with 24 seed Diwali products' },
          createdAt: new Date().toISOString(),
        }
      ],
      newsletterSubscribers: [
        { email: 'festive.shopper@gmail.com', date: new Date().toISOString() }
      ],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, re-initializing', err);
    return ensureDb();
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (e) {
    console.error('Failed to write database file', e);
  }
}

// ======================= REPOSITORY METHODS =======================

export const db = {
  // PRODUCTS
  getProducts(filters?: {
    categoryId?: string;
    categorySlug?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    material?: string;
    featuredOnly?: boolean;
    dealsOnly?: boolean;
    status?: 'active' | 'draft' | 'archived' | 'all';
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  }): Product[] {
    const data = ensureDb();
    let items = data.products.filter(p => {
      // Default to active unless explicitly asking for all/draft
      if (!filters?.status || filters.status === 'active') {
        if (p.status !== 'active') return false;
      } else if (filters.status !== 'all') {
        if (p.status !== filters.status) return false;
      }

      if (filters?.categoryId && p.categoryId !== filters.categoryId) return false;
      if (filters?.categorySlug) {
        const cat = data.categories.find(c => c.slug === filters.categorySlug);
        if (!cat || p.categoryId !== cat.id) return false;
      }
      if (filters?.featuredOnly && !p.isFeatured) return false;
      if (filters?.dealsOnly && !p.isDeal) return false;

      const effectivePrice = p.salePrice || p.regularPrice;
      if (filters?.minPrice !== undefined && effectivePrice < filters.minPrice) return false;
      if (filters?.maxPrice !== undefined && effectivePrice > filters.maxPrice) return false;

      if (filters?.material && p.materials) {
        if (!p.materials.toLowerCase().includes(filters.material.toLowerCase())) return false;
      }

      if (filters?.query) {
        const q = filters.query.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inSku = p.sku.toLowerCase().includes(q);
        const inMaterial = p.materials?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inSku && !inMaterial) return false;
      }

      return true;
    });

    // Populate category names
    items = items.map(p => ({
      ...p,
      categoryName: data.categories.find(c => c.id === p.categoryId)?.name || 'Festive Essentials',
    }));

    // Sorting
    if (filters?.sortBy === 'price_asc') {
      items.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
    } else if (filters?.sortBy === 'price_desc') {
      items.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
    } else if (filters?.sortBy === 'newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters?.sortBy === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return items;
  },

  getProductBySlug(slug: string): (Product & { relatedProducts: Product[]; reviews: Review[] }) | null {
    const data = ensureDb();
    const product = data.products.find(p => p.slug === slug);
    if (!product) return null;

    const related = data.products
      .filter(p => p.id !== product.id && p.categoryId === product.categoryId && p.status === 'active')
      .slice(0, 4);

    const reviews = data.reviews.filter(r => r.productId === product.id && r.status === 'approved');

    return {
      ...product,
      categoryName: data.categories.find(c => c.id === product.categoryId)?.name,
      relatedProducts: related,
      reviews,
    };
  },

  getProductById(id: string): Product | null {
    const data = ensureDb();
    const product = data.products.find(p => p.id === id);
    if (!product) return null;
    return {
      ...product,
      categoryName: data.categories.find(c => c.id === product.categoryId)?.name,
    };
  },

  saveProduct(productData: Partial<Product> & { title: string; regularPrice: number; categoryId: string }): Product {
    const data = ensureDb();
    const now = new Date().toISOString();

    if (productData.id) {
      const idx = data.products.findIndex(p => p.id === productData.id);
      if (idx >= 0) {
        const existing = data.products[idx];
        const updated: Product = {
          ...existing,
          ...productData,
          updatedAt: now,
        };
        data.products[idx] = updated;
        writeDb(data);
        return updated;
      }
    }

    // New product
    const newId = `prod-${Date.now()}`;
    const slug = productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sku = productData.sku || `UG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct: Product = {
      id: newId,
      title: productData.title,
      slug,
      sku,
      categoryId: productData.categoryId,
      regularPrice: productData.regularPrice,
      salePrice: productData.salePrice,
      description: productData.description || '',
      materials: productData.materials,
      dimensions: productData.dimensions,
      weightGrams: productData.weightGrams,
      isFeatured: !!productData.isFeatured,
      isDeal: !!productData.isDeal,
      status: productData.status || 'active',
      images: productData.images && productData.images.length > 0 ? productData.images : [
        { id: `img-${Date.now()}`, productId: newId, url: 'https://images.unsplash.com/photo-1567591370504-20b1f7e7195c?auto=format&fit=crop&w=800&q=80', alt: productData.title, sortOrder: 1, isPrimary: true }
      ],
      variants: productData.variants || [
        { id: `var-${Date.now()}`, productId: newId, title: 'Default', sku: `${sku}-DEF`, stockQuantity: productData.stockQuantity || 10, isActive: true }
      ],
      stockQuantity: productData.stockQuantity !== undefined ? productData.stockQuantity : 10,
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    data.products.unshift(newProduct);
    writeDb(data);
    return newProduct;
  },

  deleteProduct(id: string): boolean {
    const data = ensureDb();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      data.products.splice(idx, 1);
      writeDb(data);
      return true;
    }
    return false;
  },

  // CATEGORIES
  getCategories(): (Category & { productCount: number })[] {
    const data = ensureDb();
    return data.categories.map(cat => ({
      ...cat,
      productCount: data.products.filter(p => p.categoryId === cat.id && p.status === 'active').length,
    })).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getCategoryBySlug(slug: string): Category | null {
    const data = ensureDb();
    const cat = data.categories.find(c => c.slug === slug);
    if (!cat) return null;
    return {
      ...cat,
      productCount: data.products.filter(p => p.categoryId === cat.id && p.status === 'active').length,
    };
  },

  saveCategory(catData: Partial<Category> & { name: string }): Category {
    const data = ensureDb();
    if (catData.id) {
      const idx = data.categories.findIndex(c => c.id === catData.id);
      if (idx >= 0) {
        data.categories[idx] = { ...data.categories[idx], ...catData };
        writeDb(data);
        return data.categories[idx];
      }
    }

    const newId = `cat-${Date.now()}`;
    const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: newId,
      name: catData.name,
      slug,
      description: catData.description || '',
      imageUrl: catData.imageUrl || 'https://images.unsplash.com/photo-1567591370504-20b1f7e7195c?auto=format&fit=crop&w=800&q=80',
      showOnHome: catData.showOnHome !== undefined ? catData.showOnHome : true,
      sortOrder: catData.sortOrder || data.categories.length + 1,
    };
    data.categories.push(newCat);
    writeDb(data);
    return newCat;
  },

  // ORDERS
  getOrders(userId?: string): Order[] {
    const data = ensureDb();
    if (userId) {
      return data.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById(id: string): Order | null {
    const data = ensureDb();
    return data.orders.find(o => o.id === id) || null;
  },

  getOrderByNumber(orderNumber: string): Order | null {
    const data = ensureDb();
    return data.orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase().trim()) || null;
  },

  createOrder(orderInput: {
    userId?: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: any;
    items: any[];
    couponCode?: string;
    paymentMethod: string;
    notes?: string;
  }): Order {
    const data = ensureDb();
    const settings = data.storeSettings;
    const now = new Date().toISOString();

    // Calculate line items and verify prices against database
    let subtotal = 0;
    const verifiedItems = orderInput.items.map(item => {
      const product = data.products.find(p => p.id === item.productId);
      const price = product ? (product.salePrice || product.regularPrice) : item.price;
      const quantity = Math.max(1, item.quantity);
      const total = price * quantity;
      subtotal += total;

      // Deduct inventory safely
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
      }

      return {
        id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        orderId: '',
        productId: item.productId,
        variantId: item.variantId,
        title: product ? product.title : item.title,
        sku: product ? product.sku : (item.sku || 'UG-SKU'),
        price,
        quantity,
        total,
        imageUrl: item.imageUrl || (product?.images[0]?.url),
      };
    });

    // Validate Coupon
    let discountAmount = 0;
    if (orderInput.couponCode) {
      const coupon = data.coupons.find(c => c.code.toUpperCase() === orderInput.couponCode?.toUpperCase() && c.isActive);
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        coupon.timesUsed += 1;
      }
    }

    const freeShippingThreshold = settings.freeShippingThreshold || 249;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : (settings.standardShippingFee || 40);
    const taxAmount = 0; // Prices are MRP inclusive
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `UG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: orderInput.userId,
      customerEmail: orderInput.customerEmail,
      customerName: orderInput.customerName,
      customerPhone: orderInput.customerPhone,
      shippingAddress: orderInput.shippingAddress,
      items: verifiedItems.map(vi => ({ ...vi, orderId })),
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
      couponCode: orderInput.couponCode,
      paymentStatus: 'paid', // In sandbox / instant checkout flow
      fulfillmentStatus: 'confirmed',
      paymentMethod: orderInput.paymentMethod || 'razorpay',
      paymentId: `pay_${Date.now()}`,
      trackingProvider: 'Delhivery Festive Express',
      trackingNumber: `DEL${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      notes: orderInput.notes,
      createdAt: now,
      updatedAt: now,
    };

    data.orders.unshift(newOrder);

    // Record audit log
    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminEmail: 'system',
      action: 'ORDER_PLACED',
      entityType: 'ORDER',
      entityId: orderId,
      details: { orderNumber, totalAmount, customerEmail: orderInput.customerEmail },
      createdAt: now,
    });

    writeDb(data);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, tracking?: { provider: string; number: string }, adminEmail = 'admin@utsavghar.com'): Order | null {
    const data = ensureDb();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.fulfillmentStatus = status;
    if (tracking?.provider) order.trackingProvider = tracking.provider;
    if (tracking?.number) order.trackingNumber = tracking.number;
    order.updatedAt = new Date().toISOString();

    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminEmail,
      action: 'ORDER_STATUS_CHANGED',
      entityType: 'ORDER',
      entityId: orderId,
      details: { orderNumber: order.orderNumber, newStatus: status, tracking },
      createdAt: new Date().toISOString(),
    });

    writeDb(data);
    return order;
  },

  updatePaymentStatus(orderId: string, status: PaymentStatus, paymentId?: string): Order | null {
    const data = ensureDb();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.paymentStatus = status;
    if (paymentId) order.paymentId = paymentId;
    order.updatedAt = new Date().toISOString();
    writeDb(data);
    return order;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    const data = ensureDb();
    return data.coupons;
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const data = ensureDb();
    const coupon = data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < coupon.minOrderAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Add items worth ₹${coupon.minOrderAmount - subtotal} more to apply code ${coupon.code}` 
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      coupon,
      discount,
      message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount}`,
    };
  },

  saveCoupon(couponData: Partial<Coupon> & { code: string; discountValue: number }): Coupon {
    const data = ensureDb();
    const code = couponData.code.toUpperCase().trim();
    if (couponData.id) {
      const idx = data.coupons.findIndex(c => c.id === couponData.id);
      if (idx >= 0) {
        data.coupons[idx] = { ...data.coupons[idx], ...couponData, code };
        writeDb(data);
        return data.coupons[idx];
      }
    }

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code,
      description: couponData.description || 'Festive Discount',
      discountType: couponData.discountType || 'percentage',
      discountValue: couponData.discountValue,
      minOrderAmount: couponData.minOrderAmount || 0,
      maxDiscountAmount: couponData.maxDiscountAmount,
      timesUsed: 0,
      isActive: couponData.isActive !== undefined ? couponData.isActive : true,
    };
    data.coupons.unshift(newCoupon);
    writeDb(data);
    return newCoupon;
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const data = ensureDb();
    if (productId) {
      return data.reviews.filter(r => r.productId === productId);
    }
    return data.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addReview(reviewInput: {
    productId: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase?: boolean;
    userId?: string;
  }): Review {
    const data = ensureDb();
    const product = data.products.find(p => p.id === reviewInput.productId);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewInput.productId,
      productTitle: product?.title,
      customerName: reviewInput.customerName,
      rating: Math.min(5, Math.max(1, reviewInput.rating)),
      title: reviewInput.title,
      comment: reviewInput.comment,
      isVerifiedPurchase: reviewInput.isVerifiedPurchase ?? true,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    data.reviews.unshift(newReview);

    // Update product rating and review count
    if (product) {
      const prodReviews = data.reviews.filter(r => r.productId === product.id && r.status === 'approved');
      const sum = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
      product.rating = Number((sum / prodReviews.length).toFixed(1));
      product.reviewCount = prodReviews.length;
    }

    writeDb(data);
    return newReview;
  },

  moderateReview(reviewId: string, status: 'approved' | 'rejected'): boolean {
    const data = ensureDb();
    const rev = data.reviews.find(r => r.id === reviewId);
    if (!rev) return false;
    rev.status = status;
    writeDb(data);
    return true;
  },

  // INVENTORY
  getInventory(): { product: Product; available: number; lowStock: boolean }[] {
    const data = ensureDb();
    return data.products.map(p => ({
      product: p,
      available: p.stockQuantity,
      lowStock: p.stockQuantity <= 5,
    }));
  },

  adjustInventory(productId: string, changeAmount: number, reason: string, adminEmail = 'admin@utsavghar.com'): boolean {
    const data = ensureDb();
    const product = data.products.find(p => p.id === productId);
    if (!product) return false;

    product.stockQuantity = Math.max(0, product.stockQuantity + changeAmount);
    product.updatedAt = new Date().toISOString();

    data.inventoryMovements.unshift({
      id: `mov-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      sku: product.sku,
      changeAmount,
      newStock: product.stockQuantity,
      reason,
      adminEmail,
      createdAt: new Date().toISOString(),
    });

    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminEmail,
      action: 'INVENTORY_ADJUSTED',
      entityType: 'PRODUCT',
      entityId: productId,
      details: { sku: product.sku, changeAmount, newStock: product.stockQuantity, reason },
      createdAt: new Date().toISOString(),
    });

    writeDb(data);
    return true;
  },

  getInventoryMovements(): InventoryMovement[] {
    const data = ensureDb();
    return data.inventoryMovements.slice(0, 50);
  },

  // STORE SETTINGS & CAMPAIGNS
  getSettings(): StoreSettings {
    const data = ensureDb();
    return data.storeSettings;
  },

  updateSettings(newSettings: Partial<StoreSettings>, adminEmail = 'admin@utsavghar.com'): StoreSettings {
    const data = ensureDb();
    data.storeSettings = { ...data.storeSettings, ...newSettings };

    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminEmail,
      action: 'SETTINGS_UPDATED',
      entityType: 'STORE_SETTINGS',
      entityId: 'global',
      details: newSettings,
      createdAt: new Date().toISOString(),
    });

    writeDb(data);
    return data.storeSettings;
  },

  getCampaigns(): Campaign[] {
    const data = ensureDb();
    return data.campaigns;
  },

  updateCampaign(campaign: Partial<Campaign> & { id: string }): Campaign | null {
    const data = ensureDb();
    const idx = data.campaigns.findIndex(c => c.id === campaign.id);
    if (idx < 0) return null;
    data.campaigns[idx] = { ...data.campaigns[idx], ...campaign };
    writeDb(data);
    return data.campaigns[idx];
  },

  // NEWSLETTER & AUDIT LOGS
  subscribeNewsletter(email: string): boolean {
    const data = ensureDb();
    const cleanEmail = email.toLowerCase().trim();
    if (!data.newsletterSubscribers.some(s => s.email === cleanEmail)) {
      data.newsletterSubscribers.push({ email: cleanEmail, date: new Date().toISOString() });
      writeDb(data);
    }
    return true;
  },

  getAuditLogs(): AuditLog[] {
    const data = ensureDb();
    return data.auditLogs.slice(0, 100);
  },

  // METRICS (Admin Dashboard)
  getMetrics() {
    const data = ensureDb();
    const paidOrders = data.orders.filter(o => o.paymentStatus === 'paid' && o.fulfillmentStatus !== 'cancelled');
    const totalSales = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = paidOrders.length;
    const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const productsSold = paidOrders.reduce((sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0), 0);
    const pendingOrders = data.orders.filter(o => o.fulfillmentStatus === 'pending_payment' || o.fulfillmentStatus === 'confirmed').length;
    const lowStockProducts = data.products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5);
    const outOfStockProducts = data.products.filter(p => p.stockQuantity === 0);

    // Bestsellers derived from order items
    const itemSales: Record<string, { title: string; count: number; revenue: number; image?: string }> = {};
    for (const order of paidOrders) {
      for (const item of order.items) {
        if (!itemSales[item.productId]) {
          itemSales[item.productId] = { title: item.title, count: 0, revenue: 0, image: item.imageUrl };
        }
        itemSales[item.productId].count += item.quantity;
        itemSales[item.productId].revenue += item.total;
      }
    }

    const bestsellingProducts = Object.entries(itemSales)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSales,
      totalOrders,
      averageOrderValue: aov,
      productsSold,
      pendingOrders,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      bestsellingProducts,
      recentOrders: data.orders.slice(0, 8),
    };
  },
};
