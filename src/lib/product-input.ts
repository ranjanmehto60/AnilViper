import "server-only";

import { CategoryType, Product } from "@/types/product";

const VALID_CATEGORIES: CategoryType[] = [
  "Beginner Dobok",
  "Advanced Competition Dobok",
  "Kids Dobok",
  "Black Belt Dobok",
  "Belts & Accessories",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return cleaned.length > 0 ? cleaned : null;
}

function parseSizeArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const cleaned = value
    .map((item) => Number(item))
    .filter((size) => Number.isInteger(size) && size > 0);
  return cleaned.length > 0 ? [...new Set(cleaned)].sort((a, b) => a - b) : null;
}

export type ProductRequiredInput = Pick<
  Product,
  | "name"
  | "category"
  | "price"
  | "originalPrice"
  | "description"
  | "images"
  | "availableSizes"
  | "fabricSpecs"
  | "weightGsm"
  | "isWTApproved"
  | "features"
>;

export interface SanitizedProductInput {
  product: Partial<Product> & ProductRequiredInput;
  error: string | null;
}

export function sanitizeProductInput(body: Record<string, unknown>): SanitizedProductInput {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = VALID_CATEGORIES.includes(body.category as CategoryType)
    ? (body.category as CategoryType)
    : null;
  const price = Number(body.price);
  const originalPrice = Number(body.originalPrice ?? price);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const images = parseStringArray(body.images);
  const sizes = parseSizeArray(body.availableSizes);
  const features = parseStringArray(body.features);
  const fabricSpecs = typeof body.fabricSpecs === "string" ? body.fabricSpecs.trim() : "";
  const weightGsm = Number(body.weightGsm);
  const isWTApproved = body.isWTApproved === true || body.isWTApproved === "true";

  if (!name) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "Product name is required." };
  }
  if (!category) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "Please select a valid category." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "Selling price must be greater than 0." };
  }
  if (!Number.isFinite(originalPrice) || originalPrice < price) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "Original price must be greater than or equal to the selling price." };
  }
  if (!images) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "At least one product image URL is required." };
  }
  if (!sizes) {
    return { product: {} as Partial<Product> & ProductRequiredInput, error: "Select at least one height size." };
  }

  const product: Partial<Product> & ProductRequiredInput = {
    name,
    category,
    price: Math.round(price),
    originalPrice: Math.round(originalPrice),
    description: description || name,
    images,
    availableSizes: sizes,
    fabricSpecs: fabricSpecs || "Lightweight Moisture-Wicking Poly-Blend",
    weightGsm: Number.isFinite(weightGsm) && weightGsm > 0 ? Math.round(weightGsm) : 210,
    isWTApproved,
    features: features ?? [],
  };

  if (body.id) product.id = String(body.id).trim();
  if (body.slug) product.slug = slugify(String(body.slug));
  if (body.rating !== undefined && Number.isFinite(Number(body.rating))) {
    product.rating = Math.max(0, Math.min(5, Number(body.rating)));
  }
  if (body.reviewCount !== undefined && Number.isFinite(Number(body.reviewCount))) {
    product.reviewCount = Math.max(0, Math.round(Number(body.reviewCount)));
  }
  if (body.inStock === true || body.inStock === false) product.inStock = Boolean(body.inStock);

  return { product, error: null };
}

export function buildProductId(): string {
  return `viper-custom-${Date.now()}`;
}

export function buildProductSlug(name: string): string {
  const base = slugify(name) || `uniform-${Date.now()}`;
  return `${base}-${Date.now().toString(36)}`;
}

export function sanitizeProductPatch(
  body: Record<string, unknown>
): { patch: Partial<Product>; error: string | null } {
  const patch: Partial<Product> = {};
  const has = (key: string) => body[key] !== undefined && body[key] !== null;

  if (has("name")) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return { patch: {}, error: "Product name cannot be empty." };
    patch.name = name;
  }

  if (has("category")) {
    if (!VALID_CATEGORIES.includes(body.category as CategoryType)) {
      return { patch: {}, error: "Please select a valid category." };
    }
    patch.category = body.category as CategoryType;
  }

  if (has("price")) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      return { patch: {}, error: "Selling price must be greater than 0." };
    }
    patch.price = Math.round(price);
  }

  if (has("originalPrice")) {
    const originalPrice = Number(body.originalPrice);
    const priceOverride = has("price") ? Number(body.price) : null;
    if (
      !Number.isFinite(originalPrice) ||
      originalPrice < 0 ||
      (priceOverride !== null && originalPrice < priceOverride)
    ) {
      return { patch: {}, error: "Original price must be at least the selling price." };
    }
    patch.originalPrice = Math.round(originalPrice);
  }

  if (has("description")) {
    patch.description = typeof body.description === "string" ? body.description.trim() : "";
  }

  if (has("images")) {
    const images = parseStringArray(body.images);
    if (!images) return { patch: {}, error: "At least one product image URL is required." };
    patch.images = images;
  }

  if (has("availableSizes")) {
    const sizes = parseSizeArray(body.availableSizes);
    if (!sizes) return { patch: {}, error: "Select at least one height size." };
    patch.availableSizes = sizes;
  }

  if (has("features")) {
    patch.features = parseStringArray(body.features) ?? [];
  }

  if (has("fabricSpecs")) {
    patch.fabricSpecs = typeof body.fabricSpecs === "string" ? body.fabricSpecs.trim() : "";
  }

  if (has("weightGsm")) {
    const weightGsm = Number(body.weightGsm);
    patch.weightGsm = Number.isFinite(weightGsm) && weightGsm > 0 ? Math.round(weightGsm) : 210;
  }

  if (body.isWTApproved === true || body.isWTApproved === false) {
    patch.isWTApproved = Boolean(body.isWTApproved);
  }

  if (body.inStock === true || body.inStock === false) {
    patch.inStock = Boolean(body.inStock);
  }

  if (has("rating") && Number.isFinite(Number(body.rating))) {
    patch.rating = Math.max(0, Math.min(5, Number(body.rating)));
  }

  if (has("reviewCount") && Number.isFinite(Number(body.reviewCount))) {
    patch.reviewCount = Math.max(0, Math.round(Number(body.reviewCount)));
  }

  return { patch, error: null };
}
