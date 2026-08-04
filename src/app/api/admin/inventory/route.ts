import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { createInventory, listInventory } from "@/lib/inventory-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  return NextResponse.json({ items: listInventory() });
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId.trim() : "";
    const productName = typeof body.productName === "string" ? body.productName.trim() : "";
    const size = Number(body.size);
    const quantity = Number(body.quantity);
    const reorderLevel = Number(body.reorderLevel);

    if (
      !productId ||
      !productName ||
      !Number.isInteger(size) ||
      size <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isInteger(reorderLevel) ||
      reorderLevel < 0
    ) {
      return NextResponse.json({ error: "Invalid inventory details" }, { status: 400 });
    }

    return NextResponse.json(
      { item: createInventory({ productId, productName, size, quantity, reorderLevel }) },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error && error.message.includes("UNIQUE")
      ? "Inventory for this product and size already exists"
      : "Unable to create inventory record";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
