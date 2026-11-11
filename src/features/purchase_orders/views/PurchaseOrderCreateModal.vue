<!-- src/features/views/PurchaseOrderCreateModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Create Purchase Order"
    description="Draft a new procurement order for your workspace."
    max-width="4xl"
    @close="handleClose"
  >
    <template #icon>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <Plus class="w-5 h-5" />
      </div>
    </template>

    <div class="space-y-8 mt-2">
      
      <!-- Top Metadata Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/50 dark:bg-slate-900/30 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        
                  <!-- Supplier Autocomplete -->
          <div class="space-y-2 relative md:col-span-2">
            <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <BaseAutocomplete
              v-model="supplierSearchInput"
              :search="searchSuppliers"
              :get-item-label="getSupplierLabel"
              placeholder="Search suppliers..."
              :min-chars="0"
              :fetch-on-focus="true"
              input-class="rounded-xl py-3 pl-4"
              @update:model-value="onSupplierSearchChange"
              @select="selectSupplier"
              @clear="clearSupplierSelection"
              @search-error="handleAutocompleteError"
            >
              <template #option="{ item }">
                <div class="flex min-w-0 flex-col gap-0.5">
                  <span class="block min-w-0 truncate text-sm font-bold leading-5 text-slate-900 dark:text-white">{{ item.name }}</span>
                  <span class="block min-w-0 truncate text-xs font-mono leading-4 text-slate-500 dark:text-slate-400">{{ item.email || 'No email provided' }}</span>
                </div>
              </template>
            </BaseAutocomplete>
          </div>

          <!-- PO Number -->
        <div class="space-y-2 relative">
          <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
            PO Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.po_number"
            required
            type="text"
            maxlength="100"
            placeholder="e.g. PO-2026-001"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-mono font-bold uppercase text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-200 ease-out placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Line Items Section -->
      <div class="space-y-4 relative z-20">
        <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <h3 class="text-sm font-black tracking-wide text-slate-900 dark:text-white">LINE ITEMS</h3>
          <button
            type="button"
            @click="addLineItem"
            class="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3.5 py-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all shadow-sm active:scale-95"
          >
            <Plus class="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="lines.length === 0" class="py-16 text-center text-slate-500 flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40">
          <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
            <PackageOpen class="w-6 h-6 text-slate-400" />
          </div>
          <p class="text-sm font-medium mt-2">No line items added.<br/><span class="text-xs font-normal text-slate-400">Click 'Add Row' to start populating your purchase order.</span></p>
        </div>

        <!-- Data Grid -->
        <div v-else class="space-y-3">
          <!-- Desktop Grid Header -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div class="col-span-4">Product</div>
            <div class="col-span-2">SKU</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-2 text-right">Unit Cost</div>
            <div class="col-span-2 text-right">Total</div>
            <div class="col-span-1"></div>
          </div>

          <!-- Hybrid Grid Rows -->
          <div 
            v-for="(line, index) in lines" 
            :key="index"
            :class="[
              'relative p-4 md:p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all js-item-search-container group',
              'z-10'
            ]"
          >
            <div class="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-4 md:items-center">
              
              <!-- Product Search -->
              <div class="md:col-span-4 relative w-full">
                <div class="md:hidden flex justify-between items-center mb-2">
                  <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Product</span>
                  <button type="button" @click="removeLineItem(index)"
                    class="text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-sm active:scale-95 transition-all flex items-center justify-center"
                    title="Remove row"><Trash2 class="w-4 h-4" /></button>
                </div>
                <BaseAutocomplete
                  v-model="line.searchInput"
                  :search="searchItems"
                  :get-item-label="getItemLabel"
                  placeholder="Search product..."
                  :max-height="260"
                  input-class="rounded-lg bg-slate-50/50 dark:bg-slate-950 px-3.5 py-2.5"
                  @update:model-value="onItemSearchChange(index)"
                  @select="(item) => selectItem(index, item)"
                  @clear="clearItemSearch(index)"
                  @search-error="handleAutocompleteError"
                >
                  <template #option="{ item }">
                    <div class="flex min-w-0 flex-col gap-0.5">
                      <span class="block min-w-0 truncate text-sm font-bold leading-5 text-slate-900 dark:text-white">{{ item.title }}</span>
                      <span class="block min-w-0 truncate text-xs font-mono leading-4 text-slate-500 dark:text-slate-400">SKU: {{ item.sku || 'N/A' }}</span>
                    </div>
                  </template>
                </BaseAutocomplete>
              </div>

                        <!-- SKU (Desktop Only) -->
              <div class="hidden md:block md:col-span-2 px-2">
                <span class="block text-xs font-mono font-semibold text-slate-500 truncate" :title="line.sku">
                  {{ line.sku || '—' }}
                </span>
              </div>

              <!-- Numbers Grid (Mobile & Desktop) -->
              <div class="grid grid-cols-3 gap-3 w-full md:col-span-5 md:grid-cols-5 md:gap-4 md:items-center">
                
                <!-- Quantity -->
                <div class="col-span-1">
                  <span class="md:hidden block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">Qty</span>
                  <input
                    v-model.number="line.quantity"
                    type="number"
                    min="1"
                    required
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 px-2 py-2.5 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>

                <!-- Unit Cost -->
                <div class="col-span-1 md:col-span-2">
                  <span class="md:hidden block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-right">Cost</span>
                  <div class="relative w-full">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{{ CURRENCY_SYMBOL }}</span>
                    <input
                      v-model="line.display_unit_cost"
                      @input="(e) => handlePriceInput(e, index)"
                      type="text"
                      class="js-price-input w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 pl-6 pr-3 py-2.5 text-sm font-mono font-bold text-right focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="col-span-1 md:col-span-2 text-right md:pr-2 flex flex-col justify-end h-full md:h-auto pb-1.5 md:pb-0">
                  <span class="md:hidden block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Total</span>
                  <span class="text-sm md:text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {{ formatPrice(getLineSubtotal(line)) }}
                  </span>
                </div>
              </div>

              <!-- Desktop Remove Button -->
              <div class="hidden md:flex md:col-span-1 justify-center">
                <button
                  type="button"
                  @click="removeLineItem(index)"
                  class="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                  title="Remove row"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Footer calculated sums (z-10 explicitly forces it under the line items) -->
      <div class="relative z-10 bg-slate-900 dark:bg-slate-100 p-5 sm:p-6 rounded-2xl shadow-xl flex justify-between items-center mt-8">
        <span class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Grand Total
        </span>
        <span class="text-2xl sm:text-3xl font-black text-white dark:text-slate-900 font-mono tracking-tight leading-none">
          {{ formatPrice(calculatedTotalCents) }}
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          @click="handleClose"
          class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          Cancel
        </button>

        <AsyncButton
          :action="submitForm"
          :disabled="lines.length === 0 || !form.supplier_id"
          class="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/30 dark:shadow-none active:scale-95 cursor-pointer border-0"
        >
          Create Draft
        </AsyncButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { Plus, Trash2, PackageOpen } from "lucide-vue-next"
import BaseModal from "@/components/ui/BaseModal.vue"
import BaseAutocomplete from "@/components/ui/BaseAutocomplete.vue"
import AsyncButton from "@/components/layout/AsyncButton.vue"
import { useToast } from "@/composables/useToast"
import { purchaseOrderService } from "../services/purchase_order.service"
import { itemService } from "../../items/services/item.service"
import { supplierService } from "../../suppliers/services/supplier.service"
import { priceFormatter } from "@/utils/priceFormatter"
import type { PurchaseOrder } from "../types/purchase_order.types"
import type { Item } from "../../items/types/item.types"
import type { Supplier } from "../../suppliers/types/supplier.types"

const props = defineProps<{ isOpen: boolean; workspaceId: string }>()
const emit = defineEmits<{ (e: "close"): void; (e: "created", po: PurchaseOrder): void }>()
const { showToast } = useToast()
const CURRENCY_SYMBOL = "£"
const LOCALE = "en-GB"

interface LineItemForm {
  item_id: string | null
  sku: string
  searchInput: string
  quantity: number
  display_unit_cost: string
}

const form = ref({ supplier_id: "", po_number: "" })
const supplierSearchInput = ref("")
const selectedSupplier = ref<Supplier | null>(null)
const lines = ref<LineItemForm[]>([])

const searchSuppliers = async (query: string): Promise<Supplier[]> =>
  (await supplierService.getAll(props.workspaceId, query.trim())).items
const getSupplierLabel = (supplier: Supplier) => supplier.name
const searchItems = async (query: string): Promise<Item[]> =>
  (await itemService.getAll(props.workspaceId, query.trim(), 1, 15)).items
const getItemLabel = (item: Item) => item.title

const handleAutocompleteError = (error: unknown) => {
  const err = error as any
  const message = err.response?.data?.detail || err.message || "An unexpected error occurred"
  showToast(Array.isArray(message) ? message[0]?.msg || "An unexpected error occurred" : message, "error")
}

watch(supplierSearchInput, (query) => {
  if (selectedSupplier.value && query.trim() !== getSupplierLabel(selectedSupplier.value)) {
    selectedSupplier.value = null
    form.value.supplier_id = ""
  }
})

const onSupplierSearchChange = () => {
  if (selectedSupplier.value && supplierSearchInput.value.trim() !== getSupplierLabel(selectedSupplier.value)) {
    selectedSupplier.value = null
    form.value.supplier_id = ""
  }
}
const selectSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier
  form.value.supplier_id = supplier.id
  supplierSearchInput.value = supplier.name
}
const clearSupplierSelection = () => {
  selectedSupplier.value = null
  supplierSearchInput.value = ""
  form.value.supplier_id = ""
}

watch(() => props.isOpen, (open) => {
  if (open) {
    form.value = { supplier_id: "", po_number: "" }
    selectedSupplier.value = null
    supplierSearchInput.value = ""
    lines.value = []
    addLineItem()
  }
})

const addLineItem = () => lines.value.push({
  item_id: null, sku: "", searchInput: "", quantity: 1, display_unit_cost: "0.00"
})
const removeLineItem = (index: number) => { lines.value.splice(index, 1) }

const onItemSearchChange = (index: number) => {
  const line = lines.value[index]
  if (!line) return
  line.item_id = null
  line.sku = ""
}
const clearItemSearch = (index: number) => {
  const line = lines.value[index]
  if (!line) return
  line.item_id = null
  line.sku = ""
}
const selectItem = (index: number, item: Item) => {
  const line = lines.value[index]
  if (!line) return
  line.item_id = item.id
  line.sku = item.sku
  line.searchInput = item.title
  line.display_unit_cost = item.base_price != null ? (item.base_price / 100).toFixed(2) : "0.00"
}

const handlePriceInput = (event: Event, index: number) => {
  const line = lines.value[index]
  if (!line) return
  line.display_unit_cost = priceFormatter.formatElement(event.target as HTMLInputElement, "js-price-input")
}
const getLineSubtotal = (line: LineItemForm) => (priceFormatter.toCents(line.display_unit_cost) || 0) * (line.quantity || 0)
const calculatedTotalCents = computed(() => lines.value.reduce((total, line) => total + getLineSubtotal(line), 0))
const formatPrice = (cents: number) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "GBP" }).format(cents / 100)
const handleClose = () => emit("close")

const submitForm = async () => {
  if (!form.value.supplier_id) {
    showToast("Please choose a Supplier", "error")
    throw new Error("Please choose a Supplier")
  }
  if (lines.value.some(line => !line.item_id || line.quantity < 1)) {
    showToast("Please make sure all line items contain resolved products with correct quantities", "error")
    throw new Error("Invalid line items")
  }
  try {
    const payload = {
      supplier_id: form.value.supplier_id,
      po_number: form.value.po_number.trim().toUpperCase(),
      status: "DRAFT" as const,
      purchase_order_lines: lines.value.map(line => ({
        item_id: line.item_id as string,
        quantity: line.quantity,
        unit_cost: priceFormatter.toCents(line.display_unit_cost) || 0
      }))
    }
    const newPO = await purchaseOrderService.create(props.workspaceId, payload)
    showToast("Purchase order draft created successfully", "success")
    emit("created", newPO)
    handleClose()
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || "An unexpected error occurred"
    showToast(Array.isArray(message) ? message[0]?.msg || "An unexpected error occurred" : message, "error")
    throw error
  }
}
</script>