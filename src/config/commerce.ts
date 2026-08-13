const FREE_SHIPPING_PRODUCT_IDS = new Set([
  "test-gateway-sample-1-rupee",
  "viper-custom-1786626527750",
]);

export const FREE_SHIPPING_THRESHOLD = 5000;
export const LOW_ORDER_SHIPPING_THRESHOLD = 1000;
export const LOW_ORDER_SHIPPING_FEE = 200;
export const SHIPPING_FEE_BELOW_FREE_THRESHOLD = 350;

// Parcel details used by Shiprocket. Belt parcels are kept below 500 grams.
export const BELT_PACKAGE = {
  weightKg: 0.49,
  lengthCm: 40,
  breadthCm: 12,
  heightCm: 5,
} as const;

export const DRESS_PACKAGE = {
  weightKg: 1,
  lengthCm: 41,
  breadthCm: 32,
  heightCm: 3.7,
} as const;

export interface ShippingLineInput {
  productId?: string;
  category?: string | null;
  quantity?: number;
}

export interface ShippingPackageDetails {
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

function lineUnits(line: ShippingLineInput): number {
  const quantity = Number(line.quantity);
  return Number.isFinite(quantity) && quantity > 0 ? Math.min(10, Math.floor(quantity)) : 1;
}

function isBeltLine(line: ShippingLineInput): boolean {
  return line.category === "Belts & Accessories";
}

/**
 * Orders below ₹1,000 use ₹200 delivery; orders from ₹1,000 to below
 * ₹5,000 use ₹350. The free-shipping threshold uses the merchandise
 * subtotal before promo discounts.
 */
export function calculateShippingFee(subtotal: number, items: ShippingLineInput[]): number {
  if (items.length === 0 || items.some((item) => item.productId && hasFreeShippingOverride(item.productId))) {
    return 0;
  }

  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  if (subtotal < LOW_ORDER_SHIPPING_THRESHOLD) return LOW_ORDER_SHIPPING_FEE;
  return SHIPPING_FEE_BELOW_FREE_THRESHOLD;
}

/**
 * Returns the parcel data for a consolidated Shiprocket shipment. For more
 * than one unit, the base parcel height is scaled while length and breadth
 * remain those of the largest item type in the shipment.
 */
export function getShippingPackageDetails(items: ShippingLineInput[], subtotal?: number): ShippingPackageDetails {
  if (typeof subtotal === "number" && subtotal <= 1000) {
    return {
      weightKg: 0.5,
      lengthCm: 40,
      breadthCm: 12,
      heightCm: 5,
    };
  }

  let beltUnits = 0;
  let dressUnits = 0;

  for (const item of items) {
    if (isBeltLine(item)) beltUnits += lineUnits(item);
    else dressUnits += lineUnits(item);
  }

  const totalUnits = beltUnits + dressUnits;
  if (totalUnits === 0) {
    return {
      weightKg: DRESS_PACKAGE.weightKg,
      lengthCm: DRESS_PACKAGE.lengthCm,
      breadthCm: DRESS_PACKAGE.breadthCm,
      heightCm: DRESS_PACKAGE.heightCm,
    };
  }

  const basePackage = dressUnits > 0 ? DRESS_PACKAGE : BELT_PACKAGE;
  const calculatedWeight = dressUnits * DRESS_PACKAGE.weightKg + beltUnits * BELT_PACKAGE.weightKg;
  const weightKg = Math.max(1, calculatedWeight);
  const heightCm = Math.min(30, Math.max(basePackage.heightCm, basePackage.heightCm * totalUnits));

  return {
    weightKg: Math.round(Math.min(10, Math.max(0.1, weightKg)) * 100) / 100,
    lengthCm: basePackage.lengthCm,
    breadthCm: basePackage.breadthCm,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

export function hasFreeShippingOverride(productId: string): boolean {
  return FREE_SHIPPING_PRODUCT_IDS.has(productId);
}
