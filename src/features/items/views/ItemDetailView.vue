<!-- src/views/items/ItemDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-full mx-auto px-4 sm:px-6">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <router-link
          :to="{ name: 'items', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group cursor-pointer shrink-0"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1 min-w-0">
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider truncate">
            {{ $route.meta.title || 'Item Details' }}
          </h1>
          <p class="text-xs sm:text-base font-medium text-slate-500 dark:text-slate-400 truncate">
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
        <BaseCard class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6">
          <div class="flex items-center gap-3 sm:gap-5 min-w-0">
            <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-2xl shadow-sm border border-teal-100 dark:border-teal-800/50">
              {{ item.title?.charAt(0)?.toUpperCase() || 'I' }}
            </div>
            <div class="min-w-0">
              <h2 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                {{ item.title }}
              </h2>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm max-w-full truncate">
                  <Tag class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ item.sku }}</span>
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
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Edit2 class="w-4 h-4 shrink-0" />
              <span>Edit Item</span>
            </button>
          </div>
        </BaseCard>

        <!-- Dynamic Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Details Sidebar -->
          <div class="lg:col-span-1 flex flex-col space-y-6">
            
            <!-- Specifications Card -->
            <BaseCard class="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 sm:mb-6">
                Specifications
              </h3>
              
              <div class="space-y-4 sm:space-y-5">
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
                  <div class="flex items-center justify-between sm:justify-start gap-2 group/id">
                    <span class="font-mono text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px] sm:max-w-[200px]" :title="item.id">
                      {{ item.id }}
                    </span>
                    <button 
                      @click="copyIdToClipboard(item.id)"
                      class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-100 sm:opacity-0 sm:group-hover/id:opacity-100 shrink-0 cursor-pointer"
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

            <!-- Decoupled QR / Barcode Card Component -->
            <ItemBarcodeCard :workspace-id="workspaceId" :item="item" />

          </div>

          <!-- Column 2: Stocks / Movement Records Pane -->
        <div class="lg:col-span-2 flex flex-col max-h-none sm:max-h-[600px]">
          <LoadMoreListCard
            title="INVENTORY HISTORY"
            :items="movements"
            :is-loading="isMovementsLoading"
            :has-more="hasMoreMovements"
            :total="movementsTotal"
            :page="movementsPage"
            empty-title="No Inventory Records"
            empty-description="When stock mutations, transactions, or warehouse receipts occur for this item, they will be securely registered here."
            @load-more="loadMoreMovements"
          >
            <!-- Scoped Item Row Slot -->
            <template #item="{ item: movement }">
              <div 
                class="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow"
              >
                <!-- Movement Icon -->
                <div 
                  :class="[
                    'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 shadow-inner mt-0.5',
                    movement.quantity_change > 0 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  ]"
                >
                  <TrendingUp v-if="movement.quantity_change > 0" class="w-4 h-4 sm:w-5 sm:h-5" />
                  <TrendingDown v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0 space-y-1">
                  <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {{ formatReferenceType(movement.reference_type) }}
                  </p>
                  
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <Clock class="w-3 h-3 text-slate-400 shrink-0" />
                    <span class="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                      {{ formatDateTime(movement.created_at) }}
                    </span>
                  </div>

                  <!-- Notes Field -->
                  <p
                    v-if="movement.notes"
                    class="movement-notes text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2.5 py-1.5 border border-slate-200/50 dark:border-slate-700/50 break-words mt-1.5"
                  >
                    <span class="font-semibold text-slate-500 dark:text-slate-400">Note:</span>
                    {{ movement.notes }}
                  </p>
                </div>

                <!-- Quantity Badge -->
                <div class="shrink-0 text-right">
                  <span 
                    :class="[
                      'inline-flex items-center justify-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-black border shadow-sm',
                      movement.quantity_change > 0 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
                    ]"
                  >
                    {{ movement.quantity_change > 0 ? '+' : '' }}{{ movement.quantity_change }}
                  </span>
                </div>
              </div>
            </template>
          </LoadMoreListCard>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { 
  ArrowLeft,
  Calendar, 
  Check,
  Clock,
  Copy, 
  Edit2,
  Tag,
  TrendingDown,
  TrendingUp
} from 'lucide-vue-next'

import type { Item } from '../types/item.types'
import type { StockMovement } from '../../inventory/types/inventory.types'

import { itemService } from '../services/item.service'
import { inventoryService } from '../../inventory/services/inventory.service.ts'

import BaseCard from '@/components/ui/BaseCard.vue'
import LoadMoreListCard from '@/components/ui/BaseLoadMoreCard.vue'
import ItemEditModal from './ItemEditModal.vue'
import ItemBarcodeCard from '../components/ItemBarcodeCard.vue'
import { formatDate } from '@/utils/dateFormatter'

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

// --- Movements State ---
const movements = ref<StockMovement[]>([])
const isMovementsLoading = ref(true)
const movementsPage = ref(1)
const movementsLimit = ref(4)
const movementsTotal = ref(0)
const hasMoreMovements = computed(() => movements.value.length < movementsTotal.value)

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

const fetchMovements = async (isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      isMovementsLoading.value = true
    }
    const data = await inventoryService.getStockMovements(
      workspaceId, 
      itemId,
      undefined,          // We fetching all bins for this item
      movementsPage.value, 
      movementsLimit.value
    )
    
    if (isLoadMore) {
      movements.value.push(...(data.items || []))
    } else {
      movements.value = data.items || []
    }
    
    movementsTotal.value = data.total || 0
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    throw error
  } finally {
    isMovementsLoading.value = false
  }
}

// --- Pagination Controls ---
const loadMoreMovements = async () => {
  if (!hasMoreMovements.value) return
  movementsPage.value++
  await fetchMovements(true)
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

onMounted(() => {
  fetchItem()
  fetchMovements(false)
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
