<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div 
        v-if="state.isVisible" 
        class="fixed top-5 right-5 z-[100] flex items-start gap-3 w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl"
      >
        
        <div :class="[
          'p-2 rounded-xl shrink-0',
          state.variant === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
          state.variant === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
          state.variant === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
          'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
        ]">
          <component :is="iconComponent" class="w-5 h-5" />
        </div>

        <div class="space-y-1 min-w-0 flex-1 pt-0.5">
          <h3 v-if="state.title" class="font-black text-sm text-slate-900 dark:text-white leading-tight">
            {{ state.title }}
          </h3>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal">
            {{ state.message }}
          </p>
        </div>

        <button 
          @click="hideToast" 
          class="p-1.5 -mr-1.5 -mt-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition shrink-0"
        >
          <X class="w-4 h-4" />
        </button>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '../../composables/useToast'
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'

const { state, hideToast } = useToast()

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
  transform: translateX(100px); /* Smooth slide in from the right edge */
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* Smooth fade up and away */
}
</style>
