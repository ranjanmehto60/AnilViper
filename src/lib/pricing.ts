import { listProducts } from "@/lib/product-db";

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

const PROMO_CODES: Record<string, number> = {
  VIPER10: 10,
  DOJANG20: 20,
};

export interface PricingLine {
  productId: string;
  name: string;
  size: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PricingBreakdown {
  items: PricingLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode: string | null;
}

export function getDiscountPercent(code: string | null | undefined): number {
  if (!code) return 0;
  return PROMO_CODES[code.trim().toUpperCase()] ?? 0;
}

export async function computePricing(
  lines: { productId: string; size: number; quantity: number }[],
  discountCode: string | null | undefined
): Promise<{ breakdown: PricingBreakdown; error: string | null }> {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { breakdown: emptyBreakdown(), error: "Your cart is empty" };
  }

  const products = listProducts();
  const items: PricingLine[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) {
      return { breakdown: emptyBreakdown(), error: `Unknown product: ${line.productId}` };
    }
    if (!product.availableSizes.includes(line.size)) {
      return { breakdown: emptyBreakdown(), error: `Size ${line.size} cm is not available for ${product.name}` };
    }
    const quantity = Math.max(1, Math.min(10, Number(line.quantity) || 1));
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    items.push({
      productId: product.id,
      name: product.name,
      size: line.size,
      quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  const percent = getDiscountPercent(discountCode);
  const discount = Math.round((subtotal * percent) / 100);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  return {
    breakdown: {
      items,
      subtotal,
      discount,
      shipping,
      total,
      discountCode: percent > 0 && discountCode ? discountCode.trim().toUpperCase() : null,
    },
    error: null,
  };
}

function emptyBreakdown(): PricingBreakdown {
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    discountCode: null,
  };
}