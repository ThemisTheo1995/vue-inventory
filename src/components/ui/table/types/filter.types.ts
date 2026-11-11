export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface TableFilter {
  key: string
  label?: string
  placeholder?: string
  type?: 'select' | 'range'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  prefix?: string
  default_value?: string | number | boolean | null
}