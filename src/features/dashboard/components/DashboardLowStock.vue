<!-- src/features/dashboard/components/DashboardLowStock.vue -->
<template>
  <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm flex flex-col flex-1 max-h-[350px]">
    <div class="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
      <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-amber-500" />
        Low Stock Alerts
      </h2>
    </div>
    <div class="p-2 overflow-y-auto custom-scrollbar flex-1">
      <div v-if="alerts.length === 0" class="p-4 text-center text-sm text-slate-500">
        Stock levels are looking good!
      </div>
      <div v-for="item in alerts" :key="item.item_id" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
          <router-link 
            :to="{ name: 'item-details', params: { workspaceId, id: item.item_id || item.id } }"
            class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mt-0.5 inline-block cursor-pointer"
          >
            Restock
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AlertCircle, Package } from 'lucide-vue-next'

defineProps<{ alerts: any[] }>()

const route = useRoute()
const workspaceId = computed(() => route.params.workspaceId as string)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
</style>
