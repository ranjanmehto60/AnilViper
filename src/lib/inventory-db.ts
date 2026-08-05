import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { DatabaseSync } from "node:sqlite";
import { PRODUCTS } from "@/data/products";
import { listProducts } from "@/lib/product-db";
import { Product } from "@/types/product";
import { CreateInventoryItemInput, InventoryItem, UpdateInventoryItemInput } from "@/types/inventory";

const dataDirectory = process.env.VERCEL || process.env.NODE_ENV === "production"
  ? path.join(os.tmpdir(), "viper-gears-data")
  : path.join(process.cwd(), ".data");
const databasePath = path.join(dataDirectory, "viper-gears.sqlite");

let database: DatabaseSync | undefined;

function getDatabase() {
  if (!database) {
    mkdirSync(dataDirectory, { recursive: true });
    database = new DatabaseSync(databasePath);
    database.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        size_cm INTEGER NOT NULL CHECK (size_cm > 0),
        quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
        reorder_level INTEGER NOT NULL DEFAULT 2 CHECK (reorder_level >= 0),
        updated_at TEXT NOT NULL,
        UNIQUE(product_id, size_cm)
      );
      CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
    `);

    const seed = database.prepare(`
      INSERT OR IGNORE INTO inventory
        (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const staticProductIds = new Set(PRODUCTS.map((product) => product.id));

    for (const product of listProducts()) {
      product.availableSizes.forEach((size, index) => {
        const quantity = staticProductIds.has(product.id) ? Math.max(0, 12 - index * 2) : 0;
        seed.run(product.id, product.name, size, quantity, 3, now);
      });
    }
  }

  return database;
}

function mapInventoryRow(row: Record<string, unknown>): InventoryItem {
  return {
    id: Number(row.id),
    productId: String(row.product_id),
    productName: String(row.product_name),
    size: Number(row.size_cm),
    quantity: Number(row.quantity),
    reorderLevel: Number(row.reorder_level),
    updatedAt: String(row.updated_at),
  };
}

export function listInventory(): InventoryItem[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM inventory ORDER BY product_name COLLATE NOCASE, size_cm")
    .all() as Record<string, unknown>[];

  return rows.map(mapInventoryRow);
}

export function createInventory(input: CreateInventoryItemInput): InventoryItem {
  const now = new Date().toISOString();
  const result = getDatabase()
    .prepare(`
      INSERT INTO inventory
        (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(input.productId, input.productName, input.size, input.quantity, input.reorderLevel, now);

  return getInventoryById(Number(result.lastInsertRowid)) as InventoryItem;
}

export function updateInventory(id: number, input: UpdateInventoryItemInput): InventoryItem | null {
  const current = getInventoryById(id);
  if (!current) return null;

  const quantity = input.quantity ?? current.quantity;
  const reorderLevel = input.reorderLevel ?? current.reorderLevel;
  const now = new Date().toISOString();

  getDatabase()
    .prepare(`
      UPDATE inventory
      SET quantity = ?, reorder_level = ?, updated_at = ?
      WHERE id = ?
    `)
    .run(quantity, reorderLevel, now, id);

  return getInventoryById(id);
}

export function deleteInventory(id: number): boolean {
  const result = getDatabase().prepare("DELETE FROM inventory WHERE id = ?").run(id);
  return result.changes > 0;
}

export function createInventoryForProduct(product: Product, defaultQuantity = 0, reorderLevel = 3): void {
  const now = new Date().toISOString();
  const seed = getDatabase().prepare(`
    INSERT OR IGNORE INTO inventory
      (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const size of product.availableSizes) {
    seed.run(product.id, product.name, size, defaultQuantity, reorderLevel, now);
  }
}

export function deleteInventoryByProduct(productId: string): void {
  getDatabase().prepare("DELETE FROM inventory WHERE product_id = ?").run(productId);
}

export function renameInventoryProduct(productId: string, productName: string): void {
  getDatabase()
    .prepare("UPDATE inventory SET product_name = ? WHERE product_id = ?")
    .run(productName, productId);
}

export function getStockLevel(productId: string, size: number): number {
  const row = getDatabase()
    .prepare("SELECT quantity FROM inventory WHERE product_id = ? AND size_cm = ?")
    .get(productId, size) as { quantity: number } | undefined;
  return row ? row.quantity : 0;
}

export function decrementInventory(productId: string, size: number, quantity: number): boolean {
  const result = getDatabase()
    .prepare("UPDATE inventory SET quantity = quantity - ?, updated_at = ? WHERE product_id = ? AND size_cm = ? AND quantity >= ?")
    .run(quantity, new Date().toISOString(), productId, size, quantity);
  return result.changes > 0;
}

function getInventoryById(id: number): InventoryItem | null {
  const row = getDatabase().prepare("SELECT * FROM inventory WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;

  return row ? mapInventoryRow(row) : null;
}
