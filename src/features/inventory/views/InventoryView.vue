<!-- src/views/inventory/InventoryView.vue -->
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
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <ArrowRightLeft class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Adjust Stock</span>
        </button>
      </div>
    </header>

    <!-- Main Content Card -->
    <BaseCard class="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] min-h-[500px] border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      
      <!-- Toolbar -->
      <div class="shrink-0 p-4 sm:p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center">
        <h2 class="text-sm font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          Current Balances
        </h2>
        <button
          @click="fetchBalances"
          class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
          title="Refresh balances"
        >
          <RefreshCw :class="['w-4 h-4', { 'animate-spin': isTableLoading }]" />
        </button>
      </div>

      <!-- Data View Wrapper -->
      <div class="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
        
        <!-- ================= MOBILE LIST VIEW ================= -->
        <div class="lg:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
          
          <!-- Mobile Skeleton -->
          <template v-if="isTableLoading">
            <div v-for="i in 5" :key="'mob-skel-'+i" class="p-4 sm:p-5 animate-pulse space-y-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700/50"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-32"></div>
                    <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-20"></div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 pt-2">
                <div class="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg"></div>
                <div class="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg"></div>
                <div class="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg"></div>
              </div>
            </div>
          </template>

          <!-- Mobile Empty State -->
          <div v-else-if="!balances.length" class="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <EmptyStateContent :is-read-only="isReadOnly" @action="openAdjustModal()" />
          </div>

          <!-- Mobile Cards -->
          <template v-else>
            <div 
              v-for="balance in balances" 
              :key="balance.id"
              @click="navigateToItemDetails(balance.item_id)"
              class="relative p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <Package class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      Item ID
                    </p>
                    <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      {{ balance.item_id }}
                    </p>
                  </div>
                </div>
                <div v-if="!isReadOnly">
                  <button
                    @click.stop="openAdjustModal(balance.item_id)"
                    class="p-2 -mt-2 -mr-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-full hover:bg-brand-50 dark:hover:bg-brand-400/10 transition-colors"
                    title="Adjust stock for this item"
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
        </div>

        <!-- ================= DESKTOP TABLE VIEW ================= -->
        <div class="hidden lg:block w-full">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[inset_0_-1px_0_0_theme(colors.slate.200)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800)]">
              <tr>
                <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 w-[20%]">
                  Item Details
                </th>
                <th class="px-6 py-4 text-right w-[17%]">
                  <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <span>On Hand</span>
                    <Info class="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-help" />
                  </div>
                </th>
                <th class="px-6 py-4 text-right w-[16%]">
                  <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-500/80">
                    <span>Allocated</span>
                    <Info class="w-3 h-3 text-amber-500/40 cursor-help" />
                  </div>
                </th>
                <th class="px-6 py-4 text-right w-[17%]">
                  <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-blue-500/80">
                    <span>On Order</span>
                    <Info class="w-3 h-3 text-blue-500/40 cursor-help" />
                  </div>
                </th>
                <th class="px-6 py-4 text-right w-[18%]">
                  <div class="flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    <CheckCircle class="w-3.5 h-3.5" />
                    <span>Available</span>
                    <Info class="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-help" />
                  </div>
                </th>
                <th v-if="!isReadOnly" class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right w-[12%]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              
              <!-- Desktop Skeleton (FIXED) -->
              <template v-if="isTableLoading">
                <tr v-for="i in 6" :key="'desk-skel-'+i" class="animate-pulse bg-white/30 dark:bg-slate-900/30">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700/50"></div>
                      <div class="space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24"></div>
                        <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="h-5 bg-slate-200 dark:bg-slate-700/50 rounded w-8 ml-auto"></div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="h-5 bg-amber-100 dark:bg-amber-900/20 rounded w-8 ml-auto"></div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="h-5 bg-blue-100 dark:bg-blue-900/20 rounded w-8 ml-auto"></div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="h-7 bg-emerald-100 dark:bg-emerald-900/20 rounded-md w-12 ml-auto"></div>
                  </td>
                  <td v-if="!isReadOnly" class="px-6 py-4 text-right">
                     <div class="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-8 ml-auto"></div>
                  </td>
                </tr>
              </template>

              <!-- Desktop Empty State -->
              <tr v-else-if="!balances.length">
                <td :colspan="isReadOnly ? 5 : 6" class="py-24 text-center">
                  <EmptyStateContent :is-read-only="isReadOnly" @action="openAdjustModal()" />
                </td>
              </tr>

              <!-- Desktop Rows -->
              <tr
                v-else
                v-for="balance in balances"
                :key="balance.id"
                @click="navigateToItemDetails(balance.item_id)"
                class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <td class="px-6 py-4 relative">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                      <Package class="w-4 h-4" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {{ balance.item_id }}
                      </p>
                      <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate mt-0.5">
                        System ID: {{ balance.id.slice(0, 8) }}
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
                      class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-400/10 rounded-lg transition-all transform active:scale-95"
                      title="Adjust Stock"
                    >
                      <ArrowRightLeft class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div class="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing <span class="font-bold text-slate-700 dark:text-slate-300">{{ balances.length ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }}</span>
          to <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(currentPage * itemsPerPage, totalBalances) }}</span>
          of <span class="font-bold text-slate-700 dark:text-slate-300">{{ totalBalances }}</span>
        </p>

        <div v-if="totalPages > 1" class="flex items-center gap-1.5">
          <button
            @click="prevPage"
            :disabled="currentPage === 1 || isTableLoading"
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="px-2 hidden sm:block">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ currentPage }}</span>
            <span class="text-xs font-medium text-slate-400 mx-1">/</span>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ totalPages }}</span>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || isTableLoading"
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Modal for adding StockMovements -->
    <StockAdjustModal 
      v-if="!isReadOnly" 
      :is-open="isAdjustModalOpen" 
      :workspace-id="workspaceId" 
      :preselected-item-id="selectedItemId"
      @close="closeAdjustModal" 
      @created="onStockAdjusted" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, h } from "vue"
import { useRoute, useRouter } from "vue-router"
import { 
  ArrowRightLeft, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  RefreshCw, 
  Box,
  Archive,
  ShoppingCart,
  Truck,
  CheckCircle,
  Info
} from "lucide-vue-next"

import { useToast } from "@/composables/useToast"
import BaseCard from "@/components/ui/BaseCard.vue"

import StockAdjustModal from "./StockAdjustModal.vue" 

import { inventoryService } from "../services/inventory.service"
import type { Inventory } from "../types/inventory.types"

// --- Helper Components ---
const EmptyStateContent = (props: { isReadOnly: boolean }, { emit }: any) => {
  return h('div', { class: 'flex flex-col items-center justify-center space-y-4' }, [
    h('div', { class: 'flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-inner' }, [
      h(Box, { class: 'w-8 h-8 opacity-80' })
    ]),
    h('div', { class: 'text-center' }, [
      h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white' }, 'No inventory tracked'),
      h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto' }, 
        props.isReadOnly 
          ? 'There are currently no inventory balances in this workspace.' 
          : 'Stock balances will appear here when items are received or adjusted.'
      )
    ]),
    !props.isReadOnly ? h('button', {
      onClick: () => emit('action'),
      class: 'mt-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm hover:opacity-90 transition shadow-md hover:shadow-lg active:scale-95 inline-flex items-center gap-2'
    }, [
      h(ArrowRightLeft, { class: 'w-4 h-4' }),
      'Make Manual Adjustment'
    ]) : null
  ])
}
EmptyStateContent.emits = ['action']

// --- Logic ---
const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { showToast } = useToast()

const balances = ref<Inventory[]>([])
const isLoading = ref(true)

// Modal State
const isAdjustModalOpen = ref(false)
const selectedItemId = ref<string | null>(null)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalBalances = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalBalances.value / itemsPerPage.value)))

const isTableLoading = computed(() => isLoading.value)

const fetchBalances = async () => {
  isLoading.value = true
  try {
    const data = await inventoryService.getInventories(workspaceId, currentPage.value, itemsPerPage.value)
    balances.value = data.items || []
    totalBalances.value = data.total || 0
  } catch (err) {
    console.error(err)
    showToast("Failed to load inventory balances", "error")
  } finally {
    isLoading.value = false
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

const navigateToItemDetails = (itemId: string) => {
  router.push({ name: "item-details", params: { id: itemId } })
}

// Modal controls
const openAdjustModal = (itemId?: string) => {
  selectedItemId.value = itemId || null
  isAdjustModalOpen.value = true
}

const closeAdjustModal = () => {
  isAdjustModalOpen.value = false
  setTimeout(() => { selectedItemId.value = null }, 200)
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
