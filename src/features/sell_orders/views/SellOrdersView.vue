<!-- src/views/sell_orders/SellOrdersView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Sell Orders' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Manage and track your customer sell orders.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          @click="isCreateModalOpen = true"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus class="w-4 h-4 relative z-10" />
          <span class="relative z-10">New Sell Order</span>
        </button>
      </div>
    </header>

    <!-- Reusable Table Component -->
    <BaseTable
      v-model:search-query="searchQuery"
      :items="sellOrders"
      :is-loading="isTableLoading"
      :is-searching="isSearching"
      :is-read-only="isReadOnly"
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :total-pages="totalPages"
      search-placeholder="Search SO number or customer..."
      empty-title="No sell orders found"
      :empty-description="isReadOnly ? 'There are currently no sell orders matching your criteria.' : 'Get started by creating your first sell order to track customer items.'"
      create-button-text="Create First SO"
      :column-span="isReadOnly ? 5 : 6"
      @create="isCreateModalOpen = true"
      @prev-page="prevPage"
      @next-page="nextPage"
    >
      <!-- ================= MOBILE CARDS SLOT ================= -->
      <template #mobile-cards>
        <div 
          v-for="so in sellOrders" 
          :key="so.id"
          @click="navigateToSO(so.id)"
          class="relative p-4 sm:p-5
            rounded-lg
            hover:bg-slate-50 dark:hover:bg-slate-900
            active:bg-slate-100 dark:active:bg-slate-900
            transition-colors cursor-pointer group
            border-b dark:border-slate-900 last:border-0""
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
                <Hash class="w-4 h-4" />
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white text-base leading-tight">{{ so.so_number }}</p>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1">
                  <User class="w-3.5 h-3.5 text-slate-400" />
                  {{ formatCustomerName(so.customer) }}
                </p>
                <div class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar class="w-3 h-3 text-slate-400" />
                  <span>{{ formatDateTime(so.created_at).date }}</span>
                  <span v-if="formatDateTime(so.created_at).time" class="text-slate-400 dark:text-slate-600">•</span>
                  <span>{{ formatDateTime(so.created_at).time }}</span>
                </div>
              </div>
            </div>
            <StatusBadge :status="so.status" />
          </div>

          <div class="flex justify-between items-end mt-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Amount</p>
              <p class="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                {{ formatCurrency(so.total_amount) }}
              </p>
            </div>
            <!-- Dynamic Actions -->
            <div v-if="!isReadOnly" class="flex items-center gap-1 -mr-2">
              <button
                v-if="so.status === 'DRAFT'"
                @click.stop="updateStatus(so, 'CONFIRMED')"
                class="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                title="Confirm Order"
              >
                <Send class="w-4 h-4" />
              </button>
              
              <button
                v-if="so.status === 'CONFIRMED'"
                @click.stop="updateStatus(so, 'FULLFILLED')"
                class="p-2 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                title="Fulfill Order"
              >
                <CheckCircle class="w-4 h-4" />
              </button>

              <button
                v-if="so.status === 'DRAFT' || so.status === 'CANCELLED'"
                @click.stop="deleteSO(so)"
                class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                title="Delete"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE HEADERS SLOT ================= -->
      <template #desktop-headers>
        <th class="w-[18%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Date Created</th>
        <th class="w-[20%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">SO Number</th>
        <th class="w-[25%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Customer</th>
        <th class="w-[16%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</th>
        <th class="w-[12%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Amount</th>
        <th v-if="!isReadOnly" class="w-[9%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">Actions</th>
      </template>

      <!-- ================= DESKTOP TABLE ROWS SLOT ================= -->
      <template #desktop-rows>
        <tr
          v-for="so in sellOrders"
          :key="so.id"
          @click="navigateToSO(so.id)"
          class="group hover:bg-slate-50/80 dark:hover:bg-slate-900/90 transition-colors cursor-pointer"
        >
          <td class="px-6 py-4 relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                {{ formatDateTime(so.created_at).date }}
              </span>
              <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                {{ formatDateTime(so.created_at).time }}
              </span>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold group-hover:scale-105 transition-transform shadow-sm">
                <Hash class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {{ so.so_number }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate">
                  ID: {{ so.id.slice(0, 8) }}
                </p>
              </div>
            </div>
          </td>
          
          <td class="px-6 py-4">
            <div class="flex items-center gap-2.5">
              <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <User class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate" :title="formatCustomerName(so.customer)">
                  {{ formatCustomerName(so.customer) }}
                </p>
                <p v-if="so.customer?.email" class="text-xs text-slate-400 dark:text-slate-500 truncate" :title="so.customer.email">
                  {{ so.customer?.email }}
                </p>
              </div>
            </div>
          </td>
          
          <td class="px-6 py-4">
            <StatusBadge :status="so.status" />
          </td>
          
          <td class="px-6 py-4">
            <span class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
              {{ formatCurrency(so.total_amount) }}
            </span>
          </td>

          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end" @click.stop>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  v-if="so.status === 'DRAFT'"
                  @click.stop="updateStatus(so, 'CONFIRMED')"
                  class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all transform active:scale-95"
                  title="Confirm Order"
                >
                  <Send class="w-4 h-4" />
                </button>
                
                <button
                  v-if="so.status === 'CONFIRMED'"
                  @click.stop="updateStatus(so, 'FULLFILLED')"
                  class="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all transform active:scale-95"
                  title="Fulfill Order"
                >
                  <CheckCircle class="w-4 h-4" />
                </button>

                <button
                  v-if="so.status === 'DRAFT' || so.status === 'CANCELLED'"
                  @click.stop="deleteSO(so)"
                  class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-all transform active:scale-95"
                  title="Delete sell order"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <SellOrderCreateModal 
      v-if="!isReadOnly" 
      :is-open="isCreateModalOpen" 
      :workspace-id="workspaceId" 
      @close="isCreateModalOpen = false" 
      @created="onSOCreated" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, h } from "vue"
import { useRoute, useRouter } from "vue-router"
import { 
  Plus, Trash2, Hash, User, Calendar, Send, CheckCircle, FileText 
} from "lucide-vue-next"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import BaseTable from "@/components/ui/BaseTable.vue"
import SellOrderCreateModal from "./SellOrderCreateModal.vue"

import { sellOrderService } from "../services/sell_order.service"
import type { SellOrder, SellOrderStatus } from "../types/sell_order.types"

// --- Helper Components ---
const StatusBadge = (props: { status: string }) => {
  const getStyle = () => {
    switch (props.status.toUpperCase()) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      case 'FULLFILLED': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    }
  }

  return h('span', {
    class: `inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStyle()}`
  }, [
    h('span', { class: 'w-1 h-1 rounded-full bg-current opacity-75 mr-1.5' }),
    props.status
  ])
}

// --- Logic ---
const LOCALE = "en-GB"

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const sellOrders = ref<SellOrder[]>([])
const isLoading = ref(true)
const isCreateModalOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

const formatCustomerName = (customer?: { first_name?: string; last_name?: string | null; email?: string } | null) => {
  if (!customer) return "Unknown Customer"
  const first = customer.first_name || ""
  const last = customer.last_name || ""
  const fullName = `${first} ${last}`.trim()
  return fullName || "Unnamed Customer"
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return { date: "—", time: "" }
  const d = new Date(dateString)
  const date = new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d)
  return { date, time }
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "GBP"
  }).format(cents / 100)
}

const fetchSellOrders = async (searchVal = searchQuery.value) => {
  try {
    const data = await sellOrderService.getAll(workspaceId, searchVal, currentPage.value, itemsPerPage.value)
    sellOrders.value = data.items || []
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
  await fetchSellOrders(term)
}

const { searchQuery, isSearching } = useSearch(onSearchTriggered)
const isTableLoading = computed(() => isLoading.value || isSearching.value)

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  isLoading.value = true
  await fetchSellOrders()
  isLoading.value = false
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  isLoading.value = true
  await fetchSellOrders()
  isLoading.value = false
}

const navigateToSO = (id: string) => {
  router.push({ name: "sell-order-details", params: { workspaceId, id } })
}

const updateStatus = async (so: SellOrder, nextStatus: SellOrderStatus) => {
  const isTransitionConfirmed = await confirm({
    title: `Transition to ${nextStatus}`,
    message: `Are you sure you want to transition this sell order status to ${nextStatus}? This action dictates downstream order processing.`,
    confirmText: "Confirm Change",
    cancelText: "Cancel",
    variant: nextStatus === "CANCELLED" ? "danger" : "primary"
  })

  if (!isTransitionConfirmed) return

  try {
    await sellOrderService.update(workspaceId, so.id, { status: nextStatus })
    showToast(`SO successfully moved to ${nextStatus}`, "success")
    so.status = nextStatus
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

const deleteSO = async (so: SellOrder) => {
  const confirmed = await confirm({
    title: "Delete Sell Order",
    message: `Are you sure you want to delete sell order ${so.so_number}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger"
  })

  if (!confirmed) return

  try {
    await sellOrderService.delete(workspaceId, so.id)
    sellOrders.value = sellOrders.value.filter((s) => s.id !== so.id)
    totalItems.value = Math.max(0, totalItems.value - 1)
    showToast("Sell order deleted successfully", "success")
    
    if (sellOrders.value.length === 0 && currentPage.value > 1) {
      prevPage()
    }
  } catch (error) {
    console.error(error)
    showToast("Failed to delete sell order", "error")
  }
}

const onSOCreated = (so: SellOrder) => {
  sellOrders.value.unshift(so)
  totalItems.value++
  navigateToSO(so.id)
}

onMounted(async () => {
  isLoading.value = true
  try {
    await fetchSellOrders()
  } finally {
    isLoading.value = false
  }
})
</script>
