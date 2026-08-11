<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-wider">
        Overview
      </h1>
      <p class="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1">
        Monitor and manage your connected platforms.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <component
        :is="platform.status === 'active' ? 'router-link' : 'div'"
        v-for="(platform, index) in platforms"
        :key="platform.id"
        :to="platform.status === 'active' ? { 
          name: 'integration-detail', 
          params: { id: platform.id }, 
          query: $route.query 
        } : undefined"
        class="block outline-none animate-slide-up-fade rounded-2xl transition-all"
        :class="[platform.status === 'active' ? 'cursor-pointer' : 'cursor-default']"
        :style="{ animationDelay: `${index * 75}ms` }"
      >
        <BaseCard :class="[platform.status === 'inactive' ? 'opacity-70 grayscale-[0.6] bg-slate-50/50 dark:bg-slate-800/40' : '']">
          
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 shadow-sm border border-white/20',
                  platform.colorClass
                ]"
              >
                <img
                  :src="platform.icon"
                  :alt="`${platform.name} icon`"
                  class="w-7 h-7 object-contain drop-shadow-sm rounded-md"
                />
              </div>

              <div>
                <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {{ platform.name }}
                </h3>
              </div>
            </div>

            <span 
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-colors',
                platform.status === 'active' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-500'
              ]"
            >
              <span class="relative flex h-2 w-2">
                <span v-if="platform.status === 'active'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span :class="['relative inline-flex rounded-full h-2 w-2', platform.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600']"></span>
              </span>
              {{ platform.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="mt-auto pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            
            <div class="flex flex-col">
              <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Synced</span>
              <div class="text-sm">
                <span class="font-black text-slate-900 dark:text-white text-base mr-1">
                  {{ platform.itemsSynced }}
                </span>
                <span class="text-slate-500 dark:text-slate-400">items</span>
              </div>
            </div>

            <div class="flex flex-col items-end text-right">
              <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Last Update</span>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ platform.lastSynced }}
              </span>
            </div>

          </div>

        </BaseCard>
      </component>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '../../../components/ui/BaseCard.vue'
import EbayIcon from '../../../assets/dashboard/icons/EbayIcon.webp'
import ShopifyIcon from '../../../assets/dashboard/icons/ShopifyIcon.png'
import AmazonIcon from '../../../assets/dashboard/icons/AmazonIcon.webp'
import NetsuiteIcon from '../../../assets/dashboard/icons/NetsuiteIcon.png'

interface Platform {
  id: string
  name: string
  itemsSynced: string
  icon: string
  colorClass: string
  lastSynced: string
  status: 'active' | 'inactive'
}

const platforms = ref<Platform[]>([
  { 
    id: 'ebay', 
    name: 'eBay', 
    itemsSynced: '1,432', 
    icon: EbayIcon,
    colorClass: 'bg-[#e53238] text-[#e53238]',
    lastSynced: '12:34 PM',
    status: 'active'
  },
  { 
    id: 'shopify', 
    name: 'Shopify', 
    itemsSynced: '854', 
    icon: ShopifyIcon,
    colorClass: 'bg-[#95bf47] text-[#95bf47]',
    lastSynced: '11:20 AM',
    status: 'inactive'
  },
  { 
    id: 'amazon', 
    name: 'Amazon', 
    itemsSynced: '1,234', 
    icon: AmazonIcon,
    colorClass: 'bg-[#ff9900] text-[#ff9900]',
    lastSynced: '10:15 AM',
    status: 'inactive'
  },
  { 
    id: 'netsuite', 
    name: 'NetSuite', 
    itemsSynced: '567', 
    icon: NetsuiteIcon,
    colorClass: 'bg-[#0073b1] text-[#0073b1]',
    lastSynced: '09:00 AM',
    status: 'inactive'
  }
])
</script>

<style scoped>
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-fade {
  animation: slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
