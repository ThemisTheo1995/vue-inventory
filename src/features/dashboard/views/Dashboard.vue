<!-- src/views/Dashboard.vue -->
<template>
  <div class="space-y-6 lg:space-y-8 pb-20 relative min-h-full max-w-[1600px] mx-auto">
    
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="handleExport"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="isLoading || isExporting"
        >
          <div v-if="isExporting" class="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          <Download v-else class="w-4 h-4" />
          <span class="hidden sm:inline">{{ isExporting ? 'Exporting...' : 'Export Report' }}</span>
        </button>
      </div>
    </header>

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

    <template v-else-if="!error">
      <!-- KPI Stats Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="stat in quickStats" :key="stat.title" class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div :class="`p-2.5 rounded-xl ${stat.bgColor} ${stat.textColor}`">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <span v-if="stat.trend" :class="['text-xs font-bold px-2 py-1 rounded-full', stat.trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400']">
              {{ stat.trend }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.title }}</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1 truncate" :title="stat.value">{{ stat.value }}</h3>
          </div>
        </div>
      </section>

      <!-- Revenue Graph Section -->
      <section class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <ChartColumn class="w-5 h-5 text-brand-500" />
              Revenue Overview
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Last 30 Days Performance</p>
          </div>
        </div>
        <!-- Chart Canvas Container -->
        <div class="relative w-full h-64 sm:h-72">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </section>

      <!-- Main Content Grid -->
      <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <!-- Left Column: Recent Sell Orders -->
        <div class="xl:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-slate-800 z-10">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileUp class="w-4 h-4 text-brand-500" />
                Recent Sell Orders
              </h2>
              <router-link to="/sell-orders" class="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                View All
              </router-link>
            </div>
            
            <!-- Constrained Table Wrapper -->
            <div class="overflow-y-auto max-h-[400px] custom-scrollbar relative">
              <table class="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                <thead class="sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-500 dark:text-slate-400 z-10 shadow-sm">
                  <tr>
                    <th class="px-5 py-3 font-semibold">SO Number</th>
                    <th class="px-5 py-3 font-semibold">Date</th>
                    <th class="px-5 py-3 font-semibold">Status</th>
                    <th class="px-5 py-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  <tr v-if="mappedSellOrders.length === 0">
                    <td colspan="4" class="px-5 py-8 text-center text-slate-500">No recent sell orders found.</td>
                  </tr>
                  <tr v-for="order in mappedSellOrders" :key="order.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td class="px-5 py-3.5 font-medium">{{ order.so_number }}</td>
                    <td class="px-5 py-3.5 text-slate-500 dark:text-slate-400">{{ formatDate(order.created_at) }}</td>
                    <td class="px-5 py-3.5">
                      <span :class="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-5 py-3.5 text-right font-semibold">{{ formatPrice(order.total_amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="(dashboardData?.recent_sell_orders?.length ?? 0) > MAX_DISPLAY_RECORDS" class="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800/60">
              <span class="text-xs text-slate-500">Showing latest {{ MAX_DISPLAY_RECORDS }} records. View all to see more.</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Low Stock Alerts & Quick Actions -->
        <div class="space-y-6 flex flex-col">
          
          <!-- Low Stock Alerts -->
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col flex-1 max-h-[350px]">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle class="w-4 h-4 text-amber-500" />
                Low Stock Alerts
              </h2>
            </div>
            
            <!-- Constrained List Wrapper -->
            <div class="p-2 overflow-y-auto custom-scrollbar flex-1">
              <div v-if="mappedLowStock.length === 0" class="p-4 text-center text-sm text-slate-500">
                Stock levels are looking good!
              </div>
              <div v-for="item in mappedLowStock" :key="item.item_id" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center gap-3 min-w-0 pr-4">
                  <div class="w-10 h-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                    <Package class="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate" :title="item.title">{{ item.title }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate" :title="item.sku">{{ item.sku }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-black text-amber-600 dark:text-amber-400">{{ item.quantity_available }} left</p>
                  <button class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mt-0.5">
                    Restock
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Purchase Orders -->
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col flex-1 max-h-[350px]">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileDown class="w-4 h-4 text-blue-500" />
                Incoming Purchases
              </h2>
            </div>
            
            <!-- Constrained List Wrapper -->
            <div class="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-2">
              <div v-if="mappedPurchaseOrders.length === 0" class="p-4 text-center text-sm text-slate-500">
                No incoming orders.
              </div>
              <div v-for="po in mappedPurchaseOrders" :key="po.id" class="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-900 dark:text-white truncate" :title="po.po_number">{{ po.po_number }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ formatDate(po.created_at) }} • {{ formatPrice(po.total_amount) }}</p>
                </div>
                <span :class="getStatusClass(po.status, true)">
                  {{ po.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { 
  TrendingUp, 
  FileUp, 
  FileDown, 
  Package, 
  AlertCircle, 
  Download, 
  ChartColumn
} from 'lucide-vue-next'

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  type ChartConfiguration
} from 'chart.js'

import { dashboardService } from '../services/dashboard.service'
import type { DashboardResponse } from '../types/dashboard.types'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
)

const route = useRoute()

// Constants
const CURRENCY_SYMBOL = "GBP"
const LOCALE = "en-GB"
const MAX_DISPLAY_RECORDS = 50

// State
const dashboardData = ref<DashboardResponse | null>(null)
const isLoading = ref(true)
const isExporting = ref(false)
const error = ref<string | null>(null)

// Formatters
const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_SYMBOL
  }).format(priceInCents / 100)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const getStatusClass = (status: string, small = false) => {
  const base = small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
  const common = `${base} font-bold rounded-full border whitespace-nowrap`
  
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
    case 'FULLFILLED':
      return `${common} bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400`
    case 'CONFIRMED':
      return `${common} bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400`
    case 'CANCELLED':
      return `${common} bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400`
    case 'DRAFT':
    default:
      return `${common} bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`
  }
}

// Computed Data (Safely sliced for DOM performance)
const quickStats = computed(() => {
  if (!dashboardData.value?.kpis) return []
  const kpis = dashboardData.value.kpis
  return [
    {
      title: 'Total Revenue',
      value: formatPrice(kpis.total_revenue || 0),
      trend: '+12%',
      trendUp: true,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Total Sell Orders',
      value: (kpis.total_sell_orders || 0).toLocaleString(),
      trend: '+5%',
      trendUp: true,
      icon: FileUp,
      bgColor: 'bg-brand-50 dark:bg-brand-500/10',
      textColor: 'text-brand-600 dark:text-brand-400'
    },
    {
      title: 'Total Purchase Orders',
      value: (kpis.total_purchase_orders || 0).toLocaleString(),
      trend: '-2%',
      trendUp: false,
      icon: FileDown,
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Low Stock Alerts',
      value: (kpis.items_low_stock || 0).toLocaleString(),
      trend: '',
      trendUp: false,
      icon: Package,
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ]
})

const mappedSellOrders = computed(() => (dashboardData.value?.recent_sell_orders || []).slice(0, MAX_DISPLAY_RECORDS))
const mappedPurchaseOrders = computed(() => (dashboardData.value?.incoming_purchase_orders || []).slice(0, MAX_DISPLAY_RECORDS))
const mappedLowStock = computed(() => (dashboardData.value?.low_stock_alerts || []).slice(0, MAX_DISPLAY_RECORDS))

// Chart Implementation
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const initChart = () => {
  if (!chartCanvas.value || !dashboardData.value?.revenue_chart?.length) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  if (chartInstance) chartInstance.destroy()

  const chartData = dashboardData.value.revenue_chart
  const labels = chartData.map(d => formatDate(String(d.date)))
  const data = chartData.map(d => d.revenue / 100)

  const brandGradient = ctx.createLinearGradient(0, 0, 0, 250)
  brandGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
  brandGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#3b82f6',
        borderWidth: 3,
        backgroundColor: brandGradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false }, 
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          usePointStyle: true,
          callbacks: {
            label: (context) => ` Revenue: £${(context.parsed.y ?? 0).toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11, weight: 600 } }
        },
        y: {
          border: { display: false },
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, weight: 600 },
            callback: (value) => `£${Number(value).toLocaleString()}`
          }
        }
      }
    }
  }

  chartInstance = new Chart(ctx, config)
}

// API Calls
const fetchDashboardInfo = async () => {
  error.value = null
  isLoading.value = true
  try {
    const workspaceId = (route.params.workspaceId as string)
    dashboardData.value = await dashboardService.get(workspaceId)
    
    await nextTick()
    requestAnimationFrame(() => initChart())
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err)
    error.value = "Failed to load dashboard data. Please check your connection."
  } finally {
    isLoading.value = false
  }
}

const handleExport = async () => {
  isExporting.value = true
  try {
    // Simulate export delay or call exportService
    await new Promise(resolve => setTimeout(resolve, 1500))
  } finally {
    isExporting.value = false
  }
}

onMounted(() => fetchDashboardInfo())

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
/* Optional Custom Scrollbar for inner table/list scroll containers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
