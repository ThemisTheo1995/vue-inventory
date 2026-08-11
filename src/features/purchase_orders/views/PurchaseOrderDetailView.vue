<!-- src/views/PurchaseOrderDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto print:space-y-4 print:pb-0">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link
          :to="{ name: 'purchase-orders', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group print:hidden"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
            {{ $route.meta.title || 'PO Details' }}
          </h1>
          <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            {{ $route.meta.description || 'View and manage your procurement order.' }}
          </p>
        </div>
      </div>

      <!-- Print Action -->
      <div class="flex items-center shrink-0 print:hidden">
        <button
          @click="printPO"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all duration-200"
        >
          <Printer class="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>
    </header>

    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-96 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
        <div class="h-96 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!po" class="py-24 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 shadow-inner mb-4">
        <AlertTriangle class="w-8 h-8 opacity-80" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white">Purchase Order Not Found</h3>
      <p class="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
        This order may have been deleted, or you don't have permission to view it.
      </p>
    </div>

    <!-- Main Detail Content -->
    <div v-else class="space-y-6">
      
      <!-- Status Banner & Header Card -->
      <BaseCard class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 print:!border-none print:!shadow-none print:!bg-transparent print:!p-0 print:!ring-0">
        <div class="flex items-start gap-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm print:hidden">
            <FileText class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ po.po_number }}
              </h2>
              <StatusBadge :status="po.status" />
            </div>
            <p class="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
              ID: {{ po.id }}
            </p>
          </div>
        </div>

        <!-- Order Stage Transitions Action Bar -->
        <div v-if="!isReadOnly" class="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            v-if="po.status === 'DRAFT'"
            @click="isEditModalOpen = true"
            class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-sm active:scale-95"
          >
            <Edit2 class="w-4 h-4" />
            Edit Draft
          </button>

          <button
            v-if="po.status === 'DRAFT'"
            @click="updateStatus('SENT')"
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
          >
            <Send class="w-4 h-4" />
            Mark as Sent
          </button>

          <button
            v-if="po.status === 'SENT'"
            @click="updateStatus('RECEIVED')"
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 dark:shadow-none active:scale-95"
          >
            <CheckCircle class="w-4 h-4" />
            Mark as Received
          </button>

          <button
            v-if="['DRAFT', 'SENT'].includes(po.status)"
            @click="updateStatus('CANCELLED')"
            class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold text-sm transition-all active:scale-95"
          >
            <XCircle class="w-4 h-4" />
            Cancel PO
          </button>
        </div>
      </BaseCard>

      <!-- Detail Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        
        <!-- Main Line Items List (Col span 2) -->
        <div class="lg:col-span-2 flex flex-col space-y-6">
          <BaseCard class="flex flex-col flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl print:!border-none print:!shadow-none print:!bg-transparent print:!ring-0">
            
            <div class="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 print:!border-b print:!border-slate-300 print:!p-0 print:!pb-2">
              <h3 class="text-lg font-black text-slate-900 dark:text-white">
                Line Items
              </h3>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Products associated with this procurement order
              </p>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30 print:!bg-transparent">
              
              <!-- Empty State -->
              <div v-if="po.purchase_order_lines.length === 0" class="p-12 text-center">
                <p class="text-slate-500 dark:text-slate-400 font-medium">No line items added to this purchase order.</p>
              </div>

              <template v-else>
                <!-- MOBILE LIST VIEW (Cards) -->
                <div class="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 print:hidden">
                  <div 
                    v-for="line in po.purchase_order_lines" 
                    :key="line.id"
                    class="p-4 sm:p-5"
                  >
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <p class="font-bold text-slate-900 dark:text-white text-base leading-tight">
                          {{ line.item?.title || 'Unknown Item' }}
                        </p>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                          SKU: {{ line.item?.sku || 'N/A' }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center justify-between mt-4 p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Qty &times; Price</p>
                        <p class="font-mono text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {{ line.quantity }} &times; {{ formatCurrency(line.unit_cost) }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Total</p>
                        <p class="font-mono text-base font-bold text-slate-900 dark:text-white">
                          {{ formatCurrency(line.unit_cost * line.quantity) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- DESKTOP TABLE VIEW -->
                <div class="hidden md:block w-full print:!block">
                  <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[inset_0_-1px_0_0_theme(colors.slate.200)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800)] print:!static print:!bg-transparent print:!shadow-none print:!border-b print:!border-slate-300">
                      <tr>
                        <th class="w-[50%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 print:!text-black print:!px-2">Item Name / SKU</th>
                        <th class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center print:!text-black print:!px-2">Qty</th>
                        <th class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right print:!text-black print:!px-2">Unit Cost</th>
                        <th class="w-[20%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right print:!text-black print:!px-2">Total Price</th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 print:!divide-slate-200">
                      <tr
                        v-for="line in po.purchase_order_lines"
                        :key="line.id"
                        class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors print:!bg-transparent"
                      >
                        <!-- First cell gets relative for hover line (HTML spec compliant) -->
                        <td class="px-6 py-4 relative print:!px-2">
                          <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"></div>
                          <div class="min-w-0">
                            <p class="font-bold text-slate-900 dark:text-white text-sm truncate print:!text-black">
                              {{ line.item?.title || 'Unknown Item' }}
                            </p>
                            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate print:!text-slate-600">
                              SKU: {{ line.item?.sku || 'N/A' }}
                            </p>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-center print:!px-2">
                          <span class="font-mono text-sm font-bold text-slate-600 dark:text-slate-300 print:!text-black">
                            {{ line.quantity }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-right print:!px-2">
                          <span class="font-mono text-sm font-semibold text-slate-500 dark:text-slate-400 print:!text-black">
                            {{ formatCurrency(line.unit_cost) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-right print:!px-2">
                          <span class="font-mono text-sm font-bold text-slate-900 dark:text-white print:!text-black">
                            {{ formatCurrency(line.unit_cost * line.quantity) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </div>
          </BaseCard>
        </div>

        <!-- Sidebar (Col span 1) -->
        <div class="space-y-6">
          
          <!-- Supplier Details Card -->
          <BaseCard class="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 print:!border print:!border-slate-300 print:!shadow-none print:!bg-transparent print:!ring-0">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 print:!text-black">
              Supplier Profile
            </h3>

            <div class="space-y-4">
              <div v-if="po.supplier" class="flex items-center gap-3.5">
                <div class="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-lg uppercase shadow-sm print:hidden">
                  {{ po.supplier.name.charAt(0) }}
                </div>
                <div class="truncate">
                  <p class="font-bold text-slate-900 dark:text-white text-base truncate print:!text-black">
                    {{ po.supplier.name }}
                  </p>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5 print:!text-slate-600">
                    ID: {{ po.supplier.id.slice(0, 8) }}
                  </p>
                </div>
              </div>

              <div v-else class="text-slate-400 text-sm italic">
                No Supplier specified.
              </div>

              <div class="border-t border-slate-200/60 dark:border-slate-800/60 pt-4 space-y-3.5 print:!border-slate-200">
                <div v-if="po.supplier?.email" class="flex items-center gap-3 text-sm">
                  <Mail class="w-4 h-4 text-slate-400 shrink-0 print:hidden" />
                  <span class="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate select-all print:!text-black">
                    {{ po.supplier.email }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <Calendar class="w-4 h-4 text-slate-400 shrink-0 print:hidden" />
                  <span class="text-slate-600 dark:text-slate-400 font-medium print:!text-black">
                    Created: {{ formatDate(po.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Procurement Summary Card -->
          <BaseCard class="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 print:!border print:!border-slate-300 print:!shadow-none print:!bg-transparent print:!ring-0">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 print:!text-black">
              Procurement Summary
            </h3>

            <div class="space-y-4 divide-y divide-slate-200/60 dark:divide-slate-800/60 print:!divide-slate-200">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 print:!text-black">
                  {{ formatCurrency(po.total_amount) }}
                </span>
              </div>
              <div class="flex justify-between items-center text-sm pt-4">
                <span class="text-slate-500 dark:text-slate-400 font-medium">Estimated Tax (0%)</span>
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 print:!text-black">
                  {{ formatCurrency(0) }}
                </span>
              </div>
              <div class="flex justify-between items-end pt-5">
                <span class="text-slate-900 dark:text-white text-sm font-black uppercase tracking-wide print:!text-black">Grand Total</span>
                <span class="font-mono font-black text-brand-600 dark:text-brand-400 text-2xl leading-none print:!text-black">
                  {{ formatCurrency(po.total_amount) }}
                </span>
              </div>
            </div>
          </BaseCard>

        </div>
      </div>
    </div>

    <!-- Edit PO Modal -->
    <PurchaseOrderEditModal
      v-if="po"
      :is-open="isEditModalOpen"
      :workspace-id="workspaceId"
      :po="po"
      @close="isEditModalOpen = false"
      @updated="fetchPODetails"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, h } from "vue"
import { useRoute, useRouter } from "vue-router"
import { 
  ArrowLeft, FileText, Printer, AlertTriangle, Edit2, 
  Send, CheckCircle, XCircle, Mail, Calendar 
} from "lucide-vue-next"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"

import BaseCard from "@/components/ui/BaseCard.vue"
import PurchaseOrderEditModal from "./PurchaseOrderEditModal.vue"

import { purchaseOrderService } from "../services/purchase_order.service"
import type { PurchaseOrder, PurchaseOrderStatus } from "../types/purchase_order.types"

// --- Helper Components ---
const StatusBadge = (props: { status: string }) => {
  const getStyle = () => {
    switch (props.status.toUpperCase()) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 print:!border-slate-300 print:!text-black print:!bg-transparent'
      case 'SENT': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 print:!border-slate-300 print:!text-black print:!bg-transparent'
      case 'RECEIVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 print:!border-slate-300 print:!text-black print:!bg-transparent'
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 print:!border-slate-300 print:!text-black print:!bg-transparent'
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 print:!border-slate-300 print:!text-black print:!bg-transparent'
    }
  }

  return h('span', {
    class: `inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStyle()}`
  }, [
    h('span', { class: 'w-1.5 h-1.5 rounded-full bg-current opacity-75 mr-2 print:hidden' }),
    props.status
  ])
}

// --- Logic ---
const LOCALE = "en-GB"

const route = useRoute()
const workspaceId = route.params.workspaceId as string
const poId = route.params.id as string

const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const po = ref<PurchaseOrder | null>(null)
const isLoading = ref(true)
const isEditModalOpen = ref(false)

const fetchPODetails = async () => {
  try {
    isLoading.value = true
    po.value = await purchaseOrderService.getOne(workspaceId, poId)
  } catch (err) {
    console.error(err)
    showToast("Failed to retrieve purchase order details", "error")
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "GBP"
  }).format(cents / 100)
}

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A"
  return new Date(isoString).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

const updateStatus = async (nextStatus: PurchaseOrderStatus) => {
  const isTransitionConfirmed = await confirm({
    title: `Transition to ${nextStatus}`,
    message: `Are you sure you want to transition this purchase order status to ${nextStatus}? This action dictates downstream procurement processing.`,
    confirmText: "Confirm Change",
    cancelText: "Cancel",
    variant: nextStatus === "CANCELLED" ? "danger" : "primary"
  })

  if (!isTransitionConfirmed) return

  try {
    await purchaseOrderService.update(workspaceId, poId, { status: nextStatus })
    showToast(`PO successfully moved to ${nextStatus}`, "success")
    await fetchPODetails()
  } catch (err) {
    console.error(err)
    showToast("Unable to process status state change", "error")
  }
}

const printPO = () => {
  window.print()
}

onMounted(() => {
  fetchPODetails()
})
</script>

<style scoped>

/* Base print settings - highly specific overrides are handled by Tailwind print:* modifiers directly in the template */
@media print {
  @page {
    margin: 1.5cm;
    size: auto;
  }
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
