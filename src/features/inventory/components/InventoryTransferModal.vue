<!-- src/features/inventory/components/InventoryTransferModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Transfer Stock Between Bins"
    description="Move stock from this bin to another existing bin. The source bin remains active, even when emptied."
    max-width="lg"
    @close="handleClose"
  >
    <template #icon>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <ArrowLeftRight class="w-5 h-5" />
      </div>
    </template>

    <form @submit.prevent="submitTransfer" class="mt-6 space-y-5">
      <!-- Item Info -->
      <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <Package class="w-5 h-5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Item</p>
          <p class="text-sm font-black text-slate-900 dark:text-white truncate">{{ itemTitle || 'Unknown Item' }}</p>
          <p v-if="itemSku" class="text-xs font-mono text-slate-500 dark:text-slate-400">SKU: {{ itemSku }}</p>
        </div>
      </div>

      <!-- Source Bin: fixed and required -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Source Bin
        </label>
        <div class="flex items-center justify-between w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-4 py-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <ShelvingUnit class="w-4 h-4 text-slate-400 shrink-0" />
            <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
              {{ sourceBinCode || 'Source bin' }}
            </span>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
            On hand: {{ maxAvailableStock }}
          </span>
        </div>
      </div>

      <!-- Destination Bin -->
      <div class="space-y-1.5 relative">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Destination Bin <span class="text-red-500">*</span>
        </label>

        <div
          v-if="selectedDestinationBin"
          class="flex items-center justify-between w-full rounded-xl border border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20 px-4 py-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <ShelvingUnit class="w-4 h-4 text-brand-500 shrink-0" />
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
                {{ selectedDestinationBin.code }}
                <span v-if="selectedDestinationBin.zone" class="font-normal text-slate-500">
                  ({{ selectedDestinationBin.zone }})
                </span>
              </span>
              <span class="text-xs font-mono text-brand-700 dark:text-brand-400 truncate">
                ID: {{ selectedDestinationBin.id }}
              </span>
            </div>
          </div>
          <button
            type="button"
            @click="clearDestinationSelection"
            class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
            aria-label="Clear destination bin"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-else class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Loader2 v-if="isSearchingBins" class="w-4 h-4 text-brand-500 animate-spin" />
            <Search v-else class="w-4 h-4 text-slate-400" />
          </div>

          <input
            v-model="binSearchQuery"
            type="text"
            @focus="showBinDropdown = true"
            @blur="handleBinBlur"
            placeholder="Search destination bin by code or zone..."
            class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />

          <div
            v-show="showBinDropdown"
            class="dropdown-container absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60 transform-gpu overscroll-contain"
          >
            <div v-if="isSearchingBins" class="p-4 text-center text-sm font-medium text-slate-500">
              Searching bins...
            </div>
            <div v-else-if="selectableBins.length === 0" class="p-4 text-center text-sm font-medium text-slate-500">
              {{ binSearchQuery.trim() ? 'No other matching bins found.' : 'No other bins available.' }}
            </div>
            <ul v-else class="overflow-y-auto py-1">
              <li
                v-for="bin in selectableBins"
                :key="bin.id"
                @mousedown.prevent="selectDestinationBin(bin)"
                class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col border-b border-slate-100 dark:border-slate-700/50 last:border-0"
              >
                <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {{ bin.code }} {{ bin.zone ? `(Zone: ${bin.zone})` : '' }}
                </span>
                <span class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  ID: {{ bin.id }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quantity -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between ml-1 mr-1">
          <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Quantity to Transfer <span class="text-red-500">*</span>
          </label>
          <button
            type="button"
            @click="quantity = maxAvailableStock"
            :disabled="maxAvailableStock < 1"
            class="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Transfer All: {{ maxAvailableStock }}
          </button>
        </div>
        <input
          v-model.number="quantity"
          type="number"
          min="1"
          :max="maxAvailableStock"
          :disabled="maxAvailableStock < 1"
          required
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-50 px-4 py-3 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          placeholder="0"
        />
        <p class="text-xs text-slate-500 dark:text-slate-400 ml-1">
          Transferring all {{ maxAvailableStock }} units leaves this source bin active with zero stock.
        </p>
      </div>

      <!-- Notes -->
      <div class="space-y-1.5">
        <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
          Notes (Optional)
        </label>
        <textarea
          v-model="notes"
          rows="2"
          maxlength="255"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-colors"
          placeholder="Reason for transfer..."
        ></textarea>
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
          :action="submitTransfer"
          :disabled="!canSubmit"
          class="inline-flex items-center justify-center min-w-[120px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-sm cursor-pointer"
        >
          Confirm Transfer
        </AsyncButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowLeftRight, Package, Search, Loader2, X, ShelvingUnit } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { useToast } from '@/composables/useToast'
import { inventoryService } from '../services/inventory.service'
import { binService } from '@/features/bins/services/bin.service'
import type { Bin } from '@/features/bins/types/bin.types'

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
  itemId: string
  itemTitle?: string | null
  itemSku?: string | null
  sourceBinId: string
  sourceBinCode?: string | null
  maxAvailableStock: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'transferred'): void
}>()

const { showToast } = useToast()

const selectedDestinationBin = ref<Bin | null>(null)
const destinationBinId = computed(() => selectedDestinationBin.value?.id ?? '')
const binSearchQuery = ref('')
const binSearchResults = ref<Bin[]>([])
const selectableBins = computed(() =>
  binSearchResults.value.filter(bin => bin.id !== props.sourceBinId)
)
const isSearchingBins = ref(false)
const showBinDropdown = ref(false)
let binDebounceTimeout: ReturnType<typeof setTimeout> | null = null
let searchRequestVersion = 0

const quantity = ref<number>(1)
const notes = ref<string>('')

const canSubmit = computed(() =>
  Boolean(
    props.sourceBinId &&
    props.itemId &&
    destinationBinId.value &&
    destinationBinId.value !== props.sourceBinId &&
    Number.isInteger(quantity.value) &&
    quantity.value > 0 &&
    quantity.value <= props.maxAvailableStock &&
    props.maxAvailableStock > 0
  )
)

const fetchBins = async (query = ''): Promise<void> => {
  const requestVersion = ++searchRequestVersion
  isSearchingBins.value = true

  try {
    const response = await binService.getBins(
      props.workspaceId,
      query || undefined,
      1,
      15
    )

    // Ignore stale responses when the user types a newer query.
    if (requestVersion !== searchRequestVersion) return

    binSearchResults.value = response.items || []
  } catch (error) {
    if (requestVersion === searchRequestVersion) {
      console.error('Failed to search bins:', error)
      binSearchResults.value = []
      showToast('Error searching for bins', 'error')
    }
  } finally {
    if (requestVersion === searchRequestVersion) {
      isSearchingBins.value = false
    }
  }
}

watch(binSearchQuery, (newValue) => {
  if (binDebounceTimeout) clearTimeout(binDebounceTimeout)

  binDebounceTimeout = setTimeout(() => {
    void fetchBins(newValue.trim())
  }, 250)
})

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) return

  if (binDebounceTimeout) {
    clearTimeout(binDebounceTimeout)
    binDebounceTimeout = null
  }

  selectedDestinationBin.value = null
  binSearchQuery.value = ''
  binSearchResults.value = []
  quantity.value = props.maxAvailableStock > 0 ? props.maxAvailableStock : 1
  notes.value = ''
  showBinDropdown.value = false

  await fetchBins()
})

const selectDestinationBin = (bin: Bin): void => {
  if (bin.id === props.sourceBinId) return

  selectedDestinationBin.value = bin
  binSearchQuery.value = ''
  showBinDropdown.value = false
}

const clearDestinationSelection = (): void => {
  selectedDestinationBin.value = null
  binSearchQuery.value = ''
  showBinDropdown.value = true
}

const handleBinBlur = (event: FocusEvent): void => {
  const relatedTarget = event.relatedTarget as HTMLElement | null
  if (relatedTarget?.closest('.dropdown-container')) return

  setTimeout(() => {
    showBinDropdown.value = false
  }, 200)
}

const handleClose = (): void => {
  emit('close')
}

const submitTransfer = async (): Promise<void> => {
  if (!props.sourceBinId) {
    showToast('This inventory record has no source bin. Stock cannot be transferred.', 'error')
    return
  }

  if (!selectedDestinationBin.value) {
    showToast('Please select a destination bin', 'error')
    return
  }

  if (selectedDestinationBin.value.id === props.sourceBinId) {
    showToast('Source and destination bins cannot be the same', 'error')
    return
  }

  if (
    !Number.isInteger(quantity.value) ||
    quantity.value < 1 ||
    quantity.value > props.maxAvailableStock
  ) {
    showToast(`Quantity must be a whole number between 1 and ${props.maxAvailableStock}`, 'error')
    return
  }

  try {
    await inventoryService.transferStock(props.workspaceId, {
      item_id: props.itemId,
      source_bin_id: props.sourceBinId,
      destination_bin_id: selectedDestinationBin.value.id,
      quantity: quantity.value,
      notes: notes.value.trim() || null
    })

    showToast('Stock transferred successfully', 'success')
    emit('transferred')
    handleClose()
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      'Failed to process stock transfer'

    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage[0]?.msg || 'Failed to process stock transfer'
      : errorMessage

    showToast(displayMessage, 'error')
    throw error
  }
}
</script>
