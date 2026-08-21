<template>
  <div class="space-y-6 lg:space-y-8 pb-20 relative min-h-full">
    
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
        <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm" :disabled="isLoading">
          <Download class="w-4 h-4" />
          <span class="hidden sm:inline">Export Report</span>
        </button>
      </div>
    </header>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else>
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
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.title }}</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ stat.value }}</h3>
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
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
              Gross Revenue
            </div>
          </div>
        </div>

        <!-- Chart Canvas Container -->
        <div class="relative w-full h-64 sm:h-72">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </section>

      <!-- Main Content Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column: Recent Sell Orders -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col h-full">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileUp class="w-4 h-4 text-brand-500" />
                Recent Sell Orders
              </h2>
              <router-link to="/sell-orders" class="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                View All
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm whitespace-nowrap">
                <thead class="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 dark:text-slate-400">
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
          </div>
        </div>

        <!-- Right Column: Low Stock Alerts & Quick Actions -->
        <div class="space-y-6">
          
          <!-- Low Stock Alerts -->
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle class="w-4 h-4 text-amber-500" />
                Low Stock Alerts
              </h2>
            </div>
            <div class="p-2">
              <div v-if="mappedLowStock.length === 0" class="p-4 text-center text-sm text-slate-500">
                Stock levels are looking good!
              </div>
              <div v-for="item in mappedLowStock" :key="item.item_id" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                    <Package class="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]" :title="item.title">{{ item.title }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.sku }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-amber-600 dark:text-amber-400">{{ item.quantity_available }} left</p>
                  <button class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mt-0.5">
                    Restock
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Purchase Orders -->
          <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800/60">
              <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileDown class="w-4 h-4 text-blue-500" />
                Incoming Purchases
              </h2>
            </div>
            <div class="p-5 space-y-4">
              <div v-if="mappedPurchaseOrders.length === 0" class="text-center text-sm text-slate-500">
                No incoming orders.
              </div>
              <div v-for="po in mappedPurchaseOrders" :key="po.id" class="flex items-center gap-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ po.po_number }}</p>
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

    <!-- Dynamic Backdrop when Maximized -->
    <transition name="fade">
      <div 
        v-if="isNotesOpen && isMaximized" 
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
        @click="isMaximized = false"
      ></div>
    </transition>

    <!-- Floating / Maximized Notes Widget Container -->
    <div 
      :class="[
        'fixed z-50 transition-all duration-300 ease-in-out flex flex-col items-end',
        isMaximized 
          ? 'inset-4 sm:inset-10' 
          : 'bottom-6 right-6'
      ]"
    >
      <!-- Notes Panel -->
      <transition name="slide-up">
        <div 
          v-if="isNotesOpen" 
          :class="[
            'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out',
            isMaximized 
              ? 'w-full h-full' 
              : 'w-80 sm:w-96 mb-4 h-72 sm:h-80'
          ]"
        >
          <!-- Header -->
          <div class="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center select-none">
            <div class="flex items-center gap-2 cursor-pointer" @click="isMaximized = !isMaximized">
              <PenLine class="w-4 h-4 text-brand-500" />
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Quick Notes</h3>
              <span class="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium ml-1">
                {{ isMaximized ? 'Expanded' : 'Compact' }}
              </span>
            </div>
            
            <div class="flex items-center gap-1">
              <button 
                @click="isMaximized = !isMaximized" 
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                :title="isMaximized ? 'Restore' : 'Maximize'"
              >
                <Minimize2 v-if="isMaximized" class="w-4 h-4" />
                <Maximize2 v-else class="w-4 h-4" />
              </button>
              <button 
                @click="closeNotes" 
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                title="Close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Body -->
          <div class="p-0 flex-1 relative flex flex-col">
            <textarea 
              v-model="notesContent"
              placeholder="Jot down quick reminders, draft order IDs, or temporary details here..." 
              class="w-full flex-1 p-4 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none outline-none focus:ring-0 border-none"
            ></textarea>
            
            <div class="p-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
              <span>{{ notesContent.length }} characters</span>
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" v-if="notesContent.length > 0" />
                {{ notesContent.length > 0 ? 'Saved locally' : 'Auto-saves as you type' }}
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- FAB Toggle Button -->
      <button 
        v-if="!isMaximized"
        @click="toggleNotes"
        :class="[
          'flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95',
          isNotesOpen 
            ? 'bg-slate-800 dark:bg-slate-700 text-white' 
            : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30'
        ]"
      >
        <transition name="fade" mode="out-in">
          <X v-if="isNotesOpen" class="w-5 h-5" />
          <div v-else class="relative">
            <StickyNote class="w-5 h-5" />
            <span v-if="notesContent.length > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-brand-500 rounded-full"></span>
          </div>
        </transition>
      </button>
    </div>

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
  Plus, 
  PenLine, 
  X, 
  CheckCircle2, 
  StickyNote,
  ChartColumn,
  Maximize2,
  Minimize2
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

// Register Chart.js modules
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

const CURRENCY_SYMBOL = "GBP"
const LOCALE = "en-GB"

// Data State
const dashboardData = ref<DashboardResponse | null>(null)
const isLoading = ref(true)

// Floating Notes State
const isNotesOpen = ref(false)
const isMaximized = ref(false)
const notesContent = ref('')

const toggleNotes = () => {
  isNotesOpen.value = !isNotesOpen.value
  if (!isNotesOpen.value) isMaximized.value = false
}

const closeNotes = () => {
  isNotesOpen.value = false
  isMaximized.value = false
}

// Helpers
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
  const common = `${base} font-bold rounded-full border`
  
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'FULLFILLED':
      return `${common} bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400`
    case 'CONFIRMED':
    case 'DRAFT':
    case 'CANCELLED':
      return `${common} bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400`
    default:
      return `${common} bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400`
  }
}

// Computed Data Mappings
const quickStats = computed(() => {
  if (!dashboardData.value) return []
  const kpis = dashboardData.value.kpis
  return [
    {
      title: 'Total Revenue',
      value: formatPrice(kpis.total_revenue),
      trend: 'TBC',
      trendUp: true,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Total Sell Orders',
      value: kpis.total_sell_orders.toLocaleString(),
      trend: 'TBC',
      trendUp: true,
      icon: FileUp,
      bgColor: 'bg-brand-50 dark:bg-brand-500/10',
      textColor: 'text-brand-600 dark:text-brand-400'
    },
    {
      title: 'Total Purchase Orders',
      value: kpis.total_purchase_orders.toLocaleString(),
      trend: 'TBC',
      trendUp: false,
      icon: FileDown,
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Low Stock Alerts',
      value: kpis.items_low_stock.toLocaleString(),
      trend: 'TBC',
      trendUp: false,
      icon: Package,
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ]
})

const mappedSellOrders = computed(() => dashboardData.value?.recent_sell_orders || [])
const mappedPurchaseOrders = computed(() => dashboardData.value?.incoming_purchase_orders || [])
const mappedLowStock = computed(() => dashboardData.value?.low_stock_alerts || [])

// Chart Implementation
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const initChart = () => {
  if (!chartCanvas.value || !dashboardData.value?.revenue_chart) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const chartData = dashboardData.value.revenue_chart
  const labels = chartData.map(d => formatDate(String(d.date)))
  // d.revenue is 320000 (cents/pence), divide by 100 to get £3,200
  const data = chartData.map(d => d.revenue / 100)

  const brandGradient = ctx.createLinearGradient(0, 0, 0, 250)
  brandGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
  brandGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
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
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false }, 
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              const val = context.parsed.y ?? 0;
              return ` Revenue: £${val.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, weight: 600 }
          }
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

const fetchDashboardInfo = async () => {
  try {
    isLoading.value = true
    const workspaceId = (route.params.workspaceId as string)
    
    dashboardData.value = await dashboardService.get(workspaceId)
    
    await nextTick()

    requestAnimationFrame(() => {
      initChart()
    })
    
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardInfo()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
