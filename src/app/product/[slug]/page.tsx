"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, Heart, Loader2, Minus, Plus, Ruler, ShoppingBag, Star } from "lucide-react";
import { REVIEWS } from "@/data/reviews";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { PincodeChecker } from "@/components/product/PincodeChecker";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/useHydrated";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(170);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const hydrated = useHydrated();
  const product = products.find((item) => item.slug === slug);
  const isFavorite = hydrated && product ? isInWishlist(product.id) : false;

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

  if (isLoading) return <div className="editorial-page flex min-h-screen items-center justify-center gap-2 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin text-accent" /> Loading product details...</div>;
  if (!product) return notFound();

  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const relatedProducts = products.filter((item) => item.id !== product.id && (item.category === product.category || item.isWTApproved)).slice(0, 4);

  const addToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedSize} cm) to cart.`);
  };

  const buyNow = () => {
    addItem(product, selectedSize, quantity);
    router.push("/checkout");
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Viper Gears" },
    offers: { "@type": "Offer", url: `https://vipergears.in/product/${product.slug}`, priceCurrency: "INR", price: product.price, itemCondition: "https://schema.org/NewCondition", availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="editorial-page min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3 w-3" /><Link href="/shop" className="hover:text-ink">Shop</Link><ChevronRight className="h-3 w-3" /><span className="max-w-xs truncate font-semibold text-ink">{product.name}</span></nav>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <div className="relative aspect-[0.88] overflow-hidden rounded-2xl bg-[#d8d6d4]">
                <Image src={product.images[activeImageIndex] || product.images[0]} alt={product.name} fill priority className="object-cover object-top" />
                {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase">-{discount}%</span>}
                <button onClick={() => { toggleWishlist(product); toast[isFavorite ? "info" : "success"](isFavorite ? "Removed from wishlist." : "Added to wishlist."); }} aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"} className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm ${isFavorite ? "bg-accent text-white" : "bg-white/90 text-ink"}`}><Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} /></button>
              </div>
              {product.images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1">{product.images.map((image, index) => <button key={image} onClick={() => setActiveImageIndex(index)} className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-2 ${activeImageIndex === index ? "border-ink" : "border-transparent opacity-65 hover:opacity-100"}`}><Image src={image} alt={`${product.name} view ${index + 1}`} fill className="object-cover object-top" /></button>)}</div>}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="section-kicker mb-4">{product.category}</p>
              <h1 className="max-w-xl text-4xl font-medium leading-[0.98] tracking-tight text-ink sm:text-5xl">{product.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-xs"><span className="flex items-center gap-1 font-semibold text-accent"><Star className="h-3.5 w-3.5 fill-current" /> {product.rating}</span><span className="text-muted">{product.reviewCount} reviews</span>{product.isWTApproved && <><span className="text-border-strong">/</span><span className="font-semibold text-ink">WT-approved</span></>}</div>
              <div className="mt-6 flex items-baseline gap-3"><span className="text-2xl font-semibold text-ink">{formatINR(product.price)}</span>{discount > 0 && <><span className="text-sm text-muted line-through">{formatINR(product.originalPrice)}</span><span className="text-xs font-semibold text-accent">Save {discount}%</span></>}</div>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{product.description}</p>

              <div className="mt-8 space-y-3 border-t border-border pt-6"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-ink">Select height</span><button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"><Ruler className="h-3.5 w-3.5" /> Size guide</button></div><div className="flex flex-wrap gap-2">{product.availableSizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${selectedSize === size ? "border-ink bg-ink text-white" : "border-border bg-surface text-muted hover:border-ink hover:text-ink"}`}>{size} cm</button>)}</div></div>

              <div className="mt-6 flex items-center justify-between gap-4"><span className="text-sm font-semibold text-ink">Quantity</span><div className="flex items-center rounded-full border border-border bg-surface"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-2.5 text-muted hover:text-ink" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-semibold text-ink">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="p-2.5 text-muted hover:text-ink" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div></div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2"><Button onClick={addToCart} disabled={!product.inStock} className="h-12 rounded-full bg-ink text-sm text-white hover:bg-accent disabled:opacity-50"><ShoppingBag className="h-4 w-4" /> Add to bag</Button><Button onClick={buyNow} disabled={!product.inStock} variant="outline" className="h-12 rounded-full border-border-strong text-sm hover:border-ink">Buy now <ArrowRight className="h-4 w-4 text-accent" /></Button></div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-y border-border py-5 text-xs text-muted"><div><p className="font-semibold text-ink">Free size support</p><p className="mt-1">Use the guide before ordering.</p></div><div><p className="font-semibold text-ink">Need help?</p><p className="mt-1">Message the Viper team.</p></div></div>
              <div className="mt-5"><PincodeChecker /></div>

              <Accordion type="single" collapsible className="mt-6 border-t border-border">
                <AccordionItem value="details" className="border-b-border"><AccordionTrigger className="py-4 text-sm font-semibold text-ink hover:no-underline">Fabric & construction</AccordionTrigger><AccordionContent className="pb-5 text-sm leading-relaxed text-muted"><p><strong className="font-semibold text-ink">Fabric:</strong> {product.fabricSpecs}</p><p className="mt-2"><strong className="font-semibold text-ink">Weight:</strong> {product.weightGsm} GSM</p><ul className="mt-3 list-disc space-y-1 pl-5">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></AccordionContent></AccordionItem>
                <AccordionItem value="shipping" className="border-b-border"><AccordionTrigger className="py-4 text-sm font-semibold text-ink hover:no-underline">Shipping & returns</AccordionTrigger><AccordionContent className="pb-5 text-sm leading-relaxed text-muted">Orders are packed and shipped across India. Read the <Link href="/shipping-policy" className="font-semibold text-accent hover:underline">shipping policy</Link> and <Link href="/return-policy" className="font-semibold text-accent hover:underline">return policy</Link> for details.</AccordionContent></AccordionItem>
              </Accordion>
            </div>
          </div>

          <section className="border-t border-border pt-12"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="section-kicker mb-3">From athletes & coaches</p><h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">What they say.</h2></div></div><div className="grid gap-4 md:grid-cols-3">{REVIEWS.slice(0, 3).map((review) => <article key={review.id} className="rounded-2xl border border-border bg-surface p-5"><div className="flex gap-0.5 text-accent">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}</div><p className="mt-4 text-sm leading-relaxed text-ink">“{review.comment}”</p><p className="mt-5 border-t border-border pt-4 text-xs font-semibold text-ink">{review.author}<span className="mt-1 block font-normal text-muted">{review.role}</span></p></article>)}</div></section>

          {relatedProducts.length > 0 && <section className="border-t border-border pt-12"><div className="mb-7"><p className="section-kicker mb-3">Keep exploring</p><h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">You may also like.</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
        </div>
      </div>
      <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </>
  );
}
