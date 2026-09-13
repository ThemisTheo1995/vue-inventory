<!-- src/components/ui/TablePagination.vue -->
<template>
  <div class="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-slate-200/70 dark:border-slate-800/70 bg-transparent">
    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
      Showing <span class="font-bold text-slate-700 dark:text-slate-300">{{ itemsLength ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }}</span>
      to <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
      of <span class="font-bold text-slate-700 dark:text-slate-300">{{ totalItems }}</span>
    </p>

    <div v-if="totalPages > 1" class="flex items-center gap-1.5">
      <button
        @click="$emit('prev-page')"
        :disabled="currentPage === 1 || isLoading"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <div class="px-2 hidden sm:block">
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ currentPage }}</span>
        <span class="text-xs font-medium text-slate-400 mx-1">/</span>
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ totalPages }}</span>
      </div>
      <button
        @click="$emit('next-page')"
        :disabled="currentPage === totalPages || isLoading"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"

defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  itemsLength: number
  isLoading: boolean
}>()

defineEmits(['prev-page', 'next-page'])
</script>
