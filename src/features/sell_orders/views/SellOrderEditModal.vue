<!-- src/features/sell_orders/views/SellOrderEditModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Edit Sell Order"
    description="Update the sell order details and manage line items."
    max-width="4xl"
    @close="handleClose"
  >
    <template #icon>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <Edit2 class="w-5 h-5" />
      </div>
    </template>

    <div class="space-y-8 mt-2">
      <!-- Section 1: SO Header Details -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <h3 class="text-sm font-black tracking-wide text-slate-900 dark:text-white">SO DETAILS</h3>
        </div>

        <form @submit.prevent class="grid grid-cols-1 md:grid-cols-4 gap-5 bg-slate-50/50 dark:bg-slate-900/30 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm items-end">
          
          <!-- Customer Autocomplete -->
          <div class="space-y-2 relative md:col-span-2">
            <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              Customer <span class="text-red-500">*</span>
            </label>
            <BaseAutocomplete
              v-model="customerSearchInput"
              :search="searchCustomers"
              :get-item-label="getCustomerLabel"
              placeholder="Type at least 3 letters of a customer"
              input-class="rounded-xl py-3"
              :min-chars="3"
              :max-height="240"
              @select="selectCustomer"
              @clear="clearCustomerSelection"
              @search-error="handleAutocompleteError"
            >
              <template #option="{ item }">
                <div class="flex min-w-0 flex-col gap-0.5">
                  <span class="block min-w-0 truncate text-sm font-bold leading-5 text-slate-900 dark:text-white">{{ getCustomerLabel(item) }}</span>
                  <span class="block min-w-0 truncate text-xs font-mono leading-4 text-slate-500 dark:text-slate-400">{{ item.email || 'No email provided' }}</span>
                </div>
              </template>
            </BaseAutocomplete>
          </div>

          <!-- SO Number (25%) -->
          <div class="space-y-2 relative md:col-span-1 flex flex-col justify-end">
            <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
              SO Number <span class="text-red-500">*</span>
            </label>
            <input
              v-model="headerForm.so_number"
              required
              type="text"
              maxlength="100"
              class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-mono font-bold uppercase text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-200 ease-out placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
            />
          </div>

          <!-- Header Save (25%) -->
          <div class="md:col-span-1 flex flex-col justify-end w-full">
            <AsyncButton
              :action="updateHeader"
              :disabled="!headerForm.customer_id"
              class="w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:cursor-not-allowed border-0 cursor-pointer"
              title="Save SO Details"
            >
              <Save class="w-4 h-4 mr-2" />
              Save SO
            </AsyncButton>
          </div>
        </form>
      </div>

      <!-- Section 2: Line Items -->
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
          <p class="text-sm font-medium mt-2">No line items added.<br/><span class="text-xs font-normal text-slate-400">Click 'Add Row' to populate your sell order.</span></p>
        </div>

        <div v-else class="space-y-3">
          <!-- Desktop Grid Header -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div class="col-span-4">Product</div>
            <div class="col-span-2">SKU</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-2 text-right">Unit Cost</div>
            <div class="col-span-2 text-right">Total</div>
            <div class="col-span-1 text-center">Action</div>
          </div>

          <!-- Hybrid Grid Rows -->
          <div 
            v-for="(line, index) in lines" 
            :key="index"
            :class="[
              'relative z-10 p-4 md:p-2 bg-white dark:bg-slate-900 rounded-xl border transition-all group',
              line.isDirty ? 'border-amber-300 dark:border-amber-700/50 shadow-md bg-amber-50/10 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
            ]"
          >
            <div class="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-4 md:items-center">
              
              <!-- Product Search -->
              <div class="md:col-span-4 relative w-full">
                
                <!-- Mobile Label & Action Buttons Header -->
                <div class="md:hidden flex justify-between items-center mb-2">
                  <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Product</span>
                  <div class="flex items-center gap-2">
                    <AsyncButton
                      v-if="line.isDirty"
                      :action="() => saveLineItem(index)"
                      :disabled="!line.item_id"
                      class="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50 shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                      title="Save Line"
                    >
                      <Save class="w-4 h-4" />
                    </AsyncButton>
                    <AsyncButton
                      :action="() => removeLineItem(index)"
                      class="text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 class="w-4 h-4" />
                    </AsyncButton>
                  </div>
                </div>

                <BaseAutocomplete
                  v-model="line.searchInput"
                  :search="searchItems"
                  :get-item-label="getItemLabel"
                  placeholder="Search product..."
                  :disabled="!!line.id"
                  :clearable="!line.id"
                  :input-class="line.id
                    ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800 opacity-70'
                    : 'bg-slate-50 dark:bg-slate-950'"
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
                    @input="markLineDirty(index)"
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

              <!-- Desktop Actions (Save & Delete) -->
              <div class="hidden md:flex md:col-span-1 justify-center gap-1.5 items-center">
                <AsyncButton
                  v-if="line.isDirty"
                  :action="() => saveLineItem(index)"
                  :disabled="!line.item_id"
                  class="text-emerald-600 dark:text-emerald-400 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all disabled:opacity-50 active:scale-95 border-0 cursor-pointer"
                  title="Save Line"
                >
                  <Save class="w-4 h-4" />
                </AsyncButton>
                
                <AsyncButton
                  :action="() => removeLineItem(index)"
                  class="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95 disabled:opacity-50 border-0 cursor-pointer"
                  title="Remove row"
                >
                  <Trash2 class="w-4 h-4" />
                </AsyncButton>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Replaced Footer -->
    <template #footer>
      <div class="w-full bg-slate-900 dark:bg-slate-100 p-4 sm:px-6 sm:py-5 rounded-xl shadow-lg flex justify-between items-center">
        <span class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Total Estimated Value
        </span>
        <span class="text-2xl sm:text-3xl font-black text-white dark:text-slate-900 font-mono tracking-tight leading-none">
          {{ formatPrice(calculatedTotalCents) }}
        </span>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { Edit2, Plus, Trash2, PackageOpen, Save } from "lucide-vue-next"
import BaseModal from "@/components/ui/BaseModal.vue"
import AsyncButton from "@/components/layout/AsyncButton.vue"
import BaseAutocomplete from "@/components/ui/BaseAutocomplete.vue"
import { useToast } from "@/composables/useToast"
import { useConfirm } from "@/composables/useConfirm"
import { sellOrderService } from "../services/sell_order.service"
import { itemService } from "../../items/services/item.service"
import { customerService } from "../../customers/services/customer.service"
import { priceFormatter } from "@/utils/priceFormatter"
import type { SellOrder } from "../types/sell_order.types"
import type { Item } from "../../items/types/item.types"
import type { Customer } from "../../customers/types/customer.types"

const props = defineProps<{ isOpen: boolean; workspaceId: string; so: SellOrder | null }>()
const emit = defineEmits<{ (e: "close"): void; (e: "updated"): void }>()
const { showToast } = useToast()
const { confirm } = useConfirm()
const CURRENCY_SYMBOL = "£"
const LOCALE = "en-GB"

interface LineItemForm {
  id: string | null
  item_id: string | null
  sku: string
  searchInput: string
  quantity: number
  display_unit_cost: string
  isDirty: boolean
  isSaving: boolean
}

const lines = ref<LineItemForm[]>([])
const customerSearchInput = ref("")
const selectedCustomerLabel = ref("")
const headerForm = ref({ customer_id: "", so_number: "" })

const getCustomerLabel = (customer: Customer) => `${customer.first_name} ${customer.last_name || ""}`.trim()
const getItemLabel = (item: Item) => item.title
const searchCustomers = async (query: string): Promise<Customer[]> => (await customerService.getAll(props.workspaceId, query.trim())).items
const searchItems = async (query: string): Promise<Item[]> => (await itemService.getAll(props.workspaceId, query.trim(), 1, 15)).items

const handleAutocompleteError = (error: unknown) => {
  const err = error as any
  const detail = err?.response?.data?.detail || err?.message || "An unexpected error occurred"
  showToast(Array.isArray(detail) ? detail[0]?.msg || "An unexpected error occurred" : detail, "error")
}

const selectCustomer = (customer: Customer) => {
  headerForm.value.customer_id = customer.id
  selectedCustomerLabel.value = getCustomerLabel(customer)
}
const clearCustomerSelection = () => {
  headerForm.value.customer_id = ""
  selectedCustomerLabel.value = ""
}
watch(customerSearchInput, query => {
  if (query.trim() !== selectedCustomerLabel.value) headerForm.value.customer_id = ""
})

const onItemSearchChange = (index: number) => {
  const line = lines.value[index]
  if (!line || line.id) return
  line.item_id = null
  line.sku = ""
  markLineDirty(index)
}
const clearItemSearch = (index: number) => {
  const line = lines.value[index]
  if (!line || line.id) return
  line.item_id = null
  line.sku = ""
  markLineDirty(index)
}
const selectItem = (index: number, item: Item) => {
  const line = lines.value[index]
  if (!line || line.id) return
  markLineDirty(index)
  line.item_id = item.id
  line.sku = item.sku
  line.searchInput = item.title
  line.display_unit_cost = item.base_price != null ? (item.base_price / 100).toFixed(2) : "0.00"
}

watch(() => props.so, newSo => {
  if (props.isOpen && newSo) initFormState(newSo)
}, { deep: true })
watch(() => props.isOpen, open => {
  if (open && props.so) initFormState(props.so)
})

const initFormState = (soData: SellOrder) => {
  headerForm.value = { customer_id: soData.customer_id || "", so_number: soData.so_number || "" }
  const customerLabel = soData.customer ? getCustomerLabel(soData.customer) : ""
  customerSearchInput.value = customerLabel
  selectedCustomerLabel.value = customerLabel

  const mergedLines: LineItemForm[] = []
  soData.sell_order_lines.forEach(backendLine => {
    const existingLocalLine = lines.value.find(line => line.id === backendLine.id)
    if (existingLocalLine?.isDirty) {
      mergedLines.push(existingLocalLine)
    } else {
      mergedLines.push({
        id: backendLine.id,
        item_id: backendLine.item_id,
        sku: backendLine.item?.sku || "",
        searchInput: backendLine.item?.title || "",
        quantity: backendLine.quantity,
        display_unit_cost: (backendLine.unit_cost / 100).toFixed(2),
        isDirty: false,
        isSaving: false,
      })
    }
  })
  mergedLines.push(...lines.value.filter(line => line.id === null))
  lines.value = mergedLines
}

const updateHeader = async () => {
  if (!props.so) return
  if (!headerForm.value.customer_id) {
    showToast("Customer selection is required", "error")
    throw new Error("Customer selection is required")
  }
  try {
    await sellOrderService.update(props.workspaceId, props.so.id, {
      customer_id: headerForm.value.customer_id,
      so_number: headerForm.value.so_number.trim().toUpperCase()
    })
    showToast("SO header details updated successfully", "success")
    emit("updated")
  } catch (error: any) {
    const detail = error.response?.data?.detail || error.message || "An unexpected error occurred"
    showToast(Array.isArray(detail) ? detail[0]?.msg || "An unexpected error occurred" : detail, "error")
    throw error
  }
}

const addLineItem = () => lines.value.push({ id: null, item_id: null, sku: "", searchInput: "", quantity: 1, display_unit_cost: "0.00", isDirty: true, isSaving: false })
const markLineDirty = (index: number) => { if (lines.value[index]) lines.value[index].isDirty = true }
const handlePriceInput = (event: Event, index: number) => {
  const line = lines.value[index]
  if (!line) return
  markLineDirty(index)
  line.display_unit_cost = priceFormatter.formatElement(event.target as HTMLInputElement, "js-price-input")
}
const getLineSubtotal = (line: LineItemForm) => (priceFormatter.toCents(line.display_unit_cost) || 0) * (line.quantity || 0)
const calculatedTotalCents = computed(() => lines.value.reduce((total, line) => total + getLineSubtotal(line), 0))
const formatPrice = (cents: number) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "GBP" }).format(cents / 100)

const saveLineItem = async (index: number) => {
  const line = lines.value[index]
  if (!props.so || !line || !line.item_id) return
  try {
    const payload = { item_id: line.item_id, quantity: line.quantity, unit_cost: priceFormatter.toCents(line.display_unit_cost) || 0 }
    if (line.id) {
      await sellOrderService.updateLine(props.workspaceId, props.so.id, line.id, payload)
      showToast("Line updated successfully", "success")
    } else {
      const newLine = await sellOrderService.addLine(props.workspaceId, props.so.id, payload)
      line.id = newLine.id
      showToast("Line added successfully", "success")
    }
    line.isDirty = false
    emit("updated")
  } catch (error: any) {
    const detail = error.response?.data?.detail || error.message || "An unexpected error occurred"
    showToast(Array.isArray(detail) ? detail[0]?.msg || "An unexpected error occurred" : detail, "error")
    throw error
  }
}

const removeLineItem = async (index: number) => {
  const line = lines.value[index]
  if (!props.so || !line) return
  if (line.id) {
    const isConfirmed = await confirm({ title: "Remove Line Item", message: "Are you sure you want to permanently remove this line item from the sell order?", confirmText: "Remove", variant: "danger" })
    if (!isConfirmed) return
    try {
      await sellOrderService.removeLine(props.workspaceId, props.so.id, line.id)
      showToast("Line removed successfully", "success")
      emit("updated")
    } catch (error: any) {
      const detail = error.response?.data?.detail || error.message || "An unexpected error occurred"
      showToast(Array.isArray(detail) ? detail[0]?.msg || "An unexpected error occurred" : detail, "error")
      throw error
    }
  }
  lines.value.splice(index, 1)
}
const handleClose = () => emit("close")
</script>