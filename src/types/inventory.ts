export interface InventoryItem {
  id: number;
  productId: string;
  productName: string;
  size: number;
  quantity: number;
  reorderLevel: number;
  updatedAt: string;
}

export interface CreateInventoryItemInput {
  productId: string;
  productName: string;
  size: number;
  quantity: number;
  reorderLevel: number;
}

export interface UpdateInventoryItemInput {
  quantity?: number;
  reorderLevel?: number;
}
