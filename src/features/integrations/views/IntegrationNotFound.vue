<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
      <LayoutGrid class="w-8 h-8 text-slate-400" />
    </div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">Select an Integration</h2>
    <p class="text-slate-500 max-w-xs mt-2">
      Please select a platform from the dashboard to view specific metrics and sync status.
    </p>
    <router-link 
      to="/" 
      class="mt-6 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-sm"
    >
      Back to Dashboard
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { LayoutGrid } from 'lucide-vue-next'
</script>
