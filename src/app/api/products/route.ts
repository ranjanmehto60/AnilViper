import { NextResponse } from "next/server";
import { listProducts } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in /api/products GET:", error);
    return NextResponse.json({ products: [] });
  }
}
