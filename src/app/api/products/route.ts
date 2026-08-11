import { NextResponse } from "next/server";
import { listStorefrontProducts } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listStorefrontProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in /api/products GET:", error);
    return NextResponse.json({ products: [] });
  }
}
