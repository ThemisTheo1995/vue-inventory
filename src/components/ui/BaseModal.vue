<template>
  <Teleport to="body">
    <Transition name="modal">
      <!-- Removed @click.self so clicking outside does nothing -->
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
      >
        <div 
          class="modal-card w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
          :class="maxWidthClass"
        >
          
          <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div v-if="$slots.icon" class="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
                <slot name="icon"></slot>
              </div>
              
              <div>
                <h3 class="font-black text-lg text-slate-900 dark:text-white">
                  {{ title }}
                </h3>
                <p v-if="description" class="text-xs font-medium text-slate-400 mt-0.5">
                  {{ description }}
                </p>
              </div>
            </div>
            
            <!-- X Button (Always closes) -->
            <button 
              @click="handleClose" 
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="p-6 pt-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 shrink-0">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  description?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl'
}>(), {
  maxWidth: 'lg'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

// Escape key (Always closes)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const maxWidthClass = computed(() => {
  const map: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl'
  }
  return map[props.maxWidth] || 'max-w-lg'
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
