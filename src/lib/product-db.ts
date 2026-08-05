import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { DatabaseSync } from "node:sqlite";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";

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
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(json_extract(data, '$.slug'));
    `);

    const seed = database.prepare(
      "INSERT OR IGNORE INTO products (id, data, created_at) VALUES (?, ?, ?)"
    );
    PRODUCTS.forEach((product, index) => {
      seed.run(product.id, JSON.stringify(product), Date.now() + index);
    });
  }

  return database;
}

function mapProductRow(row: Record<string, unknown>): Product {
  return JSON.parse(String(row.data)) as Product;
}

export function listProducts(): Product[] {
  const rows = getDatabase()
    .prepare("SELECT data FROM products ORDER BY created_at ASC")
    .all() as Record<string, unknown>[];

  return rows.map(mapProductRow);
}

export function getProductById(id: string): Product | null {
  const row = getDatabase()
    .prepare("SELECT data FROM products WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;

  return row ? mapProductRow(row) : null;
}

export function getProductBySlug(slug: string): Product | null {
  const row = getDatabase()
    .prepare("SELECT data FROM products WHERE json_extract(data, '$.slug') = ?")
    .get(slug) as Record<string, unknown> | undefined;

  return row ? mapProductRow(row) : null;
}

export function createProduct(product: Product): Product {
  getDatabase()
    .prepare("INSERT INTO products (id, data, created_at) VALUES (?, ?, ?)")
    .run(product.id, JSON.stringify(product), Date.now());

  return product;
}

export function updateProduct(id: string, fields: Partial<Product>): Product | null {
  const current = getProductById(id);
  if (!current) return null;

  const next = { ...current, ...fields };
  getDatabase()
    .prepare("UPDATE products SET data = ? WHERE id = ?")
    .run(JSON.stringify(next), id);

  return next;
}

export function deleteProduct(id: string): boolean {
  const result = getDatabase().prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}
