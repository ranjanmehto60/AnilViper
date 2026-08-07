import "server-only";

import { sql } from "@vercel/postgres";
import { PRODUCTS } from "@/data/products";
import { listProducts } from "@/lib/product-db";
import { Product } from "@/types/product";
import { CreateInventoryItemInput, InventoryItem, UpdateInventoryItemInput } from "@/types/inventory";

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS inventory (
          id BIGSERIAL PRIMARY KEY,
          product_id TEXT NOT NULL,
          product_name TEXT NOT NULL,
          size_cm INTEGER NOT NULL CHECK (size_cm > 0),
          quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
          reorder_level INTEGER NOT NULL DEFAULT 2 CHECK (reorder_level >= 0),
          updated_at TEXT NOT NULL,
          UNIQUE (product_id, size_cm)
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory (product_id)
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          name TEXT PRIMARY KEY
        )
      `;

      const seedCheck = await sql`SELECT name FROM schema_migrations WHERE name = 'seed_inventory_v1'`;
      if (seedCheck.rows.length === 0) {
        const products = await listProducts();
        const now = new Date().toISOString();
        const staticProductIds = new Set(PRODUCTS.map((product) => product.id));

        for (const product of products) {
          for (let index = 0; index < product.availableSizes.length; index++) {
            const size = product.availableSizes[index];
            const quantity = staticProductIds.has(product.id) ? Math.max(0, 12 - index * 2) : 0;
            await seedInventory(product.id, product.name, size, quantity, 3, now);
          }
        }
        await sql`
          INSERT INTO schema_migrations (name) VALUES ('seed_inventory_v1') ON CONFLICT DO NOTHING
        `;
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

async function seedInventory(
  productId: string,
  productName: string,
  size: number,
  quantity: number,
  reorderLevel: number,
  updatedAt: string
): Promise<void> {
  await sql`
    INSERT INTO inventory (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
    VALUES (${productId}, ${productName}, ${size}, ${quantity}, ${reorderLevel}, ${updatedAt})
    ON CONFLICT (product_id, size_cm) DO NOTHING
  `;
}

type InventoryRow = {
  id: number | string;
  product_id: string;
  product_name: string;
  size_cm: number | string;
  quantity: number | string;
  reorder_level: number | string;
  updated_at: string;
};

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapInventoryRow(row: InventoryRow): InventoryItem {
  return {
    id: toNumber(row.id),
    productId: String(row.product_id),
    productName: String(row.product_name),
    size: toNumber(row.size_cm),
    quantity: toNumber(row.quantity),
    reorderLevel: toNumber(row.reorder_level),
    updatedAt: String(row.updated_at),
  };
}

export async function listInventory(): Promise<InventoryItem[]> {
  await ensureSchema();
  const result = await sql<InventoryRow>`
    SELECT * FROM inventory ORDER BY LOWER(product_name), size_cm
  `;
  return result.rows.map(mapInventoryRow);
}

export async function createInventory(input: CreateInventoryItemInput): Promise<InventoryItem> {
  await ensureSchema();
  const result = await sql<InventoryRow>`
    INSERT INTO inventory (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
    VALUES (${input.productId}, ${input.productName}, ${input.size}, ${input.quantity}, ${input.reorderLevel}, ${new Date().toISOString()})
    RETURNING *
  `;
  return mapInventoryRow(result.rows[0]);
}

export async function updateInventory(id: number, input: UpdateInventoryItemInput): Promise<InventoryItem | null> {
  await ensureSchema();
  const current = await getInventoryById(id);
  if (!current) return null;

  const quantity = input.quantity ?? current.quantity;
  const reorderLevel = input.reorderLevel ?? current.reorderLevel;

  const result = await sql<InventoryRow>`
    UPDATE inventory
    SET quantity = ${quantity}, reorder_level = ${reorderLevel}, updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
    RETURNING *
  `;

  return result.rows.length > 0 ? mapInventoryRow(result.rows[0]) : null;
}

export async function deleteInventory(id: number): Promise<boolean> {
  await ensureSchema();
  const result = await sql`DELETE FROM inventory WHERE id = ${id} RETURNING id`;
  return result.rows.length > 0;
}

export async function createInventoryForProduct(product: Product, defaultQuantity = 0, reorderLevel = 3): Promise<void> {
  await ensureSchema();
  const now = new Date().toISOString();
  for (const size of product.availableSizes) {
    await seedInventory(product.id, product.name, size, defaultQuantity, reorderLevel, now);
  }
}

export async function deleteInventoryByProduct(productId: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM inventory WHERE product_id = ${productId}`;
}

export async function renameInventoryProduct(productId: string, productName: string): Promise<void> {
  await ensureSchema();
  await sql`UPDATE inventory SET product_name = ${productName} WHERE product_id = ${productId}`;
}

export async function getStockLevel(productId: string, size: number): Promise<number> {
  await ensureSchema();
  const result = await sql<{ quantity: number | string }>`
    SELECT quantity FROM inventory WHERE product_id = ${productId} AND size_cm = ${size}
  `;
  return result.rows.length > 0 ? toNumber(result.rows[0].quantity) : 0;
}

export async function decrementInventory(productId: string, size: number, quantity: number): Promise<boolean> {
  await ensureSchema();
  const result = await sql`
    UPDATE inventory
    SET quantity = quantity - ${quantity}, updated_at = ${new Date().toISOString()}
    WHERE product_id = ${productId} AND size_cm = ${size} AND quantity >= ${quantity}
    RETURNING id
  `;
  return result.rows.length > 0;
}

async function getInventoryById(id: number): Promise<InventoryItem | null> {
  await ensureSchema();
  const result = await sql<InventoryRow>`SELECT * FROM inventory WHERE id = ${id}`;
  return result.rows.length > 0 ? mapInventoryRow(result.rows[0]) : null;
}
