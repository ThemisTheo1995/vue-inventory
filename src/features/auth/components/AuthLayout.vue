<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-500 to-brand-900 dark:from-brand-700 dark:to-slate-900 overflow-hidden">
      
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
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
          <path class="pipe-flow-1" stroke="#93C5FD" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M-100,200 H250 a30,30 0 0,1 30,30 V500 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-2" stroke="#60A5FA" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M450,-100 V350 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-3" stroke="#BFDBFE" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60 200" d="M-100,600 H150 a30,30 0 0,0 30,-30 V400 a30,30 0 0,1 30,-30 H350 a30,30 0 0,0 30,-30 V-100" />
          <path class="pipe-flow-4" stroke="#93C5FD" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="30 150" d="M-100,400 H100 a30,30 0 0,1 30,30 V750 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-5" stroke="#60A5FA" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="50 150" d="M600,900 V650 a30,30 0 0,1 30,-30 H900" />
        </g>
        <g fill="#1E3A8A" stroke="rgba(255,255,255,0.3)" stroke-width="2">
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

      <div class="relative z-10 flex flex-col justify-between p-12 lg:p-20 w-full text-white h-full">
        <div>
          <h1 class="text-4xl font-black tracking-tighter drop-shadow-md">SyncFlow<span class="text-brand-300">.</span></h1>
        </div>
        <div class="max-w-md mb-20 p-8 rounded-3xl bg-black/50 backdrop-blur-md shadow-2xl">
          <h2 class="text-3xl font-bold mb-4 tracking-tight text-white drop-shadow-sm">Streamline your integrations.</h2>
          <p class="text-white/90 text-lg leading-relaxed drop-shadow-sm">Connect your favorite platforms in seconds. SyncFlow monitors your data pipelines effortlessly.</p>
        </div>
        <div class="text-white/60 text-sm font-medium drop-shadow-sm">&copy; {{ new Date().getFullYear() }} SyncFlow Inc.</div>
      </div>
    </div>

    <div class="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-8">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

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
