<!-- src/features/views/inventory/InventoryDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-full mx-auto px-4 sm:px-6">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4 min-w-0">
        <router-link
          :to="{ name: 'inventory', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group shrink-0"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1 min-w-0">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider break-words whitespace-normal">
            {{ $route.meta.title || 'Inventory Details' }}
          </h1>
          <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 break-words whitespace-normal">
            {{ $route.meta.description || 'View individual inventory balance details and tracking data.' }}
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

      <!-- Inventory Data View -->
      <template v-else-if="inventory">
        
        <!-- Header Profile Card -->
        <BaseCard class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 overflow-hidden">
          <div class="flex items-center gap-4 sm:gap-5 min-w-0 flex-1 w-full sm:w-auto">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-2xl uppercase shrink-0">
              <Package class="w-7 h-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white break-words whitespace-normal" :title="inventory.item?.title">
                {{ inventory.item?.title || 'Unknown Item' }}
              </h2>
              <div class="flex flex-wrap items-center gap-2 mt-1.5 min-w-0">
                <span v-if="inventory.item?.sku" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                  <Tag class="w-3 h-3 text-slate-400 shrink-0" />
                  <span>SKU: {{ inventory.item.sku }}</span>
                </span>
                <span v-if="inventory.bin" @click="navigateToBinDetails(inventory.bin.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <ShelvingUnit class="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Bin: {{ inventory.bin.code || inventory.bin.zone || 'Assigned Bin' }}</span>
                </span>
                <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 shadow-sm">
                  <ShelvingUnit class="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Unassigned Bin</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Actions (Adjust Stock & Transfer Buttons) -->
          <div
            v-if="!isReadOnly"
            class="flex items-center gap-3 w-full sm:w-auto shrink-0"
          >
            <!-- Transfer Stock Button -->
            <button
              @click="isTransferModalOpen = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeftRight class="w-4 h-4 text-brand-500" />
              <span>Transfer</span>
            </button>

            <!-- Adjust Stock Button -->
            <button
              @click="isAdjustModalOpen = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <TrendingUp class="w-4 h-4" />
              <span>Adjust Stock</span>
            </button>
          </div>
        </BaseCard>

        <!-- Stock level: only show fields supported by the Inventory API type. -->
        <BaseCard class="border-0 shadow-lg shadow-slate-200/40 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5">
          <div class="max-w-xs p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">On Hand</p>
            <p class="font-mono text-xl font-black text-slate-900 dark:text-white">{{ inventory.quantity_on_hand }}</p>
          </div>
        </BaseCard>

        <!-- Dynamic Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Inventory Properties Sidebar -->
          <div class="lg:col-span-1 flex flex-col space-y-6">
            <BaseCard class="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 overflow-hidden">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                Record Properties
              </h3>
              
              <div class="space-y-5">
                <!-- Inventory ID -->
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Inventory Record ID</p>
                  <div class="flex items-start gap-2 group/id min-w-0">
                    <span class="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 break-all whitespace-normal flex-1" :title="inventory.id">
                      {{ inventory.id }}
                    </span>
                    <button 
                      @click="copyIdToClipboard(inventory.id)"
                      class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-0 group-hover/id:opacity-100 shrink-0 cursor-pointer"
                      title="Copy Inventory ID"
                    >
                      <Check v-if="copiedId" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <hr class="border-slate-200/60 dark:border-slate-800/60" />

                <!-- Created Date -->
                <div v-if="inventory.created_at">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Created Date</p>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ formatDate(inventory.created_at) }}
                    </span>
                  </div>
                </div>

                <hr v-if="inventory.updated_at" class="border-slate-200/60 dark:border-slate-800/60" />

                <!-- Updated Date -->
                <div v-if="inventory.updated_at">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Last Updated</p>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ formatDate(inventory.updated_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Column 2: Stock History Table / List Pane -->
          <div class="lg:col-span-2 flex flex-col max-h-none sm:max-h-[600px]">
            <LoadMoreListCard
              title="STOCK HISTORY"
              :items="movements"
              :is-loading="isMovementsLoading"
              :has-more="hasMoreMovements"
              :total="movementsTotal"
              :page="movementsPage"
              empty-title="No Stock History"
              empty-description="When stock mutations or movements occur for this item and bin, they will be registered here."
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

    <!-- Stock Adjust Modal Integration -->
    <StockAdjustModal
      v-if="inventory && !isReadOnly"
      :is-open="isAdjustModalOpen"
      :workspace-id="workspaceId"
      :preselected-item-id="inventory.item_id"
      :preselected-item-title="inventory.item?.title || null"
      :preselected-item-sku="inventory.item?.sku || null"
      :preselected-bin-id="inventory.bin_id || null"
      :preselected-bin-code="inventory.bin?.code || null"
      @close="isAdjustModalOpen = false"
      @created="onStockAdjusted"
    />

    <!-- Inventory Transfer Modal Integration -->
    <InventoryTransferModal
      v-if="inventory && inventory.bin_id && !isReadOnly"
      :is-open="isTransferModalOpen"
      :workspace-id="workspaceId"
      :item-id="inventory.item_id"
      :item-title="inventory.item?.title || null"
      :item-sku="inventory.item?.sku || null"
      :source-bin-id="inventory.bin_id"
      :source-bin-code="inventory.bin?.code || null"
      :max-available-stock="inventory.quantity_on_hand"
      @close="isTransferModalOpen = false"
      @transferred="onStockAdjusted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowLeftRight,
  Calendar, 
  Check, 
  Clock,
  Copy, 
  Package, 
  ShelvingUnit, 
  Tag,
  TrendingDown,
  TrendingUp
} from 'lucide-vue-next'
import { formatDate } from '@/utils/dateFormatter'

import type { InventoryExpanded } from '../types/inventory.types'
import type { StockMovement } from '@/features/inventory/types/inventory.types'
import type { Bin } from '@/features/bins/types/bin.types'
import { inventoryService } from '../services/inventory.service'
import { binService } from '@/features/bins/services/bin.service' // Adjust if bin service path differs

import BaseCard from '@/components/ui/BaseCard.vue'
import LoadMoreListCard from '@/components/ui/BaseLoadMoreCard.vue'
import StockAdjustModal from './StockAdjustModal.vue'
import InventoryTransferModal from '@/features/inventory/components/InventoryTransferModal.vue'

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const inventoryId = route.params.id as string
const isReadOnly = computed(() => localStorage.getItem('role') === 'read_only')

const inventory = ref<InventoryExpanded | null>(null)
const isLoading = ref<boolean>(true)
const copiedId = ref<boolean>(false)
const isAdjustModalOpen = ref<boolean>(false)
const isTransferModalOpen = ref<boolean>(false)

const availableBins = ref<Bin[]>([])

// --- Movements State ---
const movements = ref<StockMovement[]>([])
const isMovementsLoading = ref<boolean>(false)
const movementsPage = ref<number>(1)
const movementsLimit = ref<number>(4)
const movementsTotal = ref<number>(0)
const hasMoreMovements = computed(() => movements.value.length < movementsTotal.value)

const fetchInventoryDetails = async (): Promise<void> => {
  try {
    isLoading.value = true
    const [invData, binsData] = await Promise.all([
      inventoryService.getInventory(workspaceId, inventoryId, ['item', 'bin']),
      binService.getBins(workspaceId).catch(() => null)
    ])

    inventory.value = invData

    // Bin endpoints may return either a raw array or a paginated { items } response.
    const binResult = binsData as { items?: Bin[] } | Bin[] | null
    availableBins.value = Array.isArray(binResult)
      ? binResult
      : (binResult?.items ?? [])

    // Start movement history from page 1 whenever the detail view is refreshed.
    await fetchMovements(false)
  } catch (error) {
    console.error('Error fetching inventory details:', error)
    router.push({ name: 'inventory', params: { workspaceId } })
  } finally {
    isLoading.value = false
  }
}

const fetchMovements = async (isLoadMore = false): Promise<void> => {
  if (!inventory.value || isMovementsLoading.value) return

  const requestedPage = isLoadMore ? movementsPage.value + 1 : 1

  try {
    isMovementsLoading.value = true

    const data = await inventoryService.getStockMovements(
      workspaceId,
      inventory.value.item_id,
      inventory.value.bin_id,
      requestedPage,
      movementsLimit.value
    )

    const fetchedItems = data.items ?? []

    if (isLoadMore) {
      movements.value = [...movements.value, ...fetchedItems]
    } else {
      movements.value = fetchedItems
    }

    movementsPage.value = requestedPage
    movementsTotal.value = data.total ?? 0
  } catch (error) {
    console.error('Error fetching stock movements:', error)
  } finally {
    isMovementsLoading.value = false
  }
}

const loadMoreMovements = async (): Promise<void> => {
  if (!hasMoreMovements.value || isMovementsLoading.value) return
  await fetchMovements(true)
}

const copyIdToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = true
    setTimeout(() => { copiedId.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy ID:', err)
  }
}

const navigateToBinDetails = (binId: string) => {
  router.push({ name: 'bin-details', params: { id: binId } })
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('en-GB', {
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

const onStockAdjusted = async () => {
  isAdjustModalOpen.value = false
  isTransferModalOpen.value = false
  movementsPage.value = 1
  movements.value = []
  movementsTotal.value = 0
  await fetchInventoryDetails()
}

onMounted(() => {
  fetchInventoryDetails()
})
</script>
