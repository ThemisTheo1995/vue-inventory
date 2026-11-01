<!-- src/views/bins/BinDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4 min-w-0">
        <router-link
          :to="{ name: 'bins', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group shrink-0"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1 min-w-0">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider break-words whitespace-normal">
            {{ $route.meta.title || 'Bin Details' }}
          </h1>
          <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 break-words whitespace-normal">
            {{ $route.meta.description || 'Manage warehouse bin locations.' }}
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

      <!-- Bin Data View -->
      <template v-else-if="bin">
        
        <!-- Header Profile Card -->
        <BaseCard class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 overflow-hidden">
          <div class="flex items-center gap-4 sm:gap-5 min-w-0 flex-1 w-full sm:w-auto">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-2xl uppercase shrink-0">
              <ShelvingUnit class="w-7 h-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono break-words whitespace-normal" :title="bin.code">
                {{ bin.code }}
              </h2>
              <div class="flex items-center gap-2 mt-1.5 min-w-0">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                  <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Zone: {{ bin.zone || 'Unassigned Zone' }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Actions (Edit button - synchronous modal trigger) -->
          <div
            v-if="!isReadOnly"
            class="flex items-center gap-3 w-full sm:w-auto shrink-0"
          >
            <button
              @click="isEditModalOpen = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Edit2 class="w-4 h-4" />
              <span>Edit Bin</span>
            </button>
          </div>
        </BaseCard>

        <!-- Dynamic Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Details Sidebar -->
          <div class="lg:col-span-1 flex flex-col space-y-6">
            <BaseCard class="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 overflow-hidden">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                Bin Properties
              </h3>
              
              <div class="space-y-5">
                <!-- Bin ID -->
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Bin ID</p>
                  <div class="flex items-start gap-2 group/id min-w-0">
                    <span class="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 break-all whitespace-normal flex-1" :title="bin.id">
                      {{ bin.id }}
                    </span>
                    <button 
                      @click="copyIdToClipboard(bin.id)"
                      class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-0 group-hover/id:opacity-100 shrink-0 cursor-pointer"
                      title="Copy Bin ID"
                    >
                      <Check v-if="copiedId" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <hr class="border-slate-200/60 dark:border-slate-800/60" />

                <!-- Created Date -->
                <div v-if="bin.created_at">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Added to System</p>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ formatDate(bin.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Column 2: Inventory Items Stored in Bin Pane -->
          <div class="lg:col-span-2 flex flex-col max-h-none sm:max-h-[600px]">
            <LoadMoreListCard
              title="STORED INVENTORY ITEMS"
              :items="displayedInventoryItems"
              :is-loading="isInventoryLoading"
              :has-more="hasMoreInventory"
              :total="bin.inventory_items.length"
              :page="inventoryPage"
              empty-title="Bin is Empty"
              empty-description="No stock items are currently registered or put away in this specific bin location."
              load-more-text="Load More Items"
              end-message="You've reached the end of the inventory list"
              @load-more="loadMoreInventory"
            >
              <!-- Custom Table Layout using the Item Slot -->
              <template #item="{ item: inv }">
                <div class="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                  <div class="min-w-0 flex-1">
                    <p class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{{ inv.item?.title || 'Unknown Item' }}</p>
                    <p class="font-mono text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">{{ inv.item?.sku || 'NO-SKU' }}</p>
                  </div>
                  <div class="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
                    <div>
                      <p class="text-[10px] uppercase font-bold text-slate-400">On Hand</p>
                      <p class="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{{ inv.quantity_on_hand }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </LoadMoreListCard>
          </div>

        </div>
      </template>
    </div>

    <!-- Edit Modal Integration -->
    <BinEditModal
      v-if="bin && !isReadOnly"
      :is-open="isEditModalOpen"
      :workspace-id="workspaceId"
      :bin="bin"
      @close="isEditModalOpen = false"
      @updated="onBinUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Check, Copy, Edit2, ShelvingUnit, MapPin } from 'lucide-vue-next'

import type { BinDetail, Bin } from '../types/bin.types'
import { binService } from '../services/bin.service'
import { formatDate } from '@/utils/dateFormatter'

import BaseCard from '@/components/ui/BaseCard.vue'
import BinEditModal from './BinEditModal.vue'
import LoadMoreListCard from '@/components/ui/BaseLoadMoreCard.vue'
const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const binId = route.params.id as string
const isReadOnly = computed(() => localStorage.getItem('role') === 'read_only')

const bin = ref<BinDetail | null>(null)
const isLoading = ref<boolean>(true)
const copiedId = ref<boolean>(false)
const isEditModalOpen = ref<boolean>(false)

// --- Client-side Pagination State for Inventory Items ---
const inventoryPage = ref(1)
const inventoryLimit = ref(5)
const isInventoryLoading = ref(false)

const displayedInventoryItems = computed(() => {
  if (!bin.value?.inventory_items) return []
  return bin.value.inventory_items.slice(0, inventoryPage.value * inventoryLimit.value)
})

const hasMoreInventory = computed(() => {
  if (!bin.value?.inventory_items) return false
  return displayedInventoryItems.value.length < bin.value.inventory_items.length
})

const loadMoreInventory = async () => {
  if (!hasMoreInventory.value) return
  isInventoryLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 200))
  inventoryPage.value++
  isInventoryLoading.value = false
}

const fetchBinDetails = async (): Promise<void> => {
  try {
    isLoading.value = true
    const binData = await binService.getBin(workspaceId, binId, ['inventory_items', 'inventory_items.item'])
    bin.value = binData as BinDetail
  } catch (error) {
    console.error('Error fetching bin details:', error)
    router.push({ name: 'bins', params: { workspaceId } })
  } finally {
    isLoading.value = false
  }
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

const onBinUpdated = (updatedBin: Bin): void => {
  if (isReadOnly.value || !bin.value) return
  bin.value = {
    ...updatedBin,
    inventory_items: bin.value.inventory_items
  }
}

onMounted(() => {
  fetchBinDetails()
})
</script>
