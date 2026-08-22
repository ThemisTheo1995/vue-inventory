// src/types/inventory.types.ts

export enum OrderType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  SALES_ORDER = 'SALES_ORDER',
  RETURN = 'RETURN',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT'
}

export interface Item {
  id: string;
  workspace_id: string;
  title: string;
  sku: string;
  base_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  workspace_id: string;
  item_id: string;
  quantity_on_hand: number;
  quantity_allocated: number;
  quantity_on_order: number;
  quantity_available: number;
  expected_available: number;
  item?: Item | null; // Supported via expansion
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedInventory {
  items: Inventory[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface StockMovement {
  id: string;
  workspace_id: string;
  item_id: string;
  quantity_change: number;
  reference_type: OrderType | string;
  reference_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StockMovementCreate {
  item_id: string;
  quantity_change: number;
  reference_type: OrderType | string;
  reference_id?: string | null;
}

export interface PaginatedStockMovements {
  items: StockMovement[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}
