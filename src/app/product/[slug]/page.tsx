"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { REVIEWS } from "@/data/reviews";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { PincodeChecker } from "@/components/product/PincodeChecker";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  ShieldCheck,
  Ruler,
  ShoppingBag,
  Zap,
  Heart,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const product = products.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number>(170);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!product) return;
    setActiveImageIndex(0);
    setSelectedSize(product.availableSizes.includes(170) ? 170 : product.availableSizes[0]);
  }, [product, slug]);

  if (isLoading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center text-slate-500 text-sm">
        <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#FF3B30]" /> Loading uniform details...
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedSize}cm) to Cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, quantity);
    router.push("/checkout");
  };

  const relatedProducts = products
    .filter(
      (p) => p.id !== product.id && (p.category === product.category || p.isWTApproved)
    )
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Viper Gears",
    },
    offers: {
      "@type": "Offer",
      url: `https://vipergears.in/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#F8FAFC] py-10 min-h-screen text-slate-900">
        <div className="container mx-auto px-4 space-y-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-slate-900 transition-colors">Shop Catalog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#FF3B30] font-bold truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                <Image
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {!product.inStock && (
                    <Badge variant="destructive" className="text-xs bg-red-600 border-red-500 text-white">
                      OUT OF STOCK
                    </Badge>
                  )}
                  {product.isWTApproved && (
                    <Badge variant="wtApproved" className="text-xs py-1 px-3 bg-white/90 text-[#FF6B61] border-red-300 font-extrabold shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[#FF3B30] mr-1" /> WT Approved
                    </Badge>
                  )}
                  {discountPercentage > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-full z-10 transition-all ${
                    isFavorite
                      ? "bg-[#E53935] text-white shadow-md"
                      : "bg-white/80 text-slate-600 hover:text-slate-900 shadow-sm"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 bg-white rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? "border-[#FF3B30] ring-2 ring-red-500/20 shadow-md"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Purchasing Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-extrabold text-[#FF3B30] uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
                  {product.category}
                </span>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight bebas-font mt-3">
                  {product.name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400">({product.reviewCount} Verified Reviews)</span>
                  <span className="text-slate-300">|</span>
                  {product.inStock ? (
                    <span className="text-[#FF3B30] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Currently Out of Stock
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-black text-[#FF3B30]">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium">(Incl. all taxes & GST)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Sizing Controls */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider">
                    Select Height Size (cm): <span className="text-[#FF3B30]">{selectedSize} cm</span>
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[#FF3B30] hover:underline font-extrabold flex items-center gap-1"
                  >
                    <Ruler className="w-4 h-4" /> Height Size Chart
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${
                        selectedSize === size
                          ? "bg-[#FF3B30] text-white border-[#FF3B30] shadow-md shadow-red-500/20 scale-105"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {size} cm
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker & Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-slate-200 bg-white rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-slate-500 hover:text-slate-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-slate-500 hover:text-slate-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="text-xs font-extrabold gap-2 h-12 border-slate-300 text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FF3B30]" /> {product.inStock ? "Add To Cart" : "Out of Stock"}
                  </Button>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 fill-white" /> Buy Now (Direct Checkout)
                  </Button>
                </div>
              </div>

              {/* Pan-India Delivery Pincode Checker */}
              <PincodeChecker />

              {/* Information Accordion */}
              <Accordion type="single" collapsible defaultValue="specs" className="w-full pt-2">
                <AccordionItem value="specs">
                  <AccordionTrigger>Fabric Specs & Features</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-xs text-slate-700">
                      <p><strong className="text-slate-900">Fabric Material:</strong> {product.fabricSpecs}</p>
                      <p><strong className="text-slate-900">Fabric Weight:</strong> {product.weightGsm} GSM Lightweight Competition Fabric</p>
                      <ul className="list-disc list-inside space-y-1.5 text-slate-600 pt-1">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>Pan-India Shipping Info</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Orders dispatched within 24 hours from our Chattarpur, Delhi warehouse. Free express shipping on all orders over ₹999. Delhi NCR orders arrive within 1-2 days via Shiprocket Local; Rest of India arrives within 3-5 days via Delhivery Air.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="returns">
                  <AccordionTrigger>7-Day Easy Exchange Policy</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Need a different height size? We offer hassle-free 7-day exchanges on all unused Doboks with original tags intact. Contact our Chattarpur WhatsApp team (+91-9871674886) for instant pick-up setup.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight bebas-font">
              CUSTOMER REVIEWS ({product.reviewCount})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 italic">&quot;{rev.comment}&quot;</p>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {rev.author}
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products Grid */}
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight bebas-font">
              YOU MAY ALSO LIKE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </>
  );
}
