// src/types/item.types.ts

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface TableFilter {
  key: string
  label?: string
  placeholder?: string
  type?: "select" | "range"
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  prefix?: string
}

export interface ItemFilterParams {
  is_deleted?: boolean | string | null
  [key: string]: any
}

export interface Item {
  id: string; 
  workspace_id: string;
  sku: string;
  title: string;
  base_price: number | null; 
  is_deleted?: boolean;
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
  is_deleted?: boolean;
}

export interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
  filters?: TableFilter[];
}
