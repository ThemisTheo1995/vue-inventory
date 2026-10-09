export interface PlanTierLimits {
  listings: string
  api: string
}

export interface PlanTier {
  id: string
  name: string
  tagline: string
  price: number | string
  icon: string
  limits: PlanTierLimits
  features: string[]
}
