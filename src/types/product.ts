export type CategoryType = 
  | "Beginner Dobok" 
  | "Advanced Competition Dobok" 
  | "Kids Dobok" 
  | "Black Belt Dobok" 
  | "Belts & Accessories"
  | "Test Product";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  isWTApproved: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock: boolean;
  images: string[];
  description: string;
  fabricSpecs: string;
  weightGsm: number;
  availableSizes: number[]; // 140, 150, 160, 170, 180, 190, 200 cm
  features: string[];
}

export interface Review {
  id: string;
  author: string;
  role: string; // e.g. "5th Dan Master, Delhi Academy"
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  userImage?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber?: string;
  courier?: string;
  address: Address;
  paymentMethod: string;
}
