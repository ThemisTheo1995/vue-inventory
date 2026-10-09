<template>
  <div class="space-y-3 max-h-[340px] overflow-y-auto pr-1">

    <!-- Loading State -->
    <template v-if="isLoading">
      <div
        v-for="i in 3"
        :key="'skeleton-' + i"
        class="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center gap-4 animate-pulse"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          <div class="space-y-2">
            <div class="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div class="w-40 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
        <div class="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded shrink-0"></div>
      </div>
    </template>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="p-4 text-center border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/50 rounded-xl"
    >
      <p class="text-sm text-red-600 dark:text-red-400 mb-3">{{ error }}</p>

      <button
        @click="fetchPlans"
        class="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- API Loaded State -->
    <template v-else>
      <div
        v-for="plan in plans"
        :key="plan.id"
        @click="selectPlan(plan)"
        :class="[
          'p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center gap-4 select-none',
          modelValue === getPlanValue(plan)
            ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-900 ring-2 ring-brand-500/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'p-2 rounded-lg transition-colors',
              modelValue === getPlanValue(plan)
                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            ]"
          >
            <component
              :is="iconMap[plan.icon]"
              v-if="iconMap[plan.icon]"
              class="w-5 h-5 shrink-0"
            />
          </div>

          <div>
            <p class="font-bold text-slate-900 dark:text-white text-sm leading-snug">
              {{ plan.name }}
            </p>

            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {{ plan.tagline }}
            </p>

            <span
              class="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {{ plan.limits.listings }} listings
            </span>
          </div>
        </div>

        <div class="text-right shrink-0">
          <template v-if="typeof plan.price === 'number'">
            <span class="font-black text-slate-950 dark:text-white text-base">
              ${{ plan.price }}
            </span>
            <span class="text-xs font-normal text-slate-400 block">/mo</span>
          </template>

          <template v-else>
            <span class="font-bold text-brand-600 dark:text-brand-400 text-sm tracking-tight">
              {{ plan.price }}
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Component } from 'vue'
import { Store, Zap, Sparkles, Headphones } from 'lucide-vue-next'
import { usePlans } from '@/features/pricing/composables/usePlans'

type PlanValueKey = 'id' | 'name'

const props = withDefaults(
  defineProps<{
    modelValue: string
    valueKey?: PlanValueKey
  }>(),
  {
    valueKey: 'id'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { plans, isLoading, error, fetchPlans } = usePlans()

const iconMap: Record<string, Component> = {
  Store,
  Zap,
  Sparkles,
  Headphones
}

const getPlanValue = (plan: { id: string; name?: string }): string => {
  if (props.valueKey === 'name') {
    return plan.name?.toLowerCase() ?? plan.id
  }

  return plan.id
}

const selectPlan = (plan: { id: string; name: string }) => {
  emit('update:modelValue', getPlanValue(plan))
}

onMounted(() => {
  fetchPlans()
})
</script>
