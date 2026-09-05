<!-- MainLayout.vue -->
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
      
      <header class="sticky top-0 z-30 flex items-center px-4 md:px-8 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        
        <!-- Mobile Logo & Drawer Trigger (Left side) -->
        <div class="flex items-center gap-3 md:hidden shrink-0">
          <button @click="isSidebarMobileOpen = true" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            <Menu class="w-6 h-6" />
          </button>
          <h2 class="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            SyncFlow<span class="text-brand-500">.</span>
          </h2>
        </div>

        <!-- Global Search Component (Centered) -->
        <div class="flex-1 flex justify-center w-full">
          <div class="w-full max-w-md ml-auto md:mx-auto">
            <GlobalSearch v-if="hasWorkspace" />
          </div>
        </div>
        
        <!-- Optional: Right side empty div to perfectly balance flex on desktop if needed later -->
        <!-- <div class="hidden md:block w-8 shrink-0"></div> -->
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

    <!-- Global Floating Quick Notes Widget -->
    <NotesView v-if="hasWorkspace" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import SidebarMobile from './SidebarMobile.vue'
import NotesView from '@/features/notes/views/NotesView.vue'
import GlobalSearch from '@/features/search/components/GlobalSearch.vue'
import { Menu } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref<boolean>(false)
const isSidebarMobileOpen = ref<boolean>(false)

// Only show workspace features if inside a workspace route
const hasWorkspace = computed(() => !!route.params.workspaceId)

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
