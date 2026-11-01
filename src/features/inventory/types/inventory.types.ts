// src/features/inventory/types/inventory.types.ts

import type { Bin } from '@/features/bins/types/bin.types'

export enum OrderType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  SELL_ORDER = 'SELL_ORDER',
  RETURN = 'RETURN',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  BIN_TRANSFER = 'BIN_TRANSFER'
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
  bin_id: string;
  quantity_on_hand: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryExpanded extends Inventory {
  item?: Item | null;
  bin?: Bin | null;
}

export interface PaginatedInventory {
  items: Inventory[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface PaginatedExpandedInventory {
  items: InventoryExpanded[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface StockMovement {
  id: string;
  workspace_id: string;
  item_id: string;
  bin_id: string;
  quantity_change: number;
  reference_type: OrderType | string;
  reference_id: string | null;
  bin?: Bin | null;
  created_at: string;
  updated_at: string;
  notes?: string | null;
}

export interface StockMovementCreate {
  item_id: string;
  bin_id: string;
  quantity_change: number;
  reference_type: OrderType | string;
  reference_id?: string | null;
  notes?: string | null;
}

export interface PaginatedStockMovements {
  items: StockMovement[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface InventoryTransferRequest {
  item_id: string;
  source_bin_id: string;
  destination_bin_id: string;
  quantity: number;
  notes?: string | null;
}

export interface InventoryTransferResponse {
  message: string;
}
