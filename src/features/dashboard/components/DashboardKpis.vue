<!-- src/features/dashboard/components/DashboardKpis.vue -->
<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    <div v-for="stat in stats" :key="stat.title" class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, FileUp, FileDown, Package } from 'lucide-vue-next'
import { formatPrice } from '../utils/formatters'
import type { DashboardResponse } from '../types/dashboard.types'

const props = defineProps<{
  kpis: DashboardResponse['kpis']
}>()

const stats = computed(() => [
  {
    title: 'Total Revenue',
    value: formatPrice(props.kpis.total_revenue || 0),
    trend: '+12%',
    trendUp: true,
    icon: TrendingUp,
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    title: 'Total Sell Orders',
    value: (props.kpis.total_sell_orders || 0).toLocaleString(),
    trend: '+5%',
    trendUp: true,
    icon: FileUp,
    bgColor: 'bg-brand-50 dark:bg-brand-500/10',
    textColor: 'text-brand-600 dark:text-brand-400'
  },
  {
    title: 'Total Purchase Orders',
    value: (props.kpis.total_purchase_orders || 0).toLocaleString(),
    trend: '-2%',
    trendUp: false,
    icon: FileDown,
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Low Stock Alerts',
    value: (props.kpis.items_low_stock || 0).toLocaleString(),
    trend: '',
    trendUp: false,
    icon: Package,
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400'
  }
])
</script>
