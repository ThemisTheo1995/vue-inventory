<template>
  <div
    :class="[
      'flex items-center rounded-xl border transition-all duration-200 select-none',
      collapsed
        ? 'justify-center p-2 border-white dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50'
        : 'gap-3 p-3 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'
    ]"
    :title="collapsed ? `API: ${apiPercentage}% | Listings: ${listingsPercentage}%` : undefined"
  >
    <div class="relative flex shrink-0 items-center justify-center w-10 h-10">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          class="text-slate-100 dark:text-slate-700/60"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          class="text-emerald-500 transition-all duration-1000 ease-out"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
          :stroke-dasharray="100.53"
          :stroke-dashoffset="100.53 - (apiRatio * 100.53)"
          stroke-linecap="round"
        />

        <circle
          cx="20"
          cy="20"
          r="10"
          class="text-slate-100 dark:text-slate-700/60"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r="10"
          class="text-brand-500 transition-all duration-1000 ease-out"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
          :stroke-dasharray="62.83"
          :stroke-dashoffset="62.83 - (listingsRatio * 62.83)"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <div v-if="!collapsed" class="flex flex-col flex-1 min-w-0">
      <span class="text-[11px] font-bold text-slate-900 dark:text-slate-400 tracking-wider uppercase">
        Usage Metrics
      </span>

      <div class="flex flex-col mt-0.5 gap-0.5">
        <div class="flex items-center justify-between text-[10px] font-medium text-slate-500">
          <span class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            API
          </span>
          <span class="text-slate-700 dark:text-slate-300">{{ apiPercentage }}%</span>
        </div>

        <div class="flex items-center justify-between text-[10px] font-medium text-slate-500">
          <span class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
            Listings
          </span>
          <span class="text-slate-700 dark:text-slate-300">{{ listingsPercentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/utils/apiFetch'
import type { UsageResponse } from '../types'

defineProps<{ collapsed?: boolean }>()

const route = useRoute()
const workspaceId = computed(() => route.params.workspaceId as string)

const usage = ref({
  api_used: 0,
  api_total: 1,
  listings_used: 0,
  listings_total: 1
})

let pollingInterval: ReturnType<typeof setInterval> | null = null

const fetchUsage = async () => {
    if (!workspaceId.value) return

    const storedWorkspaceId = localStorage.getItem('workspace_id')
    if (storedWorkspaceId && storedWorkspaceId !== workspaceId.value) {
        console.warn('Workspace context mismatch: Route ID vs Storage ID')
    }

    try {
        const response = await apiFetch(
        `/${workspaceId.value}/usage`,
        { method: 'GET'},
        false
        )

        const data = await response.json() as UsageResponse
        const plans = data.plans ?? {}

        let apiUsed = 0
        let apiTotal = 0
        let listingsUsed = 0
        let listingsTotal = 0

        for (const plan of Object.values(plans)) {
        const metrics = plan.metrics ?? {}

        if (metrics.api_request) {
            apiUsed += metrics.api_request.used ?? 0
            apiTotal += metrics.api_request.total ?? 0
        }

        if (metrics.listings_request) {
            listingsUsed += metrics.listings_request.used ?? 0
            listingsTotal += metrics.listings_request.total ?? 0
        }
        }

        usage.value = {
        api_used: apiUsed,
        api_total: apiTotal || 1,
        listings_used: listingsUsed,
        listings_total: listingsTotal || 1
        }
    } catch (err) {
        console.error('Failed to fetch usage metrics', err)
    }
}

// 1. Fetch immediately when the workspace ID changes
watch(
  workspaceId,
  (newId) => {
    if (newId) fetchUsage()
  },
  { immediate: true }
)

// 2. Start polling every 5 mins when the component mounts
onMounted(() => {
  pollingInterval = setInterval(() => {
    fetchUsage()
  }, 60000 * 5)
})

// 3. Clean up the interval when the component is destroyed
onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})

const apiRatio = computed(() =>
  Math.min(Math.max(usage.value.api_used / usage.value.api_total, 0), 1)
)

const listingsRatio = computed(() =>
  Math.min(Math.max(usage.value.listings_used / usage.value.listings_total, 0), 1)
)

const apiPercentage = computed(() => Math.round(apiRatio.value * 100))
const listingsPercentage = computed(() => Math.round(listingsRatio.value * 100))
</script>
