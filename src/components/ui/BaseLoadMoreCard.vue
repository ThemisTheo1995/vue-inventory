<!-- src/components/ui/BaseLoadMoreCard.vue -->
<template>
  <BaseCard class="flex-1 flex flex-col overflow-hidden border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-0">
    <!-- Header -->
    <div class="shrink-0 p-4 sm:p-5 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">
          {{ title }}
        </h3>
        <span v-if="total > 0" class="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
          {{ total }} Total
        </span>
      </div>
      <slot name="actions" />
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 min-h-[300px] sm:min-h-[350px]">
      
      <!-- Initial Loading State -->
      <div v-if="isLoading && page === 1" class="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <slot name="skeleton">
          <div v-for="i in 4" :key="i" class="animate-pulse flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
            <div class="flex-1 space-y-2 min-w-0">
              <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3"></div>
              <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/4"></div>
            </div>
            <div class="w-14 sm:w-16 h-7 sm:h-8 rounded-lg bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
          </div>
        </slot>
      </div>

      <!-- Empty State -->
      <section v-else-if="!items.length" class="h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center min-h-[300px] sm:min-h-[350px]">
        <slot name="empty">
          <div class="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
            <PackageOpen class="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 opacity-80" />
          </div>
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">{{ emptyTitle }}</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {{ emptyDescription }}
          </p>
        </slot>
      </section>

      <!-- Data List with Load More -->
      <div v-else class="p-3 sm:p-5">
        <TransitionGroup name="list" tag="div" class="space-y-2.5 sm:space-y-3">
          <div v-for="(item, index) in items" :key="item.id || index">
            <slot name="item" :item="item" :index="index" />
          </div>
        </TransitionGroup>

        <!-- Dynamic Load More Button -->
        <div v-if="hasMore" class="mt-5 sm:mt-6 flex justify-center pb-2 sm:pb-4">
          <AsyncButton
            :action="onLoadMore"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 cursor-pointer"
          >
            {{ loadMoreText }}
          </AsyncButton>
        </div>
        
        <div v-else-if="items.length > 0" class="mt-6 sm:mt-8 text-center pb-2 sm:pb-4">
          <p class="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
            {{ endMessage }}
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { PackageOpen } from 'lucide-vue-next'

withDefaults(defineProps<{
  items: any[]
  isLoading?: boolean
  hasMore?: boolean
  total?: number
  page?: number
  title?: string
  emptyTitle?: string
  emptyDescription?: string
  loadMoreText?: string
  endMessage?: string
}>(), {
  isLoading: false,
  hasMore: false,
  total: 0,
  page: 1,
  title: 'History',
  emptyTitle: 'No Records Found',
  emptyDescription: 'When records occur, they will be securely registered here.',
  loadMoreText: 'Load More Records',
  endMessage: "You've reached the end of the history"
})

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

const onLoadMore = async () => {
  emit('load-more')
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
