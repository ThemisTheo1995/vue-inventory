<template>
  <div class="print:hidden">
    <!-- Trigger Button in Header -->
    <button
      @click="openModal"
      class="flex items-center justify-between w-full max-w-md px-3 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl transition-all duration-150 shadow-sm group focus:outline-none focus:ring-2 focus:ring-brand-500/50"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <Search class="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
        <span class="truncate">Search customers, orders, inventory...</span>
      </div>
      <kbd class="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs shrink-0 ml-2">
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>

    <!-- Modal Backdrop & Command Palette -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs"
          @click.self="closeModal"
        >
          <div
            class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
            role="dialog"
            aria-modal="true"
          >
            <!-- Input Bar -->
            <div class="relative flex items-center px-4 border-b border-slate-200/80 dark:border-slate-800/80">
              <Search class="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search across your entire ERP..."
                class="w-full py-4 text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                @keydown="handleKeydown"
              />
              <Loader2 v-if="isLoading" class="w-5 h-5 text-brand-500 animate-spin shrink-0 ml-2" />
              <button
                v-else-if="searchQuery"
                @click="clearQuery"
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md shrink-0 ml-2"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Results List -->
            <div class="flex-1 overflow-y-auto p-2 space-y-1">
              <!-- Empty Query State -->
              <div v-if="!searchQuery.trim()" class="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                Type anything to search customers, suppliers, items, and orders...
              </div>

              <!-- No Results State -->
              <div v-else-if="!isLoading && results.length === 0" class="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No matches found for <span class="font-medium text-slate-900 dark:text-slate-200">"{{ searchQuery }}"</span>
              </div>

              <!-- Result Items -->
              <div
                v-for="(item, index) in results"
                :key="`${item.entity_type}-${item.id}`"
                @click="selectResult(item)"
                @mouseenter="selectedIndex = index"
                :class="[
                  'flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors text-sm',
                  selectedIndex === index
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0 pr-2">
                  <!-- Entity Icon Badge -->
                  <div :class="['p-2 rounded-lg shrink-0', getEntityBadgeClass(item.entity_type)]">
                    <component :is="getEntityIcon(item.entity_type)" class="w-4 h-4" />
                  </div>
                  
                  <div class="min-w-0">
                    <p class="font-medium truncate text-slate-900 dark:text-slate-100">{{ item.title }}</p>
                    <p v-if="item.snippet" class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {{ item.snippet }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                    {{ formatEntityType(item.entity_type) }}
                  </span>
                  <CornerDownLeft v-if="selectedIndex === index" class="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono">↑</kbd>
                  <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono">↓</kbd>
                  to navigate
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono">↵</kbd>
                  to select
                </span>
              </div>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Search, 
  X, 
  Loader2, 
  CornerDownLeft, 
  Users, 
  Truck, 
  Package, 
  ShoppingCart, 
  Boxes, 
  ArrowLeftRight 
} from 'lucide-vue-next'
import { searchService } from '../service/search.service'
import type { SearchResult, EntityType } from '../types/search.types'

const router = useRouter()
const route = useRoute()

const isOpen = ref(false)
const searchQuery = ref('')
const results = ref<SearchResult[]>([])
const isLoading = ref(false)
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const openModal = () => {
  isOpen.value = true
  selectedIndex.value = 0
  nextTick(() => searchInput.value?.focus())
}

const closeModal = () => {
  isOpen.value = false
  searchQuery.value = ''
  results.value = []
}

const clearQuery = () => {
  searchQuery.value = ''
  results.value = []
  searchInput.value?.focus()
}

watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  
  if (!newQuery.trim()) {
    results.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  debounceTimeout = setTimeout(async () => {
    const workspaceId = route.params.workspaceId as string
    if (workspaceId) {
      try {
        results.value = await searchService.search(workspaceId, newQuery)
        selectedIndex.value = 0
      } catch (err) {
        console.error('Search error:', err)
        results.value = []
      } finally {
        isLoading.value = false
      }
    } else {
      isLoading.value = false
    }
  }, 2000)
})

// Keyboard Actions inside Modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (results.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % results.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (results.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const selectedItem = results.value[selectedIndex.value]
    if (selectedItem) {
      selectResult(selectedItem)
    }
  } else if (e.key === 'Escape') {
    closeModal()
  }
}

// Global Keyboard Shortcut (⌘K / Ctrl+K)
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value ? closeModal() : openModal()
  }
}

const selectResult = (item?: SearchResult) => {
  if (!item) return
  closeModal()
  
  const workspaceId = route.params.workspaceId as string
  
  if (workspaceId) {
    const formattedPath = item.url.startsWith('/') ? item.url : `/${item.url}`
    router.push(`/${workspaceId}${formattedPath}`)
  } else {
    router.push(item.url)
  }
}

// Visual Helpers
const getEntityIcon = (type: EntityType) => {
  switch (type) {
    case 'CUSTOMER': return Users
    case 'SUPPLIER': return Truck
    case 'ITEM': return Package
    case 'SELL_ORDER': return ShoppingCart
    case 'INVENTORY': return Boxes
    case 'STOCK_MOVEMENT': return ArrowLeftRight
    default: return Search
  }
}

const getEntityBadgeClass = (type: EntityType) => {
  switch (type) {
    case 'CUSTOMER': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'SUPPLIER': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'ITEM': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'SELL_ORDER': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    case 'INVENTORY': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    case 'STOCK_MOVEMENT': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    default: return 'bg-slate-500/10 text-slate-600'
  }
}

const formatEntityType = (type: EntityType) => {
  return type.replace('_', ' ').toLowerCase()
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
