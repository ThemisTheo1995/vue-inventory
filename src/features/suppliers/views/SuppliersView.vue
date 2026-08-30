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
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus class="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>
    </header>

    <!-- Main Table Component -->
    <BaseTable
      :items="suppliers"
      :is-loading="isTableLoading"
      :is-read-only="isReadOnly"
      v-model:search-query="searchQuery"
      :is-searching="isSearching"
      search-placeholder="Search suppliers by name or email..."
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :column-span="isReadOnly ? 2 : 3"
      empty-title="No suppliers found"
      empty-description="Get started by adding your first vendor to the directory."
      create-button-text="Add First Supplier"
      @prev-page="prevPage"
      @next-page="nextPage"
      @create="isCreateModalOpen = true"
    >
      <!-- ================= MOBILE LIST VIEW ================= -->
      <template #mobile-cards>
        <div 
          v-for="supplier in suppliers" 
          :key="supplier.id"
          @click="navigateToSupplier(supplier.id)"
          class="relative p-4 sm:p-5 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 active:bg-slate-200/60 dark:active:bg-slate-700/60 transition-colors cursor-pointer group bg-transparent"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold uppercase">
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
                {{ supplier.email || '—' }}
              </span>
            </div>
            <div v-if="!isReadOnly" class="shrink-0">
              <button
                @click.stop="deleteSupplier(supplier)"
                class="p-2 -mr-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100/60 dark:hover:bg-red-950/60 transition-colors"
                title="Archive supplier"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE VIEW ================= -->
      <template #desktop-headers>
        <th :class="[supplierColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Supplier
        </th>
        <th :class="[emailColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Email
        </th>
        <th v-if="!isReadOnly" class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">
          Actions
        </th>
      </template>

      <template #desktop-rows>
        <tr
          v-for="supplier in suppliers"
          :key="supplier.id"
          @click="navigateToSupplier(supplier.id)"
          class="group hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer bg-transparent"
        >
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold uppercase">
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
              <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500 hidden xl:block shrink-0" />
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
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-950/60 rounded-lg transition-all active:scale-95"
                title="Archive supplier"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

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
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Plus, Trash2, Mail } from "lucide-vue-next"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import BaseTable from "@/components/ui/BaseTable.vue"
import SupplierCreateModal from "./SupplierCreateModal.vue"

import { supplierService } from "../services/supplier.service"
import type { Supplier } from "../types/supplier.types"

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

const supplierColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[40%]")
const emailColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[45%]")

const fetchSuppliers = async (searchVal = searchQuery.value) => {
  try {
    const data = await supplierService.getAll(workspaceId, searchVal, currentPage.value, itemsPerPage.value)
    suppliers.value = data.items || []
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
  navigateToSupplier(supplier.id)
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
