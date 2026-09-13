<!-- src/components/ui/TableToolbar.vue -->
<template>
  <div 
    v-if="showSearch || filters?.length || $slots['toolbar-filters'] || $slots['toolbar-title'] || $slots['toolbar-actions']" 
    class="shrink-0 p-4 sm:p-5 sm:pt-0 pt-0 border-b border-slate-200/70 dark:border-slate-800/70 bg-transparent flex flex-col sm:flex-row sm:items-start justify-between gap-4"
  >
    <!-- Optional Title Slot -->
    <div v-if="$slots['toolbar-title']" class="flex items-center gap-2 pt-1.5">
      <slot name="toolbar-title" />
    </div>

    <!-- Controls Area (Search + Filters + Actions) -->
    <div class="flex flex-col gap-1.5 w-full sm:w-auto" :class="{'ml-auto': !$slots['toolbar-title']}">
      
      <div class="flex flex-wrap items-center sm:justify-end gap-3 w-full">
        <!-- Search Input -->
        <div v-if="showSearch" class="relative w-full sm:w-60 lg:w-72 flex-none sm:flex-initial group">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg v-if="isSearching" class="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <Search v-else class="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          
          <input
            :value="localSearchQuery"
            @input="handleSearchInput"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />

          <!-- Clear Search Button -->
          <button
            v-show="localSearchQuery"
            @click="clearSearch"
            type="button"
            aria-label="Clear search"
            class="absolute inset-y-0 right-0 pr-2.5 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
          >
            <div class="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-transparent hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors">
              <X class="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        <!-- Filters -->
        <slot name="toolbar-filters">
          <template v-if="filters && filters.length">
            <div v-for="filter in filters" :key="filter.key" class="relative flex-1 sm:flex-none min-w-[130px]">
              
              <!-- STANDARD SELECT FILTER -->
              <template v-if="!filter.type || filter.type === 'select'">
                <select
                  :value="localFilters?.[filter.key] ?? ''"
                  @change="handleFilterChange(filter.key, ($event.target as HTMLSelectElement).value)"
                  class="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                  :class="[
                    isFilterActive(filter.key)
                      ? 'border-brand-500/50 dark:border-brand-500/50 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-700'
                  ]"
                >
                  <option v-if="filter.placeholder" value="">{{ filter.placeholder }}</option>
                  <option v-for="opt in filter.options" :key="String(opt.value)" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <Filter 
                  class="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200" 
                  :class="isFilterActive(filter.key) ? 'text-brand-600 dark:text-brand-400 fill-current' : 'text-slate-400 dark:text-slate-500'"
                />
              </template>

              <!-- RANGE FILTER -->
              <template v-else-if="filter.type === 'range'">
                <!-- Backdrop with mobile dimming -->
                <div v-if="activeDropdown === filter.key" @click="activeDropdown = null" class="fixed inset-0 z-40 bg-slate-900/20 dark:bg-black/40 sm:bg-transparent"></div>
                
                <button
                  type="button"
                  @click="activeDropdown = activeDropdown === filter.key ? null : filter.key"
                  class="w-full relative z-40 flex items-center justify-start pl-3.5 pr-8 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                  :class="[
                    isFilterActive(filter.key)
                      ? 'border-brand-500/50 dark:border-brand-500/50 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  ]"
                >
                  <span class="truncate">{{ formatRangeDisplay(filter) }}</span>
                  <Filter 
                    class="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200" 
                    :class="isFilterActive(filter.key) ? 'text-brand-600 dark:text-brand-400 fill-current' : 'text-slate-400 dark:text-slate-500'"
                  />
                </button>

                <!-- Range Popover -->
                <div v-if="activeDropdown === filter.key" class="fixed sm:absolute z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:w-[320px] p-5 pb-8 sm:pb-5 bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl sm:shadow-xl sm:shadow-slate-900/5 dark:shadow-black/20">
                  
                  <!-- Mobile Pull Indicator -->
                  <div class="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5 sm:hidden"></div>

                  <div class="flex items-center justify-between gap-3 mb-6">
                    <!-- Min Input -->
                    <div class="relative flex-1">
                      <span v-if="filter.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{{ filter.prefix }}</span>
                      
                      <!-- Currency Input -->
                      <input 
                        v-if="isCurrencyFilter(filter)"
                        type="text" 
                        class="js-price-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pr-2 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        :class="filter.prefix ? 'pl-7' : 'pl-3'"
                        :value="((rangeValues[filter.key]?.[0] ?? getFilterBounds(filter)[0]) / 100).toFixed(2)"
                        @input="handlePriceInput(filter.key, 'min', $event)"
                        @change="handlePriceChange(filter.key, 'min', $event, filter)"
                      />
                      
                      <!-- Standard Number Input -->
                      <input 
                        v-else
                        type="number" 
                        :value="rangeValues[filter.key]?.[0] ?? getFilterBounds(filter)[0]"
                        @change="handleNumberInputChange(filter.key, 'min', $event, filter)"
                        class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pr-2 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        :class="filter.prefix ? 'pl-7' : 'pl-3'"
                      />
                    </div>
                    <span class="text-slate-400 font-medium">-</span>
                    <!-- Max Input -->
                    <div class="relative flex-1">
                      <span v-if="filter.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{{ filter.prefix }}</span>
                      
                      <!-- Currency Input -->
                      <input 
                        v-if="isCurrencyFilter(filter)"
                        type="text" 
                        class="js-price-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pr-2 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        :class="filter.prefix ? 'pl-7' : 'pl-3'"
                        :value="((rangeValues[filter.key]?.[1] ?? getSafeMax(filter)) / 100).toFixed(2)"
                        @input="handlePriceInput(filter.key, 'max', $event)"
                        @change="handlePriceChange(filter.key, 'max', $event, filter)"
                      />
                      
                      <!-- Standard Number Input -->
                      <input 
                        v-else
                        type="number" 
                        :value="rangeValues[filter.key]?.[1] ?? getSafeMax(filter)"
                        @change="handleNumberInputChange(filter.key, 'max', $event, filter)"
                        class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pr-2 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        :class="filter.prefix ? 'pl-7' : 'pl-3'"
                      />
                    </div>
                  </div>

                  <!-- Dual Slider Track -->
                  <div class="relative w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-2">
                    <div 
                      class="absolute top-0 bottom-0 bg-brand-500 rounded-full transition-all duration-75"
                      :style="getRangeTrackStyle(filter)"
                    ></div>
                    <input 
                      type="range" 
                      :min="filter.min ?? 0" 
                      :max="getSafeMax(filter)" 
                      :step="filter.step || 1"
                      :value="rangeValues[filter.key]?.[0] ?? getFilterBounds(filter)[0]"
                      @input="handleRangeSlider(filter.key, 'min', $event, filter)"
                      @change="commitRangeChange(filter.key)"
                      class="dual-range absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none outline-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto cursor-pointer"
                    />
                    <input 
                      type="range" 
                      :min="filter.min ?? 0" 
                      :max="getSafeMax(filter)" 
                      :step="filter.step || 1"
                      :value="rangeValues[filter.key]?.[1] ?? getSafeMax(filter)"
                      @input="handleRangeSlider(filter.key, 'max', $event, filter)"
                      @change="commitRangeChange(filter.key)"
                      class="dual-range absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none outline-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto cursor-pointer"
                    />
                  </div>
                </div>
              </template>

            </div>
          </template>
        </slot>

        <slot name="toolbar-actions" />
      </div>

      <div class="h-6 w-full flex justify-end items-center">
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-0.5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-0.5"
        >
          <button
            v-show="hasActiveFilters"
            @click="handleReset"
            type="button"
            class="group/reset inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all duration-200 cursor-pointer active:scale-95"
            title="Clear all active filters"
          >
            <RotateCcw class="w-3 h-3 text-slate-400 group-hover/reset:-rotate-45 group-hover/reset:text-slate-600 dark:group-hover/reset:text-slate-200 transition-transform duration-300" />
            <span>Reset filters</span>
            <span v-if="activeFiltersCount > 0" class="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {{ activeFiltersCount }}
            </span>
          </button>
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Search, Filter, RotateCcw, X } from "lucide-vue-next"
import { formatCurrency } from "@/utils/currencyFormatter"
import { priceFormatter } from "@/utils/priceFormatter"
import type { TableFilter } from "./BaseTable.vue"

const props = defineProps<{
  showSearch: boolean
  isSearching: boolean
  searchQuery: string
  searchPlaceholder: string
  filters: TableFilter[]
  selectedFilters: Record<string, any>
}>()

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedFilters',
  'filter-change',
  'reset'
])

const activeDropdown = ref<string | null>(null)
const localFilters = ref<Record<string, any>>({ ...(props.selectedFilters || {}) })
const localSearchQuery = ref<string>(props.searchQuery || '')
const rangeValues = ref<Record<string, [number, number]>>({})

const getFilterBounds = (filter: TableFilter): [number, number] => [
  filter.min ?? 0,
  filter.max ?? 100
]

const getSafeMax = (filter: TableFilter): number => {
  const min = filter.min ?? 0
  const max = filter.max ?? 100
  const step = filter.step || 1
  return Math.ceil((max - min) / step) * step + min
}

watch(() => props.selectedFilters, (newVals) => {
  localFilters.value = { ...(newVals || {}) }
  props.filters?.forEach(f => {
    if (f.type === 'range') {
      const bounds = getFilterBounds(f)
      const val = newVals?.[f.key]
      rangeValues.value[f.key] = (Array.isArray(val) && val.length >= 2)
        ? [Number(val[0]), Number(val[1])]
        : bounds
    }
  })
}, { deep: true, immediate: true })

watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal || ''
})

const isFilterActive = (key: string): boolean => {
  const val = localFilters.value?.[key]
  return val !== undefined && val !== null && val !== ''
}

const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value || {}).some(
    val => val !== undefined && val !== null && val !== ''
  )
})

const activeFiltersCount = computed(() => {
  return Object.entries(localFilters.value || {}).filter(([k, val]) => {
    if (val === undefined || val === null || val === '') return false
    const fDef = props.filters?.find(f => f.key === k)
    if (fDef && fDef.type === 'range') {
      const bounds = getFilterBounds(fDef)
      if (Array.isArray(val) && val[0] === bounds[0] && val[1] === getSafeMax(fDef)) {
        return false
      }
    }
    return true
  }).length
})

const handleSearchInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value
  localSearchQuery.value = val
  emit('update:searchQuery', val)
}

const clearSearch = () => {
  localSearchQuery.value = ''
  emit('update:searchQuery', '')
}

const handleFilterChange = (filterKey: string, value: any) => {
  const updatedFilters = { ...localFilters.value }
  if (value === '' || value === null || value === undefined) {
    delete updatedFilters[filterKey]
  } else {
    updatedFilters[filterKey] = value
  }
  localFilters.value = updatedFilters
  emit('update:selectedFilters', updatedFilters)
  emit('filter-change', { key: filterKey, value, filters: updatedFilters })
}

const isCurrencyFilter = (filter: TableFilter) => filter.prefix === '£' || filter.prefix === '$'

const formatRangeDisplay = (filter: TableFilter) => {
  const activeVal = localFilters.value?.[filter.key]
  if (!activeVal) return filter.placeholder || 'Price Range'
  
  if (isCurrencyFilter(filter)) {
    return `${formatCurrency(activeVal[0])} - ${formatCurrency(activeVal[1])}`
  }

  const prefix = filter.prefix || ''
  return `${prefix}${activeVal[0]} - ${prefix}${activeVal[1]}`
}

const getRangeTrackStyle = (filter: TableFilter) => {
  const [min] = getFilterBounds(filter)
  const max = getSafeMax(filter) 
  const range = max - min || 1
  const current = rangeValues.value[filter.key] ?? [min, filter.max ?? max]
  
  const left = ((current[0] - min) / range) * 100
  const right = 100 - ((current[1] - min) / range) * 100

  return {
    left: `${Math.max(0, Math.min(100, left))}%`,
    right: `${Math.max(0, Math.min(100, right))}%`
  }
}

const handleRangeSlider = (key: string, type: 'min' | 'max', event: Event, filter: TableFilter) => {
  const inputVal = Number((event.target as HTMLInputElement).value)
  const bounds = getFilterBounds(filter)
  
  if (!rangeValues.value[key]) {
    rangeValues.value[key] = [...bounds]
  }
  const currentRange = rangeValues.value[key]

  if (type === 'min') {
    rangeValues.value[key][0] = Math.min(inputVal, currentRange[1])
  } else {
    rangeValues.value[key][1] = Math.max(inputVal, currentRange[0])
  }
}

const handlePriceInput = (key: string, type: 'min' | 'max', event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = priceFormatter.formatElement(target, 'js-price-input')
  const cents = priceFormatter.toCents(target.value) ?? 0
  
  if (!rangeValues.value[key]) {
    const filter = props.filters?.find(f => f.key === key)
    rangeValues.value[key] = filter ? getFilterBounds(filter) : [0, 100]
  }
  rangeValues.value[key][type === 'min' ? 0 : 1] = cents
}

const handlePriceChange = (key: string, type: 'min' | 'max', event: Event, filter: TableFilter) => {
  const target = event.target as HTMLInputElement
  let cents = priceFormatter.toCents(target.value) ?? 0
  
  const [minBound] = getFilterBounds(filter)
  const maxBound = getSafeMax(filter)

  if (!rangeValues.value[key]) {
    rangeValues.value[key] = [minBound, maxBound]
  }
  const currentRange = rangeValues.value[key]
  cents = Math.max(minBound, Math.min(maxBound, cents))
  
  if (type === 'min') {
    rangeValues.value[key][0] = Math.min(cents, currentRange[1])
  } else {
    rangeValues.value[key][1] = Math.max(cents, currentRange[0])
  }

  target.value = (rangeValues.value[key][type === 'min' ? 0 : 1] / 100).toFixed(2)
  commitRangeChange(key)
}

const handleNumberInputChange = (key: string, type: 'min' | 'max', event: Event, filter: TableFilter) => {
  let val = Number((event.target as HTMLInputElement).value)
  const [minBound] = getFilterBounds(filter)
  const maxBound = getSafeMax(filter)

  if (!rangeValues.value[key]) {
    rangeValues.value[key] = [minBound, maxBound]
  }
  const currentRange = rangeValues.value[key]
  val = Math.max(minBound, Math.min(maxBound, val))
  
  if (type === 'min') {
    rangeValues.value[key][0] = Math.min(val, currentRange[1])
  } else {
    rangeValues.value[key][1] = Math.max(val, currentRange[0])
  }

  commitRangeChange(key)
}

const commitRangeChange = (key: string) => {
  const fDef = props.filters?.find(f => f.key === key)
  if (!fDef) return

  const [minBound] = getFilterBounds(fDef)
  const maxBound = getSafeMax(fDef)
  const currentVals = rangeValues.value[key]

  const isDefault = currentVals?.[0] === minBound && currentVals?.[1] === maxBound
  handleFilterChange(key, isDefault || !currentVals ? '' : ([...currentVals] as [number, number]))
}

const handleReset = () => {
  activeDropdown.value = null
  localFilters.value = {}
  props.filters?.forEach(f => {
    if (f.type === 'range') {
      rangeValues.value[f.key] = getFilterBounds(f)
    }
  })
  emit('update:selectedFilters', {})
  emit('filter-change', { key: 'reset', value: null, filters: {} })
  emit('reset')
}
</script>
