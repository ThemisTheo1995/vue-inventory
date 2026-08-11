// src/types/item.types.ts

export interface Item {
  id: string; 
  workspace_id: string;
  sku: string;
  title: string;
  base_price: number | null; 
  created_at?: string;
  updated_at?: string;
}

export interface ItemCreate {
  sku: string;
  title: string;
  base_price?: number | null;
}

export interface ItemUpdate {
  sku?: string;
  title?: string;
  base_price?: number | null;
}

export interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}
