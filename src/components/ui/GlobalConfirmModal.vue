<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in"
      @click.self="handleCancel"
    >
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up-fade p-6 space-y-4">
        
        <div class="flex items-start gap-3">
          <div :class="[
            'p-2.5 rounded-xl shrink-0',
            options.variant === 'danger' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
            options.variant === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
          ]">
            <AlertTriangle class="w-5 h-5" />
          </div>
          
          <div class="space-y-1 min-w-0">
            <h3 class="font-black text-lg text-slate-900 dark:text-white leading-tight">
              {{ options.title }}
            </h3>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal">
              {{ options.message }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button 
            type="button" 
            @click="handleCancel" 
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition"
          >
            {{ options.cancelText }}
          </button>
          <button 
            type="button" 
            @click="handleConfirm" 
            :class="[
              'flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-sm text-white',
              options.variant === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/10' :
              options.variant === 'warning' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/10' :
              'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950'
            ]"
          >
            {{ options.confirmText }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfirm } from '../../composables/useConfirm'
import { AlertTriangle } from 'lucide-vue-next'

const { isOpen, options, handleConfirm, handleCancel } = useConfirm()
</script>
