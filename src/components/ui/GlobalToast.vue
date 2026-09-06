<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div 
        v-if="state.isVisible" 
        @mouseenter="pauseToast"
        @mouseleave="resumeToast"
        class="fixed overflow-hidden top-4 left-4 right-4 sm:left-auto sm:right-5 sm:top-5 z-[100] flex items-start gap-2.5 sm:gap-3 w-auto sm:w-full sm:max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl"
      >
        
        <div :class="[
          'p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0',
          state.variant === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
          state.variant === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
          state.variant === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
          'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
        ]">
          <component :is="iconComponent" class="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div class="space-y-0.5 sm:space-y-1 min-w-0 flex-1 pt-0.5 pb-1">
          <h3 v-if="state.title" class="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight break-words whitespace-normal">
            {{ state.title }}
          </h3>
          <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal break-words whitespace-normal">
            {{ state.message }}
          </p>
        </div>

        <button 
          @click="hideToast" 
          class="p-1 -mr-1 -mt-1 sm:-mr-1.5 sm:-mt-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition shrink-0"
        >
          <X class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <!-- Progress Bar / Timer -->
        <div 
          class="absolute bottom-0 left-0 h-1 transition-none"
          :class="[
            state.variant === 'error' ? 'bg-red-500 dark:bg-red-400' :
            state.variant === 'warning' ? 'bg-amber-500 dark:bg-amber-400' :
            state.variant === 'success' ? 'bg-emerald-500 dark:bg-emerald-400' :
            'bg-blue-500 dark:bg-blue-400'
          ]"
          :style="{ width: `${state.progress}%` }"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '../../composables/useToast'
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'

const { state, hideToast, pauseToast, resumeToast } = useToast()

const iconComponent = computed(() => {
  switch (state.value.variant) {
    case 'error': return AlertCircle
    case 'success': return CheckCircle2
    case 'warning': return AlertTriangle
    default: return Info
  }
})
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

@media (min-width: 640px) {
  .toast-slide-enter-from {
    opacity: 0;
    transform: translateX(100px);
  }
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
