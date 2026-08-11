import { NextResponse } from "next/server";
import { getProductById, getProductBySlug, isStorefrontVisible } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = (await context.params).id;
  const product = (await getProductById(id)) ?? (await getProductBySlug(id));

  if (!product || !isStorefrontVisible(product)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
