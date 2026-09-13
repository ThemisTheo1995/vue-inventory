<!-- src/features/views/inventory/InventoryView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Inventory' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Monitor stock levels and manage inventory movements.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          @click="openAdjustModal()"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <ArrowRightLeft class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Adjust Stock</span>
        </button>
      </div>
    </header>

    <!-- Reusable Table Component -->
    <BaseTable
      v-model:search-query="searchQuery"
      :items="balances"
      :is-loading="isTableLoading"
      :is-searching="isSearching"
      :is-read-only="isReadOnly"
      :current-page="currentPage"
      :total-items="totalBalances"
      :items-per-page="itemsPerPage"
      :total-pages="totalPages"
      :show-search="true"
      search-placeholder="Search by Title or SKU..."
      empty-title="No inventory tracked"
      :empty-description="isReadOnly ? 'There are currently no inventory balances in this workspace.' : 'Stock balances will appear here when items are received or adjusted.'"
      create-button-text="Make Manual Adjustment"
      :column-span="isReadOnly ? 5 : 6"
      @create="openAdjustModal()"
      @prev-page="prevPage"
      @next-page="nextPage"
    >
      <!-- ================= CUSTOM TOOLBAR TITLE SLOT ================= -->
      <template #toolbar-title>
        <h2 class="text-sm font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          Current Balances
        </h2>
      </template>

      <!-- ================= CUSTOM TOOLBAR ACTIONS SLOT ================= -->
      <template #toolbar-actions>
        <AsyncButton
          :action="fetchBalances"
          v-tooltip="'Refresh balances'"
          class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors active:scale-95 cursor-pointer"
        >
          <RefreshCw class="w-4 h-4" />
        </AsyncButton>
      </template>

      <!-- ================= MOBILE CARDS SLOT ================= -->
      <template #mobile-cards>
        <div 
          v-for="balance in balances" 
          :key="balance.id"
          @click="navigateToItemDetails(balance.item_id)"
          class="relative p-4 sm:p-5
            rounded-lg
            hover:bg-slate-50 dark:hover:bg-slate-900
            active:bg-slate-100 dark:active:bg-slate-900
            transition-colors cursor-pointer group
            border-b dark:border-slate-900 last:border-0"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                <Package class="w-5 h-5" />
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                  {{ balance.item?.title || 'Unknown Item' }}
                </p>
                <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1" v-if="balance.item?.sku">
                  SKU: {{ balance.item.sku }}
                </p>
              </div>
            </div>
            <div v-if="!isReadOnly">
              <button
                @click.stop="openAdjustModal(balance.item_id)"
                v-tooltip="'Adjust stock for this item'"
                class="p-2 -mt-2 -mr-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-full hover:bg-brand-50 dark:hover:bg-brand-400/10 transition-colors cursor-pointer"
              >
                <ArrowRightLeft class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Mobile Stats Grid -->
          <div class="grid grid-cols-3 gap-2 mb-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl p-2 border border-slate-100 dark:border-slate-800/50">
            <div class="text-center p-1.5 rounded-lg">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">On Hand</p>
              <p class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{ balance.quantity_on_hand }}</p>
            </div>
            <div class="text-center p-1.5 rounded-lg bg-amber-50/50 dark:bg-amber-900/10">
              <p class="text-[10px] font-bold uppercase tracking-wider text-amber-600/80 dark:text-amber-500/80 mb-0.5">Allocated</p>
              <p :class="['font-mono text-sm font-bold', balance.quantity_allocated > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400']">{{ balance.quantity_allocated }}</p>
            </div>
            <div class="text-center p-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
              <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-500/80 mb-0.5">On Order</p>
              <p :class="['font-mono text-sm font-bold', balance.quantity_on_order > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400']">{{ balance.quantity_on_order }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Available Stock</span>
            <span 
              :class="[
                'font-mono text-base font-black px-3 py-1 rounded-md shadow-sm border',
                balance.quantity_available > 0 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
              ]"
            >
              {{ balance.quantity_available }}
            </span>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE HEADERS SLOT ================= -->
      <template #desktop-headers>
        <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 w-[26%]">
          Item Details
        </th>
        <th class="px-6 py-4 text-right w-[15%]">
          <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span>On Hand</span>
            <Info 
              class="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-help" 
              v-tooltip="'Total physical inventory currently in stock'" 
            />
          </div>
        </th>
        <th class="px-6 py-4 text-right w-[15%]">
          <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-500/80">
            <span>Allocated</span>
            <Info 
              class="w-3 h-3 text-amber-500/40 cursor-help" 
              v-tooltip="'Quantity reserved for CONFIRMED sell orders'" 
            />
          </div>
        </th>
        <th class="px-6 py-4 text-right w-[15%]">
          <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-blue-500/80">
            <span>On Order</span>
            <Info 
              class="w-3 h-3 text-blue-500/40 cursor-help" 
              v-tooltip="'Quantity currently on incoming (SENT) purchase order'" 
            />
          </div>
        </th>
        <th class="px-6 py-4 text-right w-[17%]">
          <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
            <CheckCircle class="w-3.5 h-3.5" />
            <span>Available</span>
            <Info 
              class="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-help" 
              v-tooltip="'Ready-to-use stock (ON HAND minus ALLOCATED)'" 
            />
          </div>
        </th>
        <th v-if="!isReadOnly" class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right w-[12%]">
          Actions
        </th>
      </template>

      <!-- ================= DESKTOP TABLE ROWS SLOT ================= -->
      <template #desktop-rows>
        <tr
          v-for="balance in balances"
          :key="balance.id"
          @click="navigateToItemDetails(balance.item_id)"
          class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
        >
          <td class="px-6 py-4 relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                <Package class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {{ balance.item?.title || 'Unknown Item' }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider truncate mt-0.5" v-if="balance.item?.sku">
                  SKU: {{ balance.item.sku }}
                </p>
              </div>
            </div>
          </td>
          
          <td class="px-6 py-4 text-right">
            <span class="font-mono text-sm font-bold text-slate-900 dark:text-slate-300">
              {{ balance.quantity_on_hand }}
            </span>
          </td>

          <td class="px-6 py-4 text-right">
            <span :class="['font-mono text-sm font-bold', balance.quantity_allocated > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400 dark:text-slate-500']">
              {{ balance.quantity_allocated }}
            </span>
          </td>

          <td class="px-6 py-4 text-right">
            <span :class="['font-mono text-sm font-bold', balance.quantity_on_order > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500']">
              {{ balance.quantity_on_order }}
            </span>
          </td>

          <td class="px-6 py-4 text-right">
            <span 
              :class="[
                'inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-md text-sm font-mono font-black shadow-sm border',
                balance.quantity_available > 0 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
              ]"
            >
              {{ balance.quantity_available }}
            </span>
          </td>

          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end" @click.stop>
              <button
                @click.stop="openAdjustModal(balance.item_id)"
                v-tooltip="'Adjust Stock'"
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-400/10 rounded-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <ArrowRightLeft class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <!-- Modal for adding StockMovements -->
    <StockAdjustModal 
      v-if="!isReadOnly" 
      :is-open="isAdjustModalOpen" 
      :workspace-id="workspaceId" 
      :preselected-item-id="selectedItemId"
      :preselected-item-title="selectedItemTitle"
      :preselected-item-sku="selectedItemSku"
      @close="closeAdjustModal" 
      @created="onStockAdjusted" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { 
  ArrowRightLeft, 
  Package, 
  RefreshCw, 
  CheckCircle,
  Info
} from "lucide-vue-next"

import { useToast } from "@/composables/useToast"
import BaseTable from "@/components/ui/table/BaseTable.vue"
import AsyncButton from "@/components/layout/AsyncButton.vue"

import StockAdjustModal from "./StockAdjustModal.vue" 

import { inventoryService } from "../services/inventory.service"
import type { Inventory } from "../types/inventory.types"

// --- Logic ---
const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { showToast } = useToast()

const balances = ref<Inventory[]>([])
const isLoading = ref(true)

// Search & Pagination State
const searchQuery = ref("")
const isSearching = ref(false)
const searchTimeout = ref<number | null>(null)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalBalances = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalBalances.value / itemsPerPage.value)))

// Modal State
const isAdjustModalOpen = ref(false)
const selectedItemId = ref<string | null>(null)
const selectedItemTitle = ref<string | null>(null)
const selectedItemSku = ref<string | null>(null)

const isTableLoading = computed(() => isLoading.value && !isSearching.value)

// --- Watchers for Search Debounce ---
watch(searchQuery, (newVal) => {
  isSearching.value = true
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = window.setTimeout(async () => {
    currentPage.value = 1
    await fetchBalances()
    isSearching.value = false
  }, 400)
})

// --- API Calls ---
const fetchBalances = async () => {
  if (!isSearching.value) isLoading.value = true

  try {
    const data = await inventoryService.getInventories(
      workspaceId,
      searchQuery.value || undefined, // Search query
      currentPage.value,              // Page
      itemsPerPage.value,             // Limit
      ['item']                        // Expand
    )
    
    balances.value = data.items || []
    totalBalances.value = data.total || 0
  } catch (err: any) {
    const errorMessage = 
        err.response?.data?.detail || 
        err.message || 
        "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage

    showToast(displayMessage, "error")
    throw err
  } finally {
    isLoading.value = false
  }
}

// --- Pagination Controls ---
const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  await fetchBalances()
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  await fetchBalances()
}

const navigateToItemDetails = (itemId: string) => {
  router.push({ name: "item-details", params: { id: itemId } })
}

// --- Modal Controls ---
const openAdjustModal = (itemId?: string) => {
  selectedItemId.value = itemId || null
  if (itemId) {
    const found = balances.value.find(b => b.item_id === itemId)
    selectedItemTitle.value = found?.item?.title || null
    selectedItemSku.value = found?.item?.sku || null
  } else {
    selectedItemTitle.value = null
    selectedItemSku.value = null
  }
  isAdjustModalOpen.value = true
}

const closeAdjustModal = () => {
  isAdjustModalOpen.value = false
  setTimeout(() => { 
    selectedItemId.value = null 
    selectedItemTitle.value = null
    selectedItemSku.value = null
  }, 200)
}

const onStockAdjusted = async () => {
  showToast("Stock adjustment recorded", "success")
  closeAdjustModal()
  await fetchBalances()
}

onMounted(() => {
  fetchBalances()
})
</script>
