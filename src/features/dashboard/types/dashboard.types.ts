export interface DashboardKPIs {
  total_revenue: number
  revenue_trend?: string | null
  revenue_trend_up: boolean

  total_sell_orders: number
  sell_orders_trend?: string | null
  sell_orders_trend_up: boolean

  total_purchase_orders: number
  purchase_orders_trend?: string | null
  purchase_orders_trend_up: boolean

  items_low_stock: number
}

export interface RevenueChartDataPoint {
  date: string
  revenue: number
}

export interface RecentSellOrderSummary {
  id: string
  so_number: string
  total_amount: number
  status: string
  created_at: string
}

export interface IncomingPurchaseOrderSummary {
  id: string
  po_number: string
  total_amount: number
  status: string
  created_at: string
}

export interface LowStockAlert {
  item_id: string
  sku: string
  title: string
  quantity_on_hand: number
  quantity_allocated: number
  quantity_available: number
  quantity_on_order: number
}

export interface DashboardResponse {
  kpis: DashboardKPIs
  revenue_chart: RevenueChartDataPoint[]
  recent_sell_orders: RecentSellOrderSummary[]
  incoming_purchase_orders: IncomingPurchaseOrderSummary[]
  low_stock_alerts: LowStockAlert[]
}
