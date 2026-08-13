# 🐍 Viper Gears - Official Taekwondo E-Commerce Web Application

**Tagline**: *Strike With Precision. Wear The Viper.*  
**Headquarters**: Chattarpur, Delhi, India  
**Contact**: +91-9871674886 | [WhatsApp](https://wa.me/919871674886) | contact@vipergears.in  

Viper Gears is a fast, mobile-first, modern D2C e-commerce platform built for Taekwondo uniforms (Dobok), belts, and sparring armor in India.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Runtime**: Node.js 22.5+ (uses the built-in SQLite database for inventory)
- **Styling**: Tailwind CSS v4
- **UI Components**: `shadcn/ui` (built on Radix UI primitives)
- **E-Commerce Elements**: `@storefront-ui/react` (ProductCard, Rating, Price, Filters)
- **Animation**: `framer-motion` (Hero fade-ins, card hover effects, drawer transitions)
- **State Management**: `zustand` (Cart & Wishlist with `localStorage` persistence)
- **Carousel & Gallery**: `embla-carousel-react` (Product image gallery & Testimonials slider)
- **Forms & Validation**: `react-hook-form` + `zod`
- **Icons**: `lucide-react`
- **Toast Notifications**: `sonner`
- **Payments Integration**: Razorpay Gateway (UPI, Cards, Net Banking test mode)
- **SEO & Structured Data**: `next-seo`, Schema.org Product & AggregateRating JSON-LD

---

## 🛒 Key Features & Pages

1. **Home Page (`/`)**:
   - Hero section with action Dobok imagery & Framer Motion text animations.
   - Highlights bar: WT Approved Fabric, Free Pan-India Shipping above ₹5,000, 7-Day Returns, 500+ Dojangs.
   - Featured products grid with `@storefront-ui/react` elements & quick add to cart.
   - Why Viper Gears pillars (Ultra-light 220 GSM, Reinforced 10-stitch cuffs, 3D Mesh air cooling).
   - Testimonial carousel, Gallery preview, Newsletter capture, and floating WhatsApp CTA button.

2. **About Us (`/about`)**:
   - Origin story from Chattarpur, Delhi.
   - Mission for Indian martial arts academies.
   - Comparison matrix: Viper Dobok vs Normal Dobok.

3. **Shop Catalog (`/shop`)**:
   - Sidebar filters: Category, Athlete Height (110cm to 200cm), Price slider, WT Approved toggle.
   - Sorting: Price Low/High, Rating, Featured.
   - Responsive grid with Quick View modal.

4. **Product Detail (`/product/[slug]`)**:
   - Embla image gallery with thumbnails.
   - Visual height size selector (140cm to 200cm) with Size Chart modal.
   - Pincode Delivery checker widget.
   - Info accordions (Fabric Specs, Shipping Info, Returns).
   - Schema.org Product JSON-LD generation.

5. **Contact Us (`/contact`)**:
   - Form validated with React Hook Form + Zod.
   - Chattarpur Delhi location info, clickable phone link (+91-9871674886), Google Maps iframe embed.

6. **Cart & 3-Step Checkout (`/cart`, `/checkout`)**:
   - Slide-over Cart Drawer + Full Cart Page with promo codes (`VIPER10`).
   - 3-step checkout leading to simulated Razorpay Gateway modal.

7. **User Account (`/account`)**:
   - Phone/OTP auth modal.
   - Order history with tracking status, saved addresses, wishlist grid, and profile details.

8. **Legal Policies (`/privacy-policy`, `/terms`, `/shipping-policy`, `/return-policy`)**:
   - Full compliance content tailored for Indian D2C Taekwondo e-commerce.

9. **Admin Inventory (`/admin/inventory`)**:
   - Admin-only inventory management for each dress and height size.
   - SQLite-backed quantities, reorder thresholds, low-stock indicators, and CRUD actions.

---

## 🛠️ Local Development Setup

1. **Create a Postgres database** (free tier: [Neon](https://neon.tech) or Vercel Storage) and add its connection string to `.env.local` as `POSTGRES_URL`.

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Tables (`otp_codes`, `sessions`, `orders`, `settings`, `products`, `inventory`) are created automatically on first use, and the product/inventory seed data is loaded once (`ON CONFLICT DO NOTHING`).

### Migrating from the legacy SQLite database

If you previously ran the app on SQLite (`.data/viper-gears.sqlite`), admin-created products and edited stock quantities only live there. Copy them into Postgres once:

```bash
POSTGRES_URL=<your pooled connection string> node scripts/migrate-sqlite-to-postgres.mjs
```

The script is idempotent — safe to re-run.

---

## 🏗️ Production Build & Verification

```bash
npm run build
```

Deployed and ready for Vercel deployment!

---

## 📦 Shipping Flow (Razorpay → Shiprocket)

1. **Checkout**: customer pays via Razorpay checkout modal.
2. **Finalize (exactly once)**: both the client-side `verify-razorpay-payment` route and the Razorpay webhook (`/api/webhooks/razorpay`) call `finalizePaidOrder()`, which atomically:
   - marks the order `PAID` (single `UPDATE ... WHERE payment_status = 'PENDING'` — only one caller wins),
   - decrements inventory for each line item,
   - creates the shipment in Shiprocket (`/orders/create/adhoc`), guarded by the `shiprocket_pushed` flag so duplicate shipments are impossible. The admin then selects the delivery partner in Shiprocket and assigns the AWB there.
3. **Retries**: if the Shiprocket push fails, the webhook returns `500` so Razorpay retries it; the claim is released so the retry re-pushes. Admins can also trigger a manual re-push from the admin dashboard ("Sync Shiprocket").
4. **Tracking**: customers see a "Track" button on their orders in `/account`; admins see one on each order. Both call `/api/shipping/track/{awb}`, which fetches live Shiprocket scan data.

**Vercel notes**:
- All data lives in Postgres (`POSTGRES_URL`), so orders persist across cold starts.
- Shiprocket auth token is cached in the `settings` table to avoid logging in on every lambda cold start.
- Webhook and verification routes run with `maxDuration = 60` so Shiprocket calls complete on the Hobby plan.
