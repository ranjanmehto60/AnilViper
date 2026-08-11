import { Product } from "@/types/product";

const INTERNAL_PRODUCT_IDS = new Set(["test-gateway-sample-1-rupee"]);

export function isStorefrontVisible(product: Product): boolean {
  return product.isStorefrontVisible !== false && !INTERNAL_PRODUCT_IDS.has(product.id);
}

export function filterStorefrontProducts(products: Product[]): Product[] {
  return products.filter(isStorefrontVisible);
}
