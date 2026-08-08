import "server-only";
import "@/lib/db-env";

import { sql } from "@vercel/postgres";
import { createHash, randomBytes, randomInt } from "node:crypto";

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS otp_codes (
          scope TEXT NOT NULL,
          identifier TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          expires_at BIGINT NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          created_at BIGINT NOT NULL,
          PRIMARY KEY (scope, identifier)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY,
          role TEXT NOT NULL,
          identifier TEXT NOT NULL,
          expires_at BIGINT NOT NULL,
          created_at BIGINT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          customer_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          items TEXT NOT NULL,
          subtotal INTEGER NOT NULL,
          discount INTEGER NOT NULL,
          shipping INTEGER NOT NULL,
          total INTEGER NOT NULL,
          discount_code TEXT,
          payment_status TEXT NOT NULL DEFAULT 'PENDING',
          order_status TEXT NOT NULL DEFAULT 'Processing',
          awb TEXT,
          razorpay_order_id TEXT,
          razorpay_payment_id TEXT,
          shiprocket_order_id TEXT,
          shipment_id TEXT,
          courier_name TEXT,
          shiprocket_pushed BOOLEAN NOT NULL DEFAULT FALSE,
          payment_method TEXT NOT NULL DEFAULT 'PREPAID',
          booking_amount INTEGER NOT NULL DEFAULT 0,
          cod_amount INTEGER NOT NULL DEFAULT 0,
          created_at BIGINT NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders (razorpay_order_id)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (phone)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `;
      // Safety for databases created before newer columns existed
      await sql`
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_pushed BOOLEAN NOT NULL DEFAULT FALSE
      `;
      await sql`
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'PREPAID'
      `;
      await sql`
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS booking_amount INTEGER NOT NULL DEFAULT 0
      `;
      await sql`
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_amount INTEGER NOT NULL DEFAULT 0
      `;
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

function hashHex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export async function generateOtp(
  scope: string,
  identifier: string
): Promise<{ code: string; rateLimited: boolean }> {
  return withSchemaFallback(async () => {
    const now = Date.now();

    const existing = await sql<{ created_at: string }>`
      SELECT created_at FROM otp_codes WHERE scope = ${scope} AND identifier = ${identifier}
    `;

    if (existing.rows.length > 0 && now - toNumber(existing.rows[0].created_at) < RESEND_COOLDOWN_MS) {
      return { code: "", rateLimited: true };
    }

    const code = String(randomInt(100000, 1000000));
    await sql`
      INSERT INTO otp_codes (scope, identifier, code_hash, expires_at, attempts, created_at)
      VALUES (${scope}, ${identifier}, ${hashHex(code)}, ${now + OTP_TTL_MS}, 0, ${now})
      ON CONFLICT (scope, identifier) DO UPDATE SET
        code_hash = EXCLUDED.code_hash,
        expires_at = EXCLUDED.expires_at,
        attempts = 0,
        created_at = EXCLUDED.created_at
    `;

    return { code, rateLimited: false };
  });
}

export async function verifyOtp(scope: string, identifier: string, code: string): Promise<"ok" | "invalid" | "rate-limited" | "expired" | "missing"> {
  return withSchemaFallback(async () => {
    const cleanCode = String(code || "").trim();

    const row = await sql<{ code_hash: string; expires_at: string; attempts: number }>`
      SELECT code_hash, expires_at, attempts FROM otp_codes WHERE scope = ${scope} AND identifier = ${identifier}
    `;

    if (row.rows.length === 0) return "missing";

    const record = row.rows[0];
    if (Date.now() > toNumber(record.expires_at)) {
      await sql`DELETE FROM otp_codes WHERE scope = ${scope} AND identifier = ${identifier}`;
      return "expired";
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await sql`DELETE FROM otp_codes WHERE scope = ${scope} AND identifier = ${identifier}`;
      return "expired";
    }

    if (hashHex(cleanCode) !== record.code_hash) {
      await sql`
        UPDATE otp_codes SET attempts = attempts + 1 WHERE scope = ${scope} AND identifier = ${identifier}
      `;
      return "invalid";
    }

    await sql`DELETE FROM otp_codes WHERE scope = ${scope} AND identifier = ${identifier}`;
    return "ok";
  });
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

const DEFAULT_PAUSE_MESSAGE = "We are currently not accepting new orders. Please check back soon.";

export async function getSetting(key: string, defaultValue: string | null = null): Promise<string | null> {
  return withSchemaFallback(async () => {
    const row = await sql<{ value: string }>`SELECT value FROM settings WHERE key = ${key}`;
    return row.rows.length > 0 ? row.rows[0].value : defaultValue;
  });
}

export async function setSetting(key: string, value: string): Promise<void> {
  await withSchemaFallback(async () => {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  });
}

export async function isOrdersPaused(): Promise<boolean> {
  return (await getSetting("orders_paused")) === "1";
}

export async function getPauseMessage(): Promise<string> {
  return (await getSetting("pause_message", DEFAULT_PAUSE_MESSAGE)) ?? DEFAULT_PAUSE_MESSAGE;
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const ACCOUNT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function createSession(role: "admin" | "customer", identifier: string): Promise<{ token: string; ttlMs: number }> {
  return withSchemaFallback(async () => {
    const token = randomBytes(32).toString("hex");
    const ttlMs = role === "admin" ? ADMIN_SESSION_TTL_MS : ACCOUNT_SESSION_TTL_MS;

    await sql`
      INSERT INTO sessions (token_hash, role, identifier, expires_at, created_at)
      VALUES (${hashHex(token)}, ${role}, ${identifier}, ${Date.now() + ttlMs}, ${Date.now()})
    `;

    return { token, ttlMs };
  });
}

export async function readSession(
  token: string | null | undefined
): Promise<{ role: "admin" | "customer"; identifier: string } | null> {
  if (!token) return null;
  return withSchemaFallback(async () => {
    const row = await sql<{ role: string; identifier: string; expires_at: string }>`
      SELECT role, identifier, expires_at FROM sessions WHERE token_hash = ${hashHex(token)}
    `;

    if (row.rows.length === 0) return null;
    const session = row.rows[0];
    if (Date.now() > toNumber(session.expires_at)) {
      await sql`DELETE FROM sessions WHERE token_hash = ${hashHex(token)}`;
      return null;
    }

    return { role: session.role as "admin" | "customer", identifier: session.identifier };
  });
}

export async function deleteSession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  await withSchemaFallback(async () => {
    await sql`DELETE FROM sessions WHERE token_hash = ${hashHex(token)}`;
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface OrderRecordInput {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode: string | null;
  paymentMethod?: "PREPAID" | "COD";
  bookingAmount?: number;
  codAmount?: number;
}

export interface OrderRecord extends OrderRecordInput {
  paymentStatus: "PENDING" | "PAID";
  orderStatus: "Processing" | "Shipped" | "Delivered";
  awb: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  shiprocketOrderId?: string | null;
  shipmentId?: string | null;
  courierName?: string | null;
  shiprocketPushed?: boolean;
  paymentMethod: "PREPAID" | "COD";
  bookingAmount: number;
  codAmount: number;
  createdAt: number;
}

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: string;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  discount_code: string | null;
  payment_status: string;
  order_status: string;
  awb: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  shiprocket_order_id: string | null;
  shipment_id: string | null;
  courier_name: string | null;
  shiprocket_pushed: boolean | null;
  payment_method: string;
  booking_amount: number | string | null;
  cod_amount: number | string | null;
  created_at: number | string;
};

function mapOrderRow(row: OrderRow): OrderRecord {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    items: String(row.items),
    subtotal: toNumber(row.subtotal),
    discount: toNumber(row.discount),
    shipping: toNumber(row.shipping),
    total: toNumber(row.total),
    discountCode: row.discount_code === null ? null : String(row.discount_code),
    paymentStatus: String(row.payment_status) as "PENDING" | "PAID",
    orderStatus: String(row.order_status) as OrderRecord["orderStatus"],
    awb: row.awb ? String(row.awb) : null,
    razorpayOrderId: row.razorpay_order_id ? String(row.razorpay_order_id) : null,
    razorpayPaymentId: row.razorpay_payment_id ? String(row.razorpay_payment_id) : null,
    shiprocketOrderId: row.shiprocket_order_id ? String(row.shiprocket_order_id) : null,
    shipmentId: row.shipment_id ? String(row.shipment_id) : null,
    courierName: row.courier_name ? String(row.courier_name) : null,
    shiprocketPushed: Boolean(row.shiprocket_pushed),
    paymentMethod: String(row.payment_method) === "COD" ? "COD" : "PREPAID",
    bookingAmount: toNumber(row.booking_amount),
    codAmount: toNumber(row.cod_amount),
    createdAt: toNumber(row.created_at),
  };
}

export async function createOrder(input: OrderRecordInput): Promise<OrderRecord> {
  return withSchemaFallback(async () => {
    const now = Date.now();
    const paymentMethod = input.paymentMethod === "COD" ? "COD" : "PREPAID";
    const bookingAmount = paymentMethod === "COD" ? (input.bookingAmount ?? 0) : 0;
    const codAmount = paymentMethod === "COD" ? (input.codAmount ?? 0) : 0;
    const result = await sql<OrderRow>`
      INSERT INTO orders
        (id, customer_name, phone, address, items, subtotal, discount, shipping, total, discount_code, payment_status, order_status, awb, shiprocket_pushed, payment_method, booking_amount, cod_amount, created_at)
      VALUES (${input.id}, ${input.customerName}, ${input.phone}, ${input.address}, ${input.items}, ${input.subtotal}, ${input.discount}, ${input.shipping}, ${input.total}, ${input.discountCode}, 'PENDING', 'Processing', NULL, FALSE, ${paymentMethod}, ${bookingAmount}, ${codAmount}, ${now})
      RETURNING *
    `;

    return mapOrderRow(result.rows[0]);
  });
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  return withSchemaFallback(async () => {
    const result = await sql<OrderRow>`SELECT * FROM orders WHERE id = ${id}`;
    return result.rows.length > 0 ? mapOrderRow(result.rows[0]) : null;
  });
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<OrderRecord | null> {
  return withSchemaFallback(async () => {
    const result = await sql<OrderRow>`SELECT * FROM orders WHERE razorpay_order_id = ${razorpayOrderId}`;
    return result.rows.length > 0 ? mapOrderRow(result.rows[0]) : null;
  });
}

export async function listOrders(): Promise<OrderRecord[]> {
  try {
    return await withSchemaFallback(async () => {
      const result = await sql<OrderRow>`SELECT * FROM orders ORDER BY created_at DESC`;
      return result.rows.map(mapOrderRow);
    });
  } catch (error) {
    console.error("Postgres error in listOrders:", error);
    return [];
  }
}

export async function listOrdersByPhone(phone: string): Promise<OrderRecord[]> {
  try {
    return await withSchemaFallback(async () => {
      const result = await sql<OrderRow>`SELECT * FROM orders WHERE phone = ${phone} ORDER BY created_at DESC`;
      return result.rows.map(mapOrderRow);
    });
  } catch (error) {
    console.error("Postgres error in listOrdersByPhone:", error);
    return [];
  }
}

export async function markOrderPaid(id: string): Promise<boolean> {
  return withSchemaFallback(async () => {
    const result = await sql`
      UPDATE orders SET payment_status = 'PAID' WHERE id = ${id} AND payment_status = 'PENDING' RETURNING id
    `;
    return result.rows.length > 0;
  });
}

export async function claimShiprocketPush(id: string): Promise<boolean> {
  return withSchemaFallback(async () => {
    const result = await sql`
      UPDATE orders SET shiprocket_pushed = TRUE WHERE id = ${id} AND shiprocket_pushed = FALSE RETURNING id
    `;
    return result.rows.length > 0;
  });
}

export async function resetShiprocketPushClaim(id: string): Promise<void> {
  await withSchemaFallback(async () => {
    await sql`UPDATE orders SET shiprocket_pushed = FALSE WHERE id = ${id}`;
  });
}

export async function updateOrderPaymentAndShipping(
  id: string,
  data: {
    paymentStatus?: "PENDING" | "PAID";
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    shiprocketOrderId?: string | number | null;
    shipmentId?: string | number | null;
    awb?: string | null;
    courierName?: string | null;
    orderStatus?: OrderRecord["orderStatus"];
  }
): Promise<OrderRecord | null> {
  const current = await getOrderById(id);
  if (!current) return null;

  const paymentStatus = data.paymentStatus ?? current.paymentStatus;
  const razorpayOrderId = data.razorpayOrderId !== undefined ? data.razorpayOrderId : current.razorpayOrderId;
  const razorpayPaymentId = data.razorpayPaymentId !== undefined ? data.razorpayPaymentId : current.razorpayPaymentId;
  const shiprocketOrderId = data.shiprocketOrderId !== undefined ? String(data.shiprocketOrderId) : current.shiprocketOrderId;
  const shipmentId = data.shipmentId !== undefined ? String(data.shipmentId) : current.shipmentId;
  const awb = data.awb !== undefined ? data.awb : current.awb;
  const courierName = data.courierName !== undefined ? data.courierName : current.courierName;
  const orderStatus = data.orderStatus ?? current.orderStatus;

  return withSchemaFallback(async () => {
    const result = await sql<OrderRow>`
      UPDATE orders SET
        payment_status = ${paymentStatus},
        razorpay_order_id = ${razorpayOrderId ?? null},
        razorpay_payment_id = ${razorpayPaymentId ?? null},
        shiprocket_order_id = ${shiprocketOrderId ?? null},
        shipment_id = ${shipmentId ?? null},
        awb = ${awb ?? null},
        courier_name = ${courierName ?? null},
        order_status = ${orderStatus}
      WHERE id = ${id}
      RETURNING *
    `;

    return result.rows.length > 0 ? mapOrderRow(result.rows[0]) : null;
  });
}

export async function updateOrderStatus(
  id: string,
  orderStatus: OrderRecord["orderStatus"],
  awb?: string | null
): Promise<OrderRecord | null> {
  const current = await getOrderById(id);
  if (!current) return null;

  return withSchemaFallback(async () => {
    const result = await sql<OrderRow>`
      UPDATE orders SET order_status = ${orderStatus}, awb = ${awb ?? null} WHERE id = ${id} RETURNING *
    `;

    return result.rows.length > 0 ? mapOrderRow(result.rows[0]) : null;
  });
}
