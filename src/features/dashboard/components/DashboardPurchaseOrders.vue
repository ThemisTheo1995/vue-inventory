<!-- src/features/dashboard/components/DashboardPurchaseOrders.vue -->
<template>
  <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col flex-1 max-h-[350px]">
    <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
      <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <FileDown class="w-4 h-4 text-blue-500" />
        Incoming Purchases
      </h2>
    </div>
    <div class="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-2">
      <div v-if="orders.length === 0" class="p-4 text-center text-sm text-slate-500">
        No incoming orders.
      </div>
      <div v-for="po in orders" :key="po.id" class="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
</template>

<script setup lang="ts">
import { FileDown } from 'lucide-vue-next'
import { formatPrice, formatDate, getStatusClass } from '../utils/formatters'

defineProps<{ orders: any[] }>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
</style>
