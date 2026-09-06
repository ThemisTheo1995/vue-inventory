<template>
  <div class="print:hidden">
    <!-- Desktop Trigger -->
    <button 
      @click="openModal"
      class="hidden md:flex w-full items-center justify-between bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-brand-500/50"
    >
      <div class="flex items-center gap-2">
        <Search class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
        <span class="text-sm truncate">Search customers, orders, inventory...</span>
      </div>
      <kbd class="hidden lg:flex items-center gap-1 font-sans text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md shadow-sm">
        <Command class="w-3 h-3" /> K
      </kbd>
    </button>

    <!-- Mobile Trigger (Icon Button) -->
    <button 
      @click="openModal"
      class="md:hidden p-2 rounded-full hover:bg-slate-100 dark:bg-slate-800/50 hover:dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors focus:outline-none"
    >
      <Search class="w-5 h-5" />
    </button>

    <!-- Modal Backdrop & Command Palette -->
    <Teleport to="body">
      <!-- Backdrop Fade -->
      <Transition name="fade">
        <div 
          v-if="isOpen" 
          @click="closeModal"
          class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[999]"
        ></div>
      </Transition>

      <!-- Palette Animation -->
      <Transition name="cmd-palette">
        <div 
          v-if="isOpen" 
          class="fixed top-4 md:top-[12vh] left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-[1000] flex flex-col max-h-[85vh] md:max-h-[70vh]"
          role="dialog"
          aria-modal="true"
        >
          <!-- Input Bar -->
          <div class="relative flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
            <Search class="w-5 h-5 text-brand-500 shrink-0 mr-3" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search across your entire ERP..."
              class="w-full py-4 text-base md:text-lg bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              @keydown="handleKeydown"
            />
            
            <Loader2 v-if="isLoading" class="w-5 h-5 text-brand-500 animate-spin shrink-0 ml-2" />
            
            <!-- Clear / Close buttons based on state -->
            <button
              v-else-if="searchQuery"
              @click="clearQuery"
              class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md shrink-0 ml-2 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
            <button 
              v-else
              @click="closeModal"
              class="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md shrink-0 ml-2"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Results List -->
          <div class="flex-1 overflow-y-auto p-2 no-scrollbar">
            
            <!-- Empty Query State -->
            <div v-if="!searchQuery.trim()" class="py-12 text-center text-slate-400 dark:text-slate-500 text-sm px-4">
              Type anything to search customers, suppliers, items, and orders...
            </div>

            <!-- No Results State -->
            <div v-else-if="!isLoading && results.length === 0" class="py-12 text-center text-slate-500 dark:text-slate-400 text-sm px-4">
              No matches found for <span class="font-medium text-slate-900 dark:text-slate-200">"{{ searchQuery }}"</span>
            </div>

            <!-- Result Items -->
            <div class="space-y-1">
              <div
                v-for="(item, index) in results"
                :key="`${item.entity_type}-${item.id}`"
                @click="selectResult(item)"
                @mouseenter="selectedIndex = index"
                :class="[
                  'group flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm',
                  selectedIndex === index
                    ? 'bg-brand-50/50 dark:bg-brand-500/10 text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0 pr-2">
                  <!-- Entity Icon Badge -->
                  <div :class="['p-2 rounded-lg shrink-0 transition-colors', getEntityBadgeClass(item.entity_type, selectedIndex === index)]">
                    <component :is="getEntityIcon(item.entity_type)" class="w-4 h-4" />
                  </div>
                  
                  <div class="min-w-0">
                    <p class="font-medium truncate text-slate-900 dark:text-slate-100 transition-colors">{{ item.title }}</p>
                    <p v-if="item.snippet" class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {{ item.snippet }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span 
                    :class="[
                      'text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md transition-colors',
                      selectedIndex === index 
                        ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    ]"
                  >
                    {{ formatEntityType(item.entity_type) }}
                  </span>
                  <CornerDownLeft v-if="selectedIndex === index" class="hidden sm:block w-4 h-4 text-brand-500 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Desktop Only) -->
          <div class="hidden md:flex px-4 py-3 bg-slate-50/50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">↓</kbd>
                navigate
              </span>
              <span class="flex items-center gap-1.5">
                <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">↵</kbd>
                select
              </span>
            </div>
            <span class="flex items-center gap-1.5">
              <kbd class="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono text-[10px]">esc</kbd>
              close
            </span>
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
  Command,
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

const openModal = async () => {
  isOpen.value = true
  selectedIndex.value = 0
  document.body.style.overflow = 'hidden' // Lock scroll for mobile
  await nextTick()
  searchInput.value?.focus()
}

const closeModal = () => {
  isOpen.value = false
  searchQuery.value = ''
  results.value = []
  document.body.style.overflow = '' // Restore scroll
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
  // Reduced debounce to 300ms for a much snappier experience
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
  }, 300)
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

// Added an isActive flag so the icon gets a slight color bump when hovered/selected via keyboard
const getEntityBadgeClass = (type: EntityType, isActive: boolean = false) => {
  switch (type) {
    case 'CUSTOMER': return isActive ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    case 'SUPPLIER': return isActive ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'ITEM': return isActive ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'SELL_ORDER': return isActive ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    case 'INVENTORY': return isActive ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    case 'STOCK_MOVEMENT': return isActive ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    default: return isActive ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
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
  document.body.style.overflow = '' // Cleanup in case component unmounts while open
})
</script>

<style scoped>
/* Backdrop Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal Snappy Apple-style Animation */
.cmd-palette-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.cmd-palette-leave-active {
  transition: all 0.2s ease-in;
}

/* 
  Desktop Transform (originating from center)
*/
@media (min-width: 768px) {
  .cmd-palette-enter-from,
  .cmd-palette-leave-to {
    opacity: 0;
    transform: translate(-50%, -10px) scale(0.98);
  }
  .cmd-palette-enter-to,
  .cmd-palette-leave-from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

/* 
  Mobile Transform (originating from top)
*/
@media (max-width: 767px) {
  .cmd-palette-enter-from,
  .cmd-palette-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  .cmd-palette-enter-to,
  .cmd-palette-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hidden scrollbar functionality for the results list */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
