<!-- src/views/suppliers/SupplierDetailView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    
    <!-- Breadcrumb Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link
          :to="{ name: 'suppliers', params: { workspaceId } }"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all shadow-sm active:scale-95 group"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </router-link>

        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
            {{ $route.meta.title || 'Supplier Details' }}
          </h1>
          <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            {{ $route.meta.description || 'View and manage vendor profile and history.' }}
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

      <!-- Supplier Data View -->
      <template v-else-if="supplier">
        
        <!-- Header Profile Card -->
        <BaseCard class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
          <div class="flex items-center gap-4 sm:gap-5">
            <!-- Indigo rounded-full supplier avatar -->
            <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl uppercase shadow-sm border border-indigo-100 dark:border-indigo-800/50">
              {{ supplier.name.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {{ supplier.name }}
              </h2>
              <div class="flex items-center gap-2 mt-1.5">
                <a v-if="supplier.email" :href="'mailto:' + supplier.email" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-500/30 transition-colors">
                  <Mail class="w-3 h-3 text-slate-400" />
                  {{ supplier.email }}
                </a>
                <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-mono font-medium text-slate-400 italic">
                  No email provided
                </span>
              </div>
            </div>
          </div>

          <!-- Actions (Edit button) -->
          <div
            v-if="!isReadOnly"
            class="flex items-center gap-3 w-full sm:w-auto shrink-0"
          >
            <button
              @click="isEditModalOpen = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all duration-200"
            >
              <Edit2 class="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </BaseCard>

        <!-- Dynamic Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Column 1: Details Sidebar -->
          <div class="lg:col-span-1 flex flex-col space-y-6">
            <BaseCard class="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                Supplier Details
              </h3>
              
              <div class="space-y-5">
                <!-- Supplier ID -->
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Supplier ID</p>
                  <div class="flex items-center gap-2 group/id">
                    <span class="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]" :title="supplier.id">
                      {{ supplier.id }}
                    </span>
                    <button 
                      @click="copyIdToClipboard(supplier.id)"
                      class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-0 group-hover/id:opacity-100 shrink-0"
                      title="Copy Supplier ID"
                    >
                      <Check v-if="copiedId" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <hr class="border-slate-200/60 dark:border-slate-800/60" />

                <!-- Created Date -->
                <div v-if="supplier.created_at">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Added to System</p>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ formatDate(supplier.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Column 2: Orders / Items Pane -->
          <div class="lg:col-span-2 flex flex-col">
            <BaseCard class="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
              <section class="h-full min-h-[350px] flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <!-- Using Truck instead of ShoppingBag to match Supplier context -->
                <div class="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                  <Truck class="w-8 h-8 text-slate-400 opacity-80" />
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">No Connected Data</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  When this supplier is linked to purchase orders, inventory items, or invoices, their records will be securely displayed here.
                </p>
              </section>
            </BaseCard>
          </div>

        </div>
      </template>
    </div>

    <!-- Edit Modal Integration -->
    <SupplierEditModal
      v-if="supplier && !isReadOnly"
      :is-open="isEditModalOpen"
      :workspace-id="workspaceId"
      :supplier="supplier"
      @close="isEditModalOpen = false"
      @updated="onSupplierUpdated"
    />
  </div>
</template>

<script setup lang="ts">
// 1. Vue Core
import { computed, ref, onMounted } from 'vue'

// 2. Vue Router
import { useRoute, useRouter } from 'vue-router'

// 3. Icons (Alphabetized)
import { ArrowLeft, Calendar, Check, Copy, Edit2, Mail, Truck } from 'lucide-vue-next'

// 4. Types & Services
import type { Supplier } from '../types/supplier.types'
import { supplierService } from '../services/supplier.service'

// 5. Components
import BaseCard from '@/components/ui/BaseCard.vue'
import SupplierEditModal from './SupplierEditModal.vue'

const LOCALE = 'en-GB'

const route = useRoute()
const router = useRouter()
const workspaceId = route.params.workspaceId as string
const supplierId = route.params.id as string
const isReadOnly = computed(() => localStorage.getItem('role') === 'read_only')

const supplier = ref<Supplier | null>(null)
const isLoading = ref(true)
const copiedId = ref(false)
const isEditModalOpen = ref(false)

const fetchSupplier = async () => {
  try {
    isLoading.value = true
    supplier.value = await supplierService.getOne(workspaceId, supplierId)
  } catch (error) {
    console.error('Error fetching supplier:', error)
    router.push({ name: 'suppliers', params: { workspaceId } })
  } finally {
    isLoading.value = false
  }
}

const copyIdToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = true
    setTimeout(() => { copiedId.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy ID:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const onSupplierUpdated = (updatedData: Supplier) => {
  if (isReadOnly.value) return
  supplier.value = updatedData
}

onMounted(() => {
  fetchSupplier()
})
</script>
