import { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "test-gateway-sample-1-rupee",
    name: "⚡ Test Gateway Sample Item (₹1 Payment Test)",
    slug: "test-gateway-sample-item-1-rupee",
    category: "Test Product",
    price: 1,
    originalPrice: 99,
    rating: 5.0,
    reviewCount: 99,
    isWTApproved: true,
    isBestSeller: true,
    isNewArrival: true,
    isStorefrontVisible: false,
    inStock: true,
    images: [
      "/images/kpnp-dobok-1.jpg",
      "/images/kpnp-dobok-2.jpg",
    ],
    description: "Sample product priced at ₹1 specifically for testing Razorpay live/test payment gateway transactions and Shiprocket delivery orders.",
    fabricSpecs: "Test Sample Specification",
    weightGsm: 100,
    availableSizes: [140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "Priced at exactly ₹1 for live payment testing.",
      "Supports instant Razorpay checkout via UPI, Cards, and Netbanking.",
      "Creates a Shiprocket shipment after payment; the admin selects the delivery partner in Shiprocket."
    ]
  },
  {
    id: "kpnp-comp-india-black-belt",
    name: "Viper Gears Competition Taekwondo Dobok – India Edition (Black V-Neck)",
    slug: "kpnp-competition-taekwondo-dobok-india-edition",
    category: "Black Belt Dobok",
    price: 2999,
    originalPrice: 3999,
    rating: 5.0,
    reviewCount: 164,
    isWTApproved: true,
    isBestSeller: true,
    isNewArrival: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-1.jpg",
      "/images/kpnp-dobok-2.jpg",
      "/images/kpnp-dobok-chest.jpg",
    ],
    description: "Elevate your martial arts performance with the Viper Gears Official Taekwondo Uniform (Dobok). Designed for maximum agility, comfort, and durability, this elite competition uniform features a classic black V-neck collar for Dan-grade practitioners and bold national detailing to proudly represent India on the mat.",
    fabricSpecs: "Lightweight Moisture-Wicking Breathable Poly-Blend",
    weightGsm: 210,
    availableSizes: [140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "Elite Performance Fabric: Crafted from lightweight, breathable, and moisture-wicking material engineered to keep you cool and dry during intense sparring and training.",
      "Ergonomic Fit: Designed to provide full freedom of movement, allowing seamless high kicks, explosive footwork, and fluid transitions.",
      "National Pride Print: Features an official Indian Flag patch on the right sleeve and bold 'IND' lettering printed across the back tail for high visibility during national and international events.",
      "Official Branding: Outfitted with official Viper Gears logos on the left sleeve and right leg, along with the World Taekwondo (WT) emblem on the chest.",
      "Black V-Neck Collar: Classic black-lapel finish tailored specifically for Black Belt (Dan) holders."
    ]
  },
  {
    id: "kpnp-comp-india-white-collar",
    name: "Viper Gears Competition Taekwondo Dobok – India Edition (Color Belt)",
    slug: "kpnp-competition-taekwondo-dobok-color-belt",
    category: "Advanced Competition Dobok",
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewCount: 112,
    isWTApproved: true,
    isBestSeller: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-2.jpg",
      "/images/kpnp-dobok-chest.jpg",
      "/images/kpnp-dobok-1.jpg"
    ],
    description: "Official Viper Gears Taekwondo Uniform designed for color belt practitioners competing in state and national tournaments. Features official Indian flag sleeve print and ergonomic 180-degree kicking freedom.",
    fabricSpecs: "Lightweight Moisture-Wicking Poly-Cotton Blend",
    weightGsm: 210,
    availableSizes: [140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "Elite Performance Fabric: Lightweight moisture-wicking material for daily training and tournament sparring.",
      "Ergonomic Fit: Full freedom of movement for explosive roundhouse kicks and footwork.",
      "National Pride Print: Official Indian Flag patch on right sleeve & bold 'IND' back tail print.",
      "Official WT Emblem: Outfitted with official Viper Gears logos and World Taekwondo emblem on chest.",
      "White/Color Lapel V-Neck: Clean professional lapel for color belt competitors."
    ]
  },
  {
    id: "kpnp-comp-india-junior",
    name: "Viper Gears Junior Competition Taekwondo Dobok – India Edition (Kids)",
    slug: "kpnp-junior-competition-taekwondo-dobok-kids",
    category: "Kids Dobok",
    price: 1999,
    originalPrice: 2699,
    rating: 4.8,
    reviewCount: 88,
    isWTApproved: true,
    isNewArrival: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-1.jpg",
      "/images/kpnp-dobok-chest.jpg"
    ],
    description: "Designed specifically for cadet and junior Taekwondo athletes in India. Soft skin-friendly inner lining, pre-shrunk fabric, and official Indian flag print.",
    fabricSpecs: "Soft Breathable Moisture-Wicking Blend",
    weightGsm: 200,
    availableSizes: [110, 120, 130, 140, 150, 160, 170, 180],
    features: [
      "Junior Ergonomic Design: Lightweight and flexible for growing young martial artists.",
      "Official Indian Flag Sleeve Patch & Viper Gears Branding.",
      "Reinforced knee & pants stitching for high durability.",
      "Machine washable with zero color bleeding."
    ]
  },
  {
    id: "kpnp-poomsae-india",
    name: "Viper Gears Master Poomsae Uniform – India Edition",
    slug: "kpnp-master-poomsae-uniform-india-edition",
    category: "Black Belt Dobok",
    price: 3499,
    originalPrice: 4499,
    rating: 5.0,
    reviewCount: 45,
    isWTApproved: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-chest.jpg",
      "/images/kpnp-dobok-1.jpg"
    ],
    description: "Official Viper Gears Dan-grade Poomsae Dobok with heavy snap resonance fabric. Engineered for master practitioners competing in recognized Poomsae championships.",
    fabricSpecs: "Heavy Snap Resonance Poly-Cotton Weave",
    weightGsm: 260,
    availableSizes: [160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "World Taekwondo (WT) Certified Poomsae Uniform.",
      "Rigid snap lapel for crisp acoustic sound during form execution.",
      "Official Indian Flag sleeve patch and gold embroidered accents.",
      "Full gusseted trousers for stable stances."
    ]
  },
  {
    id: "viper-black-belt-master-dan",
    name: "Viper Gears Official Black Belt (Dan Grade Gold Embroidery)",
    slug: "viper-gears-official-black-belt-dan-grade",
    category: "Belts & Accessories",
    price: 599,
    originalPrice: 899,
    rating: 4.9,
    reviewCount: 78,
    isWTApproved: true,
    isBestSeller: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-1.jpg",
      "/images/kpnp-dobok-chest.jpg"
    ],
    description: "Official Dan grade Taekwondo Black Belt crafted with 100% thick cotton core, 8-row reinforced stitching, and gold embroidered Korean & English lettering. Delivery weight: under 500 grams.",
    fabricSpecs: "100% Thick Cotton Weave - 8 Row Stitching",
    weightGsm: 500,
    availableSizes: [160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "Under 500g high-quality heavy-duty cotton construction.",
      "Delivery parcel: 40 × 12 × 5 cm; ₹200 delivery below ₹1,000 and ₹350 below ₹5,000.",
      "Reinforced 8-line stitching prevents fold sagging.",
      "Official WT & Dan Grade Gold Embroidery."
    ]
  },
  {
    id: "viper-sparring-arm-shin-guards",
    name: "Viper Gears WT Competition Sparring Guards Set (Forearm & Shin)",
    slug: "viper-gears-wt-competition-sparring-guards-set",
    category: "Belts & Accessories",
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewCount: 62,
    isWTApproved: true,
    inStock: true,
    images: [
      "/images/kpnp-dobok-2.jpg",
      "/images/kpnp-dobok-1.jpg"
    ],
    description: "Official World Taekwondo WT certified forearm and shin guards set. High-density EVA foam padding with dual elastic velcro straps. Weight: 500 grams.",
    fabricSpecs: "High Density Impact EVA Foam with Synthetic Leather Exterior",
    weightGsm: 500,
    availableSizes: [140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
    features: [
      "500g High Impact EVA Protection Guards.",
      "Delivery parcel: ₹200 delivery below ₹1,000 and ₹350 below ₹5,000.",
      "Ergonomic fit with non-slip dual velcro straps.",
      "WT Approved for national sparring tournaments."
    ]
  }
];
