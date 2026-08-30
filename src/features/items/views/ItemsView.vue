<!-- src/views/items/ItemsView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Items' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Manage your product catalog and inventory base.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          @click="isCreateModalOpen = true"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Add Item</span>
        </button>
      </div>
    </header>

    <!-- Reusable Table Component -->
    <BaseTable
      v-model:search-query="searchQuery"
      :items="items"
      :is-loading="isTableLoading"
      :is-searching="isSearching"
      :is-read-only="isReadOnly"
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :total-pages="totalPages"
      search-placeholder="Search items by title or SKU..."
      empty-title="No items found"
      :empty-description="isReadOnly ? 'There are currently no items matching your search.' : 'Get started by adding your first product to the catalog.'"
      create-button-text="Add First Item"
      :column-span="isReadOnly ? 3 : 4"
      @create="isCreateModalOpen = true"
      @prev-page="prevPage"
      @next-page="nextPage"
    >
      <!-- ================= MOBILE CARDS SLOT ================= -->
      <template #mobile-cards>
        <div 
          v-for="item in items" 
          :key="item.id"
          @click="navigateToItem(item.id)"
          class="relative p-4 sm:p-5
            rounded-lg
            hover:bg-slate-50 dark:hover:bg-slate-900
            active:bg-slate-100 dark:active:bg-slate-900
            transition-colors cursor-pointer group
            border-b dark:border-slate-900 last:border-0"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-lg shadow-sm border border-teal-100 dark:border-teal-800/50 group-hover:scale-105 transition-transform">
                {{ item.title?.charAt(0)?.toUpperCase() || 'I' }}
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white text-base leading-tight">
                  {{ item.title }}
                </p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                  ID: {{ item.id.slice(0, 8) }}
                </p>
              </div>
            </div>
            <div v-if="!isReadOnly">
              <button
                @click.stop="deleteItem(item)"
                class="p-2 -mt-2 -mr-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                title="Delete item"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <Tag class="w-3 h-3 text-slate-400" />
              {{ item.sku }}
            </span>
            
            <div class="text-right">
              <span v-if="item.base_price !== null" class="font-mono text-base font-bold text-slate-900 dark:text-white">
                {{ formatPrice(item.base_price) }}
              </span>
              <span v-else class="text-xs font-medium text-slate-400 italic px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                Unset
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE HEADERS SLOT ================= -->
      <template #desktop-headers>
        <th :class="[itemColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Item
        </th>
        <th :class="[skuColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          SKU
        </th>
        <th :class="[priceColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Base Price
        </th>
        <th v-if="!isReadOnly" class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">
          Actions
        </th>
      </template>

      <!-- ================= DESKTOP TABLE ROWS SLOT ================= -->
      <template #desktop-rows>
        <tr
          v-for="item in items"
          :key="item.id"
          @click="navigateToItem(item.id)"
          class="group hover:bg-slate-50/80 dark:hover:bg-slate-900/90 transition-colors cursor-pointer"
        >
          <!-- First cell gets 'relative' for the highlight line -->
          <td class="px-6 py-4 relative">
            <!-- Interactive left border highlight -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold text-sm shadow-sm border border-teal-100 dark:border-teal-800/50 group-hover:scale-105 transition-transform">
                {{ item.title?.charAt(0)?.toUpperCase() || 'I' }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-sm truncate" :title="item.title">
                  {{ item.title }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate">
                  ID: {{ item.id.slice(0, 8) }}
                </p>
              </div>
            </div>
          </td>
          
          <td class="px-6 py-4">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm" :title="`SKU: ${item.sku}`">
              <Tag class="w-3 h-3 text-slate-400" />
              {{ item.sku }}
            </span>
          </td>

          <td class="px-6 py-4">
            <span v-if="item.base_price !== null" class="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {{ formatPrice(item.base_price) }}
            </span>
            <span v-else class="text-xs font-medium text-slate-400 italic px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              Unset
            </span>
          </td>

          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end" @click.stop>
              <button
                @click.stop="deleteItem(item)"
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-all transform active:scale-95"
                title="Delete item"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <ItemCreateModal 
      v-if="!isReadOnly" 
      :is-open="isCreateModalOpen" 
      :workspace-id="workspaceId" 
      @close="isCreateModalOpen = false" 
      @created="onItemCreated" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Plus, Trash2, Tag } from "lucide-vue-next"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import BaseTable from "@/components/ui/BaseTable.vue"
import ItemCreateModal from "./ItemCreateModal.vue"

import { itemService } from "../services/item.service"
import type { Item } from "../types/item.types"

// --- Logic ---
const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")
const CURRENCY_CODE = 'GBP'
const LOCALE = 'en-GB'

const { confirm } = useConfirm()
const { showToast } = useToast()

const items = ref<Item[]>([])
const isLoading = ref(true)
const isCreateModalOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

// Match exact column proportions dynamically based on read-only status
const itemColumnClass = computed(() => (isReadOnly.value ? "w-[45%]" : "w-[40%]"))
const skuColumnClass = computed(() => (isReadOnly.value ? "w-[30%]" : "w-[25%]"))
const priceColumnClass = computed(() => (isReadOnly.value ? "w-[25%]" : "w-[20%]"))

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE
  }).format(priceInCents / 100)
}

const fetchItems = async (searchVal = searchQuery.value) => {
  try {
    const data = await itemService.getAll(workspaceId, searchVal, currentPage.value, itemsPerPage.value)
    items.value = data.items || []
    totalItems.value = data.total || 0
  } catch (err: any) {
    const errorMessage = 
        err.response?.data?.detail || 
        err.message || 
        "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage

    showToast(displayMessage, "error")
  }
}

const onSearchTriggered = async (term: string) => {
  currentPage.value = 1
  await fetchItems(term)
}

const { searchQuery, isSearching } = useSearch(onSearchTriggered)
const isTableLoading = computed(() => isLoading.value || isSearching.value)

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  isLoading.value = true
  await fetchItems()
  isLoading.value = false
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  isLoading.value = true
  await fetchItems()
  isLoading.value = false
}

const navigateToItem = (id: string) => {
  router.push({ name: "item-details", params: { id } })
}

const deleteItem = async (item: Item) => {
  const confirmed = await confirm({
    title: "Delete Item",
    message: `Are you sure you want to permanently delete "${item.title}" (SKU: ${item.sku})? This may affect historical stock records.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger"
  })

  if (!confirmed) return

  try {
    await itemService.delete(workspaceId, item.id)
    items.value = items.value.filter((i) => i.id !== item.id)
    totalItems.value = Math.max(0, totalItems.value - 1)
    showToast("Item deleted successfully", "success")
    
    // Auto-fetch if page is now empty but there are previous pages
    if (items.value.length === 0 && currentPage.value > 1) {
      prevPage()
    }
  } catch (error) {
    console.error(error)
    showToast("Failed to delete item", "error")
  }
}

const onItemCreated = (item: Item) => {
  items.value.unshift(item)
  totalItems.value++
  navigateToItem(item.id)
}

onMounted(async () => {
  isLoading.value = true
  try {
    await fetchItems()
  } finally {
    isLoading.value = false
  }
})
</script>
