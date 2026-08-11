<template>
  <div :class="['animate-pulse bg-slate-200/70 dark:bg-slate-700/50 rounded-lg', height, width]"></div>
</template>

<script setup lang="ts">
interface Props {
  height?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  height: 'h-4',
  width: 'w-full'
})
</script>
