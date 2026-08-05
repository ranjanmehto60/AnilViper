import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { createInventoryForProduct } from "@/lib/inventory-db";
import { createProduct, listProducts } from "@/lib/product-db";
import { buildProductId, buildProductSlug, sanitizeProductInput } from "@/lib/product-input";
import { Product } from "@/types/product";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { product, error } = sanitizeProductInput(body);
    if (error || !product.name) {
      return NextResponse.json({ error: error ?? "Invalid product details" }, { status: 400 });
    }

    const fullProduct: Product = {
      id: product.id ?? buildProductId(),
      slug: product.slug ?? buildProductSlug(product.name),
      rating: product.rating ?? 5.0,
      reviewCount: product.reviewCount ?? 1,
      inStock: product.inStock ?? true,
      ...product,
    };

    createProduct(fullProduct);
    createInventoryForProduct(fullProduct, 0, 3);

    return NextResponse.json({ product: fullProduct }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("UNIQUE")
      ? "A product with this ID already exists"
      : "Unable to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
