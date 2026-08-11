<template>
  <div class="space-y-8 animate-fade-in">
    
    <!-- Dynamic Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <!-- Back button visible on sub-pages -->
          <router-link 
            v-if="$route.name !== 'settings'"
            :to="{ name: 'settings', params: { workspaceId: $route.params.workspaceId } }"
            class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 transition-all shadow-sm"
          >
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-wider">
            {{ $route.meta.title || 'Settings' }}
          </h1>
        </div>

        <p class="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1">
          {{ $route.meta.description || 'Manage your workspace, preferences, and account operations.' }}
        </p>
      </div>
    </div>

    <!-- Router View Injection Grid -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>
