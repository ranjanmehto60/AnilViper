export type CategoryType = 
  | "Beginner Dobok" 
  | "Advanced Competition Dobok" 
  | "Kids Dobok" 
  | "Black Belt Dobok" 
  | "Belts & Accessories"
  | "Test Product";

export const BACK_PRINT_OPTIONS = [
  {
    value: "with-back-ind-print",
    label: "Back IND print",
    description: "IND print on the back",
  },
  {
    value: "without-back-ind-print",
    label: "Without back IND print",
    description: "Plain back — no IND print",
  },
] as const;

export type BackPrintOption = (typeof BACK_PRINT_OPTIONS)[number]["value"];

export const DEFAULT_BACK_PRINT_OPTION: BackPrintOption = "with-back-ind-print";

export function isBackPrintOption(value: unknown): value is BackPrintOption {
  return BACK_PRINT_OPTIONS.some((option) => option.value === value);
}

export function getBackPrintLabel(value: unknown): string {
  return BACK_PRINT_OPTIONS.find((option) => option.value === value)?.label ?? BACK_PRINT_OPTIONS[0].label;
}

export function supportsBackIndPrintCategory(category: unknown): boolean {
  return category !== "Belts & Accessories" && category !== "Test Product";
}

export function supportsBackIndPrint(product: Pick<Product, "category">): boolean {
  return supportsBackIndPrintCategory(product.category);
}

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
  isStorefrontVisible?: boolean;
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
  /** Optional for backwards compatibility with carts saved before this option existed. */
  selectedBackPrint?: BackPrintOption;
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
