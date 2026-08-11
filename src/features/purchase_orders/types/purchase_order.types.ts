// src/types/purchase_orders.types.ts
import type { Item } from '../../items/types/item.types'
import type { Supplier } from '../../suppliers/types/supplier.types'


export type PurchaseOrderStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED'

export interface PurchaseOrderLine {
  id: string
  purchase_order_id: string
  item_id: string | null
  quantity: number
  unit_cost: number
  created_at?: string
  updated_at?: string

  item?: Item | null
}

export interface PurchaseOrder {
  id: string
  workspace_id: string
  supplier_id: string | null
  po_number: string
  total_amount: number
  status: PurchaseOrderStatus
  created_at?: string
  updated_at?: string

  supplier?: Supplier | null
  purchase_order_lines: PurchaseOrderLine[]
}

export interface PurchaseOrderLineCreate {
  item_id: string | null
  quantity: number
  unit_cost: number
}

export interface PurchaseOrderCreate {
  supplier_id: string | null
  po_number: string
  status: PurchaseOrderStatus
  purchase_order_lines: PurchaseOrderLineCreate[]
}

export interface PurchaseOrderUpdate {
  supplier_id?: string | null
  po_number?: string
  status?: PurchaseOrderStatus
  purchase_order_lines?: PurchaseOrderLineCreate[]
}

export interface PaginatedPurchaseOrders {
  items: PurchaseOrder[]
  total: number
  page: number
  limit: number
  pages?: number
}
