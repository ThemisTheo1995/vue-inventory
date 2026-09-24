<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500 overflow-hidden">
    
    <!-- Subtle Background Glows for Visual Depth -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-sm lg:max-w-lg relative z-10 flex flex-col items-center">
      
      <!-- Brand Logo Header -->
      <div class="mb-8 flex items-center gap-3">
        <span class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Aegis<span class="text-indigo-600 dark:text-indigo-400">.</span>
        </span>
      </div>

      <!-- Elevated Rounded Card Container -->
      <div class="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-200/60 dark:shadow-black/60 backdrop-blur-xl">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>
      </div>

      <!-- Footer Note -->
      <div class="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
        &copy; {{ currentYear }} Aegis Inc. All rights reserved.
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

// Sync theme with main app on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark) || (savedTheme === 'system' && prefersDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.99);
}
</style>
