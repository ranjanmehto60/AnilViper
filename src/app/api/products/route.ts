import { NextResponse } from "next/server";
import { listProducts } from "@/lib/product-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ products: listProducts() });
}
