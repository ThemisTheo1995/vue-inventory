// src/types/sell_orders.types.ts
import type { Item } from '../../items/types/item.types'
import type { Customer } from '../../customers/types/customer.types'


export type SellOrderStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED'

export interface SellOrderLine {
  id: string
  sell_order_id: string
  item_id: string | null
  quantity: number
  unit_cost: number
  created_at?: string
  updated_at?: string

  item?: Item | null
}

export interface SellOrder {
  id: string
  workspace_id: string
  customer_id: string | null
  so_number: string
  total_amount: number
  status: SellOrderStatus
  created_at?: string
  updated_at?: string

  customer?: Customer | null
  sell_order_lines: SellOrderLine[]
}

export interface SellOrderLineCreate {
  item_id: string | null
  quantity: number
  unit_cost: number
}

export interface SellOrderCreate {
  customer_id: string | null
  so_number: string
  status: SellOrderStatus
  sell_order_lines: SellOrderLineCreate[]
}

export interface SellOrderUpdate {
  customer_id?: string | null
  so_number?: string
  status?: SellOrderStatus
  sell_order_lines?: SellOrderLineCreate[]
}

export interface PaginatedSellOrders {
  items: SellOrder[]
  total: number
  page: number
  limit: number
  pages?: number
}
