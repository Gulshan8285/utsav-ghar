-- ==============================================================================
-- UTSAV GHAR - PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Brand: Utsav Ghar (Bring Home the Light of Diwali)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'store_manager',
  'catalog_manager',
  'order_manager',
  'customer_support',
  'analyst',
  'customer'
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role_enum DEFAULT 'customer' NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  house_no VARCHAR(255) NOT NULL,
  street_locality VARCHAR(255) NOT NULL,
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'India' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  show_on_home BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PRODUCTS
CREATE TYPE product_status_enum AS ENUM ('draft', 'active', 'archived');

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  regular_price INT NOT NULL, -- Stored in INR (Rupees or minor paise)
  sale_price INT,            -- Genuine discounted price if active
  description TEXT NOT NULL,
  materials VARCHAR(255),
  dimensions VARCHAR(255),
  weight_grams INT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_deal BOOLEAN DEFAULT FALSE,
  status product_status_enum DEFAULT 'active' NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE
);

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price_override INT,
  stock_quantity INT DEFAULT 0 NOT NULL,
  variant_attributes JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE
);

-- 7. INVENTORY & MOVEMENTS
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  available_quantity INT DEFAULT 0 NOT NULL,
  reserved_quantity INT DEFAULT 0 NOT NULL,
  low_stock_threshold INT DEFAULT 5 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  change_amount INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  order_reference VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'reserved' NOT NULL, -- reserved, confirmed, released
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. CARTS & ITEMS
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  coupon_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 10. ORDERS & ITEMS
CREATE TYPE order_status_enum AS ENUM (
  'pending_payment',
  'payment_failed',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded'
);

CREATE TYPE payment_status_enum AS ENUM (
  'unpaid',
  'authorized',
  'paid',
  'failed',
  'refunded'
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal INT NOT NULL,
  discount_amount INT DEFAULT 0 NOT NULL,
  shipping_fee INT DEFAULT 0 NOT NULL,
  tax_amount INT DEFAULT 0 NOT NULL,
  total_amount INT NOT NULL,
  coupon_code VARCHAR(50),
  payment_status payment_status_enum DEFAULT 'unpaid' NOT NULL,
  fulfillment_status order_status_enum DEFAULT 'pending_payment' NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'razorpay' NOT NULL,
  tracking_provider VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL,
  total INT NOT NULL
);

-- 11. PAYMENTS & EVENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) DEFAULT 'razorpay' NOT NULL,
  provider_order_id VARCHAR(100) NOT NULL,
  provider_payment_id VARCHAR(100),
  amount INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
  status payment_status_enum DEFAULT 'unpaid' NOT NULL,
  signature VARCHAR(255),
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. SHIPMENTS
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  tracking_number VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_transit' NOT NULL,
  estimated_delivery TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. COUPONS & PROMOTIONS
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed');

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type discount_type_enum DEFAULT 'percentage' NOT NULL,
  discount_value INT NOT NULL,
  min_order_amount INT DEFAULT 0,
  max_discount_amount INT,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  usage_limit INT,
  per_user_limit INT DEFAULT 1,
  times_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  discount_applied INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. CAMPAIGNS & CONTENT
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  announcement_bar TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. REVIEWS (Authentic reviews with verified purchase tag)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'approved' NOT NULL, -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. RETURNS & REFUNDS
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'requested' NOT NULL,
  refund_amount INT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. NEWSLETTER & TICKETS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'subscribed' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 18. STORE SETTINGS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS store_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES FOR FAST E-COMMERCE QUERIES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products and categories are publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products viewable" ON products FOR SELECT USING (status = 'active');

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public categories viewable" ON categories FOR SELECT USING (true);

-- Customers can view only their own orders
CREATE POLICY "Customers view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Customers can manage own addresses
CREATE POLICY "Customers manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
