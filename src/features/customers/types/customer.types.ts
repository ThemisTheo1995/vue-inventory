export interface Customer {
  id: string
  workspace_id: string
  first_name: string
  last_name: string | null
  email: string
  created_at: string
  updated_at: string
}

export interface PaginatedCustomers {
  items: Customer[]
  total: number
}

export interface CustomerCreate {
  first_name: string
  last_name?: string | null
  email: string
}

export interface CustomerUpdate {
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}
