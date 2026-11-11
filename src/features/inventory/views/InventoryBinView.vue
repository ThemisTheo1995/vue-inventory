
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-full mx-auto">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Stock & Bins' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Monitor physical stock levels across bins and manage inventory movements.' }}
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

    <BaseTable
      v-model:search-query="searchQuery"
      v-model:selected-filters="activeFilters"
      :filters="tableFilters"
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
      :empty-description="isDeletedView
        ? 'There are no deleted inventory records.'
        : isReadOnly
          ? 'There are currently no inventory balances in this workspace.'
          : 'Stock balances will appear here when items are received or adjusted.'"
      create-button-text="Make Manual Adjustment"
      :column-span="isReadOnly ? 4 : 5"
      @create="openAdjustModal()"
      @prev-page="prevPage"
      @next-page="nextPage"
      @filter-change="onFilterChange"
    >
      <template #toolbar-title>
        <h2 class="text-sm font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          Current Balances
        </h2>
      </template>

      <template #toolbar-actions>
        <AsyncButton
          :action="fetchBalances"
          v-tooltip="'Refresh balances'"
          class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors active:scale-95 cursor-pointer"
        >
          <RefreshCw class="w-4 h-4" />
        </AsyncButton>
      </template>

      <template #mobile-cards>
        <div
          v-for="balance in balances"
          :key="balance.id"
          @click="!balance.is_deleted && navigateToInventoryDetails(balance.id)"
          :class="[
            'relative p-4 sm:p-5 rounded-lg transition-colors border-b dark:border-slate-900 last:border-0',
            balance.is_deleted
              ? 'bg-red-50/80 dark:bg-red-950/30 border-l-4 border-l-red-500 dark:border-l-red-600 shadow-sm cursor-default'
              : 'hover:bg-slate-50 dark:hover:bg-slate-900 active:bg-slate-100 dark:active:bg-slate-900 cursor-pointer group'
          ]"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex items-center justify-center w-12 h-12 rounded-xl shadow-sm border group-hover:scale-105 transition-transform',
                  balance.is_deleted
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                ]"
              >
                <Package class="w-5 h-5" />
              </div>

              <div>
                <p class="font-bold text-slate-900 dark:text-white text-sm leading-tight flex items-center gap-2 flex-wrap">
                  {{ balance.item?.title || 'Unknown Item' }}

                  <span
                    v-if="balance.is_deleted"
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 uppercase tracking-widest border border-red-200 dark:border-red-800/50"
                  >
                    Deleted
                  </span>
                </p>

                <p v-if="balance.item?.sku" class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                  SKU: {{ balance.item.sku }}
                </p>

                <div v-if="balance.bin" class="mt-2">
                  <span
                    @click.stop="navigateToBinDetails(balance.bin.id)"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ShelvingUnit class="w-3 h-3 text-slate-400" />
                    Bin: {{ balance.bin.code || balance.bin.zone }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="!isReadOnly" class="flex items-center gap-1" @click.stop>
              <AsyncButton
                v-if="balance.is_deleted"
                :action="() => updateInventoryStatus(balance.id, false)"
                v-tooltip="'Reinstate Inventory'"
                class="!p-2 -mt-2 -mr-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:!bg-emerald-50 dark:hover:!bg-emerald-400/10 transition-colors"
              >
                <RotateCcw class="w-4 h-4" />
              </AsyncButton>

              <AsyncButton
                v-else-if="balance.quantity_on_hand === 0"
                :action="() => updateInventoryStatus(balance.id, true)"
                v-tooltip="'Delete Inventory'"
                class="!p-2 -mt-2 -mr-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:!bg-red-50 dark:hover:!bg-red-400/10 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>

              <AsyncButton
                v-if="!balance.is_deleted"
                :action="() => openAdjustModal(balance.item_id, balance.bin_id, balance.item?.title, balance.item?.sku, balance.bin?.code)"
                v-tooltip="'Adjust stock for this item'"
                class="!p-2 -mt-2 -mr-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-full hover:!bg-brand-50 dark:hover:!bg-brand-400/10 transition-colors"
              >
                <ArrowRightLeft class="w-4 h-4" />
              </AsyncButton>
            </div>
          </div>

          <div
            class="flex items-center justify-between pt-2 pb-1 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl px-4 border border-slate-100 dark:border-slate-800/50"
          >
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              On Hand Stock
            </span>
            <span class="font-mono text-base font-black text-slate-900 dark:text-white">
              {{ balance.quantity_on_hand }}
            </span>
          </div>
        </div>
      </template>

      <template #desktop-headers>
        <th class="w-[20%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Date Created
        </th>
        <th class="w-[30%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Item Details
        </th>
        <th class="w-[25%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Bin Location
        </th>
        <th class="w-[10%] px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
          <div class="flex items-center justify-end gap-1.5">
            <span>On Hand</span>
            <Info class="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-help" v-tooltip="'Total physical inventory in this bin'" />
          </div>
        </th>
        <th v-if="!isReadOnly" class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">
          Actions
        </th>
      </template>

      <template #desktop-rows>
        <tr
          v-for="balance in balances"
          :key="balance.id"
          @click="!balance.is_deleted && navigateToInventoryDetails(balance.id)"
          :class="[
            'group transition-colors',
            balance.is_deleted
              ? 'bg-red-50/80 dark:bg-red-950/30 border-l-4 border-l-red-500 dark:border-l-red-600 cursor-default'
              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer'
          ]"
        >
          <td class="px-6 py-4 relative">
            <div
              v-if="!balance.is_deleted"
              class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                {{ formatDateTime(balance.created_at).date }}
              </span>
              <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                {{ formatDateTime(balance.created_at).time }}
              </span>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl shadow-sm border group-hover:scale-105 transition-transform',
                  balance.is_deleted
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                ]"
              >
                <Package class="w-4 h-4" />
              </div>

              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-xs truncate flex items-center gap-2">
                  {{ balance.item?.title || 'Unknown Item' }}

                  <span
                    v-if="balance.is_deleted"
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 uppercase tracking-widest border border-red-200 dark:border-red-800/50 shrink-0"
                  >
                    Deleted
                  </span>
                </p>

                <p v-if="balance.item?.sku" class="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider truncate mt-0.5">
                  SKU: {{ balance.item.sku }}
                </p>
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
            <div v-if="balance.bin" @click.stop="navigateToBinDetails(balance.bin.id)">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <ShelvingUnit class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span class="truncate">{{ balance.bin.code || balance.bin.zone }}</span>
              </span>
            </div>
            <span v-else class="text-xs text-slate-400 dark:text-slate-600 italic">
              Unassigned
            </span>
          </td>

          <td class="px-6 py-4 text-right">
            <span class="font-mono text-sm font-bold text-slate-900 dark:text-slate-300">
              {{ balance.quantity_on_hand }}
            </span>
          </td>

          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-1" @click.stop>
              <AsyncButton
                v-if="balance.is_deleted"
                :action="() => updateInventoryStatus(balance.id, false)"
                v-tooltip="'Reinstate Inventory'"
                class="!p-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:!bg-emerald-50 dark:hover:!bg-emerald-400/10 rounded-lg transition-all transform active:scale-95"
              >
                <RotateCcw class="w-4 h-4" />
              </AsyncButton>

              <AsyncButton
                v-else-if="balance.quantity_on_hand === 0"
                :action="() => updateInventoryStatus(balance.id, true)"
                v-tooltip="'Delete Inventory'"
                class="!p-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-400/10 rounded-lg transition-all transform active:scale-95"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>

              <AsyncButton
                v-if="!balance.is_deleted"
                :action="() => openAdjustModal(balance.item_id, balance.bin_id, balance.item?.title, balance.item?.sku, balance.bin?.code)"
                v-tooltip="'Adjust Stock'"
                class="!p-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:!bg-brand-50 dark:hover:!bg-brand-400/10 rounded-lg transition-all transform active:scale-95"
              >
                <ArrowRightLeft class="w-4 h-4" />
              </AsyncButton>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <StockAdjustModal
      v-if="!isReadOnly"
      :is-open="isAdjustModalOpen"
      :workspace-id="workspaceId"
      :preselected-item-id="selectedItemId"
      :preselected-item-title="selectedItemTitle"
      :preselected-item-sku="selectedItemSku"
      :preselected-bin-id="selectedBinId"
      :preselected-bin-code="selectedBinCode"
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
  Info,
  Package,
  RefreshCw,
  RotateCcw,
  ShelvingUnit,
  Trash2
} from "lucide-vue-next"

import { useToast } from "@/composables/useToast"
import { useConfirm } from "@/composables/useConfirm"

import BaseTable from "@/components/ui/table/BaseTable.vue"
import AsyncButton from "@/components/layout/AsyncButton.vue"
import StockAdjustModal from "./StockAdjustModal.vue"
import type { TableFilter } from "@/components/ui/table/types/filter.types.ts"
import { inventoryService } from "../services/inventory.service"
import type {
  InventoryExpanded,
  InventoryFilterParams
} from "../types/inventory.types"
import { formatDateTime } from "@/utils/dateFormatter"

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const balances = ref<InventoryExpanded[]>([])
const isLoading = ref(true)

const searchQuery = ref(
  typeof route.query.search === "string"
    ? route.query.search
    : ""
)

const isSearching = ref(false)
const searchTimeout = ref<number | null>(null)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalBalances = ref(0)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalBalances.value / itemsPerPage.value))
)

const isTableLoading = computed(() => isLoading.value && !isSearching.value)

const tableFilters = ref<TableFilter[]>([])
const activeFilters = ref<InventoryFilterParams>({
  is_deleted: false,
})

const isDeletedView = computed(
  () =>
    activeFilters.value.is_deleted === true ||
    activeFilters.value.is_deleted === 'true'
)

const isAdjustModalOpen = ref(false)
const selectedItemId = ref<string | null>(null)
const selectedItemTitle = ref<string | null>(null)
const selectedItemSku = ref<string | null>(null)
const selectedBinId = ref<string | null>(null)
const selectedBinCode = ref<string | null>(null)

watch(searchQuery, () => {
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

const fetchBalances = async () => {
  if (!isSearching.value) isLoading.value = true

  try {
    const data = await inventoryService.getInventories(
      workspaceId,
      searchQuery.value || undefined,
      currentPage.value,
      itemsPerPage.value,
      ['item', 'bin'],
      activeFilters.value
    )

    balances.value = data.items || []
    totalBalances.value = data.total || 0
    tableFilters.value = data.filters || []
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.detail ||
      err.message ||
      "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage[0]?.msg || "An unexpected error occurred"
      : errorMessage

    showToast(displayMessage, "error")
  } finally {
    isLoading.value = false
  }
}

const onFilterChange = async () => {
  currentPage.value = 1
  await fetchBalances()
}

const updateInventoryStatus = async (
  inventoryId: string,
  isDeleted: boolean
) => {
  const confirmed = await confirm({
    title: isDeleted ? "Delete Inventory" : "Reinstate Inventory",
    message: isDeleted
      ? "Are you sure you want to delete this inventory record?"
      : "Are you sure you want to reinstate this inventory record?",
    confirmText: isDeleted ? "Delete" : "Reinstate",
    cancelText: "Cancel",
    variant: isDeleted ? "danger" : "primary",
  })

  if (!confirmed) return

  try {
    await inventoryService.updateInventory(
      workspaceId,
      inventoryId,
      { is_deleted: isDeleted }
    )

    showToast(
      isDeleted
        ? "Inventory deleted successfully"
        : "Inventory reinstated successfully",
      "success"
    )

    await fetchBalances()
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.detail ||
      err.message ||
      `Failed to ${isDeleted ? "delete" : "reinstate"} inventory`

    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage[0]?.msg || "Failed to update inventory"
      : errorMessage

    showToast(displayMessage, "error")
  }
}

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

const navigateToInventoryDetails = (inventoryId: string) => {
  router.push({ name: "inventory-details", params: { id: inventoryId } })
}

const navigateToBinDetails = (binId: string) => {
  router.push({ name: "bin-details", params: { id: binId } })
}

const openAdjustModal = (
  itemId?: string,
  binId?: string | null,
  itemTitle?: string | null,
  itemSku?: string | null,
  binCode?: string | null
) => {
  selectedItemId.value = itemId || null
  selectedBinId.value = binId || null
  selectedItemTitle.value = itemTitle || null
  selectedItemSku.value = itemSku || null
  selectedBinCode.value = binCode || null
  isAdjustModalOpen.value = true
}

const closeAdjustModal = () => {
  isAdjustModalOpen.value = false

  setTimeout(() => {
    selectedItemId.value = null
    selectedItemTitle.value = null
    selectedItemSku.value = null
    selectedBinId.value = null
    selectedBinCode.value = null
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
