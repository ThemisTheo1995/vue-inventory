<!-- src/components/ui/BaseTable.vue -->
<template>
  <BaseCard class="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] min-h-[500px] overflow-hidden px-0">
    
    <!-- Toolbar Component -->
    <TableToolbar
      :show-search="showSearch"
      :is-searching="isSearching"
      :search-query="searchQuery"
      :search-placeholder="searchPlaceholder"
      :filters="filters"
      :selected-filters="selectedFilters"
      @update:search-query="$emit('update:searchQuery', $event)"
      @update:selected-filters="$emit('update:selectedFilters', $event)"
      @filter-change="$emit('filter-change', $event)"
      @reset="$emit('reset')"
    >
      <template v-if="$slots['toolbar-title']" #toolbar-title>
        <slot name="toolbar-title" />
      </template>
      <template v-if="$slots['toolbar-filters']" #toolbar-filters>
        <slot name="toolbar-filters" />
      </template>
      <template v-if="$slots['toolbar-actions']" #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>
    </TableToolbar>

    <!-- Data View Wrapper -->
    <div class="flex-1 overflow-y-auto bg-transparent">
      
      <!-- MOBILE LIST VIEW -->
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
            <div class="flex flex-col items-center justify-center space-y-4">
              <div class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                <FileText class="w-8 h-8 opacity-80" />
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ emptyTitle || 'No records found' }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {{ isReadOnly ? 'There are currently no items matching your criteria.' : (emptyDescription || 'Get started by creating your first item.') }}
                </p>
              </div>
              <button
                v-if="!isReadOnly"
                @click="$emit('create')"
                class="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                {{ createButtonText || 'Create First' }}
              </button>
            </div>
          </slot>
        </div>
        <template v-else>
          <slot name="mobile-cards" />
        </template>
      </div>

      <!-- DESKTOP TABLE VIEW -->
      <div class="hidden md:block w-full">
        <table class="w-full text-left border-collapse">
          <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800/70">
            <tr>
              <slot name="desktop-headers" />
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200/70 dark:divide-slate-900">
            <tr v-if="isLoading" v-for="i in 6" :key="'desk-skel-'+i" class="animate-pulse bg-transparent">
              <td :colspan="columnSpan" class="px-6 py-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
              </td>
            </tr>

            <tr v-else-if="!items.length" class="bg-transparent">
              <td :colspan="columnSpan" class="py-24 text-center">
                <slot name="empty-state">
                  <div class="flex flex-col items-center justify-center space-y-4">
                    <div class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                      <FileText class="w-8 h-8 opacity-80" />
                    </div>
                    <div class="text-center">
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ emptyTitle || 'No records found' }}</h3>
                      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        {{ isReadOnly ? 'There are currently no items matching your criteria.' : (emptyDescription || 'Get started by creating your first item.') }}
                      </p>
                    </div>
                    <button
                      v-if="!isReadOnly"
                      @click="$emit('create')"
                      class="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {{ createButtonText || 'Create First' }}
                    </button>
                  </div>
                </slot>
              </td>
            </tr>

            <template v-else>
              <slot name="desktop-rows" />
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Footer Component -->
    <TablePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :items-length="items.length"
      :is-loading="isLoading"
      @prev-page="$emit('prev-page')"
      @next-page="$emit('next-page')"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import { FileText } from "lucide-vue-next"
import BaseCard from "@/components/ui/BaseCard.vue"
import TableToolbar from "./TableToolbar.vue"
import TablePagination from "./TablePagination.vue"

export interface TableFilterOption {
  label: string
  value: string | number | boolean
}

export interface TableFilter {
  key: string
  type?: 'select' | 'range'
  label?: string
  placeholder?: string
  options?: TableFilterOption[]
  min?: number
  max?: number
  step?: number
  prefix?: string
}

export interface BaseTableProps {
  items: any[]
  isLoading: boolean
  isReadOnly?: boolean
  showSearch?: boolean
  isSearching?: boolean
  searchQuery?: string
  searchPlaceholder?: string
  filters?: TableFilter[]
  selectedFilters?: Record<string, any>
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
  searchPlaceholder: 'Search...',
  filters: () => [],
  selectedFilters: () => ({})
})

defineEmits([
  'update:searchQuery', 
  'update:selectedFilters', 
  'filter-change', 
  'reset',
  'create', 
  'prev-page', 
  'next-page'
])
</script>

<style scoped>
/* Scoped styles can remain lean or moved if needed */
</style>
