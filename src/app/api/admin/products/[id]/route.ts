import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import {
  createInventoryForProduct,
  deleteInventoryByProduct,
  renameInventoryProduct,
} from "@/lib/inventory-db";
import { deleteProduct, getProductById, updateProduct } from "@/lib/product-db";
import { sanitizeProductPatch } from "@/lib/product-input";
import { Product } from "@/types/product";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const id = (await context.params).id;
  const current = await getProductById(id);
  if (!current) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { patch, error } = sanitizeProductPatch(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const nameChanged = patch.name && patch.name !== current.name;
  const sizesChanged =
    patch.availableSizes !== undefined &&
    JSON.stringify(patch.availableSizes) !== JSON.stringify(current.availableSizes);

  const updated = (await updateProduct(id, patch)) as Product;

  if (nameChanged) await renameInventoryProduct(id, updated.name);
  if (sizesChanged) await createInventoryForProduct(updated, 0, 3);

  return NextResponse.json({ product: updated });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const id = (await context.params).id;
  const removed = await deleteProduct(id);
  if (!removed) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await deleteInventoryByProduct(id);
  return NextResponse.json({ success: true });
}
