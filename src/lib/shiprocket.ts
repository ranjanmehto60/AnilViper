import "server-only";

const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

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

    const data = await response.json();
    if (data.token) {
      cachedToken = data.token;
      // Shiprocket token valid for ~10 days. Cache for 9 days.
      tokenExpiresAt = now + 9 * 24 * 60 * 60 * 1000;
      return cachedToken;
    }
  } catch (error) {
    console.error("[Shiprocket Auth Exception]", error);
  }

  return null;
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

    const data = await response.json();

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
    const formattedDate = payload.orderDate || new Date().toISOString().replace("T", " ").substring(0, 16);
    const body = {
      order_id: payload.orderId,
      order_date: formattedDate,
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

    const data = await response.json();

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

    const data = await response.json();
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

export async function getShiprocketTracking(awb: string) {
  const token = await getShiprocketToken();
  if (!token) {
    return {
      status: "In Transit",
      scans: [
        { location: "Delhi Hub", activity: "Dispatched via Express Courier", date: new Date().toISOString() },
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

    const data = await response.json();
    return data.tracking_data || data;
  } catch {
    return { status: "Tracking details unavailable" };
  }
}
