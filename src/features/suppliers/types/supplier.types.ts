export interface Supplier {
  id: string
  workspace_id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface PaginatedSuppliers {
  items: Supplier[]
  total: number
}

export interface SupplierCreate {
  name: string
  email: string
}

export interface SupplierUpdate {
  name?: string | null
  email?: string | null
}
