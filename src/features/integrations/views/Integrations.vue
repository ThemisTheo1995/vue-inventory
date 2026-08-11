<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-wider">
        Integrations
      </h1>
      <p class="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1">
        Connect and manage your marketplace synchronization.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard 
        v-for="(platform, index) in platforms" 
        :key="platform.id"
        class="flex flex-col h-full group transition-all duration-300 animate-slide-up-fade"
        :style="{ animationDelay: `${index * 75}ms` }"
      >
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105',
                platform.bgClass,
                platform.borderClass
              ]"
            >
              <img v-if="platform.icon" :src="platform.icon" class="w-8 h-8 object-contain rounded-md" />
              <span v-else :class="['font-black text-xl tracking-tighter', platform.textTheme]">
                {{ platform.name.charAt(0) }}
              </span>
            </div>
            
            <div>
              <h3 class="font-bold text-xl text-slate-900 dark:text-white">
                {{ platform.name }}
              </h3>
              <div class="flex items-center gap-1.5 mt-1">
                <span 
                  :class="[
                    'w-2 h-2 rounded-full',
                    platform.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300 dark:bg-slate-600'
                  ]"
                ></span>
                <span :class="['text-xs font-bold uppercase tracking-wider', platform.connected ? 'text-emerald-500' : 'text-slate-400']">
                  {{ platform.connected ? 'Connected' : 'Disconnected' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 flex-grow mb-8 leading-relaxed">
          {{ platform.description }}
        </p>

        <div class="flex gap-2">
          <button 
            @click="handleSync(platform.id)" 
            :disabled="syncingIds.has(platform.id) || !platform.connected"
            class="flex-1 relative overflow-hidden flex justify-center items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <Spinner v-if="syncingIds.has(platform.id)" class="w-4 h-4 text-current" />
            <span class="text-sm">{{ syncingIds.has(platform.id) ? 'Syncing...' : 'Force Sync' }}</span>
            
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shine"></div>
          </button>
          
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '../../../components/ui/BaseCard.vue'
import Spinner from '../../../components/ui/Spinner.vue'

// Import icons to match Dashboard
import EbayIcon from '../../../assets/dashboard/icons/EbayIcon.webp'
import ShopifyIcon from '../../../assets/dashboard/icons/ShopifyIcon.png'
import AmazonIcon from '../../../assets/dashboard/icons/AmazonIcon.webp'
import NetsuiteIcon from '../../../assets/dashboard/icons/NetsuiteIcon.png'

interface Platform {
  id: string
  name: string
  description: string
  connected: boolean
  icon: string
  bgClass: string
  borderClass: string
  textTheme: string
}

const syncingIds = ref<Set<string>>(new Set())

const platforms = ref<Platform[]>([
  { 
    id: 'ebay', 
    name: 'eBay', 
    description: 'Sync your active listings, orders, and inventory in real-time.',
    connected: true,
    icon: EbayIcon,
    bgClass: 'bg-[#e53238]/10',
    borderClass: 'border-[#e53238]/20',
    textTheme: 'text-[#e53238]'
  },
  { 
    id: 'shopify', 
    name: 'Shopify', 
    description: 'Direct integration with your Shopify store for seamless fulfillment.',
    connected: true,
    icon: ShopifyIcon,
    bgClass: 'bg-[#95bf47]/10',
    borderClass: 'border-[#95bf47]/20',
    textTheme: 'text-[#95bf47]'
  },
  { 
    id: 'amazon', 
    name: 'Amazon', 
    description: 'Manage FBA and Merchant Fulfilled orders and stock levels.',
    connected: true,
    icon: AmazonIcon,
    bgClass: 'bg-[#ff9900]/10',
    borderClass: 'border-[#ff9900]/20',
    textTheme: 'text-[#ff9900]'
  },
  { 
    id: 'netsuite', 
    name: 'NetSuite', 
    description: 'Enterprise ERP sync for advanced accounting and stock control.',
    connected: false,
    icon: NetsuiteIcon,
    bgClass: 'bg-[#0073b1]/10',
    borderClass: 'border-[#0073b1]/20',
    textTheme: 'text-[#0073b1]'
  }
])

const handleSync = (id: string): void => {
  syncingIds.value.add(id)
  setTimeout(() => {
    syncingIds.value.delete(id)
  }, 2500)
}
</script>

<style scoped>
@keyframes shine {
  100% { transform: translateX(100%); }
}
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

.animate-shine {
  animation: shine 0.7s ease-in-out;
}

.animate-slide-up-fade {
  animation: slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
