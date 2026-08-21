<template>
  <aside
    :class="[
      'relative shrink-0 border-r-2 border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 flex-col hidden md:flex transition-all duration-300 ease-in-out z-20',
      collapsed ? 'w-20' : 'w-[260px]'
    ]"
  >
    <!-- Collapse Toggle Button -->
    <button
      @click="collapsed = !collapsed"
      class="absolute -right-3.5 top-6 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-sm transition-transform hover:scale-110 z-30"
    >
      <ChevronRight v-if="collapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <!-- Branding (Height condensed) -->
    <div :class="['h-16 flex items-center', collapsed ? 'justify-center' : 'px-5']">
      <transition name="fade" mode="out-in">
        <h2
          v-if="!collapsed"
          class="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 whitespace-nowrap"
        >
          SyncFlow<span class="text-brand-500">.</span>
        </h2>

        <h2
          v-else
          class="text-xl font-black tracking-tighter text-brand-500"
        >
          S.
        </h2>
      </transition>
    </div>

    <!-- User Profile Link -->
    <div class="mx-3 pb-3 mb-1 border-b border-slate-200 dark:border-slate-700/50">
      <!-- 
        Pass user ID if your route eventually requires it, e.g.:
        :to="{ name: 'user', params: { ...$route.params, userId: currentUser?.id } }"
      -->
      <router-link
        :to="{ name: 'workspace-user' }"
        :class="[
          'group flex items-center gap-2.5 transition-all duration-200 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer',
          collapsed ? 'justify-center' : ''
        ]"
      >
        <div
          class="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-[11px] uppercase shadow-sm select-none transition-colors group-hover:bg-brand-500/20 dark:group-hover:bg-brand-500/30"
          :title="
            collapsed && currentUser
              ? `${currentUser.first_name} ${currentUser.last_name} (${currentUser.email})`
              : undefined
          "
        >
          {{ userInitials }}
        </div>

        <div
          v-if="!collapsed && currentUser"
          class="truncate min-w-0 flex-1"
        >
          <p
            class="font-bold text-sm text-slate-900 dark:text-white truncate transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
            :title="`${currentUser.first_name} ${currentUser.last_name}`"
          >
            {{ currentUser.first_name }} {{ currentUser.last_name }}
          </p>

          <p
            class="text-[11px] text-slate-400 dark:text-slate-500 truncate font-medium mt-0.5"
            :title="currentUser.email"
          >
            {{ currentUser.email }}
          </p>
        </div>
      </router-link>
    </div>

    <!-- Navigation (Reduced padding and group spacing) -->
    <nav class="flex-1 px-3 py-1 overflow-y-auto no-scrollbar space-y-3">
      <div v-for="(group, idx) in navGroups" :key="group.id" class="space-y-0.5">
        
        <!-- Group Header / Divider -->
        <div class="px-2">
          <span 
            v-if="!collapsed" 
            class="block text-[10px] font-bold tracking-wider text-slate-400/80 dark:text-slate-500/80 uppercase select-none pb-1 pt-1.5"
          >
            {{ group.label }}
          </span>
          <hr 
            v-else-if="idx > 0" 
            class="border-slate-100 dark:border-slate-800/60 my-2"
          />
        </div>

        <!-- Group Nav Links (Tighter vertical padding) -->
        <router-link
          v-for="item in group.items"
          :key="item.name"
          :to="{ name: item.name, query: $route.query }"
          custom
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <a
            :href="href"
            @click="navigate"
            :class="[
              'group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200',
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
              isLinkActive(item.name, isActive, isExactActive)
                ? 'bg-brand-50/50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50'
            ]"
          >
            <div
              v-if="isLinkActive(item.name, isActive, isExactActive) && !collapsed"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-500 rounded-r-full"
            />

            <component
              :is="item.icon"
              :stroke-width="isLinkActive(item.name, isActive, isExactActive) ? 2.5 : 2"
              :class="[
                'w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110',
                isLinkActive(item.name, isActive, isExactActive)
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              ]"
            />

            <span v-if="!collapsed" class="truncate">
              {{ item.label }}
            </span>
          </a>
        </router-link>
      </div>
    </nav>

    <!-- Footer (Tighter padding and spacing) -->
    <div class="p-3 border-t-2 border-slate-200/70 dark:border-slate-800/70 space-y-2.5 bg-slate-50/30 dark:bg-slate-900/50">
      
      <!-- Assume UsageIndicator component scales down natively or handles its own tightness -->
      <UsageIndicator
        :collapsed="collapsed"
        :api-used="72400"
        :api-total="100000"
        :listings-used="842"
        :listings-total="1000"
      />

      <!-- Combined Footer Action Row (Slightly shorter buttons) -->
      <div :class="['gap-2', collapsed ? 'flex flex-col' : 'flex flex-row w-full']">
        <button
          @click="$emit('toggle-dark')"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :class="[
            'group flex items-center text-[13px] font-semibold rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-200 whitespace-nowrap',
            collapsed ? 'w-full justify-center p-2.5' : 'flex-1 justify-center gap-1.5 px-2 py-2'
          ]"
        >
          <component
            :is="isDark ? Sun : Moon"
            class="w-4 h-4 shrink-0 text-slate-500 group-hover:text-brand-500 transition-colors"
          />

          <span v-if="!collapsed">
            {{ isDark ? 'Light' : 'Dark' }}
          </span>
        </button>

        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          :title="collapsed ? 'Logout' : undefined"
          :class="[
            'group flex items-center justify-center text-[13px] font-semibold rounded-xl border transition-all duration-200 hover:shadow-sm whitespace-nowrap',
            collapsed ? 'w-full p-2.5' : 'flex-1 gap-1.5 px-2 py-2',
            isLoggingOut
              ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed dark:bg-slate-800/60 dark:border-slate-700/50 dark:text-slate-500'
              : 'text-red-700 bg-white border-red-200 hover:border-red-300 hover:bg-red-50 dark:text-red-400 dark:bg-red-500/5 dark:border-red-900/80 dark:hover:border-red-800 dark:hover:bg-red-500/10'
          ]"
        >
          <LogOut
            :class="[
              'w-4 h-4 shrink-0 transition-transform duration-200',
              isLoggingOut
                ? 'animate-pulse'
                : (collapsed ? 'group-hover:scale-110' : 'group-hover:-translate-x-1')
            ]"
          />

          <span v-if="!collapsed">
            {{ isLoggingOut ? '...' : 'Logout' }}
          </span>
        </button>
      </div>
    </div>
  </aside>
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
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-vue-next'

import UsageIndicator from '@/features/settings/components/UsageIndicator.vue'

defineProps<{
  isDark: boolean
}>()

defineEmits<{
  (e: 'toggle-dark'): void
}>()

const collapsed = ref(false)
const isLoggingOut = ref(false)

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
    id: 'overview',
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

const isLinkActive = (
  itemName: string,
  isActive: boolean,
  isExactActive: boolean
) => {
  if (itemName === 'dashboard') {
    return isExactActive
  }
  return isActive
}

const handleLogout = async () => {
  if (isLoggingOut.value) return

  try {
    isLoggingOut.value = true
    await authService.logout()
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
/* Hidden scrollbar functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
