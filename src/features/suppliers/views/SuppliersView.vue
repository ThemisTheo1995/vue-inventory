<!-- src/views/suppliers/SuppliersView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ $route.meta.title || 'Suppliers' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Manage your supplier and vendor directory.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          @click="isCreateModalOpen = true"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Add Supplier</span>
        </button>
      </div>
    </header>

    <!-- Main Content Card -->
    <BaseCard class="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] min-h-[500px] border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      
      <!-- Toolbar -->
      <div class="shrink-0 p-4 sm:p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
        <div class="relative max-w-md w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg v-if="isSearching" class="animate-spin h-4 w-4 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <Search v-else class="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search suppliers by name or email..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200"
          />
        </div>
      </div>

      <!-- Data View Wrapper -->
      <div class="flex-1 overflow-y-auto  bg-slate-50/30 dark:bg-slate-900/30">
        
        <!-- ================= MOBILE LIST VIEW ================= -->
        <div class="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
          
          <!-- Mobile Skeleton -->
          <template v-if="isTableLoading">
            <div v-for="i in 5" :key="'mob-skel-'+i" class="p-4 sm:p-5 animate-pulse space-y-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-32"></div>
                    <div class="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-20"></div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-end">
                <div class="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-40"></div>
              </div>
            </div>
          </template>

          <!-- Mobile Empty State -->
          <div v-else-if="!suppliers.length" class="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <EmptyStateContent :is-read-only="isReadOnly" @create="isCreateModalOpen = true" />
          </div>

          <!-- Mobile Cards -->
          <template v-else>
            <div 
              v-for="supplier in suppliers" 
              :key="supplier.id"
              @click="navigateToSupplier(supplier.id)"
              class="relative p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                    {{ supplier.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
                      {{ supplier.name }}
                    </p>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                      ID: {{ supplier.id.slice(0, 8) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-end mt-4">
                <div class="flex items-center gap-2 truncate pr-4">
                  <Mail class="w-4 h-4 text-slate-400 shrink-0" />
                  <span 
                    class="font-mono text-sm font-bold truncate" 
                    :class="supplier.email ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 font-medium italic'"
                  >
                    {{ supplier.email || 'No email provided' }}
                  </span>
                </div>
                <div v-if="!isReadOnly" class="shrink-0">
                  <button
                    @click.stop="deleteSupplier(supplier)"
                    class="p-2 -mr-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
                    title="Archive supplier"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- ================= DESKTOP TABLE VIEW ================= -->
        <div class="hidden md:block w-full">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[inset_0_-1px_0_0_theme(colors.slate.200)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800)]">
              <tr>
                <th :class="[supplierColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
                  Supplier
                </th>
                <th :class="[emailColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
                  Email
                </th>
                <th v-if="!isReadOnly" class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              <!-- Desktop Skeleton -->
              <tr v-if="isTableLoading" v-for="i in 6" :key="'desk-skel-'+i" class="animate-pulse bg-white/30 dark:bg-slate-900/30">
                <td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700/50"></div><div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-32"></div></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-48"></div></td>
                <td v-if="!isReadOnly" class="px-6 py-4"></td>
              </tr>

              <!-- Desktop Empty State -->
              <tr v-else-if="!suppliers.length">
                <td :colspan="isReadOnly ? 2 : 3" class="py-24 text-center">
                  <EmptyStateContent :is-read-only="isReadOnly" @create="isCreateModalOpen = true" />
                </td>
              </tr>

              <!-- Desktop Rows -->
              <tr
                v-else
                v-for="supplier in suppliers"
                :key="supplier.id"
                @click="navigateToSupplier(supplier.id)"
                class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <!-- First cell gets 'relative' for the highlight line (HTML compliant) -->
                <td class="px-6 py-4 relative">
                  <!-- Interactive left border highlight -->
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                      {{ supplier.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-slate-900 dark:text-white text-sm truncate" :title="supplier.name">
                        {{ supplier.name }}
                      </p>
                      <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate">
                        ID: {{ supplier.id.slice(0, 8) }}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500 hidden xl:block" />
                    <span 
                      class="font-mono text-sm font-bold truncate" 
                      :class="supplier.email ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 font-medium italic'"
                      :title="supplier.email ?? 'No email provided'"
                    >
                      {{ supplier.email || '—' }}
                    </span>
                  </div>
                </td>

                <td v-if="!isReadOnly" class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end" @click.stop>
                    <button
                      @click.stop="deleteSupplier(supplier)"
                      class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-all transform active:scale-95"
                      title="Archive supplier"
                    >
                      <Trash2 class="w-4 h-4" />
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
          Showing <span class="font-bold text-slate-700 dark:text-slate-300">{{ suppliers.length ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }}</span>
          to <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
          of <span class="font-bold text-slate-700 dark:text-slate-300">{{ totalItems }}</span>
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

    <SupplierCreateModal 
      v-if="!isReadOnly" 
      :is-open="isCreateModalOpen" 
      :workspace-id="workspaceId" 
      @close="isCreateModalOpen = false" 
      @created="onSupplierCreated" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, h } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, Truck, Mail } from "lucide-vue-next"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import BaseCard from "@/components/ui/BaseCard.vue"
import SupplierCreateModal from "./SupplierCreateModal.vue"

import { supplierService } from "../services/supplier.service"
import type { Supplier } from "../types/supplier.types"

// --- Helper Components ---
const EmptyStateContent = (props: { isReadOnly: boolean }, { emit }: any) => {
  return h('div', { class: 'flex flex-col items-center justify-center space-y-4' }, [
    h('div', { class: 'flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-inner' }, [
      h(Truck, { class: 'w-8 h-8 opacity-80' })
    ]),
    h('div', { class: 'text-center' }, [
      h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white' }, 'No suppliers found'),
      h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto' }, 
        props.isReadOnly 
          ? 'There are currently no suppliers matching your search.' 
          : 'Get started by adding your first vendor to the directory.'
      )
    ]),
    !props.isReadOnly ? h('button', {
      onClick: () => emit('create'),
      class: 'mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition shadow-md hover:shadow-lg active:scale-95 inline-flex items-center gap-2'
    }, [
      h(Plus, { class: 'w-4 h-4' }),
      'Add First Supplier'
    ]) : null
  ])
}
EmptyStateContent.emits = ['create']

// --- Logic ---
const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const suppliers = ref<Supplier[]>([])
const isLoading = ref(true)
const isCreateModalOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

// Match exact column proportions dynamically based on read-only status
const supplierColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[40%]")
const emailColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[45%]")

const fetchSuppliers = async (searchVal = searchQuery.value) => {
  try {
    const data = await supplierService.getAll(workspaceId, searchVal, currentPage.value, itemsPerPage.value)
    suppliers.value = data.items || []
    totalItems.value = data.total || 0
  } catch (err) {
    console.error("Error fetching suppliers:", err)
    showToast("Failed to load suppliers", "error")
  }
}

const onSearchTriggered = async (term: string) => {
  currentPage.value = 1
  await fetchSuppliers(term)
}

const { searchQuery, isSearching } = useSearch(onSearchTriggered)
const isTableLoading = computed(() => isLoading.value || isSearching.value)

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  isLoading.value = true
  await fetchSuppliers()
  isLoading.value = false
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  isLoading.value = true
  await fetchSuppliers()
  isLoading.value = false
}

const navigateToSupplier = (id: string) => {
  router.push({ name: "supplier-details", params: { id } })
}

const deleteSupplier = async (supplier: Supplier) => {
  const confirmed = await confirm({
    title: "Archive Supplier",
    message: `Are you sure you want to archive ${supplier.name}?`,
    confirmText: "Archive",
    cancelText: "Cancel",
    variant: "danger"
  })

  if (!confirmed) return

  try {
    await supplierService.delete(workspaceId, supplier.id)
    suppliers.value = suppliers.value.filter((s) => s.id !== supplier.id)
    totalItems.value = Math.max(0, totalItems.value - 1)
    showToast("Supplier archived successfully", "success")
    
    // Auto-fetch if page is now empty but there are previous pages
    if (suppliers.value.length === 0 && currentPage.value > 1) {
      prevPage()
    }
  } catch (error) {
    console.error("Error deleting supplier:", error)
    showToast("Failed to archive supplier", "error")
  }
}

const onSupplierCreated = (supplier: Supplier) => {
  suppliers.value.unshift(supplier)
  totalItems.value++
  navigateToSupplier(supplier.id) // Auto-navigate consistency
}

onMounted(async () => {
  isLoading.value = true
  try {
    await fetchSuppliers()
  } finally {
    isLoading.value = false
  }
})
</script>
