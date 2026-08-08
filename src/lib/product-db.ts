import "server-only";
import "@/lib/db-env";

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
      await sql`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          name TEXT PRIMARY KEY
        )
      `;

      const seedCheck = await sql`SELECT name FROM schema_migrations WHERE name = 'seed_products_v1'`;
      if (seedCheck.rows.length === 0) {
        const now = Date.now();
        for (let index = 0; index < PRODUCTS.length; index++) {
          const product = PRODUCTS[index];
          await sql`
            INSERT INTO products (id, data, created_at)
            VALUES (${product.id}, ${JSON.stringify(product)}::jsonb, ${now + index})
            ON CONFLICT (id) DO NOTHING
          `;
        }
        await sql`
          INSERT INTO schema_migrations (name) VALUES ('seed_products_v1') ON CONFLICT DO NOTHING
        `;
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

async function withSchemaFallback<T>(queryFn: () => Promise<T>): Promise<T> {
  try {
    return await queryFn();
  } catch (error: unknown) {
    const errCode = typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;
    if (errCode === "42P01" || errCode === "42703") {
      await ensureSchema();
      return await queryFn();
    }
    throw error;
  }
}

type ProductRow = { data: Product };

function mapProductRow(row: ProductRow): Product {
  return row.data;
}

const fetchProductsFromDb = async (): Promise<Product[]> => {
  return withSchemaFallback(async () => {
    const result = await sql<ProductRow>`SELECT data FROM products ORDER BY created_at ASC`;
    return result.rows ? result.rows.map(mapProductRow) : [];
  });
};

export async function listProducts(): Promise<Product[]> {
  try {
    return await fetchProductsFromDb();
  } catch (error) {
    console.error("Postgres connection or query error in listProducts:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await withSchemaFallback(async () => {
      const result = await sql<ProductRow>`SELECT data FROM products WHERE id = ${id}`;
      if (result.rows.length > 0) return mapProductRow(result.rows[0]);
      return null;
    });
  } catch (error) {
    console.error("Postgres connection or query error in getProductById:", error);
  }
  return null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await withSchemaFallback(async () => {
      const result = await sql<ProductRow>`SELECT data FROM products WHERE data->>'slug' = ${slug}`;
      if (result.rows.length > 0) return mapProductRow(result.rows[0]);
      return null;
    });
  } catch (error) {
    console.error("Postgres connection or query error in getProductBySlug:", error);
  }
  return null;
}

export async function createProduct(product: Product): Promise<Product> {
  const result = await withSchemaFallback(async () => {
    await sql`
      INSERT INTO products (id, data, created_at) VALUES (${product.id}, ${JSON.stringify(product)}::jsonb, ${Date.now()})
    `;
    return product;
  });
  return result;
}

export async function updateProduct(id: string, fields: Partial<Product>): Promise<Product | null> {
  const current = await getProductById(id);
  if (!current) return null;

  const next = { ...current, ...fields };
  await withSchemaFallback(async () => {
    await sql`
      UPDATE products SET data = ${JSON.stringify(next)}::jsonb WHERE id = ${id}
    `;
  });

  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await withSchemaFallback(async () => {
    const res = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
    return res.rows.length > 0;
  });
  return result;
}
