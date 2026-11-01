// src/types/bin.types.ts

export interface ItemSummary {
  id: string
  title: string
  sku: string
  base_price: number | null
}

export interface InventoryRecord {
  id: string
  workspace_id: string
  item_id: string
  bin_id: string | null
  quantity_on_hand: number
  quantity_allocated: number
  quantity_on_order: number
  quantity_available: number
  expected_available: number
  created_at: string
  updated_at: string
  item?: ItemSummary
}

export interface Bin {
  id: string
  workspace_id: string
  code: string
  zone: string | null
  quantity_on_hand?: number
  created_at: string
  updated_at: string
}

export interface BinDetail extends Bin {
  inventory_items: InventoryRecord[]
}

export interface PaginatedBins {
  items: Bin[]
  total: number
}

export interface BinCreate {
  code: string
  zone?: string | null
}

export interface BinUpdate {
  code?: string | null
  zone?: string | null
}
