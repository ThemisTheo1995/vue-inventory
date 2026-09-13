<!-- src/features/dashboard/components/DashboardRecentSellOrders.vue -->
<template>
  <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
    <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-slate-800 z-10">
      <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <FileUp class="w-4 h-4 text-brand-500" />
        Recent Sell Orders
      </h2>
      <router-link :to="{ name: 'sell-orders', params: { workspaceId } }" class="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
        View All
      </router-link>
    </div>
    
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
          <tr v-if="orders.length === 0">
            <td colspan="4" class="px-5 py-8 text-center text-slate-500">No recent sell orders found.</td>
          </tr>
          <router-link
            v-for="order in orders"
            :key="order.id"
            :to="{ name: 'sell-order-details', params: { workspaceId, id: order.id } }"
            custom
            v-slot="{ href, navigate }"
          >
            <tr @click="navigate" @auxclick.middle="navigate" :href="href" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
              <td class="px-5 py-3.5 font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {{ order.so_number }}
              </td>
              <td class="px-5 py-3.5 text-slate-500 dark:text-slate-400">{{ formatDate(order.created_at) }}</td>
              <td class="px-5 py-3.5"><span :class="getStatusClass(order.status)">{{ order.status }}</span></td>
              <td class="px-5 py-3.5 text-right font-semibold">{{ formatPrice(order.total_amount) }}</td>
            </tr>
          </router-link>
        </tbody>
      </table>
    </div>
    <div v-if="hasMoreRecords" class="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800/60">
      <span class="text-xs text-slate-500">Showing latest records. View all to see more.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileUp } from 'lucide-vue-next'
import { formatPrice, formatDate, getStatusClass } from '../utils/formatters'

defineProps<{
  orders: any[]
  workspaceId: string
  hasMoreRecords: boolean
}>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
</style>
