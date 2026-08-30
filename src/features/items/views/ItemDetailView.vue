<!-- src/views/items/ItemDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link
          :to="{ name: 'items', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
            {{ $route.meta.title || 'Item Details' }}
          </h1>
          <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            {{ $route.meta.description || 'View and manage catalog specifications.' }}
          </p>
        </div>
      </div>
    </header>

    <!-- Main Detail Area -->
    <div class="space-y-6">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="animate-pulse space-y-6">
        <div class="h-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
          <div class="lg:col-span-2 h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
        </div>
      </div>

      <!-- Item Data View -->
      <template v-else-if="item">
        <!-- Header Profile Card -->
        <BaseCard class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-2xl shadow-sm border border-teal-100 dark:border-teal-800/50">
              {{ item.title?.charAt(0)?.toUpperCase() || 'I' }}
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {{ item.title }}
              </h2>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                  <Tag class="w-3 h-3 text-slate-400" />
                  {{ item.sku }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="!isReadOnly"
            class="flex items-center gap-3 w-full sm:w-auto shrink-0"
          >
            <button
              @click="isEditModalOpen = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all duration-200"
            >
              <Edit2 class="w-4 h-4" />
              <span>Edit Item</span>
            </button>
          </div>
        </BaseCard>

        <!-- Dynamic Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Details Sidebar -->
          <div class="lg:col-span-1 flex flex-col space-y-6">
            <BaseCard class="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                Specifications
              </h3>
              
              <div class="space-y-5">
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Base Price</p>
                  <p v-if="item.base_price !== null && item.base_price !== undefined" class="text-2xl font-black text-brand-600 dark:text-brand-400 leading-none">
                    {{ formatPrice(item.base_price) }}
                  </p>
                  <p v-else class="inline-flex text-sm font-medium text-slate-400 italic px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    Unset
                  </p>
                </div>

                <hr class="border-slate-200/60 dark:border-slate-800/60" />

                <div>
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Item ID</p>
                  <div class="flex items-center gap-2 group/id">
                    <span class="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]" :title="item.id">
                      {{ item.id }}
                    </span>
                    <button 
                      @click="copyIdToClipboard(item.id)"
                      class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-0 group-hover/id:opacity-100 shrink-0"
                      title="Copy Item ID"
                    >
                      <Check v-if="copiedId" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div v-if="item.created_at">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Added to System</p>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ formatDate(item.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Column 2: Stocks / Movement Records Pane -->
          <div class="lg:col-span-2 flex flex-col">
            <BaseCard class="flex-1 flex flex-col overflow-hidden border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
              <!-- Pane Header -->
              <div class="shrink-0 p-5 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Inventory History
                </h3>
                <button
                  v-if="!isReadOnly"
                  @click="isStockAdjustModalOpen = true"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <ArrowRightLeft class="w-3.5 h-3.5" />
                  <span>Adjust Stock</span>
                </button>
              </div>

              <!-- Content Area -->
              <div class="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 min-h-[350px]">
                
                <!-- Loading State -->
                <div v-if="isMovementsLoading" class="p-5 space-y-4">
                  <div v-for="i in 4" :key="i" class="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                    <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3"></div>
                      <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/4"></div>
                    </div>
                    <div class="w-16 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/50 shrink-0"></div>
                  </div>
                </div>

                <!-- Empty State -->
                <section v-else-if="!movements.length" class="h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[350px]">
                  <div class="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                    <PackageOpen class="w-8 h-8 text-slate-400 opacity-80" />
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">No Inventory Records</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    When stock mutations, transactions, or warehouse receipts occur for this item, they will be securely registered here.
                  </p>
                </section>

                <!-- Data List -->
                <div v-else class="p-4 sm:p-5 space-y-3">
                  <div 
                    v-for="movement in movements" 
                    :key="movement.id"
                    class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <!-- Movement Icon -->
                    <div 
                      :class="[
                        'flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-inner',
                        movement.quantity_change > 0 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      ]"
                    >
                      <TrendingUp v-if="movement.quantity_change > 0" class="w-5 h-5" />
                      <TrendingDown v-else class="w-5 h-5" />
                    </div>

                    <!-- Details -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {{ formatReferenceType(movement.reference_type) }}
                      </p>
                      <div class="flex items-center gap-2 mt-1">
                        <Clock class="w-3 h-3 text-slate-400 shrink-0" />
                        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          {{ formatDateTime(movement.created_at) }}
                        </span>
                      </div>
                    </div>

                    <!-- Quantity Badge -->
                    <div class="shrink-0 text-right">
                      <span 
                        :class="[
                          'inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-mono font-black border shadow-sm',
                          movement.quantity_change > 0 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' 
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
                        ]"
                      >
                        {{ movement.quantity_change > 0 ? '+' : '' }}{{ movement.quantity_change }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination Footer -->
              <div 
                v-if="movementsTotalPages > 1"
                class="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              >
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Showing <span class="font-bold text-slate-700 dark:text-slate-300">{{ movements.length ? ((movementsPage - 1) * movementsLimit) + 1 : 0 }}</span>
                  to <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(movementsPage * movementsLimit, movementsTotal) }}</span>
                  of <span class="font-bold text-slate-700 dark:text-slate-300">{{ movementsTotal }}</span>
                </p>

                <div class="flex items-center gap-1.5">
                  <button
                    @click="prevMovementsPage"
                    :disabled="movementsPage === 1 || isMovementsLoading"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    <ChevronLeft class="w-4 h-4" />
                  </button>
                  <button
                    @click="nextMovementsPage"
                    :disabled="movementsPage === movementsTotalPages || isMovementsLoading"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    <ChevronRight class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </BaseCard>
          </div>

        </div>
      </template>
    </div>

    <!-- Edit Modal Integration -->
    <ItemEditModal
      v-if="item && !isReadOnly"
      :is-open="isEditModalOpen"
      :workspace-id="workspaceId"
      :item="item"
      @close="isEditModalOpen = false"
      @updated="onItemUpdated"
    />

    <!-- Stock Adjust Modal Integration -->
    <StockAdjustModal
      v-if="item && !isReadOnly"
      :is-open="isStockAdjustModalOpen"
      :workspace-id="workspaceId"
      :preselected-item-id="item.id"
      @close="isStockAdjustModalOpen = false"
      @created="onStockAdjusted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { 
  ArrowLeft,
  ArrowRightLeft,
  Calendar, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy, 
  Edit2, 
  PackageOpen, 
  Tag,
  TrendingDown,
  TrendingUp
} from 'lucide-vue-next'

import type { Item } from '../types/item.types'
import type { StockMovement } from '../../inventory/types/inventory.types'

import { itemService } from '../services/item.service'
import { inventoryService } from '../../inventory/services/inventory.service.ts'

import BaseCard from '@/components/ui/BaseCard.vue'
import ItemEditModal from './ItemEditModal.vue'
import StockAdjustModal from '@/features/inventory/views/StockAdjustModal.vue'

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const itemId = route.params.id as string
const isReadOnly = computed(() => localStorage.getItem('role') === 'read_only')

const CURRENCY_CODE = 'GBP'
const LOCALE = 'en-GB'

// --- Item State ---
const item = ref<Item | null>(null)
const isLoading = ref(true)
const copiedId = ref(false)
const isEditModalOpen = ref(false)
const isStockAdjustModalOpen = ref(false)

// --- Movements State ---
const movements = ref<StockMovement[]>([])
const isMovementsLoading = ref(true)
const movementsPage = ref(1)
const movementsLimit = ref(10) // Display 10 movements per page on the detail view
const movementsTotal = ref(0)
const movementsTotalPages = computed(() => Math.max(1, Math.ceil(movementsTotal.value / movementsLimit.value)))

// --- Data Fetching ---
const fetchItem = async () => {
  try {
    isLoading.value = true
    item.value = await itemService.getOne(workspaceId, itemId)
  } catch (error) {
    console.error('Error fetching item details:', error)
    router.push({ name: 'items', params: { workspaceId } })
  } finally {
    isLoading.value = false
  }
}

const fetchMovements = async () => {
  try {
    isMovementsLoading.value = true
    const data = await inventoryService.getStockMovements(
      workspaceId, 
      itemId, 
      movementsPage.value, 
      movementsLimit.value
    )
    movements.value = data.items || []
    movementsTotal.value = data.total || 0
  } catch (error) {
    console.error('Error fetching stock movements:', error)
  } finally {
    isMovementsLoading.value = false
  }
}

// --- Pagination Controls ---
const nextMovementsPage = async () => {
  if (movementsPage.value >= movementsTotalPages.value) return
  movementsPage.value++
  await fetchMovements()
}

const prevMovementsPage = async () => {
  if (movementsPage.value <= 1) return
  movementsPage.value--
  await fetchMovements()
}

// --- Formatters & Helpers ---
const copyIdToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = true
    setTimeout(() => { copiedId.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy ID:', err)
  }
}

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE
  }).format(priceInCents / 100)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatReferenceType = (type: string) => {
  return type
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const onItemUpdated = (updatedData: Item) => {
  if (isReadOnly.value) return
  item.value = updatedData
}

const onStockAdjusted = async () => {
  isStockAdjustModalOpen.value = false
  movementsPage.value = 1
  await fetchMovements()
}

onMounted(() => {
  fetchItem()
  fetchMovements()
})
</script>
