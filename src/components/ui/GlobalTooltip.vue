<template>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div 
        v-if="tooltipState.visible"
        ref="tooltipRef"
        class="fixed top-0 left-0 z-[9999] px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-lg shadow-xl shadow-slate-900/10 dark:shadow-black/50 pointer-events-none w-max max-w-[260px] text-center border border-slate-200 dark:border-slate-800 backdrop-blur-md will-change-transform"
        :style="{ 
          transform: `translate3d(${xPos}px, ${yPos}px, 0)`
        }"
      >
        {{ tooltipState.text }}
        
        <!-- Dynamic Arrow -->
        <div 
          class="absolute w-2 h-2 bg-white dark:bg-slate-900"
          :style="{ 
            left: `${arrowX}px`,
            transform: 'translateX(-50%) rotate(45deg)',
            top: tooltipState.position === 'top' ? 'calc(100% - 4.5px)' : '-4.5px'
          }"
          :class="[
            tooltipState.position === 'top' 
              ? 'border-r border-b border-slate-200 dark:border-slate-800' 
              : 'border-l border-t border-slate-200 dark:border-slate-800'
          ]"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { tooltipState } from '@/composables/useTooltipState'

const tooltipRef = ref<HTMLElement | null>(null)

const xPos = ref(0)
const yPos = ref(0)
const arrowX = ref(0)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const updateDimensions = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateDimensions)
  updateDimensions()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
})

// Watch state changes to dynamically recalculate position (even if text changes mid-hover)
watch(
  () => [tooltipState.visible, tooltipState.text, tooltipState.x, tooltipState.y], 
  async ([isVisible]) => {
    if (!isVisible) return
    
    // Wait for the DOM to render the tooltip text at 0,0 so we can measure it accurately
    await nextTick()
    
    if (!tooltipRef.value) return

    const rect = tooltipRef.value.getBoundingClientRect()
    const padding = 12 // Min distance from viewport edge

    // 1. Calculate X
    // Start by attempting to center the tooltip perfectly over the target
    let finalX = tooltipState.x - (rect.width / 2)
    
    // Constrain X so it doesn't bleed off the left or right screen edges
    const maxRight = windowWidth.value - padding
    if (finalX < padding) {
      finalX = padding
    } else if (finalX + rect.width > maxRight) {
      finalX = maxRight - rect.width
    }

    // 2. Calculate Arrow Position
    // Arrow should strictly point to the target's center (tooltipState.x), relative to tooltip's new left edge
    let finalArrowX = tooltipState.x - finalX

    // Prevent arrow from overflowing outside the tooltip's border-radius
    const arrowPadding = 12
    if (finalArrowX < arrowPadding) finalArrowX = arrowPadding
    if (finalArrowX > rect.width - arrowPadding) finalArrowX = rect.width - arrowPadding

    // 3. Calculate Y
    let finalY = tooltipState.position === 'top' 
      ? tooltipState.y - rect.height 
      : tooltipState.y

    // Apply values to the DOM via translate3d for GPU acceleration
    xPos.value = finalX
    yPos.value = finalY
    arrowX.value = finalArrowX
  },
  { immediate: true }
)
</script>

<style scoped>
/* When the tooltip appears: fade in over 0.2s, but WAIT 0.3s first */
.tooltip-fade-enter-active {
  transition: opacity 0.2s ease-out 0.5s;
}

/* When the tooltip disappears: fade out instantly (0.15s) with NO delay */
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease-in;
}

/* The starting/ending states for opacity */
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
