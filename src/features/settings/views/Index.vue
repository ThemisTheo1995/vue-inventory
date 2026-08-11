<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    
    <router-link 
      v-for="(card, index) in navigationCards" 
      :key="card.to"
      :to="card.to"
      class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/70 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 p-6 block cursor-pointer animate-slide-up-fade"
      :style="{ animationDelay: `${index * 75}ms` }"
    >
      <!-- Card Hover Background Gradient -->
      <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <!-- Card Content Wrapper -->
      <div class="relative z-10 flex flex-col h-full justify-between">
        
        <!-- Top Section: Icon and Text -->
        <div>
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-all duration-300">
            <component :is="card.icon" class="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
          </div>
          
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {{ card.title }}
          </h3>
          
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ card.description }}
          </p>
        </div>

        <!-- Bottom Section: Pushed to the Right -->
        <div class="mt-6 flex justify-end">
          <div class="flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
            Manage <ArrowRight class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>
    </router-link>

  </div>
</template>

<script setup lang="ts">
import { Building2, Users, CreditCard, ArrowRight } from 'lucide-vue-next'

const navigationCards = [
  {
    to: 'settings/contact',
    title: 'Company Profile',
    description: 'Manage your primary business details, support emails, and public contact coordinates.',
    icon: Building2
  },
  {
    to: 'settings/permissions',
    title: 'Team & Permissions',
    description: 'Control who has workspace access, add stakeholders, and coordinate operational roles.',
    icon: Users
  },
  {
    to: 'settings/billing',
    title: 'Billing & Usage',
    description: 'Review system allocations, check structural quotas, and maintain payment logs.',
    icon: CreditCard
  }
]
</script>

<style scoped>
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-fade {
  /* 'both' ensures the cards stay invisible (opacity 0) before their delay triggers */
  animation: slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
