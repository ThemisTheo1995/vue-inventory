<!-- src/views/inventory/StockAdjustModal.vue -->
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

    <form @submit.prevent="submitAdjustment" class="mt-6 space-y-5">
      
      <!-- Item Selection -->
    <div class="space-y-1.5 relative">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
            Item <span class="text-red-500">*</span>
        </label>
    
        <!-- Preselected (Locked) State -->
        <input
            v-if="preselectedItemId"
            :value="preselectedItemId"
            type="text"
            readonly
            class="w-full rounded-xl border border-transparent bg-slate-100 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
        />
    
        <!-- Searchable Combobox -->
        <div v-else class="relative">
            <!-- Selected Item Display (Shows Name + SKU) -->
            <div 
            v-if="selectedItem" 
            class="flex items-center justify-between w-full rounded-xl border border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20 px-4 py-3 shadow-sm ring-1 ring-brand-500/20"
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
                class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-200"
            />
            
            <!-- Dropdown Menu -->
            <div 
                v-if="showDropdown && (searchResults.length > 0 || isSearching || (searchQuery.length >= 3))"
                class="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-64"
            >
                <div v-if="isSearching" class="p-4 text-center text-sm font-medium text-slate-500">Searching...</div>
                <div v-else-if="searchResults.length === 0 && searchQuery.length >= 3" class="p-4 text-center text-sm font-medium text-slate-500">No results found.</div>
                <ul v-else class="overflow-y-auto py-1">
                <li 
                    v-for="item in searchResults" 
                    :key="item.id"
                    @mousedown.prevent="selectItem(item)"
                    class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
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

      <!-- Adjustment Type (Add vs Remove) -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Adjustment Type <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label 
            :class="[
              'relative flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all active:scale-95',
              form.mode === 'ADD' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/50' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800'
            ]"
          >
            <input type="radio" v-model="form.mode" value="ADD" class="sr-only" />
            <PlusCircle class="w-5 h-5 mb-1.5" />
            <span class="text-xs font-bold uppercase tracking-wide">Add Stock</span>
          </label>
          
          <label 
            :class="[
              'relative flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all active:scale-95',
              form.mode === 'REMOVE' 
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 shadow-sm ring-1 ring-red-500/50' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800'
            ]"
          >
            <input type="radio" v-model="form.mode" value="REMOVE" class="sr-only" />
            <MinusCircle class="w-5 h-5 mb-1.5" />
            <span class="text-xs font-bold uppercase tracking-wide">Remove Stock</span>
          </label>
        </div>
      </div>

      <!-- Quantity -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Quantity to {{ form.mode === 'ADD' ? 'Add' : 'Remove' }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          required
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold font-mono text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-200 placeholder:font-sans placeholder:font-normal"
          placeholder="0"
        />
      </div>

      <!-- Notes / Reference ID -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Reference ID
        </label>
        <input
          v-model="form.referenceId"
          type="text"
          maxlength="255"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-200 placeholder:text-slate-400"
          placeholder="PO-ID, SO-ID..."
        />
      </div>

      <!-- Actions -->
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          type="button"
          @click="handleClose"
          :disabled="isSubmitting"
          class="px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !form.itemId || form.quantity < 1"
          class="inline-flex items-center justify-center min-w-[120px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 dark:disabled:bg-brand-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
          <span v-else>Confirm</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowRightLeft, PlusCircle, MinusCircle, Search, Loader2, X } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { inventoryService } from '../services/inventory.service'
import { itemService } from '../../items/services/item.service'
import { OrderType } from '../types/inventory.types'

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
  preselectedItemId?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { showToast } = useToast()

const isSubmitting = ref(false)

// Item Search State
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const showDropdown = ref(false)
const selectedItem = ref<any | null>(null)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const form = ref({
  itemId: '',
  mode: 'ADD' as 'ADD' | 'REMOVE',
  quantity: 1,
  referenceId: ''
})

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
  setTimeout(() => showDropdown.value = true, 50) // Allow input to refocus and show empty state
}

const handleBlur = () => {
  // Small timeout to allow mousedown event on dropdown items to fire first
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// Reset form whenever modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = {
      itemId: props.preselectedItemId || '',
      mode: 'ADD',
      quantity: 1,
      referenceId: ''
    }
    
    // Clear search state entirely when reopened
    searchQuery.value = ''
    searchResults.value = []
    selectedItem.value = null
    showDropdown.value = false
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

  isSubmitting.value = true
  try {
    const quantityChange = form.value.mode === 'ADD' 
      ? Math.abs(form.value.quantity) 
      : -Math.abs(form.value.quantity)

    await inventoryService.createStockMovement(props.workspaceId, {
      item_id: form.value.itemId,
      quantity_change: quantityChange,
      reference_type: OrderType.MANUAL_ADJUSTMENT,
      reference_id: null
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
  } finally {
    isSubmitting.value = false
  }
}
</script>
