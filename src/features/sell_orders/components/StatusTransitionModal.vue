<!-- src/features/sell_orders/components/StatusTransitionModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    :title="modalTitle"
    :description="modalDescription"
    max-width="md"
    @close="handleClose"
  >
    <template #icon>
      <div :class="['flex items-center justify-center w-10 h-10 rounded-full', iconBgClass]">
        <component :is="iconComponent" class="w-5 h-5" />
      </div>
    </template>

    <form @submit.prevent class="mt-6 space-y-5">
      <!-- Optional Bin Selection Field (Shown when requireBin is true) -->
      <div v-if="requireBin" class="space-y-1.5 relative">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Fulfillment Bin Location <span class="text-red-500">*</span>
        </label>

        <!-- Searchable Bin Combobox -->
        <div class="relative">
          <!-- Selected Bin Display -->
          <div 
            v-if="selectedBin" 
            class="flex items-center justify-between w-full rounded-xl border border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20 px-4 py-3"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <ShelvingUnit class="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {{ selectedBin.code }} <span v-if="selectedBin.zone" class="text-xs font-normal text-slate-500">({{ selectedBin.zone }})</span>
                </span>
                <span class="text-xs font-mono text-brand-700 dark:text-brand-400 truncate">
                  ID: {{ selectedBin.id }}
                </span>
              </div>
            </div>
            <button 
              type="button" 
              @click="clearBinSelection"
              class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Search Input -->
          <div v-else class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Loader2 v-if="isBinSearching" class="w-4 h-4 text-brand-500 animate-spin" />
              <Search v-else class="w-4 h-4 text-slate-400" />
            </div>
            
            <input
              v-model="binSearchQuery"
              type="text"
              @focus="handleInputFocus"
              @blur="handleBinBlur"
              placeholder="Search by bin code or zone..."
              class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            
            <!-- Bin Dropdown Menu -->
            <div 
              v-show="showBinDropdown && (binSearchResults.length > 0 || isBinSearching)"
              class="bin-dropdown-container absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60 transform-gpu overscroll-contain"
            >
              <div v-if="isBinSearching" class="p-4 text-center text-sm font-medium text-slate-500">Searching bins...</div>
              <div v-else-if="binSearchResults.length === 0" class="p-4 text-center text-sm font-medium text-slate-500">No bins found.</div>
              <ul v-else class="overflow-y-auto py-1">
                <li 
                  v-for="bin in binSearchResults" 
                  :key="bin.id"
                  @mousedown.prevent="selectBin(bin)"
                  class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                >
                  <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    <ShelvingUnit class="w-3.5 h-3.5 text-slate-400" />
                    {{ bin.code }}
                  </span>
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5" v-if="bin.zone">
                    Zone: {{ bin.zone }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Message Prompt -->
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Are you sure you want to transition this sell order status to <span class="font-bold uppercase">{{ targetStatus }}</span>? This action dictates downstream order processing.
      </p>

      <!-- Actions -->
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <AsyncButton
          :action="handleSubmit"
          :disabled="requireBin && !selectedBinId"
          class="inline-flex items-center justify-center min-w-[120px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-sm cursor-pointer"
        >
          Confirm Change
        </AsyncButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Send, CheckCircle, XCircle, Search, Loader2, X, ShelvingUnit } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { binService } from '@/features/bins/services/bin.service'
import type { SellOrderStatus } from '../types/sell_order.types'

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
  targetStatus: SellOrderStatus
  requireBin?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload?: { binId?: string }): void
}>()

// Bin Search State
const binSearchQuery = ref('')
const binSearchResults = ref<any[]>([])
const isBinSearching = ref(false)
const showBinDropdown = ref(false)
const selectedBin = ref<any | null>(null)
const selectedBinId = ref<string | null>(null)
let binDebounceTimeout: ReturnType<typeof setTimeout> | null = null

// Dynamic styling & icons based on target status
const modalTitle = computed(() => `Transition to ${props.targetStatus}`)
const modalDescription = computed(() => `Record status update for order processing.`)

const iconComponent = computed(() => {
  if (props.targetStatus === 'CONFIRMED') return Send
  if (props.targetStatus === 'FULLFILLED') return CheckCircle
  return XCircle
})

const iconBgClass = computed(() => {
  if (props.targetStatus === 'CONFIRMED') return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
  if (props.targetStatus === 'FULLFILLED') return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
})

// Fetch Bins Function
const fetchBins = async (query?: string) => {
  isBinSearching.value = true
  try {
    const response = await binService.getBins(props.workspaceId, query || undefined, 1, 20)
    binSearchResults.value = response.items || []
  } catch (error) {
    console.error('Failed to fetch bins:', error)
  } finally {
    isBinSearching.value = false
  }
}

// Watcher for searching bins with debounce
watch(binSearchQuery, (newVal) => {
  const query = newVal.trim()
  if (binDebounceTimeout) clearTimeout(binDebounceTimeout)

  binDebounceTimeout = setTimeout(() => {
    fetchBins(query)
  }, 300)
})

// Trigger initial fetch when dropdown opens/focuses
const handleInputFocus = () => {
  showBinDropdown.value = true
  if (binSearchResults.value.length === 0) {
    fetchBins(binSearchQuery.value)
  }
}

const selectBin = (bin: any) => {
  selectedBin.value = bin
  selectedBinId.value = bin.id
  binSearchQuery.value = ''
  showBinDropdown.value = false
}

const clearBinSelection = () => {
  selectedBin.value = null
  selectedBinId.value = null
  binSearchQuery.value = ''
  showBinDropdown.value = true
  fetchBins()
}

const handleBinBlur = (event: FocusEvent) => {
  const relatedTarget = event.relatedTarget as HTMLElement
  if (relatedTarget && relatedTarget.closest('.bin-dropdown-container')) {
    return
  }
  setTimeout(() => {
    showBinDropdown.value = false
  }, 250)
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    binSearchQuery.value = ''
    binSearchResults.value = []
    selectedBin.value = null
    selectedBinId.value = null
    showBinDropdown.value = false
    if (props.requireBin) {
      fetchBins()
    }
  }
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (props.requireBin && !selectedBinId.value) return
  emit('confirm', { binId: selectedBinId.value || undefined })
}
</script>
