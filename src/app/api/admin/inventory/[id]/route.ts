import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { deleteInventory, updateInventory } from "@/lib/inventory-db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid inventory id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const quantity = body.quantity === undefined ? undefined : Number(body.quantity);
    const reorderLevel = body.reorderLevel === undefined ? undefined : Number(body.reorderLevel);

    if (
      (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) ||
      (reorderLevel !== undefined && (!Number.isInteger(reorderLevel) || reorderLevel < 0))
    ) {
      return NextResponse.json({ error: "Quantity and reorder level must be whole numbers" }, { status: 400 });
    }

    const item = await updateInventory(id, { quantity, reorderLevel });
    return item
      ? NextResponse.json({ item })
      : NextResponse.json({ error: "Inventory record not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Unable to update inventory record" }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid inventory id" }, { status: 400 });
  }

  return (await deleteInventory(id))
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Inventory record not found" }, { status: 404 });
}
