<!-- src/features/dashboard/components/DashboardHeader.vue -->
<template>
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
      <AsyncButton 
        :action="handleExport"
        class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm cursor-pointer"
        :disabled="isLoading"
      >
        <Download class="w-4 h-4 inline-flex" />
        <span class="hidden sm:inline">Export Report</span>
      </AsyncButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import AsyncButton from "@/components/layout/AsyncButton.vue"

defineProps<{ isLoading: boolean }>()

const handleExport = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
}
</script>
