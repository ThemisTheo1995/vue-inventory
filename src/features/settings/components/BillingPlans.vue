<template>
  <div class="space-y-3 max-h-[340px] overflow-y-auto pr-1 ">
    <div 
      v-for="plan in TIER_PLANS" 
      :key="plan.id"
      @click="$emit('update:modelValue', plan.id)" 
      :class="[
        'p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center gap-4 select-none', 
        modelValue === plan.id 
          ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-950/20 ring-2 ring-brand-500/10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      ]"
    >
      <div class="flex items-center gap-3">
        <div 
          :class="[
            'p-2 rounded-lg transition-colors', 
            modelValue === plan.id 
              ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' 
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          ]"
        >
          <component :is="plan.icon" class="w-5 h-5 shrink-0" />
        </div>
        <div>
          <p class="font-bold text-slate-900 dark:text-white text-sm leading-snug">{{ plan.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{{ plan.tagline }}</p>
          <span class="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {{ plan.limits.listings }} listings
          </span>
        </div>
      </div>

      <div class="text-right shrink-0">
        <template v-if="typeof plan.price === 'number'">
          <span class="font-black text-slate-950 dark:text-white text-base">${{ plan.price }}</span>
          <span class="text-xs font-normal text-slate-400 block">/mo</span>
        </template>
        <template v-else>
          <span class="font-bold text-brand-600 dark:text-brand-400 text-sm tracking-tight">{{ plan.price }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TIER_PLANS } from '../billing-plans'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
