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
   - Highlights bar: WT Approved Fabric, Free Pan-India Shipping above ₹999, 7-Day Returns, 500+ Dojangs.
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

5. **Action Gallery (`/gallery`)**:
   - Filterable masonry photo showcase (Tournaments, Dojangs, Behind The Scenes) with lightbox preview.

6. **Contact Us (`/contact`)**:
   - Form validated with React Hook Form + Zod.
   - Chattarpur Delhi location info, clickable phone link (+91-9871674886), Google Maps iframe embed.

7. **Cart & 3-Step Checkout (`/cart`, `/checkout`)**:
   - Slide-over Cart Drawer + Full Cart Page with promo codes (`VIPER10`).
   - 3-step checkout leading to simulated Razorpay Gateway modal.

8. **User Account (`/account`)**:
   - Phone/OTP auth modal.
   - Order history with tracking status, saved addresses, wishlist grid, and profile details.

9. **Legal Policies (`/privacy-policy`, `/terms`, `/shipping-policy`, `/return-policy`)**:
   - Full compliance content tailored for Indian D2C Taekwondo e-commerce.

10. **Admin Inventory (`/admin/inventory`)**:
   - Admin-only inventory management for each dress and height size.
   - SQLite-backed quantities, reorder thresholds, low-stock indicators, and CRUD actions.

---

## 🛠️ Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

The inventory database is created automatically at `.data/viper-gears.sqlite` on first use. The `.data` directory is ignored by Git so local inventory records stay out of commits. For a multi-instance production deployment, move this SQLite database to a managed shared database or persistent volume.

---

## 🏗️ Production Build & Verification

```bash
npm run build
```

Deployed and ready for Vercel deployment!
