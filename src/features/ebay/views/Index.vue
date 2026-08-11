<template>
  <div class="space-y-8 animate-fade-in pb-20"> 
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <router-link
          :to="{
            name: 'dashboard',
            params: {
              workspaceId: $route.params.workspaceId
            }
          }"
          class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 transition-all shadow-sm shrink-0"
        >
          <ArrowLeft class="w-5 h-5" />
        </router-link>
  
        <!-- Added pt-0.5 to optically align the text baseline with the button icon -->
        <div class="pt-0.5">
          <div class="flex items-center gap-2 mb-1">
            <img src="../../../assets/dashboard/icons/EbayIcon.webp" class="w-5 h-5 object-contain" alt="eBay" />
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Marketplace Manager</span>
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-wider">
            eBay Integration
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="refreshData"
          :disabled="loading"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
          Sync All
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard v-for="metric in ebayMetrics" :key="metric.label" class="py-4 cursor-default flex flex-col justify-between h-full">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{{ metric.label }}</p>
        
        <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mt-auto">
          
          <h3 class="text-2xl font-black text-slate-900 dark:text-white leading-none break-words max-w-full">
            {{ metric.value }}
          </h3>
          
          <span :class="[
            'shrink-0 whitespace-nowrap text-[11px] font-bold px-2 py-1 rounded-md text-center', 
            metric.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          ]">
            {{ metric.trend }}
          </span>
          
        </div>
      </BaseCard>
    </div>

    <BaseCard class="h-[600px] md:h-[80vh] flex flex-col overflow-hidden cursor-default">
      
      <div class="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search listings by title or SKU..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
          />
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative">
            <select 
              v-model="statusFilter" 
              class="appearance-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto overflow-x-auto -mx-6 -mb-6">
        <table class="w-full text-left border-collapse min-w-[800px]">
          
          <thead>
            <tr>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
                Listing Details
              </th>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
                SKU
              </th>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
                Price
              </th>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
                Stock
              </th>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
                Status
              </th>
              <th class="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 shadow-[inset_0_-1px_0_0_theme(colors.slate.100)] dark:shadow-[inset_0_-1px_0_0_theme(colors.slate.800/50)]">
              </th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
            <tr v-if="loading" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>
                  <div class="w-full max-w-[240px] space-y-2">
                    <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20"></div></td>
              <td class="px-6 py-4 flex justify-end"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-8 mx-auto"></div></td>
              <td class="px-6 py-4"><div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-md w-16"></div></td>
              <td class="px-6 py-4"></td>
            </tr>
            
            <tr v-else-if="filteredListings.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <p class="text-slate-500 font-medium">No items found matching your criteria.</p>
                <button 
                  v-if="searchQuery || statusFilter !== 'all'" 
                  @click="searchQuery = ''; statusFilter = 'all'"
                  class="mt-2 text-sm text-brand-500 font-bold hover:text-brand-600 transition-colors"
                >
                  Clear filters
                </button>
              </td>
            </tr>

            <tr v-else v-for="item in filteredListings" :key="item.external_id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    <img :src="item.image_url || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div class="max-w-[240px]">
                    <p class="font-bold text-slate-900 dark:text-white truncate" :title="item.name">{{ item.name }}</p>
                    <p class="text-xs text-slate-500 font-medium">ID: {{ item.external_id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 group/sku">
                  <span class="font-mono text-xs font-bold text-slate-500">{{ item.sku }}</span>
                  <button 
                    @click="copyToClipboard(item.sku)"
                    class="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all opacity-0 group-hover/sku:opacity-100"
                    title="Copy SKU"
                  >
                    <Check v-if="copiedSku === item.sku" class="w-3 h-3 text-emerald-500" />
                    <Copy v-else class="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-right font-black text-slate-900 dark:text-white">
                {{ item.price.currency === 'GBP' ? '£' : '$' }}{{ item.price.value.toFixed(2) }}
              </td>
              <td class="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                {{ item.stock_quantity }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider',
                  item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                ]">
                  {{ item.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="opacity-0 group-hover:opacity-100 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="View on eBay">
                  <ExternalLink class="w-4 h-4 text-slate-400" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import BaseCard from '../../../components/ui/BaseCard.vue'
import { ebayItemService, type EbayItem } from '../services/item'
import { 
  ArrowLeft, Search, RefreshCw, 
  ExternalLink, Copy, Check, ChevronDown 
} from 'lucide-vue-next'

const route = useRoute()

// State
const loading = ref(true)
const listings = ref<EbayItem[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')
const copiedSku = ref<string | null>(null)

// Static Metrics
const ebayMetrics = [
  { label: 'Seller Level', value: 'Above Standard', trend: 'Top Rated Soon', trendUp: true },
  { label: 'Monthly Sales', value: '£12,430', trend: '+14.2%', trendUp: true },
  { label: 'Active Listings', value: '1,432', trend: 'Stable', trendUp: false },
  { label: 'Feedback', value: '99.8%', trend: '4,201 total', trendUp: true },
]

// Actions
const refreshData = async () => {
  loading.value = true
  try {

    const workspaceId = route.params.workspaceId as string

    listings.value = await ebayItemService.getItems(workspaceId)
  
  } catch (err) {

    console.error('Failed to sync eBay data:', err)

  } finally {
    loading.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedSku.value = text
    setTimeout(() => { copiedSku.value = null }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Computed
const filteredListings = computed(() => {
  return listings.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hide default browser focus rings on inputs/selects to favor custom Tailwind rings */
input:focus, select:focus {
  outline: none;
}

/* Optional: Custom styling for webkit scrollbars within the table */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-700 rounded-full;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-300 dark:bg-slate-600;
}
</style>
