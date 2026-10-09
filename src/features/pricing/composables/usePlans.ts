// src/composables/usePlans.ts
import { ref } from 'vue'
import { billingService } from '@/features/pricing/services/billing.service'
import type { PlanTier } from '@/features/pricing/types/billing-plans.types'

export function usePlans() {
  const plans = ref<PlanTier[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlans = async () => {
    isLoading.value = true
    error.value = null

    try {
      plans.value = await billingService.getPlans()
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred while loading plans'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    plans,
    isLoading,
    error,
    fetchPlans
  }
}
