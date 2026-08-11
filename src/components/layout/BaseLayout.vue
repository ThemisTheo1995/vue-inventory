<template>
  <div class="flex h-[100dvh] overflow-hidden bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
    
    <Sidebar :is-dark="isDark" @toggle-dark="toggleDark" />

    <SidebarMobile 
      :is-open="isSidebarMobileOpen" 
      :is-dark="isDark" 
      @close="isSidebarMobileOpen = false" 
      @toggle-dark="toggleDark" 
    />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      
      <header class="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70">
        <h2 class="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
          SyncFlow<span class="text-brand-500">.</span>
        </h2>
        <button @click="isSidebarMobileOpen = true" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
          <Menu class="w-6 h-6" />
        </button>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
        <div class="max-w-7xl mx-auto h-full">
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import SidebarMobile from './SidebarMobile.vue'
import { Menu } from 'lucide-vue-next'

const isDark = ref<boolean>(false)
const isSidebarMobileOpen = ref<boolean>(false)

const toggleDark = (): void => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
