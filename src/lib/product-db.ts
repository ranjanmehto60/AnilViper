import "server-only";

import { sql } from "@vercel/postgres";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          created_at BIGINT NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_products_slug ON products ((data->>'slug'))
      `;

      const now = Date.now();
      for (let index = 0; index < PRODUCTS.length; index++) {
        const product = PRODUCTS[index];
        await sql`
          INSERT INTO products (id, data, created_at)
          VALUES (${product.id}, ${JSON.stringify(product)}::jsonb, ${now + index})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

type ProductRow = { data: Product };

function mapProductRow(row: ProductRow): Product {
  return row.data;
}

export async function listProducts(): Promise<Product[]> {
  try {
    await ensureSchema();
    const result = await sql<ProductRow>`SELECT data FROM products ORDER BY created_at ASC`;
    if (result.rows && result.rows.length > 0) {
      return result.rows.map(mapProductRow);
    }
  } catch (error) {
    console.error("Postgres connection or query error in listProducts, falling back to static PRODUCTS:", error);
  }
  return PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    await ensureSchema();
    const result = await sql<ProductRow>`SELECT data FROM products WHERE id = ${id}`;
    if (result.rows.length > 0) return mapProductRow(result.rows[0]);
  } catch (error) {
    console.error("Postgres connection or query error in getProductById, falling back to static PRODUCTS:", error);
  }
  return PRODUCTS.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await ensureSchema();
    const result = await sql<ProductRow>`SELECT data FROM products WHERE data->>'slug' = ${slug}`;
    if (result.rows.length > 0) return mapProductRow(result.rows[0]);
  } catch (error) {
    console.error("Postgres connection or query error in getProductBySlug, falling back to static PRODUCTS:", error);
  }
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function createProduct(product: Product): Promise<Product> {
  await ensureSchema();
  await sql`
    INSERT INTO products (id, data, created_at) VALUES (${product.id}, ${JSON.stringify(product)}::jsonb, ${Date.now()})
  `;
  return product;
}

export async function updateProduct(id: string, fields: Partial<Product>): Promise<Product | null> {
  await ensureSchema();
  const current = await getProductById(id);
  if (!current) return null;

  const next = { ...current, ...fields };
  await sql`
    UPDATE products SET data = ${JSON.stringify(next)}::jsonb WHERE id = ${id}
  `;

  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSchema();
  const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
  return result.rows.length > 0;
}
