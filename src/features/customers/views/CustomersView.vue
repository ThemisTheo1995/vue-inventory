<!-- src/views/customers/CustomersView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Customers' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Manage your customer directory.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          @click="isCreateModalOpen = true"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Add Customer</span>
        </button>
      </div>
    </header>

    <!-- Main Table Component -->
    <BaseTable
      :items="customers"
      :is-loading="isTableLoading"
      :is-read-only="isReadOnly"
      v-model:search-query="searchQuery"
      :is-searching="isSearching"
      search-placeholder="Search customers by name or email..."
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :column-span="isReadOnly ? 2 : 3"
      empty-title="No customers found"
      empty-description="Get started by adding your first client to the directory."
      create-button-text="Add First Customer"
      @prev-page="prevPage"
      @next-page="nextPage"
      @create="isCreateModalOpen = true"
    >
      <!-- ================= MOBILE LIST VIEW ================= -->
      <template #mobile-cards>
        <div 
          v-for="customer in customers" 
          :key="customer.id"
          @click="navigateToCustomer(customer.id)"
          class="relative p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                {{ customer.first_name.charAt(0) }}{{ customer.last_name?.charAt(0) || '' }}
              </div>
              <div>
                <p class="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
                  {{ customer.first_name }} {{ customer.last_name || "" }}
                </p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                  ID: {{ customer.id.slice(0, 8) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-end mt-4">
            <div class="flex items-center gap-2 truncate pr-4">
              <Mail class="w-4 h-4 text-slate-400 shrink-0" />
              <span class="font-mono text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
                {{ customer.email }}
              </span>
            </div>
            <div v-if="!isReadOnly" class="shrink-0">
              <AsyncButton
                :action="() => deleteCustomer(customer)"
                @click.stop
                class="!p-2 -mr-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:!bg-red-50 dark:hover:!bg-red-400/10 transition-colors"
                title="Archive customer"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>
            </div>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE VIEW ================= -->
      <template #desktop-headers>
        <th :class="[customerColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Customer
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
          v-for="customer in customers"
          :key="customer.id"
          @click="navigateToCustomer(customer.id)"
          class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <!-- Interactive left border highlight -->
          <td class="px-6 py-4 relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                {{ customer.first_name.charAt(0) }}{{ customer.last_name?.charAt(0) || '' }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-sm truncate" :title="`${customer.first_name} ${customer.last_name || ''}`">
                  {{ customer.first_name }} {{ customer.last_name || "" }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate">
                  ID: {{ customer.id.slice(0, 8) }}
                </p>
              </div>
            </div>
          </td>
          
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500 hidden xl:block" />
              <span class="font-mono text-sm font-bold text-slate-600 dark:text-slate-300 truncate" :title="customer.email">
                {{ customer.email }}
              </span>
            </div>
          </td>

          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end" @click.stop>
              <AsyncButton
                :action="() => deleteCustomer(customer)"
                class="opacity-0 group-hover:opacity-100 !p-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-400/10 rounded-lg transition-all transform active:scale-95"
                title="Archive customer"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <CustomerCreateModal 
      v-if="!isReadOnly" 
      :is-open="isCreateModalOpen" 
      :workspace-id="workspaceId" 
      @close="isCreateModalOpen = false" 
      @created="onCustomerCreated" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Plus, Trash2, Mail } from "lucide-vue-next"

import AsyncButton from "@/components/layout/AsyncButton.vue"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import BaseTable from "@/components/ui/table/BaseTable.vue"
import CustomerCreateModal from "./CustomerCreateModal.vue"

import { customerService } from "../services/customer.service"
import type { Customer } from "../types/customer.types"

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const customers = ref<Customer[]>([])
const isLoading = ref(true)
const isCreateModalOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

// Match exact column proportions dynamically based on read-only status
const customerColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[40%]")
const emailColumnClass = computed(() => isReadOnly.value ? "w-1/2" : "w-[45%]")

const fetchCustomers = async (searchVal = searchQuery.value) => {
  try {
    const data = await customerService.getAll(workspaceId, searchVal, currentPage.value, itemsPerPage.value)
    customers.value = data.items || []
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
  await fetchCustomers(term)
}

const { searchQuery, isSearching } = useSearch(onSearchTriggered)
const isTableLoading = computed(() => isLoading.value || isSearching.value)

const nextPage = async () => {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  isLoading.value = true
  await fetchCustomers()
  isLoading.value = false
}

const prevPage = async () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  isLoading.value = true
  await fetchCustomers()
  isLoading.value = false
}

const navigateToCustomer = (id: string) => {
  router.push({ name: "customer-details", params: { id } })
}

const deleteCustomer = async (customer: Customer) => {
  const confirmed = await confirm({
    title: "Archive Customer",
    message: `Are you sure you want to archive ${customer.first_name} ${customer.last_name ?? ""}?`,
    confirmText: "Archive",
    cancelText: "Cancel",
    variant: "danger"
  })

  if (!confirmed) return

  try {
    await customerService.delete(workspaceId, customer.id)
    customers.value = customers.value.filter((c) => c.id !== customer.id)
    totalItems.value = Math.max(0, totalItems.value - 1)
    showToast("Customer archived successfully", "success")
    
    if (customers.value.length === 0 && currentPage.value > 1) {
      prevPage()
    }
  } catch (error) {
    console.error(error)
    showToast("Failed to archive customer", "error")
  }
}

const onCustomerCreated = (customer: Customer) => {
  customers.value.unshift(customer)
  totalItems.value++
  navigateToCustomer(customer.id)
}

onMounted(async () => {
  isLoading.value = true
  try {
    await fetchCustomers()
  } finally {
    isLoading.value = false
  }
})
</script>
