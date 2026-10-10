# 🪔 Utsav Ghar — Premium Indian Diwali E-Commerce Platform

> **"Bring Home the Light of Diwali"**  
> An authentic, production-grade festive e-commerce platform built for traditional Indian handicrafts, solid Moradabad brass idols, wheel-thrown earthen diyas, decorative illuminations, and curated royal gift hampers.

---

## 🌟 Overview & Key Capabilities

Utsav Ghar has been engineered as an established Indian retail brand created by a professional design agency. It provides a complete, robust shopping journey:

### 🛍️ Customer Storefront
- **Refined Brand Aesthetics**: Rooted in Indian festive culture featuring Deep Maroon (`#641C24`), Festive Vermilion (`#C64B32`), Antique Gold (`#C6A15B`), and Warm Ivory (`#FFF9F0`) with refined Playfair serif typography.
- **Announcement Bar**: Configurable sales notice with free shipping threshold progress tracker.
- **Category Navigation**: 8 curated image-led departments (Ganesh & Lakshmi Idols, Diyas & Candles, Decorative Lights, Puja Essentials, Rangoli & Torans, Home Decor, Gift Hampers, Festive Table Decor).
- **Interactive Product Catalog**: Faceted filtering by Category, Price Range, Craft Materials (Brass, Terracotta, Marble, Copper, Soy Wax), In-Stock status, and multi-mode Sorting (Price Low-to-High, High-to-Low, Top Rated, Newest).
- **Product Detail Pages (PDP)**: High-resolution image galleries with thumbnail switcher, genuine discount tags, live PIN code serviceability checker, artisan care notes, authentic customer reviews, and variant selectors.
- **Shopping Cart & Slide-Over Drawer**: Live item counts, quantity modifiers (+ / -), transparent MRP vs sale price savings, coupon validation (`DIWALI10`, `FESTIVE15`, `WELCOME100`), free delivery threshold calculation (₹999), and tax breakdown.
- **5-Step Checkout**: Customer details, Indian shipping address with 6-digit PIN validation, delivery method selection, Razorpay payment processing with server-side HMAC-SHA256 signature verification.
- **Order Tracking**: Real-time visual milestone progress tracker (`UG-2026-XXXXXX`) tracing courier partner and Air Waybill (AWB) number.

### 👑 Operations & Admin Dashboard (`/admin`)
- **Executive Operations Metrics**: Real-time Gross Sales, Orders Received, Average Order Value (AOV), Products Sold, Pending Dispatches, and Low Stock inventory alerts.
- **Product CRUD**: Create, edit, and deactivate products with variant matrices, SKU validation, dimensions, and image galleries.
- **Category Manager**: Organize hierarchy, hero visibility, and SEO slugs.
- **Warehouse Inventory & Auditing**: Live stock counts, low-stock threshold monitoring (≤ 5 units), and audited stock adjustment logs with administrator notes.
- **Fulfillment & Dispatch Workflow**: Validated order state machine (`Pending Payment` → `Confirmed` → `Processing` → `Packed` → `Shipped` → `Delivered`), logistics courier assignment (BlueDart, Delhivery, DTDC, India Post), and AWB generation.
- **Promotion & Coupon Manager**: Percentage and fixed discount rules with minimum order spend and usage caps.
- **Campaign CMS**: Dynamic top announcement bar and festival headlines.
- **Review Moderation**: Approve or reject customer reviews with verified purchase tags.
- **Store Configuration**: Free shipping threshold, support helpline, email, and return windows.
- **Administrative Audit Logs**: Immutable record of privileged staff actions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Icons**: Lucide Icons
- **Database**: PostgreSQL / Supabase with comprehensive relational schema & zero-config local relational engine (`data/utsav_store.json`)
- **Payments**: Razorpay Integration (UPI, QR, RuPay, Cards, NetBanking) with HMAC SHA-256 signature verification
- **Testing**: Node.js Automated Test Suite (`tests/ecommerce.test.mjs`)
- **Validation**: Schema-level server-side validation

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18.x, v20.x, or v22+)
- npm or pnpm

### 2. Installation
```bash
git clone <repository-url>
cd "Shoping Website "
npm install
```

### 3. Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env.local
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Architecture & Setup

### Zero-Configuration Local Mode
Out of the box, Utsav Ghar initializes with **24 pre-seeded authentic Diwali products** across all 8 categories stored persistently in `data/utsav_store.json`. All CRUD operations, inventory updates, orders, and reviews persist safely to disk across restarts without requiring an external PostgreSQL instance!

### Production Supabase / PostgreSQL Setup
A production SQL schema is provided at [`supabase/schema.sql`](supabase/schema.sql).

To deploy to Supabase:
1. Create a new project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Add your Supabase project credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

---

## 💳 Payment Gateway (Razorpay)

### Sandbox / Testing Mode
By default, the platform runs in **Verified Sandbox Mode**. You can place complete end-to-end orders, verify checkout calculations, generate order numbers, and trigger inventory deductions without incurring actual charges.

### Live Production Razorpay Mode
To connect live Razorpay payments:
1. Create a Razorpay merchant account at [Razorpay.com](https://razorpay.com).
2. Generate API Keys from **Settings → API Keys**.
3. Set the keys in `.env.local`:
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_actual_key
   RAZORPAY_KEY_SECRET=your_actual_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```
4. Webhooks can be directed to `https://your-domain.com/api/payments/webhook`.

---

## 🧪 Automated Testing

Utsav Ghar includes unit and integration tests verifying pricing calculations, coupon limits, free delivery thresholds, HMAC payment signature verification, inventory locks, and customer data isolation:

```bash
npm test
```

Expected output:
```
✔ Pricing: Correctly calculates percentage discounts and savings
✔ Coupons: Validates DIWALI10 eligibility and max cap limits
✔ Cart: Free shipping triggers strictly at or above threshold
✔ Security: Validates HMAC-SHA256 signature authenticity
✔ Inventory: Stock deduction prevents overselling below zero
✔ Workflow: Order status follows valid sequential transitions
✔ RBAC: Customers cannot view other customer private orders
ℹ tests 7 | pass 7 | fail 0
```

---

## 🔐 Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@utsavghar.com` | `festive_utsav_pass` | Complete access to `/admin` & Operations |
| **Customer** | `ananya@example.com` | `festive_utsav_pass` | Storefront, Wishlist, Order History |

---

## 🌐 Production Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set Framework Preset to **Next.js**.
4. Configure environment variables from `.env.example`.
5. Deploy! Vercel automatically configures SSL, edge caching, and global CDN delivery.
