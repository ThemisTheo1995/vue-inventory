<template>
  <div class="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500 relative">
    
    <!-- Left Branding Panel -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 dark:from-[#0A0A0A] dark:via-indigo-950/40 dark:to-black overflow-hidden border-r border-slate-200/50 dark:border-white/5">
      
      <!-- Animated SVG Piping Background with Indigo/Violet Glow -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g class="text-white/10" stroke="currentColor" stroke-width="4" fill="none">
          <path d="M-100,200 H250 a30,30 0 0,1 30,30 V500 a30,30 0 0,0 30,30 H900" />
          <path d="M450,-100 V350 a30,30 0 0,0 30,30 H900" />
          <path d="M-100,600 H150 a30,30 0 0,0 30,-30 V400 a30,30 0 0,1 30,-30 H350 a30,30 0 0,0 30,-30 V-100" />
          <path d="M-100,400 H100 a30,30 0 0,1 30,30 V750 a30,30 0 0,0 30,30 H900" />
          <path d="M600,900 V650 a30,30 0 0,1 30,-30 H900" />
        </g>
        <g filter="url(#glow)">
          <path class="pipe-flow-1" stroke="#818CF8" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M-100,200 H250 a30,30 0 0,1 30,30 V500 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-2" stroke="#A5B4FC" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M450,-100 V350 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-3" stroke="#C7D2FE" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60 200" d="M-100,600 H150 a30,30 0 0,0 30,-30 V400 a30,30 0 0,1 30,-30 H350 a30,30 0 0,0 30,-30 V-100" />
          <path class="pipe-flow-4" stroke="#818CF8" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="30 150" d="M-100,400 H100 a30,30 0 0,1 30,30 V750 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-5" stroke="#A5B4FC" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="50 150" d="M600,900 V650 a30,30 0 0,1 30,-30 H900" />
        </g>
        <g fill="#312E81" stroke="rgba(255,255,255,0.2)" stroke-width="2">
          <circle cx="280" cy="200" r="6" />
          <circle cx="280" cy="530" r="6" />
          <circle cx="450" cy="380" r="6" />
          <circle cx="180" cy="600" r="6" />
          <circle cx="180" cy="370" r="6" />
          <circle cx="380" cy="370" r="6" />
          <circle cx="130" cy="400" r="6" />
          <circle cx="130" cy="780" r="6" />
          <circle cx="600" cy="620" r="6" />
        </g>
      </svg>

      <!-- Content Overlay -->
      <div class="relative z-10 flex flex-col justify-between p-12 lg:p-20 w-full text-white h-full">
        
        <!-- Header / Logo -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 group">
            <div class="relative w-10 h-10 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <div class="absolute inset-0 bg-white/20 rounded-xl rounded-b-none h-1/2"></div>
              <svg class="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12L12 2L22 12"/>
                <path d="M12 2v20"/>
                <path d="M2 12h20"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <span class="text-2xl font-black tracking-tighter text-white">
              SyncFlow<span class="text-brand-600">.</span>
            </span>
          </div>
        </div>

        <!-- Center Value Proposition Card -->
        <div class="max-w-md mb-20 p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <h2 class="text-3xl font-bold mb-4 tracking-tight text-white">Streamline your integrations.</h2>
          <p class="text-slate-300 text-lg leading-relaxed">Connect your favorite platforms in seconds. SyncFlow monitors your data pipelines effortlessly.</p>
        </div>
        
        <!-- Footer copyright -->
        <div class="text-slate-400 text-sm font-medium">&copy; {{ currentYear }} SyncFlow Inc.</div>
      </div>
    </div>

    <!-- Right Form Panel -->
    <div class="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div class="w-full max-w-md space-y-8">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.pipe-flow-1 { animation: flow-1 4s linear infinite; } 
@keyframes flow-1 { to { stroke-dashoffset: -200; } }
.pipe-flow-2 { animation: flow-2 5s linear infinite; } 
@keyframes flow-2 { to { stroke-dashoffset: -200; } }
.pipe-flow-3 { animation: flow-3 6s linear infinite; } 
@keyframes flow-3 { to { stroke-dashoffset: 260; } }
.pipe-flow-4 { animation: flow-4 4.5s linear infinite; } 
@keyframes flow-4 { to { stroke-dashoffset: -180; } }
.pipe-flow-5 { animation: flow-5 3.5s linear infinite; } 
@keyframes flow-5 { to { stroke-dashoffset: -200; } }
</style>
