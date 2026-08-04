import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, randomInt } from "node:crypto";

const dataDirectory = path.join(process.cwd(), ".data");
const databasePath = path.join(dataDirectory, "viper-gears.sqlite");

let database: DatabaseSync | undefined;

function getDatabase() {
  if (!database) {
    mkdirSync(dataDirectory, { recursive: true });
    database = new DatabaseSync(databasePath);
    database.exec(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        scope TEXT NOT NULL,
        identifier TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (scope, identifier)
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        identifier TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
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
        payment_status TEXT NOT NULL,
        order_status TEXT NOT NULL,
        awb TEXT,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions_cleanup (
        id INTEGER PRIMARY KEY AUTOINCREMENT
      );
    `);
  }

  return database;
}

function hashHex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export function generateOtp(
  scope: string,
  identifier: string
): { code: string; rateLimited: boolean } {
  const now = Date.now();
  const existing = getDatabase()
    .prepare("SELECT created_at FROM otp_codes WHERE scope = ? AND identifier = ?")
    .get(scope, identifier) as { created_at: number } | undefined;

  if (existing && now - existing.created_at < RESEND_COOLDOWN_MS) {
    return { code: "", rateLimited: true };
  }

  const code = String(randomInt(100000, 1000000));
  getDatabase()
    .prepare(`
      INSERT INTO otp_codes (scope, identifier, code_hash, expires_at, attempts, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
      ON CONFLICT(scope, identifier) DO UPDATE SET
        code_hash = excluded.code_hash,
        expires_at = excluded.expires_at,
        attempts = 0,
        created_at = excluded.created_at
    `)
    .run(scope, identifier, hashHex(code), now + OTP_TTL_MS, now);

  return { code, rateLimited: false };
}

export function verifyOtp(scope: string, identifier: string, code: string): "ok" | "invalid" | "rate-limited" | "expired" | "missing" {
  const cleanCode = String(code || "").trim();
  const row = getDatabase()
    .prepare("SELECT code_hash, expires_at, attempts FROM otp_codes WHERE scope = ? AND identifier = ?")
    .get(scope, identifier) as { code_hash: string; expires_at: number; attempts: number } | undefined;

  if (!row) return "missing";

  if (Date.now() > row.expires_at) {
    getDatabase().prepare("DELETE FROM otp_codes WHERE scope = ? AND identifier = ?").run(scope, identifier);
    return "expired";
  }

  if (row.attempts >= MAX_OTP_ATTEMPTS) {
    getDatabase().prepare("DELETE FROM otp_codes WHERE scope = ? AND identifier = ?").run(scope, identifier);
    return "expired";
  }

  if (hashHex(cleanCode) !== row.code_hash) {
    getDatabase()
      .prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE scope = ? AND identifier = ?")
      .run(scope, identifier);
    return "invalid";
  }

  getDatabase().prepare("DELETE FROM otp_codes WHERE scope = ? AND identifier = ?").run(scope, identifier);
  return "ok";
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const ACCOUNT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function createSession(role: "admin" | "customer", identifier: string): { token: string; ttlMs: number } {
  const token = randomBytes(32).toString("hex");
  const ttlMs = role === "admin" ? ADMIN_SESSION_TTL_MS : ACCOUNT_SESSION_TTL_MS;

  getDatabase()
    .prepare("INSERT INTO sessions (token_hash, role, identifier, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(hashHex(token), role, identifier, Date.now() + ttlMs, Date.now());

  return { token, ttlMs };
}

export function readSession(
  token: string | null | undefined
): { role: "admin" | "customer"; identifier: string } | null {
  if (!token) return null;
  const row = getDatabase()
    .prepare("SELECT role, identifier, expires_at FROM sessions WHERE token_hash = ?")
    .get(hashHex(token)) as { role: string; identifier: string; expires_at: number } | undefined;

  if (!row) return null;
  if (Date.now() > row.expires_at) {
    getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashHex(token));
    return null;
  }

  return { role: row.role as "admin" | "customer", identifier: row.identifier };
}

export function deleteSession(token: string | null | undefined) {
  if (!token) return;
  getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashHex(token));
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
}

export interface OrderRecord extends OrderRecordInput {
  paymentStatus: "PENDING" | "PAID";
  orderStatus: "Processing" | "Shipped" | "Delivered";
  awb: string | null;
  createdAt: number;
}

function mapOrderRow(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    items: String(row.items),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    discountCode: row.discount_code === null ? null : String(row.discount_code),
    paymentStatus: String(row.payment_status) as "PENDING" | "PAID",
    orderStatus: String(row.order_status) as OrderRecord["orderStatus"],
    awb: row.awb === null ? null : String(row.awb),
    createdAt: Number(row.created_at),
  };
}

export function createOrder(input: OrderRecordInput): OrderRecord {
  getDatabase()
    .prepare(`
      INSERT INTO orders
        (id, customer_name, phone, address, items, subtotal, discount, shipping, total, discount_code, payment_status, order_status, awb, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'Processing', NULL, ?)
    `)
    .run(
      input.id,
      input.customerName,
      input.phone,
      input.address,
      input.items,
      input.subtotal,
      input.discount,
      input.shipping,
      input.total,
      input.discountCode,
      Date.now()
    );

  return {
    ...input,
    paymentStatus: "PENDING",
    orderStatus: "Processing",
    awb: null,
    createdAt: Date.now(),
  };
}

export function getOrderById(id: string): OrderRecord | null {
  const row = getDatabase().prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? mapOrderRow(row) : null;
}

export function listOrders(): OrderRecord[] {
  const rows = getDatabase().prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as Record<string, unknown>[];
  return rows.map(mapOrderRow);
}

export function listOrdersByPhone(phone: string): OrderRecord[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC")
    .all(phone) as Record<string, unknown>[];
  return rows.map(mapOrderRow);
}

export function markOrderPaid(id: string): boolean {
  const changed = getDatabase()
    .prepare("UPDATE orders SET payment_status = 'PAID' WHERE id = ? AND payment_status = 'PENDING'")
    .run(id).changes;
  return changed > 0;
}

export function updateOrderStatus(
  id: string,
  orderStatus: OrderRecord["orderStatus"],
  awb?: string | null
): OrderRecord | null {
  const current = getOrderById(id);
  if (!current) return null;

  getDatabase()
    .prepare("UPDATE orders SET order_status = ?, awb = ? WHERE id = ?")
    .run(orderStatus, awb ?? null, id);
  return getOrderById(id);
}