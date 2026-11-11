// src/types/item.types.ts

import type { TableFilter } from "@/components/ui/table/types/filter.types"


export interface FilterOption {
  label: string
  value: string | number | boolean
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
  barcode_id: string | null;
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
