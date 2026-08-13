<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 md:hidden flex">
    <div 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>
    
    <aside class="relative w-72 h-full bg-white dark:bg-slate-800 flex flex-col shadow-2xl animate-slide-in rounded-r-2xl border-r border-slate-200/50 dark:border-slate-700/50">
      
      <!-- Header / Branding -->
      <div class="p-6 flex items-center justify-between">
        <h2 class="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
          SyncFlow<span class="text-brand-500">.</span>
        </h2>
        <button @click="$emit('close')" class="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- User Profile Block -->
      <div class="mx-6 pb-4 mb-2 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
        <div class="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase shadow-sm select-none">
          {{ userInitials }}
        </div>

        <div v-if="currentUser" class="truncate min-w-0 flex-1">
          <p class="font-bold text-sm text-slate-900 dark:text-white truncate">
            {{ currentUser.first_name }} {{ currentUser.last_name }}
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">
            {{ currentUser.email }}
          </p>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 px-4 py-2 space-y-4 overflow-y-auto no-scrollbar">
        <div v-for="group in navGroups" :key="group.id" class="space-y-1">
          <!-- Group Header -->
          <span class="block text-[10px] font-bold tracking-wider text-slate-400/80 dark:text-slate-500/80 uppercase select-none px-4 pb-1 pt-2">
            {{ group.label }}
          </span>

          <!-- Group Items -->
          <router-link 
            v-for="item in group.items" 
            :key="item.name" 
            :to="{ name: item.name, query: $route.query }" 
            custom
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <a 
              :href="href" 
              @click="(e) => { navigate(e); $emit('close'); }" 
              :class="[
                'group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isLinkActive(item.name, isActive, isExactActive) 
                  ? 'bg-brand-50/50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700/50'
              ]"
            >
              <component 
                :is="item.icon" 
                :stroke-width="isLinkActive(item.name, isActive, isExactActive) ? 2.5 : 2" 
                :class="[
                  'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                  isLinkActive(item.name, isActive, isExactActive) 
                    ? 'text-brand-600 dark:text-brand-400' 
                    : 'text-slate-400 group-hover:text-brand-500 dark:group-hover:text-slate-300'
                ]" 
              />
              <span class="truncate">{{ item.label }}</span>
            </a>
          </router-link>
        </div>
      </nav>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/50">
        <div class="flex gap-2 w-full">
          <button @click="$emit('toggle-dark')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-slate-700 dark:text-slate-300">
            <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
            {{ isDark ? 'Light' : 'Dark' }}
          </button>

          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 hover:shadow-sm',
              isLoggingOut
                ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed dark:bg-slate-800/60 dark:border-slate-700/50 dark:text-slate-500'
                : 'text-red-700 bg-white border-red-200 hover:border-red-300 hover:bg-red-50 dark:text-red-400 dark:bg-red-500/5 dark:border-red-900/80 dark:hover:border-red-800 dark:hover:bg-red-500/10'
            ]"
          >
            <LogOut :class="['w-4 h-4 shrink-0 transition-transform duration-200', isLoggingOut ? 'animate-pulse' : 'group-hover:-translate-x-1']" />
            {{ isLoggingOut ? '...' : 'Logout' }}
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/features/auth/services/auth.store'
import { authService } from '@/features/auth/services/auth.service'
import { 
  LayoutDashboard, 
  FileDown, 
  FileUp, 
  Tag, 
  Package, 
  Users, 
  Truck,
  Settings, 
  Moon, 
  Sun, 
  X, 
  LogOut 
} from 'lucide-vue-next'

defineProps<{ isOpen: boolean; isDark: boolean }>()
defineEmits<{ (e: 'close'): void; (e: 'toggle-dark'): void }>()

const isLoggingOut = ref<boolean>(false)

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const userInitials = computed(() => {
  if (!currentUser.value) return '??'

  return (
    currentUser.value.first_name.charAt(0) +
    currentUser.value.last_name.charAt(0)
  ).toUpperCase()
})

const navGroups = [
  {
    id: 'general',
    label: 'Overview',
    items: [
      { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    id: 'erp',
    label: 'ERP Modules',
    items: [
      { name: 'purchase-orders', label: 'Purchase Orders', icon: FileDown },
      { name: 'sell-orders', label: 'Sell Orders', icon: FileUp },
      { name: 'items', label: 'Items', icon: Tag },
      { name: 'inventory', label: 'Inventory', icon: Package }
    ]
  },
  {
    id: 'partners',
    label: 'Partners',
    items: [
      { name: 'customers', label: 'Customers', icon: Users },
      { name: 'suppliers', label: 'Suppliers', icon: Truck }
    ]
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { name: 'settings', label: 'Settings', icon: Settings }
    ]
  }
]

const isLinkActive = (itemName: string, isActive: boolean, isExactActive: boolean): boolean => {
  if (itemName === 'dashboard') {
    return isExactActive
  }
  return isActive
}

const handleLogout = async () => {
  if (isLoggingOut.value) return 
  isLoggingOut.value = true
  try {
    await authService.logout()
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in {
  animation: slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
