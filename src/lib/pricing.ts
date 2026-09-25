import { listProducts } from "@/lib/product-db";
import { calculateShippingFee } from "@/config/commerce";
import {
  BackPrintOption,
  DEFAULT_BACK_PRINT_OPTION,
  isBackPrintOption,
  supportsBackIndPrint,
} from "@/types/product";

export { getCodBookingAmount } from "@/config/commerce";

export interface PricingLine {
  productId: string;
  name: string;
  category: string;
  size: number;
  backPrintOption?: BackPrintOption;
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

export async function computePricing(
  lines: { productId: string; size: number; backPrintOption?: unknown; quantity: number }[]
): Promise<{ breakdown: PricingBreakdown; error: string | null }> {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { breakdown: emptyBreakdown(), error: "Your cart is empty" };
  }

  const products = await listProducts();
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
    const backPrintOption = line.backPrintOption ?? DEFAULT_BACK_PRINT_OPTION;
    if (!isBackPrintOption(backPrintOption)) {
      return { breakdown: emptyBreakdown(), error: `Please select a valid back print option for ${product.name}` };
    }
    const quantity = Math.max(1, Math.min(10, Number(line.quantity) || 1));
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    items.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      size: line.size,
      ...(supportsBackIndPrint(product) ? { backPrintOption } : {}),
      quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  const shipping = calculateShippingFee(
    subtotal,
    items.map((item) => ({ productId: item.productId, category: item.category, quantity: item.quantity }))
  );

  const total = Math.max(0, subtotal + shipping);

  return {
    breakdown: {
      items,
      subtotal,
      discount: 0,
      shipping,
      total,
      discountCode: null,
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
