<template>
  <div class="space-y-8 pb-12 animate-slide-up-fade">
    
    <div class="bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 class="font-black text-lg text-slate-900 dark:text-white tracking-tight">Plan Metrics & Usage</h3>
        <p class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Real-time status tracking for your current billing cycle.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-bold text-slate-600 dark:text-slate-300">Listings Capacity</span>
            <span class="font-black text-slate-900 dark:text-white">842 <span class="text-slate-400 font-medium">/ 1,000</span></span>
          </div>
          <div class="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden p-[2px]">
            <div 
              :style="{ width: isMounted ? '84.2%' : '0%' }"
              class="h-full bg-brand-500 rounded-full shadow-sm transition-all duration-[1200ms] ease-out"
            ></div>
          </div>
          <div class="flex justify-between text-[11px] font-medium text-slate-400">
            <span>84.2% consumed</span>
            <span>158 remaining</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-bold text-slate-600 dark:text-slate-300">API Call Allowances</span>
            <span class="font-black text-slate-900 dark:text-white">72,400 <span class="text-slate-400 font-medium">/ 100,000</span></span>
          </div>
          <div class="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden p-[2px]">
            <div 
              :style="{ width: isMounted ? '72.4%' : '0%' }"
              class="h-full bg-emerald-500 rounded-full shadow-sm transition-all duration-[1200ms] ease-out"
            ></div>
          </div>
          <div class="flex justify-between text-[11px] font-medium text-slate-400">
            <span>72.4% consumed</span>
            <span>27,600 remaining</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <h3 class="font-black text-xl text-slate-900 dark:text-white tracking-tight">Available Subscription Plans</h3>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Scale your pipeline allowances seamlessly as your marketplace store expands.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div 
          v-for="plan in displayPlans" 
          :key="plan.id"
          :class="[
            'relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border shadow-sm',
            plan.isCurrent 
              ? 'bg-white dark:bg-slate-800 border-brand-500 dark:border-brand-500 ring-4 ring-brand-500/5' 
              : 'bg-white dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600'
          ]"
        >
          <div 
            v-if="plan.isCurrent" 
            class="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-brand-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm"
          >
            Your Current Plan
          </div>

          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-black text-lg text-slate-900 dark:text-white tracking-tight">{{ plan.name }}</h4>
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{{ plan.tagline }}</p>
              </div>
              <component :is="plan.icon" :class="['w-5 h-5', plan.isCurrent ? 'text-brand-500' : 'text-slate-400']" />
            </div>

            <div class="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-700/40">
              <span v-if="typeof plan.price === 'number'" class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">£{{ plan.price }}</span>
              <span v-else class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ plan.price }}</span>
              
              <span v-if="typeof plan.price === 'number'" class="text-xs font-semibold text-slate-400 dark:text-slate-500">/ month</span>
              <span v-else class="text-xs font-semibold text-slate-400 dark:text-slate-500">bespoke rate</span>
            </div>

            <ul class="space-y-2.5 pt-2">
              <li class="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Check class="w-4 h-4 text-emerald-500 shrink-0" />
                <span v-if="plan.id !== 'custom'">Up to <strong class="font-bold text-slate-900 dark:text-white">{{ plan.limits.listings }}</strong> Listings</span>
                <span v-else><strong class="font-bold text-slate-900 dark:text-white">{{ plan.limits.listings }}</strong> Listings</span>
              </li>
              <li class="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Check class="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong class="font-bold text-slate-900 dark:text-white">{{ plan.limits.api }}</strong> Monthly API Calls</span>
              </li>
              <li 
                v-for="(feature, idx) in plan.features" 
                :key="idx" 
                class="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <Check class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/40">
            <button 
              :disabled="plan.isCurrent"
              :class="[
                'w-full py-2.5 px-4 rounded-xl font-bold text-sm transition active:scale-[0.98]',
                plan.isCurrent
                  ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed font-semibold'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-sm'
              ]"
            >
              {{ 
                plan.isCurrent 
                  ? 'Active Plan' 
                  : (typeof plan.price === 'string' 
                    ? 'Contact Support' 
                    : (plan.price > 49 ? 'Upgrade Tier' : 'Downgrade Tier')) 
              }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Check } from 'lucide-vue-next'
// Make sure this path correctly points to your constants file
import { TIER_PLANS } from '../billing-plans'

const isMounted = ref(false)

// This represents the user's current plan ID. 
// In a real app, you would fetch this from a Pinia store or API response.
const currentActivePlanId = ref('growth')

// We map over the global constant and inject the `isCurrent` property dynamically
const displayPlans = computed(() => {
  return TIER_PLANS.map(plan => ({
    ...plan,
    isCurrent: plan.id === currentActivePlanId.value
  }))
})

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 50)
})
</script>

<style scoped>
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up-fade {
  animation: slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
