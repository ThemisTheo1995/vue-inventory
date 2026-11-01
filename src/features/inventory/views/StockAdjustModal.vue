<template>
  <BaseModal
    :is-open="isOpen"
    title="Adjust Stock Balance"
    description="Record a manual stock movement for shrinkage, damages, or manual counts."
    max-width="md"
    @close="handleClose"
  >
    <template #icon>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <ArrowRightLeft class="w-5 h-5" />
      </div>
    </template>

    <form @submit.prevent class="mt-6 space-y-5">
      
      <!-- 1. Item Selection -->
      <div class="space-y-1.5 relative">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
            Item <span class="text-red-500">*</span>
        </label>
    
        <!-- Preselected (Locked) State -->
        <div 
          v-if="preselectedItemId" 
          class="flex items-center justify-between w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-4 py-3"
        >
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
              {{ selectedItem?.title || preselectedItemTitle || 'Preselected Item' }}
            </span>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              SKU: {{ selectedItem?.sku || preselectedItemSku || preselectedItemId }}
            </span>
          </div>
        </div>
    
        <!-- Searchable Combobox -->
        <div v-else class="relative">
            <!-- Selected Item Display -->
            <div 
              v-if="selectedItem" 
              class="flex items-center justify-between w-full rounded-xl border border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20 px-4 py-3"
            >
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {{ selectedItem.title }}
                </span>
                <span class="text-xs font-medium text-brand-700 dark:text-brand-400 truncate">
                  SKU: {{ selectedItem.sku || 'No SKU' }}
                </span>
              </div>
              <button 
                type="button" 
                @click="clearSelection"
                class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Search Input -->
            <div v-else class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Loader2 v-if="isSearching" class="w-4 h-4 text-brand-500 animate-spin" />
                <Search v-else class="w-4 h-4 text-slate-400" />
              </div>
              
              <input
                v-model="searchQuery"
                type="text"
                @focus="showDropdown = true"
                @blur="handleBlur"
                placeholder="Search by name or SKU (3+ chars)..."
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              
              <!-- Dropdown Menu -->
              <div 
                v-show="showDropdown && (searchResults.length > 0 || isSearching || (searchQuery.length >= 3))"
                class="dropdown-container absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60 transform-gpu overscroll-contain"
              >
                <div v-if="isSearching" class="p-4 text-center text-sm font-medium text-slate-500">Searching...</div>
                <div v-else-if="searchResults.length === 0 && searchQuery.length >= 3" class="p-4 text-center text-sm font-medium text-slate-500">No results found.</div>
                <ul v-else class="overflow-y-auto py-1">
                  <li 
                    v-for="item in searchResults" 
                    :key="item.id"
                    @mousedown.prevent="selectItem(item)"
                    class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {{ item.title }}
                    </span>
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      SKU: {{ item.sku || 'N/A' }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
        </div>
      </div>

      <!-- 2. Bin Location Selection -->
      <div class="space-y-1.5 relative">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Bin Location <span class="text-red-500">*</span>
        </label>

        <!-- Preselected (Locked) Bin State -->
        <div 
          v-if="preselectedBinId" 
          class="flex items-center justify-between w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-4 py-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <ShelvingUnit class="w-4 h-4 text-slate-400 shrink-0" />
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
                {{ preselectedBinCode || 'Assigned Bin' }}
              </span>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                ID: {{ preselectedBinId }}
              </span>
            </div>
          </div>
        </div>

        <!-- Searchable Bin Combobox -->
        <div v-else class="relative">
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
              @focus="showBinDropdown = true"
              @blur="handleBinBlur"
              placeholder="Search by bin code or zone..."
              class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            
            <!-- Bin Dropdown Menu -->
            <div 
              v-show="showBinDropdown && (binSearchResults.length > 0 || isBinSearching || binSearchQuery.length >= 0)"
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

      <!-- 3. Adjustment Type -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Adjustment Type <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label 
            :class="[
              'relative flex flex-col items-center p-3 rounded-xl border cursor-pointer active:scale-95',
              form.mode === 'ADD' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 ring-1 ring-emerald-500/50' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800'
            ]"
          >
            <input type="radio" v-model="form.mode" value="ADD" class="sr-only" />
            <PlusCircle class="w-5 h-5 mb-1.5" />
            <span class="text-xs font-bold uppercase tracking-wide">Add Stock</span>
          </label>
          
          <label 
            :class="[
              'relative flex flex-col items-center p-3 rounded-xl border cursor-pointer active:scale-95',
              form.mode === 'REMOVE' 
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 ring-1 ring-red-500/50' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800'
            ]"
          >
            <input type="radio" v-model="form.mode" value="REMOVE" class="sr-only" />
            <MinusCircle class="w-5 h-5 mb-1.5" />
            <span class="text-xs font-bold uppercase tracking-wide">Remove Stock</span>
          </label>
        </div>
      </div>

      <!-- 4. Quantity -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Quantity to {{ form.mode === 'ADD' ? 'Add' : 'Remove' }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          required
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          placeholder="0"
        />
      </div>

      <!-- 5. Notes -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Notes <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.notes"
          rows="2"
          required
          maxlength="500"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          placeholder="Enter reason for adjustment..."
        ></textarea>
      </div>

      <!-- 6. Reference ID -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Reference ID
        </label>
        <input
          v-model="form.referenceId"
          type="text"
          maxlength="255"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          placeholder="PO-ID, SO-ID..."
        />
      </div>

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
          :action="submitAdjustment"
          :disabled="!form.itemId || form.quantity < 1 || !form.binId.trim() || !form.notes?.trim()"
          class="inline-flex items-center justify-center min-w-[120px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-sm cursor-pointer"
        >
          Confirm
        </AsyncButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowRightLeft, PlusCircle, MinusCircle, Search, Loader2, X, ShelvingUnit } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { useToast } from '@/composables/useToast'
import { inventoryService } from '../services/inventory.service'
import { itemService } from '../../items/services/item.service'
import { binService } from '../../bins/services/bin.service'
import { OrderType } from '../types/inventory.types'

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
  preselectedItemId?: string | null
  preselectedItemTitle?: string | null
  preselectedItemSku?: string | null
  preselectedBinId?: string | null
  preselectedBinCode?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { showToast } = useToast()

// Item Search State
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const showDropdown = ref(false)
const selectedItem = ref<any | null>(null)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

// Bin Search State
const binSearchQuery = ref('')
const binSearchResults = ref<any[]>([])
const isBinSearching = ref(false)
const showBinDropdown = ref(false)
const selectedBin = ref<any | null>(null)
let binDebounceTimeout: ReturnType<typeof setTimeout> | null = null

const form = ref({
  itemId: '',
  mode: 'ADD' as 'ADD' | 'REMOVE',
  quantity: 1,
  binId: '',
  notes: '',
  referenceId: ''
})

// Item Search Watcher
watch(searchQuery, (newVal) => {
  const query = newVal.trim()
  if (debounceTimeout) clearTimeout(debounceTimeout)
  
  if (query.length < 3) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  debounceTimeout = setTimeout(async () => {
    isSearching.value = true
    try {
      const response = await itemService.getAll(props.workspaceId, query, 1, 10)
      searchResults.value = response.items || []
    } catch (error) {
      console.error('Failed to fetch items:', error)
      showToast('Error searching for items', 'error')
    } finally {
      isSearching.value = false
    }
  }, 300) 
})

// Bin Search Watcher
watch(binSearchQuery, (newVal) => {
  const query = newVal.trim()
  if (binDebounceTimeout) clearTimeout(binDebounceTimeout)

  binDebounceTimeout = setTimeout(async () => {
    isBinSearching.value = true
    try {
      const response = await binService.getBins(props.workspaceId, query || undefined, 1, 10)
      binSearchResults.value = response.items || []
    } catch (error) {
      console.error('Failed to fetch bins:', error)
      showToast('Error searching for bins', 'error')
    } finally {
      isBinSearching.value = false
    }
  }, 300)
})

const selectItem = (item: any) => {
  selectedItem.value = item
  form.value.itemId = item.id
  searchQuery.value = ''
  showDropdown.value = false
}

const clearSelection = () => {
  selectedItem.value = null
  form.value.itemId = ''
  searchQuery.value = ''
  setTimeout(() => showDropdown.value = true, 10)
}

const selectBin = (bin: any) => {
  selectedBin.value = bin
  form.value.binId = bin.id
  binSearchQuery.value = ''
  showBinDropdown.value = false
}

const clearBinSelection = () => {
  selectedBin.value = null
  form.value.binId = ''
  binSearchQuery.value = ''
  setTimeout(() => showBinDropdown.value = true, 10)
}

const handleBlur = (event: FocusEvent) => {
  const relatedTarget = event.relatedTarget as HTMLElement
  if (relatedTarget && relatedTarget.closest('.dropdown-container')) {
    return
  }
  setTimeout(() => {
    showDropdown.value = false
  }, 250)
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
    form.value = {
      itemId: props.preselectedItemId || '',
      mode: 'ADD',
      quantity: 1,
      binId: props.preselectedBinId || '',
      notes: '',
      referenceId: ''
    }
    
    // Reset Item state
    searchQuery.value = ''
    searchResults.value = []
    selectedItem.value = null
    showDropdown.value = false

    // Reset Bin state
    binSearchQuery.value = ''
    binSearchResults.value = []
    selectedBin.value = props.preselectedBinId ? { id: props.preselectedBinId, code: props.preselectedBinCode } : null
    showBinDropdown.value = false
  }
})

const handleClose = () => {
  emit('close')
}

const submitAdjustment = async () => {
  if (!form.value.itemId) return
  if (form.value.quantity < 1) {
    showToast("Quantity must be at least 1", "error")
    return
  }
  if (!form.value.binId.trim()) {
    showToast("Bin ID is required", "error")
    return
  }
  if (!form.value.notes?.trim()) {
    showToast("Notes are required", "error")
    return
  }

  try {
    const quantityChange = form.value.mode === 'ADD' 
      ? Math.abs(form.value.quantity) 
      : -Math.abs(form.value.quantity)

    await inventoryService.createStockMovement(props.workspaceId, {
      item_id: form.value.itemId,
      quantity_change: quantityChange,
      bin_id: form.value.binId.trim(),
      notes: form.value.notes.trim(),
      reference_type: OrderType.MANUAL_ADJUSTMENT,
      reference_id: form.value.referenceId || null
    })
    
    emit('created')
  } catch (error: any) {
    const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage

    showToast(displayMessage, "error")
    throw error
  }
}
</script>
