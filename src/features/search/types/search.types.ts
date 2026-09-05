export type EntityType = 
  | 'CUSTOMER' 
  | 'SUPPLIER' 
  | 'ITEM' 
  | 'SELL_ORDER' 
  | 'INVENTORY' 
  | 'STOCK_MOVEMENT'

export interface SearchResult {
  entity_type: EntityType
  id: string
  title: string
  url: string
  snippet?: string
}
