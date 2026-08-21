export interface DashboardKPIs {
  total_revenue: number
  total_sell_orders: number
  total_purchase_orders: number
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
