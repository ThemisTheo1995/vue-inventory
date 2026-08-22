<!-- src/components/SellOrderCreateModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Create Sell Order"
    description="Draft a new sales order for your workspace."
    max-width="4xl"
    @close="handleClose"
  >
    <template #icon>
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <Plus class="w-5 h-5" />
      </div>
    </template>

    <form id="create-so-form" class="space-y-8 mt-2" @submit.prevent="submitForm">
      
      <!-- Top Metadata Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/50 dark:bg-slate-900/30 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        
        <!-- Customer Autocomplete Search -->
        <div class="space-y-2 relative md:col-span-2" ref="customerContainerRef">
          <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
            Customer <span class="text-red-500">*</span>
          </label>
          <div class="relative group">
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Users class="w-4 h-4" />
            </div>
            <input
              v-model="customerSearchInput"
              @input="onCustomerSearchInput"
              @focus="onCustomerInputFocus"
              type="text"
              placeholder="Search customers by name..."
              required 
              class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-10 py-3 text-sm font-medium text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:font-normal placeholder:text-slate-400"
            />
            <div class="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <svg v-if="isCustomerLoading" class="animate-spin h-4 w-4 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <button
                v-else-if="customerSearchInput"
                type="button"
                @click="clearCustomerSelection"
                class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Customer Dropdown -->
          <Transition 
            enter-active-class="transition duration-150 ease-out" 
            enter-from-class="transform scale-95 opacity-0 translate-y-1" 
            enter-to-class="transform scale-100 opacity-100 translate-y-0" 
            leave-active-class="transition duration-100 ease-in" 
            leave-from-class="transform scale-100 opacity-100" 
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isCustomerDropdownOpen"
              class="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 "
            >
              <div v-if="isCustomerLoading && customers.length === 0" class="p-6 text-center text-sm font-medium text-slate-400">
                Searching customers...
              </div>
              <div v-else-if="customers.length === 0" class="p-6 text-center text-sm font-medium text-slate-400">
                No customers found matching "{{ customerSearchInput }}"
              </div>
              <ul v-else class="py-2 divide-y divide-slate-100 dark:divide-slate-700/50">
                <li
                  v-for="customer in customers"
                  :key="customer.id"
                  @click="selectCustomer(customer)"
                  class="px-4 py-3 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 flex flex-col transition-colors group"
                >
                  <span class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {{ customer.first_name }} {{ customer.last_name || '' }}
                  </span>
                  <span class="text-xs text-slate-500 font-mono mt-0.5">{{ customer.email || 'No email provided' }}</span>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <!-- SO Number -->
        <div class="space-y-2 relative">
          <label class="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
            SO Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.so_number"
            required
            type="text"
            maxlength="100"
            placeholder="e.g. SO-2026-001"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-mono font-bold uppercase text-slate-900 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
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
          <p class="text-sm font-medium mt-2">No line items added.<br/><span class="text-xs font-normal text-slate-400">Click 'Add Row' to start populating your sales order.</span></p>
        </div>

        <!-- Data Grid -->
        <div v-else class="space-y-3">
          <!-- Desktop Grid Header -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div class="col-span-4">Product</div>
            <div class="col-span-2">SKU</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-2 text-right">Unit Price</div>
            <div class="col-span-2 text-right">Total</div>
            <div class="col-span-1"></div>
          </div>

          <!-- Hybrid Grid Rows -->
          <div 
            v-for="(line, index) in lines" 
            :key="index"
            :class="[
              'relative p-4 md:p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all js-item-search-container group',
              line.isDropdownOpen ? 'z-50 ring-2 ring-brand-500/20' : 'z-10'
            ]"
          >
            <div class="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-4 md:items-center">
              
              <!-- Product Search -->
              <div class="md:col-span-4 relative w-full">
                
                <!-- Mobile Label & Delete Button Header (FIXED MOBILE LAYOUT) -->
                <div class="md:hidden flex justify-between items-center mb-2">
                  <span class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Product</span>
                  <button
                    type="button"
                    @click="removeLineItem(index)"
                    class="text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-sm active:scale-95 transition-all flex items-center justify-center"
                    title="Remove row"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <input
                  v-model="line.searchInput"
                  @input="onItemSearchInput(index)"
                  @focus="onItemInputFocus(index)"
                  type="text"
                  required
                  placeholder="Search product..."
                  class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
                
                <!-- Product Autocomplete Dropdown -->
                <Transition 
                  enter-active-class="transition duration-150 ease-out" 
                  enter-from-class="transform scale-95 opacity-0 translate-y-1" 
                  enter-to-class="transform scale-100 opacity-100 translate-y-0" 
                  leave-active-class="transition duration-100 ease-in" 
                  leave-from-class="transform scale-100 opacity-100" 
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div 
                    v-if="line.isDropdownOpen" 
                    class="absolute z-50 left-0 w-[100%] md:w-[150%] mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 "
                  >
                    <div v-if="line.isSearching" class="p-4 text-center text-xs font-medium text-slate-400">
                      Searching catalog...
                    </div>
                    <div v-else-if="line.searchResults.length === 0" class="p-4 text-center text-xs font-medium text-slate-400">
                      No items found matching "{{ line.searchInput }}"
                    </div>
                    <ul v-else class="py-1.5 divide-y divide-slate-100 dark:divide-slate-700/50">
                      <li
                        v-for="item in line.searchResults"
                        :key="item.id"
                        @click="selectItem(index, item)"
                        class="px-4 py-2.5 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 flex flex-col transition-colors group/item"
                      >
                        <span class="font-bold text-sm text-slate-900 dark:text-white group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 truncate">{{ item.title }}</span>
                        <span class="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {{ item.sku || 'N/A' }}</span>
                      </li>
                    </ul>
                  </div>
                </Transition>
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
                  <span class="md:hidden block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-right">Price</span>
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

      <!-- Footer calculated sums -->
      <div class="relative z-10 bg-slate-900 dark:bg-slate-100 p-5 sm:p-6 rounded-2xl shadow-xl flex justify-between items-center mt-8">
        <span class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Grand Total
        </span>
        <span class="text-2xl sm:text-3xl font-black text-white dark:text-slate-900 font-mono tracking-tight leading-none">
          {{ formatPrice(calculatedTotalCents) }}
        </span>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          @click="handleClose"
          class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="create-so-form"
          :disabled="isSubmitting || lines.length === 0 || !form.customer_id"
          class="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/30 dark:shadow-none active:scale-95"
        >
          {{ isSubmitting ? "Creating Draft..." : "Create Draft" }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { Plus, Trash2, X, Users, PackageOpen } from "lucide-vue-next"
import BaseModal from "@/components/ui/BaseModal.vue"
import { useToast } from "@/composables/useToast"
import { sellOrderService } from "../services/sell_order.service"
import { itemService } from "../../items/services/item.service"
import { customerService } from "../../customers/services/customer.service"
import { priceFormatter } from "@/utils/priceFormatter"
import type { SellOrder } from "../types/sell_order.types"
import type { Item } from "../../items/types/item.types"
import type { Customer } from "../../customers/types/customer.types"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created", so: SellOrder): void
}>()

const { showToast } = useToast()

const CURRENCY_SYMBOL = "£"
const LOCALE = "en-GB"

const isSubmitting = ref(false)

// Elements references
const customerContainerRef = ref<HTMLElement | null>(null)

// Customer Autocomplete Variables
const customers = ref<Customer[]>([])
const customerSearchInput = ref("")
const selectedCustomer = ref<Customer | null>(null)
const isCustomerDropdownOpen = ref(false)
const isCustomerLoading = ref(false)
let customerSearchTimeout: ReturnType<typeof setTimeout> | null = null

interface LineItemForm {
  item_id: string | null;
  sku: string;
  searchInput: string;
  isSearching: boolean;
  isDropdownOpen: boolean;
  searchResults: Item[];
  quantity: number;
  display_unit_cost: string;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

const form = ref({
  customer_id: "",
  so_number: ""
})

const lines = ref<LineItemForm[]>([])

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = { customer_id: "", so_number: "" }
      lines.value = []
      clearCustomerSelection()
      addLineItem()
    }
  }
)

// Customer Autocomplete
const onCustomerSearchInput = () => {
  const query = customerSearchInput.value.trim()

  // Reset selected state if input changes
  if (selectedCustomer.value && query !== `${selectedCustomer.value.first_name} ${selectedCustomer.value.last_name || ''}`.trim()) {
    selectedCustomer.value = null
    form.value.customer_id = ""
  }

  if (query.length < 3) {
    customers.value = []
    isCustomerDropdownOpen.value = false
    return
  }

  isCustomerDropdownOpen.value = true

  if (customerSearchTimeout) clearTimeout(customerSearchTimeout)
  customerSearchTimeout = setTimeout(async () => {
    isCustomerLoading.value = true
    try {
      const customersData = await customerService.getAll(props.workspaceId, query)
      customers.value = customersData.items
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.detail || 
        err.message || 
        "An unexpected error occurred"

        const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage

    showToast(displayMessage, "error")
    } finally {
      isCustomerLoading.value = false
    }
  }, 300)
}

const onCustomerInputFocus = () => {
  if (customerSearchInput.value.trim().length >= 3) {
    isCustomerDropdownOpen.value = true
  }
}

const selectCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  form.value.customer_id = customer.id
  customerSearchInput.value = `${customer.first_name} ${customer.last_name || ''}`.trim()
  isCustomerDropdownOpen.value = false
}

const clearCustomerSelection = () => {
  customerSearchInput.value = ""
  selectedCustomer.value = null
  form.value.customer_id = ""
  customers.value = []
  isCustomerDropdownOpen.value = false
}

// Line Items
const addLineItem = () => {
  lines.value.push({
    item_id: null,
    sku: "",
    searchInput: "",
    isSearching: false,
    isDropdownOpen: false,
    searchResults: [],
    quantity: 1,
    display_unit_cost: "0.00",
    timeoutId: null
  })
}

const removeLineItem = (index: number) => {
  const line = lines.value[index]
  if (line?.timeoutId) clearTimeout(line.timeoutId)
  lines.value.splice(index, 1)
}

const onItemSearchInput = (index: number) => {
  const line = lines.value[index]
  if (!line) return

  const query = line.searchInput.trim()

  // Reset internal item bindings if string alters
  if (line.item_id) {
    line.item_id = null
    line.sku = ""
  }

  if (query.length < 3) {
    line.searchResults = []
    line.isDropdownOpen = false
    return
  }

  line.isDropdownOpen = true

  if (line.timeoutId) clearTimeout(line.timeoutId)
  line.timeoutId = setTimeout(async () => {
    line.isSearching = true
    try {
      const data = await itemService.getAll(props.workspaceId, query, 1, 15)
      line.searchResults = data.items
    } catch (error: any) {
      const errorMessage = 
          error.response?.data?.detail || 
          error.message || 
          "An unexpected error occurred";

      const displayMessage = Array.isArray(errorMessage) 
          ? errorMessage[0].msg 
          : errorMessage;

      showToast(displayMessage, "error")

    } finally {
      line.isSearching = false
    }
  }, 300)
}

const onItemInputFocus = (index: number) => {
  const line = lines.value[index]
  if (line && line.searchInput.trim().length >= 3) {
    line.isDropdownOpen = true
  }
}

const selectItem = (index: number, item: Item) => {
  const line = lines.value[index]
  if (!line) return

  line.item_id = item.id
  line.sku = item.sku
  line.searchInput = item.title
  line.isDropdownOpen = false

  if (item.base_price !== null && item.base_price !== undefined) {
    line.display_unit_cost = (item.base_price / 100).toFixed(2)
  } else {
    line.display_unit_cost = "0.00"
  }
}

// Price and Math
const handlePriceInput = (event: Event, index: number) => {
  const line = lines.value[index]
  if (line) {
    const el = event.target as HTMLInputElement
    line.display_unit_cost = priceFormatter.formatElement(el, "js-price-input")
  }
}

const getLineSubtotal = (line: LineItemForm) => {
  const cents = priceFormatter.toCents(line.display_unit_cost) || 0
  return cents * (line.quantity || 0)
}

const calculatedTotalCents = computed(() => {
  return lines.value.reduce((total, line) => total + getLineSubtotal(line), 0)
})

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'GBP'
  }).format(cents / 100)
}

const handleClose = () => {
  emit("close")
}

// Global Click Outside logic
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element | null
  
  // Close customer dropdown if clicking outside
  if (customerContainerRef.value && !customerContainerRef.value.contains(target)) {
    isCustomerDropdownOpen.value = false
  }

  // Close item dropdowns if clicking completely outside any item search container
  if (target && !target.closest('.js-item-search-container')) {
    lines.value.forEach(line => line.isDropdownOpen = false)
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside)
  if (customerSearchTimeout) clearTimeout(customerSearchTimeout)
  lines.value.forEach(line => {
    if (line.timeoutId) clearTimeout(line.timeoutId)
  })
})

const submitForm = async () => {
  if (!form.value.customer_id) {
    showToast("Please choose a Customer", "error")
    return
  }

  if (lines.value.some(l => !l.item_id || l.quantity < 1)) {
    showToast("Please make sure all line items contain resolved products with correct quantities", "error")
    return
  }

  try {
    isSubmitting.value = true
    
    const payload = {
      customer_id: form.value.customer_id,
      so_number: form.value.so_number.trim().toUpperCase(),
      status: "DRAFT" as const, 
      sell_order_lines: lines.value.map(l => ({
        item_id: l.item_id as string,
        quantity: l.quantity,
        unit_cost: priceFormatter.toCents(l.display_unit_cost) || 0
      }))
    }

    const newSO = await sellOrderService.create(props.workspaceId, payload)
    
    showToast("Sell order draft created successfully", "success")
    emit("created", newSO)
    handleClose()
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
