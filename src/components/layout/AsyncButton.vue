<!-- src/components/layout/AsyncButton.vue -->
<template>
  <button
    :disabled="isPending || disabled"
    @click="handleClick"
    class="inline-flex items-center justify-center cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      v-if="isPending"
      class="absolute w-5 h-5 animate-spin text-current"
      viewBox="0 0 50 50"
    >
      <circle
        class="stroke-current animate-dash"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="5"
      />
    </svg>

    <span
      :class="[
        'flex items-center gap-2',
        { 'opacity-0': isPending }
      ]"
    >
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  action: (event: MouseEvent) => Promise<unknown> | void
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const isPending = ref<boolean>(false)

const handleClick = async (event: MouseEvent): Promise<void> => {
  if (isPending.value || props.disabled) return

  isPending.value = true
  try {
    await props.action(event)
  } catch (error) {
    console.error("Button action failed:", error)
  } finally {
    isPending.value = false
  }
}
</script>

<style scoped>
@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

.animate-spin {
  animation: rotate 2s linear infinite;
}

.animate-dash {
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
}
</style>
