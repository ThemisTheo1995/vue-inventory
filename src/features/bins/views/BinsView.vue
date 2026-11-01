<!-- src/views/bins/BinsView.vue -->
<template>
  <div class="space-y-6 pb-6 lg:pb-10 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
          {{ $route.meta.title || 'Bins' }}
        </h1>
        <p class="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          {{ $route.meta.description || 'Manage your warehouse bin locations and zones.' }}
        </p>
      </div>

      <div v-if="!isReadOnly" class="flex items-center shrink-0">
        <button
          type="button"
          @click="isCreateModalOpen = true"
          class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm overflow-hidden shadow-md hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 active:scale-95 transition-all duration-200"
        >
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Add Bin</span>
        </button>
      </div>
    </header>

    <!-- Main Table Component -->
    <BaseTable
      :items="bins"
      :is-loading="isTableLoading"
      :is-read-only="isReadOnly"
      v-model:search-query="searchQuery"
      :is-searching="isSearching"
      search-placeholder="Search bins by code or zone..."
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :column-span="isReadOnly ? 4 : 5"
      empty-title="No bins found"
      empty-description="Get started by adding your first warehouse bin location."
      create-button-text="Add First Bin"
      @prev-page="prevPage"
      @next-page="nextPage"
      @create="isCreateModalOpen = true"
    >
      <!-- ================= MOBILE LIST VIEW ================= -->
      <template #mobile-cards>
        <div
          v-for="bin in bins"
          :key="bin.id"
          @click="navigateToBin(bin.id)"
          class="relative p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform shrink-0">
                <ShelvingUnit class="w-5 h-5" />
              </div>

              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-base font-mono leading-tight tracking-wide truncate">
                  {{ bin.code }}
                </p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                  ID: {{ bin.id.slice(0, 8) }}
                </p>
              </div>
            </div>

            <!-- Quantity on hand -->
            <div class="shrink-0 text-right">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                On hand
              </p>
              <span class="inline-flex items-center justify-center min-w-[2.5rem] mt-0.5 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-sm font-bold font-mono">
                {{ bin.quantity_on_hand ?? 0 }}
              </span>
            </div>
          </div>

          <div class="flex justify-between items-end gap-3 mt-4">
            <div class="flex items-center gap-2 min-w-0 truncate pr-2">
              <MapPin class="w-4 h-4 text-slate-400 shrink-0" />
              <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                {{ bin.zone || 'Unassigned Zone' }}
              </span>
            </div>

            <div v-if="!isReadOnly" class="shrink-0" @click.stop>
              <AsyncButton
                :action="() => deleteBin(bin)"
                class="!p-2 -mr-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:!bg-red-50 dark:hover:!bg-red-400/10 transition-colors"
                title="Delete bin"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>
            </div>
          </div>
        </div>
      </template>

      <!-- ================= DESKTOP TABLE VIEW ================= -->
      <template #desktop-headers>
        <th :class="[codeColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Bin Code
        </th>
        <th :class="[zoneColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Zone
        </th>
        <th :class="[quantityColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Qty On Hand
        </th>
        <th :class="[dateColumnClass, 'px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500']">
          Created At
        </th>
        <th
          v-if="!isReadOnly"
          class="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right"
        >
          Actions
        </th>
      </template>

      <template #desktop-rows>
        <tr
          v-for="bin in bins"
          :key="bin.id"
          @click="navigateToBin(bin.id)"
          class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <!-- Bin Code -->
          <td class="px-6 py-4 relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                <ShelvingUnit class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 dark:text-white text-sm font-mono truncate" :title="bin.code">
                  {{ bin.code }}
                </p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider truncate">
                  ID: {{ bin.id.slice(0, 8) }}
                </p>
              </div>
            </div>
          </td>

          <!-- Zone -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-2 min-w-0">
              <MapPin class="w-4 h-4 text-slate-400 dark:text-slate-500 hidden xl:block shrink-0" />
              <span class="text-sm font-medium text-slate-600 dark:text-slate-300 truncate" :title="bin.zone || ''">
                {{ bin.zone || '—' }}
              </span>
            </div>
          </td>

          <!-- Quantity on hand -->
          <td class="px-6 py-4">
            <span class="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-sm font-bold font-mono">
              {{ bin.quantity_on_hand ?? 0 }}
            </span>
          </td>

          <!-- Created At -->
          <td class="px-6 py-4">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
              {{ new Date(bin.created_at).toLocaleDateString() }}
            </span>
          </td>

          <!-- Actions -->
          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
            <div class="flex items-center justify-end" @click.stop>
              <AsyncButton
                :action="() => deleteBin(bin)"
                class="opacity-0 group-hover:opacity-100 !p-2 !bg-transparent !min-w-0 !border-none text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-400/10 rounded-lg transition-all transform active:scale-95"
                title="Delete bin"
              >
                <Trash2 class="w-4 h-4" />
              </AsyncButton>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>

    <!-- Create Bin Modal -->
    <BinCreateModal
      v-if="!isReadOnly"
      :is-open="isCreateModalOpen"
      :workspace-id="workspaceId"
      @close="isCreateModalOpen = false"
      @created="onBinCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Plus, Trash2, ShelvingUnit, MapPin } from "lucide-vue-next"

import AsyncButton from "@/components/layout/AsyncButton.vue"
import BaseTable from "@/components/ui/table/BaseTable.vue"
import BinCreateModal from "./BinCreateModal.vue"

import { useConfirm } from "@/composables/useConfirm"
import { useToast } from "@/composables/useToast"
import { useSearch } from "@/composables/useSearch"

import { binService } from "../services/bin.service"
import type { Bin } from "../types/bin.types"

const route = useRoute()
const router = useRouter()

const workspaceId = route.params.workspaceId as string
const isReadOnly = computed(() => localStorage.getItem("role") === "read_only")

const { confirm } = useConfirm()
const { showToast } = useToast()

const bins = ref<Bin[]>([])
const isLoading = ref(true)
const isCreateModalOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value))
)

const codeColumnClass = computed(() =>
  isReadOnly.value ? "w-[30%]" : "w-[25%]"
)
const zoneColumnClass = computed(() => "w-[25%]")
const quantityColumnClass = "w-[15%]"
const dateColumnClass = computed(() =>
  isReadOnly.value ? "w-[30%]" : "w-[20%]"
)

const fetchBins = async (searchVal = searchQuery.value) => {
  try {
    const data = await binService.getBins(
      workspaceId,
      searchVal,
      currentPage.value,
      itemsPerPage.value
    )

    bins.value = data.items || []
    totalItems.value = data.total || 0
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.detail ||
      err.message ||
      "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage[0]?.msg || "An unexpected error occurred"
      : errorMessage

    showToast(displayMessage, "error")
  }
}

const onSearchTriggered = async (term: string) => {
  currentPage.value = 1
  await fetchBins(term)
}

const { searchQuery, isSearching } = useSearch(onSearchTriggered)
const isTableLoading = computed(() => isLoading.value || isSearching.value)

const changePage = async (nextPage: number) => {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === currentPage.value) {
    return
  }

  currentPage.value = nextPage
  isLoading.value = true

  try {
    await fetchBins()
  } finally {
    isLoading.value = false
  }
}

const nextPage = () => changePage(currentPage.value + 1)
const prevPage = () => changePage(currentPage.value - 1)

const navigateToBin = (id: string) => {
  router.push({ name: "bin-details", params: { id } })
}

const getErrorMessage = (err: any): string => {
  const detail = err.response?.data?.detail || err.message || "An unexpected error occurred"

  return Array.isArray(detail)
    ? detail[0]?.msg || "An unexpected error occurred"
    : detail
}

const deleteBin = async (bin: Bin) => {
  const confirmed = await confirm({
    title: "Delete Bin",
    message: `Are you sure you want to delete bin ${bin.code}?`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger"
  })

  if (!confirmed) return

  try {
    await binService.deleteBin(workspaceId, bin.id)

    totalItems.value = Math.max(0, totalItems.value - 1)
    showToast("Bin deleted successfully", "success")

    if (bins.value.length === 1 && currentPage.value > 1) {
      await changePage(currentPage.value - 1)
    } else {
      await fetchBins()
    }
  } catch (err: any) {
    showToast(getErrorMessage(err), "error")
  }
}

const onBinCreated = (bin: Bin) => {
  totalItems.value++
  navigateToBin(bin.id)
}

onMounted(async () => {
  isLoading.value = true

  try {
    await fetchBins()
  } finally {
    isLoading.value = false
  }
})
</script>
