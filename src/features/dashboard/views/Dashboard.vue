<!-- src/features/dashboard/views/Dashboard.vue -->
<template>
  <div class="space-y-6 lg:space-y-8 pb-20 relative min-h-full max-w-[1600px] mx-auto">
    
    <DashboardHeader :is-loading="isLoading" />

    <!-- Error State -->
    <div v-if="error" class="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3 text-rose-700 dark:text-rose-400">
        <AlertCircle class="w-5 h-5 flex-shrink-0" />
        <p class="text-sm font-medium">{{ error }}</p>
      </div>
      <button @click="fetchDashboardInfo" class="text-sm font-bold text-rose-700 dark:text-rose-400 hover:underline">
        Try Again
      </button>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else-if="!error && dashboardData">
      <DashboardKpis :kpis="dashboardData.kpis" />

      <DashboardRevenueChart :chart-data="dashboardData.revenue_chart" />

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-2 space-y-6">
          <DashboardRecentSellOrders 
            :orders="mappedSellOrders" 
            :workspace-id="workspaceId"
            :has-more-records="(dashboardData.recent_sell_orders?.length ?? 0) > MAX_DISPLAY_RECORDS"
          />
        </div>

        <div class="space-y-6 flex flex-col">
          <DashboardLowStock :alerts="mappedLowStock" />
          <DashboardPurchaseOrders :orders="mappedPurchaseOrders" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'

import DashboardHeader from '../components/DashboardHeader.vue'
import DashboardKpis from '../components/DashboardKpis.vue'
import DashboardRevenueChart from '../components/DashboardRevenueChart.vue'
import DashboardRecentSellOrders from '../components/DashboardRecentSellOrders.vue'
import DashboardLowStock from '../components/DashboardLowStock.vue'
import DashboardPurchaseOrders from '../components/DashboardPurchaseOrders.vue'

import { dashboardService } from '../services/dashboard.service'
import type { DashboardResponse } from '../types/dashboard.types'

const route = useRoute()
const workspaceId = route.params.workspaceId as string
const MAX_DISPLAY_RECORDS = 50

const dashboardData = ref<DashboardResponse | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const mappedSellOrders = computed(() => (dashboardData.value?.recent_sell_orders || []).slice(0, MAX_DISPLAY_RECORDS))
const mappedPurchaseOrders = computed(() => (dashboardData.value?.incoming_purchase_orders || []).slice(0, MAX_DISPLAY_RECORDS))
const mappedLowStock = computed(() => (dashboardData.value?.low_stock_alerts || []).slice(0, MAX_DISPLAY_RECORDS))

const fetchDashboardInfo = async () => {
  error.value = null
  isLoading.value = true
  try {
    dashboardData.value = await dashboardService.get(workspaceId)
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err)
    error.value = "Failed to load dashboard data. Please check your connection."
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDashboardInfo())
</script>
