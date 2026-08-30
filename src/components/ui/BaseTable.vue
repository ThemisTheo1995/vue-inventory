<!-- src/components/ui/BaseTable.vue -->
<template>
  <BaseCard class="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] min-h-[500px] overflow-hidden">
    
    <!-- Toolbar / Search (Conditionally Rendered) -->
    <div 
      v-if="showSearch || $slots['toolbar-title'] || $slots['toolbar-actions']" 
      class="shrink-0 p-4 sm:p-5 border-b border-slate-200/70 dark:border-slate-800/70 bg-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <!-- Optional Title Slot -->
      <div v-if="$slots['toolbar-title']" class="flex items-center gap-2">
        <slot name="toolbar-title" />
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto" :class="{'ml-auto': !$slots['toolbar-title']}">
        <!-- Search Input -->
        <div v-if="showSearch" class="relative w-full sm:w-64 lg:w-80">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg v-if="isSearching" class="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <Search v-else class="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/70 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 dark:focus:border-slate-500 font-medium transition-colors"
          />
        </div>

        <!-- Optional Actions Slot -->
        <slot name="toolbar-actions" />
      </div>
    </div>

    <!-- Data View Wrapper (Scrolling) -->
    <div class="flex-1 overflow-y-auto bg-transparent">
      
      <!-- ================= MOBILE LIST VIEW ================= -->
      <div class="md:hidden flex flex-col divide-y divide-slate-200/70 dark:divide-slate-900">
        <template v-if="isLoading">
          <div v-for="i in 5" :key="'mob-skel-'+i" class="p-4 sm:p-5 animate-pulse space-y-4">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24"></div>
                  <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-16"></div>
                </div>
              </div>
              <div class="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700/50"></div>
            </div>
          </div>
        </template>

        <div v-else-if="!items.length" class="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <slot name="empty-state">
            <EmptyStateContent :is-read-only="isReadOnly" :title="emptyTitle" :description="emptyDescription" :create-text="createButtonText" @create="$emit('create')" />
          </slot>
        </div>
        <template v-else>
          <slot name="mobile-cards" />
        </template>
      </div>

      <!-- ================= DESKTOP TABLE VIEW ================= -->
      <div class="hidden md:block w-full">
        <table class="w-full text-left border-collapse">
          <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800/70">
            <tr>
              <slot name="desktop-headers" />
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200/70 dark:divide-slate-900">
            <!-- Desktop Skeletons -->
            <tr v-if="isLoading" v-for="i in 6" :key="'desk-skel-'+i" class="animate-pulse bg-transparent">
              <td :colspan="columnSpan" class="px-6 py-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
              </td>
            </tr>

            <!-- Desktop Empty State -->
            <tr v-else-if="!items.length" class="bg-transparent">
              <td :colspan="columnSpan" class="py-24 text-center">
                <slot name="empty-state">
                  <EmptyStateContent :is-read-only="isReadOnly" :title="emptyTitle" :description="emptyDescription" :create-text="createButtonText" @create="$emit('create')" />
                </slot>
              </td>
            </tr>

            <!-- Desktop Rows -->
            <template v-else>
              <slot name="desktop-rows" />
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Footer -->
    <div class="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-slate-200/70 dark:border-slate-800/70 bg-transparent">
      <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
        Showing <span class="font-bold text-slate-700 dark:text-slate-300">{{ items.length ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }}</span>
        to <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
        of <span class="font-bold text-slate-700 dark:text-slate-300">{{ totalItems }}</span>
      </p>

      <div v-if="totalPages > 1" class="flex items-center gap-1.5">
        <button
          @click="$emit('prev-page')"
          :disabled="currentPage === 1 || isLoading"
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { h } from "vue"
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-vue-next"
import BaseCard from "@/components/ui/BaseCard.vue"

export interface BaseTableProps {
  items: any[]
  isLoading: boolean
  isReadOnly?: boolean
  showSearch?: boolean
  isSearching?: boolean
  searchQuery?: string
  searchPlaceholder?: string
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  columnSpan: number
  emptyTitle?: string
  emptyDescription?: string
  createButtonText?: string
}

withDefaults(defineProps<BaseTableProps>(), {
  isReadOnly: false,
  showSearch: true,
  isSearching: false,
  searchQuery: '',
  searchPlaceholder: 'Search...'
})

defineEmits(['update:searchQuery', 'create', 'prev-page', 'next-page'])

const EmptyStateContent = (props: { isReadOnly?: boolean; title?: string; description?: string; createText?: string }, { emit }: any) => {
  return h('div', { class: 'flex flex-col items-center justify-center space-y-4' }, [
    h('div', { class: 'flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700' }, [
      h(FileText, { class: 'w-8 h-8 opacity-80' })
    ]),
    h('div', { class: 'text-center' }, [
      h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white' }, props.title || 'No records found'),
      h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto' }, 
        props.isReadOnly 
          ? 'There are currently no items matching your criteria.' 
          : (props.description || 'Get started by creating your first item.')
      )
    ]),
    !props.isReadOnly ? h('button', {
      onClick: () => emit('create'),
      class: 'mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer'
    }, props.createText || 'Create First') : null
  ])
}
EmptyStateContent.emits = ['create']
</script>
