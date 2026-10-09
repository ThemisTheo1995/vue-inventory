import { apiFetch } from '@/utils/apiFetch'
import type { PlanTier } from '@/features/pricing/types/billing-plans.types'

class BillingService {
  private cachedPlans: PlanTier[] | null = null
  private fetchPromise: Promise<PlanTier[]> | null = null

  /**
   * Fetches available billing plans (Public endpoint).
   * Uses in-memory caching to prevent duplicate API calls across components.
   */
  async getPlans(): Promise<PlanTier[]> {
    if (this.cachedPlans) {
      return this.cachedPlans
    }

    if (this.fetchPromise) {
      return this.fetchPromise
    }

    this.fetchPromise = this.doFetchPlans()
    
    try {
      this.cachedPlans = await this.fetchPromise
      return this.cachedPlans
    } finally {
      this.fetchPromise = null
    }
  }

  private async doFetchPlans(): Promise<PlanTier[]> {
    const response = await apiFetch('/plans', {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch billing plans')
    }

    return response.json()
  }
}

export const billingService = new BillingService()
