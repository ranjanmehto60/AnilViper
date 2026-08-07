import "server-only";

import { getSetting, setSetting } from "@/lib/store-db";

const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

const TOKEN_SETTING_KEY = "shiprocket_token";
const TOKEN_EXPIRY_SETTING_KEY = "shiprocket_token_expires_at";
// Shiprocket tokens are valid for ~10 days. Cache for 9 days.
const TOKEN_CACHE_MS = 9 * 24 * 60 * 60 * 1000;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function safeJsonResponse(response: Response) {
  const text = await response.text();
  if (!text || !text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export function isShiprocketConfigured(): boolean {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

export async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  // On serverless (Vercel) the in-memory cache does not survive cold starts,
  // so persist the token in the database to avoid logging in on every lambda.
  try {
    const persistedToken = await getSetting(TOKEN_SETTING_KEY);
    const persistedExpiry = Number((await getSetting(TOKEN_EXPIRY_SETTING_KEY)) ?? 0) || 0;
    if (persistedToken && now < persistedExpiry) {
      cachedToken = persistedToken;
      tokenExpiresAt = persistedExpiry;
      return persistedToken;
    }
  } catch {
    // DB unavailable — fall through to a fresh login
  }

  try {
    const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[Shiprocket Auth Error]", await response.text());
      return null;
    }

    const data = await safeJsonResponse(response);
    if (data.token) {
      cachedToken = String(data.token);
      tokenExpiresAt = now + TOKEN_CACHE_MS;
      try {
        await setSetting(TOKEN_SETTING_KEY, cachedToken);
        await setSetting(TOKEN_EXPIRY_SETTING_KEY, String(tokenExpiresAt));
      } catch {
        // Persisting the token is optional — the in-memory cache still works
      }
      return cachedToken;
    }
  } catch (error) {
    console.error("[Shiprocket Auth Exception]", error);
  }

  return null;
}

// Shiprocket expects order_date in the "YYYY-MM-DD HH:MM" format in IST
export function formatShiprocketDate(value: string | number | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().replace("T", " ").substring(0, 16);
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

export interface ServiceabilityRequest {
  deliveryPincode: string;
  pickupPincode?: string;
  weightKg?: number;
  cod?: boolean;
}

export interface ServiceabilityResponse {
  available: boolean;
  courierName?: string;
  courierCompanyId?: number;
  etd?: string;
  estimatedDays?: string;
  rate?: number;
  message?: string;
}

export async function checkShiprocketServiceability(
  req: ServiceabilityRequest
): Promise<ServiceabilityResponse> {
  const token = await getShiprocketToken();
  const pickupPincode = req.pickupPincode || "110074"; // Default Delhi warehouse pincode
  const deliveryPincode = req.deliveryPincode;
  const weight = req.weightKg || 0.8;
  const cod = req.cod ? 1 : 0;

  if (!token) {
    // Return dev fallback if credentials not set
    return {
      available: true,
      courierName: "Delhivery Air / Shiprocket Express",
      etd: "2-4 Business Days",
      estimatedDays: "2-4 Business Days",
      rate: 0,
      message: "Express shipping available to " + deliveryPincode,
    };
  }

  try {
    const url = `${SHIPROCKET_API_BASE}/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await safeJsonResponse(response);

    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      const bestCourier = data.data.available_courier_companies[0];
      return {
        available: true,
        courierName: bestCourier.courier_name,
        courierCompanyId: bestCourier.courier_company_id,
        etd: bestCourier.etd,
        estimatedDays: `${bestCourier.estimated_delivery_days || "2-4"} Business Days`,
        rate: Number(bestCourier.rate || 0),
      };
    } else {
      return {
        available: false,
        message: data.message || "Pincode is currently unserviceable for delivery.",
      };
    }
  } catch (error) {
    console.error("[Shiprocket Serviceability Error]", error);
    return {
      available: false,
      message: "Unable to check pincode serviceability at this time.",
    };
  }
}

export interface ShiprocketOrderPayload {
  orderId: string;
  orderDate: string;
  customerName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
  }>;
  subtotal: number;
}

export async function createShiprocketOrder(payload: ShiprocketOrderPayload): Promise<{
  success: boolean;
  shiprocketOrderId?: number;
  shipmentId?: number;
  awb?: string;
  courierName?: string;
  error?: string;
}> {
  const token = await getShiprocketToken();
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "PRIMARY";

  if (!token) {
    // Return simulated response for dev mode
    const mockAwb = `SR_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return {
      success: true,
      shiprocketOrderId: Math.floor(1000000 + Math.random() * 9000000),
      shipmentId: Math.floor(1000000 + Math.random() * 9000000),
      awb: mockAwb,
      courierName: "Delhivery Air (Shiprocket)",
    };
  }

  try {
    const body = {
      order_id: payload.orderId,
      order_date: formatShiprocketDate(payload.orderDate),
      pickup_location: pickupLocation,
      billing_customer_name: payload.customerName,
      billing_last_name: "",
      billing_address: payload.street,
      billing_city: payload.city,
      billing_pincode: payload.pincode,
      billing_state: payload.state,
      billing_country: "India",
      billing_email: "support@vipergears.com",
      billing_phone: payload.phone,
      shipping_is_billing: true,
      order_items: payload.items.map((item) => ({
        name: item.name,
        sku: item.sku || item.name.replace(/\s+/g, "_"),
        units: item.units,
        selling_price: item.selling_price,
      })),
      payment_method: "Prepaid",
      sub_total: payload.subtotal,
      length: 30,
      breadth: 25,
      height: 15,
      weight: 0.8,
    };

    const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await safeJsonResponse(response);

    if (response.ok && data.order_id) {
      const shiprocketOrderId = data.order_id;
      const shipmentId = data.shipment_id;

      // Automatically assign AWB if shipment_id present
      let awb = "";
      let courierName = "";

      if (shipmentId) {
        const awbResult = await assignShiprocketAWB(shipmentId);
        if (awbResult.awb) {
          awb = awbResult.awb;
          courierName = awbResult.courierName || "Shiprocket Express";
        }
      }

      return {
        success: true,
        shiprocketOrderId,
        shipmentId,
        awb,
        courierName,
      };
    } else {
      return {
        success: false,
        error: data.message || JSON.stringify(data.errors || "Failed to push order to Shiprocket"),
      };
    }
  } catch (error) {
    console.error("[Shiprocket Create Order Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Shiprocket API call failed",
    };
  }
}

export async function assignShiprocketAWB(shipmentId: number): Promise<{
  awb?: string;
  courierName?: string;
  error?: string;
}> {
  const token = await getShiprocketToken();
  if (!token) return {};

  try {
    const response = await fetch(`${SHIPROCKET_API_BASE}/courier/assign/awb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id: shipmentId }),
    });

    const data = await safeJsonResponse(response);
    if (data.status === 200 && data.response?.data?.awb_code) {
      return {
        awb: data.response.data.awb_code,
        courierName: data.response.data.courier_name,
      };
    }
    return { error: data.message || "Failed to assign AWB" };
  } catch {
    return { error: "AWB assignment exception" };
  }
}

export interface TrackingScan {
  location: string;
  activity: string;
  date: string;
}

export interface NormalizedTracking {
  awb: string;
  status: string;
  courierName?: string;
  currentStatus?: string;
  eta?: string;
  scans: TrackingScan[];
  raw?: unknown;
}

export async function getShiprocketTracking(awb: string): Promise<NormalizedTracking> {
  const token = await getShiprocketToken();
  if (!token) {
    return {
      awb,
      status: "In Transit",
      courierName: "Delhivery / Shiprocket Express",
      scans: [
        {
          location: "Delhi Hub",
          activity: "Dispatched via Express Courier",
          date: new Date().toISOString(),
        },
      ],
    };
  }

  try {
    const response = await fetch(`${SHIPROCKET_API_BASE}/courier/track/awb/${awb}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await safeJsonResponse(response);
    const tracking = data.tracking_data || data;
    const shipment = Array.isArray(tracking.shipments) ? tracking.shipments[0] : undefined;
    const scans = Array.isArray(shipment?.scans)
      ? shipment.scans.map((scan: { location?: string; activity?: string; date?: string }) => ({
          location: scan.location || "",
          activity: scan.activity || "",
          date: scan.date || "",
        }))
      : [];

    return {
      awb,
      status: tracking.status || shipment?.status || "In Transit",
      courierName: tracking.courier_name || shipment?.courier_name,
      currentStatus: tracking.current_status || shipment?.current_status,
      eta: tracking.eta || undefined,
      scans,
      raw: data,
    };
  } catch {
    return { awb, status: "Tracking details unavailable", scans: [] };
  }
}
