// One-time migration: copies data from the legacy SQLite database
// (.data/viper-gears.sqlite) into Postgres.
//
// Usage:
//   POSTGRES_URL=<your pooled connection string> node scripts/migrate-sqlite-to-postgres.mjs
//
// What it migrates:
//   - products (including admin-created ones not in the seed data)
//   - inventory (admin-edited quantities win over seed defaults)
//   - settings (e.g. store paused state)
//   - orders (if any exist in the SQLite file)
//
// Safe to run at any time: uses ON CONFLICT upserts.

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { sql } from "@vercel/postgres";

const sqlitePath = process.env.SQLITE_PATH || path.join(process.cwd(), ".data", "viper-gears.sqlite");

async function main() {
  const db = new DatabaseSync(sqlitePath);
  const hasTable = (name) =>
    db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(name) !== undefined;

  // ------------------------------------------------------------------ products
  if (hasTable("products")) {
    const rows = db
      .prepare("SELECT id, data, created_at FROM products")
      .all();
    let inserted = 0;
    for (const row of rows) {
      await sql`
        INSERT INTO products (id, data, created_at)
        VALUES (${row.id}, ${row.data}::jsonb, ${Number(row.created_at)})
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    }
    console.log(`products: ${inserted} migrated`);
  }

  // ----------------------------------------------------------------- inventory
  if (hasTable("inventory")) {
    const rows = db
      .prepare(
        "SELECT product_id, product_name, size_cm, quantity, reorder_level, updated_at FROM inventory"
      )
      .all();
    let migrated = 0;
    for (const row of rows) {
      await sql`
        INSERT INTO inventory (product_id, product_name, size_cm, quantity, reorder_level, updated_at)
        VALUES (${row.product_id}, ${row.product_name}, ${Number(row.size_cm)}, ${Number(row.quantity)}, ${Number(row.reorder_level)}, ${row.updated_at})
        ON CONFLICT (product_id, size_cm) DO UPDATE SET
          product_name = EXCLUDED.product_name,
          quantity = EXCLUDED.quantity,
          reorder_level = EXCLUDED.reorder_level,
          updated_at = EXCLUDED.updated_at
      `;
      migrated++;
    }
    console.log(`inventory: ${migrated} rows migrated`);
  }

  // ----------------------------------------------------------------- settings
  if (hasTable("settings")) {
    const rows = db.prepare("SELECT key, value FROM settings").all();
    let migrated = 0;
    for (const row of rows) {
      await sql`
        INSERT INTO settings (key, value) VALUES (${row.key}, ${row.value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
      migrated++;
    }
    console.log(`settings: ${migrated} migrated`);
  }

  // -------------------------------------------------------------------- orders
  if (hasTable("orders")) {
    const rows = db
      .prepare(
        `SELECT id, customer_name, phone, address, items, subtotal, discount, shipping,
                total, discount_code, payment_status, order_status, awb,
                razorpay_order_id, razorpay_payment_id, shiprocket_order_id, shipment_id,
                courier_name, created_at
         FROM orders`
      )
      .all();
    let migrated = 0;
    for (const row of rows) {
      await sql`
        INSERT INTO orders
          (id, customer_name, phone, address, items, subtotal, discount, shipping, total,
           discount_code, payment_status, order_status, awb, razorpay_order_id,
           razorpay_payment_id, shiprocket_order_id, shipment_id, courier_name, created_at)
        VALUES
          (${row.id}, ${row.customer_name}, ${row.phone}, ${row.address}, ${row.items},
           ${Number(row.subtotal)}, ${Number(row.discount)}, ${Number(row.shipping)}, ${Number(row.total)},
           ${row.discount_code ?? null}, ${row.payment_status}, ${row.order_status},
           ${row.awb ?? null}, ${row.razorpay_order_id ?? null},
           ${row.razorpay_payment_id ?? null}, ${row.shiprocket_order_id ?? null},
           ${row.shipment_id ?? null}, ${row.courier_name ?? null}, ${Number(row.created_at)})
        ON CONFLICT (id) DO NOTHING
      `;
      migrated++;
    }
    console.log(`orders: ${migrated} migrated`);
  }

  db.close();
  console.log("Migration complete.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
